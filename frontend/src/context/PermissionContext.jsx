// ============================================
// ARAB UNITY SCHOOL
// Operations Platform
// Permission Context
// Phase 2 Frontend Foundation
// ============================================

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import permissionService from "../services/permissionService";
import { useAuth } from "./AuthContext";

const PermissionContext = createContext(null);

export const PermissionProvider = ({ children }) => {
  const { user } = useAuth();

  const [permissions, setPermissions] = useState([]);
  const [modules, setModules] = useState([]);
  const [actions, setActions] = useState([]);
  const [widgets, setWidgets] = useState([]);
  const [featureFlags, setFeatureFlags] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ============================================
  // Load Current User Permission Foundation
  // ============================================

  const loadPermissions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError("");

      const [
        permissionData,
        moduleData,
        actionData,
        widgetData,
        flagData,
      ] = await Promise.all([
        permissionService.getMyPermissions(),
        permissionService.getMyModules(),
        permissionService.getMyActions(),
        permissionService.getMyWidgets(),
        permissionService.getFeatureFlags(),
      ]);

      setPermissions(permissionData?.permissions || permissionData || []);
      setModules(moduleData?.modules || moduleData || []);
      setActions(actionData?.actions || actionData || []);
      setWidgets(widgetData?.widgets || widgetData || []);
      setFeatureFlags(flagData?.featureFlags || flagData || []);
    } catch (err) {
      console.error("Permission loading failed:", err);
      setError("Failed to load permissions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // ============================================
  // Reusable Permission Helpers
  // ============================================

  const value = useMemo(
    () => ({
      permissions,
      modules,
      actions,
      widgets,
      featureFlags,
      loading,
      error,
      reloadPermissions: loadPermissions,

      hasPermission: (permissionKey) =>
        permissionService.hasPermission(permissions, permissionKey),

      canAccessModule: (moduleName) =>
        permissionService.canAccessModule(modules, moduleName),

      canUseAction: (moduleName, actionName) =>
        permissionService.canUseAction(actions, moduleName, actionName),

      canSeeWidget: (widgetName) =>
        permissionService.canSeeWidget(widgets, widgetName),

      isFeatureEnabled: (flagName) =>
        permissionService.isFeatureEnabled(featureFlags, flagName),

      hasRole: (roleName) =>
        permissionService.hasRole(user, roleName),

      canView: (moduleName) =>
        permissionService.canView(permissions, moduleName),

      canCreate: (moduleName) =>
        permissionService.canCreate(permissions, moduleName),

      canEdit: (moduleName) =>
        permissionService.canEdit(permissions, moduleName),

      canDelete: (moduleName) =>
        permissionService.canDelete(permissions, moduleName),

      canApprove: (moduleName) =>
        permissionService.canApprove(permissions, moduleName),

      canReject: (moduleName) =>
        permissionService.canReject(permissions, moduleName),

      canExport: (moduleName) =>
        permissionService.canExport(permissions, moduleName),
    }),
    [
      permissions,
      modules,
      actions,
      widgets,
      featureFlags,
      loading,
      error,
      user,
    ]
  );

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

// ============================================
// Hook
// ============================================

export const usePermissions = () => {
  const context = useContext(PermissionContext);

  if (!context) {
    throw new Error(
      "usePermissions must be used inside PermissionProvider"
    );
  }

  return context;
};

export default PermissionContext;