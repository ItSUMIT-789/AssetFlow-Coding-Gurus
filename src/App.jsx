import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Forbidden from "./pages/Forbidden";
import { getCurrentUser } from "./utils/auth";
import { ROLES, ROUTE_ROLES } from "./utils/rbac";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const OrganizationSetup = lazy(() => import("./pages/OrganizationSetup"));
const AssetDirectory = lazy(() => import("./pages/AssetDirectory"));
const AssetAllocation = lazy(() => import("./pages/AssetAllocation"));
const ResourceBooking = lazy(() => import("./pages/ResourceBooking"));
const MaintenanceManagement = lazy(
  () => import("./pages/MaintenanceManagement"),
);
const AuditManagement = lazy(() => import("./pages/AuditManagement"));
const AnalyticsDashboard = lazy(() => import("./pages/AnalyticsDashboard"));
const NotificationCenter = lazy(() => import("./pages/NotificationCenter"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const RoleDashboard = lazy(() => import("./pages/RoleDashboard"));
const MaintenanceRequestPage = lazy(
  () => import("./pages/MaintenanceRequestPage"),
);

function DashboardEntry() {
  return getCurrentUser()?.role === ROLES.ADMIN ? (
    <Dashboard />
  ) : (
    <RoleDashboard />
  );
}
function MaintenanceEntry() {
  return [ROLES.ADMIN, ROLES.ASSET_MANAGER].includes(getCurrentUser()?.role) ? (
    <MaintenanceManagement />
  ) : (
    <MaintenanceRequestPage />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forbidden" element={<Forbidden />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Suspense
                fallback={
                  <div className="grid min-h-screen place-items-center bg-slate-50">
                    <div className="size-9 animate-spin rounded-full border-4 border-blue-100 border-t-brand-500" />
                  </div>
                }
              >
                <DashboardEntry />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/organization"
          element={
            <ProtectedRoute allowedRoles={ROUTE_ROLES.organization}>
              <Suspense
                fallback={
                  <div className="grid min-h-screen place-items-center bg-slate-50">
                    <div className="size-9 animate-spin rounded-full border-4 border-blue-100 border-t-brand-500" />
                  </div>
                }
              >
                <OrganizationSetup />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/assets"
          element={
            <ProtectedRoute allowedRoles={ROUTE_ROLES.assets}>
              <Suspense
                fallback={
                  <div className="grid min-h-screen place-items-center bg-slate-50">
                    <div className="size-9 animate-spin rounded-full border-4 border-blue-100 border-t-brand-500" />
                  </div>
                }
              >
                <AssetDirectory />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/allocation"
          element={
            <ProtectedRoute allowedRoles={ROUTE_ROLES.allocation}>
              <Suspense
                fallback={
                  <div className="grid min-h-screen place-items-center bg-slate-50">
                    <div className="size-9 animate-spin rounded-full border-4 border-blue-100 border-t-brand-500" />
                  </div>
                }
              >
                <AssetAllocation />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/bookings"
          element={
            <ProtectedRoute allowedRoles={ROUTE_ROLES.bookings}>
              <Suspense
                fallback={
                  <div className="grid min-h-screen place-items-center bg-slate-50">
                    <div className="size-9 animate-spin rounded-full border-4 border-blue-100 border-t-brand-500" />
                  </div>
                }
              >
                <ResourceBooking />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/maintenance"
          element={
            <ProtectedRoute allowedRoles={ROUTE_ROLES.maintenance}>
              <Suspense
                fallback={
                  <div className="grid min-h-screen place-items-center bg-slate-50">
                    <div className="size-9 animate-spin rounded-full border-4 border-blue-100 border-t-brand-500" />
                  </div>
                }
              >
                <MaintenanceEntry />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/audit"
          element={
            <ProtectedRoute allowedRoles={ROUTE_ROLES.audit}>
              <Suspense
                fallback={
                  <div className="grid min-h-screen place-items-center bg-slate-50">
                    <div className="size-9 animate-spin rounded-full border-4 border-blue-100 border-t-brand-500" />
                  </div>
                }
              >
                <AuditManagement />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/analytics"
          element={
            <ProtectedRoute allowedRoles={ROUTE_ROLES.analytics}>
              <Suspense
                fallback={
                  <div className="grid min-h-screen place-items-center bg-slate-50">
                    <div className="size-9 animate-spin rounded-full border-4 border-blue-100 border-t-brand-500" />
                  </div>
                }
              >
                <AnalyticsDashboard />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/notifications"
          element={
            <ProtectedRoute allowedRoles={ROUTE_ROLES.notifications}>
              <Suspense
                fallback={
                  <div className="grid min-h-screen place-items-center bg-slate-50">
                    <div className="size-9 animate-spin rounded-full border-4 border-blue-100 border-t-brand-500" />
                  </div>
                }
              >
                <NotificationCenter />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/settings"
          element={
            <ProtectedRoute allowedRoles={ROUTE_ROLES.settings}>
              <Suspense
                fallback={
                  <div className="grid min-h-screen place-items-center bg-slate-50">
                    <div className="size-9 animate-spin rounded-full border-4 border-blue-100 border-t-brand-500" />
                  </div>
                }
              >
                <SettingsPage />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
