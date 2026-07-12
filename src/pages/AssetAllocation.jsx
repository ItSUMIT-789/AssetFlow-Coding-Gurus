import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeftRight,
  Building2,
  CheckCircle2,
  Clock3,
  History,
  Laptop,
  MapPin,
  PackageCheck,
  RotateCcw,
  Send,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import AdminTopbar from "../components/AdminTopbar";
import {
  allocationHistory,
  departments,
  employees,
  returnHistory,
  transferHistory,
} from "../data/allocationData";
import { getCurrentUser } from "../utils/auth";
import { ROLES } from "../utils/rbac";
import { getAll, KEYS } from "../services/storageService";
import {
  allocateAsset,
  approveReturn,
  decideTransfer,
  requestReturn,
  requestTransfer,
} from "../services/workflowService";

const statusStyle = {
  Completed: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10",
  "Pending Approval": "bg-amber-50 text-amber-600 dark:bg-amber-500/10",
  Approved: "bg-blue-50 text-blue-600 dark:bg-blue-500/10",
  Rejected: "bg-red-50 text-red-600 dark:bg-red-500/10",
};

function SelectBox({ label, icon: Icon, value, onChange, children, disabled }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
        <Icon size={16} className="text-slate-400" />
        {label}
      </span>
      <select
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-60 dark:disabled:bg-slate-800"
      >
        {children}
      </select>
    </label>
  );
}
function HolderCard({ asset }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-2xl border border-blue-200/70 bg-gradient-to-br from-blue-50 via-white to-indigo-50 shadow-sm dark:border-blue-900/50 dark:from-blue-950/25 dark:via-slate-900 dark:to-indigo-950/20"
    >
      <div className="flex items-center justify-between border-b border-blue-100/70 px-5 py-4 dark:border-blue-900/40">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.15em] text-brand-500">
            Current Custody
          </p>
          <h3 className="mt-1 font-bold text-navy-900 dark:text-white">
            Current Holder
          </h3>
        </div>
        <span className="rounded-full bg-blue-100 px-2.5 py-1 text-[10px] font-bold text-blue-600 dark:bg-blue-500/10">
          ALLOCATED
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-4">
          <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 font-bold text-white shadow-lg shadow-blue-500/20">
            {asset.holder
              .split(" ")
              .map((x) => x[0])
              .slice(0, 2)
              .join("")}
          </span>
          <div>
            <h4 className="font-extrabold text-navy-900 dark:text-white">
              {asset.holder}
            </h4>
            <p className="mt-1 text-xs text-slate-400">
              {asset.holderId} · {asset.department}
            </p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
          <Info label="Allocated since" value={asset.since} icon={Clock3} />
          <Info label="Asset location" value={asset.location} icon={MapPin} />
        </div>
      </div>
    </motion.section>
  );
}
function Info({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl bg-white/80 p-3 dark:bg-slate-950/50">
      <Icon size={15} className="text-brand-500" />
      <p className="mt-2 text-[9px] font-bold uppercase text-slate-400">
        {label}
      </p>
      <p className="mt-1 font-semibold text-slate-700 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
}

function TransferForm({ asset, onSubmit }) {
  const [newHolder, setNewHolder] = useState(""),
    [reason, setReason] = useState(""),
    [priority, setPriority] = useState("Normal"),
    [error, setError] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (!newHolder || !reason.trim()) {
      setError("Select a new holder and provide a transfer reason.");
      return;
    }
    onSubmit({ newHolder, reason, priority });
  };
  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={submit}
      className="card overflow-hidden"
    >
      <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <p className="text-[10px] font-bold uppercase tracking-[.15em] text-violet-500">
          Governed Workflow
        </p>
        <h3 className="mt-1 font-bold text-navy-900 dark:text-white">
          Transfer Request
        </h3>
        <p className="mt-1 text-xs text-slate-400">
          Create an approval request instead of reallocating this asset
          directly.
        </p>
      </div>
      <div className="grid gap-5 p-5 sm:grid-cols-2">
        <label>
          <span className="mb-2 block text-sm font-semibold">
            Current Holder
          </span>
          <input
            value={asset.holder}
            disabled
            className="field disabled:bg-slate-100 dark:disabled:bg-slate-800"
          />
        </label>
        <SelectBox
          label="New Holder"
          icon={UserRound}
          value={newHolder}
          onChange={setNewHolder}
        >
          <option value="">Select employee</option>
          {employees
            .filter((e) => e[1] !== asset.holder)
            .map((e) => (
              <option key={e[0]} value={e[1]}>
                {e[1]} · {e[2]}
              </option>
            ))}
        </SelectBox>
        <label className="sm:col-span-2">
          <span className="mb-2 block text-sm font-semibold">
            Reason for Transfer
          </span>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows="3"
            placeholder="Explain the operational need and context..."
            className="field resize-none"
          />
        </label>
        <label>
          <span className="mb-2 block text-sm font-semibold">Priority</span>
          <div className="grid grid-cols-3 gap-2">
            {["Low", "Normal", "High"].map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setPriority(p)}
                className={`rounded-xl border px-3 py-2.5 text-xs font-bold transition ${priority === p ? (p === "High" ? "border-red-300 bg-red-50 text-red-600 dark:bg-red-500/10" : "border-blue-300 bg-blue-50 text-brand-500 dark:bg-blue-500/10") : "border-slate-200 text-slate-400 dark:border-slate-700"}`}
              >
                {p}
              </button>
            ))}
          </div>
        </label>
        <div className="flex items-end">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20">
            <Send size={16} /> Submit Transfer Request
          </button>
        </div>
        {error && (
          <p className="text-sm font-medium text-red-500 sm:col-span-2">
            {error}
          </p>
        )}
      </div>
    </motion.form>
  );
}

function AllocationForm({ asset, onSubmit }) {
  const [employee, setEmployee] = useState(""),
    [department, setDepartment] = useState(asset.department || ""),
    [note, setNote] = useState(""),
    [error, setError] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (!employee || !department) {
      setError("Select an employee and department before allocation.");
      return;
    }
    onSubmit({ employee, department, note });
  };
  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={submit}
      className="card overflow-hidden"
    >
      <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <p className="text-[10px] font-bold uppercase tracking-[.15em] text-emerald-500">
          Ready to Allocate
        </p>
        <h3 className="mt-1 font-bold text-navy-900 dark:text-white">
          New Asset Allocation
        </h3>
        <p className="mt-1 text-xs text-slate-400">
          Assign this available asset with clear department ownership.
        </p>
      </div>
      <div className="grid gap-5 p-5 sm:grid-cols-2">
        <SelectBox
          label="Employee Selector"
          icon={UserRound}
          value={employee}
          onChange={setEmployee}
        >
          <option value="">Select employee</option>
          {employees.map((e) => (
            <option key={e[0]} value={e[1]}>
              {e[1]} · {e[0]}
            </option>
          ))}
        </SelectBox>
        <SelectBox
          label="Department Selector"
          icon={Building2}
          value={department}
          onChange={setDepartment}
        >
          <option value="">Select department</option>
          {departments.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </SelectBox>
        <label className="sm:col-span-2">
          <span className="mb-2 block text-sm font-semibold">
            Allocation Note{" "}
            <span className="font-normal text-slate-400">(optional)</span>
          </span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows="3"
            placeholder="Add custody or usage instructions..."
            className="field resize-none"
          />
        </label>
        {error && (
          <p className="text-sm font-medium text-red-500 sm:col-span-2">
            {error}
          </p>
        )}
        <button className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 sm:col-span-2">
          <PackageCheck size={17} /> Confirm Asset Allocation
        </button>
      </div>
    </motion.form>
  );
}

function HistoryPanel({ requests }) {
  const [tab, setTab] = useState("Timeline");
  const rows =
    tab === "Allocation History"
      ? allocationHistory
      : tab === "Return History"
        ? returnHistory
        : tab === "Transfer Requests"
          ? [...requests, ...transferHistory]
          : [
              ...requests,
              ...transferHistory,
              ...returnHistory,
              ...allocationHistory,
            ].sort(
              (a, b) => b.date.includes("Today") - a.date.includes("Today"),
            );
  return (
    <section className="card mt-6 overflow-hidden">
      <div className="flex gap-1 overflow-x-auto border-b px-4 pt-3 dark:border-slate-800">
        {[
          "Timeline",
          "Allocation History",
          "Return History",
          "Transfer Requests",
        ].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative whitespace-nowrap px-4 py-3 text-sm font-semibold ${tab === t ? "text-brand-500" : "text-slate-400"}`}
          >
            {t}
            {tab === t && (
              <motion.span
                layoutId="history-tab"
                className="absolute inset-x-2 bottom-0 h-0.5 bg-brand-500"
              />
            )}
          </button>
        ))}
      </div>
      <div className="p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-navy-900 dark:text-white">{tab}</h3>
            <p className="mt-1 text-xs text-slate-400">
              Allocation, returns, transfer requests, and approval status.
            </p>
          </div>
          <History className="text-brand-500" size={20} />
        </div>
        {rows.map((row, i) => (
          <motion.div
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            key={`${row.date}-${row.title}`}
            className="relative flex gap-4 pb-6 last:pb-0"
          >
            <div>
              <span
                className={`relative z-10 grid size-8 place-items-center rounded-xl ${row.kind === "Allocation" ? "bg-blue-50 text-blue-600" : row.kind === "Return" ? "bg-emerald-50 text-emerald-600" : "bg-violet-50 text-violet-600"}`}
              >
                {row.kind === "Allocation" ? (
                  <PackageCheck size={15} />
                ) : row.kind === "Return" ? (
                  <RotateCcw size={15} />
                ) : (
                  <ArrowLeftRight size={15} />
                )}
              </span>
              {i < rows.length - 1 && (
                <span className="absolute left-[15px] top-8 h-full w-px bg-slate-200 dark:bg-slate-700" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col justify-between gap-2 sm:flex-row">
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">
                    {row.date}
                  </p>
                  <p className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-100">
                    {row.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{row.detail}</p>
                </div>
                <span
                  className={`h-fit w-fit rounded-full px-2.5 py-1 text-[10px] font-bold ${statusStyle[row.status]}`}
                >
                  {row.status}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default function AssetAllocation() {
  const currentUser = getCurrentUser();
  const storedAllocations = getAll(KEYS.allocations);
  const accessibleAssets = getAll(KEYS.assets)
    .map((asset) => {
      const allocation = storedAllocations.find(
        (a) => a.assetId === asset.id && a.status === "ACTIVE",
      );
      return {
        ...asset,
        status: asset.status === "ALLOCATED" ? "Allocated" : "Available",
        holder: asset.currentHolder,
        holderId: asset.currentHolderId,
        since: allocation?.allocationDate,
      };
    })
    .filter((asset) =>
      currentUser?.role === ROLES.DEPARTMENT_HEAD
        ? asset.department === currentUser.department
        : currentUser?.role === ROLES.EMPLOYEE
          ? asset.holder === currentUser.name
          : true,
    );
  const [collapsed, setCollapsed] = useState(false),
    [mobileOpen, setMobileOpen] = useState(false),
    [dark, setDark] = useState(
      () => localStorage.getItem("assetflow_theme") === "dark",
    );
  const [assetId, setAssetId] = useState(String(accessibleAssets[0]?.id || 1)),
    [employee, setEmployee] = useState(""),
    [department, setDepartment] = useState(""),
    [requests, setRequests] = useState(() =>
      getAll(KEYS.transfers).map((t) => ({
        id: t.id,
        date: t.createdAt ? new Date(t.createdAt).toLocaleString() : "Earlier",
        title: `${t.assetTag} transfer request`,
        detail: `${t.currentHolder} → ${t.newHolder} · ${t.priority} priority`,
        kind: "Transfer",
        status: t.status === "PENDING" ? "Pending Approval" : t.status,
      })),
    ),
    [toast, setToast] = useState(""),
    [returnRequests, setReturnRequests] = useState(() => getAll(KEYS.returns));
  const navigate = useNavigate();
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("assetflow_theme", dark ? "dark" : "light");
    return () => document.documentElement.classList.remove("dark");
  }, [dark]);
  const asset = useMemo(
    () => accessibleAssets.find((a) => String(a.id) === assetId),
    [assetId, accessibleAssets],
  );
  const notify = (text) => {
    setToast(text);
    setTimeout(() => setToast(""), 2600);
  };
  const transfer = (data) => {
    try {
      const saved = requestTransfer(
        {
          assetId: asset.id,
          newHolderId: data.newHolder,
          reason: data.reason,
          priority: data.priority,
        },
        currentUser,
      );
      setRequests([
        {
          date: "Today, just now",
          title: `${asset.name} transfer requested`,
          detail: `${asset.holder} → ${saved.newHolder} · ${data.priority} priority`,
          kind: "Transfer",
          status: "Pending Approval",
        },
        ...requests,
      ]);
      notify("Transfer request submitted for approval");
    } catch (error) {
      notify(error.message);
    }
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
        activePage="Allocation & Transfer"
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
        <main className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">
          <header>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-brand-500">
              <ArrowLeftRight size={15} /> Asset Operations
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-navy-900 dark:text-white">
              Asset Allocation & Transfer
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Assign available assets and route custody changes through a
              transparent, approval-driven workflow.
            </p>
          </header>
          <section className="card mt-7 p-5">
            <div className="grid gap-5 lg:grid-cols-3">
              <SelectBox
                label="Asset Selector"
                icon={Laptop}
                value={assetId}
                onChange={(v) => {
                  setAssetId(v);
                  setEmployee("");
                  setDepartment("");
                }}
              >
                {accessibleAssets.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.tag} · {a.name} ({a.status})
                  </option>
                ))}
              </SelectBox>
              <SelectBox
                label="Employee Selector"
                icon={UserRound}
                value={employee}
                onChange={setEmployee}
                disabled={asset.status === "Allocated"}
              >
                <option value="">Select employee</option>
                {employees.map((e) => (
                  <option key={e[0]} value={e[1]}>
                    {e[1]} · {e[0]}
                  </option>
                ))}
              </SelectBox>
              <SelectBox
                label="Department Selector"
                icon={Building2}
                value={department}
                onChange={setDepartment}
                disabled={asset.status === "Allocated"}
              >
                <option value="">Select department</option>
                {departments.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </SelectBox>
            </div>
            <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-950/60 sm:flex-row sm:items-center">
              <span
                className={`grid size-11 place-items-center rounded-xl ${asset.status === "Allocated" ? "bg-amber-100 text-amber-600 dark:bg-amber-500/10" : "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10"}`}
              >
                {asset.status === "Allocated" ? (
                  <ShieldCheck size={20} />
                ) : (
                  <CheckCircle2 size={20} />
                )}
              </span>
              <div>
                <p className="text-sm font-bold text-navy-900 dark:text-white">
                  {asset.name}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {asset.tag} · {asset.category} · {asset.location}
                </p>
              </div>
              <span
                className={`sm:ml-auto rounded-full px-3 py-1 text-[10px] font-bold ${asset.status === "Allocated" ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10" : "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10"}`}
              >
                {asset.status.toUpperCase()}
              </span>
            </div>
          </section>
          <div className="mt-6 grid items-start gap-6 xl:grid-cols-[.72fr_1.28fr]">
            <div>
              {asset.status === "Allocated" ? (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-5 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-5 dark:border-amber-900/50 dark:from-amber-950/30 dark:to-orange-950/20"
                  >
                    <div className="flex gap-3">
                      <AlertTriangle
                        className="shrink-0 text-amber-600"
                        size={22}
                      />
                      <div>
                        <h3 className="font-bold text-amber-900 dark:text-amber-300">
                          Direct allocation blocked
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-amber-700 dark:text-amber-400">
                          This asset is already allocated. To protect custody
                          history and prevent double allocation, submit a
                          transfer request instead.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                  <HolderCard asset={asset} />
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 dark:border-emerald-900/50 dark:bg-emerald-950/20"
                >
                  <CheckCircle2 className="text-emerald-600" />
                  <h3 className="mt-3 font-bold text-emerald-900 dark:text-emerald-300">
                    Asset available for allocation
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-emerald-700 dark:text-emerald-400">
                    No active holder or conflicting request was found. You can
                    safely continue.
                  </p>
                </motion.div>
              )}
            </div>
            <div>
              {asset.status === "Allocated" ? (
                <>
                  <TransferForm
                    key={asset.id}
                    asset={asset}
                    onSubmit={transfer}
                  />
                  {currentUser.role === ROLES.EMPLOYEE && (
                    <button
                      onClick={() => {
                        try {
                          requestReturn(
                            {
                              assetId: asset.id,
                              notes: "Employee initiated return",
                            },
                            currentUser,
                          );
                          notify(
                            "Return request submitted for Asset Manager approval",
                          );
                        } catch (error) {
                          notify(error.message);
                        }
                      }}
                      className="mt-3 w-full rounded-xl border border-blue-200 bg-blue-50 py-3 text-sm font-bold text-brand-500"
                    >
                      Initiate Asset Return
                    </button>
                  )}
                </>
              ) : (
                <AllocationForm
                  key={asset.id}
                  asset={asset}
                  onSubmit={(data) => {
                    try {
                      const expected = new Date();
                      expected.setDate(expected.getDate() + 30);
                      allocateAsset(
                        {
                          assetId: asset.id,
                          holderId: data.employee,
                          expectedReturnDate: expected
                            .toISOString()
                            .slice(0, 10),
                        },
                        currentUser,
                      );
                      notify(
                        "Asset allocated successfully and custody timeline updated",
                      );
                    } catch (error) {
                      notify(error.message);
                    }
                  }}
                />
              )}
            </div>
          </div>
          {[ROLES.ADMIN, ROLES.ASSET_MANAGER, ROLES.DEPARTMENT_HEAD].includes(
            currentUser.role,
          ) &&
            requests.some((r) => r.status === "Pending Approval") && (
              <section className="card mt-6 p-5">
                <h2 className="font-extrabold text-navy-900 dark:text-white">
                  Transfer Approval Queue
                </h2>
                <div className="mt-4 space-y-3">
                  {requests
                    .filter((r) => r.status === "Pending Approval")
                    .map((r) => (
                      <div
                        key={r.id}
                        className="flex flex-col justify-between gap-3 rounded-xl border p-4 dark:border-slate-800 sm:flex-row sm:items-center"
                      >
                        <div>
                          <b className="text-sm">{r.title}</b>
                          <p className="mt-1 text-xs text-slate-400">
                            {r.detail}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              try {
                                decideTransfer(r.id, "REJECT", currentUser);
                                setRequests(
                                  requests.map((x) =>
                                    x.id === r.id
                                      ? { ...x, status: "Rejected" }
                                      : x,
                                  ),
                                );
                                notify("Transfer rejected");
                              } catch (error) {
                                notify(error.message);
                              }
                            }}
                            className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => {
                              try {
                                decideTransfer(r.id, "APPROVE", currentUser);
                                setRequests(
                                  requests.map((x) =>
                                    x.id === r.id
                                      ? { ...x, status: "Approved" }
                                      : x,
                                  ),
                                );
                                notify("Transfer approved and custody updated");
                              } catch (error) {
                                notify(error.message);
                              }
                            }}
                            className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-bold text-white"
                          >
                            Approve
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </section>
            )}
          {[ROLES.ADMIN, ROLES.ASSET_MANAGER].includes(currentUser.role) &&
            returnRequests.some((r) => r.status === "PENDING") && (
              <section className="card mt-6 p-5">
                <h2 className="font-extrabold text-navy-900 dark:text-white">
                  Return Approval Queue
                </h2>
                <div className="mt-4 space-y-3">
                  {returnRequests
                    .filter((r) => r.status === "PENDING")
                    .map((r) => (
                      <div
                        key={r.id}
                        className="flex flex-col justify-between gap-3 rounded-xl border p-4 dark:border-slate-800 sm:flex-row sm:items-center"
                      >
                        <div>
                          <b className="text-sm">{r.assetTag} return request</b>
                          <p className="mt-1 text-xs text-slate-400">
                            {r.notes || "No condition note provided"}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            try {
                              approveReturn(
                                {
                                  requestId: r.id,
                                  condition: "GOOD",
                                  conditionNotes: "Verified in good condition",
                                },
                                currentUser,
                              );
                              setReturnRequests(
                                returnRequests.map((x) =>
                                  x.id === r.id
                                    ? { ...x, status: "APPROVED" }
                                    : x,
                                ),
                              );
                              notify("Return approved; asset is available");
                            } catch (error) {
                              notify(error.message);
                            }
                          }}
                          className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-bold text-white"
                        >
                          Approve Good Return
                        </button>
                      </div>
                    ))}
                </div>
              </section>
            )}
          <HistoryPanel requests={requests} />
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
            <CheckCircle2 size={18} className="text-emerald-400" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
