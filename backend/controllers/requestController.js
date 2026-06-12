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
    // Logged-in teacher ID from JWT middleware
    const teacherId = req.user.id;

    // Request data from frontend
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

    // Connect to MSSQL
    const pool = await poolPromise;

    // Generate unique request number
    const requestNumber = `REQ-${Date.now()}`;

    // ============================================
    // Get subject name from selected SubjectId
    // Example: SubjectId 1 => English
    // ============================================
    const subjectResult = await pool
      .request()
      .input("subjectId", sql.Int, subjectId)
      .query(`
        SELECT SubjectName
        FROM Subjects
        WHERE SubjectId = @subjectId
          AND IsActive = 1
      `);

    const subjectName = subjectResult.recordset[0]?.SubjectName;

    if (!subjectName) {
      return res.status(400).json({
        message: "Selected subject was not found or is inactive",
      });
    }

    // ============================================
    // Find correct HOD using:
    // DepartmentId + SubjectName
    //
    // Example:
    // Department = Primary
    // Subject = English
    // Approver = Primary English HOD
    // ============================================
    const hodResult = await pool
      .request()
      .input("departmentId", sql.Int, departmentId)
      .input("subjectName", sql.NVarChar, subjectName)
      .query(`
        SELECT TOP 1 UserId
        FROM Users
        WHERE Role = 'HOD'
          AND DepartmentId = @departmentId
          AND Subject = @subjectName
          AND IsActive = 1
        ORDER BY UserId ASC
      `);

    const hodId = hodResult.recordset[0]?.UserId;

    // Stop if no matching HOD exists
    if (!hodId) {
      return res.status(400).json({
        message: `No active HOD found for ${subjectName} in the selected department`,
      });
    }

    // ============================================
    // Insert main photocopy request
    // New requests always start with HOD approval
    // ============================================
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
      .input("approverId", sql.Int, hodId)
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

    // ============================================
    // Insert first approval step for HOD
    // ============================================
    await pool
      .request()
      .input("requestId", sql.Int, requestId)
      .input("approverId", sql.Int, hodId)
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
          'HOD',
          'Pending',
          NULL,
          GETDATE()
        )
      `);

    return res.status(201).json({
      message: "Request created successfully",
      requestId,
      requestNumber,
      approvalRole: "HOD",
      approverId: hodId,
      subjectName,
    });
  } catch (error) {
    console.error("Create Request Error:", error);

    return res.status(500).json({
      message: "Server error while creating request",
      error: error.message,
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
    // Logged-in teacher ID
    const teacherId = req.user.id;

    // Connect to MSSQL
    const pool = await poolPromise;

    // Get teacher requests
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
        LEFT JOIN Departments d 
          ON r.DepartmentId = d.DepartmentId
        LEFT JOIN Subjects s 
          ON r.SubjectId = s.SubjectId
        LEFT JOIN Purposes p 
          ON r.PurposeId = p.PurposeId
        WHERE r.TeacherId = @teacherId
        ORDER BY r.SubmittedAt DESC
      `);

    return res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Get My Requests Error:", error);

    return res.status(500).json({
      message: "Server error while fetching requests",
      error: error.message,
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
    // Request ID from URL
    const requestId = req.params.id;

    // Connect to MSSQL
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
        LEFT JOIN Users u 
          ON r.TeacherId = u.UserId
        LEFT JOIN Departments d 
          ON r.DepartmentId = d.DepartmentId
        LEFT JOIN Subjects s 
          ON r.SubjectId = s.SubjectId
        LEFT JOIN Purposes p 
          ON r.PurposeId = p.PurposeId
        WHERE r.RequestId = @requestId
      `);

    const request = requestResult.recordset[0];

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    // Get approval history
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
        LEFT JOIN Users u 
          ON a.ApproverId = u.UserId
        WHERE a.RequestId = @requestId
        ORDER BY a.ActionDate ASC
      `);

    // Get attachments
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
      error: error.message,
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
    // Logged-in teacher ID
    const teacherId = req.user.id;

    // Connect to MSSQL
    const pool = await poolPromise;

    // Get dashboard stats
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

    // Get recent requests
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
        LEFT JOIN Departments d 
          ON r.DepartmentId = d.DepartmentId
        LEFT JOIN Subjects s 
          ON r.SubjectId = s.SubjectId
        LEFT JOIN Purposes p 
          ON r.PurposeId = p.PurposeId
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