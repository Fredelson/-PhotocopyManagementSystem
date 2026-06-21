// ============================================
// ARAB UNITY SCHOOL
// Master Data Routes
// Subjects, Sections, Purposes
// ============================================

const express = require("express");
const router = express.Router();

const {
  getMasterData,
  createMasterData,
  updateMasterData,
  updateMasterStatus,
} = require("../controllers/masterController");

const { protect } = require("../middleware/authMiddleware");

// GET /api/master/subjects
// GET /api/master/sections
// GET /api/master/purposes
router.get("/:type", protect, getMasterData);

// POST /api/master/subjects
// POST /api/master/sections
// POST /api/master/purposes
router.post("/:type", protect, createMasterData);

// PUT /api/master/subjects/:id
// PUT /api/master/sections/:id
// PUT /api/master/purposes/:id
router.put("/:type/:id", protect, updateMasterData);

// PATCH /api/master/subjects/:id/status
// PATCH /api/master/sections/:id/status
// PATCH /api/master/purposes/:id/status
router.patch("/:type/:id/status", protect, updateMasterStatus);

module.exports = router;