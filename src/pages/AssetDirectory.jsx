import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Boxes,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit3,
  Eye,
  FileUp,
  Filter,
  History,
  Laptop,
  MapPin,
  PackagePlus,
  QrCode,
  Search,
  ShieldCheck,
  Trash2,
  UserRound,
  Wrench,
  X,
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import AdminTopbar from "../components/AdminTopbar";
import { assetTimeline } from "../data/assetData";
import { getCurrentUser } from "../utils/auth";
import { ROLES } from "../utils/rbac";
import {
  addActivityLog,
  addNotification,
  create as storeCreate,
  getAll,
  KEYS,
  remove as storeRemove,
  update as storeUpdate,
} from "../services/storageService";

const statuses = [
  "All",
  "Available",
  "Allocated",
  "Maintenance",
  "Reserved",
  "Disposed",
];
const badge = {
  Available: "bg-emerald-50 text-emerald-600",
  Allocated: "bg-blue-50 text-blue-600",
  Maintenance: "bg-amber-50 text-amber-600",
  Reserved: "bg-violet-50 text-violet-600",
  Disposed: "bg-slate-100 text-slate-500",
};
const blank = {
  tag: "",
  name: "",
  serial: "",
  qr: "",
  category: "Laptop",
  department: "Information Technology",
  assigned: "—",
  status: "Available",
  location: "HQ · Store A",
  purchase: "",
  warranty: "",
  condition: "GOOD",
  type: "NORMAL",
  value: "₹0",
};
const searchKeys = {
  "Asset Name": "name",
  "Asset Tag": "tag",
  "QR Code": "qr",
  "Serial Number": "serial",
};
const prettyDate = (v) =>
  v
    ? new Date(`${v}T00:00:00`).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

function FormModal({ asset, onClose, onSave }) {
  const [form, setForm] = useState(asset || blank),
    [error, setError] = useState("");
  const set = (key, value) => setForm({ ...form, [key]: value });
  const submit = (e) => {
    e.preventDefault();
    if (!form.tag || !form.name || !form.serial) {
      setError("Asset tag, name, and serial number are required.");
      return;
    }
    onSave({ ...form, qr: form.qr || `QR-${form.tag.replaceAll("-", "")}` });
  };
  return (
    <Overlay onClose={onClose}>
      <motion.form
        initial={{ y: 18, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="dashboard-scroll max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl dark:bg-slate-900"
      >
        <ModalHeader
          title={asset ? "Edit Asset" : "Register New Asset"}
          onClose={onClose}
        />
        <div className="grid gap-5 p-6 sm:grid-cols-2">
          {[
            ["Asset Tag", "tag"],
            ["Asset Name", "name"],
            ["Serial Number", "serial"],
            ["QR Code Reference", "qr"],
            ["Category", "category"],
            ["Department", "department"],
            ["Assigned To", "assigned"],
            ["Location", "location"],
          ].map(([label, key]) => (
            <Field
              key={key}
              label={label}
              value={form[key]}
              onChange={(v) => set(key, v)}
            />
          ))}
          <label>
            <Label>Asset Type</Label>
            <select
              value={form.type || "NORMAL"}
              onChange={(e) => set("type", e.target.value)}
              className="field"
            >
              <option value="NORMAL">Normal Asset</option>
              <option value="SHARED_RESOURCE">Shared Bookable Resource</option>
            </select>
          </label>
          <label>
            <Label>Condition</Label>
            <select
              value={form.condition || "GOOD"}
              onChange={(e) => set("condition", e.target.value)}
              className="field"
            >
              <option>GOOD</option>
              <option>DAMAGED</option>
              <option>LOST</option>
            </select>
          </label>
          <label>
            <Label>Status</Label>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              className="field"
            >
              {statuses.slice(1).map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <Field
            label="Purchase Date"
            type="date"
            value={form.purchase}
            onChange={(v) => set("purchase", v)}
          />
          <Field
            label="Warranty Date"
            type="date"
            value={form.warranty || ""}
            onChange={(v) => set("warranty", v)}
          />
          {error && (
            <p className="text-sm font-medium text-red-500 sm:col-span-2">
              {error}
            </p>
          )}
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-950">
          <Secondary onClick={onClose}>Cancel</Secondary>
          <button className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white">
            {asset ? "Save Changes" : "Register Asset"}
          </button>
        </div>
      </motion.form>
    </Overlay>
  );
}
function Field({ label, value, onChange, type = "text" }) {
  return (
    <label>
      <Label>{label}</Label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field"
      />
    </label>
  );
}
const Label = ({ children }) => (
  <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
    {children}
  </span>
);
const Overlay = ({ children, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
    className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm"
  >
    {children}
  </motion.div>
);
const ModalHeader = ({ title, onClose }) => (
  <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 dark:border-slate-800">
    <div>
      <p className="text-xs font-bold uppercase tracking-[.15em] text-brand-500">
        Asset Directory
      </p>
      <h2 className="mt-1 text-xl font-extrabold text-navy-900 dark:text-white">
        {title}
      </h2>
    </div>
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      className="grid size-9 place-items-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      <X size={19} />
    </button>
  </div>
);
const Secondary = ({ children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold dark:border-slate-700 dark:bg-slate-900"
  >
    {children}
  </button>
);

function Drawer({ asset, onClose, onEdit }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-slate-950/35"
      />
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        className="dashboard-scroll fixed inset-y-0 right-0 z-[60] w-full max-w-xl overflow-y-auto bg-slate-50 shadow-2xl dark:bg-slate-950"
      >
        <div className="sticky top-0 z-10 flex justify-between border-b bg-white/90 px-5 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
          <div>
            <b className="text-brand-500">Asset Details</b>
            <p className="text-xs text-slate-400">{asset.tag}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="rounded-xl bg-blue-50 px-3 text-brand-500"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={onClose}
              className="grid size-9 place-items-center rounded-xl border dark:border-slate-700"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="p-5">
          <section className="rounded-3xl bg-gradient-to-br from-navy-950 to-indigo-950 p-6 text-white shadow-xl">
            <div className="flex gap-4">
              <span className="grid size-14 place-items-center rounded-2xl bg-white/10">
                <Laptop />
              </span>
              <div>
                <h2 className="text-xl font-extrabold">{asset.name}</h2>
                <p className="text-xs text-blue-200/70">
                  {asset.category} · {asset.serial}
                </p>
                <Status value={asset.status} />
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 border-t border-white/10 pt-5 text-xs">
              <div>
                <span className="text-white/50">Asset value</span>
                <b className="block">{asset.value}</b>
              </div>
              <div>
                <span className="text-white/50">Purchase date</span>
                <b className="block">{prettyDate(asset.purchase)}</b>
              </div>
            </div>
          </section>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Info
              icon={UserRound}
              label="Current Holder"
              value={asset.assigned}
            />
            <Info icon={MapPin} label="Location" value={asset.location} />
            <Info icon={ShieldCheck} label="Warranty" value={asset.warranty} />
            <Info icon={QrCode} label="QR Reference" value={asset.qr} />
          </div>
          <section className="card mt-5 p-5">
            <h3 className="flex items-center justify-between font-bold">
              Asset Timeline <History className="text-brand-500" size={19} />
            </h3>
            <div className="mt-6">
              {assetTimeline.map(([date, title, copy], i) => (
                <div key={title} className="relative flex gap-4 pb-6 last:pb-0">
                  <span className="z-10 mt-1 size-3 shrink-0 rounded-full bg-brand-500 ring-4 ring-blue-50" />
                  {i < assetTimeline.length - 1 && (
                    <span className="absolute left-[5px] top-3 h-full w-px bg-slate-200 dark:bg-slate-700" />
                  )}
                  <div>
                    <p className="text-[10px] font-bold text-brand-500">
                      {date}
                    </p>
                    <p className="mt-1 text-sm font-bold">{title}</p>
                    <p className="mt-1 text-xs text-slate-400">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="card mt-5 p-5">
            <div className="flex gap-3">
              <Wrench className="text-amber-500" />
              <div>
                <h3 className="font-bold">Maintenance History</h3>
                <p className="text-xs text-slate-400">2 completed · 0 open</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                Last service<b className="block">12 Apr 2026</b>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                Next service<b className="block">12 Oct 2026</b>
              </div>
            </div>
          </section>
        </div>
      </motion.aside>
    </>
  );
}
const Info = ({ icon: Icon, label, value }) => (
  <div className="card p-4">
    <Icon className="text-brand-500" size={18} />
    <p className="mt-3 text-[10px] font-bold uppercase text-slate-400">
      {label}
    </p>
    <p className="truncate text-sm font-bold">{value}</p>
  </div>
);
const Status = ({ value }) => (
  <span
    className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${badge[value]}`}
  >
    {value}
  </span>
);

function QR({ asset, onClose }) {
  const cells = Array.from(
    { length: 121 },
    (_, i) => (i * 17 + asset.id * 7) % 11 < 5,
  );
  return (
    <Overlay onClose={onClose}>
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm rounded-3xl bg-white p-7 text-center dark:bg-slate-900"
      >
        <b className="text-brand-500">ASSET QR CODE</b>
        <h2 className="mt-2 text-xl font-extrabold">{asset.name}</h2>
        <div className="mx-auto mt-6 grid size-52 grid-cols-11 gap-0.5 rounded-2xl border-8 border-white bg-white p-2 shadow-xl dark:border-slate-800 dark:bg-slate-800">
          {cells.map((on, i) => (
            <span
              key={i}
              className={
                on ? "bg-navy-950 dark:bg-white" : "bg-white dark:bg-slate-800"
              }
            />
          ))}
        </div>
        <p className="mt-5 font-mono font-bold">{asset.tag}</p>
        <button
          onClick={onClose}
          className="mt-5 w-full rounded-xl bg-brand-500 py-3 font-bold text-white"
        >
          Done
        </button>
      </motion.div>
    </Overlay>
  );
}

export default function AssetDirectory() {
  const currentUser = getCurrentUser();
  const canManageAssets = [ROLES.ADMIN, ROLES.ASSET_MANAGER].includes(
    currentUser?.role,
  );
  const [collapsed, setCollapsed] = useState(false),
    [mobileOpen, setMobileOpen] = useState(false),
    [dark, setDark] = useState(
      () => localStorage.getItem("assetflow_theme") === "dark",
    );
  const loadAssets = () =>
    getAll(KEYS.assets)
      .map((asset) => ({
        ...asset,
        purchase: asset.purchaseDate,
        warranty: asset.warrantyDate,
        assigned: asset.currentHolder || "—",
        qr: asset.qr || `QR-${asset.tag}`,
        status:
          {
            AVAILABLE: "Available",
            ALLOCATED: "Allocated",
            UNDER_MAINTENANCE: "Maintenance",
            RESERVED: "Reserved",
            DISPOSED: "Disposed",
          }[asset.status] || asset.status,
      }))
      .filter(
        (asset) =>
          currentUser?.role !== ROLES.DEPARTMENT_HEAD ||
          asset.department === currentUser.department,
      );
  const [assets, setAssets] = useState(loadAssets),
    [query, setQuery] = useState(""),
    [searchBy, setSearchBy] = useState("All Fields"),
    [filters, setFilters] = useState({
      category: "All",
      status: "All",
      department: "All",
      location: "All",
    }),
    [page, setPage] = useState(1);
  const [drawer, setDrawer] = useState(null),
    [modal, setModal] = useState(() =>
      new URLSearchParams(window.location.search).get("create") === "1"
        ? {}
        : null,
    ),
    [qr, setQr] = useState(null),
    [remove, setRemove] = useState(null),
    [toast, setToast] = useState("");
  const fileRef = useRef(),
    navigate = useNavigate(),
    pageSize = 6;
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("assetflow_theme", dark ? "dark" : "light");
    return () => document.documentElement.classList.remove("dark");
  }, [dark]);
  const filtered = useMemo(
    () =>
      assets.filter((a) => {
        const text =
          searchBy === "All Fields"
            ? `${a.name} ${a.tag} ${a.qr} ${a.serial}`
            : a[searchKeys[searchBy]];
        return (
          text.toLowerCase().includes(query.toLowerCase()) &&
          Object.entries(filters).every(([k, v]) => v === "All" || a[k] === v)
        );
      }),
    [assets, query, searchBy, filters],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize)),
    visible = filtered.slice((page - 1) * pageSize, page * pageSize),
    options = (k) => ["All", ...new Set(assets.map((a) => a[k]))];
  const notify = (text) => {
    setToast(text);
    setTimeout(() => setToast(""), 2400);
  };
  const save = (form) => {
    const duplicate = getAll(KEYS.assets).find(
      (a) =>
        (a.tag.toLowerCase() === form.tag.toLowerCase() ||
          a.serial.toLowerCase() === form.serial.toLowerCase()) &&
        a.id !== modal.asset?.id,
    );
    if (duplicate) {
      notify("Asset tag or serial number already exists");
      return;
    }
    const payload = {
      ...form,
      purchaseDate: form.purchase,
      warrantyDate: form.warranty,
      type: form.type || "NORMAL",
      condition: form.condition || "GOOD",
      status: modal.asset
        ? {
            Available: "AVAILABLE",
            Allocated: "ALLOCATED",
            Maintenance: "UNDER_MAINTENANCE",
            Reserved: "RESERVED",
            Disposed: "DISPOSED",
          }[form.status] || form.status
        : "AVAILABLE",
      currentHolder: modal.asset?.currentHolder || null,
    };
    const saved = modal.asset
      ? storeUpdate(KEYS.assets, modal.asset.id, payload)
      : storeCreate(KEYS.assets, payload);
    if (
      !modal.asset &&
      saved.type === "SHARED_RESOURCE" &&
      !getAll(KEYS.resources).some((resource) => resource.id === saved.id)
    )
      storeCreate(KEYS.resources, {
        id: saved.id,
        name: saved.name,
        assetTag: saved.tag,
        department: saved.department,
        location: saved.location,
        status: "ACTIVE",
      });
    addActivityLog({
      actor: currentUser.name,
      role: currentUser.role,
      action: modal.asset ? "ASSET_UPDATED" : "ASSET_REGISTERED",
      entity: "ASSET",
      entityId: saved.id,
      details: `${saved.tag} · ${saved.name}`,
    });
    addNotification({
      type: "Assets",
      title: modal.asset ? "Asset updated" : "New asset registered",
      description: `${saved.name} (${saved.tag})`,
      priority: "Normal",
      reference: saved.tag,
    });
    setAssets(loadAssets());
    notify(
      modal.asset
        ? "Asset updated successfully"
        : "Asset registered successfully",
    );
    setModal(null);
  };
  const exportCsv = () => {
    const cols = [
      "tag",
      "name",
      "category",
      "department",
      "assigned",
      "status",
      "location",
      "purchase",
    ];
    const csv = [cols, ...filtered.map((a) => cols.map((c) => a[c]))]
      .map((r) => r.join(","))
      .join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = "assetflow-assets.csv";
    link.click();
    URL.revokeObjectURL(link.href);
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
        activePage="Assets"
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
          <header className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-brand-500">
                <Boxes size={15} /> Asset Management
              </p>
              <h1 className="mt-2 text-3xl font-extrabold text-navy-900 dark:text-white">
                Asset Directory
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                A unified, auditable view of every physical asset across your
                organization.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                ref={fileRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) =>
                  e.target.files[0] &&
                  notify(`${e.target.files[0].name} ready for import`)
                }
              />
              {canManageAssets && (
                <Action
                  icon={FileUp}
                  text="Import Assets"
                  onClick={() => fileRef.current.click()}
                />
              )}
              <Action icon={Download} text="Export CSV" onClick={exportCsv} />
              {canManageAssets && (
                <button
                  onClick={() => setModal({})}
                  className="flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20"
                >
                  <PackagePlus size={17} /> Register Asset
                </button>
              )}
            </div>
          </header>
          <section className="card mt-7 overflow-hidden">
            <SearchFilters
              query={query}
              setQuery={setQuery}
              searchBy={searchBy}
              setSearchBy={setSearchBy}
              filters={filters}
              setFilters={setFilters}
              options={options}
              setPage={setPage}
              total={filtered.length}
            />
            <AssetTable
              assets={visible}
              onView={setDrawer}
              onEdit={(a) => setModal({ asset: a })}
              onQR={setQr}
              onDelete={setRemove}
              canManage={canManageAssets}
            />
            <Pagination
              page={page}
              pages={pages}
              setPage={setPage}
              total={filtered.length}
              size={pageSize}
            />
          </section>
        </main>
      </div>
      <AnimatePresence>
        {drawer && (
          <Drawer
            asset={drawer}
            onClose={() => setDrawer(null)}
            onEdit={() => {
              setModal({ asset: drawer });
              setDrawer(null);
            }}
          />
        )}
        {modal && (
          <FormModal
            asset={modal.asset}
            onClose={() => setModal(null)}
            onSave={save}
          />
        )}{" "}
        {qr && <QR asset={qr} onClose={() => setQr(null)} />}{" "}
        {remove && (
          <Delete
            asset={remove}
            onClose={() => setRemove(null)}
            onDelete={() => {
              storeRemove(KEYS.assets, remove.id);
              setAssets(loadAssets());
              setRemove(null);
              notify("Asset removed from directory");
            }}
          />
        )}
        {toast && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-5 right-5 z-[90] rounded-xl bg-navy-950 px-5 py-3 text-sm font-semibold text-white shadow-2xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SearchFilters({
  query,
  setQuery,
  searchBy,
  setSearchBy,
  filters,
  setFilters,
  options,
  setPage,
  total,
}) {
  const change = (k, v) => {
    setFilters({ ...filters, [k]: v });
    setPage(1);
  };
  return (
    <>
      <div className="grid gap-3 border-b p-4 dark:border-slate-800 lg:grid-cols-[170px_1fr]">
        <select
          value={searchBy}
          onChange={(e) => setSearchBy(e.target.value)}
          className="field"
        >
          <option>All Fields</option>
          <option>Asset Name</option>
          <option>Asset Tag</option>
          <option>QR Code</option>
          <option>Serial Number</option>
        </select>
        <div className="relative">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder={`Search by ${searchBy.toLowerCase()}...`}
            className="field pl-11"
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-b px-4 py-3 dark:border-slate-800">
        <b className="flex gap-2 text-xs text-slate-400">
          <Filter size={14} /> FILTERS
        </b>
        {[
          ["category", "Category"],
          ["status", "Status"],
          ["department", "Department"],
          ["location", "Location"],
        ].map(([k, l]) => (
          <select
            key={k}
            value={filters[k]}
            onChange={(e) => change(k, e.target.value)}
            className="rounded-lg border px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-950"
          >
            {(k === "status" ? statuses : options(k)).map((v) => (
              <option key={v}>{v === "All" ? `All ${l}s` : v}</option>
            ))}
          </select>
        ))}
        <span className="ml-auto text-xs text-slate-400">{total} assets</span>
      </div>
    </>
  );
}
function AssetTable({ assets, onView, onEdit, onQR, onDelete, canManage }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1200px] text-left">
        <thead>
          <tr className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-400 dark:bg-slate-950">
            {[
              "Asset Tag",
              "Name",
              "Category",
              "Department",
              "Assigned To",
              "Status",
              "Location",
              "Purchase Date",
              "Actions",
            ].map((h) => (
              <th key={h} className="px-4 py-4">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y dark:divide-slate-800">
          {assets.map((a, i) => (
            <motion.tr
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              key={a.id}
              className="group hover:bg-blue-50/40 dark:hover:bg-blue-950/15"
            >
              <td className="px-4 py-4">
                <button
                  onClick={() => onView(a)}
                  className="font-mono text-xs font-bold text-brand-500"
                >
                  {a.tag}
                </button>
              </td>
              <td className="px-4 py-4">
                <b className="block text-sm">{a.name}</b>
                <span className="text-[9px] text-slate-400">
                  S/N {a.serial}
                </span>
              </td>
              <td className="cell">{a.category}</td>
              <td className="cell">{a.department}</td>
              <td className="cell">{a.assigned}</td>
              <td className="px-4">
                <Status value={a.status} />
              </td>
              <td className="cell">{a.location}</td>
              <td className="cell">{prettyDate(a.purchase)}</td>
              <td className="px-4">
                <div className="flex gap-1">
                  <IconButton
                    icon={Eye}
                    label="View"
                    onClick={() => onView(a)}
                  />
                  {canManage && (
                    <>
                      <IconButton
                        icon={Edit3}
                        label="Edit"
                        onClick={() => onEdit(a)}
                      />
                      <IconButton
                        icon={QrCode}
                        label="Generate QR"
                        onClick={() => onQR(a)}
                      />
                      <IconButton
                        icon={Trash2}
                        label="Delete"
                        danger
                        onClick={() => onDelete(a)}
                      />
                    </>
                  )}
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      {!assets.length && (
        <div className="py-20 text-center">
          <Search className="mx-auto text-slate-300" />
          <b className="mt-3 block">No matching assets</b>
        </div>
      )}
    </div>
  );
}
const IconButton = ({ icon: Icon, label, onClick, danger }) => (
  <button
    onClick={onClick}
    title={label}
    aria-label={label}
    className={`grid size-8 place-items-center rounded-lg ${danger ? "hover:bg-red-50 hover:text-red-500" : "hover:bg-blue-50 hover:text-brand-500"}`}
  >
    <Icon size={15} />
  </button>
);
const Action = ({ icon: Icon, text, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 rounded-xl border bg-white px-4 py-2.5 text-sm font-bold shadow-sm dark:border-slate-700 dark:bg-slate-900"
  >
    <Icon size={17} />
    {text}
  </button>
);
function Pagination({ page, pages, setPage, total, size }) {
  return (
    <div className="flex items-center justify-between border-t px-5 py-4 text-xs dark:border-slate-800">
      <span>
        Showing {total ? (page - 1) * size + 1 : 0}–
        {Math.min(page * size, total)} of {total}
      </span>
      <div className="flex gap-1">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="pager"
        >
          <ChevronLeft size={15} />
        </button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            onClick={() => setPage(n)}
            className={`pager ${n === page ? "bg-brand-500 text-white" : ""}`}
          >
            {n}
          </button>
        ))}
        <button
          disabled={page === pages}
          onClick={() => setPage(page + 1)}
          className="pager"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
function Delete({ asset, onClose, onDelete }) {
  return (
    <Overlay onClose={onClose}>
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-white p-6 dark:bg-slate-900"
      >
        <Trash2 className="text-red-500" />
        <h2 className="mt-4 text-xl font-extrabold">Delete asset?</h2>
        <p className="mt-2 text-sm text-slate-500">
          Remove <b>{asset.name}</b> ({asset.tag}) from the directory?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <Secondary onClick={onClose}>Cancel</Secondary>
          <button
            onClick={onDelete}
            className="rounded-xl bg-red-500 px-4 py-2.5 font-bold text-white"
          >
            Delete Asset
          </button>
        </div>
      </motion.div>
    </Overlay>
  );
}
