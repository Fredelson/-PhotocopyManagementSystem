// ============================================
// ARAB UNITY SCHOOL
// Super Admin - Dashboard Routes
// ============================================

const express = require("express");
const router = express.Router();

const {
  getDashboard,
} = require("../../controllers/superadmin/dashboardController");

const { protect } = require("../../middleware/authMiddleware");
const { requirePermission } = require("../../middleware/permissionMiddleware");

// GET /api/superadmin/dashboard
router.get(
  "/",
  protect,
  requirePermission("SuperAdmin.Dashboard.View"),
  getDashboard
);

module.exports = router;