// ============================================
// ARAB UNITY SCHOOL
// Photocopy Request Routes
// Handles request creation, retrieval,
// teacher dashboard, attachments, and cancellation
// ============================================

const express = require("express");
const router = express.Router();

const {
  createRequest,
  getTeacherDashboard,
  getMyRequests,
  getRequestById,
  getMyAttachments,
  cancelMyRequest,
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
 * @desc    Get logged-in teacher attachments
 * @route   GET /api/requests/attachments
 * @access  Teacher / HOD / SuperAdmin
 */
router.get(
  "/attachments",
  protect,
  authorizeRoles("Teacher", "HOD", "SuperAdmin"),
  getMyAttachments
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
 * @desc    Cancel teacher request before printing starts
 * @route   PUT /api/requests/:id/cancel
 * @access  Teacher
 *
 * IMPORTANT:
 * This route must be before GET /:id
 */
router.put(
  "/:id/cancel",
  protect,
  authorizeRoles("Teacher"),
  cancelMyRequest
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
 * @desc    Get request details by ID
 * @route   GET /api/requests/:id
 * @access  Private
 *
 * IMPORTANT:
 * Keep this near the bottom because /:id can catch other routes
 */
router.get(
  "/:id",
  protect,
  getRequestById
);

module.exports = router;