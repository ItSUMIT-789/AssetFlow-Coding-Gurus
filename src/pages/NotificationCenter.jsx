import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle,
  BellRing,
  BookOpen,
  CheckCheck,
  Clock3,
  FileCheck2,
  Filter,
  Layers3,
  Search,
  ShieldCheck,
  Sparkles,
  Truck,
  Wrench,
} from 'lucide-react'

const seedNotifications = [
  {
    id: 1,
    category: 'Maintenance',
    title: 'HVAC service window approved',
    description: 'The north wing maintenance pass is now active for tomorrow at 08:00.',
    time: '12 min ago',
    priority: 'High',
    unread: true,
    icon: Wrench,
  },
  {
    id: 2,
    category: 'Transfers',
    title: 'Laptop transfer pending sign-off',
    description: 'Engineering requested a handoff for 6 devices to the design team.',
    time: '42 min ago',
    priority: 'Medium',
    unread: true,
    icon: Truck,
  },
  {
    id: 3,
    category: 'Bookings',
    title: 'Conference room suite reserved',
    description: 'The executive review room is booked for the board refresh session.',
    time: '1 hr ago',
    priority: 'Low',
    unread: false,
    icon: BookOpen,
  },
  {
    id: 4,
    category: 'Audits',
    title: 'Quarterly audit checklist updated',
    description: 'New compliance items were added to the warehouse and lab review pack.',
    time: '2 hrs ago',
    priority: 'High',
    unread: false,
    icon: FileCheck2,
  },
  {
    id: 5,
    category: 'Notifications',
    title: 'New deployment milestone reached',
    description: 'Operations completed the asset onboarding wave with zero blockers.',
    time: '3 hrs ago',
    priority: 'Medium',
    unread: true,
    icon: BellRing,
  },
]

const tabs = ['All', 'Maintenance', 'Transfers', 'Bookings', 'Audits', 'Notifications']

export default function NotificationCenter() {
  const [activeTab, setActiveTab] = useState('All')
  const [query, setQuery] = useState('')
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  const [showHighPriorityOnly, setShowHighPriorityOnly] = useState(false)
  const [notifications, setNotifications] = useState(seedNotifications)
  const [darkMode, setDarkMode] = useState(false)

  const filteredNotifications = useMemo(() => {
    const searchValue = query.trim().toLowerCase()

    return notifications.filter((item) => {
      const matchesTab = activeTab === 'All' || item.category === activeTab
      const matchesSearch =
        searchValue === '' ||
        [item.title, item.description, item.category, item.priority].join(' ').toLowerCase().includes(searchValue)
      const matchesReadState = !showUnreadOnly || item.unread
      const matchesPriority = !showHighPriorityOnly || item.priority === 'High'

      return matchesTab && matchesSearch && matchesReadState && matchesPriority
    })
  }, [activeTab, notifications, query, showHighPriorityOnly, showUnreadOnly])

  const unreadCount = notifications.filter((item) => item.unread).length
  const highPriorityCount = notifications.filter((item) => item.priority === 'High').length

  const markAllRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, unread: false })))
  }

  const toggleRead = (id) => {
    setNotifications((current) => current.map((item) => (item.id === id ? { ...item, unread: !item.unread } : item)))
  }

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-[radial-gradient(circle_at_top_left,_rgba(53,99,233,0.16),_transparent_36%),linear-gradient(135deg,_#f8fbff_0%,_#eef4ff_100%)] text-slate-900'}`}>
      <header className={`border-b backdrop-blur-xl ${darkMode ? 'border-white/10 bg-slate-900/80' : 'border-slate-200/70 bg-white/80'}`}>
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-14">
          <div className="max-w-2xl">
            <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${darkMode ? 'border-sky-400/20 bg-sky-500/10 text-sky-300' : 'border-sky-200 bg-sky-50 text-sky-700'}`}>
              <BellRing size={15} /> Enterprise notification center
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Keep every operational update in one premium command view.</h1>
            <p className={`mt-4 text-lg leading-8 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Follow maintenance, transfers, bookings, and audits through a polished, workflow-first timeline designed for modern teams.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className={`rounded-full border px-3 py-2 text-sm font-semibold ${darkMode ? 'border-white/10 bg-white/10 text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
              24 live workflows
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setDarkMode((value) => !value)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${darkMode ? 'border-white/10 bg-white/10 text-white hover:bg-white/20' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
            >
              {darkMode ? 'Light mode' : 'Dark mode'}
            </motion.button>
          </div>
        </div>

        <div className="mx-auto grid max-w-7xl gap-3 px-5 pb-8 sm:px-6 lg:grid-cols-3 lg:px-8">
          {[
            { label: 'Critical actions', value: '3', tone: darkMode ? 'text-amber-300' : 'text-amber-600' },
            { label: 'Unread updates', value: unreadCount.toString(), tone: darkMode ? 'text-sky-300' : 'text-sky-600' },
            { label: 'Automation health', value: '98%', tone: darkMode ? 'text-emerald-300' : 'text-emerald-600' },
          ].map((item) => (
            <div key={item.label} className={`rounded-[24px] border p-4 ${darkMode ? 'border-white/10 bg-slate-900/70' : 'border-slate-200 bg-white/80 shadow-sm'}`}>
              <p className={`text-2xl font-semibold ${item.tone}`}>{item.value}</p>
              <p className={`mt-1 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item.label}</p>
            </div>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
          <div className={`rounded-[30px] border p-4 shadow-sm backdrop-blur ${darkMode ? 'border-white/10 bg-slate-900/70 shadow-slate-950/30' : 'border-slate-200/70 bg-white/85 shadow-slate-200/60'}`}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-900'}`}>Search notifications</p>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Filter by workflow, urgency, or read state.</p>
              </div>
              <label className={`flex items-center gap-2 rounded-2xl border px-3 py-2.5 text-sm shadow-inner md:min-w-[320px] ${darkMode ? 'border-white/10 bg-slate-950/70 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                <Search size={16} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search notifications"
                  className={`w-full border-none bg-transparent outline-none placeholder:text-slate-400 ${darkMode ? 'text-white' : 'text-slate-900'}`}
                />
              </label>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-3.5 py-2 text-sm font-semibold transition ${activeTab === tab ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20' : darkMode ? 'bg-white/10 text-slate-300 hover:bg-white/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className={`rounded-[30px] border p-5 shadow-xl backdrop-blur ${darkMode ? 'border-white/10 bg-slate-900/80 shadow-slate-950/30' : 'border-slate-200/70 bg-slate-950 text-white shadow-slate-950/10'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-sky-300">Operational pulse</p>
                <p className={`mt-1 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-300'}`}>Today’s unseen activity.</p>
              </div>
              <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">+8.2%</div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className={`rounded-2xl border p-3 ${darkMode ? 'border-white/10 bg-white/5' : 'border-white/10 bg-white/10'}`}>
                <p className="text-2xl font-semibold text-sky-300">{unreadCount}</p>
                <p className="mt-1 text-sm text-slate-400">Unread updates</p>
              </div>
              <div className={`rounded-2xl border p-3 ${darkMode ? 'border-white/10 bg-white/5' : 'border-white/10 bg-white/10'}`}>
                <p className="text-2xl font-semibold text-amber-300">{highPriorityCount}</p>
                <p className="mt-1 text-sm text-slate-400">High priority</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className={`rounded-[30px] border p-4 shadow-sm backdrop-blur ${darkMode ? 'border-white/10 bg-slate-900/70' : 'border-slate-200/70 bg-white/85'}`}>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className={`text-sm font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Timeline feed</p>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>A stream of enterprise actions and decisions.</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowUnreadOnly((value) => !value)}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition ${showUnreadOnly ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20' : darkMode ? 'bg-white/10 text-slate-300 hover:bg-white/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  <Filter size={14} /> {showUnreadOnly ? 'Unread only' : 'All reads'}
                </button>
                <button
                  onClick={() => setShowHighPriorityOnly((value) => !value)}
                  className={`rounded-full px-3 py-2 text-sm font-semibold transition ${showHighPriorityOnly ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : darkMode ? 'bg-white/10 text-slate-300 hover:bg-white/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  {showHighPriorityOnly ? 'High priority' : 'Any priority'}
                </button>
                <button
                  onClick={markAllRead}
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition ${darkMode ? 'bg-white/10 text-slate-200 hover:bg-white/20' : 'bg-slate-900 text-white hover:bg-slate-700'}`}
                >
                  <CheckCheck size={15} /> Mark all read
                </button>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredNotifications.map((item) => {
                  const Icon = item.icon
                  return (
                    <motion.article
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      whileHover={{ y: -3, scale: 1.01 }}
                      className={`group relative overflow-hidden rounded-[24px] border p-4 shadow-sm transition ${darkMode ? 'border-white/10 bg-slate-950/70 hover:border-sky-400/20' : 'border-slate-200 bg-slate-50/80 hover:border-sky-200'}`}
                    >
                      <div className={`absolute inset-y-0 left-0 w-1 bg-gradient-to-b ${item.priority === 'High' ? 'from-amber-500 to-orange-500' : item.priority === 'Medium' ? 'from-sky-500 to-violet-500' : 'from-emerald-500 to-cyan-500'}`} />
                      <div className="absolute left-4 top-5 h-[calc(100%-2rem)] w-px bg-slate-200 dark:bg-white/10" />
                      <div className={`absolute left-[13px] top-5 size-2.5 rounded-full ${item.unread ? 'bg-brand-600 shadow-[0_0_0_4px_rgba(53,99,233,0.16)]' : 'bg-slate-400'}`} />

                      <div className="ml-7 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`rounded-2xl p-2.5 shadow-sm ${darkMode ? 'bg-white/10 text-sky-300' : 'bg-white text-sky-600'}`}>
                            <Icon size={18} />
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</h3>
                              {item.unread && <span className="rounded-full bg-brand-600/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600">Unread</span>}
                            </div>
                            <p className={`mt-1 text-sm leading-7 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.description}</p>
                            <div className={`mt-2 flex flex-wrap items-center gap-2 text-sm ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium ${darkMode ? 'bg-white/10 text-slate-300' : 'bg-white text-slate-700'}`}>
                                <Layers3 size={13} /> {item.category}
                              </span>
                              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium ${darkMode ? 'bg-white/10 text-slate-300' : 'bg-white text-slate-700'}`}>
                                <Clock3 size={13} /> {item.time}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.priority === 'High' ? 'bg-amber-500/10 text-amber-500' : item.priority === 'Medium' ? 'bg-sky-500/10 text-sky-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                            {item.priority}
                          </span>
                          <button
                            onClick={() => toggleRead(item.id)}
                            className={`rounded-full px-3 py-2 text-sm font-semibold transition ${darkMode ? 'bg-white/10 text-slate-200 hover:bg-white/20' : 'bg-white text-slate-700 hover:bg-slate-100'}`}
                          >
                            {item.unread ? 'Mark read' : 'Mark unread'}
                          </button>
                        </div>
                      </div>
                    </motion.article>
                  )
                })}
              </AnimatePresence>

              {filteredNotifications.length === 0 && (
                <div className={`rounded-[24px] border border-dashed p-8 text-center ${darkMode ? 'border-white/10 bg-slate-950/60 text-slate-400' : 'border-slate-300 bg-slate-50/80 text-slate-600'}`}>
                  <p className="text-lg font-semibold">No notifications match these filters.</p>
                  <p className="mt-2 text-sm">Try widening the search or switching the workflow tab.</p>
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-4">
            <div className={`rounded-[28px] border p-5 shadow-sm backdrop-blur ${darkMode ? 'border-white/10 bg-slate-900/70' : 'border-slate-200/70 bg-white/85'}`}>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <ShieldCheck size={16} className="text-emerald-500" /> Priority handling
              </div>
              <p className={`mt-3 text-sm leading-7 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                High urgency items surface instantly so teams can respond before small issues become operational delays.
              </p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-emerald-500 to-sky-500" />
              </div>
              <p className={`mt-2 text-xs font-semibold uppercase tracking-[0.2em] ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>78% of tasks are on track</p>
            </div>

            <div className={`rounded-[28px] border p-5 shadow-sm backdrop-blur ${darkMode ? 'border-white/10 bg-slate-900/70' : 'border-slate-200/70 bg-white/85'}`}>
              <div className="flex items-center gap-2 text-sm font-semibold">
                <AlertTriangle size={16} className="text-amber-500" /> Workflow attention
              </div>
              <div className="mt-4 space-y-3 text-sm">
                {[
                  { label: 'Maintenance', value: '2 action items' },
                  { label: 'Transfers', value: '1 pending batch' },
                  { label: 'Audits', value: '3 completed' },
                ].map((item) => (
                  <div key={item.label} className={`flex items-center justify-between rounded-2xl px-3 py-2 ${darkMode ? 'bg-white/5 text-slate-300' : 'bg-slate-50 text-slate-700'}`}>
                    <span>{item.label}</span>
                    <span className="font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}
