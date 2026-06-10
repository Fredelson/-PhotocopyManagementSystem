// ============================================
// ARAB UNITY SCHOOL
// Photocopy Request Controller
// Handles creating and reading photocopy requests
// ============================================

const { poolPromise, sql } = require("../config/db");

/**
 * @desc    Create a new photocopy request
 * @route   POST /api/requests
 * @access  Private - Teacher / SuperAdmin
 */
const createRequest = async (req, res) => {
  try {
    // Logged-in user ID comes from JWT middleware
    const teacherId = req.user.id;

    // Get request data from frontend / Thunder Client body
    const {
      departmentId,
      subjectId,
      purposeId,
      copies,
      totalPages,
      totalSheets,
      priorityLevel,
    } = req.body;

    // Validate required fields
    if (
      !departmentId ||
      !subjectId ||
      !purposeId ||
      !copies ||
      !totalPages ||
      !totalSheets
    ) {
      return res.status(400).json({
        message: "Required request fields are missing",
      });
    }

    const pool = await poolPromise;

    // Generate unique request number
    const requestNumber = `REQ-${Date.now()}`;

    // Approval workflow:
    // 500 sheets or below goes to HOD
    // More than 500 sheets goes to HOS
    const approvalRole = Number(totalSheets) > 500 ? "HOS" : "HOD";

    // First try to find approver from the same department
    const approverResult = await pool
      .request()
      .input("approvalRole", sql.NVarChar, approvalRole)
      .input("departmentId", sql.Int, departmentId)
      .query(`
        SELECT TOP 1 UserId
        FROM Users
        WHERE Role = @approvalRole
          AND DepartmentId = @departmentId
          AND IsActive = 1
        ORDER BY UserId ASC
      `);

    let approverId = approverResult.recordset[0]?.UserId;

    // Fallback: if no same-department approver exists,
    // use any active approver with the required role
    if (!approverId) {
      const fallbackApproverResult = await pool
        .request()
        .input("approvalRole", sql.NVarChar, approvalRole)
        .query(`
          SELECT TOP 1 UserId
          FROM Users
          WHERE Role = @approvalRole
            AND IsActive = 1
          ORDER BY UserId ASC
        `);

      approverId = fallbackApproverResult.recordset[0]?.UserId;
    }

    // Stop request creation if no approver exists
    if (!approverId) {
      return res.status(400).json({
        message: `No active ${approvalRole} approver found`,
      });
    }

    // Insert the main photocopy request
    const requestResult = await pool
      .request()
      .input("requestNumber", sql.NVarChar, requestNumber)
      .input("teacherId", sql.Int, teacherId)
      .input("departmentId", sql.Int, departmentId)
      .input("subjectId", sql.Int, subjectId)
      .input("purposeId", sql.Int, purposeId)
      .input("copies", sql.Int, copies)
      .input("totalPages", sql.Int, totalPages)
      .input("totalSheets", sql.Int, totalSheets)
      .input("priorityLevel", sql.NVarChar, priorityLevel || "Normal")
      .input("approverId", sql.Int, approverId)
      .query(`
        INSERT INTO PhotocopyRequests
        (
          RequestNumber,
          TeacherId,
          DepartmentId,
          SubjectId,
          PurposeId,
          Copies,
          TotalPages,
          TotalSheets,
          PriorityLevel,
          Status,
          CurrentApproverId,
          SubmittedAt
        )
        OUTPUT INSERTED.RequestId
        VALUES
        (
          @requestNumber,
          @teacherId,
          @departmentId,
          @subjectId,
          @purposeId,
          @copies,
          @totalPages,
          @totalSheets,
          @priorityLevel,
          'Pending',
          @approverId,
          GETDATE()
        )
      `);

    const requestId = requestResult.recordset[0].RequestId;

    // Insert the first approval step
    await pool
      .request()
      .input("requestId", sql.Int, requestId)
      .input("approverId", sql.Int, approverId)
      .input("approvalRole", sql.NVarChar, approvalRole)
      .query(`
        INSERT INTO RequestApprovals
        (
          RequestId,
          ApproverId,
          ApprovalRole,
          ApprovalStatus,
          Remarks,
          ActionDate
        )
        VALUES
        (
          @requestId,
          @approverId,
          @approvalRole,
          'Pending',
          NULL,
          GETDATE()
        )
      `);

    return res.status(201).json({
      message: "Request created successfully",
      requestId,
      requestNumber,
      approvalRole,
      approverId,
    });
  } catch (error) {
    console.error("Create Request Error:", error);

    return res.status(500).json({
      message: "Server error while creating request",
    });
  }
};

/**
 * @desc    Get logged-in teacher's own requests
 * @route   GET /api/requests/my-requests
 * @access  Private - Teacher / SuperAdmin
 */
const getMyRequests = async (req, res) => {
  try {
    // Logged-in user ID from JWT middleware
    const teacherId = req.user.id;

    const pool = await poolPromise;

    // Get all requests created by the logged-in user
    const result = await pool
      .request()
      .input("teacherId", sql.Int, teacherId)
      .query(`
        SELECT
          r.RequestId,
          r.RequestNumber,
          r.Copies,
          r.TotalPages,
          r.TotalSheets,
          r.PriorityLevel,
          r.Status,
          r.SubmittedAt,
          d.DepartmentName,
          s.SubjectName,
          p.PurposeName
        FROM PhotocopyRequests r
        LEFT JOIN Departments d ON r.DepartmentId = d.DepartmentId
        LEFT JOIN Subjects s ON r.SubjectId = s.SubjectId
        LEFT JOIN Purposes p ON r.PurposeId = p.PurposeId
        WHERE r.TeacherId = @teacherId
        ORDER BY r.SubmittedAt DESC
      `);

    return res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Get My Requests Error:", error);

    return res.status(500).json({
      message: "Server error while fetching requests",
    });
  }
};

/**
 * @desc    Get request details by request ID
 * @route   GET /api/requests/:id
 * @access  Private
 */
const getRequestById = async (req, res) => {
  try {
    // Request ID from URL parameter
    const requestId = req.params.id;

    const pool = await poolPromise;

    // Get main request details
    const requestResult = await pool
      .request()
      .input("requestId", sql.Int, requestId)
      .query(`
        SELECT
          r.*,
          u.FullName AS TeacherName,
          u.EmployeeId,
          d.DepartmentName,
          s.SubjectName,
          p.PurposeName
        FROM PhotocopyRequests r
        LEFT JOIN Users u ON r.TeacherId = u.UserId
        LEFT JOIN Departments d ON r.DepartmentId = d.DepartmentId
        LEFT JOIN Subjects s ON r.SubjectId = s.SubjectId
        LEFT JOIN Purposes p ON r.PurposeId = p.PurposeId
        WHERE r.RequestId = @requestId
      `);

    const request = requestResult.recordset[0];

    // Return 404 if request does not exist
    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    // Get approval history for this request
    const approvalResult = await pool
      .request()
      .input("requestId", sql.Int, requestId)
      .query(`
        SELECT
          a.ApprovalId,
          a.RequestId,
          a.ApproverId,
          u.FullName AS ApproverName,
          a.ApprovalRole,
          a.ApprovalStatus,
          a.Remarks,
          a.ActionDate
        FROM RequestApprovals a
        LEFT JOIN Users u ON a.ApproverId = u.UserId
        WHERE a.RequestId = @requestId
        ORDER BY a.ActionDate ASC
      `);

    // Get attachments for this request
    const attachmentResult = await pool
      .request()
      .input("requestId", sql.Int, requestId)
      .query(`
        SELECT *
        FROM RequestAttachments
        WHERE RequestId = @requestId
        ORDER BY UploadedAt ASC
      `);

    return res.status(200).json({
      request,
      approvals: approvalResult.recordset,
      attachments: attachmentResult.recordset,
    });
  } catch (error) {
    console.error("Get Request By ID Error:", error);

    return res.status(500).json({
      message: "Server error while fetching request details",
    });
  }
};

/**
 * @desc    Get logged-in teacher dashboard stats
 * @route   GET /api/requests/dashboard
 * @access  Private - Teacher / SuperAdmin
 */
const getTeacherDashboard = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const pool = await poolPromise;

    const statsResult = await pool
      .request()
      .input("teacherId", sql.Int, teacherId)
      .query(`
        SELECT
          COUNT(*) AS TotalRequests,
          SUM(CASE WHEN Status = 'Pending' THEN 1 ELSE 0 END) AS PendingRequests,
          SUM(CASE WHEN Status LIKE 'Approved%' THEN 1 ELSE 0 END) AS ApprovedRequests,
          SUM(CASE WHEN Status LIKE 'Rejected%' THEN 1 ELSE 0 END) AS RejectedRequests,
          SUM(CASE WHEN Status = 'Completed' THEN 1 ELSE 0 END) AS CompletedRequests
        FROM PhotocopyRequests
        WHERE TeacherId = @teacherId
      `);

    const recentResult = await pool
      .request()
      .input("teacherId", sql.Int, teacherId)
      .query(`
        SELECT TOP 5
          r.RequestId,
          r.RequestNumber,
          r.TotalSheets,
          r.PriorityLevel,
          r.Status,
          r.SubmittedAt,
          d.DepartmentName,
          s.SubjectName,
          p.PurposeName
        FROM PhotocopyRequests r
        LEFT JOIN Departments d ON r.DepartmentId = d.DepartmentId
        LEFT JOIN Subjects s ON r.SubjectId = s.SubjectId
        LEFT JOIN Purposes p ON r.PurposeId = p.PurposeId
        WHERE r.TeacherId = @teacherId
        ORDER BY r.SubmittedAt DESC
      `);

    return res.status(200).json({
      stats: statsResult.recordset[0],
      recentRequests: recentResult.recordset,
    });
  } catch (error) {
    console.error("Get Teacher Dashboard Error:", error);

    return res.status(500).json({
      message: "Server error while fetching teacher dashboard",
      error: error.message,
    });
  }
};

module.exports = {
  createRequest,
  getTeacherDashboard,
  getMyRequests,
  getRequestById,
};