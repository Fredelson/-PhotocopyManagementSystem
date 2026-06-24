// ============================================
// ARAB UNITY SCHOOL
// Super Admin - Widget Routes
// ============================================

const express = require("express");
const router = express.Router();

const {
  getWidgets,
  updateWidget,
} = require("../../controllers/superadmin/widgetController");

const { protect } = require("../../middleware/authMiddleware");
const { requirePermission } = require("../../middleware/permissionMiddleware");

// GET /api/superadmin/widgets
router.get(
  "/",
  protect,
  requirePermission("Widget.View"),
  getWidgets
);

// PUT /api/superadmin/widgets/:id
router.put(
  "/:id",
  protect,
  requirePermission("Widget.Edit"),
  updateWidget
);

module.exports = router;