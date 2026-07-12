import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowDownToLine,
  BadgeCheck,
  ClipboardCheck,
  Download,
  FileText,
  Search,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react'

const auditItems = [
  {
    asset: 'Surface Laptop 7',
    expectedLocation: 'HQ West - Desk 12',
    currentLocation: 'HQ West - Desk 12',
    status: 'Verified',
    verification: 'Confirmed',
  },
  {
    asset: 'UltraWide Display',
    expectedLocation: 'Studio A - Bay 3',
    currentLocation: 'Studio A - Bay 2',
    status: 'Mismatch',
    verification: 'Needs review',
  },
  {
    asset: 'SwitchCore 48',
    expectedLocation: 'Data Center - Rack 4',
    currentLocation: 'Data Center - Rack 4',
    status: 'Verified',
    verification: 'Confirmed',
  },
  {
    asset: 'Label Printer X1',
    expectedLocation: 'Warehouse B',
    currentLocation: 'Warehouse B',
    status: 'Missing',
    verification: 'Pending',
  },
  {
    asset: 'Docking Station Pro',
    expectedLocation: 'Ops Room 204',
    currentLocation: 'Ops Room 211',
    status: 'Damaged',
    verification: 'Escalated',
  },
]

const statusStyles = {
  Verified: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20',
  Missing: 'bg-amber-500/10 text-amber-700 ring-amber-500/20',
  Damaged: 'bg-rose-500/10 text-rose-700 ring-rose-500/20',
  Mismatch: 'bg-sky-500/10 text-sky-700 ring-sky-500/20',
}

export default function AuditManagementPage() {
  const [query, setQuery] = useState('')
  const [darkMode, setDarkMode] = useState(false)

  const filteredItems = useMemo(() => {
    const value = query.trim().toLowerCase()
    if (!value) return auditItems

    return auditItems.filter((item) =>
      [item.asset, item.expectedLocation, item.currentLocation, item.status, item.verification]
        .join(' ')
        .toLowerCase()
        .includes(value),
    )
  }, [query])

  const summary = {
    verified: auditItems.filter((item) => item.status === 'Verified').length,
    missing: auditItems.filter((item) => item.status === 'Missing').length,
    damaged: auditItems.filter((item) => item.status === 'Damaged').length,
    pending: auditItems.filter((item) => item.verification === 'Pending' || item.verification === 'Needs review').length,
  }

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-[radial-gradient(circle_at_top_left,_rgba(53,99,233,0.16),_transparent_36%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_100%)] text-slate-900'}`}>
      <header className={`border-b backdrop-blur-xl ${darkMode ? 'border-white/10 bg-slate-900/80' : 'border-slate-200/70 bg-white/80'}`}>
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-14">
          <div className="max-w-2xl">
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${darkMode ? 'border-sky-400/20 bg-sky-500/10 text-sky-300' : 'border-sky-200 bg-sky-50 text-sky-700'}`}>
              <ClipboardCheck size={15} /> Audit management
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Track compliance with an executive-grade audit workspace.</h1>
            <p className={`mt-4 text-lg leading-8 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Review physical verification status, surface mismatches instantly, and prepare discrepancy reporting without leaving the workflow.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`rounded-full border px-3 py-2 text-sm font-semibold ${darkMode ? 'border-white/10 bg-white/10 text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
              Q3 asset verification
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setDarkMode((value) => !value)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${darkMode ? 'border-white/10 bg-white/10 text-white hover:bg-white/20' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
            >
              {darkMode ? 'Light mode' : 'Dark mode'}
            </motion.button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-[30px] border p-6 shadow-sm backdrop-blur ${darkMode ? 'border-white/10 bg-slate-900/70' : 'border-slate-200/70 bg-white/85'}`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${darkMode ? 'border-sky-400/20 bg-sky-500/10 text-sky-300' : 'border-sky-200 bg-sky-50 text-sky-700'}`}>
                  <Sparkles size={15} /> Active audit cycle
                </div>
                <h2 className="mt-4 text-2xl font-semibold">Quarterly Facility Compliance Audit</h2>
                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                  <span className={`rounded-full px-3 py-1 ${darkMode ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>Department: Operations</span>
                  <span className={`rounded-full px-3 py-1 ${darkMode ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>Auditor: Maya Chen</span>
                </div>
              </div>

              <div className={`rounded-[24px] border p-4 min-w-[220px] ${darkMode ? 'border-white/10 bg-slate-950/60' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>Progress</span>
                  <span className="text-sky-600">72%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                  <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-sky-500 to-brand-600" />
                </div>
                <p className={`mt-2 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>12 of 17 checks completed</p>
              </div>
            </div>
          </motion.div>

          <div className={`rounded-[30px] border p-5 shadow-xl backdrop-blur ${darkMode ? 'border-white/10 bg-slate-900/80' : 'border-slate-200/70 bg-slate-950 text-white'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-sky-300">Audit actions</p>
                <p className={`mt-1 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-300'}`}>Generate and export reports.</p>
              </div>
              <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">Live</div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                <FileText size={15} /> Generate discrepancy report
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20">
                <Download size={15} /> Download PDF
              </button>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            { label: 'Assets verified', value: summary.verified, tone: 'text-emerald-500' },
            { label: 'Missing', value: summary.missing, tone: 'text-amber-500' },
            { label: 'Damaged', value: summary.damaged, tone: 'text-rose-500' },
            { label: 'Pending', value: summary.pending, tone: 'text-sky-500' },
          ].map((card) => (
            <div key={card.label} className={`rounded-[24px] border p-4 shadow-sm backdrop-blur ${darkMode ? 'border-white/10 bg-slate-900/70' : 'border-slate-200/70 bg-white/85'}`}>
              <p className={`text-2xl font-semibold ${card.tone}`}>{card.value}</p>
              <p className={`mt-1 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{card.label}</p>
            </div>
          ))}
        </section>

        <section className={`mt-6 rounded-[30px] border p-4 shadow-sm backdrop-blur ${darkMode ? 'border-white/10 bg-slate-900/70' : 'border-slate-200/70 bg-white/85'}`}>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className={`text-sm font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Checklist review</p>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Track location verification and discrepancy severity.</p>
            </div>

            <label className={`flex items-center gap-2 rounded-2xl border px-3 py-2.5 text-sm md:min-w-[280px] ${darkMode ? 'border-white/10 bg-slate-950/70 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
              <Search size={16} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search audit items"
                className={`w-full border-none bg-transparent outline-none placeholder:text-slate-400 ${darkMode ? 'text-white' : 'text-slate-900'}`}
              />
            </label>
          </div>

          <div className="mt-5 overflow-hidden rounded-[24px] border border-slate-200/70 dark:border-white/10">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className={darkMode ? 'bg-slate-950/80 text-slate-300' : 'bg-slate-50 text-slate-600'}>
                  <tr>
                    <th className="px-4 py-3 font-semibold">Asset</th>
                    <th className="px-4 py-3 font-semibold">Expected location</th>
                    <th className="px-4 py-3 font-semibold">Current location</th>
                    <th className="px-4 py-3 font-semibold">Verification status</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.asset} className={`border-t ${darkMode ? 'border-white/10 bg-slate-900/50' : 'border-slate-200 bg-white/70'}`}>
                      <td className="px-4 py-3">
                        <div className="font-semibold">{item.asset}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{item.expectedLocation}</td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{item.currentLocation}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${darkMode ? 'bg-white/10 text-slate-200 ring-white/10' : 'bg-slate-100 text-slate-700 ring-slate-200'}`}>
                          {item.verification === 'Confirmed' ? <BadgeCheck size={13} className="text-emerald-500" /> : item.verification === 'Escalated' ? <AlertTriangle size={13} className="text-amber-500" /> : <Wrench size={13} className="text-sky-500" />} {item.verification}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyles[item.status]}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
