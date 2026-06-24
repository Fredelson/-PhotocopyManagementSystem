// ============================================
// ARAB UNITY SCHOOL
// Backend Server
// Main Express API entry point
// ============================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { poolPromise } = require("./config/db");

// ============================================
// Routes
// ============================================

const authRoutes = require("./routes/authRoutes");
const requestRoutes = require("./routes/requestRoutes");
const hodRoutes = require("./routes/hodRoutes");
const hosRoutes = require("./routes/hosRoutes");
const lookupRoutes = require("./routes/lookupRoutes");
const userRoutes = require("./routes/userRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const path = require("path");

// Teacher Dashboard routes
const teacherDashboardRoutes = require("./routes/teacherDashboardRoutes");
const teacherReportRoutes = require("./routes/teacherReportRoutes");

// Printing Admin routes
const printingRoutes = require("./routes/printingRoutes");
const paperStockRoutes = require("./routes/paperStockRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const masterRoutes = require("./routes/masterRoutes");
const userImportRoutes = require("./routes/userImportRoutes");
const accessLevelRoutes = require("./routes/accessLevelRoutes");


// Print Limit routes
const limitRoutes = require("./routes/limitRoutes");
const distributionRoutes = require("./routes/distributionRoutes");

const superAdminPermissionRoutes = require("./routes/superadmin/permissionRoutes");
const superAdminMenuRoutes = require("./routes/superadmin/menuRoutes");
const superAdminModuleRoutes = require("./routes/superadmin/moduleRoutes");
const superAdminFeatureFlagRoutes = require("./routes/superadmin/featureFlagRoutes");
const superAdminSystemSettingsRoutes = require("./routes/superadmin/systemSettingsRoutes");
const superAdminWidgetRoutes = require("./routes/superadmin/widgetRoutes");
const superAdminAuditLogRoutes = require("./routes/superadmin/auditLogRoutes");
const superAdminDashboardRoutes = require("./routes/superadmin/dashboardRoutes");
const superAdminRoleRoutes = require("./routes/superadmin/roleRoutes");
const superAdminUserOverrideRoutes = require("./routes/superadmin/userPermissionOverrideRoutes");
const superAdminButtonRoutes = require("./routes/superadmin/buttonRoutes");



// ============================================
// Initialize Express App
// ============================================

const app = express();

// ============================================
// Middleware
// ============================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://itrequest.arabunityschool.org",
      "https://itrequest.arabunityschool.org",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "50mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ============================================
// Health Check Route
// ============================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ARAB UNITY SCHOOL Backend API Running",
  });
});

// ============================================
// API Routes
// ============================================

app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/hod", hodRoutes);
app.use("/api/hos", hosRoutes);
app.use("/api/lookups", lookupRoutes);

// User Management API route
app.use("/api/users", userRoutes);

// Teacher Dashboard API route
app.use("/api/teacher/dashboard", teacherDashboardRoutes);
app.use("/api/teacher/reports", teacherReportRoutes);

// Printing Admin API route
app.use("/api/printing", printingRoutes);
app.use("/api/distributions", distributionRoutes);
app.use("/api/admin", userImportRoutes);

// Print Limit API route
app.use("/api/limits", limitRoutes);

app.use("/api/paper-stock", paperStockRoutes);
app.use("/api/purchases", purchaseRoutes);

app.use("/api/uploads", uploadRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/master", masterRoutes);
app.use("/api/access-levels", accessLevelRoutes);

app.use("/api/superadmin/permissions", superAdminPermissionRoutes);
app.use("/api/superadmin/menus", superAdminMenuRoutes);
app.use("/api/superadmin/modules", superAdminModuleRoutes);
app.use("/api/superadmin/feature-flags", superAdminFeatureFlagRoutes);
app.use("/api/superadmin/system-settings", superAdminSystemSettingsRoutes);
app.use("/api/superadmin/widgets", superAdminWidgetRoutes);
app.use("/api/superadmin/audit-logs", superAdminAuditLogRoutes);
app.use("/api/superadmin/dashboard", superAdminDashboardRoutes);
app.use("/api/superadmin/roles", superAdminRoleRoutes);
app.use("/api/superadmin/user-overrides", superAdminUserOverrideRoutes);
app.use("/api/superadmin/buttons", superAdminButtonRoutes);


// ============================================
// Start Server
// ============================================

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await poolPromise;

    app.listen(PORT, () => {
      console.log(
        `🚀 ARAB UNITY SCHOOL Backend running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error("❌ Failed to connect to MSSQL");
    console.error(error);
  }
};

startServer();