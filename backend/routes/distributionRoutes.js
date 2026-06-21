// ============================================
// ARAB UNITY SCHOOL
// Paper Distribution Routes
// Temporary API for testing deduction
// ============================================

const express = require("express");
const router = express.Router();

const {
  searchDistributionUsers,
  getDistributions,
  addDistribution,
} = require("../controllers/distributionController");

const { protect } = require("../middleware/authMiddleware");

// GET /api/distributions
router.get("/", protect, getDistributions);

// GET /api/distributions/users/search?query=
router.get("/users/search", protect, searchDistributionUsers);

// POST /api/distributions
router.post("/", protect, addDistribution);

module.exports = router;