// ============================================
// ARAB UNITY SCHOOL
// Super Admin - Audit Log Routes
// ============================================

const express = require("express");
const router = express.Router();

const {
  getAuditLogs,
} = require("../../controllers/superadmin/auditLogController");

const { protect } = require("../../middleware/authMiddleware");
const { requirePermission } = require("../../middleware/permissionMiddleware");

// GET /api/superadmin/audit-logs
router.get(
  "/",
  protect,
  requirePermission("AuditLog.View"),
  getAuditLogs
);

module.exports = router;