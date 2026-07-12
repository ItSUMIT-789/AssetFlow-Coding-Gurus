import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAssetFlow } from '../../hooks/useAssetFlow'

function Panel({ children, className = '' }) {
  return <section className={`rounded-3xl border border-white/70 bg-white/75 p-5 shadow-[0_20px_60px_rgba(15,23,42,.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/55 ${className}`}>{children}</section>
}

export default function DepartmentUsageChart({ data, title = 'Department usage', copy = 'Usage hours, allocations, and operational load by department.' }) {
  const analytics = useAssetFlow()
  const chartData = data ?? analytics.departmentUsage

  return (
    <Panel>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.24em] text-sky-600 dark:text-sky-300">Departments</p>
          <h2 className="mt-2 text-xl font-black tracking-tight text-slate-950 dark:text-white">{title}</h2>
        </div>
        {copy ? <p className="max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">{copy}</p> : null}
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 12 }}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.18} />
            <XAxis type="number" tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={120} />
            <Tooltip />
            <Bar dataKey="usageHours" radius={[0, 12, 12, 0]} fill="#14b8a6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  )
}
