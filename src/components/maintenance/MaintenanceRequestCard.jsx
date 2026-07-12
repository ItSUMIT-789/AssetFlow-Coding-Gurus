import { motion } from 'framer-motion'
import { CalendarDays, Clock3, MessageSquareText, MoreHorizontal, Paperclip, UserCircle2 } from 'lucide-react'

const priorityStyles = {
  Critical: 'bg-rose-500/10 text-rose-600 dark:text-rose-200',
  High: 'bg-amber-500/10 text-amber-600 dark:text-amber-200',
  Medium: 'bg-sky-500/10 text-sky-600 dark:text-sky-200',
  Low: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-200',
}

const statusStyles = {
  Pending: 'bg-slate-500/10 text-slate-600 dark:text-slate-200',
  Approved: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-200',
  'Technician Assigned': 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-200',
  'In Progress': 'bg-amber-500/10 text-amber-600 dark:text-amber-200',
  Resolved: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-200',
}

export default function MaintenanceRequestCard({ request, onOpen, onDragStart, onDragEnd }) {
  return <motion.article
    layout
    draggable
    onDragStart={onDragStart}
    onDragEnd={onDragEnd}
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.99 }}
    transition={{ type: 'spring', stiffness: 240, damping: 20 }}
    className="group rounded-3xl border border-white/70 bg-white/85 p-4 shadow-[0_18px_40px_rgba(15,23,42,.08)] outline-none backdrop-blur-xl transition dark:border-white/10 dark:bg-slate-950/55"
    tabIndex={0}
    aria-label={`${request.assetName} maintenance request`}
    onKeyDown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        onOpen(request.id)
      }
    }}
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[.22em] text-slate-400 dark:text-slate-500">{request.category}</p>
        <h3 className="mt-2 line-clamp-1 text-base font-bold tracking-tight text-slate-950 dark:text-white">{request.assetName}</h3>
      </div>
      <button className="rounded-xl p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/5 dark:hover:text-white" aria-label="More actions">
        <MoreHorizontal size={16} />
      </button>
    </div>

    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{request.issue}</p>

    <div className="mt-4 flex flex-wrap gap-2">
      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityStyles[request.priority] ?? priorityStyles.Medium}`}>{request.priority}</span>
      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[request.status] ?? statusStyles.Pending}`}>{request.status}</span>
      {request.tags.slice(0, 2).map((tag) => <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300">{tag}</span>)}
    </div>

    <div className="mt-4 rounded-2xl bg-slate-50 px-3 py-3 dark:bg-white/5">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span>Progress</span>
        <span>{request.progress}%</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-slate-200/80 dark:bg-white/10">
        <div className="h-full rounded-full bg-linear-to-r from-sky-500 to-indigo-600" style={{ width: `${request.progress}%` }} />
      </div>
    </div>

    <div className="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">
      <div className="flex items-center gap-2">
        <UserCircle2 size={16} className="text-sky-500" />
        <span className="truncate">{request.technician}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock3 size={16} className="text-sky-500" />
        <span>{request.estimatedCompletion}</span>
      </div>
      <div className="flex items-center gap-2">
        <CalendarDays size={16} className="text-sky-500" />
        <span>{request.dueDate}</span>
      </div>
      <div className="flex items-center gap-2">
        <Paperclip size={16} className="text-sky-500" />
        <span>{request.tags.length} tags</span>
      </div>
    </div>

    <div className="mt-4 flex items-center gap-2 rounded-2xl border border-slate-200/70 bg-white/80 p-2 dark:border-white/10 dark:bg-white/5">
      <button onClick={() => onOpen(request.id)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100">
        Open Details
      </button>
      <button className="rounded-2xl px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5" aria-label="Add comment">
        <MessageSquareText size={15} />
      </button>
    </div>
  </motion.article>
}