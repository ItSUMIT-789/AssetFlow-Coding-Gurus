import { motion } from 'framer-motion'
import { ChevronRight, FolderOpen } from 'lucide-react'
import MaintenanceRequestCard from './MaintenanceRequestCard'

export default function MaintenanceKanban({ columns, onCardOpen, onDragStart, onDropStatus, draggingId }) {
  return <section className="overflow-hidden rounded-4xl border border-white/70 bg-white/70 p-4 shadow-[0_24px_70px_rgba(15,23,42,.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/55 sm:p-5">
    <div className="flex items-center justify-between gap-4 px-1 pb-4">
      <div>
        <p className="text-xs font-bold uppercase tracking-[.24em] text-sky-600 dark:text-sky-300">Jira-style board</p>
        <h2 className="mt-2 text-xl font-black tracking-tight text-slate-950 dark:text-white">Maintenance requests</h2>
      </div>
      <div className="hidden items-center gap-2 text-sm text-slate-500 dark:text-slate-400 sm:flex">
        <FolderOpen size={16} /> Drag cards between columns
      </div>
    </div>

    <div className="flex gap-4 overflow-x-auto pb-2">
      {columns.map((column) => (
        <motion.div
          key={column.status}
          onDragOver={(event) => event.preventDefault()}
          onDrop={() => onDropStatus(column.status)}
          whileHover={{ y: -2 }}
          className="min-w-[20rem] flex-1 rounded-3xl border border-slate-200/70 bg-slate-50/80 p-3 dark:border-white/10 dark:bg-white/5"
          aria-label={`${column.status} column`}
        >
          <div className="flex items-center justify-between rounded-2xl bg-white/80 px-3 py-3 dark:bg-slate-950/50">
            <div>
              <p className="text-sm font-bold text-slate-950 dark:text-white">{column.status}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{column.requests.length} cards</p>
            </div>
            <div className="rounded-full bg-sky-500/10 px-2.5 py-1 text-xs font-semibold text-sky-600 dark:text-sky-200">
              {column.totalHours.toFixed(1)}h
            </div>
          </div>

          <div className="mt-3 space-y-3">
            {column.requests.length === 0 ? <div className="flex min-h-40 items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white/70 p-4 text-center text-sm text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-slate-500">Drop a maintenance request here</div> : column.requests.map((request) => <MaintenanceRequestCard
              key={request.id}
              request={request}
              onOpen={onCardOpen}
              onDragStart={() => onDragStart(request.id)}
              onDragEnd={() => onDragStart(null)}
            />)}
          </div>

          <button className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white/60 px-4 py-3 text-sm font-semibold text-slate-500 transition hover:border-sky-200 hover:text-sky-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:text-sky-200" aria-label={`Add request to ${column.status}`}>
            <ChevronRight size={16} /> Quick add
          </button>
        </motion.div>
      ))}
    </div>
  </section>
}