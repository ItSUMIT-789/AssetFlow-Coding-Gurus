import { useAssetFlow } from '../../hooks/useAssetFlow'

function Panel({ children, className = '' }) {
  return <section className={`rounded-3xl border border-white/70 bg-white/75 p-5 shadow-[0_20px_60px_rgba(15,23,42,.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/55 ${className}`}>{children}</section>
}

export default function DepartmentLeaderboard({ data, title = 'Top departments', copy = 'Ranked by usage hours and asset footprint.' }) {
  const analytics = useAssetFlow()
  const chartData = data ?? analytics.topDepartments

  return (
    <Panel>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.24em] text-sky-600 dark:text-sky-300">Departments</p>
          <h2 className="mt-2 text-xl font-black tracking-tight text-slate-950 dark:text-white">{title}</h2>
        </div>
        {copy ? <p className="max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">{copy}</p> : null}
      </div>
      <div className="space-y-3">
        {chartData.map((item, index) => (
          <div key={item.departmentId} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm dark:bg-white/5">
            <div>
              <p className="font-semibold text-slate-950 dark:text-white">{index + 1}. {item.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{item.assets} assets · {item.allocated} allocated</p>
            </div>
            <strong className="text-slate-950 dark:text-white">{item.usageHours}h</strong>
          </div>
        ))}
      </div>
    </Panel>
  )
}
