// ============================================
// ARAB UNITY SCHOOL
// Printing Admin Layout Routes
//
// Purpose:
// Wrap all Printing Admin pages inside the
// shared PlatformLayout.
//
// Access:
// - PrintingAdmin
// - SuperAdmin
//
// Notes:
// - Every sidebar item must have a route
// - Real pages can replace placeholders later
// - Keeps sidebar navigation working
//
// Future:
// Replace ComingSoon pages one by one
// as modules are developed.
//
// ============================================

import { Navigate } from "react-router-dom";

import ProtectedRoute from "../../../routes/ProtectedRoute";
import PlatformLayout from "../../../platform/layout/PlatformLayout";

import PrintingAdminDashboard from "../pages/PrintingAdminDashboard";

// ============================================
// Shared Placeholder Page
// ============================================

import SuperAdminComingSoon from "../../super-admin/pages/SuperAdminComingSoon";

// ============================================
// Printing Admin Routes
// ============================================

const printingAdminLayoutRoutes = [
  {
    path: "/printing",

    element: (
      <ProtectedRoute
        allowedRoles={[
          "SuperAdmin",
          "PrintingAdmin",
        ]}
      >
        <PlatformLayout />
      </ProtectedRoute>
    ),

    children: [
      // ======================================
      // Default Redirect
      // ======================================

      {
        index: true,
        element: (
          <Navigate
            to="/printing/dashboard"
            replace
          />
        ),
      },

      // ======================================
      // Dashboard
      // ======================================

      {
        path: "dashboard",
        element: <PrintingAdminDashboard />,
      },

      // ======================================
      // Printing Management
      // ======================================

      {
        path: "queue",
        element: (
          <SuperAdminComingSoon
            title="Print Queue"
          />
        ),
      },

      {
        path: "completed",
        element: (
          <SuperAdminComingSoon
            title="Completed Jobs"
          />
        ),
      },

      // ======================================
      // Paper Inventory
      // ======================================

      {
        path: "paper-stock",
        element: (
          <SuperAdminComingSoon
            title="Paper Stock"
          />
        ),
      },

      {
        path: "inventory-transactions",
        element: (
          <SuperAdminComingSoon
            title="Inventory Logs"
          />
        ),
      },

      {
        path: "purchases",
        element: (
          <SuperAdminComingSoon
            title="Paper Purchases"
          />
        ),
      },

      {
        path: "distributions",
        element: (
          <SuperAdminComingSoon
            title="Paper Distribution"
          />
        ),
      },

      // ======================================
      // Operations Modules
      // ======================================

      {
        path: "tickets",
        element: (
          <SuperAdminComingSoon
            title="IT Service Desk"
          />
        ),
      },

      {
        path: "assets",
        element: (
          <SuperAdminComingSoon
            title="IT Asset Management"
          />
        ),
      },

      {
        path: "academic",
        element: (
          <SuperAdminComingSoon
            title="Academic Operations"
          />
        ),
      },

      {
        path: "observations",
        element: (
          <SuperAdminComingSoon
            title="Teacher Observations"
          />
        ),
      },

      {
        path: "communication",
        element: (
          <SuperAdminComingSoon
            title="Communication Center"
          />
        ),
      },

      // ======================================
      // Administration
      // ======================================

      {
        path: "reports",
        element: (
          <SuperAdminComingSoon
            title="Reports & Analytics"
          />
        ),
      },

      {
        path: "user-management",
        element: (
          <SuperAdminComingSoon
            title="User Management"
          />
        ),
      },

      {
        path: "master-data",
        element: (
          <SuperAdminComingSoon
            title="Master Data"
          />
        ),
      },

      {
        path: "access-levels",
        element: (
          <SuperAdminComingSoon
            title="Access Levels"
          />
        ),
      },
    ],
  },
];

export default printingAdminLayoutRoutes;
