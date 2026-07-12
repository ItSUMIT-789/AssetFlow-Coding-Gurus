import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  ImagePlus,
  KanbanSquare,
  MessageSquareText,
  Paperclip,
  Search,
  Send,
  Sparkles,
  Timer,
  UserRoundCog,
  Wrench,
  X,
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import AdminTopbar from "../components/AdminTopbar";
import { maintenanceColumns, resolutionTrend } from "../data/maintenanceData";
import { getAll, KEYS } from "../services/storageService";
import { updateMaintenanceStatus } from "../services/workflowService";
import { getCurrentUser } from "../utils/auth";

const priorityStyle = {
  Critical: "bg-red-50 text-red-600 ring-red-100 dark:bg-red-500/10",
  High: "bg-orange-50 text-orange-600 ring-orange-100 dark:bg-orange-500/10",
  Medium: "bg-amber-50 text-amber-600 ring-amber-100 dark:bg-amber-500/10",
  Low: "bg-emerald-50 text-emerald-600 ring-emerald-100 dark:bg-emerald-500/10",
};
const columnStyle = {
  Pending: "bg-slate-400",
  Approved: "bg-blue-500",
  "Technician Assigned": "bg-violet-500",
  "In Progress": "bg-amber-500",
  Resolved: "bg-emerald-500",
};
const tooltip = {
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  boxShadow: "0 12px 30px rgba(15,23,42,.12)",
  fontSize: 12,
};

function StatCard({ icon: Icon, label, value, detail, tone }) {
  return (
    <motion.article
      whileHover={{ y: -3 }}
      className="card bg-gradient-to-br from-white to-slate-50 p-5 dark:from-slate-900 dark:to-slate-900"
    >
      <div className="flex items-start justify-between">
        <span className={`grid size-11 place-items-center rounded-xl ${tone}`}>
          <Icon size={20} />
        </span>
        <span className="text-[9px] font-bold text-emerald-500">LIVE</span>
      </div>
      <p className="mt-5 text-2xl font-extrabold text-navy-900 dark:text-white">
        {value}
      </p>
      <p className="mt-1 text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-[10px] text-slate-400">{detail}</p>
    </motion.article>
  );
}
function Ticket({ item, onOpen, onComment, onDragStart }) {
  return (
    <motion.article
      layout
      draggable
      onDragStart={(e) => onDragStart(e, item.id)}
      whileHover={{ y: -3 }}
      className="cursor-grab rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-200 hover:shadow-lg active:cursor-grabbing dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-mono text-[10px] font-bold text-brand-500">
          {item.id}
        </span>
        <span
          className={`rounded-full px-2 py-1 text-[9px] font-bold ring-1 ${priorityStyle[item.priority]}`}
        >
          {item.priority}
        </span>
      </div>
      <h3 className="mt-3 text-sm font-extrabold text-navy-900 dark:text-white">
        {item.asset}
      </h3>
      <p className="mt-1 text-[10px] text-slate-400">{item.tag}</p>
      <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
        {item.issue}
      </p>
      <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-[10px] dark:border-slate-800">
        <div className="flex items-center gap-2">
          <UserRoundCog size={13} className="text-slate-400" />
          <span className="truncate">{item.technician}</span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarClock size={13} className="text-slate-400" />
          <span>{item.eta}</span>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1">
        <button
          onClick={() => onOpen(item)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-50 py-2 text-[10px] font-bold text-brand-500 dark:bg-blue-500/10"
        >
          Open Details
        </button>
        <button
          onClick={() => onComment(item)}
          aria-label="Comment"
          title="Comment"
          className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <MessageSquareText size={14} />
        </button>
        <span className="flex items-center gap-1 px-1 text-[9px] text-slate-400">
          <Paperclip size={12} />
          {item.attachments}
        </span>
      </div>
    </motion.article>
  );
}
function Column({
  name,
  items,
  onDrop,
  onOpen,
  onComment,
  onDragStart,
  dragOver,
  setDragOver,
}) {
  return (
    <section
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(name);
      }}
      onDragLeave={() => setDragOver(null)}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(e, name);
        setDragOver(null);
      }}
      className={`w-[300px] shrink-0 rounded-2xl border p-3 transition ${dragOver === name ? "border-brand-500 bg-blue-50/70 ring-4 ring-blue-100 dark:bg-blue-950/20 dark:ring-blue-950" : "border-slate-200/70 bg-slate-100/60 dark:border-slate-800 dark:bg-slate-900/40"}`}
    >
      <header className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={`size-2 rounded-full ${columnStyle[name]}`} />
          <h2 className="text-xs font-extrabold text-slate-700 dark:text-slate-200">
            {name}
          </h2>
        </div>
        <span className="grid size-6 place-items-center rounded-lg bg-white text-[10px] font-bold shadow-sm dark:bg-slate-800">
          {items.length}
        </span>
      </header>
      <div className="space-y-3">
        {items.map((item) => (
          <Ticket
            key={item.id}
            item={item}
            onOpen={onOpen}
            onComment={onComment}
            onDragStart={onDragStart}
          />
        ))}
        {!items.length && (
          <div className="grid h-28 place-items-center rounded-xl border border-dashed border-slate-300 text-[10px] text-slate-400 dark:border-slate-700">
            Drop request here
          </div>
        )}
      </div>
    </section>
  );
}

function DetailsDrawer({ request, onClose, onChangeStatus, onComment }) {
  const [comment, setComment] = useState(""),
    [uploads, setUploads] = useState([]);
  const fileRef = useRef();
  const send = () => {
    if (!comment.trim()) return;
    onComment(comment);
    setComment("");
  };
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-[2px]"
      />
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 280 }}
        className="dashboard-scroll fixed inset-y-0 right-0 z-[60] w-full max-w-xl overflow-y-auto bg-slate-50 shadow-2xl dark:bg-slate-950"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/90 px-5 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.15em] text-brand-500">
              Maintenance Request
            </p>
            <h2 className="mt-1 font-mono text-sm font-extrabold">
              {request.id}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="grid size-9 place-items-center rounded-xl border dark:border-slate-700"
            aria-label="Close details"
          >
            <X size={18} />
          </button>
        </header>
        <div className="p-5">
          <section className="rounded-3xl bg-gradient-to-br from-navy-950 via-blue-950 to-indigo-950 p-6 text-white shadow-xl">
            <div className="flex items-start justify-between">
              <span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-blue-300">
                <Wrench size={23} />
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${priorityStyle[request.priority]}`}
              >
                {request.priority} Priority
              </span>
            </div>
            <h1 className="mt-5 text-xl font-extrabold">{request.asset}</h1>
            <p className="mt-1 text-xs text-blue-200/70">
              {request.tag} · {request.location}
            </p>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              {request.issue}
            </p>
          </section>
          <section className="card mt-5 p-5">
            <h3 className="text-sm font-bold text-navy-900 dark:text-white">
              Workflow Status
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label>
                <span className="mb-2 block text-xs font-semibold text-slate-500">
                  Change Status
                </span>
                <select
                  value={request.status}
                  onChange={(e) => onChangeStatus(e.target.value)}
                  className="field"
                >
                  {maintenanceColumns.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <div>
                <span className="mb-2 block text-xs font-semibold text-slate-500">
                  Assigned Technician
                </span>
                <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold dark:bg-slate-800">
                  {request.technician}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  Estimated Completion
                </span>
                <p className="mt-1 text-sm font-semibold">{request.eta}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  Created
                </span>
                <p className="mt-1 text-sm font-semibold">{request.created}</p>
              </div>
            </div>
          </section>
          <section className="card mt-5 p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">Images & Attachments</h3>
              <span className="text-[10px] text-slate-400">
                {request.attachments + uploads.length} files
              </span>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) =>
                setUploads([
                  ...uploads,
                  ...Array.from(e.target.files).map((f) => f.name),
                ])
              }
            />
            <button
              onClick={() => fileRef.current.click()}
              className="mt-4 flex w-full flex-col items-center rounded-2xl border border-dashed border-blue-300 bg-blue-50/50 p-6 text-brand-500 transition hover:bg-blue-50 dark:border-blue-900 dark:bg-blue-950/20"
            >
              <ImagePlus size={22} />
              <b className="mt-2 text-xs">Upload maintenance images</b>
              <span className="mt-1 text-[9px] text-slate-400">
                PNG, JPG, or WEBP
              </span>
            </button>
            {uploads.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {uploads.map((x) => (
                  <span
                    key={x}
                    className="rounded-lg bg-slate-100 px-2 py-1 text-[9px] dark:bg-slate-800"
                  >
                    {x}
                  </span>
                ))}
              </div>
            )}
          </section>
          <section className="card mt-5 p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold">
              <MessageSquareText size={17} className="text-brand-500" />{" "}
              Comments{" "}
              <span className="text-xs text-slate-400">
                ({request.comments})
              </span>
            </h3>
            <div className="mt-4 flex gap-2">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows="2"
                placeholder="Add a technical note or update..."
                className="field resize-none"
              />
              <button
                onClick={send}
                aria-label="Send comment"
                className="grid w-12 shrink-0 place-items-center rounded-xl bg-brand-500 text-white"
              >
                <Send size={17} />
              </button>
            </div>
            <div className="mt-4 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
              <p className="text-xs font-bold">
                Abhay Sonone{" "}
                <span className="font-normal text-slate-400">
                  · Administrator
                </span>
              </p>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Please confirm parts availability before moving this request to
                In Progress.
              </p>
            </div>
          </section>
        </div>
      </motion.aside>
    </>
  );
}

function Analytics({ requests }) {
  const counts = maintenanceColumns.map((status) => ({
    status: status === "Technician Assigned" ? "Assigned" : status,
    count: requests.filter((r) => r.status === status).length,
  }));
  return (
    <div className="mt-6 grid gap-6 xl:grid-cols-2">
      <section className="card p-5">
        <div>
          <h2 className="font-extrabold text-navy-900 dark:text-white">
            Resolution Performance
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Average resolution hours trending downward
          </p>
        </div>
        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={resolutionTrend} margin={{ left: -25, right: 8 }}>
              <defs>
                <linearGradient id="resolution" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#3563e9" stopOpacity=".3" />
                  <stop offset="1" stopColor="#3563e9" stopOpacity="0" />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="4 4"
                stroke="#e2e8f0"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#94a3b8" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#94a3b8" }}
              />
              <Tooltip contentStyle={tooltip} />
              <Area
                dataKey="hours"
                type="monotone"
                stroke="#3563e9"
                strokeWidth={3}
                fill="url(#resolution)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="card p-5">
        <div>
          <h2 className="font-extrabold text-navy-900 dark:text-white">
            Requests by Status
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Current maintenance workload distribution
          </p>
        </div>
        <div className="mt-4 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={counts} margin={{ left: -25, right: 8 }}>
              <CartesianGrid
                vertical={false}
                strokeDasharray="4 4"
                stroke="#e2e8f0"
              />
              <XAxis
                dataKey="status"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 9, fill: "#94a3b8" }}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#94a3b8" }}
              />
              <Tooltip contentStyle={tooltip} />
              <Bar dataKey="count" fill="#7065f0" radius={[7, 7, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

export default function MaintenanceManagement() {
  const [collapsed, setCollapsed] = useState(false),
    [mobileOpen, setMobileOpen] = useState(false),
    [dark, setDark] = useState(
      () => localStorage.getItem("assetflow_theme") === "dark",
    );
  const [requests, setRequests] = useState(() =>
      getAll(KEYS.maintenance).map((r) => ({
        ...r,
        asset: r.assetName,
        tag: r.assetTag,
        issue: r.issueDescription,
        technician: r.technician || "Unassigned",
        eta: r.estimatedCompletion || "Awaiting approval",
        created: r.requestDate,
        comments: r.comments || 0,
        attachments: r.images?.length || 0,
        priority: (r.priority || "MEDIUM")
          .toLowerCase()
          .replace(/^./, (x) => x.toUpperCase()),
        status:
          {
            PENDING: "Pending",
            APPROVED: "Approved",
            TECHNICIAN_ASSIGNED: "Technician Assigned",
            IN_PROGRESS: "In Progress",
            RESOLVED: "Resolved",
            REJECTED: "Rejected",
          }[r.status] || r.status,
      })),
    ),
    [query, setQuery] = useState(""),
    [priority, setPriority] = useState("All"),
    [detail, setDetail] = useState(null),
    [dragOver, setDragOver] = useState(null),
    [toast, setToast] = useState("");
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("assetflow_theme", dark ? "dark" : "light");
    return () => document.documentElement.classList.remove("dark");
  }, [dark]);
  const filtered = useMemo(
    () =>
      requests.filter(
        (r) =>
          (priority === "All" || r.priority === priority) &&
          `${r.asset} ${r.id} ${r.issue} ${r.technician}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [requests, query, priority],
  );
  const open = requests.filter((r) => r.status !== "Resolved").length,
    resolved = requests.filter((r) => r.status === "Resolved"),
    avg = resolved.length
      ? Math.round(
          resolved.reduce((a, r) => a + (r.resolutionHours || 18), 0) /
            resolved.length,
        )
      : 0;
  const notify = (text) => {
    setToast(text);
    setTimeout(() => setToast(""), 2400);
  };
  const changeStatus = (id, status) => {
    try {
      updateMaintenanceStatus(
        id,
        status.toUpperCase().replaceAll(" ", "_"),
        currentUser,
      );
    } catch (error) {
      notify(error.message);
      return;
    }
    setRequests(requests.map((r) => (r.id === id ? { ...r, status } : r)));
    setDetail((d) => (d?.id === id ? { ...d, status } : d));
    notify(`Request moved to ${status}`);
  };
  const drop = (e, status) => {
    const id = e.dataTransfer.getData("text/plain");
    changeStatus(id, status);
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
        activePage="Maintenance"
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
        <main className="mx-auto max-w-[1800px] p-4 sm:p-6 lg:p-8">
          <header>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-brand-500">
              <Wrench size={15} /> Service Operations
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-navy-900 dark:text-white">
              Maintenance Management
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Prioritize issues, coordinate technicians, and track every request
              through resolution.
            </p>
          </header>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={AlertCircle}
              label="Open Requests"
              value={open}
              detail={`${requests.filter((r) => r.priority === "Critical").length} critical requests require attention`}
              tone="bg-red-50 text-red-600 dark:bg-red-500/10"
            />
            <StatCard
              icon={Timer}
              label="Average Resolution Time"
              value={`${avg}h`}
              detail="18% faster than last month"
              tone="bg-blue-50 text-blue-600 dark:bg-blue-500/10"
            />
            <StatCard
              icon={UserRoundCog}
              label="Technicians Active"
              value="6"
              detail="3 internal · 3 external vendors"
              tone="bg-violet-50 text-violet-600 dark:bg-violet-500/10"
            />
            <StatCard
              icon={CheckCircle2}
              label="Resolved This Month"
              value="42"
              detail="94% within target SLA"
              tone="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"
            />
          </div>
          <Analytics requests={requests} />
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                size={17}
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search request, asset, issue, or technician..."
                className="field pl-11"
              />
            </div>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="field sm:w-44"
            >
              <option>All</option>
              <option>Critical</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KanbanSquare size={18} className="text-brand-500" />
              <h2 className="font-extrabold text-navy-900 dark:text-white">
                Maintenance Workflow
              </h2>
            </div>
            <p className="hidden text-[10px] text-slate-400 sm:block">
              Drag cards between columns to update status
            </p>
          </div>
          <div className="dashboard-scroll mt-4 flex gap-4 overflow-x-auto pb-5">
            {maintenanceColumns.map((name) => (
              <Column
                key={name}
                name={name}
                items={filtered.filter((r) => r.status === name)}
                onDrop={drop}
                onOpen={setDetail}
                onComment={setDetail}
                onDragStart={(e, id) => {
                  e.dataTransfer.setData("text/plain", id);
                  e.dataTransfer.effectAllowed = "move";
                }}
                dragOver={dragOver}
                setDragOver={setDragOver}
              />
            ))}
          </div>
        </main>
      </div>
      <AnimatePresence>
        {detail && (
          <DetailsDrawer
            request={detail}
            onClose={() => setDetail(null)}
            onChangeStatus={(status) => changeStatus(detail.id, status)}
            onComment={() => {
              setRequests(
                requests.map((r) =>
                  r.id === detail.id ? { ...r, comments: r.comments + 1 } : r,
                ),
              );
              setDetail({ ...detail, comments: detail.comments + 1 });
              notify("Comment added to request");
            }}
          />
        )}
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-5 right-5 z-[80] flex items-center gap-3 rounded-xl bg-navy-950 px-5 py-3 text-sm font-semibold text-white shadow-2xl"
          >
            <Sparkles size={17} className="text-blue-300" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
