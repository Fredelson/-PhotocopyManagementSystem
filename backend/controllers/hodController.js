// ============================================
// ARAB UNITY SCHOOL
// HOD Controller
// Handles HOD dashboard, request review, approve, reject
// ============================================

const { poolPromise, sql } = require("../config/db");

/**
 * @desc    HOD Dashboard Statistics
 * @route   GET /api/hod/dashboard
 * @access  Private - HOD / SuperAdmin
 */
const getHodDashboard = async (req, res) => {
  try {
    const hodId = req.user.id;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("hodId", sql.Int, hodId)
      .query(`
        SELECT
          COUNT(*) AS TotalRequests,
          SUM(CASE WHEN Status = 'Pending' THEN 1 ELSE 0 END) AS PendingReview,
          SUM(CASE WHEN Status = 'Approved by HOD' THEN 1 ELSE 0 END) AS Approved,
          SUM(CASE WHEN Status = 'Rejected by HOD' THEN 1 ELSE 0 END) AS Rejected
        FROM PhotocopyRequests
        WHERE CurrentApproverId = @hodId
           OR Status IN ('Approved by HOD', 'Rejected by HOD')
      `);

    return res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error("Get HOD Dashboard Error:", error);

    return res.status(500).json({
      message: "Server error while fetching HOD dashboard",
      error: error.message,
    });
  }
};

/**
 * @desc    Get requests assigned to logged-in HOD
 * @route   GET /api/hod/requests
 * @access  Private - HOD / SuperAdmin
 */
const getHodRequests = async (req, res) => {
  try {
    const hodId = req.user.id;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("hodId", sql.Int, hodId)
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
        WHERE r.CurrentApproverId = @hodId
        ORDER BY r.SubmittedAt DESC
      `);

    return res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Get HOD Requests Error:", error);

    return res.status(500).json({
      message: "Server error while fetching HOD requests",
      error: error.message,
    });
  }
};

/**
 * @desc    Get single request details
 * @route   GET /api/hod/requests/:id
 * @access  Private - HOD / SuperAdmin
 */
const getHodRequestById = async (req, res) => {
  try {
    const hodId = req.user.id;
    const requestId = req.params.id;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("requestId", sql.Int, requestId)
      .input("hodId", sql.Int, hodId)
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
          AND (
            r.CurrentApproverId = @hodId
            OR r.Status IN ('Approved by HOD', 'Rejected by HOD')
          )
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        message: "Request not found or not assigned to this HOD",
      });
    }

    return res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error("Get HOD Request By ID Error:", error);

    return res.status(500).json({
      message: "Server error while fetching request details",
      error: error.message,
    });
  }
};

/**
 * @desc    Approve request assigned to logged-in HOD
 * @route   PUT /api/hod/requests/:id/approve
 * @access  Private - HOD / SuperAdmin
 */
const approveHodRequest = async (req, res) => {
  try {
    const hodId = req.user.id;
    const requestId = req.params.id;
    const { remarks } = req.body || {};

    const pool = await poolPromise;

    const requestResult = await pool
      .request()
      .input("requestId", sql.Int, requestId)
      .input("hodId", sql.Int, hodId)
      .query(`
        SELECT RequestId
        FROM PhotocopyRequests
        WHERE RequestId = @requestId
          AND CurrentApproverId = @hodId
          AND Status = 'Pending'
      `);

    if (requestResult.recordset.length === 0) {
      return res.status(404).json({
        message: "Request not found, already processed, or not assigned to this HOD",
      });
    }

    await pool
      .request()
      .input("requestId", sql.Int, requestId)
      .query(`
        UPDATE PhotocopyRequests
        SET
          Status = 'Approved by HOD',
          CurrentApproverId = NULL
        WHERE RequestId = @requestId
      `);

    await pool
      .request()
      .input("requestId", sql.Int, requestId)
      .input("approverId", sql.Int, hodId)
      .input("remarks", sql.NVarChar, remarks || "Approved by HOD")
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
          'Approved',
          @remarks,
          GETDATE()
        )
      `);

    return res.status(200).json({
      success: true,
      message: "Request approved successfully",
    });
  } catch (error) {
    console.error("Approve HOD Request Error:", error);

    return res.status(500).json({
      message: "Server error while approving request",
      error: error.message,
    });
  }
};

/**
 * @desc    Reject request assigned to logged-in HOD
 * @route   PUT /api/hod/requests/:id/reject
 * @access  Private - HOD / SuperAdmin
 */
const rejectHodRequest = async (req, res) => {
  try {
    const hodId = req.user.id;
    const requestId = req.params.id;
    const { remarks } = req.body || {};

    const pool = await poolPromise;

    const requestResult = await pool
      .request()
      .input("requestId", sql.Int, requestId)
      .input("hodId", sql.Int, hodId)
      .query(`
        SELECT RequestId
        FROM PhotocopyRequests
        WHERE RequestId = @requestId
          AND CurrentApproverId = @hodId
          AND Status = 'Pending'
      `);

    if (requestResult.recordset.length === 0) {
      return res.status(404).json({
        message: "Request not found, already processed, or not assigned to this HOD",
      });
    }

    await pool
      .request()
      .input("requestId", sql.Int, requestId)
      .query(`
        UPDATE PhotocopyRequests
        SET
          Status = 'Rejected by HOD',
          CurrentApproverId = NULL
        WHERE RequestId = @requestId
      `);

    await pool
      .request()
      .input("requestId", sql.Int, requestId)
      .input("approverId", sql.Int, hodId)
      .input("remarks", sql.NVarChar, remarks || "Rejected by HOD")
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
          'Rejected',
          @remarks,
          GETDATE()
        )
      `);

    return res.status(200).json({
      success: true,
      message: "Request rejected successfully",
    });
  } catch (error) {
    console.error("Reject HOD Request Error:", error);

    return res.status(500).json({
      message: "Server error while rejecting request",
      error: error.message,
    });
  }
};

module.exports = {
  getHodDashboard,
  getHodRequests,
  getHodRequestById,
  approveHodRequest,
  rejectHodRequest,
};