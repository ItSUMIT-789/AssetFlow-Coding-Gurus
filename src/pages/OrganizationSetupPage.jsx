import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleOff,
  Eye,
  Filter,
  LayoutGrid,
  PencilLine,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Tags,
  Trash2,
  Users,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const initialDepartments = [
  { id: 1, name: 'Engineering', head: 'Nora Chen', parent: 'Technology', employees: 42, status: 'Active' },
  { id: 2, name: 'Finance', head: 'Jules Martin', parent: 'Corporate', employees: 18, status: 'Active' },
  { id: 3, name: 'Operations', head: 'Alicia Ford', parent: 'Corporate', employees: 27, status: 'Active' },
  { id: 4, name: 'Customer Success', head: 'Darren Lee', parent: 'Revenue', employees: 16, status: 'Inactive' },
  { id: 5, name: 'Procurement', head: 'Mina Patel', parent: 'Operations', employees: 11, status: 'Active' },
  { id: 6, name: 'HR', head: 'Sofia Cruz', parent: 'Corporate', employees: 9, status: 'Inactive' },
]

const chartData = [
  { name: 'Eng', value: 42 },
  { name: 'Fin', value: 18 },
  { name: 'Ops', value: 27 },
  { name: 'CS', value: 16 },
  { name: 'Proc', value: 11 },
]

const initialCategories = [
  { id: 1, name: 'IT Equipment', type: 'Technology', lifecycle: '5 years', assetCount: 124, status: 'Active' },
  { id: 2, name: 'Office Furniture', type: 'Facilities', lifecycle: '10 years', assetCount: 287, status: 'Active' },
  { id: 3, name: 'Vehicles', type: 'Fleet', lifecycle: '8 years', assetCount: 34, status: 'Active' },
  { id: 4, name: 'Software Licenses', type: 'Digital', lifecycle: '3 years', assetCount: 156, status: 'Inactive' },
]

const initialEmployees = [
  { id: 1, name: 'Nora Chen', email: 'nora.chen@company.com', department: 'Engineering', role: 'Department Head', status: 'Active' },
  { id: 2, name: 'Jules Martin', email: 'jules.martin@company.com', department: 'Finance', role: 'Manager', status: 'Active' },
  { id: 3, name: 'Alicia Ford', email: 'alicia.ford@company.com', department: 'Operations', role: 'Department Head', status: 'Active' },
  { id: 4, name: 'Darren Lee', email: 'darren.lee@company.com', department: 'Customer Success', role: 'Team Lead', status: 'Active' },
  { id: 5, name: 'Mina Patel', email: 'mina.patel@company.com', department: 'Procurement', role: 'Manager', status: 'Active' },
]

const tabs = [
  { name: 'Departments', icon: Building2 },
  { name: 'Categories', icon: Tags },
  { name: 'Employees', icon: Users },
]

const statusStyles = {
  Active: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/20',
  Inactive: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/20',
}

export default function OrganizationSetup() {
  const [activeTab, setActiveTab] = useState('Departments')
  const [departments, setDepartments] = useState(initialDepartments)
  const [categories, setCategories] = useState(initialCategories)
  const [employees, setEmployees] = useState(initialEmployees)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState(null)
  const [viewingDepartment, setViewingDepartment] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    head: '',
    parent: '',
    employees: '',
    status: 'Active',
  })

  const filteredDepartments = useMemo(() => {
    const term = search.toLowerCase().trim()
    return departments.filter((item) => {
      const matchesSearch =
        !term ||
        item.name.toLowerCase().includes(term) ||
        item.head.toLowerCase().includes(term) ||
        item.parent.toLowerCase().includes(term)
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [departments, search, statusFilter])

  const pageSize = 4
  const pageCount = Math.max(1, Math.ceil(filteredDepartments.length / pageSize))
  const safePage = Math.min(currentPage, pageCount)
  const paginatedDepartments = filteredDepartments.slice((safePage - 1) * pageSize, safePage * pageSize)

  const resetForm = () => {
    setFormData({ name: '', head: '', parent: '', employees: '', status: 'Active' })
    setEditingDepartment(null)
  }

  const openAddModal = () => {
    resetForm()
    setShowModal(true)
  }

  const openEditModal = (department) => {
    setEditingDepartment(department)
    setFormData({
      name: department.name,
      head: department.head,
      parent: department.parent,
      employees: department.employees,
      status: department.status,
    })
    setShowModal(true)
  }

  const openViewModal = (department) => {
    setViewingDepartment(department)
    setShowViewModal(true)
  }

  const handleDelete = (departmentId) => {
    setDepartments((items) => items.filter((item) => item.id !== departmentId))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const payload = {
      ...formData,
      employees: Number(formData.employees) || 0,
    }

    if (editingDepartment) {
      setDepartments((items) =>
        items.map((item) => (item.id === editingDepartment.id ? { ...item, ...payload } : item)),
      )
    } else {
      setDepartments((items) => [{ id: Date.now(), ...payload }, ...items])
    }

    setShowModal(false)
    resetForm()
  }

  const handlePageChange = (nextPage) => {
    setCurrentPage(Math.min(Math.max(nextPage, 1), pageCount))
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.16),_transparent_38%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_100%)] px-4 py-6 text-slate-900 transition-colors duration-300 dark:bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_30%),linear-gradient(135deg,_#07111f_0%,_#0f172a_100%)] dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-[28px] border border-white/70 bg-white/70 p-5 shadow-[0_24px_80px_-30px_rgba(15,23,42,0.28)] backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/70 sm:p-7"
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-brand-600 dark:border-brand-500/20 dark:bg-brand-500/10 dark:text-brand-300">
                <Sparkles size={14} /> Organization Setup
              </div>
              <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
                Structure your operating model with clarity.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                Configure departments, governance, and workforce responsibilities from a single premium workspace built for modern ERP teams.
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 transition hover:bg-brand-700"
            >
              <Plus size={18} /> Add New
            </button>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-3xl border border-slate-200/70 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/60">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Operating map</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">{departments.length} active departments</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                  Live
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {[
                  ['24/7 Coverage', '99.2%'],
                  ['Leadership Sync', '12'],
                  ['Budget Owners', '7'],
                ].map(([label, value]) => (
                  <div key={label} className="flex-1 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">{label}</p>
                    <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200/70 bg-gradient-to-br from-brand-600 to-indigo-600 p-6 text-white shadow-xl shadow-brand-900/20 dark:border-brand-500/20">
              <div className="mb-5 flex items-end justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">Workforce Overview</p>
                  <p className="mt-2 text-2xl font-bold">{departments.reduce((sum, item) => sum + item.employees, 0)} employees</p>
                </div>
                <div className="rounded-2xl bg-white/15 p-3">
                  <BriefcaseBusiness size={22} />
                </div>
              </div>
              <div className="h-56 rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 15, left: -20, bottom: 20 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.16)" vertical={false} />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#e2e8f0', fontSize: 11 }} />
                    <YAxis hide />
                    <Tooltip cursor={{ fill: 'rgba(255,255,255,0.08)' }} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#ffffff" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.header>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.35 }}
          className="mt-6 rounded-[28px] border border-white/60 bg-white/75 p-4 shadow-[0_24px_80px_-35px_rgba(15,23,42,0.24)] backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/70 sm:p-6"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="inline-flex rounded-2xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-800 dark:bg-slate-950/70">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.name}
                    onClick={() => setActiveTab(tab.name)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      activeTab === tab.name
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
                    }`}
                  >
                    <Icon size={16} />
                    {tab.name}
                  </button>
                )
              })}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                <Search size={16} className="text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value)
                    setCurrentPage(1)
                  }}
                  placeholder="Search departments"
                  className="w-full bg-transparent outline-none sm:w-44"
                />
              </label>
              <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                <Filter size={16} className="text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value)
                    setCurrentPage(1)
                  }}
                  className="bg-transparent outline-none"
                >
                  <option value="All">All status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </label>
            </div>
          </div>

          {activeTab === 'Departments' && (
            <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200/70 dark:border-slate-800">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 bg-white/90 text-left text-sm dark:divide-slate-800 dark:bg-slate-950/80">
                  <thead className="bg-slate-50/70 text-slate-600 dark:bg-slate-900/70 dark:text-slate-300">
                    <tr>
                      {['Department', 'Department Head', 'Parent Department', 'Employee Count', 'Status', 'Actions'].map((column) => (
                        <th key={column} className="px-4 py-3 font-semibold">{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {paginatedDepartments.map((department) => (
                      <tr key={department.id} className="transition hover:bg-slate-50/90 dark:hover:bg-slate-900/70">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="grid size-10 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                              <LayoutGrid size={16} />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white">{department.name}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Strategic unit</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-slate-700 dark:text-slate-300">{department.head}</td>
                        <td className="px-4 py-4 text-slate-700 dark:text-slate-300">{department.parent}</td>
                        <td className="px-4 py-4 text-slate-700 dark:text-slate-300">{department.employees}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[department.status]}`}>
                            {department.status === 'Active' ? <CheckCircle2 size={13} className="mr-1" /> : <CircleOff size={13} className="mr-1" />}
                            {department.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => openViewModal(department)}
                              className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:border-brand-200 hover:text-brand-600 dark:border-slate-800 dark:text-slate-300"
                              aria-label={`View ${department.name}`}
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={() => openEditModal(department)}
                              className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:border-brand-200 hover:text-brand-600 dark:border-slate-800 dark:text-slate-300"
                              aria-label={`Edit ${department.name}`}
                            >
                              <PencilLine size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(department.id)}
                              className="rounded-xl border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50 dark:border-rose-500/20 dark:hover:bg-rose-500/10"
                              aria-label={`Delete ${department.name}`}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-200 bg-slate-50/70 px-4 py-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Showing <span className="font-semibold text-slate-900 dark:text-white">{paginatedDepartments.length}</span> of{' '}
                  <span className="font-semibold text-slate-900 dark:text-white">{filteredDepartments.length}</span> results
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(safePage - 1)}
                    disabled={safePage === 1}
                    className="rounded-xl border border-slate-200 p-2 transition hover:border-brand-200 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="rounded-xl bg-white px-3 py-2 text-sm font-semibold shadow-sm dark:bg-slate-950">
                    Page {safePage} of {pageCount}
                  </span>
                  <button
                    onClick={() => handlePageChange(safePage + 1)}
                    disabled={safePage === pageCount}
                    className="rounded-xl border border-slate-200 p-2 transition hover:border-brand-200 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Categories' && (
            <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200/70 dark:border-slate-800">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 bg-white/90 text-left text-sm dark:divide-slate-800 dark:bg-slate-950/80">
                  <thead className="bg-slate-50/70 text-slate-600 dark:bg-slate-900/70 dark:text-slate-300">
                    <tr>
                      {['Category Name', 'Type', 'Lifecycle', 'Asset Count', 'Status'].map((column) => (
                        <th key={column} className="px-4 py-3 font-semibold">{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {categories.map((category) => (
                      <tr key={category.id} className="transition hover:bg-slate-50/90 dark:hover:bg-slate-900/70">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="grid size-10 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                              <Tags size={16} />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white">{category.name}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Asset class</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-slate-700 dark:text-slate-300">{category.type}</td>
                        <td className="px-4 py-4 text-slate-700 dark:text-slate-300">{category.lifecycle}</td>
                        <td className="px-4 py-4 text-slate-700 dark:text-slate-300">{category.assetCount}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[category.status]}`}>
                            {category.status === 'Active' ? <CheckCircle2 size={13} className="mr-1" /> : <CircleOff size={13} className="mr-1" />}
                            {category.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Employees' && (
            <div className="mt-6 overflow-hidden rounded-[24px] border border-slate-200/70 dark:border-slate-800">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 bg-white/90 text-left text-sm dark:divide-slate-800 dark:bg-slate-950/80">
                  <thead className="bg-slate-50/70 text-slate-600 dark:bg-slate-900/70 dark:text-slate-300">
                    <tr>
                      {['Employee', 'Email', 'Department', 'Role', 'Status'].map((column) => (
                        <th key={column} className="px-4 py-3 font-semibold">{column}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {employees.map((employee) => (
                      <tr key={employee.id} className="transition hover:bg-slate-50/90 dark:hover:bg-slate-900/70">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="grid size-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                              <Users size={16} />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white">{employee.name}</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Staff member</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-slate-700 dark:text-slate-300">{employee.email}</td>
                        <td className="px-4 py-4 text-slate-700 dark:text-slate-300">{employee.department}</td>
                        <td className="px-4 py-4">
                          <span className="inline-flex rounded-xl bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                            {employee.role}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[employee.status]}`}>
                            {employee.status === 'Active' ? <CheckCircle2 size={13} className="mr-1" /> : <CircleOff size={13} className="mr-1" />}
                            {employee.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.section>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur"
          >
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 18, opacity: 0 }}
              className="w-full max-w-xl rounded-[28px] border border-white/60 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand-500">
                    {editingDepartment ? 'Edit department' : 'Add department'}
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">
                    {editingDepartment ? 'Refine the department profile' : 'Create a new operating unit'}
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false)
                    resetForm()
                  }}
                  className="rounded-xl border border-slate-200 p-2 text-slate-600 dark:border-slate-800 dark:text-slate-300"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Department name
                    <input
                      required
                      value={formData.name}
                      onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none ring-0 focus:border-brand-500 dark:border-slate-800 dark:bg-slate-950"
                      placeholder="e.g. Product Design"
                    />
                  </label>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Department head
                    <input
                      required
                      value={formData.head}
                      onChange={(event) => setFormData({ ...formData, head: event.target.value })}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-brand-500 dark:border-slate-800 dark:bg-slate-950"
                      placeholder="Name of the lead"
                    />
                  </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Parent department
                    <input
                      value={formData.parent}
                      onChange={(event) => setFormData({ ...formData, parent: event.target.value })}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-brand-500 dark:border-slate-800 dark:bg-slate-950"
                      placeholder="Corporate / Operations"
                    />
                  </label>
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Employee count
                    <input
                      type="number"
                      min="0"
                      value={formData.employees}
                      onChange={(event) => setFormData({ ...formData, employees: event.target.value })}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-brand-500 dark:border-slate-800 dark:bg-slate-950"
                    />
                  </label>
                </div>

                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Status
                  <select
                    value={formData.status}
                    onChange={(event) => setFormData({ ...formData, status: event.target.value })}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-brand-500 dark:border-slate-800 dark:bg-slate-950"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </label>

                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      resetForm()
                    }}
                    className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-2xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                  >
                    {editingDepartment ? 'Save changes' : 'Create department'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showViewModal && viewingDepartment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur"
          >
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 18, opacity: 0 }}
              className="w-full max-w-lg rounded-[28px] border border-white/60 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.26em] text-brand-500">Department view</p>
                  <h2 className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{viewingDepartment.name}</h2>
                </div>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="rounded-xl border border-slate-200 p-2 text-slate-600 dark:border-slate-800 dark:text-slate-300"
                >
                  ✕
                </button>
              </div>
              <div className="mt-6 space-y-4 rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Department head</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{viewingDepartment.head}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Parent department</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{viewingDepartment.parent}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Employee count</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{viewingDepartment.employees}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Status</span>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[viewingDepartment.status]}`}>
                    {viewingDepartment.status}
                  </span>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setShowViewModal(false)
                    openEditModal(viewingDepartment)
                  }}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300"
                >
                  <PencilLine size={15} /> Edit
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white"
                >
                  Continue <ArrowUpRight size={15} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}