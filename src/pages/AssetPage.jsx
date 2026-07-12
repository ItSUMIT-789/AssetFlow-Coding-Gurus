import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Cpu,
  HardDrive,
  MapPin,
  Package2,
  QrCode,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wrench,
} from 'lucide-react'

const assets = [
  {
    id: 1,
    name: 'Surface Laptop 7',
    tag: 'AST-104',
    category: 'Laptop',
    department: 'Engineering',
    owner: 'Mina Chen',
    status: 'Ready',
    location: 'HQ West',
    health: '98%',
    icon: Cpu,
  },
  {
    id: 2,
    name: 'UltraWide Display',
    tag: 'AST-211',
    category: 'Monitor',
    department: 'Design',
    owner: 'Noah Ortiz',
    status: 'In review',
    location: 'Studio A',
    health: '84%',
    icon: HardDrive,
  },
  {
    id: 3,
    name: 'SwitchCore 48',
    tag: 'AST-332',
    category: 'Network',
    department: 'IT',
    owner: 'Riley Patel',
    status: 'Maintenance',
    location: 'Data Center',
    health: '72%',
    icon: Boxes,
  },
]

const quickStats = [
  { label: 'Active assets', value: '248', accent: 'text-sky-500' },
  { label: 'Checked out', value: '94', accent: 'text-emerald-500' },
  { label: 'Needs attention', value: '12', accent: 'text-amber-500' },
]

export default function AssetPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const filteredAssets = useMemo(() => {
    const searchValue = query.trim().toLowerCase()

    return assets.filter((asset) => {
      const searchableText = [asset.name, asset.tag, asset.department, asset.owner, asset.location, asset.status]
        .join(' ')
        .toLowerCase()

      const matchesQuery = searchValue === '' || searchableText.includes(searchValue)
      const matchesCategory = category === 'All' || asset.category === category
      return matchesQuery && matchesCategory
    })
  }, [category, query])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(53,99,233,0.14),_transparent_36%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_100%)] text-slate-900">
      <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-700">
              <Sparkles size={15} /> New asset workspace
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              A calmer view for managing high-value equipment.
            </h1>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              Keep onboarding, maintenance, and allocation visibility in one polished experience without overwhelming the team.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[28px] border border-slate-200 bg-slate-950 p-5 text-white shadow-2xl shadow-slate-950/15"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-sky-300">
              <ShieldCheck size={16} /> Secure operations
            </div>
            <div className="mt-3 text-3xl font-semibold">99.2% availability</div>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
              Teams can inspect asset health, assign ownership, and flag maintenance in just a few clicks.
            </p>
          </motion.div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[30px] border border-slate-200/70 bg-white/85 p-4 shadow-sm shadow-slate-200/60 backdrop-blur">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Search assets</p>
                <p className="text-sm text-slate-500">Find equipment by name, tag, or department.</p>
              </div>
              <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 md:min-w-[280px]">
                <Search size={16} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search assets"
                  className="w-full border-none bg-transparent outline-none placeholder:text-slate-400"
                />
              </label>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {['All', 'Laptop', 'Monitor', 'Network'].map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`rounded-full px-3.5 py-2 text-sm font-semibold transition ${category === item ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[30px] border border-slate-200/70 bg-slate-950 p-5 text-white shadow-xl shadow-slate-950/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-300">Live snapshot</p>
                <p className="mt-1 text-sm text-slate-400">A fast pulse on the fleet.</p>
              </div>
              <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                +6.4%
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {quickStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <p className={`text-2xl font-semibold ${stat.accent}`}>{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-4">
            {filteredAssets.length === 0 ? (
              <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/80 p-8 text-center text-slate-600 shadow-sm">
                <p className="text-lg font-semibold text-slate-900">No matching assets found</p>
                <p className="mt-2 text-sm">Try a different keyword or switch the category filter.</p>
              </div>
            ) : (
              filteredAssets.map((asset) => {
                const Icon = asset.icon
                return (
                  <motion.article
                    key={asset.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-[28px] border border-slate-200/70 bg-white/85 p-5 shadow-sm shadow-slate-200/60 backdrop-blur"
                  >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl bg-slate-100 p-3 text-sky-600">
                        <Icon size={20} />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-xl font-semibold text-slate-900">{asset.name}</h2>
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                            {asset.status}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-slate-500">{asset.tag} • {asset.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-semibold text-slate-600">
                      <QrCode size={15} /> {asset.health} health
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <UserRound size={15} /> Owner
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{asset.owner}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <MapPin size={15} /> Location
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{asset.location}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Package2 size={15} /> Department
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{asset.department}</p>
                    </div>
                  </div>
                  </motion.article>
                )
              })
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-[28px] border border-slate-200/70 bg-white/85 p-5 shadow-sm shadow-slate-200/60 backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <Wrench size={16} className="text-amber-500" /> Maintenance spotlight
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                SwitchCore 48 is approaching its next service window. Schedule work before the next deployment cycle.
              </p>
              <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700">
                Review checklist <ArrowRight size={15} />
              </button>
            </div>

            <div className="rounded-[28px] border border-slate-200/70 bg-slate-950 p-5 text-white shadow-xl shadow-slate-950/10">
              <div className="flex items-center gap-2 text-sm font-semibold text-sky-300">
                <BadgeCheck size={16} /> Team readiness
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2">
                  <span>Asset audits</span>
                  <span className="font-semibold text-white">12 due</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2">
                  <span>New requests</span>
                  <span className="font-semibold text-white">4 pending</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2">
                  <span>Onboarding flow</span>
                  <span className="font-semibold text-white">92%</span>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}
