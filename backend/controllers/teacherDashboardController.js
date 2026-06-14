// ============================================
// ARAB UNITY SCHOOL
// Teacher Dashboard Controller
// Handles Teacher Dashboard KPI Data
// Includes Completed KPI
// ============================================

const { poolPromise, sql } = require("../config/db");

// ============================================
// Get Teacher Dashboard KPIs
// Route: GET /api/teacher/dashboard/kpis
// Access: Teacher
// ============================================

const getTeacherDashboardKpis = async (req, res) => {
  try {
    // ============================================
    // Logged-in teacher ID from JWT token
    // ============================================
    const teacherId = req.user.id;

    // ============================================
    // Connect to MSSQL database
    // ============================================
    const pool = await poolPromise;

    // ============================================
    // Teacher KPI Query
    // Counts only requests created by logged-in teacher
    // ============================================
    const result = await pool
      .request()
      .input("teacherId", sql.Int, teacherId)
      .query(`
        SELECT
          COUNT(*) AS totalRequests,

          ISNULL(SUM(TotalSheets), 0) AS totalSheets,

          ISNULL(SUM(TotalPages), 0) AS totalPages,

          SUM(
            CASE
              WHEN Status IN (
                'Submitted',
                'Pending HOD Approval',
                'Pending HOS Approval',
                'Forwarded to HOD',
                'Forwarded to HOS',
                'Printing'
              )
              THEN 1
              ELSE 0
            END
          ) AS pendingRequests,

          SUM(
            CASE
              WHEN Status IN (
                'Approved by HOD',
                'Approved by HOS'
              )
              THEN 1
              ELSE 0
            END
          ) AS approvedRequests,

          SUM(
            CASE
              WHEN Status IN (
                'Rejected by HOD',
                'Rejected by HOS'
              )
              THEN 1
              ELSE 0
            END
          ) AS rejectedRequests,

          SUM(
            CASE
              WHEN Status = 'Completed'
              THEN 1
              ELSE 0
            END
          ) AS completedRequests

        FROM PhotocopyRequests
        WHERE TeacherId = @teacherId
      `);

    // ============================================
    // Extract stats safely from result
    // ============================================
    const stats = result.recordset[0] || {};

    // ============================================
    // Success Response
    // Frontend will consume these camelCase fields
    // ============================================
    res.status(200).json({
      success: true,
      data: {
        totalRequests: stats.totalRequests || 0,
        totalSheets: stats.totalSheets || 0,
        totalPages: stats.totalPages || 0,
        pendingRequests: stats.pendingRequests || 0,
        approvedRequests: stats.approvedRequests || 0,
        rejectedRequests: stats.rejectedRequests || 0,
        completedRequests: stats.completedRequests || 0,
      },
    });
  } catch (error) {
    // ============================================
    // Server error response
    // ============================================
    console.error(
      "Teacher Dashboard KPI Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load teacher dashboard KPIs",
      error: error.message,
    });
  }
};

// ============================================
// Export Controller
// ============================================

module.exports = {
  getTeacherDashboardKpis,
};