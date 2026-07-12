import { Bell, ChevronDown, Menu, Moon, Search, Sun } from "lucide-react";
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
        <button
          aria-label="Notifications"
          className="relative grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 dark:border-slate-800 dark:bg-slate-900"
        >
          <Bell size={19} />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
        </button>
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
