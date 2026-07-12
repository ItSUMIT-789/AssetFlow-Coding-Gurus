export const ROLES = Object.freeze({
  ADMIN: "ADMIN",
  ASSET_MANAGER: "ASSET_MANAGER",
  DEPARTMENT_HEAD: "DEPARTMENT_HEAD",
  EMPLOYEE: "EMPLOYEE",
});
export const REGISTRATION_ROLES = [
  { value: ROLES.ASSET_MANAGER, label: "Asset Manager" },
  { value: ROLES.DEPARTMENT_HEAD, label: "Department Head" },
  { value: ROLES.EMPLOYEE, label: "Employee" },
];
export const ROLE_LABELS = {
  ADMIN: "Administrator",
  ASSET_MANAGER: "Asset Manager",
  DEPARTMENT_HEAD: "Department Head",
  EMPLOYEE: "Employee",
};
export const ROUTE_ROLES = {
  organization: [ROLES.ADMIN],
  assets: [ROLES.ADMIN, ROLES.ASSET_MANAGER, ROLES.DEPARTMENT_HEAD],
  allocation: [
    ROLES.ADMIN,
    ROLES.ASSET_MANAGER,
    ROLES.DEPARTMENT_HEAD,
    ROLES.EMPLOYEE,
  ],
  bookings: Object.values(ROLES),
  maintenance: Object.values(ROLES),
  audit: [ROLES.ADMIN, ROLES.ASSET_MANAGER],
  analytics: [ROLES.ADMIN, ROLES.ASSET_MANAGER, ROLES.DEPARTMENT_HEAD],
  notifications: Object.values(ROLES),
  settings: [ROLES.ADMIN],
};
export const canAccess = (role, module) =>
  Boolean(role && ROUTE_ROLES[module]?.includes(role));
