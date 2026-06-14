// ============================================
// ARAB UNITY SCHOOL
// Teacher Dashboard Controller
// Handles Teacher Dashboard KPI Data
// ============================================

const { poolPromise, sql } = require("../config/db");

// ============================================
// Get Teacher Dashboard KPIs
// Route: GET /api/teacher/dashboard/kpis
// Access: Teacher
// ============================================

const getTeacherDashboardKpis = async (req, res) => {
  try {
    // Logged-in teacher ID from JWT
    const teacherId = req.user.id;

    const pool = await poolPromise;

    // ============================================
    // Teacher KPI Query
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
              WHEN Status LIKE '%Pending%'
              THEN 1
              ELSE 0
            END
          ) AS pendingRequests,

          SUM(
            CASE
              WHEN Status LIKE '%Approved%'
              THEN 1
              ELSE 0
            END
          ) AS approvedRequests,

          SUM(
            CASE
              WHEN Status LIKE '%Rejected%'
              THEN 1
              ELSE 0
            END
          ) AS rejectedRequests

        FROM PhotocopyRequests
        WHERE TeacherId = @teacherId
      `);

    const stats = result.recordset[0];

    // ============================================
    // Success Response
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
      },
    });
  } catch (error) {
    console.error(
      "Teacher Dashboard KPI Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load teacher dashboard KPIs",
    });
  }
};

// ============================================
// Export Controller
// ============================================

module.exports = {
  getTeacherDashboardKpis,
};