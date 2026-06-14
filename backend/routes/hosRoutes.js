// ============================================
// ARAB UNITY SCHOOL
// HOS Routes
// ============================================

const express = require("express");

const {
  getHosDashboard,
  getHosRequests,
  getHosRequestById,
  getHosApprovalHistory,
  approveHosRequest,
  rejectHosRequest,
} = require("../controllers/hosController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  authorizeRoles("HOS", "SuperAdmin"),
  getHosDashboard
);

router.get(
  "/approval-history",
  protect,
  authorizeRoles("HOS", "SuperAdmin"),
  getHosApprovalHistory
);

router.get(
  "/requests",
  protect,
  authorizeRoles("HOS", "SuperAdmin"),
  getHosRequests
);

router.get(
  "/requests/:id",
  protect,
  authorizeRoles("HOS", "SuperAdmin"),
  getHosRequestById
);

router.put(
  "/requests/:id/approve",
  protect,
  authorizeRoles("HOS", "SuperAdmin"),
  approveHosRequest
);

router.put(
  "/requests/:id/reject",
  protect,
  authorizeRoles("HOS", "SuperAdmin"),
  rejectHosRequest
);

module.exports = router;