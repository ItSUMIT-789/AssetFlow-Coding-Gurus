import { useAssetFlow } from '../../hooks/useAssetFlow'

function Panel({ children, className = '' }) {
  return <section className={`rounded-3xl border border-white/70 bg-white/75 p-5 shadow-[0_20px_60px_rgba(15,23,42,.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/55 ${className}`}>{children}</section>
}

export default function AnalyticsHeatmap({ data, title = 'Department KPI matrix', copy = 'A compact operational view for allocation and utilization signals.' }) {
  const analytics = useAssetFlow()
  const chartData = data ?? analytics.departmentKpis

  return (
    <Panel>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.24em] text-sky-600 dark:text-sky-300">Heatmap</p>
          <h2 className="mt-2 text-xl font-black tracking-tight text-slate-950 dark:text-white">{title}</h2>
        </div>
        {copy ? <p className="max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">{copy}</p> : null}
      </div>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {chartData.map((item) => {
          const heat = Math.min(100, Math.max(0, item.utilization ?? 0))
          const opacity = 0.12 + heat / 180

          return (
            <div key={item.departmentId} className="rounded-2xl border border-slate-200/70 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-950 dark:text-white">{item.name}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.assets} assets</p>
                </div>
                <strong className="text-lg font-black text-slate-950 dark:text-white">{item.utilization}%</strong>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                <div
                  className="h-full rounded-full bg-linear-to-r from-sky-500 via-indigo-500 to-emerald-500"
                  style={{ width: `${heat}%`, opacity }}
                />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-slate-500 dark:text-slate-400">
                <div className="rounded-xl bg-slate-50 px-2 py-2 text-center dark:bg-white/5">
                  <p>Allocated</p>
                  <strong className="block text-slate-950 dark:text-white">{item.allocated}</strong>
                </div>
                <div className="rounded-xl bg-slate-50 px-2 py-2 text-center dark:bg-white/5">
                  <p>Available</p>
                  <strong className="block text-slate-950 dark:text-white">{item.available}</strong>
                </div>
                <div className="rounded-xl bg-slate-50 px-2 py-2 text-center dark:bg-white/5">
                  <p>Maintenance</p>
                  <strong className="block text-slate-950 dark:text-white">{item.maintenance}</strong>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}