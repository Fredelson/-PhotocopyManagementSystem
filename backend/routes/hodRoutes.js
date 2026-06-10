// ============================================
// ARAB UNITY SCHOOL
// HOD Routes
// ============================================

const express = require("express");

const {
  getHodDashboard,
  getHodRequests,
  getHodRequestById,
  approveHodRequest,
  rejectHodRequest,
} = require("../controllers/hodController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * @desc    HOD Dashboard Statistics
 * @route   GET /api/hod/dashboard
 * @access  Private - HOD / SuperAdmin
 */
router.get(
  "/dashboard",
  protect,
  authorizeRoles("HOD", "SuperAdmin"),
  getHodDashboard
);

/**
 * @desc    Get all requests assigned to HOD
 * @route   GET /api/hod/requests
 * @access  Private - HOD / SuperAdmin
 */
router.get(
  "/requests",
  protect,
  authorizeRoles("HOD", "SuperAdmin"),
  getHodRequests
);

/**
 * @desc    Get single request details
 * @route   GET /api/hod/requests/:id
 * @access  Private - HOD / SuperAdmin
 */
router.get(
  "/requests/:id",
  protect,
  authorizeRoles("HOD", "SuperAdmin"),
  getHodRequestById
);

/**
 * @desc    Approve request
 * @route   PUT /api/hod/requests/:id/approve
 * @access  Private - HOD / SuperAdmin
 */
router.put(
  "/requests/:id/approve",
  protect,
  authorizeRoles("HOD", "SuperAdmin"),
  approveHodRequest
);

/**
 * @desc    Reject request
 * @route   PUT /api/hod/requests/:id/reject
 * @access  Private - HOD / SuperAdmin
 */
router.put(
  "/requests/:id/reject",
  protect,
  authorizeRoles("HOD", "SuperAdmin"),
  rejectHodRequest
);

module.exports = router;