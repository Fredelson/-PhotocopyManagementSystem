// ============================================
// ARAB UNITY SCHOOL
// Super Admin - Menu Routes
// Dynamic sidebar and menu management
// ============================================

const express = require("express");
const router = express.Router();

const {
  getMySidebarMenus,
  getAllMenus,
  updateMenu,
} = require("../../controllers/superadmin/menuController");

const { protect } = require("../../middleware/authMiddleware");
const { requirePermission } = require("../../middleware/permissionMiddleware");

// ============================================
// Get logged-in user's sidebar
// GET /api/superadmin/menus/my-sidebar
// ============================================

router.get("/my-sidebar", protect, getMySidebarMenus);

// ============================================
// Get all menus for Menu Manager
// GET /api/superadmin/menus
// ============================================

router.get(
  "/",
  protect,
  requirePermission("Menu.View"),
  getAllMenus
);

// ============================================
// Update menu item
// PUT /api/superadmin/menus/:id
// ============================================

router.put(
  "/:id",
  protect,
  requirePermission("Menu.Edit"),
  updateMenu
);

module.exports = router;