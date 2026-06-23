// ============================================
// ARAB UNITY SCHOOL
// HOS Routes
//
// HOS Level Access
// HOS and Secretary share the same permissions
//
// Secretary = HOS Level
// HOS = HOS Level
// SuperAdmin = Full Access
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

// ============================================
// GET HOS Dashboard
//
// Access:
// - HOS
// - Secretary
// - SuperAdmin
// ============================================
router.get(
  "/dashboard",
  protect,
  authorizeRoles(
    "HOS",
    "Secretary",
    "SuperAdmin"
  ),
  getHosDashboard
);

// ============================================
// GET HOS Approval History
//
// Access:
// - HOS
// - Secretary
// - SuperAdmin
// ============================================
router.get(
  "/approval-history",
  protect,
  authorizeRoles(
    "HOS",
    "Secretary",
    "SuperAdmin"
  ),
  getHosApprovalHistory
);

// ============================================
// GET HOS Requests Queue
//
// Access:
// - HOS
// - Secretary
// - SuperAdmin
// ============================================
router.get(
  "/requests",
  protect,
  authorizeRoles(
    "HOS",
    "Secretary",
    "SuperAdmin"
  ),
  getHosRequests
);

// ============================================
// GET Single Request Details
//
// Access:
// - HOS
// - Secretary
// - SuperAdmin
// ============================================
router.get(
  "/requests/:id",
  protect,
  authorizeRoles(
    "HOS",
    "Secretary",
    "SuperAdmin"
  ),
  getHosRequestById
);

// ============================================
// APPROVE Request
//
// Access:
// - HOS
// - Secretary
// - SuperAdmin
// ============================================
router.put(
  "/requests/:id/approve",
  protect,
  authorizeRoles(
    "HOS",
    "Secretary",
    "SuperAdmin"
  ),
  approveHosRequest
);

// ============================================
// REJECT Request
//
// Access:
// - HOS
// - Secretary
// - SuperAdmin
// ============================================
router.put(
  "/requests/:id/reject",
  protect,
  authorizeRoles(
    "HOS",
    "Secretary",
    "SuperAdmin"
  ),
  rejectHosRequest
);

module.exports = router;