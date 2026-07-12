import { BarChart3, Boxes, Check, LockKeyhole, Radar, ShieldCheck } from 'lucide-react'
import Logo from './Logo'

export default function AuthLayout({ title, message, children }) {
  return <main className="grid min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,.12),transparent_28%),linear-gradient(180deg,#f8fbff_0%,#eef3fb_100%)] lg:grid-cols-[1fr_1.05fr] dark:bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,.10),transparent_28%),linear-gradient(180deg,#07111f_0%,#0b1526_100%)]">
    <section className="relative hidden overflow-hidden bg-[radial-gradient(circle_at_top,rgba(59,130,246,.18),transparent_30%),linear-gradient(180deg,#081425_0%,#050b14_100%)] p-12 text-white lg:flex lg:flex-col">
      <div className="absolute inset-0 opacity-20 hero-grid" />
      <div className="relative flex items-center justify-between">
        <Logo light />
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[.2em] text-slate-300">Enterprise workspace</span>
      </div>
      <div className="relative my-auto max-w-lg">
        <span className="text-sm font-bold uppercase tracking-[.18em] text-sky-300">Secure access</span>
        <h1 className="mt-5 text-5xl font-black tracking-tight">{title}</h1>
        <p className="mt-5 leading-7 text-slate-300">{message}</p>
        <div className="relative mt-10 h-64">
          <div className="absolute left-10 top-0 w-72 rounded-[1.5rem] border border-white/10 bg-white/10 p-5 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
            <div className="flex justify-between">
              <span className="text-sm text-slate-300">Asset availability</span>
              <Radar className="text-sky-300" />
            </div>
            <strong className="mt-3 block text-3xl">92.4%</strong>
            <div className="mt-4 h-2 rounded-full bg-white/10"><div className="h-full w-[92%] rounded-full bg-gradient-to-r from-sky-400 to-emerald-400" /></div>
          </div>
          <div className="absolute bottom-0 right-6 w-64 rounded-[1.5rem] border border-white/10 bg-white/10 p-4 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
            <div className="flex gap-3">
              <span className="grid size-10 place-items-center rounded-2xl bg-emerald-400/15 text-emerald-300"><Check /></span>
              <div>
                <b className="block text-sm">All systems active</b>
                <span className="text-xs text-slate-400">Live synchronization</span>
              </div>
            </div>
          </div>
          <div className="absolute bottom-5 left-0 grid size-20 place-items-center rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow-[0_20px_50px_rgba(59,130,246,.3)]"><Boxes size={34} /></div>
        </div>
        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          {[[LockKeyhole, 'Secure access'], [BarChart3, 'Real-time visibility'], [ShieldCheck, 'Role-based dashboard']].map(([Icon, text]) => <div className="flex items-center gap-2 text-xs font-semibold text-slate-300" key={text}><Icon className="text-sky-300" size={17} />{text}</div>)}
        </div>
      </div>
      <p className="relative text-xs text-slate-500">© 2026 AssetFlow Enterprise Operations</p>
    </section>
    <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-10">
      <div className="w-full max-w-xl rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-[0_24px_70px_rgba(15,23,42,.10)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/65 sm:p-7 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none">
        <div className="mb-6 lg:hidden">
          <Logo />
        </div>
        {children}
      </div>
    </section>
  </main>
}