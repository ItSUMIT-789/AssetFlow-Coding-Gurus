import { Link } from 'react-router-dom'

export default function Button({ to, variant = 'primary', className = '', children, ...props }) {
  const styles = variant === 'secondary'
    ? 'border border-slate-300 bg-white text-slate-800 hover:border-brand-500 hover:text-brand-600'
    : variant === 'light' ? 'bg-white text-brand-600 hover:bg-blue-50' : 'bg-brand-500 text-white shadow-lg shadow-blue-500/20 hover:bg-brand-600'
  const classes = `inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${styles} ${className}`
  return to ? <Link className={classes} to={to} {...props}>{children}</Link> : <button className={classes} {...props}>{children}</button>
}
