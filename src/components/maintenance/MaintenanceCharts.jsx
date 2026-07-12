import { motion } from 'framer-motion'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

function Panel({ children, className = '' }) {
  return <motion.section whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 220, damping: 22 }} className={`rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_18px_45px_rgba(15,23,42,.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/55 ${className}`}>{children}</motion.section>
}

export default function MaintenanceCharts({ charts }) {
  return <section className="grid gap-4 xl:grid-cols-2">
    <Panel>
      <h3 className="text-lg font-black tracking-tight text-slate-950 dark:text-white">Requests by Status</h3>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={charts.byStatus} dataKey="value" nameKey="name" innerRadius={72} outerRadius={110} paddingAngle={4}>
              {charts.byStatus.map((entry, index) => <Cell key={entry.name} fill={['#0ea5e9', '#6366f1', '#06b6d4', '#f59e0b', '#10b981'][index % 5]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Panel>

    <Panel>
      <h3 className="text-lg font-black tracking-tight text-slate-950 dark:text-white">Monthly Trend</h3>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={charts.monthlyTrend}>
            <defs>
              <linearGradient id="maintenanceTrend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.34} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.18} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Area type="monotone" dataKey="requests" stroke="#0ea5e9" fill="url(#maintenanceTrend)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Panel>

    <Panel>
      <h3 className="text-lg font-black tracking-tight text-slate-950 dark:text-white">Priority Distribution</h3>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={charts.priorityDistribution}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.18} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>

    <Panel>
      <h3 className="text-lg font-black tracking-tight text-slate-950 dark:text-white">Technician Workload</h3>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={charts.technicianWorkload} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.18} />
            <XAxis type="number" tickLine={false} axisLine={false} />
            <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={90} />
            <Tooltip />
            <Bar dataKey="value" radius={[0, 10, 10, 0]} fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>

    <Panel className="xl:col-span-2">
      <h3 className="text-lg font-black tracking-tight text-slate-950 dark:text-white">Resolution Time</h3>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={charts.resolutionTime}>
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.18} />
            <XAxis dataKey="bucket" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip />
            <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#14b8a6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  </section>
}