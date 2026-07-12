import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftRight,
  BarChart3,
  Bell,
  BookOpenCheck,
  Boxes,
  Building2,
  ChevronLeft,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  Users,
  Wrench,
  X,
} from "lucide-react";
import Logo from "./Logo";
import { getCurrentUser } from "../utils/auth";
import { canAccess, ROLES } from "../utils/rbac";

const nav = [
  [LayoutDashboard, "Dashboard", "/dashboard"],
  [Building2, "Organization Setup", "/dashboard/organization", "organization"],
  [Boxes, "Assets", "/dashboard/assets", "assets"],
  [Users, "Employees", "/dashboard/organization", "organization"],
  [
    ArrowLeftRight,
    "Allocation & Transfer",
    "/dashboard/allocation",
    "allocation",
  ],
  [BookOpenCheck, "Resource Booking", "/dashboard/bookings", "bookings"],
  [Wrench, "Maintenance", "/dashboard/maintenance", "maintenance"],
  [ShieldCheck, "Audit", "/dashboard/audit", "audit"],
  [BarChart3, "Reports & Analytics", "/dashboard/analytics", "analytics"],
  [Bell, "Notifications", "/dashboard/notifications", "notifications"],
  [Settings, "Settings", "/dashboard/settings", "settings"],
];

export default function DashboardSidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  onLogout,
  activePage = "Dashboard",
}) {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const visibleNav = nav.filter(([, label, , module]) =>
    label === "Dashboard"
      ? true
      : module
        ? canAccess(user?.role, module)
        : user?.role === ROLES.ADMIN,
  );
  const content = (
    <motion.aside
      animate={{ width: collapsed ? 88 : 256 }}
      className="flex h-full flex-col border-r border-slate-200/70 bg-white/90 p-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90"
    >
      <div className="flex h-12 items-center justify-between overflow-hidden">
        {!collapsed && <Logo />}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`grid size-9 place-items-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 ${collapsed ? "mx-auto" : ""}`}
          aria-label="Collapse sidebar"
        >
          <ChevronLeft className={collapsed ? "rotate-180" : ""} size={19} />
        </button>
      </div>
      <nav className="dashboard-scroll mt-8 flex-1 space-y-1.5 overflow-y-auto pr-1">
        {visibleNav.map(([Icon, label, path]) => (
          <button
            onClick={() => {
              if (path) navigate(path);
              setMobileOpen(false);
            }}
            title={collapsed ? label : ""}
            key={label}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${label === activePage ? "bg-gradient-to-r from-brand-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-500 hover:bg-slate-100 hover:text-navy-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"} ${collapsed ? "justify-center" : ""}`}
          >
            <Icon className="shrink-0" size={19} />
            {!collapsed && <span className="whitespace-nowrap">{label}</span>}
          </button>
        ))}
      </nav>
      <div className="border-t border-slate-100 pt-4 dark:border-slate-800">
        <button
          onClick={onLogout}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut size={18} />
          {!collapsed && "Logout"}
        </button>
      </div>
    </motion.aside>
  );
  return (
    <>
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">
        {content}
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              {content}
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-3 rounded-lg p-2"
              >
                <X />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
