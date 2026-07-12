import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeftRight,
  Bell,
  BellRing,
  Boxes,
  CheckCheck,
  ChevronRight,
  Clock3,
  X,
  Wrench,
  Users,
} from "lucide-react";

const demoNotifications = [
  {
    id: 1,
    type: "assigned",
    title: "New Asset Assigned",
    description: "MacBook Pro 16 has been assigned to Rahul Sharma.",
    time: "2 minutes ago",
    unread: true,
    icon: Boxes,
    iconTone: "bg-blue-50 text-blue-600 dark:bg-blue-500/10",
    badgeTone: "bg-brand-500 text-white",
  },
  {
    id: 2,
    type: "maintenance",
    title: "Maintenance Request",
    description: "Printer HP LaserJet requires maintenance approval.",
    time: "18 minutes ago",
    unread: true,
    icon: Wrench,
    iconTone: "bg-amber-50 text-amber-600 dark:bg-amber-500/10",
    badgeTone: "bg-amber-500 text-white",
  },
  {
    id: 3,
    type: "transfer",
    title: "Asset Transfer",
    description: "Transfer request for Dell Latitude has been submitted.",
    time: "45 minutes ago",
    unread: true,
    icon: ArrowLeftRight,
    iconTone: "bg-violet-50 text-violet-600 dark:bg-violet-500/10",
    badgeTone: "bg-violet-500 text-white",
  },
  {
    id: 4,
    type: "return",
    title: "Upcoming Return",
    description: "Canon Camera should be returned tomorrow.",
    time: "Tomorrow",
    unread: false,
    icon: CheckCheck,
    iconTone: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10",
    badgeTone: "bg-emerald-500 text-white",
  },
  {
    id: 5,
    type: "audit",
    title: "Audit Reminder",
    description: "Monthly asset audit is scheduled for next week.",
    time: "1 day ago",
    unread: true,
    icon: AlertTriangle,
    iconTone: "bg-rose-50 text-rose-600 dark:bg-rose-500/10",
    badgeTone: "bg-rose-500 text-white",
  },
  {
    id: 6,
    type: "employee",
    title: "New Employee",
    description: "Priya Patel joined the Engineering department.",
    time: "2 days ago",
    unread: false,
    icon: Users,
    iconTone: "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10",
    badgeTone: "bg-cyan-500 text-white",
  },
];

function NotificationCard({ item, onRead }) {
  const Icon = item.icon;
  return (
    <motion.button
      type="button"
      whileHover={{ y: -2 }}
      onClick={() => onRead(item.id)}
      className={`group flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition sm:p-5 ${item.unread ? "border-blue-200 bg-gradient-to-r from-blue-50/80 via-white to-white shadow-lg shadow-blue-500/5 dark:border-blue-900/60 dark:from-blue-950/25 dark:via-slate-900 dark:to-slate-900" : "border-slate-200 bg-white/90 dark:border-slate-800 dark:bg-slate-900/80"}`}
    >
      <span
        className={`grid size-11 shrink-0 place-items-center rounded-xl ${item.iconTone}`}
      >
        <Icon size={19} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-extrabold text-navy-900 dark:text-white">
              {item.title}
            </h3>
            {item.unread && (
              <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${item.badgeTone}`}>
                New
              </span>
            )}
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
            <Clock3 size={12} />
            {item.time}
          </span>
        </div>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {item.description}
        </p>
      </div>
      <ChevronRight
        className="mt-3 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-brand-500"
        size={17}
      />
    </motion.button>
  );
}

export function NotificationDialog({
  open = true,
  onClose,
  onViewAll,
  fullScreen = false,
}) {
  const [items, setItems] = useState(demoNotifications);
  const unreadCount = useMemo(
    () => items.filter((item) => item.unread).length,
    [items],
  );
  const close = onClose || (() => void 0);
  const viewAll = onViewAll || (() => void 0);

  const markAllAsRead = () => {
    setItems((current) => current.map((item) => ({ ...item, unread: false })));
  };

  const clearAll = () => {
    setItems([]);
  };

  const readItem = (id) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, unread: false } : item)),
    );
  };

  const panel = (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: 18 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className={`relative z-50 w-full overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.28)] dark:border-slate-800 dark:bg-slate-950 ${fullScreen ? "max-w-5xl" : "max-w-4xl"}`}
    >
      <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-blue-50/40 px-5 py-4 dark:border-slate-800 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
              <BellRing size={21} />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.18em] text-brand-500">
                Notifications
              </p>
              <h2 className="mt-1 text-xl font-black text-navy-900 dark:text-white sm:text-2xl">
                Stay updated with your organization&apos;s latest activities.
              </h2>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 sm:flex-wrap">
            <button
              type="button"
              onClick={markAllAsRead}
              className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-brand-500 transition hover:-translate-y-0.5 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/25 dark:hover:bg-blue-950/40"
            >
              Mark all as read
            </button>
            <button
              type="button"
              onClick={close}
              className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
              aria-label="Close notifications"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-h-[70vh] overflow-y-auto px-4 py-4 sm:px-6">
        {items.length ? (
          <div className="space-y-3">
            {items.map((item) => (
              <NotificationCard key={item.id} item={item} onRead={readItem} />
            ))}
          </div>
        ) : (
          <div className="grid min-h-[24rem] place-items-center text-center">
            <div>
              <span className="mx-auto grid size-16 place-items-center rounded-3xl bg-blue-50 text-brand-500 dark:bg-blue-500/10">
                <Bell size={28} />
              </span>
              <h3 className="mt-5 text-2xl font-black text-navy-900 dark:text-white">
                You&apos;re all caught up!
              </h3>
              <p className="mt-2 text-sm text-slate-400">No new notifications.</p>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-100 bg-slate-50/80 px-4 py-4 dark:border-slate-800 dark:bg-slate-950/80 sm:px-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={viewAll}
            className="rounded-2xl bg-gradient-to-r from-brand-500 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5"
          >
            View All Notifications
          </button>
          <button
            type="button"
            onClick={clearAll}
            className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:-translate-y-0.5 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Clear All
          </button>
        </div>
        <p className="mt-3 text-[11px] text-slate-400">
          {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}.
        </p>
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md sm:p-6 ${fullScreen ? "" : ""}`}
          onClick={close}
        >
          <div
            className="w-full"
            onClick={(event) => event.stopPropagation()}
          >
            {panel}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function NotificationCenter() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_35%),linear-gradient(180deg,#0f172a_0%,#111827_28%,#020617_100%)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-6xl items-center justify-center">
        <NotificationDialog
          open
          fullScreen
          onClose={() => navigate("/dashboard")}
          onViewAll={() => navigate("/dashboard")}
        />
      </div>
    </div>
  );
}
