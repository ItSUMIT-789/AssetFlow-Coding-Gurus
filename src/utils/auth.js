import { REGISTRATION_ROLES, ROLES } from "./rbac.js";
import { create, getAll, KEYS } from "../services/storageService.js";
const SESSION_KEY = "assetflow_session";
export const TEST_USERS = [
  {
    email: "abhaysonone0@gmail.com",
    password: "Abhay@9834244904",
    role: ROLES.ADMIN,
  },
  {
    email: "manager@assetflow.io",
    password: "Manager@123",
    role: ROLES.ASSET_MANAGER,
  },
  {
    email: "head@assetflow.io",
    password: "Head@123",
    role: ROLES.DEPARTMENT_HEAD,
  },
  {
    email: "employee@assetflow.io",
    password: "Employee@123",
    role: ROLES.EMPLOYEE,
  },
];
export const getRegisteredUsers = () => getAll(KEYS.users);
export function registerUser(payload) {
  if (!REGISTRATION_ROLES.some((role) => role.value === payload.role))
    throw new Error("This role cannot be selected during registration.");
  const users = getRegisteredUsers();
  if (users.some((x) => x.email.toLowerCase() === payload.email.toLowerCase()))
    throw new Error("An account already exists for this email.");
  return create(KEYS.users, { ...payload, active: true });
}
export function loginUser(email, password) {
  const user = getRegisteredUsers().find(
    (x) =>
      x.active !== false &&
      x.email.toLowerCase() === email.toLowerCase() &&
      x.password === password,
  );
  if (!user) throw new Error("Invalid email or password.");
  return createSession(user);
}
function createSession(user) {
  const { password: _, ...safe } = user;
  void _;
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ ...safe, authenticated: true, issuedAt: Date.now() }),
  );
  localStorage.setItem("assetflow_auth", "true");
  return safe;
}
export function loginAsDemoAdmin() {
  const admin = getRegisteredUsers().find(
    (user) => user.active !== false && user.role === ROLES.ADMIN,
  );
  if (!admin) throw new Error("Demo administrator account is unavailable.");
  return createSession(admin);
}
export function getCurrentUser() {
  try {
    if (localStorage.getItem("assetflow_auth") !== "true") return null;
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    return session?.authenticated && Object.values(ROLES).includes(session.role)
      ? session
      : null;
  } catch {
    return null;
  }
}
export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("assetflow_auth");
}
export const dashboardPathForRole = () => "/dashboard";
