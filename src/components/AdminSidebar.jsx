import { BarChart3, Bell, BookOpen, BriefcaseBusiness, Building2, CheckCircle2, LogOut, Menu, Settings, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const menuItems = [
  { name: 'Dashboard', icon: BarChart3, href: '/dashboard' },
  { name: 'Organization setup', icon: Building2, href: '/dashboard' },
  { name: 'Assets', icon: BriefcaseBusiness, href: '#' },
  { name: 'Allocation & Transfer', icon: BookOpen, href: '/dashboard/allocation' },
  { name: 'Resource Booking', icon: CheckCircle2, href: '#' },
  { name: 'Maintenance', icon: Settings, href: '#' },
  { name: 'Audit', icon: BarChart3, href: '#' },
  { name: 'Reports', icon: BarChart3, href: '#' },
]

const bottomItems = [
  { name: 'Notifications', icon: Bell, href: '#' },
]

export default function AdminSidebar({ onLogout }) {
  const [open, setOpen] = useState(true)
  const location = useLocation()

  const isActive = (href) => {
    if (href === '/dashboard' && location.pathname === '/dashboard') return true
    if (href !== '/dashboard' && href !== '#' && location.pathname === href) return true
    return false
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed left-4 top-4 z-50 rounded-lg border border-slate-700 bg-slate-900 p-2 text-white lg:hidden"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed bottom-0 left-0 top-0 z-40 w-64 transform border-r border-slate-700 bg-slate-950 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col bg-gradient-to-b from-slate-900 to-slate-950">
          {/* Logo */}
          <div className="border-b border-slate-700 px-4 py-6">
            <div className="flex items-center gap-2">
              <div className="grid size-9 place-items-center rounded-xl bg-brand-500">
                <BriefcaseBusiness size={20} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-300">Asset</p>
                <p className="text-sm font-black text-white">Flow</p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              
              if (item.href === '#') {
                return (
                  <button
                    key={item.name}
                    disabled
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition cursor-not-allowed"
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </button>
                )
              }

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Bottom section */}
          <div className="border-t border-slate-700 p-3">
            {bottomItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.name}
                  disabled
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition cursor-not-allowed"
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </button>
              )
            })}

            {/* Logout */}
            <button
              onClick={onLogout}
              className="mt-3 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-rose-900/30 hover:text-rose-300"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 z-30 bg-black/50 lg:hidden" />}
    </>
  )
}
