// ============================================
// ARAB UNITY SCHOOL
// Upload Routes
// ============================================

const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const uploadController = require("../controllers/uploadController");
const { protect } = require("../middleware/authMiddleware");

// POST /api/uploads/request-attachment
router.post(
  "/request-attachment",
  protect,
  upload.single("file"),
  uploadController.uploadRequestAttachment
);

module.exports = router;