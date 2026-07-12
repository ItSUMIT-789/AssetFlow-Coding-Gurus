import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Download,
  Eye,
  FileWarning,
  MapPin,
  PackageSearch,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
  X,
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import AdminTopbar from "../components/AdminTopbar";
import { auditAssets } from "../data/auditData";
import { getAll, KEYS } from "../services/storageService";
import { verifyAuditItem } from "../services/workflowService";
import { getCurrentUser } from "../utils/auth";

const statuses = [
  "All",
  "Verified",
  "Missing",
  "Damaged",
  "Mismatch",
  "Pending",
];
const badge = {
  Verified: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10",
  Missing: "bg-red-50 text-red-600 dark:bg-red-500/10",
  Damaged: "bg-orange-50 text-orange-600 dark:bg-orange-500/10",
  Mismatch: "bg-violet-50 text-violet-600 dark:bg-violet-500/10",
  Pending: "bg-slate-100 text-slate-500 dark:bg-slate-800",
};
const dots = {
  Verified: "bg-emerald-500",
  Missing: "bg-red-500",
  Damaged: "bg-orange-500",
  Mismatch: "bg-violet-500",
  Pending: "bg-slate-400",
};

function StatusBadge({ value }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${badge[value]}`}
    >
      <span className={`size-1.5 rounded-full ${dots[value]}`} />
      {value}
    </span>
  );
}
function SummaryCard({ icon: Icon, label, value, tone, active, onClick }) {
  return (
    <motion.button
      whileHover={{ y: -3 }}
      onClick={onClick}
      className={`card p-5 text-left transition ${active ? "ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-slate-950" : ""}`}
    >
      <div className="flex items-center justify-between">
        <span className={`grid size-11 place-items-center rounded-xl ${tone}`}>
          <Icon size={20} />
        </span>
        <span className="text-[9px] font-bold text-slate-400">OF AUDIT</span>
      </div>
      <p className="mt-5 text-2xl font-extrabold text-navy-900 dark:text-white">
        {value}
      </p>
      <p className="mt-1 text-xs font-bold text-slate-500">{label}</p>
    </motion.button>
  );
}

function ReportModal({ rows, onClose, onDownload }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.section
        initial={{ y: 18, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="dashboard-scroll max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-slate-900"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/95 px-6 py-5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-red-500">
              Audit Exception Report
            </p>
            <h2 className="mt-1 text-xl font-extrabold text-navy-900 dark:text-white">
              Discrepancy Report
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close report"
            className="grid size-9 place-items-center rounded-xl border dark:border-slate-700"
          >
            <X size={18} />
          </button>
        </header>
        <div className="p-6">
          <div className="rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-orange-50 p-5 dark:border-red-900/50 dark:from-red-950/25 dark:to-orange-950/20">
            <div className="flex gap-3">
              <FileWarning className="shrink-0 text-red-500" />
              <div>
                <h3 className="font-bold text-red-900 dark:text-red-300">
                  {rows.length} discrepancies require follow-up
                </h3>
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  Missing, damaged, and location-mismatched assets have been
                  grouped for investigation.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 space-y-3">
            {rows.map((r) => (
              <article
                key={r.id}
                className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row">
                  <div>
                    <div className="flex items-center gap-2">
                      <b className="text-sm text-navy-900 dark:text-white">
                        {r.asset}
                      </b>
                      <StatusBadge value={r.status} />
                    </div>
                    <p className="mt-1 font-mono text-[10px] text-brand-500">
                      {r.tag}
                    </p>
                  </div>
                  <div className="text-xs sm:text-right">
                    <p className="text-slate-400">
                      Expected:{" "}
                      <b className="text-slate-600 dark:text-slate-300">
                        {r.expected}
                      </b>
                    </p>
                    <p className="mt-1 text-slate-400">
                      Found:{" "}
                      <b className="text-slate-600 dark:text-slate-300">
                        {r.current}
                      </b>
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <footer className="sticky bottom-0 flex justify-end gap-3 border-t bg-slate-50/95 px-6 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
          <button
            onClick={onClose}
            className="rounded-xl border bg-white px-4 py-2.5 text-sm font-semibold dark:border-slate-700 dark:bg-slate-900"
          >
            Close
          </button>
          <button
            onClick={onDownload}
            className="flex items-center gap-2 rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white"
          >
            <Download size={16} /> Download PDF
          </button>
        </footer>
      </motion.section>
    </motion.div>
  );
}

function createPdf(lines) {
  const safe = lines.map((x) =>
    x.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)"),
  );
  const stream = [
    "BT",
    "/F1 11 Tf",
    "50 790 Td",
    ...safe.flatMap((line, i) =>
      i ? ["0 -18 Td", `(${line}) Tj`] : [`(${line}) Tj`],
    ),
    "ET",
  ].join("\n");
  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >> endobj",
    `4 0 obj << /Length ${stream.length} >> stream\n${stream}\nendstream endobj`,
    "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
  ];
  let pdf = "%PDF-1.4\n",
    offsets = [0];
  objects.forEach((o) => {
    offsets.push(pdf.length);
    pdf += `${o}\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 6\n0000000000 65535 f \n${offsets
    .slice(1)
    .map((o) => String(o).padStart(10, "0") + " 00000 n ")
    .join("\n")}\ntrailer << /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([pdf], { type: "application/pdf" });
}

export default function AuditManagement() {
  const [collapsed, setCollapsed] = useState(false),
    [mobileOpen, setMobileOpen] = useState(false),
    [dark, setDark] = useState(
      () => localStorage.getItem("assetflow_theme") === "dark",
    );
  const storedAudit = getAll(KEYS.audits)[0];
  const [assets, setAssets] = useState(() =>
      storedAudit?.items?.length
        ? storedAudit.items.map((item) => ({
            id: item.assetId,
            tag: item.tag,
            asset: item.name,
            category: item.category,
            expected: item.expectedLocation,
            current: item.currentLocation || "—",
            verification: item.verificationMethod || "Pending",
            status: {
              LOCATION_MISMATCH: "Mismatch",
              VERIFIED: "Verified",
              MISSING: "Missing",
              DAMAGED: "Damaged",
              PENDING: "Pending",
            }[item.verificationStatus],
            checked: item.checkedAt || "—",
          }))
        : auditAssets,
    ),
    [query, setQuery] = useState(""),
    [filter, setFilter] = useState("All"),
    [report, setReport] = useState(false),
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
      assets.filter(
        (a) =>
          (filter === "All" || a.status === filter) &&
          `${a.asset} ${a.tag} ${a.expected} ${a.current}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [assets, filter, query],
  );
  const count = (s) => assets.filter((a) => a.status === s).length,
    verified = count("Verified"),
    pending = count("Pending"),
    discrepancies = assets.filter((a) =>
      ["Missing", "Damaged", "Mismatch"].includes(a.status),
    ),
    progress = Math.round(((assets.length - pending) / assets.length) * 100);
  const changeStatus = (id, status) => {
    if (storedAudit) {
      const backend = {
        Mismatch: "LOCATION_MISMATCH",
        Verified: "VERIFIED",
        Missing: "MISSING",
        Damaged: "DAMAGED",
        Pending: "PENDING",
      }[status];
      verifyAuditItem(
        storedAudit.id,
        id,
        {
          verificationStatus: backend,
          currentLocation: assets.find((a) => a.id === id)?.current || "",
          verificationMethod: "Manual Verification",
        },
        currentUser,
      );
    }
    setAssets(
      assets.map((a) =>
        a.id === id
          ? {
              ...a,
              status,
              verification:
                status === "Pending" ? "Pending" : "Manual Verification",
              checked: status === "Pending" ? "—" : "Just now",
            }
          : a,
      ),
    );
    setToast(`Asset marked as ${status}`);
    setTimeout(() => setToast(""), 2200);
  };
  const download = () => {
    const lines = [
      "AssetFlow Audit Discrepancy Report",
      "Q3 Physical Asset Verification - Corporate Operations",
      "Auditor: Abhay Sonone | Progress: " + progress + "%",
      "",
      ...discrepancies.flatMap((r, i) => [
        `${i + 1}. ${r.tag} - ${r.asset} [${r.status}]`,
        `Expected: ${r.expected} | Current: ${r.current}`,
      ]),
    ];
    const url = URL.createObjectURL(createPdf(lines));
    const a = document.createElement("a");
    a.href = url;
    a.download = "assetflow-audit-discrepancy-report.pdf";
    a.click();
    URL.revokeObjectURL(url);
    setToast("PDF report downloaded");
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
        activePage="Audit"
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
        <main className="mx-auto max-w-[1650px] p-4 sm:p-6 lg:p-8">
          <header>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-brand-500">
              <ClipboardCheck size={15} /> Governance & Compliance
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-navy-900 dark:text-white">
              Audit Management
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Verify asset custody, reconcile physical locations, and resolve
              discrepancies with a complete audit trail.
            </p>
          </header>
          <section className="mt-7 overflow-hidden rounded-3xl bg-gradient-to-br from-navy-950 via-blue-950 to-indigo-950 p-6 text-white shadow-2xl shadow-blue-950/15 lg:p-8">
            <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-300">
                  <ShieldCheck size={17} /> ACTIVE AUDIT
                </div>
                <h2 className="mt-4 text-2xl font-extrabold sm:text-3xl">
                  Q3 Physical Asset Verification
                </h2>
                <p className="mt-2 text-sm text-slate-300">
                  Corporate Operations · 01–18 July 2026
                </p>
                <div className="mt-7 grid gap-4 sm:grid-cols-3">
                  <Meta
                    label="Department"
                    value="Corporate Operations"
                    icon={MapPin}
                  />
                  <Meta
                    label="Auditor"
                    value="Abhay Sonone"
                    icon={UserRoundCheck}
                  />
                  <Meta
                    label="Audit Scope"
                    value={`${assets.length} registered assets`}
                    icon={PackageSearch}
                  />
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-blue-200/70">Audit Progress</p>
                    <b className="mt-2 block text-4xl">{progress}%</b>
                  </div>
                  <span className="text-xs font-semibold text-emerald-300">
                    {assets.length - pending}/{assets.length} checked
                  </span>
                </div>
                <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-400 to-emerald-400"
                  />
                </div>
                <p className="mt-4 text-xs leading-5 text-blue-100/60">
                  {pending} assets remain before this audit can be submitted for
                  final review.
                </p>
              </div>
            </div>
          </section>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              icon={CheckCircle2}
              label="Assets Verified"
              value={verified}
              tone="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"
              active={filter === "Verified"}
              onClick={() =>
                setFilter(filter === "Verified" ? "All" : "Verified")
              }
            />
            <SummaryCard
              icon={PackageSearch}
              label="Missing"
              value={count("Missing")}
              tone="bg-red-50 text-red-600 dark:bg-red-500/10"
              active={filter === "Missing"}
              onClick={() =>
                setFilter(filter === "Missing" ? "All" : "Missing")
              }
            />
            <SummaryCard
              icon={ShieldAlert}
              label="Damaged"
              value={count("Damaged")}
              tone="bg-orange-50 text-orange-600 dark:bg-orange-500/10"
              active={filter === "Damaged"}
              onClick={() =>
                setFilter(filter === "Damaged" ? "All" : "Damaged")
              }
            />
            <SummaryCard
              icon={AlertTriangle}
              label="Pending"
              value={pending}
              tone="bg-slate-100 text-slate-600 dark:bg-slate-800"
              active={filter === "Pending"}
              onClick={() =>
                setFilter(filter === "Pending" ? "All" : "Pending")
              }
            />
          </div>
          <section className="card mt-6 overflow-hidden">
            <div className="flex flex-col justify-between gap-4 border-b p-4 dark:border-slate-800 lg:flex-row">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  size={17}
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search asset, tag, or location..."
                  className="field pl-11"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="rounded-xl border bg-white px-4 py-2.5 text-sm font-semibold dark:border-slate-700 dark:bg-slate-950"
                >
                  {statuses.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
                <button
                  onClick={() => setReport(true)}
                  disabled={!discrepancies.length}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-500/20 disabled:opacity-40"
                >
                  <FileWarning size={17} /> Generate Discrepancy Report
                </button>
                <button
                  onClick={download}
                  className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-bold dark:border-slate-700 dark:bg-slate-900"
                >
                  <Download size={17} /> Download PDF
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead>
                  <tr className="bg-slate-50 text-[10px] font-bold uppercase tracking-[.12em] text-slate-400 dark:bg-slate-950">
                    {[
                      "Asset",
                      "Expected Location",
                      "Current Location",
                      "Verification Status",
                      "Status",
                      "Last Checked",
                      "Action",
                    ].map((x) => (
                      <th key={x} className="px-5 py-4">
                        {x}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-800">
                  {filtered.map((a, i) => (
                    <motion.tr
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.035 }}
                      key={a.id}
                      className="group hover:bg-blue-50/35 dark:hover:bg-blue-950/15"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-brand-500 dark:bg-blue-500/10">
                            <ClipboardCheck size={17} />
                          </span>
                          <div>
                            <b className="block text-sm text-navy-900 dark:text-white">
                              {a.asset}
                            </b>
                            <span className="font-mono text-[9px] text-brand-500">
                              {a.tag} · {a.category}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs font-medium">
                        {a.expected}
                      </td>
                      <td
                        className={`px-5 py-4 text-xs font-medium ${a.current !== a.expected && a.current !== "—" ? "text-red-500" : ""}`}
                      >
                        {a.current}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-semibold dark:bg-slate-800">
                          {a.verification}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge value={a.status} />
                      </td>
                      <td className="px-5 py-4 text-[10px] text-slate-400">
                        {a.checked}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            aria-label={`Update ${a.asset} status`}
                            value={a.status}
                            onChange={(e) => changeStatus(a.id, e.target.value)}
                            className="rounded-lg border bg-white px-2 py-1.5 text-[10px] font-semibold dark:border-slate-700 dark:bg-slate-900"
                          >
                            {statuses.slice(1).map((s) => (
                              <option key={s}>{s}</option>
                            ))}
                          </select>
                          <button
                            aria-label="View audit entry"
                            className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-blue-50 hover:text-brand-500"
                          >
                            <Eye size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {!filtered.length && (
                <div className="py-16 text-center text-sm text-slate-400">
                  No audit items match this view.
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
      <AnimatePresence>
        {report && (
          <ReportModal
            rows={discrepancies}
            onClose={() => setReport(false)}
            onDownload={download}
          />
        )}{" "}
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-5 right-5 z-[90] flex items-center gap-3 rounded-xl bg-navy-950 px-5 py-3 text-sm font-semibold text-white shadow-2xl"
          >
            <Sparkles className="text-blue-300" size={17} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
function Meta({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3">
      <Icon size={17} className="shrink-0 text-blue-300" />
      <div>
        <p className="text-[9px] font-bold uppercase text-white/40">{label}</p>
        <p className="mt-1 text-xs font-semibold">{value}</p>
      </div>
    </div>
  );
}
