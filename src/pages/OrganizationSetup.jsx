import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Layers3,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import AdminTopbar from "../components/AdminTopbar";

const seedDepartments = [
  {
    id: 1,
    name: "Information Technology",
    code: "IT",
    head: "Rahul Mehta",
    parent: "Corporate Operations",
    employees: 68,
    status: "Active",
  },
  {
    id: 2,
    name: "Human Resources",
    code: "HR",
    head: "Neha Kapoor",
    parent: "Corporate Operations",
    employees: 24,
    status: "Active",
  },
  {
    id: 3,
    name: "Finance",
    code: "FIN",
    head: "Amit Kulkarni",
    parent: "Executive Office",
    employees: 31,
    status: "Active",
  },
  {
    id: 4,
    name: "Operations",
    code: "OPS",
    head: "Priya Nair",
    parent: "Executive Office",
    employees: 92,
    status: "Active",
  },
  {
    id: 5,
    name: "Sales",
    code: "SAL",
    head: "Vikram Shah",
    parent: "Revenue Division",
    employees: 57,
    status: "Active",
  },
  {
    id: 6,
    name: "Marketing",
    code: "MKT",
    head: "Sneha Iyer",
    parent: "Revenue Division",
    employees: 29,
    status: "Active",
  },
  {
    id: 7,
    name: "Administration",
    code: "ADM",
    head: "Rohan Deshmukh",
    parent: "Corporate Operations",
    employees: 36,
    status: "Active",
  },
  {
    id: 8,
    name: "Research & Development",
    code: "RND",
    head: "Kavya Rao",
    parent: "Product Division",
    employees: 44,
    status: "Inactive",
  },
  {
    id: 9,
    name: "Procurement",
    code: "PRC",
    head: "Arjun Malhotra",
    parent: "Operations",
    employees: 18,
    status: "Active",
  },
  {
    id: 10,
    name: "Customer Success",
    code: "CS",
    head: "Meera Joshi",
    parent: "Revenue Division",
    employees: 41,
    status: "Inactive",
  },
];
const emptyForm = {
  name: "",
  code: "",
  head: "",
  parent: "",
  status: "Active",
};

function DepartmentModal({ mode, department, onClose, onSave }) {
  const [form, setForm] = useState(department || emptyForm);
  const [error, setError] = useState("");
  const readOnly = mode === "view";
  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.code.trim() || !form.head.trim()) {
      setError("Department, code, and department head are required.");
      return;
    }
    onSave(form);
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.form
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        onSubmit={submit}
        className="w-full max-w-xl overflow-hidden rounded-3xl border border-white/60 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5 dark:border-slate-800">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-brand-500">
              Organization Setup
            </p>
            <h2 className="mt-1 text-xl font-extrabold text-navy-900 dark:text-white">
              {mode === "add"
                ? "Add Department"
                : mode === "edit"
                  ? "Edit Department"
                  : "Department Details"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close modal"
          >
            <X size={19} />
          </button>
        </div>
        <div className="grid gap-5 p-6 sm:grid-cols-2">
          <Field
            label="Department Name"
            value={form.name}
            disabled={readOnly}
            onChange={(v) => setForm({ ...form, name: v })}
            placeholder="e.g. Legal"
          />
          <Field
            label="Department Code"
            value={form.code}
            disabled={readOnly}
            onChange={(v) =>
              setForm({ ...form, code: v.toUpperCase().slice(0, 6) })
            }
            placeholder="e.g. LEG"
          />
          <Field
            label="Department Head"
            value={form.head}
            disabled={readOnly}
            onChange={(v) => setForm({ ...form, head: v })}
            placeholder="Select or enter head"
          />
          <Field
            label="Parent Department"
            value={form.parent}
            disabled={readOnly}
            onChange={(v) => setForm({ ...form, parent: v })}
            placeholder="e.g. Corporate Operations"
          />
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Status
            </span>
            <select
              disabled={readOnly}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:disabled:bg-slate-800"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </label>
          {error && (
            <p className="sm:col-span-2 text-sm font-medium text-red-500">
              {error}
            </p>
          )}
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-4 dark:border-slate-800 dark:bg-slate-950/50">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            {readOnly ? "Close" : "Cancel"}
          </button>
          {!readOnly && (
            <button className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-brand-600">
              {mode === "add" ? "Add Department" : "Save Changes"}
            </button>
          )}
        </div>
      </motion.form>
    </motion.div>
  );
}
function Field({ label, value, onChange, placeholder, disabled }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </span>
      <input
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:disabled:bg-slate-800"
      />
    </label>
  );
}

export default function OrganizationSetup() {
  const [collapsed, setCollapsed] = useState(false),
    [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(
    () => localStorage.getItem("assetflow_theme") === "dark",
  );
  const [departments, setDepartments] = useState(seedDepartments),
    [search, setSearch] = useState(""),
    [status, setStatus] = useState("All"),
    [page, setPage] = useState(1);
  const [modal, setModal] = useState(null),
    [activeTab, setActiveTab] = useState("Departments"),
    [deleteTarget, setDeleteTarget] = useState(null);
  const navigate = useNavigate(),
    pageSize = 6;
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("assetflow_theme", dark ? "dark" : "light");
    return () => document.documentElement.classList.remove("dark");
  }, [dark]);
  const filtered = useMemo(
    () =>
      departments.filter(
        (d) =>
          (status === "All" || d.status === status) &&
          `${d.name} ${d.code} ${d.head} ${d.parent}`
            .toLowerCase()
            .includes(search.toLowerCase()),
      ),
    [departments, search, status],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize)),
    visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const save = (form) => {
    if (modal.mode === "add")
      setDepartments([
        { ...form, id: Date.now(), employees: 0 },
        ...departments,
      ]);
    else
      setDepartments(
        departments.map((d) =>
          d.id === modal.department.id ? { ...d, ...form } : d,
        ),
      );
    setModal(null);
  };
  const logout = () => {
    localStorage.removeItem("assetflow_auth");
    navigate("/login", { replace: true });
  };
  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 transition-colors dark:bg-slate-950 dark:text-slate-300">
      <DashboardSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={logout}
        activePage="Organization Setup"
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
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-brand-500">
                <Building2 size={15} /> Administration
              </div>
              <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-navy-900 dark:text-white sm:text-3xl">
                Organization Setup
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                Configure your organization structure, departments, categories,
                and people from one governed workspace.
              </p>
            </div>
            <button
              onClick={() => setModal({ mode: "add" })}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-brand-600"
            >
              <Plus size={18} /> Add New
            </button>
          </div>
          <section className="mt-7 overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
            <div className="flex gap-1 overflow-x-auto border-b border-slate-100 px-4 pt-3 dark:border-slate-800">
              {[
                ["Departments", Building2],
                ["Categories", Layers3],
                ["Employees", Users],
              ].map(([tab, Icon]) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-semibold transition ${activeTab === tab ? "text-brand-500" : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}
                >
                  <Icon size={17} />
                  {tab}
                  {activeTab === tab && (
                    <motion.span
                      layoutId="org-tab"
                      className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-brand-500"
                    />
                  )}
                </button>
              ))}
            </div>
            {activeTab === "Departments" ? (
              <>
                <div className="flex flex-col gap-3 border-b border-slate-100 p-4 dark:border-slate-800 sm:flex-row">
                  <div className="relative flex-1">
                    <Search
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                      }}
                      placeholder="Search departments, heads, or parent groups..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-11 pr-4 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                  </div>
                  <label className="relative">
                    <Filter
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={16}
                    />
                    <select
                      value={status}
                      onChange={(e) => {
                        setStatus(e.target.value);
                        setPage(1);
                      }}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm font-semibold outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-white sm:w-40"
                    >
                      <option>All</option>
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </label>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-left">
                    <thead>
                      <tr className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-[.12em] text-slate-400 dark:bg-slate-950/50">
                        {[
                          "Department",
                          "Department Head",
                          "Parent Department",
                          "Employee Count",
                          "Status",
                          "Actions",
                        ].map((x) => (
                          <th key={x} className="px-5 py-4">
                            {x}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {visible.map((d, i) => (
                        <motion.tr
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.035 }}
                          key={d.id}
                          className="group transition hover:bg-blue-50/45 dark:hover:bg-blue-950/15"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 text-xs font-extrabold text-brand-500 dark:from-blue-500/10 dark:to-indigo-500/10">
                                {d.code}
                              </span>
                              <div>
                                <p className="text-sm font-bold text-navy-900 dark:text-white">
                                  {d.name}
                                </p>
                                <p className="mt-0.5 text-[10px] text-slate-400">
                                  Code: {d.code}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm font-medium">
                            {d.head}
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400">
                            {d.parent || "—"}
                          </td>
                          <td className="px-5 py-4">
                            <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
                              <Users size={15} className="text-slate-400" />
                              {d.employees}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${d.status === "Active" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10" : "bg-slate-100 text-slate-500 dark:bg-slate-800"}`}
                            >
                              <span
                                className={`size-1.5 rounded-full ${d.status === "Active" ? "bg-emerald-500" : "bg-slate-400"}`}
                              />
                              {d.status}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1 opacity-70 transition group-hover:opacity-100">
                              <Action
                                icon={Eye}
                                label="View"
                                onClick={() =>
                                  setModal({ mode: "view", department: d })
                                }
                              />
                              <Action
                                icon={Pencil}
                                label="Edit"
                                onClick={() =>
                                  setModal({ mode: "edit", department: d })
                                }
                              />
                              <Action
                                icon={Trash2}
                                label="Delete"
                                danger
                                onClick={() => setDeleteTarget(d)}
                              />
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                  {!visible.length && (
                    <div className="grid place-items-center py-16 text-center">
                      <Search className="text-slate-300" size={32} />
                      <p className="mt-3 font-bold text-slate-600 dark:text-slate-300">
                        No departments found
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Try adjusting your search or status filter.
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 text-xs text-slate-400 dark:border-slate-800 sm:flex-row">
                  <p>
                    Showing {filtered.length ? (page - 1) * pageSize + 1 : 0}–
                    {Math.min(page * pageSize, filtered.length)} of{" "}
                    {filtered.length} departments
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="grid size-8 place-items-center rounded-lg border border-slate-200 disabled:opacity-35 dark:border-slate-700"
                    >
                      <ChevronLeft size={15} />
                    </button>
                    {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        onClick={() => setPage(n)}
                        className={`grid size-8 place-items-center rounded-lg text-xs font-bold ${page === n ? "bg-brand-500 text-white" : "border border-slate-200 dark:border-slate-700"}`}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      disabled={page === pages}
                      onClick={() => setPage(page + 1)}
                      className="grid size-8 place-items-center rounded-lg border border-slate-200 disabled:opacity-35 dark:border-slate-700"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="grid min-h-80 place-items-center p-8 text-center">
                <div>
                  <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-blue-50 text-brand-500 dark:bg-blue-500/10">
                    {activeTab === "Categories" ? <Layers3 /> : <Users />}
                  </span>
                  <h2 className="mt-4 text-lg font-bold text-navy-900 dark:text-white">
                    {activeTab}
                  </h2>
                  <p className="mt-2 max-w-sm text-sm text-slate-400">
                    Use the dedicated {activeTab.toLowerCase()} workspace from
                    the administrator navigation for complete organization-wide
                    management.
                  </p>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
      <AnimatePresence>
        {modal && (
          <DepartmentModal
            mode={modal.mode}
            department={modal.department}
            onClose={() => setModal(null)}
            onSave={save}
          />
        )}{" "}
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.96 }}
              animate={{ scale: 1 }}
              className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900"
            >
              <span className="grid size-12 place-items-center rounded-2xl bg-red-50 text-red-500 dark:bg-red-500/10">
                <Trash2 />
              </span>
              <h2 className="mt-5 text-xl font-extrabold text-navy-900 dark:text-white">
                Delete department?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                This will remove <b>{deleteTarget.name}</b> from the
                organization structure. This demo action can’t be undone.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setDepartments(
                      departments.filter((d) => d.id !== deleteTarget.id),
                    );
                    setDeleteTarget(null);
                  }}
                  className="rounded-xl bg-red-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
function Action({ icon: Icon, label, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`grid size-8 place-items-center rounded-lg transition ${danger ? "text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10" : "text-slate-400 hover:bg-blue-50 hover:text-brand-500 dark:hover:bg-blue-500/10"}`}
    >
      <Icon size={15} />
    </button>
  );
}