import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Mail } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import { InputField, LoadingButton, PasswordField } from '../components/FormFields'
import { validateLogin } from '../utils/validation'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '', remember: false })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const update = (event) => setForm({
    ...form,
    [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value,
  })

  const submit = (event) => {
    event.preventDefault()
    const next = validateLogin(form)
    setErrors(next)

    if (Object.keys(next).length) {
      return
    }

    setLoading(true)
    setTimeout(() => {
      localStorage.setItem('assetflow_auth', 'true')
      localStorage.setItem('assetflow_login_email', form.email)
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true })
    }, 800)
  }

  return <AuthLayout title="Welcome Back" message="Securely access your organization’s asset management workspace and keep every resource under control.">
    <form onSubmit={submit} className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_24px_70px_rgba(15,23,42,.10)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-9">
      <p className="text-sm font-bold uppercase tracking-[.2em] text-sky-600 dark:text-sky-300">Welcome back</p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white">Sign in to AssetFlow</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-300">Enter your work credentials to continue.</p>
      <div className="mt-8 space-y-5">
        <InputField label="Email address" name="email" value={form.email} onChange={update} error={errors.email} icon={Mail} placeholder="name@company.com" autoComplete="email" />
        <PasswordField label="Password" name="password" value={form.password} onChange={update} error={errors.password} placeholder="Enter your password" autoComplete="current-password" />
      </div>
      <div className="my-5 flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <input type="checkbox" name="remember" checked={form.remember} onChange={update} className="accent-brand-500" /> Remember me
        </label>
        <a href="#" className="font-semibold text-sky-600 hover:underline dark:text-sky-300">Forgot Password?</a>
      </div>
      <LoadingButton loading={loading}>Login</LoadingButton>
      <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
        New to AssetFlow? <Link to="/register" className="font-semibold text-sky-600 hover:underline dark:text-sky-300">Create an employee account</Link>
      </p>
    </form>
  </AuthLayout>
}