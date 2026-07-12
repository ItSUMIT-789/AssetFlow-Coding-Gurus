import { Code2, Mail, MapPin, MessageCircle, Phone, Share2 } from 'lucide-react'
import Logo from './Logo'

export default function Footer() {
  return <footer id="contact" className="border-t border-white/10 bg-[radial-gradient(circle_at_top,rgba(59,130,246,.14),transparent_30%),linear-gradient(180deg,#07111f_0%,#050b14_100%)] text-slate-300">
    <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-2 lg:grid-cols-[1.1fr_.85fr_.85fr_.9fr] lg:px-8">
      <div>
        <Logo light />
        <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">A centralized enterprise platform for smarter asset tracking, allocation, booking, maintenance, and audit readiness.</p>
        <div className="mt-5 flex gap-3">
          {[Share2, MessageCircle, Code2].map((Icon, index) => <a key={index} href="#" aria-label="Social link" className="grid size-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition hover:-translate-y-0.5 hover:border-sky-400/30 hover:bg-sky-400/10 hover:text-white"><Icon size={17} /></a>)}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-bold uppercase tracking-[.2em] text-white">Quick Links</h3>
        <div className="mt-4 grid gap-3 text-sm">
          <a className="transition hover:text-white" href="#features">Features</a>
          <a className="transition hover:text-white" href="#how-it-works">How It Works</a>
          <a className="transition hover:text-white" href="#benefits">Benefits</a>
          <a className="transition hover:text-white" href="/login">Login</a>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-bold uppercase tracking-[.2em] text-white">Platform</h3>
        <div className="mt-4 grid gap-3 text-sm">
          <span>Asset Tracking</span>
          <span>Resource Booking</span>
          <span>Maintenance</span>
          <span>Reports & Analytics</span>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-bold uppercase tracking-[.2em] text-white">Contact</h3>
        <div className="mt-4 grid gap-4 text-sm">
          <span className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"><Mail size={17} /> support@assetflow.io</span>
          <span className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"><Phone size={17} /> +91 1800 123 4567</span>
          <span className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"><MapPin size={17} /> Bengaluru, India</span>
        </div>
      </div>
    </div>
    <div className="border-t border-white/10 py-6 text-center text-xs text-slate-500">© 2026 AssetFlow. All rights reserved.</div>
  </footer>
}
