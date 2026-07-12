import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeftRight,
  Bell,
  BellRing,
  BookOpenCheck,
  Check,
  CheckCheck,
  ChevronRight,
  ClipboardCheck,
  Filter,
  Search,
  ShieldAlert,
  Sparkles,
  Wrench,
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import AdminTopbar from "../components/AdminTopbar";
import {
  getAll,
  KEYS,
  setAll,
  update as storeUpdate,
} from "../services/storageService";

const tabs = ["All", "Maintenance", "Transfers", "Bookings", "Audits"];
const icons = {
  Maintenance: Wrench,
  Transfers: ArrowLeftRight,
  Bookings: BookOpenCheck,
  Audits: ClipboardCheck,
};
const tones = {
  Maintenance: "bg-amber-50 text-amber-600 dark:bg-amber-500/10",
  Transfers: "bg-violet-50 text-violet-600 dark:bg-violet-500/10",
  Bookings: "bg-blue-50 text-blue-600 dark:bg-blue-500/10",
  Audits: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10",
};
const priority = {
  High: "bg-red-50 text-red-600 dark:bg-red-500/10",
  Normal: "bg-blue-50 text-blue-600 dark:bg-blue-500/10",
  Low: "bg-slate-100 text-slate-500 dark:bg-slate-800",
};

function Stat({ icon: Icon, label, value, tone, onClick }) {
  return (
    <motion.button
      whileHover={{ y: -3 }}
      onClick={onClick}
      className="card flex items-center gap-4 p-4 text-left"
    >
      <span className={`grid size-11 place-items-center rounded-xl ${tone}`}>
        <Icon size={20} />
      </span>
      <div>
        <p className="text-xl font-extrabold text-navy-900 dark:text-white">
          {value}
        </p>
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
          {label}
        </p>
      </div>
    </motion.button>
  );
}
function Item({ item, onRead }) {
  const Icon = icons[item.type];
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 15 }}
      whileHover={{ x: 3 }}
      onClick={() => onRead(item.id)}
      className={`group relative cursor-pointer rounded-2xl border p-4 transition sm:p-5 ${item.unread ? "border-blue-200 bg-gradient-to-r from-blue-50/80 via-white to-white shadow-md shadow-blue-500/5 dark:border-blue-900/60 dark:from-blue-950/25 dark:via-slate-900 dark:to-slate-900" : "border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-900/75"}`}
    >
      <div className="flex items-start gap-4">
        <span
          className={`grid size-11 shrink-0 place-items-center rounded-xl ${tones[item.type]}`}
        >
          <Icon size={19} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-extrabold text-navy-900 dark:text-white">
                  {item.title}
                </h3>
                {item.unread && (
                  <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[8px] font-bold text-white">
                    UNREAD
                  </span>
                )}
              </div>
              <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-500 dark:text-slate-400">
                {item.description}
              </p>
            </div>
            <span
              className={`h-fit w-fit shrink-0 rounded-full px-2.5 py-1 text-[9px] font-bold ${priority[item.priority]}`}
            >
              {item.priority}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[9px] font-semibold text-slate-400">
            <span>{item.time}</span>
            <span>{item.type}</span>
            <span>{item.reference}</span>
            <span>By {item.actor}</span>
          </div>
        </div>
        <ChevronRight
          className="mt-3 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-brand-500"
          size={17}
        />
      </div>
      {item.unread && (
        <span className="absolute -left-0.5 top-1/2 h-9 w-1 -translate-y-1/2 rounded-r bg-brand-500" />
      )}
    </motion.article>
  );
}

export default function NotificationCenter() {
  const [collapsed, setCollapsed] = useState(false),
    [mobileOpen, setMobileOpen] = useState(false),
    [dark, setDark] = useState(
      () => localStorage.getItem("assetflow_theme") === "dark",
    );
  const [items, setItems] = useState(() => {
      const stored = getAll(KEYS.notifications);
      return stored.map((item) => ({
        ...item,
        date:
          new Date(item.time).toDateString() === new Date().toDateString()
            ? "Today"
            : "Earlier",
        time: new Date(item.time).toLocaleString(),
      }));
    }),
    [tab, setTab] = useState("All"),
    [query, setQuery] = useState(""),
    [filter, setFilter] = useState("All Notifications"),
    [toast, setToast] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("assetflow_theme", dark ? "dark" : "light");
    return () => document.documentElement.classList.remove("dark");
  }, [dark]);
  const unread = items.filter((x) => x.unread).length,
    high = items.filter((x) => x.priority === "High").length;
  const visible = useMemo(
    () =>
      items.filter(
        (x) =>
          (tab === "All" || x.type === tab) &&
          (filter === "All Notifications" ||
            (filter === "Unread" && x.unread) ||
            (filter === "Read" && !x.unread) ||
            (filter === "High Priority" && x.priority === "High")) &&
          `${x.title} ${x.description} ${x.reference} ${x.actor}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [items, tab, filter, query],
  );
  const groups = ["Today", "Yesterday", "Earlier"]
    .map((date) => [date, visible.filter((x) => x.date === date)])
    .filter(([, rows]) => rows.length);
  const read = (id) => {
    try {
      storeUpdate(KEYS.notifications, id, { unread: false });
    } catch {
      void 0;
    }
    setItems(items.map((x) => (x.id === id ? { ...x, unread: false } : x)));
  };
  const markAll = () => {
    setAll(
      KEYS.notifications,
      getAll(KEYS.notifications).map((x) => ({ ...x, unread: false })),
    );
    setItems(items.map((x) => ({ ...x, unread: false })));
    setToast("All notifications marked as read");
    setTimeout(() => setToast(""), 2200);
  };
  const logout = () => {
    localStorage.removeItem("assetflow_auth");
    navigate("/login", { replace: true });
  };
  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-300">
      <DashboardSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={logout}
        activePage="Notifications"
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
        <main className="mx-auto max-w-[1450px] p-4 sm:p-6 lg:p-8">
          <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-brand-500">
                <BellRing size={15} /> Activity & Alerts
              </p>
              <h1 className="mt-2 text-3xl font-extrabold text-navy-900 dark:text-white">
                Notification Center
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Stay informed about maintenance, transfers, bookings, audits,
                and workflow decisions.
              </p>
            </div>
            <button
              disabled={!unread}
              onClick={markAll}
              className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-bold text-brand-500 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 dark:border-blue-900 dark:bg-blue-950/25"
            >
              <CheckCheck size={17} /> Mark All Read
            </button>
          </header>
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <Stat
              icon={Bell}
              label="Total Notifications"
              value={items.length}
              tone="bg-blue-50 text-blue-600 dark:bg-blue-500/10"
              onClick={() => {
                setFilter("All Notifications");
                setTab("All");
              }}
            />
            <Stat
              icon={BellRing}
              label="Unread"
              value={unread}
              tone="bg-violet-50 text-violet-600 dark:bg-violet-500/10"
              onClick={() => setFilter("Unread")}
            />
            <Stat
              icon={ShieldAlert}
              label="High Priority"
              value={high}
              tone="bg-red-50 text-red-600 dark:bg-red-500/10"
              onClick={() => setFilter("High Priority")}
            />
          </div>
          <section className="card mt-6 overflow-hidden">
            <div className="dashboard-scroll flex gap-1 overflow-x-auto border-b px-4 pt-3 dark:border-slate-800">
              {tabs.map((x) => {
                const count =
                  x === "All"
                    ? items.length
                    : items.filter((n) => n.type === x).length;
                return (
                  <button
                    key={x}
                    onClick={() => setTab(x)}
                    className={`relative flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-semibold ${tab === x ? "text-brand-500" : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
                  >
                    {x}
                    <span
                      className={`grid min-w-5 place-items-center rounded-full px-1.5 py-0.5 text-[9px] ${tab === x ? "bg-blue-100 text-brand-500 dark:bg-blue-500/10" : "bg-slate-100 dark:bg-slate-800"}`}
                    >
                      {count}
                    </span>
                    {tab === x && (
                      <motion.span
                        layoutId="notification-tab"
                        className="absolute inset-x-2 bottom-0 h-0.5 bg-brand-500"
                      />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex flex-col gap-3 p-4 lg:flex-row">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={17}
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search notifications, references, or people..."
                  className="field pl-11"
                />
              </div>
              <label className="relative">
                <Filter
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={15}
                />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="field pl-10 lg:w-48"
                >
                  <option>All Notifications</option>
                  <option>Unread</option>
                  <option>Read</option>
                  <option>High Priority</option>
                </select>
              </label>
            </div>
          </section>
          <div className="mt-6 grid items-start gap-6 xl:grid-cols-[1fr_290px]">
            <section>
              {groups.map(([date, rows]) => (
                <div key={date} className="mb-7">
                  <div className="mb-3 flex items-center gap-3">
                    <h2 className="text-xs font-extrabold uppercase tracking-[.14em] text-slate-400">
                      {date}
                    </h2>
                    <span className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                    <span className="text-[9px] font-bold text-slate-400">
                      {rows.length}
                    </span>
                  </div>
                  <div className="relative space-y-3">
                    <AnimatePresence mode="popLayout">
                      {rows.map((item) => (
                        <Item key={item.id} item={item} onRead={read} />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
              {!visible.length && (
                <div className="card grid min-h-80 place-items-center text-center">
                  <div>
                    <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-blue-50 text-brand-500 dark:bg-blue-500/10">
                      <Check size={24} />
                    </span>
                    <h2 className="mt-4 font-extrabold text-navy-900 dark:text-white">
                      You’re all caught up
                    </h2>
                    <p className="mt-2 text-xs text-slate-400">
                      No notifications match the selected view.
                    </p>
                  </div>
                </div>
              )}
            </section>
            <aside className="grid gap-5">
              <section className="card overflow-hidden">
                <div className="bg-gradient-to-br from-navy-950 to-indigo-950 p-5 text-white">
                  <Sparkles className="text-blue-300" size={20} />
                  <h2 className="mt-4 font-extrabold">Smart Inbox</h2>
                  <p className="mt-2 text-xs leading-5 text-slate-300">
                    AssetFlow prioritizes operational risks so important actions
                    surface first.
                  </p>
                </div>
                <div className="space-y-3 p-4 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Maintenance alerts</span>
                    <b>
                      {items.filter((x) => x.type === "Maintenance").length}
                    </b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Approval requests</span>
                    <b>
                      {
                        items.filter((x) => x.type === "Transfers" && x.unread)
                          .length
                      }
                    </b>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Audit exceptions</span>
                    <b>
                      {
                        items.filter(
                          (x) => x.type === "Audits" && x.priority === "High",
                        ).length
                      }
                    </b>
                  </div>
                </div>
              </section>
              <section className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 dark:border-amber-900/50 dark:from-amber-950/25 dark:to-orange-950/20">
                <AlertTriangle className="text-amber-600" size={20} />
                <h3 className="mt-3 text-sm font-bold text-amber-900 dark:text-amber-300">
                  {high} priority items
                </h3>
                <p className="mt-1 text-xs leading-5 text-amber-700 dark:text-amber-400">
                  Review critical maintenance, transfer approvals, and audit
                  discrepancies promptly.
                </p>
                <button
                  onClick={() => setFilter("High Priority")}
                  className="mt-4 text-xs font-bold text-amber-700 dark:text-amber-300"
                >
                  Review now →
                </button>
              </section>
            </aside>
          </div>
        </main>
      </div>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-5 right-5 z-[80] flex items-center gap-3 rounded-xl bg-navy-950 px-5 py-3 text-sm font-semibold text-white shadow-2xl"
          >
            <CheckCheck size={17} className="text-emerald-400" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
