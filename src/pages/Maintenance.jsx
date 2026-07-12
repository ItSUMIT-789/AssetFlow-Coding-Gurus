import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { BellRing, Filter, Plus, Search, Sparkles, Wrench } from 'lucide-react'
import Button from '../components/Button'
import MaintenanceCharts from '../components/maintenance/MaintenanceCharts'
import MaintenanceDetailDrawer from '../components/maintenance/MaintenanceDetailDrawer'
import MaintenanceKanban from '../components/maintenance/MaintenanceKanban'
import MaintenanceStats from '../components/maintenance/MaintenanceStats'
import { useMaintenance } from '../hooks/useMaintenance'

function PageShell({ children }) {
  return <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,.12),transparent_30%),linear-gradient(180deg,#f8fbff_0%,#eef3fb_100%)] px-4 py-4 text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,.10),transparent_30%),linear-gradient(180deg,#07111f_0%,#0b1526_100%)] dark:text-slate-100 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-[1800px]">{children}</div>
  </main>
}

export default function Maintenance() {
  const maintenance = useMaintenance()

  const columns = useMemo(() => maintenance.stepOrder.map((status) => ({
    status,
    requests: maintenance.groupedRequests[status],
    totalHours: maintenance.groupedRequests[status].reduce((sum, request) => sum + request.estimatedHours, 0),
  })), [maintenance.groupedRequests, maintenance.stepOrder])

  return <PageShell>
    <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-6">
      <header className="rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-[0_24px_80px_rgba(15,23,42,.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200/80 bg-sky-50/80 px-3 py-1 text-xs font-bold uppercase tracking-[.22em] text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-200">
              <Sparkles size={14} /> Maintenance Management
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">Keep every asset in service with one premium work-order command center.</h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">Track requests, approvals, technicians, and completion status in a Jira-style workflow that stays fully aligned with the existing ERP design language.</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" className="bg-white/85 dark:bg-white/5">
              <Search size={16} /> Search
            </Button>
            <Button variant="secondary" className="bg-white/85 dark:bg-white/5">
              <BellRing size={16} /> Alerts
            </Button>
            <Button>
              <Plus size={16} /> New Request
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ['Average Resolution Time', maintenance.stats.avgResolutionTime],
            ['Average Completion Time', maintenance.stats.avgCompletionTime],
            ['High Priority Requests', maintenance.stats.highPriority],
            ['SLA Compliance', maintenance.stats.slaCompliance],
          ].map(([label, value]) => <div key={label} className="rounded-2xl border border-slate-200/70 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
            <p className="text-xs font-semibold uppercase tracking-[.22em] text-slate-400">{label}</p>
            <p className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">{value}</p>
          </div>)}
        </div>
      </header>

      <MaintenanceStats stats={maintenance.stats} />
      <MaintenanceCharts charts={maintenance.charts} />

      <MaintenanceKanban
        columns={columns}
        onCardOpen={maintenance.openRequest}
        onDragStart={maintenance.setDraggingId}
        onDropStatus={(nextStatus) => {
          if (maintenance.draggingId) {
            maintenance.moveRequest(maintenance.draggingId, nextStatus)
            maintenance.setDraggingId(null)
          }
        }}
        draggingId={maintenance.draggingId}
      />

      <MaintenanceDetailDrawer
        request={maintenance.selectedRequest}
        open={maintenance.isDrawerOpen}
        onClose={() => maintenance.setIsDrawerOpen(false)}
        comments={maintenance.comments}
        commentDraft={maintenance.commentDraft}
        setCommentDraft={maintenance.setCommentDraft}
        addComment={maintenance.addComment}
        uploads={maintenance.uploads}
      />
    </motion.section>
  </PageShell>
}