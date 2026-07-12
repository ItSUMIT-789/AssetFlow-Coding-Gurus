import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, Wrench, ClipboardCheck, TimerReset, UserCheck, ShieldAlert } from 'lucide-react'

const statConfig = [
  { key: 'total', label: 'Total Maintenance Requests', icon: Wrench, tone: 'sky' },
  { key: 'open', label: 'Open Requests', icon: ShieldAlert, tone: 'amber' },
  { key: 'pendingApproval', label: 'Pending Approval', icon: TimerReset, tone: 'violet' },
  { key: 'assigned', label: 'Technician Assigned', icon: UserCheck, tone: 'indigo' },
  { key: 'inProgress', label: 'In Progress', icon: ClipboardCheck, tone: 'emerald' },
  { key: 'resolved', label: 'Resolved', icon: ClipboardCheck, tone: 'cyan' },
]

function toneClass(tone) {
  const map = {
    sky: 'from-sky-500/12 to-indigo-500/10 text-sky-600 dark:text-sky-200',
    amber: 'from-amber-500/12 to-orange-500/10 text-amber-600 dark:text-amber-200',
    violet: 'from-violet-500/12 to-fuchsia-500/10 text-violet-600 dark:text-violet-200',
    indigo: 'from-indigo-500/12 to-blue-500/10 text-indigo-600 dark:text-indigo-200',
    emerald: 'from-emerald-500/12 to-teal-500/10 text-emerald-600 dark:text-emerald-200',
    cyan: 'from-cyan-500/12 to-sky-500/10 text-cyan-600 dark:text-cyan-200',
  }

  return map[tone] ?? map.sky
}

export default function MaintenanceStats({ stats }) {
  return <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    {statConfig.map((stat, index) => {
      const Icon = stat.icon
      const value = stats[stat.key]

      return <motion.article key={stat.key} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 240, damping: 22 }} className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_18px_45px_rgba(15,23,42,.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/55">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.24em] text-slate-400 dark:text-slate-500">{String(index + 1).padStart(2, '0')}</p>
            <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
            <strong className="mt-2 block text-3xl font-black tracking-tight text-slate-950 dark:text-white">{value}</strong>
          </div>
          <div className={`grid size-12 place-items-center rounded-2xl bg-linear-to-br ${toneClass(stat.tone)}`}>
            <Icon size={20} />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
          {index % 2 === 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          Updated today
        </div>
      </motion.article>
    })}
  </section>
}