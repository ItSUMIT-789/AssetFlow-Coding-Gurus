import { Link } from 'react-router-dom'

const variantStyles = {
  primary: 'border border-sky-500/20 bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-[0_16px_35px_rgba(59,130,246,.22)] hover:-translate-y-0.5 hover:from-sky-400 hover:to-indigo-500',
  secondary: 'border border-slate-200/80 bg-white/85 text-slate-700 shadow-sm hover:-translate-y-0.5 hover:border-sky-200 hover:text-sky-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-100',
  light: 'border border-white/20 bg-white text-slate-950 shadow-[0_16px_35px_rgba(15,23,42,.12)] hover:-translate-y-0.5 hover:bg-slate-50',
}

export default function Button({ to, variant = 'primary', className = '', children, ...props }) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-sky-400/50 ${variantStyles[variant] ?? variantStyles.primary} ${className}`

  return to ? <Link className={classes} to={to} {...props}>{children}</Link> : <button className={classes} {...props}>{children}</button>
}
