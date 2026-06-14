// ============================================
// ARAB UNITY SCHOOL
// Photocopy Request Routes
// Handles request creation and request retrieval
// ============================================

const express = require("express");
const router = express.Router();

const {
  createRequest,
  getTeacherDashboard,
  getMyRequests,
  getRequestById,
} = require("../controllers/requestController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

/**
 * @desc    Get teacher dashboard stats
 * @route   GET /api/requests/dashboard
 * @access  Teacher / SuperAdmin
 */
router.get(
  "/dashboard",
  protect,
  authorizeRoles("Teacher", "SuperAdmin"),
  getTeacherDashboard
);

/**
 * @desc    Create new photocopy request
 * @route   POST /api/requests
 * @access  Teacher / HOD / SuperAdmin
 */
router.post(
  "/",
  protect,
  authorizeRoles("Teacher", "HOD", "SuperAdmin"),
  createRequest
);

/**
 * @desc    Get logged-in user's own requests
 * @route   GET /api/requests/my-requests
 * @access  Teacher / HOD / SuperAdmin
 */
router.get(
  "/my-requests",
  protect,
  authorizeRoles("Teacher", "HOD", "SuperAdmin"),
  getMyRequests
);

/**
 * @desc    Get request details by ID
 * @route   GET /api/requests/:id
 * @access  Private
 */
router.get(
  "/:id",
  protect,
  getRequestById
);

module.exports = router;