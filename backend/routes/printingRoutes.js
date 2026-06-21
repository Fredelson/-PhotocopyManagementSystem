// ============================================
// ARAB UNITY SCHOOL
// Printing Admin Routes
// ============================================

const express = require("express");

const {
  getPrintingDashboard,
  getPrintingRequests,
  getPrintingRequestById,
  startPrinting,
  completePrinting,
  getPrintingHistory,
  getInventoryTransactions,
} = require("../controllers/printingController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Printing dashboard KPI statistics
router.get(
  "/dashboard",
  protect,
  authorizeRoles("PrintingAdmin", "SuperAdmin"),
  getPrintingDashboard
);

// Printing history
// IMPORTANT: keep this before /requests/:id
router.get(
  "/history",
  protect,
  authorizeRoles("PrintingAdmin", "SuperAdmin"),
  getPrintingHistory
);

// Get print queue requests
router.get(
  "/requests",
  protect,
  authorizeRoles("PrintingAdmin", "SuperAdmin"),
  getPrintingRequests
);

// Get single printing request
router.get(
  "/requests/:id",
  protect,
  authorizeRoles("PrintingAdmin", "SuperAdmin"),
  getPrintingRequestById
);

// Start printing
router.put(
  "/requests/:id/start",
  protect,
  authorizeRoles("PrintingAdmin", "SuperAdmin"),
  startPrinting
);

// Complete printing
router.put(
  "/requests/:id/complete",
  protect,
  authorizeRoles("PrintingAdmin", "SuperAdmin"),
  completePrinting
);

// Inventory Transaction
router.get("/inventory-transactions", getInventoryTransactions);

module.exports = router;