import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeftRight,
  BookOpenCheck,
  Boxes,
  Building2,
  ClipboardList,
  Plus,
  Wrench,
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import AdminTopbar from "../components/AdminTopbar";
import { getCurrentUser, logoutUser } from "../utils/auth";
import { ROLE_LABELS, ROLES } from "../utils/rbac";
import { getAll, KEYS } from "../services/storageService";
const configs = {
  ASSET_MANAGER: {
    title: "Asset Operations Dashboard",
    copy: "Manage asset lifecycle, approvals, maintenance, and audit exceptions.",
    cards: [
      [Boxes, "Managed Assets", "1,284"],
      [ArrowLeftRight, "Pending Transfers", "14"],
      [Wrench, "Maintenance Approvals", "8"],
      [ClipboardList, "Audit Exceptions", "3"],
    ],
  },
  DEPARTMENT_HEAD: {
    title: "Department Dashboard",
    copy: "Monitor assets, approvals, bookings, and utilization within your department.",
    cards: [
      [Building2, "Department Assets", "92"],
      [ArrowLeftRight, "Pending Approvals", "5"],
      [BookOpenCheck, "Active Bookings", "11"],
      [Boxes, "Available Assets", "24"],
    ],
  },
  EMPLOYEE: {
    title: "My AssetFlow",
    copy: "View your assigned assets, bookings, requests, and notifications.",
    cards: [
      [Boxes, "My Assets", "3"],
      [BookOpenCheck, "My Bookings", "2"],
      [Wrench, "Open Requests", "1"],
      [ArrowLeftRight, "Transfer Requests", "1"],
    ],
  },
};
export default function RoleDashboard() {
  const [collapsed, setCollapsed] = useState(false),
    [mobileOpen, setMobileOpen] = useState(false),
    [dark, setDark] = useState(
      () => localStorage.getItem("assetflow_theme") === "dark",
    );
  const user = getCurrentUser(),
    cfg = configs[user?.role] || configs.EMPLOYEE,
    navigate = useNavigate();
  const assets = getAll(KEYS.assets),
    bookings = getAll(KEYS.bookings),
    maintenance = getAll(KEYS.maintenance),
    transfers = getAll(KEYS.transfers),
    audits = getAll(KEYS.audits);
  const cards =
    user?.role === ROLES.EMPLOYEE
      ? [
          [
            Boxes,
            "My Assets",
            assets.filter((a) => a.currentHolderId === user.id).length,
          ],
          [
            BookOpenCheck,
            "My Bookings",
            bookings.filter(
              (b) => b.userId === user.id && b.status !== "CANCELLED",
            ).length,
          ],
          [
            Wrench,
            "Open Requests",
            maintenance.filter(
              (m) => m.requestedBy === user.id && m.status !== "RESOLVED",
            ).length,
          ],
          [
            ArrowLeftRight,
            "Transfer Requests",
            transfers.filter((t) => t.requestedBy === user.id).length,
          ],
        ]
      : user?.role === ROLES.DEPARTMENT_HEAD
        ? [
            [
              Building2,
              "Department Assets",
              assets.filter((a) => a.department === user.department).length,
            ],
            [
              ArrowLeftRight,
              "Pending Approvals",
              transfers.filter(
                (t) =>
                  t.department === user.department && t.status === "PENDING",
              ).length,
            ],
            [
              BookOpenCheck,
              "Active Bookings",
              bookings.filter(
                (b) =>
                  b.department === user.department && b.status !== "CANCELLED",
              ).length,
            ],
            [
              Boxes,
              "Available Assets",
              assets.filter(
                (a) =>
                  a.department === user.department && a.status === "AVAILABLE",
              ).length,
            ],
          ]
        : [
            [Boxes, "Managed Assets", assets.length],
            [
              ArrowLeftRight,
              "Pending Transfers",
              transfers.filter((t) => t.status === "PENDING").length,
            ],
            [
              Wrench,
              "Maintenance Approvals",
              maintenance.filter((m) => m.status === "PENDING").length,
            ],
            [
              ClipboardList,
              "Audit Exceptions",
              audits.flatMap((a) => a.discrepancies || []).length,
            ],
          ];
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    return () => document.documentElement.classList.remove("dark");
  }, [dark]);
  const actions =
    user?.role === ROLES.EMPLOYEE
      ? [
          [BookOpenCheck, "Book Resource", "/dashboard/bookings"],
          [ArrowLeftRight, "Request Transfer", "/dashboard/allocation"],
        ]
      : [
          [Boxes, "View Assets", "/dashboard/assets"],
          [ArrowLeftRight, "Review Transfers", "/dashboard/allocation"],
        ];
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={() => {
          logoutUser();
          navigate("/login");
        }}
      />
      <div
        className="transition-[margin] duration-300 lg:ml-[var(--side)]"
        style={{ "--side": collapsed ? "88px" : "256px" }}
      >
        <AdminTopbar
          dark={dark}
          setDark={setDark}
          setMobileOpen={setMobileOpen}
        />
        <main className="mx-auto max-w-7xl p-5 lg:p-8">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-500">
            {ROLE_LABELS[user?.role]} · {user?.department}
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-navy-900 dark:text-white">
            Welcome back, {user?.name.split(" ")[0]} 👋
          </h1>
          <p className="mt-2 text-sm text-slate-400">{cfg.copy}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map(([Icon, label, value], i) => (
              <motion.article
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                key={label}
                className="card p-5"
              >
                <Icon className="text-brand-500" />
                <b className="mt-5 block text-2xl text-navy-900 dark:text-white">
                  {value}
                </b>
                <span className="text-xs text-slate-400">{label}</span>
              </motion.article>
            ))}
          </div>
          <section className="card mt-6 p-6">
            <h2 className="font-extrabold text-navy-900 dark:text-white">
              Quick Actions
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {actions.map(([Icon, label, path]) => (
                <button
                  key={label}
                  onClick={() => navigate(path)}
                  className="flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-3 text-sm font-bold text-white"
                >
                  <Icon size={17} />
                  {label}
                </button>
              ))}
              {user?.role === ROLES.EMPLOYEE && (
                <button className="flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold dark:border-slate-700">
                  <Plus size={17} /> Raise Maintenance Request
                </button>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
