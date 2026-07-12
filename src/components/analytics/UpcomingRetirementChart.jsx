import { useAssetFlow } from '../../hooks/useAssetFlow'

function Panel({ children, className = '' }) {
  return <section className={`rounded-3xl border border-white/70 bg-white/75 p-5 shadow-[0_20px_60px_rgba(15,23,42,.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/55 ${className}`}>{children}</section>
}

export default function UpcomingRetirementChart({ data, title = 'Upcoming retirement', copy = 'Assets approaching retirement, sorted by time remaining.' }) {
  const analytics = useAssetFlow()
  const chartData = data ?? analytics.upcomingRetirement

  return (
    <Panel>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.24em] text-sky-600 dark:text-sky-300">Lifecycle</p>
          <h2 className="mt-2 text-xl font-black tracking-tight text-slate-950 dark:text-white">{title}</h2>
        </div>
        {copy ? <p className="max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">{copy}</p> : null}
      </div>
      <div className="space-y-3">
        {chartData.map((item) => (
          <div key={item.id} className="rounded-2xl border border-slate-200/70 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-semibold text-slate-950 dark:text-white">{item.name}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.department} · {item.category}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-amber-600 dark:text-amber-300">{item.daysRemaining} days</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.retirementDate}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}