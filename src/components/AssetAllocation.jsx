import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  ArrowDownUp,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  History,
  Laptop,
  MapPin,
  Search,
  Send,
  AlertTriangle,
} from 'lucide-react'
import { useState } from 'react'

const assetData = [
  { id: 'AF-0174', name: 'Dell Laptop', category: 'IT Equipment', owner: 'John Smith', currentHolder: 'Priya Shah', status: 'Allocated', department: 'Engineering', value: '$1,200' },
  { id: 'AF-0175', name: 'MacBook Pro', category: 'IT Equipment', owner: 'Jane Doe', currentHolder: 'Unassigned', status: 'Available', department: 'Finance', value: '$2,500' },
  { id: 'AF-0176', name: 'Monitor LG 27"', category: 'IT Equipment', owner: 'Bob Wilson', currentHolder: 'Arjun Nair', status: 'Allocated', department: 'Operations', value: '$400' },
  { id: 'AF-0177', name: 'Office Chair', category: 'Office Furniture', owner: 'Alice Brown', currentHolder: 'Unassigned', status: 'Available', department: 'Corporate', value: '$350' },
]

const employees = [
  { id: 1, name: 'Nora Chen', department: 'Engineering', email: 'nora.chen@company.com' },
  { id: 2, name: 'Jules Martin', department: 'Finance', email: 'jules.martin@company.com' },
  { id: 3, name: 'Alicia Ford', department: 'Operations', email: 'alicia.ford@company.com' },
  { id: 4, name: 'Darren Lee', department: 'Customer Success', email: 'darren.lee@company.com' },
  { id: 5, name: 'Priya Shah', department: 'Engineering', email: 'priya.shah@company.com' },
  { id: 6, name: 'Arjun Nair', department: 'Operations', email: 'arjun.nair@company.com' },
]

const allocationHistory = [
  { id: 1, asset: 'AF-0174', assetName: 'Dell Laptop', from: 'John Smith', to: 'Priya Shah', date: 'Aug 12', status: 'Completed' },
  { id: 2, asset: 'AF-0175', assetName: 'MacBook Pro', from: 'Unassigned', to: 'Sofia Cruz', date: 'Aug 10', status: 'Completed' },
]

const transferRequests = [
  { id: 1, asset: 'AF-0174', assetName: 'Dell Laptop', from: 'Priya Shah', to: 'Requested by Engineering', reason: 'Team relocation', date: 'Aug 15', status: 'Pending', priority: 'High' },
]

export default function AssetAllocation() {
  const [selectedAsset, setSelectedAsset] = useState(assetData[0])
  const [showAssetDropdown, setShowAssetDropdown] = useState(false)
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [reason, setReason] = useState('')
  const [priority, setPriority] = useState('Normal')
  const [searchAsset, setSearchAsset] = useState('')
  const [searchEmployee, setSearchEmployee] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [activeTab, setActiveTab] = useState('allocation')

  const isAssetAllocated = selectedAsset.status === 'Allocated'

  const filteredAssets = assetData.filter((asset) => 
    asset.name.toLowerCase().includes(searchAsset.toLowerCase()) ||
    asset.id.toLowerCase().includes(searchAsset.toLowerCase())
  )

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchEmployee.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchEmployee.toLowerCase())
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setSelectedEmployee(null)
      setReason('')
      setPriority('Normal')
    }, 2000)
  }

  const stats = [
    { label: 'Total Assets', value: assetData.length, icon: Laptop },
    { label: 'Allocated', value: assetData.filter((a) => a.status === 'Allocated').length, icon: CheckCircle2 },
    { label: 'Available', value: assetData.filter((a) => a.status === 'Available').length, icon: ArrowDownUp },
    { label: 'Pending Transfers', value: transferRequests.length, icon: Clock },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {/* Header Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-md backdrop-blur dark:border-slate-800 dark:bg-slate-900/70"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{stat.label}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                </div>
                <div className="rounded-xl bg-brand-100 p-2 dark:bg-brand-500/15">
                  <Icon size={20} className="text-brand-600 dark:text-brand-400" />
                </div>
              </div>
            </div>
          )
        })}
      </motion.div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Asset and Employee Selection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-5 lg:col-span-2"
        >
          {/* Asset Selector */}
          <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
              <Laptop size={16} className="mb-2 inline-block mr-2" />
              Select Asset
            </label>
            <div className="relative mt-3">
              <button
                onClick={() => setShowAssetDropdown(!showAssetDropdown)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-slate-900 transition hover:border-brand-300 dark:border-slate-700 dark:bg-slate-800/50 dark:text-white dark:hover:border-brand-400"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{selectedAsset.id}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{selectedAsset.name}</p>
                  </div>
                  <ChevronDown size={18} className={`transition ${showAssetDropdown ? 'rotate-180' : ''}`} />
                </div>
              </button>

              <AnimatePresence>
                {showAssetDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 z-10 mt-2 rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800"
                  >
                    <div className="border-b border-slate-200 p-3 dark:border-slate-700">
                      <div className="relative">
                        <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search assets..."
                          value={searchAsset}
                          onChange={(e) => setSearchAsset(e.target.value)}
                          className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {filteredAssets.map((asset) => (
                        <button
                          key={asset.id}
                          onClick={() => {
                            setSelectedAsset(asset)
                            setShowAssetDropdown(false)
                            setSearchAsset('')
                          }}
                          className="w-full border-b border-slate-200 px-4 py-3 text-left transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50"
                        >
                          <p className="font-semibold text-slate-900 dark:text-white">{asset.id}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{asset.name}</p>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Asset Status Warning */}
          <AnimatePresence>
            {isAssetAllocated && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex gap-3 rounded-2xl border-2 border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/15"
              >
                <AlertTriangle size={20} className="mt-0.5 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                <div>
                  <p className="font-semibold text-amber-900 dark:text-amber-200">Asset Already Allocated</p>
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    This asset is currently held by <span className="font-semibold">{selectedAsset.currentHolder}</span>. Use the transfer form below to request a reallocation.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Transfer Form */}
          <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              {isAssetAllocated ? 'Transfer Request' : 'New Allocation'}
            </h3>

            {/* Current Holder */}
            {isAssetAllocated && (
              <div className="mb-4 rounded-xl bg-slate-100 p-3 dark:bg-slate-800/50">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-600 dark:text-slate-400">Current Holder</p>
                <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{selectedAsset.currentHolder}</p>
              </div>
            )}

            {/* Employee Selector */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                {isAssetAllocated ? 'Transfer To' : 'Allocate To'}
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowEmployeeDropdown(!showEmployeeDropdown)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-left text-slate-900 transition hover:border-brand-300 dark:border-slate-600 dark:bg-slate-800/50 dark:text-white dark:hover:border-brand-400"
                >
                  <div className="flex items-center justify-between">
                    <span>{selectedEmployee ? selectedEmployee.name : 'Select employee...'}</span>
                    <ChevronDown size={18} className={`transition ${showEmployeeDropdown ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                <AnimatePresence>
                  {showEmployeeDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 z-10 mt-2 rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800"
                    >
                      <div className="border-b border-slate-200 p-3 dark:border-slate-700">
                        <div className="relative">
                          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search employees..."
                            value={searchEmployee}
                            onChange={(e) => setSearchEmployee(e.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-4 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                          />
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        {filteredEmployees.map((emp) => (
                          <button
                            key={emp.id}
                            type="button"
                            onClick={() => {
                              setSelectedEmployee(emp)
                              setShowEmployeeDropdown(false)
                              setSearchEmployee('')
                            }}
                            className="w-full border-b border-slate-200 px-4 py-3 text-left transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50"
                          >
                            <p className="font-semibold text-slate-900 dark:text-white">{emp.name}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">{emp.department}</p>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Reason */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Reason for Transfer</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Explain the reason for this allocation..."
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder-slate-500 transition focus:border-brand-400 focus:outline-none dark:border-slate-600 dark:bg-slate-800/50 dark:text-white dark:placeholder-slate-400"
                rows="3"
              />
            </div>

            {/* Priority */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Priority</label>
              <div className="flex gap-2">
                {['Low', 'Normal', 'High'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                      priority === p
                        ? 'bg-brand-600 text-white shadow-lg'
                        : 'border border-slate-300 bg-white text-slate-700 hover:border-brand-300 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-brand-400'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={!selectedEmployee || !reason}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 px-4 py-3 font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} />
              {isAssetAllocated ? 'Submit Transfer Request' : 'Allocate Asset'}
            </motion.button>

            {/* Success Message */}
            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-4 flex gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-500/30 dark:bg-emerald-500/15"
                >
                  <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />
                  <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Request submitted successfully!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        {/* Right: Asset Current Status Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-3xl border border-slate-200/70 bg-gradient-to-br from-brand-500/10 to-indigo-500/10 p-6 shadow-xl backdrop-blur dark:border-brand-500/20 dark:from-brand-500/5 dark:to-indigo-500/5"
        >
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-600 dark:text-slate-400 mb-4">Asset Details</h3>

          <div className="space-y-3">
            {/* Asset ID */}
            <div className="rounded-xl bg-white/50 p-3 dark:bg-slate-800/50">
              <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Asset ID</p>
              <p className="mt-1 font-bold text-slate-900 dark:text-white">{selectedAsset.id}</p>
            </div>

            {/* Asset Name */}
            <div className="rounded-xl bg-white/50 p-3 dark:bg-slate-800/50">
              <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Asset Name</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-white">{selectedAsset.name}</p>
            </div>

            {/* Category */}
            <div className="rounded-xl bg-white/50 p-3 dark:bg-slate-800/50">
              <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Category</p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{selectedAsset.category}</p>
            </div>

            {/* Value */}
            <div className="rounded-xl bg-white/50 p-3 dark:bg-slate-800/50">
              <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Asset Value</p>
              <p className="mt-1 font-bold text-slate-900 dark:text-white">{selectedAsset.value}</p>
            </div>

            {/* Current Holder */}
            <div className="rounded-xl bg-white/50 p-3 dark:bg-slate-800/50">
              <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Current Holder</p>
              <p className="mt-1 font-semibold text-slate-900 dark:text-white">{selectedAsset.currentHolder}</p>
            </div>

            {/* Status */}
            <div className="rounded-xl bg-white/50 p-3 dark:bg-slate-800/50">
              <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Status</p>
              <div className="mt-1 flex items-center gap-2">
                {selectedAsset.status === 'Allocated' ? (
                  <>
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{selectedAsset.status}</span>
                  </>
                ) : (
                  <>
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedAsset.status}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Timeline & History */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Allocation History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/70"
        >
          <div className="mb-4 flex items-center gap-2">
            <History size={20} className="text-brand-600 dark:text-brand-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Allocation History</h3>
          </div>

          <div className="space-y-3">
            {allocationHistory.map((entry) => (
              <div key={entry.id} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50">
                <div className="mt-1 flex flex-col items-center">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <div className="h-6 w-0.5 bg-slate-300 dark:bg-slate-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{entry.from} → {entry.to}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{entry.assetName}</p>
                    </div>
                    <span className="rounded-lg bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                      {entry.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{entry.date}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Transfer Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-xl backdrop-blur dark:border-slate-800 dark:bg-slate-900/70"
        >
          <div className="mb-4 flex items-center gap-2">
            <ArrowDownUp size={20} className="text-orange-600 dark:text-orange-400" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Transfer Requests</h3>
          </div>

          <div className="space-y-3">
            {transferRequests.map((req) => (
              <div key={req.id} className="flex gap-3 rounded-xl border border-orange-200 bg-orange-50 p-3 dark:border-orange-500/30 dark:bg-orange-500/10">
                <div className="mt-1 flex flex-col items-center">
                  <div className="h-2 w-2 rounded-full bg-orange-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{req.assetName}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{req.reason}</p>
                    </div>
                    <div className="flex gap-1">
                      <span className="rounded-lg bg-orange-200 px-2 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-500/20 dark:text-orange-300">
                        {req.priority}
                      </span>
                      <span className="rounded-lg bg-yellow-200 px-2 py-1 text-xs font-semibold text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300">
                        {req.status}
                      </span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{req.date}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
