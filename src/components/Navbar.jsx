import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import Button from './Button'

const links = [['Home','top'],['Features','features'],['How It Works','how-it-works'],['Benefits','benefits'],['Contact','contact']]
export default function Navbar() {
  const [open, setOpen] = useState(false)

  return <header className="sticky top-0 z-50 border-b border-white/60 bg-white/75 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70">
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
      <Logo />
      <div className="hidden items-center gap-7 lg:flex">
        {links.map(([label, id]) => <a key={id} href={`#${id}`} className="text-sm font-semibold text-slate-600 transition hover:text-sky-600 dark:text-slate-300 dark:hover:text-white">{label}</a>)}
      </div>
      <div className="hidden gap-2 lg:flex">
        <Button to="/login" variant="secondary" className="py-2.5">Login</Button>
        <Button to="/register" className="py-2.5">Get Started</Button>
      </div>
      <button onClick={() => setOpen(!open)} className="rounded-2xl border border-slate-200/70 bg-white/80 p-2.5 text-slate-700 shadow-sm transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 lg:hidden" aria-label="Toggle navigation">
        {open ? <X /> : <Menu />}
      </button>
    </nav>
    {open && <div className="border-t border-white/60 bg-white/90 px-5 py-4 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/90 lg:hidden">
      <div className="grid gap-1">
        {links.map(([label, id]) => <a onClick={() => setOpen(false)} key={id} href={`#${id}`} className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5">{label}</a>)}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Button to="/login" variant="secondary">Login</Button>
        <Button to="/register">Get Started</Button>
      </div>
    </div>}
  </header>
}
