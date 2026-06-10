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
 */
router.get(
  "/dashboard",
  protect,
  authorizeRoles("Teacher", "SuperAdmin"),
  getTeacherDashboard
);

/**
 * @desc    Create new request
 * @route   POST /api/requests
 */
router.post(
  "/",
  protect,
  authorizeRoles("Teacher", "SuperAdmin"),
  createRequest
);

/**
 * @desc    Get logged-in teacher's own requests
 * @route   GET /api/requests/my-requests
 */
router.get(
  "/my-requests",
  protect,
  authorizeRoles("Teacher", "SuperAdmin"),
  getMyRequests
);

/**
 * @desc    Get request details by ID
 * @route   GET /api/requests/:id
 */
router.get(
  "/:id",
  protect,
  getRequestById
);

module.exports = router;