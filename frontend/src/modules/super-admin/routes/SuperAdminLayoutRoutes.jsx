// ============================================
// ARAB UNITY SCHOOL
// Operations Platform
// Super Admin Layout Routes
// Phase 3 Super Admin UI Foundation
// ============================================
//
// Description:
// Central nested route configuration for all
// Super Admin pages using SuperAdminLayout.
//
// Responsibilities:
// - Wrap all Super Admin pages inside one layout
// - Keep route structure clean
// - Avoid repeating layout code per page
// - Prepare for future route permission control
//
// ============================================

import { Navigate } from "react-router-dom";

import ModuleGuard from "../../../components/permissions/ModuleGuard";
import { MODULES } from "../../../config/modules";

import SuperAdminLayout from "../layout/SuperAdminLayout";

import SuperAdminDashboard from "../pages/SuperAdminDashboard";
import ModuleManager from "../pages/ModuleManager";
import MenuManager from "../pages/MenuManager";
import ButtonManager from "../pages/ButtonManager";
import WidgetManager from "../pages/WidgetManager";
import FeatureFlags from "../pages/FeatureFlags";
import RolesManager from "../pages/RolesManager";
import PermissionsMatrix from "../pages/PermissionsMatrix";
import AuditLogs from "../pages/AuditLogs";
import SystemSettings from "../pages/SystemSettings";

// ============================================
// Super Admin Nested Layout Route
// ============================================

const superAdminLayoutRoutes = [
  {
    path: "/super-admin",
    element: (
      <ModuleGuard module={MODULES.SUPER_ADMIN}>
        <SuperAdminLayout />
      </ModuleGuard>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/super-admin/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <SuperAdminDashboard />,
      },
      {
        path: "modules",
        element: <ModuleManager />,
      },
      {
        path: "menus",
        element: <MenuManager />,
      },
      {
        path: "buttons",
        element: <ButtonManager />,
      },
      {
        path: "widgets",
        element: <WidgetManager />,
      },
      {
        path: "feature-flags",
        element: <FeatureFlags />,
      },
      {
        path: "roles",
        element: <RolesManager />,
      },
      {
        path: "permissions",
        element: <PermissionsMatrix />,
      },
      {
        path: "audit-logs",
        element: <AuditLogs />,
      },
      {
        path: "settings",
        element: <SystemSettings />,
      },
    ],
  },
];

export default superAdminLayoutRoutes;