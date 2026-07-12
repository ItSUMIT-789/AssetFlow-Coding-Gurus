import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { useAssetFlow } from '../../hooks/useAssetFlow'

const colors = ['#4f8cff', '#14b8a6', '#f59e0b', '#f43f5e']

function Panel({ children, className = '' }) {
  return <section className={`rounded-3xl border border-white/70 bg-white/75 p-5 shadow-[0_20px_60px_rgba(15,23,42,.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/55 ${className}`}>{children}</section>
}

export default function AssetAgeChart({ data, title = 'Asset age distribution', copy = 'Age bands are derived from purchase dates in the centralized asset dataset.' }) {
  const analytics = useAssetFlow()
  const chartData = data ?? analytics.assetAgeDistribution

  return (
    <Panel>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.24em] text-sky-600 dark:text-sky-300">Lifecycle</p>
          <h2 className="mt-2 text-xl font-black tracking-tight text-slate-950 dark:text-white">{title}</h2>
        </div>
        {copy ? <p className="max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">{copy}</p> : null}
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={72} outerRadius={108} paddingAngle={4}>
              {chartData.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  )
}
