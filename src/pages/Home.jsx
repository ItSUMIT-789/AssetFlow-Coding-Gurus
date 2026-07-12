import { ArrowRight, BarChart3, CalendarDays, Check, CircleAlert, Laptop, Wrench } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Button from '../components/Button'
import { FeatureCard, RoleCard, StatisticCard } from '../components/Cards'
import { benefits, features, roles, steps } from '../data/homeData'

const SectionTitle = ({ eyebrow, title, copy }) => <div className="mx-auto mb-12 max-w-2xl text-center">
  <span className="inline-flex items-center rounded-full border border-sky-200/80 bg-sky-50/80 px-3 py-1 text-xs font-bold uppercase tracking-[.22em] text-sky-700 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-200">{eyebrow}</span>
  <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">{title}</h2>
  {copy && <p className="mt-4 text-slate-500 dark:text-slate-300">{copy}</p>}
</div>

function DashboardPreview() {
  return <div className="relative rounded-[2rem] border border-white/70 bg-white/80 p-4 shadow-[0_24px_70px_rgba(15,23,42,.12)] backdrop-blur-xl md:p-6 dark:border-white/10 dark:bg-slate-950/55">
    <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-white/10">
      <div>
        <p className="text-xs uppercase tracking-[.2em] text-slate-400">Organization overview</p>
        <h3 className="font-bold text-slate-950 dark:text-white">Asset Dashboard</h3>
      </div>
      <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-200">Live</span>
    </div>
    <div className="mt-4 grid grid-cols-2 gap-3">
      {[[Laptop, 'Total Assets', '1,284', 'bg-sky-500/10 text-sky-600'], [Check, 'Available', '486', 'bg-emerald-500/10 text-emerald-600'], [BarChart3, 'Allocated', '742', 'bg-indigo-500/10 text-indigo-600'], [Wrench, 'Maintenance', '56', 'bg-amber-500/10 text-amber-600']].map(([Icon, label, value, tone]) => <div className="float-card rounded-2xl border border-slate-100 bg-white p-3 shadow-sm dark:border-white/10 dark:bg-white/5" key={label}>
        <span className={`inline-grid size-8 place-items-center rounded-xl ${tone}`}><Icon size={16} /></span>
        <p className="mt-3 text-xl font-black text-slate-950 dark:text-white">{value}</p>
        <p className="text-[11px] text-slate-400">{label}</p>
      </div>)}
    </div>
    <div className="mt-3 rounded-2xl border border-slate-100 bg-white p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex justify-between"><span className="text-xs font-semibold text-slate-500 dark:text-slate-300">Resource bookings</span><span className="text-xs font-bold text-sky-600 dark:text-sky-300">78%</span></div>
      <div className="mt-3 h-2 rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full w-[78%] rounded-full bg-gradient-to-r from-sky-500 to-indigo-600" /></div>
      <div className="mt-4 flex h-16 items-end gap-2">{[38, 60, 46, 80, 55, 90, 70, 84].map((height, index) => <div key={index} className="flex-1 rounded-t bg-sky-100 dark:bg-sky-500/10" style={{ height: `${height}%` }}><div className="h-1/2 rounded-t bg-gradient-to-t from-sky-500 to-indigo-600" /></div>)}</div>
    </div>
    <div className="absolute -right-4 top-24 hidden items-center gap-2 rounded-2xl border border-white/70 bg-white/90 px-3 py-3 text-xs font-semibold text-slate-700 shadow-xl backdrop-blur xl:flex dark:border-white/10 dark:bg-slate-950/85 dark:text-slate-200"><CalendarDays className="text-sky-500" size={17} /> 24 bookings today</div>
  </div>
}

export default function Home() {
  return <>
    <Navbar />
    <main id="top" className="bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,.10),transparent_30%),linear-gradient(180deg,#f8fbff_0%,#eef4fb_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,.10),transparent_30%),linear-gradient(180deg,#07111f_0%,#0b1526_100%)]">
      <section className="hero-grid overflow-hidden bg-gradient-to-br from-white via-sky-50/70 to-indigo-100/70 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-28">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-white/80 px-3 py-1.5 text-xs font-bold text-sky-700 shadow-sm backdrop-blur dark:border-sky-500/20 dark:bg-white/5 dark:text-sky-200"><span className="size-2 rounded-full bg-sky-500" /> Enterprise asset intelligence</div>
            <h1 className="mt-7 text-4xl font-black leading-[1.05] tracking-[-.04em] text-slate-950 sm:text-6xl dark:text-white">Manage Every Asset.<br /><span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">Optimize Every Resource.</span></h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">AssetFlow is a centralized enterprise platform that helps organizations track assets, allocate resources, manage bookings, handle maintenance, and improve operational visibility.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Button to="/register">Get Started <ArrowRight size={17} /></Button><Button variant="secondary" onClick={() => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' })}>View Features</Button></div>
            <div className="mt-7 flex flex-wrap gap-5 text-xs font-medium text-slate-500 dark:text-slate-400">{['No credit card required', 'Secure by design', 'Fast setup'].map((item) => <span className="flex items-center gap-1.5" key={item}><Check size={15} className="text-emerald-500" />{item}</span>)}</div>
          </div>
          <DashboardPreview />
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-8 grid max-w-6xl gap-4 px-5 sm:grid-cols-2 lg:grid-cols-4">
        {[['1,250+', 'Assets Managed'], ['350+', 'Employees'], ['98%', 'Allocation Accuracy'], ['40%', 'Reduced Manual Work']].map(([value, label]) => <StatisticCard key={label} value={value} label={label} />)}
      </section>

      <section id="features" className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <SectionTitle eyebrow="Core Capabilities" title="Everything you need to manage assets at scale" copy="One connected workspace for the entire asset and resource lifecycle." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{features.map(([Icon, title, description]) => <FeatureCard key={title} icon={Icon} title={title} description={description} />)}</div>
      </section>

      <section id="how-it-works" className="bg-slate-950 py-24 text-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionTitle eyebrow="Simple workflow" title="From registration to insight" copy="A structured process that gives every stakeholder clarity." />
          <div className="relative grid gap-8 md:grid-cols-4 md:gap-5">
            <div className="absolute left-[12%] right-[12%] top-7 hidden h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent md:block" />
            {steps.map(([Icon, title, description], index) => <article key={title} className="relative text-center md:text-left">
              <span className="relative mx-auto grid size-14 place-items-center rounded-2xl border border-sky-400/20 bg-sky-500/15 text-sky-300 md:mx-0"><Icon size={22} /></span>
              <p className="mt-5 text-xs font-bold text-sky-300">0{index + 1}</p>
              <h3 className="mt-2 font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24 dark:bg-slate-900/70">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionTitle eyebrow="Built for every team" title="The right workspace for every role" />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{roles.map(([Icon, title, description]) => <RoleCard key={title} icon={Icon} title={title} description={description} />)}</div>
          <div className="mx-auto mt-8 flex max-w-3xl gap-3 rounded-3xl border border-amber-200/70 bg-amber-50/80 p-4 text-sm text-amber-900 backdrop-blur dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-100"><CircleAlert className="shrink-0" size={20} /><p><b>Roles are admin-managed.</b> All new accounts begin as Employee accounts. Department Head, Asset Manager, and Administrator roles are assigned after registration.</p></div>
        </div>
      </section>

      <section id="benefits" className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-24 lg:grid-cols-2 lg:px-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-[.22em] text-sky-600 dark:text-sky-300">Business impact</span>
          <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl dark:text-white">Smarter operations. Better accountability.</h2>
          <p className="mt-5 leading-7 text-slate-500 dark:text-slate-300">Replace fragmented spreadsheets and manual follow-ups with one reliable source of truth.</p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">{benefits.map((item) => <div className="flex gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200" key={item}><span className="grid size-6 shrink-0 place-items-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"><Check size={14} /></span>{item}</div>)}</div>
        </div>
        <div className="rounded-[2rem] bg-gradient-to-br from-sky-500/10 via-indigo-500/10 to-cyan-500/10 p-8 shadow-[0_24px_70px_rgba(15,23,42,.08)] backdrop-blur-xl dark:from-sky-500/15 dark:via-indigo-500/15 dark:to-cyan-500/15">
          <div className="rounded-[1.5rem] border border-white/70 bg-white/90 p-6 shadow-xl dark:border-white/10 dark:bg-slate-950/70">
            <div className="flex items-center justify-between"><h3 className="font-bold text-slate-950 dark:text-white">Operational efficiency</h3><span className="text-sm font-bold text-emerald-600 dark:text-emerald-300">+40%</span></div>
            <div className="mt-8 space-y-6">{[['Asset visibility', 94], ['Resource utilization', 82], ['Audit readiness', 88]].map(([label, value]) => <div key={label}><div className="mb-2 flex justify-between text-xs text-slate-500 dark:text-slate-300"><span>{label}</span><b>{value}%</b></div><div className="h-2 rounded-full bg-slate-100 dark:bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-600" style={{ width: `${value}%` }} /></div></div>)}</div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-24">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 rounded-[2rem] bg-gradient-to-r from-sky-600 to-indigo-600 px-7 py-12 text-center text-white shadow-[0_24px_70px_rgba(59,130,246,.22)] md:flex-row md:px-12 md:text-left">
          <div><p className="text-sm font-semibold text-sky-100">Start managing smarter</p><h2 className="mt-2 text-3xl font-black">Take Control of Your Organization’s Assets Today</h2></div>
          <div className="flex shrink-0 gap-3"><Button to="/register" variant="light">Create Account</Button><Button to="/login" variant="secondary" className="border-white/20 bg-white/10 text-white hover:bg-white/15">Login</Button></div>
        </div>
      </section>
    </main>
    <Footer />
  </>
}