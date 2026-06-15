// ============================================
// ARAB UNITY SCHOOL
// Print Limit Routes
// Department limits and subject/HOD limits
// ============================================

const express = require("express");
const router = express.Router();

const {
  getDepartmentLimits,
  upsertDepartmentLimit,
  getSubjectLimits,
  upsertSubjectLimit,
} = require("../controllers/limitController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

// ============================================
// Department Limits
// Printing Admin sets monthly limits per department
// HOS can view department limits
// ============================================

// GET /api/limits/departments?month=6&year=2026
router.get(
  "/departments",
  protect,
  authorizeRoles("PrintingAdmin", "SuperAdmin", "HOS"),
  getDepartmentLimits
);

// PUT /api/limits/departments/:departmentId
router.put(
  "/departments/:departmentId",
  protect,
  authorizeRoles("PrintingAdmin", "SuperAdmin"),
  upsertDepartmentLimit
);

// ============================================
// Subject / HOD Limits
// HOS distributes department limit to subjects/HODs
// Printing Admin can view subject limits
// ============================================

// GET /api/limits/subjects?departmentId=1&month=6&year=2026
router.get(
  "/subjects",
  protect,
  authorizeRoles("HOS", "PrintingAdmin", "SuperAdmin"),
  getSubjectLimits
);

// PUT /api/limits/subjects/:subjectId
router.put(
  "/subjects/:subjectId",
  protect,
  authorizeRoles("HOS", "SuperAdmin"),
  upsertSubjectLimit
);

module.exports = router;