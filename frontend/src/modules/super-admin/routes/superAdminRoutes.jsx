// ============================================
// ARAB UNITY SCHOOL
// Operations Platform
// Super Admin Routes
// Phase 3 Super Admin UI Foundation
// ============================================
//
// Description:
// Central route file for all Super Admin pages.
//
// Responsibilities:
// - Register Super Admin routes
// - Protect pages using ModuleGuard
// - Keep route definitions clean and readable
//
// ============================================

import ModuleGuard from "../../../components/permissions/ModuleGuard";
import { MODULES } from "../../../config/modules";

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
// Super Admin Route Definitions
// ============================================

const superAdminRoutes = [
  {
    path: "/super-admin/dashboard",
    element: (
      <ModuleGuard module={MODULES.SUPER_ADMIN}>
        <SuperAdminDashboard />
      </ModuleGuard>
    ),
  },
  {
    path: "/super-admin/modules",
    element: (
      <ModuleGuard module={MODULES.SUPER_ADMIN}>
        <ModuleManager />
      </ModuleGuard>
    ),
  },
  {
    path: "/super-admin/menus",
    element: (
      <ModuleGuard module={MODULES.SUPER_ADMIN}>
        <MenuManager />
      </ModuleGuard>
    ),
  },
  {
    path: "/super-admin/buttons",
    element: (
      <ModuleGuard module={MODULES.SUPER_ADMIN}>
        <ButtonManager />
      </ModuleGuard>
    ),
  },
  {
    path: "/super-admin/widgets",
    element: (
      <ModuleGuard module={MODULES.SUPER_ADMIN}>
        <WidgetManager />
      </ModuleGuard>
    ),
  },
  {
    path: "/super-admin/feature-flags",
    element: (
      <ModuleGuard module={MODULES.SUPER_ADMIN}>
        <FeatureFlags />
      </ModuleGuard>
    ),
  },
  {
    path: "/super-admin/roles",
    element: (
      <ModuleGuard module={MODULES.SUPER_ADMIN}>
        <RolesManager />
      </ModuleGuard>
    ),
  },
  {
    path: "/super-admin/permissions",
    element: (
      <ModuleGuard module={MODULES.SUPER_ADMIN}>
        <PermissionsMatrix />
      </ModuleGuard>
    ),
  },
  {
    path: "/super-admin/audit-logs",
    element: (
      <ModuleGuard module={MODULES.SUPER_ADMIN}>
        <AuditLogs />
      </ModuleGuard>
    ),
  },
  {
    path: "/super-admin/settings",
    element: (
      <ModuleGuard module={MODULES.SUPER_ADMIN}>
        <SystemSettings />
      </ModuleGuard>
    ),
  },
];

export default superAdminRoutes;