import { LogOut, LayoutDashboard, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'
import OrganizationSetup from '../components/OrganizationSetup'

export default function Dashboard() {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('assetflow_auth')
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Sidebar Navigation */}
      <AdminSidebar onLogout={logout} />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="min-h-screen bg-slate-950 px-3 py-4 text-slate-100 sm:px-5 lg:px-6">
          <div className="mx-auto w-full max-w-7xl">
            {/* Top Header Bar */}
            <div className="mb-6 flex flex-col gap-3 rounded-[24px] border border-slate-800 bg-gradient-to-r from-slate-900/80 to-slate-950/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-300">admin workspace</p>
                <h1 className="mt-1 text-lg font-semibold text-white">Organization Setup</h1>
              </div>
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800">
                  <LayoutDashboard size={16} /> Dashboard
                </button>
                <button className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800">
                  <Settings size={16} /> Settings
                </button>
              </div>
            </div>

            {/* Organization Setup Component */}
            <OrganizationSetup />
          </div>
        </div>
      </main>
    </div>
  )
}

