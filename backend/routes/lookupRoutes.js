// ============================================
// ARAB UNITY SCHOOL
// Lookup Routes
// Used for frontend dropdowns
// ============================================

const express = require("express");

const {
  getDepartments,
  getSubjects,
  getPurposes,
} = require("../controllers/lookupController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Department dropdown
router.get("/departments", protect, getDepartments);

// Subject dropdown
router.get("/subjects", protect, getSubjects);

// Purpose dropdown
router.get("/purposes", protect, getPurposes);

module.exports = router;