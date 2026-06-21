// ============================================
// ARAB UNITY SCHOOL
// Paper Purchase Routes
// ============================================

const express = require("express");
const router = express.Router();

const {
  getPurchases,
  addPurchase,
} = require("../controllers/purchaseController");

const { protect } = require("../middleware/authMiddleware");

// GET /api/purchases
router.get("/", protect, getPurchases);

// POST /api/purchases
router.post("/", protect, addPurchase);

module.exports = router;