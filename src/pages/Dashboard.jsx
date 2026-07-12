import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
	Activity,
	AlertTriangle,
	ArrowDownRight,
	ArrowUpRight,
	Bell,
	BookOpen,
	BookMarked,
	CalendarDays,
	ChevronLeft,
	Clock3,
	Construction,
	LayoutDashboard,
	LogOut,
	Menu,
	MoonStar,
	PackageSearch,
	Plus,
	RefreshCw,
	Search,
	Settings2,
	SunMedium,
	TimerReset,
	TriangleAlert,
	Users,
	Wrench,
} from 'lucide-react'
import {
	Area,
	AreaChart,
	CartesianGrid,
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'
import { useNavigate } from 'react-router-dom'

const kpis = [
	{ label: 'Total Assets', value: '1,284', trend: '+12.4%', icon: PackageSearch, delta: 'vs last month', tone: 'blue' },
	{ label: 'Allocated Assets', value: '742', trend: '+8.1%', icon: Users, delta: 'utilization', tone: 'indigo' },
	{ label: 'Available Assets', value: '486', trend: '-3.6%', icon: BookMarked, delta: 'ready to assign', tone: 'emerald' },
	{ label: 'Active Bookings', value: '126', trend: '+18.9%', icon: CalendarDays, delta: 'across teams', tone: 'cyan' },
	{ label: 'Pending Transfers', value: '29', trend: '+4.2%', icon: RefreshCw, delta: 'awaiting approval', tone: 'amber' },
	{ label: 'Upcoming Returns', value: '54', trend: '+6.3%', icon: TimerReset, delta: 'due in 7 days', tone: 'rose' },
]

const activityItems = [
	{ title: '17 laptops allocated to Product Design', meta: 'Booking • 12 min ago', color: 'bg-blue-500' },
	{ title: 'Preventive maintenance completed for 6 printers', meta: 'Maintenance • 34 min ago', color: 'bg-emerald-500' },
	{ title: 'Transfer request approved for Conference Room A', meta: 'Transfer • 1 hr ago', color: 'bg-indigo-500' },
	{ title: '4 assets overdue for return escalated to managers', meta: 'Alert • 2 hrs ago', color: 'bg-rose-500' },
]

const notifications = [
	'Maintenance window scheduled for server rack S-12',
	'2 new booking requests need your approval',
	'Finance exported this week’s audit snapshot',
]

const maintenance = [
	{ asset: 'Dell Latitude 7440', due: 'Today', priority: 'High' },
	{ asset: 'Epson EcoTank L6570', due: 'Tomorrow', priority: 'Medium' },
	{ asset: 'Logitech Rally Bar', due: 'Thu', priority: 'Low' },
]

const returnEvents = [
	{ name: 'Mon', value: 8 },
	{ name: 'Tue', value: 11 },
	{ name: 'Wed', value: 10 },
	{ name: 'Thu', value: 15 },
	{ name: 'Fri', value: 9 },
	{ name: 'Sat', value: 13 },
	{ name: 'Sun', value: 18 },
]

const statusData = [
	{ name: 'Allocated', value: 58, color: '#4f8cff' },
	{ name: 'Available', value: 28, color: '#14b8a6' },
	{ name: 'Maintenance', value: 14, color: '#f59e0b' },
]

const quickActions = [
	{ label: 'Register Asset', icon: Plus },
	{ label: 'Book Resource', icon: BookOpen },
	{ label: 'Raise Maintenance Request', icon: Wrench },
]

const sidebarLinks = [
	{ label: 'Overview', icon: LayoutDashboard, active: true },
	{ label: 'Assets', icon: PackageSearch },
	{ label: 'Bookings', icon: BookOpen },
	{ label: 'Transfers', icon: RefreshCw },
	{ label: 'Maintenance', icon: Construction },
	{ label: 'Audit Trail', icon: Activity },
	{ label: 'Settings', icon: Settings2 },
]

const transitions = { type: 'spring', stiffness: 220, damping: 22 }

function toneStyles(tone, dark) {
	const map = {
		blue: dark ? 'from-cyan-500/25 to-blue-500/10 text-cyan-200' : 'from-blue-500/15 to-indigo-500/10 text-blue-600',
		indigo: dark ? 'from-indigo-500/25 to-fuchsia-500/10 text-indigo-200' : 'from-indigo-500/15 to-violet-500/10 text-indigo-600',
		emerald: dark ? 'from-emerald-500/25 to-teal-500/10 text-emerald-200' : 'from-emerald-500/15 to-teal-500/10 text-emerald-600',
		cyan: dark ? 'from-cyan-500/25 to-sky-500/10 text-cyan-200' : 'from-cyan-500/15 to-sky-500/10 text-cyan-600',
		amber: dark ? 'from-amber-500/25 to-orange-500/10 text-amber-200' : 'from-amber-500/15 to-orange-500/10 text-amber-600',
		rose: dark ? 'from-rose-500/25 to-pink-500/10 text-rose-200' : 'from-rose-500/15 to-pink-500/10 text-rose-600',
	}

	return map[tone] ?? map.blue
}

function Panel({ children, className = '' }) {
	return <section className={`rounded-3xl border border-white/60 bg-white/75 p-5 shadow-[0_20px_60px_rgba(15,23,42,.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/50 ${className}`}>{children}</section>
}

function SectionHeading({ eyebrow, title, copy }) {
	return <div className="mb-5 flex items-end justify-between gap-4">
		<div>
			<p className="text-xs font-bold uppercase tracking-[.24em] text-sky-600 dark:text-sky-300">{eyebrow}</p>
			<h2 className="mt-2 text-xl font-black tracking-tight text-slate-950 dark:text-white">{title}</h2>
		</div>
		{copy ? <p className="max-w-xl text-sm leading-6 text-slate-500 dark:text-slate-400">{copy}</p> : null}
	</div>
}

function KpiCard({ item, dark }) {
	const Icon = item.icon

	return <motion.article whileHover={{ y: -5 }} transition={transitions} className="group rounded-3xl border border-white/70 bg-white/80 p-5 shadow-[0_16px_40px_rgba(15,23,42,.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60">
		<div className="flex items-start justify-between gap-4">
			<div>
				<div className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r px-3 py-1 text-[11px] font-semibold ${toneStyles(item.tone, dark)}`}>
					<Icon size={14} />
					{item.delta}
				</div>
				<p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
				<div className="mt-2 flex items-end gap-3">
					<strong className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">{item.value}</strong>
					<span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
						{item.trend.startsWith('-') ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
						{item.trend}
					</span>
				</div>
			</div>
			<div className={`grid size-12 place-items-center rounded-2xl bg-gradient-to-br ${toneStyles(item.tone, dark)} shadow-inner`}>
				<Icon size={20} />
			</div>
		</div>
		<div className="mt-5 h-2 rounded-full bg-slate-100/90 dark:bg-white/10">
			<div className="h-full w-2/3 rounded-full bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 opacity-90" />
		</div>
	</motion.article>
}

export default function Dashboard() {
	const navigate = useNavigate()
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const [darkMode, setDarkMode] = useState(() => {
		if (typeof window === 'undefined') {
			return false
		}

		const saved = window.localStorage.getItem('assetflow-theme')
		if (saved) {
			return saved === 'dark'
		}

		return window.matchMedia('(prefers-color-scheme: dark)').matches
	})

	useEffect(() => {
		document.documentElement.classList.toggle('dark', darkMode)
		window.localStorage.setItem('assetflow-theme', darkMode ? 'dark' : 'light')
	}, [darkMode])

	const stats = useMemo(() => ({
		returns: returnEvents.reduce((total, item) => total + item.value, 0),
		maintenance: maintenance.length,
	}), [])

	const logout = () => {
		localStorage.removeItem('assetflow_auth')
		navigate('/login', { replace: true })
	}

	return <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,.18),transparent_28%),radial-gradient(circle_at_top_right,_rgba(16,185,129,.16),transparent_24%),linear-gradient(180deg,_#f6f9ff_0%,_#eef3fb_52%,_#e9eef8_100%)] text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,.12),transparent_28%),radial-gradient(circle_at_top_right,_rgba(99,102,241,.12),transparent_24%),linear-gradient(180deg,_#07111f_0%,_#0b1526_55%,_#0f172a_100%)] dark:text-slate-100">
		<div className="mx-auto flex min-h-screen max-w-[1800px]">
			<aside className={`fixed inset-y-0 left-0 z-40 w-[290px] border-r border-white/60 bg-white/75 px-4 py-5 shadow-[20px_0_60px_rgba(15,23,42,.06)] backdrop-blur-2xl transition-transform duration-300 dark:border-white/10 dark:bg-slate-950/70 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
				<div className="flex items-center justify-between px-2">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[.2em] text-sky-500">AssetFlow ERP</p>
						<h1 className="mt-1 text-lg font-black text-slate-950 dark:text-white">Operations Console</h1>
					</div>
					<button onClick={() => setSidebarOpen(false)} className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 dark:hover:bg-white/5 lg:hidden" aria-label="Close sidebar">
						<ChevronLeft size={18} />
					</button>
				</div>

				<div className="mt-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-5 text-white shadow-xl shadow-slate-950/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950">
					<p className="text-xs uppercase tracking-[.22em] text-sky-300">Live status</p>
					<div className="mt-3 flex items-end justify-between">
						<div>
							<p className="text-sm text-slate-300">Availability</p>
							<strong className="text-4xl font-black">92.4%</strong>
						</div>
						<div className="rounded-2xl bg-white/10 p-3 text-sky-300">
							<TriangleAlert size={22} />
						</div>
					</div>
					<div className="mt-4 h-2 rounded-full bg-white/10">
						<div className="h-full w-[92%] rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" />
					</div>
				</div>

				<nav className="mt-6 space-y-2">
					{sidebarLinks.map((item) => {
						const Icon = item.icon

						return <a key={item.label} href="#" className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${item.active ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/10 dark:bg-white dark:text-slate-950' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5'}`}>
							<Icon size={18} />
							{item.label}
						</a>
					})}
				</nav>

				<div className="mt-6 rounded-3xl border border-white/60 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
					<p className="text-xs font-semibold uppercase tracking-[.2em] text-slate-500 dark:text-slate-400">Today</p>
					<div className="mt-3 space-y-3 text-sm">
						<div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 dark:bg-white/5"><span>Due returns</span><strong>{stats.returns}</strong></div>
						<div className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 dark:bg-white/5"><span>Maintenance tasks</span><strong>{stats.maintenance}</strong></div>
					</div>
				</div>

				<button onClick={logout} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-rose-500/10 dark:hover:text-rose-200">
					<LogOut size={17} />
					Logout
				</button>
			</aside>

			<div className="flex min-w-0 flex-1 flex-col lg:pl-[290px]">
				<header className="sticky top-0 z-30 border-b border-white/60 bg-white/65 px-4 py-4 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/55 sm:px-6 lg:px-8">
					<div className="flex flex-wrap items-center gap-3">
						<button onClick={() => setSidebarOpen(true)} className="rounded-2xl border border-white/70 bg-white/80 p-3 text-slate-700 shadow-sm transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 lg:hidden" aria-label="Open sidebar">
							<Menu size={18} />
						</button>

						<div className="relative min-w-[220px] flex-1">
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
							<input aria-label="Search" placeholder="Search assets, users, bookings..." className="w-full rounded-2xl border border-white/70 bg-white/85 py-3 pl-11 pr-4 text-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-sky-300 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-500" />
						</div>

						<div className="flex items-center gap-2">
							<button onClick={() => setDarkMode((value) => !value)} className="grid size-11 place-items-center rounded-2xl border border-white/70 bg-white/80 text-slate-700 transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5 dark:text-slate-200" aria-label="Toggle theme">
								{darkMode ? <SunMedium size={18} /> : <MoonStar size={18} />}
							</button>
							<button className="relative grid size-11 place-items-center rounded-2xl border border-white/70 bg-white/80 text-slate-700 transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5 dark:text-slate-200" aria-label="Notifications">
								<Bell size={18} />
								<span className="absolute right-2 top-2 size-2 rounded-full bg-rose-500" />
							</button>
							<div className="hidden items-center gap-3 rounded-2xl border border-white/70 bg-white/80 px-3 py-2 shadow-sm dark:border-white/10 dark:bg-white/5 sm:flex">
								<div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-sm font-bold text-white">AJ</div>
								<div>
									<p className="text-sm font-semibold text-slate-950 dark:text-white">Aarav Jain</p>
									<p className="text-xs text-slate-500 dark:text-slate-400">Asset Manager</p>
								</div>
							</div>
						</div>
					</div>
				</header>

				<div className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
					<motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6">
						<section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-[0_25px_80px_rgba(15,23,42,.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/55 sm:p-8">
							<div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
								<div>
									<div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-200">
										<span className="size-2 rounded-full bg-emerald-500" />
										Enterprise asset intelligence in motion
									</div>
									<h2 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">Run assets, bookings, transfers, and maintenance from one polished control center.</h2>
									<p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">A premium ERP-style dashboard for fast decisions, stronger accountability, and cleaner operations across every team.</p>

									<div className="mt-6 flex flex-wrap gap-3">
										{quickActions.map((action) => {
											const Icon = action.icon

											return <button key={action.label} className="group inline-flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:text-sky-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:text-white">
												<Icon size={16} className="transition group-hover:scale-110" />
												{action.label}
											</button>
										})}
									</div>

									<div className="mt-6 grid gap-3 sm:grid-cols-3">
										<div className="rounded-2xl bg-slate-950 px-4 py-3 text-white shadow-lg shadow-slate-950/15 dark:bg-white dark:text-slate-950">
											<p className="text-xs uppercase tracking-[.2em] text-slate-300 dark:text-slate-500">Overdue</p>
											<div className="mt-1 flex items-end gap-2"><strong className="text-2xl font-black">3</strong><span className="text-sm text-rose-300 dark:text-rose-600">Assets overdue for return</span></div>
										</div>
										<div className="rounded-2xl border border-slate-200/80 bg-white/85 p-4 dark:border-white/10 dark:bg-white/5">
											<p className="text-xs uppercase tracking-[.2em] text-slate-400 dark:text-slate-500">Allocated</p>
											<strong className="mt-1 block text-2xl font-black text-slate-950 dark:text-white">742</strong>
											<span className="text-sm text-emerald-600 dark:text-emerald-300">+8.1% this month</span>
										</div>
										<div className="rounded-2xl border border-slate-200/80 bg-white/85 p-4 dark:border-white/10 dark:bg-white/5">
											<p className="text-xs uppercase tracking-[.2em] text-slate-400 dark:text-slate-500">Bookings today</p>
											<strong className="mt-1 block text-2xl font-black text-slate-950 dark:text-white">24</strong>
											<span className="text-sm text-sky-600 dark:text-sky-300">8 require approval</span>
										</div>
									</div>
								</div>

								<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
									<Panel className="bg-gradient-to-br from-slate-950 to-slate-800 text-white dark:from-slate-900 dark:to-slate-950">
										<div className="flex items-center justify-between">
											<div>
												<p className="text-xs uppercase tracking-[.2em] text-sky-300">Availability heat</p>
												<strong className="mt-2 block text-3xl font-black">64%</strong>
											</div>
											<div className="rounded-2xl bg-white/10 p-3 text-sky-300"><CalendarDays size={20} /></div>
										</div>
										<div className="mt-4 h-2 rounded-full bg-white/10"><div className="h-full w-[64%] rounded-full bg-gradient-to-r from-sky-400 to-emerald-400" /></div>
										<p className="mt-3 text-sm text-slate-300">Healthy inventory balance across field teams and office operations.</p>
									</Panel>

									<Panel>
										<div className="flex items-center justify-between">
											<div>
												<p className="text-xs uppercase tracking-[.2em] text-slate-400 dark:text-slate-500">Live alerts</p>
												<strong className="mt-2 block text-lg font-black text-slate-950 dark:text-white">Operational watchlist</strong>
											</div>
											<AlertTriangle className="text-amber-500" size={22} />
										</div>
										<div className="mt-4 space-y-3">
											{['3 assets overdue for return', '2 bookings waiting for approval', '1 maintenance job escalated'].map((alert) => <div key={alert} className="flex items-center gap-3 rounded-2xl bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-700 dark:text-amber-200"><span className="size-2 rounded-full bg-amber-500" />{alert}</div>)}
										</div>
									</Panel>
								</div>
							</div>
						</section>

						<section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
							{kpis.map((item) => <KpiCard key={item.label} item={item} dark={darkMode} />)}
						</section>

						<section className="grid gap-6 xl:grid-cols-[1.45fr_.85fr]">
							<div className="space-y-6">
								<Panel>
									<SectionHeading eyebrow="Activity center" title="Recent activity timeline" copy="The latest allocations, maintenance updates, bookings, and transfers at a glance." />
									<div className="space-y-4">
										{activityItems.map((item) => <motion.div key={item.title} whileHover={{ x: 4 }} className="flex gap-4 rounded-2xl border border-slate-200/70 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
											<div className={`mt-1 size-3 rounded-full ${item.color}`} />
											<div className="min-w-0 flex-1">
												<p className="font-semibold text-slate-950 dark:text-white">{item.title}</p>
												<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.meta}</p>
											</div>
											<Clock3 className="shrink-0 text-slate-400" size={16} />
										</motion.div>)}
									</div>
								</Panel>

								<div className="grid gap-6 xl:grid-cols-2">
									<Panel>
										<SectionHeading eyebrow="Bookings" title="Demand trend" />
										<div className="h-72">
											<ResponsiveContainer width="100%" height="100%">
												<AreaChart data={returnEvents}>
													<defs>
														<linearGradient id="assetflowDemand" x1="0" y1="0" x2="0" y2="1">
															<stop offset="5%" stopColor="#4f8cff" stopOpacity={0.36} />
															<stop offset="95%" stopColor="#4f8cff" stopOpacity={0.02} />
														</linearGradient>
													</defs>
													<CartesianGrid strokeDasharray="3 3" strokeOpacity={0.18} />
													<XAxis dataKey="name" tickLine={false} axisLine={false} />
													<YAxis tickLine={false} axisLine={false} />
													<Tooltip />
													<Area type="monotone" dataKey="value" stroke="#4f8cff" fill="url(#assetflowDemand)" strokeWidth={3} />
												</AreaChart>
											</ResponsiveContainer>
										</div>
									</Panel>

									<Panel>
										<SectionHeading eyebrow="Asset mix" title="Status distribution" />
										<div className="h-72">
											<ResponsiveContainer width="100%" height="100%">
												<PieChart>
													<Pie data={statusData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4}>
														{statusData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
													</Pie>
													<Tooltip />
												</PieChart>
											</ResponsiveContainer>
										</div>
										<div className="mt-2 space-y-2">
											{statusData.map((entry) => <div key={entry.name} className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-sm dark:bg-white/5">
												<div className="flex items-center gap-2"><span className="size-2 rounded-full" style={{ backgroundColor: entry.color }} />{entry.name}</div>
												<strong>{entry.value}%</strong>
											</div>)}
										</div>
									</Panel>
								</div>
							</div>

							<div className="space-y-6">
								<Panel>
									<SectionHeading eyebrow="Operations" title="Upcoming maintenance" />
									<div className="space-y-3">
										{maintenance.map((item) => <div key={item.asset} className="rounded-2xl border border-slate-200/70 bg-white/75 p-4 dark:border-white/10 dark:bg-white/5">
											<div className="flex items-start justify-between gap-3">
												<div>
													<p className="font-semibold text-slate-950 dark:text-white">{item.asset}</p>
													<p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Due {item.due}</p>
												</div>
												<span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.priority === 'High' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-200' : item.priority === 'Medium' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-200' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-200'}`}>{item.priority}</span>
											</div>
										</div>)}
									</div>
								</Panel>

								<Panel>
									<SectionHeading eyebrow="Notifications" title="Recent updates" />
									<div className="space-y-3">
										{notifications.map((note) => <div key={note} className="flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:bg-white/5 dark:text-slate-300">
											<Bell className="mt-0.5 text-sky-500" size={16} />
											<span>{note}</span>
										</div>)}
									</div>
								</Panel>

								<Panel>
									<SectionHeading eyebrow="Calendar" title="Return schedule" />
									<div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
										{returnEvents.map((item) => <div key={item.name} className="rounded-2xl border border-slate-200/70 bg-white/75 p-2 dark:border-white/10 dark:bg-white/5">
											<p>{item.name}</p>
											<div className="mt-2 rounded-xl bg-slate-100 px-1 py-3 text-sm font-black text-slate-950 dark:bg-white/10 dark:text-white">{item.value}</div>
										</div>)}
									</div>
								</Panel>
							</div>
						</section>
					</motion.div>
				</div>
			</div>

			<AnimatePresence>
				{sidebarOpen ? <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden" aria-label="Close sidebar overlay" /> : null}
			</AnimatePresence>
		</div>
	</main>
}
