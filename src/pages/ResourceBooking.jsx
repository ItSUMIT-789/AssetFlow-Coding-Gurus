import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  Search,
  Send,
  Sparkles,
  Users,
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import AdminTopbar from "../components/AdminTopbar";
import { resources } from "../data/bookingData";
import { getAll, KEYS } from "../services/storageService";
import { cancelBooking, createBooking } from "../services/workflowService";
import { getCurrentUser } from "../utils/auth";
import { ROLES } from "../utils/rbac";

const today = "2026-07-12",
  hours = Array.from({ length: 11 }, (_, i) => i + 8),
  departments = [
    "Information Technology",
    "Human Resources",
    "Finance",
    "Operations",
    "Sales",
    "Marketing",
    "Administration",
    "Product",
  ];
const colorMap = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10",
  violet: "bg-violet-50 text-violet-600 dark:bg-violet-500/10",
  emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10",
};
const timeLabel = (h) => `${h > 12 ? h - 12 : h}:00 ${h >= 12 ? "PM" : "AM"}`;

function ResourceCard({ item, active, onClick }) {
  const Icon = item.icon;
  return (
    <motion.button
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`min-w-[230px] flex-1 rounded-2xl border p-4 text-left shadow-sm transition ${active ? "border-brand-500 bg-gradient-to-br from-blue-50 to-indigo-50 ring-4 ring-blue-100 dark:from-blue-950/40 dark:to-indigo-950/30 dark:ring-blue-950" : "border-slate-200 bg-white hover:border-blue-200 dark:border-slate-800 dark:bg-slate-900"}`}
    >
      <div className="flex items-start justify-between">
        <span
          className={`grid size-10 place-items-center rounded-xl ${colorMap[item.color]}`}
        >
          <Icon size={19} />
        </span>
        {active && <CheckCircle2 size={18} className="text-brand-500" />}
      </div>
      <h3 className="mt-4 text-sm font-extrabold text-navy-900 dark:text-white">
        {item.name}
      </h3>
      <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
        <MapPin size={11} />
        {item.location}
      </p>
      <div className="mt-3 flex items-center gap-2 text-[9px] font-bold text-slate-400">
        {item.capacity && (
          <span className="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">
            {item.capacity} people
          </span>
        )}
        {item.features.map((x) => (
          <span
            key={x}
            className="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800"
          >
            {x}
          </span>
        ))}
      </div>
    </motion.button>
  );
}

function Scheduler({
  resource,
  date,
  selected,
  setSelected,
  duration,
  bookedHours,
}) {
  return (
    <section className="card overflow-hidden">
      <div className="flex flex-col justify-between gap-3 border-b px-5 py-4 dark:border-slate-800 sm:flex-row sm:items-center">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.15em] text-brand-500">
            Timeline Scheduler
          </p>
          <h2 className="mt-1 font-extrabold text-navy-900 dark:text-white">
            {resource.name}
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Select an hourly start time · {date}
          </p>
        </div>
        <div className="flex gap-4 text-[10px] font-bold text-slate-400">
          <span className="flex items-center gap-1.5">
            <i className="size-2 rounded-full bg-emerald-500" />
            Available
          </span>
          <span className="flex items-center gap-1.5">
            <i className="size-2 rounded-full bg-red-500" />
            Booked
          </span>
          <span className="flex items-center gap-1.5">
            <i className="size-2 rounded-full bg-brand-500" />
            Selected
          </span>
        </div>
      </div>
      <div className="dashboard-scroll overflow-x-auto p-5">
        <div className="flex min-w-[880px] gap-2">
          {hours.map((h) => {
            const booked = bookedHours.includes(h),
              chosen = selected === h,
              overlap =
                chosen &&
                Array.from({ length: duration }, (_, i) => h + i).some((x) =>
                  bookedHours.includes(x),
                );
            return (
              <motion.button
                whileHover={!booked ? { y: -2 } : undefined}
                key={h}
                onClick={() => setSelected(h)}
                className={`relative flex h-24 flex-1 flex-col items-center justify-center rounded-xl border text-xs font-bold transition ${booked ? "border-red-200 bg-red-50 text-red-500 dark:border-red-900/50 dark:bg-red-950/20" : chosen ? (overlap ? "border-red-400 bg-red-50 text-red-600 ring-4 ring-red-100" : "border-brand-500 bg-gradient-to-b from-blue-50 to-indigo-50 text-brand-500 ring-4 ring-blue-100 dark:from-blue-950/30 dark:to-indigo-950/20 dark:ring-blue-950") : "border-slate-200 bg-white text-slate-500 hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-emerald-950/20"}`}
              >
                <Clock3 size={15} />
                <span className="mt-2">{timeLabel(h)}</span>
                <span className="mt-1 text-[8px] uppercase">
                  {booked ? "Booked" : chosen ? "Selected" : "Available"}
                </span>
                {booked && (
                  <span className="absolute inset-x-2 bottom-2 h-0.5 rounded bg-red-300" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BookingForm({
  resource,
  date,
  setDate,
  selected,
  setSelected,
  duration,
  setDuration,
  conflict,
  onBook,
}) {
  const [purpose, setPurpose] = useState(""),
    [department, setDepartment] = useState(""),
    [attendees, setAttendees] = useState(""),
    [error, setError] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (conflict) return;
    if (selected === null || !purpose.trim() || !department || !attendees) {
      setError("Complete all booking details and select an available time.");
      return;
    }
    onBook({ purpose, department, attendees: Number(attendees) });
    setPurpose("");
    setAttendees("");
    setError("");
  };
  return (
    <section className="card overflow-hidden">
      <div className="border-b px-5 py-4 dark:border-slate-800">
        <p className="text-[10px] font-bold uppercase tracking-[.15em] text-violet-500">
          Booking Details
        </p>
        <h2 className="mt-1 font-extrabold text-navy-900 dark:text-white">
          Reserve {resource.name}
        </h2>
      </div>
      <form onSubmit={submit} className="grid gap-5 p-5 sm:grid-cols-2">
        <Field label="Date">
          <input
            type="date"
            min={today}
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setSelected(null);
            }}
            className="field"
          />
        </Field>
        <Field label="Start Time">
          <input
            value={
              selected === null ? "Select from timeline" : timeLabel(selected)
            }
            readOnly
            className="field bg-slate-50 dark:bg-slate-800"
          />
        </Field>
        <Field label="Duration">
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="field"
          >
            {[1, 2, 3, 4].map((x) => (
              <option key={x} value={x}>
                {x} hour{x > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Department">
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="field"
          >
            <option value="">Select department</option>
            {departments.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </Field>
        <label className="sm:col-span-2">
          <span className="mb-2 block text-sm font-semibold">Purpose</span>
          <textarea
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            rows="3"
            placeholder="Describe the meeting, trip, or event purpose..."
            className="field resize-none"
          />
        </label>
        <Field label="Attendees">
          <div className="relative">
            <Users
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="number"
              min="1"
              max={resource.capacity || 250}
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
              placeholder="Number of attendees"
              className="field pl-10"
            />
          </div>
        </Field>
        <div className="flex items-end">
          <button
            disabled={conflict || selected === null}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Send size={16} /> Confirm Booking
          </button>
        </div>
        {error && (
          <p className="text-sm font-medium text-red-500 sm:col-span-2">
            {error}
          </p>
        )}
      </form>
    </section>
  );
}
const Field = ({ label, children }) => (
  <label>
    <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
      {label}
    </span>
    {children}
  </label>
);

function BookingPanels({ bookings, currentUser, onCancel }) {
  const [tab, setTab] = useState("Today’s Bookings");
  const list =
    tab === "Today’s Bookings"
      ? bookings.filter((b) => b.date === today)
      : bookings.filter((b) => b.date > today);
  return (
    <section className="card overflow-hidden">
      <div className="flex border-b px-3 pt-3 dark:border-slate-800">
        {["Today’s Bookings", "Upcoming Bookings"].map((x) => (
          <button
            key={x}
            onClick={() => setTab(x)}
            className={`relative px-4 py-3 text-sm font-semibold ${tab === x ? "text-brand-500" : "text-slate-400"}`}
          >
            {x}
            {tab === x && (
              <motion.span
                layoutId="booking-tab"
                className="absolute inset-x-2 bottom-0 h-0.5 bg-brand-500"
              />
            )}
          </button>
        ))}
      </div>
      <div className="space-y-3 p-4">
        {list.map((b) => (
          <motion.article
            layout
            key={b.id}
            className="rounded-xl border border-slate-100 p-4 transition hover:border-blue-200 hover:shadow-md dark:border-slate-800"
          >
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-brand-500 dark:bg-blue-500/10">
                <BookOpenCheck size={17} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-2">
                  <h3 className="truncate text-sm font-bold text-navy-900 dark:text-white">
                    {b.resource}
                  </h3>
                  <span className="h-fit rounded-full bg-emerald-50 px-2 py-1 text-[8px] font-bold text-emerald-600 dark:bg-emerald-500/10">
                    {b.status}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs text-slate-400">
                  {b.purpose}
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-[9px] font-semibold text-slate-400">
                  <span>{b.date}</span>
                  <span>
                    {b.time} · {b.duration}h
                  </span>
                  <span>{b.department}</span>
                  <span>{b.attendees} attendees</span>
                </div>
                {b.userId === currentUser.id &&
                  b.date >= today &&
                  b.status !== "CANCELLED" && (
                    <button
                      onClick={() => onCancel(b.id)}
                      className="mt-3 text-[10px] font-bold text-red-500"
                    >
                      Cancel booking
                    </button>
                  )}
              </div>
            </div>
          </motion.article>
        ))}
        {!list.length && (
          <div className="py-10 text-center text-xs text-slate-400">
            No bookings in this view.
          </div>
        )}
      </div>
    </section>
  );
}

function CalendarView({ date, setDate, bookings }) {
  const days = Array.from({ length: 35 }, (_, i) =>
    i < 2 ? 29 + i : i - 1 > 31 ? i - 32 : i - 1,
  );
  return (
    <section className="card overflow-hidden">
      <div className="flex items-center justify-between border-b px-5 py-4 dark:border-slate-800">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.15em] text-brand-500">
            Calendar View
          </p>
          <h2 className="mt-1 font-extrabold text-navy-900 dark:text-white">
            July 2026
          </h2>
        </div>
        <div className="flex gap-1">
          <button className="grid size-8 place-items-center rounded-lg border dark:border-slate-700">
            <ChevronLeft size={15} />
          </button>
          <button className="grid size-8 place-items-center rounded-lg border dark:border-slate-700">
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 p-4 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((x, i) => (
          <b key={i} className="py-2 text-[9px] text-slate-400">
            {x}
          </b>
        ))}
        {days.map((d, i) => {
          const actual = i < 2 || i > 32 ? null : d,
            iso = actual ? `2026-07-${String(actual).padStart(2, "0")}` : "",
            count = bookings.filter((b) => b.date === iso).length,
            active = date === iso;
          return (
            <button
              disabled={!actual}
              onClick={() => setDate(iso)}
              key={i}
              className={`relative grid aspect-square place-items-center rounded-xl text-xs transition ${active ? "bg-brand-500 font-bold text-white shadow-lg shadow-blue-500/25" : actual ? "hover:bg-blue-50 dark:hover:bg-blue-950/30" : "text-slate-300 dark:text-slate-700"}`}
            >
              {d}
              {count > 0 && (
                <span
                  className={`absolute bottom-1 size-1 rounded-full ${active ? "bg-white" : "bg-brand-500"}`}
                />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default function ResourceBooking() {
  const [collapsed, setCollapsed] = useState(false),
    [mobileOpen, setMobileOpen] = useState(false),
    [dark, setDark] = useState(
      () => localStorage.getItem("assetflow_theme") === "dark",
    );
  const [resourceId, setResourceId] = useState(resources[0].id),
    [type, setType] = useState("All Resources"),
    [search, setSearch] = useState(""),
    [date, setDate] = useState(today),
    [selected, setSelected] = useState(null),
    [duration, setDuration] = useState(1),
    [bookings, setBookings] = useState(() =>
      getAll(KEYS.bookings).map((b) => ({
        ...b,
        resource: b.resourceName,
        time: b.startTime,
        duration: Number(b.duration) || 1,
        attendees: b.attendees || 1,
      })),
    ),
    [toast, setToast] = useState("");
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const panelBookings =
    currentUser.role === ROLES.EMPLOYEE
      ? bookings.filter((b) => b.userId === currentUser.id)
      : currentUser.role === ROLES.DEPARTMENT_HEAD
        ? bookings.filter((b) => b.department === currentUser.department)
        : bookings;
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("assetflow_theme", dark ? "dark" : "light");
    return () => document.documentElement.classList.remove("dark");
  }, [dark]);
  const resource = resources.find((r) => r.id === resourceId),
    shown = resources.filter(
      (r) =>
        (type === "All Resources" || r.type === type) &&
        r.name.toLowerCase().includes(search.toLowerCase()),
    );
  const bookedHours = useMemo(() => {
    const fromBookings = bookings
      .filter((b) => b.resourceId === resourceId && b.date === date)
      .flatMap((b) =>
        Array.from(
          { length: b.duration },
          (_, i) => Number(b.time.slice(0, 2)) + i,
        ),
      );
    return [...new Set(fromBookings)];
  }, [bookings, date, resourceId]);
  const conflict =
    selected !== null &&
    Array.from({ length: duration }, (_, i) => selected + i).some(
      (h) => bookedHours.includes(h) || h > 18,
    );
  const book = (data) => {
    if (conflict) return;
    try {
      const startTime = `${String(selected).padStart(2, "0")}:00`,
        endTime = `${String(selected + duration).padStart(2, "0")}:00`;
      const saved = createBooking(
        {
          resourceId,
          resourceName: resource.name,
          date,
          startTime,
          endTime,
          duration,
          ...data,
        },
        currentUser,
      );
      setBookings([
        {
          ...saved,
          resource: saved.resourceName,
          time: saved.startTime,
          status: "Confirmed",
        },
        ...bookings,
      ]);
    } catch (error) {
      setToast(error.message);
      setTimeout(() => setToast(""), 2800);
      return;
    }
    setToast("Resource booked successfully. Confirmation sent to attendees.");
    setSelected(null);
    setTimeout(() => setToast(""), 2800);
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
        activePage="Resource Booking"
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
        <main className="mx-auto max-w-[1600px] p-4 sm:p-6 lg:p-8">
          <header>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-brand-500">
              <CalendarDays size={15} /> Shared Resources
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-navy-900 dark:text-white">
              Resource Booking
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Find availability, prevent scheduling conflicts, and reserve
              shared resources with confidence.
            </p>
          </header>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search rooms, projectors, vehicles, and halls..."
                className="field pl-11"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {[
                "All Resources",
                "Meeting Rooms",
                "Projectors",
                "Vehicles",
                "Conference Hall",
              ].map((x) => (
                <button
                  key={x}
                  onClick={() => setType(x)}
                  className={`whitespace-nowrap rounded-xl border px-4 py-2.5 text-xs font-bold ${type === x ? "border-brand-500 bg-brand-500 text-white shadow-lg shadow-blue-500/20" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"}`}
                >
                  {x}
                </button>
              ))}
            </div>
          </div>
          <div className="dashboard-scroll mt-4 flex gap-4 overflow-x-auto pb-2">
            {shown.map((r) => (
              <ResourceCard
                key={r.id}
                item={r}
                active={resourceId === r.id}
                onClick={() => {
                  setResourceId(r.id);
                  setSelected(null);
                }}
              />
            ))}
          </div>
          <div className="mt-6">
            <Scheduler
              resource={resource}
              date={date}
              selected={selected}
              setSelected={setSelected}
              duration={duration}
              bookedHours={bookedHours}
            />
          </div>
          <AnimatePresence>
            {conflict && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mt-4 flex gap-3 rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-orange-50 p-4 dark:border-red-900/50 dark:from-red-950/30 dark:to-orange-950/20"
              >
                <AlertTriangle className="shrink-0 text-red-500" size={21} />
                <div>
                  <h3 className="text-sm font-bold text-red-800 dark:text-red-300">
                    Booking conflict detected
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-red-600 dark:text-red-400">
                    The selected start time or duration overlaps an existing
                    reservation. Booking is disabled until you choose an
                    available slot.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {selected !== null && !conflict && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20"
            >
              <CheckCircle2 className="text-emerald-600" size={20} />
              <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                Available: {timeLabel(selected)}–
                {timeLabel(selected + duration)} for {duration} hour
                {duration > 1 ? "s" : ""}.
              </p>
            </motion.div>
          )}
          <div className="mt-6 grid items-start gap-6 xl:grid-cols-[1.25fr_.75fr]">
            <BookingForm
              resource={resource}
              date={date}
              setDate={setDate}
              selected={selected}
              setSelected={setSelected}
              duration={duration}
              setDuration={setDuration}
              conflict={conflict}
              onBook={book}
            />
            <div className="grid gap-6">
              <BookingPanels
                bookings={panelBookings}
                currentUser={currentUser}
                onCancel={(id) => {
                  try {
                    cancelBooking(id, currentUser);
                    setBookings(
                      bookings.map((b) =>
                        b.id === id ? { ...b, status: "CANCELLED" } : b,
                      ),
                    );
                    setToast("Booking cancelled");
                  } catch (error) {
                    setToast(error.message);
                  }
                  setTimeout(() => setToast(""), 2400);
                }}
              />
              <CalendarView
                date={date}
                setDate={(v) => {
                  setDate(v);
                  setSelected(null);
                }}
                bookings={bookings}
              />
            </div>
          </div>
        </main>
      </div>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-5 right-5 z-[80] flex max-w-md items-center gap-3 rounded-xl bg-navy-950 px-5 py-3 text-sm font-semibold text-white shadow-2xl"
          >
            <Sparkles className="text-blue-300" size={18} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
