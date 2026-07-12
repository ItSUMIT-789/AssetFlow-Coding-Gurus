import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  BarChart3,
  CalendarRange,
  ChevronDown,
  Download,
  FileDown,
  FileSpreadsheet,
  FileText,
  Filter,
  Gauge,
  PackageSearch,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Trophy,
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import AdminTopbar from "../components/AdminTopbar";
import {
  ageDistribution as ageFallback,
  departmentUsage as departmentFallback,
  heatmap as heatFallback,
  leastUsed as leastFallback,
  maintenanceTrend as maintenanceFallback,
  mostUsed as mostFallback,
  retirements as retirementFallback,
  utilization as utilizationFallback,
} from "../data/analyticsData";
import { getAll, KEYS } from "../services/storageService";

const liveAssets = getAll(KEYS.assets),
  liveAllocations = getAll(KEYS.allocations),
  liveBookings = getAll(KEYS.bookings),
  liveMaintenance = getAll(KEYS.maintenance),
  countStatus = (status) =>
    liveAssets.filter((a) => a.status === status).length;
const utilization = liveAssets.length
  ? [
      {
        name: "Allocated",
        value: Math.round((countStatus("ALLOCATED") / liveAssets.length) * 100),
        color: "#3563e9",
      },
      {
        name: "Available",
        value: Math.round((countStatus("AVAILABLE") / liveAssets.length) * 100),
        color: "#10b981",
      },
      {
        name: "Maintenance",
        value: Math.round(
          (countStatus("UNDER_MAINTENANCE") / liveAssets.length) * 100,
        ),
        color: "#f59e0b",
      },
      {
        name: "Reserved",
        value: Math.round((countStatus("RESERVED") / liveAssets.length) * 100),
        color: "#8b5cf6",
      },
    ]
  : utilizationFallback;
const departmentUsage = liveAssets.length
  ? [...new Set(liveAssets.map((a) => a.department))].map((name) => {
      const rows = liveAssets.filter((a) => a.department === name);
      return {
        name: name
          .split(" ")
          .map((x) => x[0])
          .join("")
          .slice(0, 4),
        assets: rows.length,
        utilization: Math.round(
          (rows.filter((a) => a.status !== "AVAILABLE").length / rows.length) *
            100,
        ),
      };
    })
  : departmentFallback;
const maintenanceTrend = liveMaintenance.length
  ? [
      {
        month: "Current",
        requests: liveMaintenance.length,
        resolved: liveMaintenance.filter((m) => m.status === "RESOLVED").length,
        cost: 0,
      },
    ]
  : maintenanceFallback;
const ageDistribution = liveAssets.length
  ? ["< 1 year", "1–2 years", "2–4 years", "4–6 years", "6+ years"].map(
      (range, index) => ({
        range,
        count: liveAssets.filter((a) => {
          const age =
            (Date.now() - new Date(a.purchaseDate).getTime()) / 31557600000;
          return index === 0
            ? age < 1
            : index === 1
              ? age < 2
              : index === 2
                ? age < 4
                : index === 3
                  ? age < 6
                  : age >= 6;
        }).length,
        color: ["#3563e9", "#6366f1", "#8b5cf6", "#f59e0b", "#ef4444"][index],
      }),
    )
  : ageFallback;
const usageRows = liveAssets
  .map((a) => [
    a.name,
    a.category,
    liveBookings.filter(
      (b) => b.resourceId === a.id && b.status !== "CANCELLED",
    ).length *
      10 +
      liveAllocations.filter((x) => x.assetId === a.id).length * 25,
    a.department,
  ])
  .sort((a, b) => b[2] - a[2]);
const mostUsed = usageRows.length ? usageRows.slice(0, 5) : mostFallback,
  leastUsed = usageRows.length
    ? [...usageRows].reverse().slice(0, 5)
    : leastFallback;
const retirements = liveAssets.length
  ? liveAssets
      .filter(
        (a) =>
          a.warrantyDate &&
          a.warrantyDate <
            new Date(Date.now() + 180 * 86400000).toISOString().slice(0, 10),
      )
      .slice(0, 4)
      .map((a) => [a.name, a.tag, a.warrantyDate, "—", "High"])
  : retirementFallback;
const heatmap = liveBookings.length
  ? Array.from({ length: 6 }, (_, day) =>
      Array.from({ length: 7 }, (_, slot) =>
        Math.min(
          100,
          liveBookings.filter(
            (b) =>
              new Date(b.date).getDay() === day + 1 &&
              Number(b.startTime?.slice(0, 2)) >= 8 + slot * 2,
          ).length * 25,
        ),
      ),
    )
  : heatFallback;

const tip = {
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  boxShadow: "0 12px 30px rgba(15,23,42,.12)",
  fontSize: 12,
};
const departments = [
  "All Departments",
  "Information Technology",
  "Operations",
  "Sales",
  "Marketing",
  "Finance",
  "Human Resources",
];
const categories = [
  "All Categories",
  "Laptop",
  "Vehicle",
  "Projector",
  "Furniture",
  "Machinery",
  "Meeting Room",
];
const CardTitle = ({ title, copy, action }) => (
  <div className="flex items-start justify-between gap-3">
    <div>
      <h2 className="font-extrabold text-navy-900 dark:text-white">{title}</h2>
      <p className="mt-1 text-xs text-slate-400">{copy}</p>
    </div>
    {action}
  </div>
);
function Metric({ icon: Icon, label, value, trend, tone }) {
  return (
    <motion.article
      whileHover={{ y: -3 }}
      className="card bg-gradient-to-br from-white to-slate-50 p-5 dark:from-slate-900 dark:to-slate-900"
    >
      <div className="flex items-start justify-between">
        <span className={`grid size-11 place-items-center rounded-xl ${tone}`}>
          <Icon size={20} />
        </span>
        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-600 dark:bg-emerald-500/10">
          {trend}
        </span>
      </div>
      <p className="mt-5 text-2xl font-extrabold text-navy-900 dark:text-white">
        {value}
      </p>
      <p className="mt-1 text-xs font-bold text-slate-500">{label}</p>
    </motion.article>
  );
}

function ExportMenu({ onExport }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20"
      >
        <Download size={16} /> Download <ChevronDown size={14} />
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 top-12 z-30 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-700 dark:bg-slate-900"
        >
          {[
            [FileDown, "CSV", "csv"],
            [FileSpreadsheet, "Excel", "excel"],
            [FileText, "PDF Report", "pdf"],
          ].map(([Icon, label, type]) => (
            <button
              key={type}
              onClick={() => {
                onExport(type);
                setOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold hover:bg-blue-50 hover:text-brand-500 dark:hover:bg-blue-950/20"
            >
              <span className="grid size-8 place-items-center rounded-lg bg-slate-100 dark:bg-slate-800">
                <Icon size={15} />
              </span>
              {label}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function Heatmap() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    times = ["8 AM", "10 AM", "12 PM", "2 PM", "4 PM", "6 PM", "8 PM"];
  return (
    <section className="card p-5">
      <CardTitle
        title="Resource Utilization Heatmap"
        copy="Booking intensity by weekday and time window"
        action={
          <span className="flex items-center gap-1 text-[9px] text-slate-400">
            Low{" "}
            <i className="h-2 w-16 rounded-full bg-gradient-to-r from-blue-50 to-blue-600" />{" "}
            High
          </span>
        }
      />
      <div className="mt-6 overflow-x-auto">
        <div className="min-w-[560px]">
          <div className="ml-12 grid grid-cols-7 gap-2">
            {times.map((x) => (
              <span
                key={x}
                className="text-center text-[9px] font-bold text-slate-400"
              >
                {x}
              </span>
            ))}
          </div>
          {heatmap.map((row, i) => (
            <div key={days[i]} className="mt-2 flex items-center gap-2">
              <span className="w-10 text-[9px] font-bold text-slate-400">
                {days[i]}
              </span>
              <div className="grid flex-1 grid-cols-7 gap-2">
                {row.map((v, j) => (
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    title={`${days[i]} ${times[j]} · ${v}% utilized`}
                    key={j}
                    className="grid aspect-[1.55] place-items-center rounded-lg text-[8px] font-bold transition"
                    style={{
                      background: `rgba(53,99,233,${0.08 + v / 115})`,
                      color: v > 60 ? "white" : "#64748b",
                    }}
                  >
                    {v}%
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function RankedList({ title, copy, rows, least = false }) {
  return (
    <section className="card p-5">
      <CardTitle
        title={title}
        copy={copy}
        action={
          least ? (
            <PackageSearch className="text-slate-400" size={19} />
          ) : (
            <Trophy className="text-amber-500" size={19} />
          )
        }
      />
      <div className="mt-5 space-y-4">
        {rows.map(([name, category, value, department], i) => (
          <div key={name} className="flex items-center gap-3">
            <span
              className={`grid size-8 shrink-0 place-items-center rounded-lg text-xs font-extrabold ${least ? "bg-slate-100 text-slate-500 dark:bg-slate-800" : "bg-amber-50 text-amber-600 dark:bg-amber-500/10"}`}
            >
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex justify-between gap-2">
                <b className="truncate text-xs text-navy-900 dark:text-white">
                  {name}
                </b>
                <b className={least ? "text-slate-500" : "text-brand-500"}>
                  {value}%
                </b>
              </div>
              <p className="mt-1 text-[9px] text-slate-400">
                {category} · {department}
              </p>
              <div className="mt-2 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  className={`h-full rounded-full ${least ? "bg-slate-400" : "bg-gradient-to-r from-brand-500 to-indigo-500"}`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function createPdf(lines) {
  const esc = lines.map((x) =>
    String(x)
      .replaceAll("\\", "\\\\")
      .replaceAll("(", "\\(")
      .replaceAll(")", "\\)"),
  );
  const stream = [
    "BT",
    "/F1 10 Tf",
    "48 795 Td",
    ...esc.flatMap((x, i) => (i ? ["0 -17 Td", `(${x}) Tj`] : [`(${x}) Tj`])),
    "ET",
  ].join("\n");
  const objs = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >> endobj",
    `4 0 obj << /Length ${stream.length} >> stream\n${stream}\nendstream endobj`,
    "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
  ];
  let pdf = "%PDF-1.4\n",
    offset = [0];
  objs.forEach((o) => {
    offset.push(pdf.length);
    pdf += o + "\n";
  });
  const start = pdf.length;
  pdf += `xref\n0 6\n0000000000 65535 f \n${offset
    .slice(1)
    .map((x) => String(x).padStart(10, "0") + " 00000 n ")
    .join(
      "\n",
    )}\ntrailer << /Size 6 /Root 1 0 R >>\nstartxref\n${start}\n%%EOF`;
  return new Blob([pdf], { type: "application/pdf" });
}

export default function AnalyticsDashboard() {
  const [collapsed, setCollapsed] = useState(false),
    [mobileOpen, setMobileOpen] = useState(false),
    [dark, setDark] = useState(
      () => localStorage.getItem("assetflow_theme") === "dark",
    );
  const [department, setDepartment] = useState(departments[0]),
    [category, setCategory] = useState(categories[0]),
    [range, setRange] = useState("Last 6 Months"),
    [toast, setToast] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("assetflow_theme", dark ? "dark" : "light");
    return () => document.documentElement.classList.remove("dark");
  }, [dark]);
  const filtered = department !== departments[0] || category !== categories[0];
  const factor = filtered ? 0.84 : 1;
  const exportData = (type) => {
    const lines = [
      "AssetFlow Analytics Report",
      `Filters: ${department} | ${category} | ${range}`,
      "",
      ...departmentUsage.map(
        (x) => `${x.name}: ${x.assets} assets, ${x.utilization}% utilized`,
      ),
      "",
      ...retirements.map((x) => `Retirement: ${x[0]} (${x[1]}) - ${x[2]}`),
    ];
    let blob, name;
    if (type === "pdf") {
      blob = createPdf(lines);
      name = "assetflow-analytics.pdf";
    } else if (type === "excel") {
      const html = `<table><tr><th>Department</th><th>Assets</th><th>Utilization</th></tr>${departmentUsage.map((x) => `<tr><td>${x.name}</td><td>${x.assets}</td><td>${x.utilization}%</td></tr>`).join("")}</table>`;
      blob = new Blob([html], { type: "application/vnd.ms-excel" });
      name = "assetflow-analytics.xls";
    } else {
      blob = new Blob(
        [
          ["Department", "Assets", "Utilization"],
          ...departmentUsage.map((x) => [x.name, x.assets, x.utilization]),
        ]
          .map((x) => x.join(","))
          .join("\n"),
        { type: "text/csv" },
      );
      name = "assetflow-analytics.csv";
    }
    const url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
    setToast(`${type.toUpperCase()} report downloaded`);
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
        activePage="Reports & Analytics"
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
        <main className="mx-auto max-w-[1700px] p-4 sm:p-6 lg:p-8">
          <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-brand-500">
                <BarChart3 size={15} /> Business Intelligence
              </p>
              <h1 className="mt-2 text-3xl font-extrabold text-navy-900 dark:text-white">
                Analytics Dashboard
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Transform asset, booking, and maintenance activity into
                actionable operational intelligence.
              </p>
            </div>
            <ExportMenu onExport={exportData} />
          </header>
          <section className="card mt-7 flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
            <span className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Filter size={15} /> ANALYTICS FILTERS
            </span>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="field lg:max-w-56"
            >
              {departments.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="field lg:max-w-48"
            >
              {categories.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="field lg:max-w-44"
            >
              <option>Last 30 Days</option>
              <option>Last 3 Months</option>
              <option>Last 6 Months</option>
              <option>Last 12 Months</option>
            </select>
            <button
              onClick={() => {
                setDepartment(departments[0]);
                setCategory(categories[0]);
                setRange("Last 6 Months");
              }}
              className="flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold dark:border-slate-700"
            >
              <RefreshCw size={14} /> Reset
            </button>
            {filtered && (
              <span className="lg:ml-auto rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-bold text-brand-500 dark:bg-blue-500/10">
                Filtered view active
              </span>
            )}
          </section>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric
              icon={Gauge}
              label="Overall Utilization"
              value={`${Math.round((liveAssets.filter((a) => a.status !== "AVAILABLE").length / Math.max(1, liveAssets.length)) * 100 * factor)}%`}
              trend="+6.4%"
              tone="bg-blue-50 text-blue-600 dark:bg-blue-500/10"
            />
            <Metric
              icon={Activity}
              label="Assets in Service"
              value={Math.round(
                liveAssets.filter((a) => a.status !== "DISPOSED").length *
                  factor,
              ).toLocaleString()}
              trend="+3.2%"
              tone="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"
            />
            <Metric
              icon={TrendingUp}
              label="Monthly Cost Avoidance"
              value={`₹${Math.round(18.6 * factor)}L`}
              trend="+12.8%"
              tone="bg-violet-50 text-violet-600 dark:bg-violet-500/10"
            />
            <Metric
              icon={CalendarRange}
              label="Retiring in 90 Days"
              value={Math.round(retirements.length * factor)}
              trend="-8.1%"
              tone="bg-amber-50 text-amber-600 dark:bg-amber-500/10"
            />
          </div>
          <div className="mt-6 grid gap-6 xl:grid-cols-[.8fr_1.2fr]">
            <section className="card p-5">
              <CardTitle
                title="Asset Utilization"
                copy="Current portfolio state distribution"
              />
              <div className="relative h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={utilization}
                      dataKey="value"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={4}
                      stroke="none"
                    >
                      {utilization.map((x) => (
                        <Cell key={x.name} fill={x.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tip} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <b className="text-2xl text-navy-900 dark:text-white">
                      {liveAssets.length}
                    </b>
                    <p className="text-[9px] text-slate-400">ASSETS</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {utilization.map((x) => (
                  <div
                    key={x.name}
                    className="flex justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs dark:bg-slate-800"
                  >
                    <span className="flex items-center gap-2">
                      <i
                        className="size-2 rounded-full"
                        style={{ background: x.color }}
                      />
                      {x.name}
                    </span>
                    <b>{x.value}%</b>
                  </div>
                ))}
              </div>
            </section>
            <section className="card p-5">
              <CardTitle
                title="Department Usage"
                copy="Asset volume and utilization across top departments"
              />
              <div className="mt-4 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={departmentUsage}
                    margin={{ left: -20, right: 8 }}
                  >
                    <CartesianGrid
                      vertical={false}
                      strokeDasharray="4 4"
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                    />
                    <Tooltip contentStyle={tip} />
                    <Bar
                      dataKey="assets"
                      fill="#3563e9"
                      radius={[7, 7, 0, 0]}
                    />
                    <Bar
                      dataKey="utilization"
                      fill="#a5b4fc"
                      radius={[7, 7, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>
          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <section className="card p-5">
              <CardTitle
                title="Maintenance Trends"
                copy="Requests raised versus resolved over time"
              />
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={maintenanceTrend}
                    margin={{ left: -22, right: 8 }}
                  >
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
                    <Tooltip contentStyle={tip} />
                    <Line
                      dataKey="requests"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      dot={{ r: 3 }}
                    />
                    <Line
                      dataKey="resolved"
                      stroke="#10b981"
                      strokeWidth={3}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>
            <section className="card p-5">
              <CardTitle
                title="Asset Age Distribution"
                copy="Portfolio maturity and replacement exposure"
              />
              <div className="mt-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={ageDistribution}
                    margin={{ left: -18, right: 8 }}
                  >
                    <defs>
                      <linearGradient id="age" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0"
                          stopColor="#8b5cf6"
                          stopOpacity=".35"
                        />
                        <stop offset="1" stopColor="#8b5cf6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      vertical={false}
                      strokeDasharray="4 4"
                      stroke="#e2e8f0"
                    />
                    <XAxis
                      dataKey="range"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 9, fill: "#94a3b8" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#94a3b8" }}
                    />
                    <Tooltip contentStyle={tip} />
                    <Area
                      dataKey="count"
                      type="monotone"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      fill="url(#age)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </section>
          </div>
          <div className="mt-6">
            <Heatmap />
          </div>
          <div className="mt-6 grid gap-6 xl:grid-cols-3">
            <RankedList
              title="Most Used Assets"
              copy="Highest utilization this period"
              rows={mostUsed}
            />
            <RankedList
              title="Least Used Assets"
              copy="Optimization opportunities"
              rows={leastUsed}
              least
            />
            <section className="card p-5">
              <CardTitle
                title="Upcoming Retirement"
                copy="Assets approaching end of useful life"
                action={<CalendarRange className="text-red-500" size={19} />}
              />
              <div className="mt-5 space-y-4">
                {retirements.map(([name, tag, date, value, priority]) => (
                  <div
                    key={tag}
                    className="rounded-xl border border-slate-100 p-3 dark:border-slate-800"
                  >
                    <div className="flex justify-between gap-2">
                      <b className="truncate text-xs text-navy-900 dark:text-white">
                        {name}
                      </b>
                      <span
                        className={`text-[9px] font-bold ${priority === "Critical" ? "text-red-500" : priority === "High" ? "text-orange-500" : "text-amber-500"}`}
                      >
                        {priority}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-[9px] text-brand-500">
                      {tag}
                    </p>
                    <div className="mt-3 flex justify-between text-[10px] text-slate-400">
                      <span>{date}</span>
                      <b className="text-slate-600 dark:text-slate-300">
                        {value}
                      </b>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-5 right-5 z-[80] flex items-center gap-3 rounded-xl bg-navy-950 px-5 py-3 text-sm font-semibold text-white shadow-2xl"
        >
          <Sparkles size={17} className="text-blue-300" />
          {toast}
        </motion.div>
      )}
    </div>
  );
}
