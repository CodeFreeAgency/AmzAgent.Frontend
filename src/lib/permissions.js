export const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

export const PERMISSIONS = {
  INVENTORY_READ: "inventory:read",
  SETTINGS_READ: "settings:read",
  SETTINGS_WRITE: "settings:write",
  WAREHOUSE_STAFF_VIEW: "warehouse_staff:view",
  ORDER_SYNC_UPLOAD: "order_sync:upload",
};

const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.USER]: [],
};

export function getPermissionsForRole(role) {
  return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS[ROLES.USER];
}

export function hasPermission(role, permission) {
  return getPermissionsForRole(role).includes(permission);
}

export function getRoleLabel(role) {
  if (role === ROLES.ADMIN) return "Administrator";
  if (role === ROLES.USER) return "User";
  return "User";
}
