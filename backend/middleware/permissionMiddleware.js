// ============================================
// ARAB UNITY SCHOOL
// Permission Middleware
// Checks if the logged-in user has permission
// Supports role permissions + user overrides
// ============================================

const sql = require("mssql");
const { poolPromise } = require("../config/db");

// ============================================
// Check Permission Middleware
// Usage:
// router.get("/users", protect, requirePermission("User.View"), controller)
// ============================================

const requirePermission = (permissionKey) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          message: "Unauthorized. User not found in token.",
        });
      }

      const pool = await poolPromise;

      const result = await pool
        .request()
        .input("UserId", sql.Int, userId)
        .input("PermissionKey", sql.NVarChar(100), permissionKey)
        .query(`
          SELECT TOP 1
              CASE
                  -- User override has highest priority
                  WHEN upo.IsAllowed IS NOT NULL THEN upo.IsAllowed

                  -- Otherwise use role permission
                  WHEN rp.IsAllowed IS NOT NULL THEN rp.IsAllowed

                  ELSE 0
              END AS HasPermission
          FROM Users u
          LEFT JOIN Roles r
              ON r.RoleKey = u.Role
          LEFT JOIN RolePermissions rp
              ON rp.RoleId = r.RoleId
          LEFT JOIN Permissions p
              ON p.PermissionId = rp.PermissionId
             AND p.PermissionKey = @PermissionKey
          LEFT JOIN UserPermissionOverrides upo
              ON upo.UserId = u.UserId
             AND upo.PermissionId = p.PermissionId
          WHERE u.UserId = @UserId
            AND u.IsActive = 1
        `);

      const hasPermission = result.recordset[0]?.HasPermission === true;

      if (!hasPermission) {
        return res.status(403).json({
          message: "Access denied. Missing permission.",
          requiredPermission: permissionKey,
        });
      }

      next();
    } catch (error) {
      console.error("Permission middleware error:", error);
      return res.status(500).json({
        message: "Permission check failed.",
      });
    }
  };
};

module.exports = {
  requirePermission,
};