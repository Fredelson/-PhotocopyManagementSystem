// ============================================
// ARAB UNITY SCHOOL
// HOD Controller
// Handles HOD dashboard, request review, approve, reject
// Fixed duplicate approval rows issue
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
          COUNT(DISTINCT r.RequestId) AS TotalRequests,

          COUNT(DISTINCT CASE
            WHEN r.Status = 'Pending'
             AND r.CurrentApproverId = @hodId
            THEN r.RequestId
          END) AS PendingReview,

          COUNT(DISTINCT CASE
            WHEN r.Status = 'Approved by HOD'
            THEN r.RequestId
          END) AS Approved,

          COUNT(DISTINCT CASE
            WHEN r.Status = 'Rejected by HOD'
            THEN r.RequestId
          END) AS Rejected,

          COUNT(DISTINCT CASE
            WHEN r.Status = 'Forwarded to HOS'
            THEN r.RequestId
          END) AS Forwarded,

          COUNT(DISTINCT CASE
            WHEN r.Status = 'Completed'
            THEN r.RequestId
          END) AS Completed

        FROM PhotocopyRequests r

        LEFT JOIN RequestApprovals ra
          ON r.RequestId = ra.RequestId
         AND ra.ApproverId = @hodId
         AND ra.ApprovalRole = 'HOD'

        WHERE r.CurrentApproverId = @hodId
           OR ra.ApproverId = @hodId
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
 * @desc    Get requests assigned to logged-in HOD + already acted requests
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
          p.PurposeName,

          ra.Remarks AS ApprovalRemarks,
          ra.ApprovalStatus,
          ra.ActionDate

        FROM PhotocopyRequests r

        LEFT JOIN Users u
          ON r.TeacherId = u.UserId

        LEFT JOIN Departments d
          ON r.DepartmentId = d.DepartmentId

        LEFT JOIN Subjects s
          ON r.SubjectId = s.SubjectId

        LEFT JOIN Purposes p
          ON r.PurposeId = p.PurposeId

        OUTER APPLY (
          SELECT TOP 1
            ra2.Remarks,
            ra2.ApprovalStatus,
            ra2.ActionDate
          FROM RequestApprovals ra2
          WHERE ra2.RequestId = r.RequestId
            AND ra2.ApproverId = @hodId
            AND ra2.ApprovalRole = 'HOD'
          ORDER BY ra2.ActionDate DESC, ra2.ApprovalId DESC
        ) ra

        WHERE r.CurrentApproverId = @hodId
           OR EXISTS (
              SELECT 1
              FROM RequestApprovals x
              WHERE x.RequestId = r.RequestId
                AND x.ApproverId = @hodId
                AND x.ApprovalRole = 'HOD'
           )

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
          p.PurposeName,

          ra.Remarks AS ApprovalRemarks,
          ra.ApprovalStatus,
          ra.ActionDate

        FROM PhotocopyRequests r

        LEFT JOIN Users u
          ON r.TeacherId = u.UserId

        LEFT JOIN Departments d
          ON r.DepartmentId = d.DepartmentId

        LEFT JOIN Subjects s
          ON r.SubjectId = s.SubjectId

        LEFT JOIN Purposes p
          ON r.PurposeId = p.PurposeId

        OUTER APPLY (
          SELECT TOP 1
            ra2.Remarks,
            ra2.ApprovalStatus,
            ra2.ActionDate
          FROM RequestApprovals ra2
          WHERE ra2.RequestId = r.RequestId
            AND ra2.ApproverId = @hodId
            AND ra2.ApprovalRole = 'HOD'
          ORDER BY ra2.ActionDate DESC, ra2.ApprovalId DESC
        ) ra

        WHERE r.RequestId = @requestId
          AND (
            r.CurrentApproverId = @hodId
            OR EXISTS (
              SELECT 1
              FROM RequestApprovals x
              WHERE x.RequestId = r.RequestId
                AND x.ApproverId = @hodId
                AND x.ApprovalRole = 'HOD'
            )
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
 * @desc    Get HOD approval history
 * @route   GET /api/hod/approval-history
 * @access  Private - HOD / SuperAdmin
 */
const getHodApprovalHistory = async (req, res) => {
  try {
    const hodId = req.user.id;
    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("hodId", sql.Int, hodId)
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

          u.FullName AS TeacherName,
          u.EmployeeId,

          d.DepartmentName,
          s.SubjectName,
          p.PurposeName,

          approver.FullName AS ApproverName,
          approver.EmployeeId AS ApproverEmployeeId,

          CONCAT(
            s.SubjectName,
            ' ',
            d.DepartmentName,
            ' HOD'
          ) AS DisplayApproverRole

        FROM RequestApprovals ra

        INNER JOIN PhotocopyRequests r
          ON ra.RequestId = r.RequestId

        LEFT JOIN Users u
          ON r.TeacherId = u.UserId

        LEFT JOIN Departments d
          ON r.DepartmentId = d.DepartmentId

        LEFT JOIN Subjects s
          ON r.SubjectId = s.SubjectId

        LEFT JOIN Purposes p
          ON r.PurposeId = p.PurposeId

        LEFT JOIN Users approver
          ON ra.ApproverId = approver.UserId

        WHERE ra.ApproverId = @hodId
          AND ra.ApprovalRole = 'HOD'
          AND ra.ApprovalStatus <> 'Pending'

        ORDER BY ra.ActionDate DESC
      `);

    return res.status(200).json(result.recordset);
  } catch (error) {
    console.error("Get HOD Approval History Error:", error);

    return res.status(500).json({
      message: "Server error while fetching HOD approval history",
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

    // Check request is still pending and assigned to this HOD
    const requestResult = await pool
      .request()
      .input("requestId", sql.Int, requestId)
      .input("hodId", sql.Int, hodId)
      .query(`
        SELECT
          RequestId,
          TotalSheets,
          DepartmentId
        FROM PhotocopyRequests
        WHERE RequestId = @requestId
          AND CurrentApproverId = @hodId
          AND Status = 'Pending'
      `);

    if (requestResult.recordset.length === 0) {
      return res.status(404).json({
        message:
          "Request not found, already processed, or not assigned to this HOD",
      });
    }

    const request = requestResult.recordset[0];
    const totalSheets = request.TotalSheets;
    const departmentId = request.DepartmentId;

    // Find active Printing Admin
    const printingAdminResult = await pool.request().query(`
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

    // Default route: HOD approved → Printing Admin
    let nextStatus = "Approved by HOD";
    let nextApproverId = printingAdminId;
    let approvalRemarks = remarks || "Approved by HOD";

    // Large request route: HOD approved → HOS
    if (totalSheets > 500) {
      const hosResult = await pool
        .request()
        .input("departmentId", sql.Int, departmentId)
        .query(`
          SELECT TOP 1 UserId
          FROM Users
          WHERE Role = 'HOS'
            AND DepartmentId = @departmentId
            AND IsActive = 1
        `);

      if (hosResult.recordset.length === 0) {
        return res.status(404).json({
          message: "No active HOS found for this request department.",
        });
      }

      nextStatus = "Forwarded to HOS";
      nextApproverId = hosResult.recordset[0].UserId;
      approvalRemarks = remarks || "Approved by HOD and forwarded to HOS";
    }

    // Update main request
    await pool
      .request()
      .input("requestId", sql.Int, requestId)
      .input("nextStatus", sql.NVarChar, nextStatus)
      .input("nextApproverId", sql.Int, nextApproverId)
      .query(`
        UPDATE PhotocopyRequests
        SET
          Status = @nextStatus,
          CurrentApproverId = @nextApproverId,
          ApprovedAt = GETDATE()
        WHERE RequestId = @requestId
      `);

    // Update existing HOD pending approval row
    // This prevents duplicate HOD Pending + HOD Approved rows
    const updateHodApproval = await pool
      .request()
      .input("requestId", sql.Int, requestId)
      .input("approverId", sql.Int, hodId)
      .input("remarks", sql.NVarChar, approvalRemarks)
      .query(`
        UPDATE RequestApprovals
        SET
          ApprovalStatus = 'Approved',
          Remarks = @remarks,
          ActionDate = GETDATE()
        WHERE RequestId = @requestId
          AND ApproverId = @approverId
          AND ApprovalRole = 'HOD'
          AND ApprovalStatus = 'Pending'
      `);

    // Safety fallback:
    // If there was no HOD pending row, insert one approved row
    if (updateHodApproval.rowsAffected[0] === 0) {
      await pool
        .request()
        .input("requestId", sql.Int, requestId)
        .input("approverId", sql.Int, hodId)
        .input("remarks", sql.NVarChar, approvalRemarks)
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
    }

    // If large request, create HOS pending approval row
    // This is correct because HOS has not acted yet
    if (nextStatus === "Forwarded to HOS") {
      await pool
        .request()
        .input("requestId", sql.Int, requestId)
        .input("approverId", sql.Int, nextApproverId)
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
            'Pending',
            NULL,
            GETDATE()
          )
        `);
    }

    return res.status(200).json({
      success: true,
      message:
        nextStatus === "Forwarded to HOS"
          ? "Request approved by HOD and forwarded to HOS."
          : "Request approved by HOD and sent to Printing Admin.",
      nextStatus,
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

    // Check request is still pending and assigned to HOD
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
        message:
          "Request not found, already processed, or not assigned to this HOD",
      });
    }

    const rejectionRemarks = remarks || "Rejected by HOD";

    // Update main request
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

    // Update existing HOD pending approval row
    // This prevents duplicate HOD Pending + HOD Rejected rows
    const updateHodApproval = await pool
      .request()
      .input("requestId", sql.Int, requestId)
      .input("approverId", sql.Int, hodId)
      .input("remarks", sql.NVarChar, rejectionRemarks)
      .query(`
        UPDATE RequestApprovals
        SET
          ApprovalStatus = 'Rejected',
          Remarks = @remarks,
          ActionDate = GETDATE()
        WHERE RequestId = @requestId
          AND ApproverId = @approverId
          AND ApprovalRole = 'HOD'
          AND ApprovalStatus = 'Pending'
      `);

    // Safety fallback:
    // If there was no HOD pending row, insert one rejected row
    if (updateHodApproval.rowsAffected[0] === 0) {
      await pool
        .request()
        .input("requestId", sql.Int, requestId)
        .input("approverId", sql.Int, hodId)
        .input("remarks", sql.NVarChar, rejectionRemarks)
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
    }

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
  getHodApprovalHistory,
  approveHodRequest,
  rejectHodRequest,
};