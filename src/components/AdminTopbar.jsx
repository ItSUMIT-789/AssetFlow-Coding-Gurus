import { useState } from "react";
import {
  Bell,
  BellRing,
  ChevronDown,
  Menu,
  Moon,
  Search,
  Sun,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { initialNotifications } from "../data/notificationData";
import { getCurrentUser } from "../utils/auth";
import { ROLE_LABELS, ROLES } from "../utils/rbac";

export default function AdminTopbar({
  dark,
  setDark,
  setMobileOpen,
  search = "",
  onSearch,
  placeholder = "Search assets, employees, bookings...",
}) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const user = getCurrentUser();
  const displayName = user?.role === ROLES.ADMIN ? "Admin" : user?.name;
  const initials = (displayName || "AssetFlow User")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
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
          aria-label="Global search"
          value={search}
          onChange={onSearch}
          placeholder={placeholder}
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
        <div className="relative">
          <button
            onClick={() => setShowNotifications((value) => !value)}
            aria-label="Notifications"
            className="relative grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 dark:border-slate-800 dark:bg-slate-900"
          >
            <Bell size={19} />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-12 z-50 w-[22rem] max-w-[calc(100vw-1rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-800">
                <div>
                  <p className="flex items-center gap-2 text-sm font-bold text-navy-900 dark:text-white">
                    <BellRing size={16} className="text-brand-500" />
                    Demo Notifications
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Click through a few live-looking examples.
                  </p>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
              <div className="max-h-80 overflow-auto p-2">
                {initialNotifications.slice(0, 4).map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-xl px-3 py-3 transition ${item.unread ? "bg-blue-50/70 dark:bg-blue-500/10" : "hover:bg-slate-50 dark:hover:bg-slate-900"}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-navy-900 dark:text-white">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                          {item.description}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                        {item.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 p-3 dark:border-slate-800">
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    navigate("/dashboard/notifications");
                  }}
                  className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20"
                >
                  Open full notifications
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="ml-1 flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-indigo-600 text-xs font-bold text-white">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-bold text-navy-900 dark:text-white">
              {displayName}
            </p>
            <p className="text-[10px] text-slate-400">
              {ROLE_LABELS[user?.role] || user?.designation}
            </p>
          </div>
          <ChevronDown className="hidden text-slate-400 sm:block" size={14} />
        </div>
      </div>
    </header>
  );
}
