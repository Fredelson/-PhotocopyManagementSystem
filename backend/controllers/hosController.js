// ============================================
// ARAB UNITY SCHOOL
// HOS Controller
// Handles HOS dashboard, request review,
// approval history, approve, and reject
// ============================================

const { poolPromise, sql } = require("../config/db");

// ============================================
// Shared HOS pending statuses
// Supports old and new status names
// ============================================
const HOS_PENDING_STATUSES = `
  'Forwarded to HOS',
  'Pending HOS Approval'
`;

/**
 * @desc    HOS Dashboard Statistics
 * @route   GET /api/hos/dashboard
 * @access  Private - HOS / SuperAdmin
 */
const getHosDashboard = async (req, res) => {
  try {
    // Logged-in HOS ID from JWT token
    const hosId = req.user.id;

    // Connect to MSSQL database
    const pool = await poolPromise;

    // Count requests assigned to this HOS or already acted by this HOS
    const result = await pool
      .request()
      .input("hosId", sql.Int, hosId)
      .query(`
        SELECT
          COUNT(DISTINCT r.RequestId) AS TotalRequests,

          SUM(CASE
            WHEN r.Status IN (${HOS_PENDING_STATUSES})
             AND r.CurrentApproverId = @hosId
            THEN 1 ELSE 0
          END) AS PendingReview,

          SUM(CASE
            WHEN r.Status = 'Approved by HOS'
            THEN 1 ELSE 0
          END) AS Approved,

          SUM(CASE
            WHEN r.Status = 'Rejected by HOS'
            THEN 1 ELSE 0
          END) AS Rejected,

          SUM(CASE
            WHEN r.Status = 'Completed'
            THEN 1 ELSE 0
          END) AS Completed

        FROM PhotocopyRequests r

        LEFT JOIN RequestApprovals ra
          ON r.RequestId = ra.RequestId
         AND ra.ApproverId = @hosId
         AND ra.ApprovalRole = 'HOS'

        WHERE r.CurrentApproverId = @hosId
           OR ra.ApproverId = @hosId
      `);

    return res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error("Get HOS Dashboard Error:", error);

    return res.status(500).json({
      message: "Server error while fetching HOS dashboard",
      error: error.message,
    });
  }
};

/**
 * @desc    Get requests assigned to logged-in HOS
 * @route   GET /api/hos/requests
 * @access  Private - HOS / SuperAdmin
 */
const getHosRequests = async (req, res) => {
  try {
    // Logged-in HOS ID from JWT token
    const hosId = req.user.id;

    // Connect to MSSQL database
    const pool = await poolPromise;

    // Get all requests assigned to this HOS or previously acted by this HOS
    const result = await pool
      .request()
      .input("hosId", sql.Int, hosId)
      .query(`
        SELECT DISTINCT
          r.RequestId,
          r.RequestNumber,
          r.Copies,
          r.TotalPages,
          r.TotalSheets,
          r.PriorityLevel,
          r.Status,
          r.SubmittedAt,
          r.ApprovedAt,
          r.PaperSize,
          r.PrintType,
          r.PrintSide,
          r.DueDate,
          r.IsExam,
          r.Remarks AS RequestRemarks,

          teacher.FullName AS TeacherName,
          teacher.EmployeeId,

          d.DepartmentName,
          s.SubjectName,
          p.PurposeName,

          ra.Remarks AS ApprovalRemarks,
          ra.ApprovalStatus,
          ra.ActionDate

        FROM PhotocopyRequests r

        LEFT JOIN Users teacher
          ON r.TeacherId = teacher.UserId

        LEFT JOIN Departments d
          ON r.DepartmentId = d.DepartmentId

        LEFT JOIN Subjects s
          ON r.SubjectId = s.SubjectId

        LEFT JOIN Purposes p
          ON r.PurposeId = p.PurposeId

        LEFT JOIN RequestApprovals ra
          ON r.RequestId = ra.RequestId
         AND ra.ApproverId = @hosId
         AND ra.ApprovalRole = 'HOS'

        WHERE r.CurrentApproverId = @hosId
           OR ra.ApproverId = @hosId

        ORDER BY r.SubmittedAt DESC
      `);

    return res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Get HOS Requests Error:", error);

    return res.status(500).json({
      message: "Server error while fetching HOS requests",
      error: error.message,
    });
  }
};

/**
 * @desc    Get single HOS request details
 * @route   GET /api/hos/requests/:id
 * @access  Private - HOS / SuperAdmin
 */
const getHosRequestById = async (req, res) => {
  try {
    // Logged-in HOS ID from JWT token
    const hosId = req.user.id;

    // Request ID from URL parameter
    const requestId = req.params.id;

    // Connect to MSSQL database
    const pool = await poolPromise;

    // Get single request if assigned to this HOS or already acted by this HOS
    const result = await pool
      .request()
      .input("requestId", sql.Int, requestId)
      .input("hosId", sql.Int, hosId)
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
          r.ApprovedAt,
          r.PaperSize,
          r.PrintType,
          r.PrintSide,
          r.DueDate,
          r.IsExam,
          r.Remarks AS RequestRemarks,

          teacher.FullName AS TeacherName,
          teacher.EmployeeId,

          d.DepartmentName,
          s.SubjectName,
          p.PurposeName,

          ra.Remarks AS ApprovalRemarks,
          ra.ApprovalStatus,
          ra.ActionDate

        FROM PhotocopyRequests r

        LEFT JOIN Users teacher
          ON r.TeacherId = teacher.UserId

        LEFT JOIN Departments d
          ON r.DepartmentId = d.DepartmentId

        LEFT JOIN Subjects s
          ON r.SubjectId = s.SubjectId

        LEFT JOIN Purposes p
          ON r.PurposeId = p.PurposeId

        LEFT JOIN RequestApprovals ra
          ON r.RequestId = ra.RequestId
         AND ra.ApproverId = @hosId
         AND ra.ApprovalRole = 'HOS'

        WHERE r.RequestId = @requestId
          AND (
            r.CurrentApproverId = @hosId
            OR ra.ApproverId = @hosId
          )
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "Request not found or not assigned to this HOS",
      });
    }

    return res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error("Get HOS Request By ID Error:", error);

    return res.status(500).json({
      message: "Server error while fetching HOS request details",
      error: error.message,
    });
  }
};

/**
 * @desc    Get HOS approval history
 * @route   GET /api/hos/approval-history
 * @access  Private - HOS / SuperAdmin
 */
const getHosApprovalHistory = async (req, res) => {
  try {
    // Logged-in HOS ID from JWT token
    const hosId = req.user.id;

    // Connect to MSSQL database
    const pool = await poolPromise;

    // Get HOS approval/rejection history from RequestApprovals table
    const result = await pool
      .request()
      .input("hosId", sql.Int, hosId)
      .query(`
        SELECT
          ra.ApprovalId,
          ra.RequestId,
          ra.ApproverId,
          ra.ApprovalRole,
          ra.ApprovalStatus,
          ra.Remarks,
          ra.ActionDate,

          r.RequestNumber,
          r.Status AS RequestStatus,
          r.Copies,
          r.TotalPages,
          r.TotalSheets,
          r.PriorityLevel,
          r.SubmittedAt,

          teacher.FullName AS TeacherName,
          teacher.EmployeeId,

          d.DepartmentName,
          s.SubjectName,
          p.PurposeName,

          approver.FullName AS ApproverName,
          approver.EmployeeId AS ApproverEmployeeId,

          CONCAT(
            d.DepartmentName,
            ' HOS'
          ) AS DisplayApproverRole

        FROM RequestApprovals ra

        INNER JOIN PhotocopyRequests r
          ON ra.RequestId = r.RequestId

        LEFT JOIN Users teacher
          ON r.TeacherId = teacher.UserId

        LEFT JOIN Departments d
          ON r.DepartmentId = d.DepartmentId

        LEFT JOIN Subjects s
          ON r.SubjectId = s.SubjectId

        LEFT JOIN Purposes p
          ON r.PurposeId = p.PurposeId

        LEFT JOIN Users approver
          ON ra.ApproverId = approver.UserId

        WHERE ra.ApproverId = @hosId
          AND ra.ApprovalRole = 'HOS'

        ORDER BY ra.ActionDate DESC
      `);

    return res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Get HOS Approval History Error:", error);

    return res.status(500).json({
      message: "Server error while fetching HOS approval history",
      error: error.message,
    });
  }
};

/**
 * @desc    Approve request assigned to logged-in HOS
 * @route   PUT /api/hos/requests/:id/approve
 * @access  Private - HOS / SuperAdmin
 */
const approveHosRequest = async (req, res) => {
  try {
    // Logged-in HOS ID from JWT token
    const hosId = req.user.id;

    // Request ID from URL parameter
    const requestId = req.params.id;

    // Optional remarks from frontend
    const { remarks } = req.body || {};

    // Connect to MSSQL database
    const pool = await poolPromise;

    // Check if request is really assigned to this HOS
    // Supports both status names:
    // - Forwarded to HOS
    // - Pending HOS Approval
    const requestResult = await pool
      .request()
      .input("requestId", sql.Int, requestId)
      .input("hosId", sql.Int, hosId)
      .query(`
        SELECT RequestId
        FROM PhotocopyRequests
        WHERE RequestId = @requestId
          AND CurrentApproverId = @hosId
          AND Status IN (${HOS_PENDING_STATUSES})
      `);

    if (requestResult.recordset.length === 0) {
      return res.status(404).json({
        message:
          "Request not found, already processed, or not assigned to this HOS",
      });
    }

    // Find active Printing Admin
    // After HOS approves, request goes to Printing Admin queue
    const printingAdminResult = await pool
      .request()
      .query(`
        SELECT TOP 1 UserId
        FROM Users
        WHERE Role = 'PrintingAdmin'
          AND IsActive = 1
      `);

    if (printingAdminResult.recordset.length === 0) {
      return res.status(404).json({
        message: "No active Printing Admin found.",
      });
    }

    const printingAdminId = printingAdminResult.recordset[0].UserId;

    // Update request:
    // HOS approval complete, next approver is Printing Admin
    await pool
      .request()
      .input("requestId", sql.Int, requestId)
      .input("printingAdminId", sql.Int, printingAdminId)
      .query(`
        UPDATE PhotocopyRequests
        SET
          Status = 'Approved by HOS',
          CurrentApproverId = @printingAdminId,
          ApprovedAt = GETDATE()
        WHERE RequestId = @requestId
      `);

    // Save HOS approval history
    await pool
      .request()
      .input("requestId", sql.Int, requestId)
      .input("approverId", sql.Int, hosId)
      .input("remarks", sql.NVarChar, remarks || "Approved by HOS")
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
          'HOS',
          'Approved',
          @remarks,
          GETDATE()
        )
      `);

    return res.status(200).json({
      success: true,
      message: "Request approved by HOS and sent to Printing Admin.",
    });
  } catch (error) {
    console.error("Approve HOS Request Error:", error);

    return res.status(500).json({
      message: "Server error while approving HOS request",
      error: error.message,
    });
  }
};

/**
 * @desc    Reject request assigned to logged-in HOS
 * @route   PUT /api/hos/requests/:id/reject
 * @access  Private - HOS / SuperAdmin
 */
const rejectHosRequest = async (req, res) => {
  try {
    // Logged-in HOS ID from JWT token
    const hosId = req.user.id;

    // Request ID from URL parameter
    const requestId = req.params.id;

    // Reject remarks from frontend
    const { remarks } = req.body || {};

    // Reject action must always include remarks
    if (!remarks || !remarks.trim()) {
      return res.status(400).json({
        message: "Remarks are required when rejecting a request.",
      });
    }

    // Connect to MSSQL database
    const pool = await poolPromise;

    // Check if request is really assigned to this HOS
    // Supports both status names:
    // - Forwarded to HOS
    // - Pending HOS Approval
    const requestResult = await pool
      .request()
      .input("requestId", sql.Int, requestId)
      .input("hosId", sql.Int, hosId)
      .query(`
        SELECT RequestId
        FROM PhotocopyRequests
        WHERE RequestId = @requestId
          AND CurrentApproverId = @hosId
          AND Status IN (${HOS_PENDING_STATUSES})
      `);

    if (requestResult.recordset.length === 0) {
      return res.status(404).json({
        message:
          "Request not found, already processed, or not assigned to this HOS",
      });
    }

    // Update request as rejected by HOS
    // CurrentApproverId becomes NULL because workflow stops here
    await pool
      .request()
      .input("requestId", sql.Int, requestId)
      .query(`
        UPDATE PhotocopyRequests
        SET
          Status = 'Rejected by HOS',
          CurrentApproverId = NULL
        WHERE RequestId = @requestId
      `);

    // Save HOS rejection history
    await pool
      .request()
      .input("requestId", sql.Int, requestId)
      .input("approverId", sql.Int, hosId)
      .input("remarks", sql.NVarChar, remarks)
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
          'HOS',
          'Rejected',
          @remarks,
          GETDATE()
        )
      `);

    return res.status(200).json({
      success: true,
      message: "Request rejected by HOS.",
    });
  } catch (error) {
    console.error("Reject HOS Request Error:", error);

    return res.status(500).json({
      message: "Server error while rejecting HOS request",
      error: error.message,
    });
  }
};

// ============================================
// Export Controller Functions
// ============================================
module.exports = {
  getHosDashboard,
  getHosRequests,
  getHosRequestById,
  getHosApprovalHistory,
  approveHosRequest,
  rejectHosRequest,
};