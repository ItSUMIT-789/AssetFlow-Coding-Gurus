import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  ChevronDown,
  ClipboardPlus,
  Clock3,
  Menu,
  Moon,
  Plus,
  Search,
  Sun,
  UserPlus,
  Wrench,
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import {
  activities,
  chartData,
  kpis as kpiDefinitions,
  maintenance,
  notifications,
  utilization,
} from "../data/dashboardData";
import {
  calculateDashboardStats,
  getAll,
  KEYS,
} from "../services/storageService";

const tone = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10",
  indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10",
  violet: "bg-violet-50 text-violet-600 dark:bg-violet-500/10",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10",
  cyan: "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10",
};
const Card = ({ children, className = "" }) => (
  <section
    className={`rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80 ${className}`}
  >
    {children}
  </section>
);
const Header = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between gap-3 px-5 pt-5">
    <div>
      <h2 className="font-bold text-navy-900 dark:text-white">{title}</h2>
      {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
    </div>
    {action}
  </div>
);
const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  boxShadow: "0 10px 30px rgba(15,23,42,.1)",
  fontSize: 12,
};

function Topbar({ dark, setDark, setMobileOpen }) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center gap-3 border-b border-slate-200/70 bg-slate-50/85 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85 sm:px-6">
      <button
        onClick={() => setMobileOpen(true)}
        className="grid size-10 place-items-center rounded-xl bg-white text-slate-600 shadow-sm dark:bg-slate-900 lg:hidden"
        aria-label="Open navigation"
      >
        <Menu size={20} />
      </button>
      <div className="relative hidden max-w-md flex-1 sm:block">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          size={18}
        />
        <input
          aria-label="Search"
          placeholder="Search assets, employees, bookings..."
          className="w-full rounded-xl border border-slate-200 bg-white/80 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:ring-blue-950"
        />
      </div>
      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => setDark(!dark)}
          aria-label="Toggle dark mode"
          className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:text-brand-500 dark:border-slate-800 dark:bg-slate-900 dark:text-amber-300"
        >
          {dark ? <Sun size={19} /> : <Moon size={19} />}
        </button>
        <button
          aria-label="Notifications"
          className="relative grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 dark:border-slate-800 dark:bg-slate-900"
        >
          <Bell size={19} />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
        </button>
        <div className="ml-1 flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 text-xs font-bold text-white">
            AS
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-navy-900 dark:text-white">
              Abhay Sonone
            </p>
            <p className="text-[10px] text-slate-400">Administrator</p>
          </div>
          <ChevronDown className="hidden text-slate-400 sm:block" size={14} />
        </div>
      </div>
    </header>
  );
}
function KpiCard({ item, index }) {
  const I = item.icon;
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -4 }}
      className={`rounded-2xl border border-slate-200/70 bg-gradient-to-br ${item.gradient} via-white to-white p-5 shadow-sm backdrop-blur-xl transition-all duration-300 dark:border-slate-800 dark:via-slate-900 dark:to-slate-900`}
    >
      <div className="flex items-start justify-between">
        <span
          className={`grid size-11 place-items-center rounded-xl ${tone[item.tone]}`}
        >
          <I size={21} />
        </span>
        <span
          className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${item.up ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10" : "bg-red-50 text-red-500 dark:bg-red-500/10"}`}
        >
          {item.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{" "}
          {item.trend}
        </span>
      </div>
      <p className="mt-5 text-2xl font-extrabold tracking-tight text-navy-900 dark:text-white">
        {item.value}
      </p>
      <p className="mt-1 text-xs font-medium text-slate-400">{item.label}</p>
    </motion.article>
  );
}
function Charts() {
  return (
    <div className="grid gap-5 xl:grid-cols-[1.65fr_1fr]">
      <Card className="min-w-0">
        <Header
          title="Asset Overview"
          subtitle="Allocation performance over the last 6 months"
          action={
            <button className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 dark:border-slate-700">
              Last 6 months
            </button>
          }
        />
        <div className="h-72 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ left: -20, right: 6, top: 10 }}
            >
              <defs>
                <linearGradient id="allocated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3563e9" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3563e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                stroke="#e2e8f0"
                opacity={0.6}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="allocated"
                stroke="#3563e9"
                strokeWidth={3}
                fill="url(#allocated)"
              />
              <Area
                type="monotone"
                dataKey="available"
                stroke="#10b981"
                strokeWidth={2}
                fill="transparent"
                strokeDasharray="5 5"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card>
        <Header
          title="Asset Utilization"
          subtitle="Current portfolio distribution"
        />
        <div className="relative h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={utilization}
                dataKey="value"
                innerRadius={61}
                outerRadius={82}
                paddingAngle={4}
                stroke="none"
              >
                {utilization.map((x) => (
                  <Cell key={x.name} fill={x.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="text-center">
              <b className="text-2xl text-navy-900 dark:text-white">1,284</b>
              <p className="text-[10px] text-slate-400">TOTAL</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 px-5 pb-5">
          {utilization.map((x) => (
            <div key={x.name} className="text-center">
              <span
                className="mx-auto block size-2 rounded-full"
                style={{ background: x.color }}
              />
              <b className="mt-1 block text-xs text-slate-700 dark:text-slate-200">
                {x.value}%
              </b>
              <span className="text-[9px] text-slate-400">{x.name}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
function MiniCalendar() {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const nums = [
    29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2,
  ];
  return (
    <Card>
      <Header
        title="July 2026"
        action={<CalendarDays size={18} className="text-brand-500" />}
      />
      <div className="grid grid-cols-7 gap-1 p-5 pt-4 text-center">
        {days.map((d, i) => (
          <span key={i} className="pb-2 text-[10px] font-bold text-slate-400">
            {d}
          </span>
        ))}
        {nums.map((n, i) => (
          <span
            key={i}
            className={`grid aspect-square place-items-center rounded-lg text-[11px] ${i < 2 || i > 32 ? "text-slate-300 dark:text-slate-700" : n === 12 ? "bg-brand-500 font-bold text-white shadow-md shadow-blue-500/30" : n === 18 || n === 21 || n === 25 ? "bg-blue-50 font-semibold text-brand-500 dark:bg-blue-500/10" : "text-slate-600 dark:text-slate-300"}`}
          >
            {n}
          </span>
        ))}
      </div>
    </Card>
  );
}
export default function Dashboard() {
  const stats = calculateDashboardStats(),
    users = getAll(KEYS.users);
  const values = {
    "Total Assets": stats.totalAssets,
    "Allocated Assets": stats.allocatedAssets,
    "Available Assets": stats.availableAssets,
    Employees: users.length,
    "Active Bookings": stats.activeBookings,
    "Pending Maintenance": stats.pendingMaintenance,
    "Pending Transfers": stats.pendingTransfers,
    "Upcoming Returns": getAll(KEYS.allocations).filter(
      (a) => a.status === "ACTIVE" && a.expectedReturnDate,
    ).length,
  };
  const kpis = kpiDefinitions.map((item) => ({
    ...item,
    value: String(values[item.label] ?? item.value),
  }));
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [createMenu, setCreateMenu] = useState(false);
  const [dark, setDark] = useState(
    () => localStorage.getItem("assetflow_theme") === "dark",
  );
  const navigate = useNavigate();
  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date());
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("assetflow_theme", dark ? "dark" : "light");
    return () => document.documentElement.classList.remove("dark");
  }, [dark]);
  const logout = () => {
    localStorage.removeItem("assetflow_auth");
    navigate("/login", { replace: true });
  };
  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 transition-colors dark:bg-slate-950 dark:text-slate-300">
      <DashboardSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={logout}
      />
      <div
        className="transition-[margin] duration-300 lg:ml-[var(--side)]"
        style={{ "--side": collapsed ? "88px" : "256px" }}
      >
        <Topbar dark={dark} setDark={setDark} setMobileOpen={setMobileOpen} />
        <main className="dashboard-scroll mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold text-brand-500">{today}</p>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-navy-900 dark:text-white sm:text-3xl">
                Good Morning, Abhay 👋
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Welcome back! Here's an overview of your organization's assets
                and operations.
              </p>
            </div>
            <div className="relative">
              <button
                onClick={() => setCreateMenu(!createMenu)}
                aria-expanded={createMenu}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-brand-600 sm:w-auto"
              >
                <Plus
                  className={`transition ${createMenu ? "rotate-45" : ""}`}
                  size={18}
                />{" "}
                Create New
              </button>
              <AnimatePresence>
                {createMenu && (
                  <>
                    <button
                      aria-label="Close quick create menu"
                      onClick={() => setCreateMenu(false)}
                      className="fixed inset-0 z-30 cursor-default"
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      className="absolute right-0 top-12 z-40 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
                    >
                      {[
                        [
                          Plus,
                          "Register Asset",
                          "Create a new tracked asset",
                          "/dashboard/assets?create=1",
                        ],
                        [
                          UserPlus,
                          "Add Employee",
                          "Open organization users",
                          "/dashboard/organization",
                        ],
                        [
                          CalendarDays,
                          "Book Resource",
                          "Reserve shared resources",
                          "/dashboard/bookings",
                        ],
                        [
                          ClipboardPlus,
                          "Maintenance Request",
                          "Open maintenance workflow",
                          "/dashboard/maintenance",
                        ],
                      ].map(([Icon, title, copy, path]) => (
                        <button
                          key={title}
                          onClick={() => {
                            setCreateMenu(false);
                            navigate(path);
                          }}
                          className="flex w-full items-center gap-3 rounded-xl p-3 text-left transition hover:bg-blue-50 dark:hover:bg-blue-950/30"
                        >
                          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-brand-500 dark:bg-blue-500/10">
                            <Icon size={17} />
                          </span>
                          <span>
                            <b className="block text-xs text-navy-900 dark:text-white">
                              {title}
                            </b>
                            <span className="mt-0.5 block text-[10px] text-slate-400">
                              {copy}
                            </span>
                          </span>
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-8">
            {kpis.map((x, i) => (
              <KpiCard key={x.label} item={x} index={i} />
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-5 flex flex-col gap-4 rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-orange-50 p-4 dark:border-red-900/50 dark:from-red-950/30 dark:to-orange-950/20 sm:flex-row sm:items-center"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-red-100 text-red-600 dark:bg-red-500/15">
              <Clock3 size={20} />
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold text-red-900 dark:text-red-300">
                {stats.overdueReturns} assets overdue for return
              </p>
              <p className="mt-0.5 text-xs text-red-600/80 dark:text-red-400">
                Review outstanding assignments to avoid workflow delays.
              </p>
            </div>
            <button className="flex items-center gap-2 text-xs font-bold text-red-600">
              Review assets <ArrowRight size={14} />
            </button>
          </motion.div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              [
                Plus,
                "Register Asset",
                "bg-blue-50 text-blue-600 dark:bg-blue-500/10",
              ],
              [
                UserPlus,
                "Add Employee",
                "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10",
              ],
              [
                CalendarDays,
                "Book Resource",
                "bg-violet-50 text-violet-600 dark:bg-violet-500/10",
              ],
              [
                ClipboardPlus,
                "Raise Maintenance Request",
                "bg-amber-50 text-amber-600 dark:bg-amber-500/10",
              ],
            ].map(([I, t, c]) => (
              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                key={t}
                className="flex items-center gap-3 rounded-2xl border border-slate-200/70 bg-white p-4 text-left text-sm font-bold text-navy-900 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-white"
              >
                <span
                  className={`grid size-10 place-items-center rounded-xl ${c}`}
                >
                  <I size={19} />
                </span>
                {t}
                <ArrowRight className="ml-auto text-slate-300" size={16} />
              </motion.button>
            ))}
          </div>
          <div className="mt-5">
            <Charts />
          </div>
          <div className="mt-5 grid items-start gap-5 xl:grid-cols-[1.55fr_1fr]">
            <Card>
              <Header
                title="Recent Activity"
                subtitle="Live updates across your organization"
                action={
                  <button className="text-xs font-bold text-brand-500">
                    View all
                  </button>
                }
              />
              <div className="p-5">
                {activities.map((x, i) => (
                  <div
                    key={x.title}
                    className="relative flex gap-4 pb-5 last:pb-0"
                  >
                    <div className="relative">
                      <span
                        className={`block size-3 rounded-full ring-4 ring-${x.color}-50 bg-${x.color}-500 dark:ring-slate-800`}
                      />
                      {i < activities.length - 1 && (
                        <span className="absolute left-[5px] top-4 h-full w-px bg-slate-200 dark:bg-slate-800" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col justify-between gap-1 sm:flex-row">
                        <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                          {x.title}
                        </p>
                        <span className="w-fit rounded-full bg-slate-100 px-2 py-1 text-[9px] font-bold uppercase text-slate-500 dark:bg-slate-800">
                          {x.type}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-400">{x.meta}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            <div className="grid gap-5">
              <Card>
                <Header
                  title="Upcoming Maintenance"
                  action={<Wrench size={18} className="text-amber-500" />}
                />
                <div className="space-y-4 p-5">
                  {maintenance.map((x) => (
                    <div key={x.title} className="flex items-center gap-3">
                      <div className="w-11 rounded-xl bg-slate-100 py-1.5 text-center dark:bg-slate-800">
                        <b className="block text-sm text-navy-900 dark:text-white">
                          {x.date}
                        </b>
                        <span className="text-[8px] font-bold text-slate-400">
                          {x.month}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-slate-700 dark:text-slate-200">
                          {x.title}
                        </p>
                        <p className="mt-1 truncate text-[10px] text-slate-400">
                          {x.meta}
                        </p>
                      </div>
                      <span className="text-[9px] font-bold text-amber-500">
                        {x.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
              <Card>
                <Header
                  title="Recent Notifications"
                  action={<Bell size={18} className="text-brand-500" />}
                />
                <div className="space-y-4 p-5">
                  {notifications.map((x) => (
                    <div key={x.title} className="flex gap-3">
                      <span className="mt-1 size-2 shrink-0 rounded-full bg-brand-500" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                          {x.title}
                        </p>
                        <p className="mt-1 truncate text-[10px] text-slate-400">
                          {x.meta}
                        </p>
                      </div>
                      <span className="text-[9px] text-slate-400">
                        {x.time}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
              <MiniCalendar />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
