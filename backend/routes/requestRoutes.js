// ============================================
// ARAB UNITY SCHOOL
// Photocopy Request Routes
// Handles request creation and request retrieval
// ============================================

const express = require("express");
const router = express.Router();

const {
  createRequest,
  getMyRequests,
  getRequestById,
} = require("../controllers/requestController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Create new request
// Teacher and SuperAdmin allowed for now
router.post(
  "/",
  protect,
  authorizeRoles("Teacher", "SuperAdmin"),
  createRequest
);

// Get logged-in teacher's own requests
router.get(
  "/my-requests",
  protect,
  authorizeRoles("Teacher", "SuperAdmin"),
  getMyRequests
);

// Get request details by ID
router.get(
  "/:id",
  protect,
  getRequestById
);

module.exports = router;