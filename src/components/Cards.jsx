export function FeatureCard({ icon: Icon, title, description }) {
	return <article className="group rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_45px_rgba(15,23,42,.08)] backdrop-blur-xl transition duration-200 hover:-translate-y-1 hover:border-sky-200/80 dark:border-white/10 dark:bg-white/5">
		<span className="grid size-11 place-items-center rounded-2xl bg-sky-500/10 text-sky-600 transition group-hover:bg-sky-500 group-hover:text-white dark:bg-sky-400/10 dark:text-sky-200">
			<Icon size={21} />
		</span>
		<h3 className="mt-5 text-lg font-bold tracking-tight text-slate-950 dark:text-white">{title}</h3>
		<p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-300">{description}</p>
	</article>
}

export function StatisticCard({ value, label }) {
	return <article className="rounded-3xl border border-white/70 bg-white/80 p-6 text-center shadow-[0_18px_45px_rgba(15,23,42,.08)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/55">
		<strong className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-3xl font-black text-transparent">{value}</strong>
		<p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-300">{label}</p>
	</article>
}

export function RoleCard({ icon: Icon, title, description }) {
	return <article className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_45px_rgba(15,23,42,.08)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
		<span className="grid size-11 place-items-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-200">
			<Icon size={21} />
		</span>
		<h3 className="mt-4 text-lg font-bold tracking-tight text-slate-950 dark:text-white">{title}</h3>
		<p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-300">{description}</p>
	</article>
}
