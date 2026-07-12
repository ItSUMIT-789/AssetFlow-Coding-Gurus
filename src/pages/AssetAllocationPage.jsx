import { ArrowUpRight } from 'lucide-react'
import AssetAllocation from '../components/AssetAllocation'

export default function AssetAllocationPage() {
  return (
    <div className="min-h-screen bg-slate-950 px-3 py-4">
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-3 rounded-[24px] border border-slate-800 bg-gradient-to-r from-slate-900/80 to-slate-950/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-300">admin workspace</p>
            <h1 className="mt-1 text-lg font-semibold text-white">Asset Allocation & Transfer</h1>
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-800">
              Dashboard
            </button>
            <button className="rounded-lg bg-gradient-to-r from-brand-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:shadow-lg">
              Export Report
            </button>
          </div>
        </div>

        {/* Content */}
        <AssetAllocation />
      </div>
    </div>
  )
}
