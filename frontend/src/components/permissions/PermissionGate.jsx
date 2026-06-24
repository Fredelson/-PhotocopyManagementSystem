// ============================================
// ARAB UNITY SCHOOL
// Operations Platform
// Permission Gate
// Phase 2 Frontend Foundation
// ============================================
//
// Purpose:
// Render children ONLY if user has permission
//
// Examples:
//
// Permission Key
//
// <PermissionGate permission="Users.Create">
//     <Button>Create User</Button>
// </PermissionGate>
//
// Module + Action
//
// <PermissionGate
//     module="Users"
//     action="Delete"
// >
//     <DeleteButton />
// </PermissionGate>
//
// ============================================

import { usePermissions } from "../../context/PermissionContext";

// ============================================
// Component
// ============================================

export default function PermissionGate({
  children,

  // Full permission key
  permission,

  // Module + action pair
  module,
  action,

  // Optional fallback
  fallback = null,
}) {
  const {
    hasPermission,
    canUseAction,
  } = usePermissions();

  let allowed = false;

  // ============================================
  // Direct Permission Key
  // Example:
  // Users.Create
  // ============================================

  if (permission) {
    allowed = hasPermission(permission);
  }

  // ============================================
  // Module + Action
  // Example:
  // Users + Delete
  // ============================================

  else if (module && action) {
    allowed = canUseAction(module, action);
  }

  // ============================================
  // Nothing supplied
  // ============================================

  else {
    return fallback;
  }

  if (!allowed) {
    return fallback;
  }

  return children;
}