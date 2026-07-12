import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BadgeCheck, BriefcaseBusiness, Building2, IdCard, Mail, Phone, UserRound } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import { InputField, LoadingButton, PasswordField, FormError } from '../components/FormFields'
import { validateRegister } from '../utils/validation'

const initial = { fullName: '', employeeId: '', email: '', contact: '', department: '', designation: '', password: '', confirmPassword: '', terms: false }

export default function Register() {
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const update = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setForm({
      ...form,
      [event.target.name]: event.target.name === 'contact' ? value.replace(/\D/g, '').slice(0, 10) : value,
    })
  }

  const submit = (event) => {
    event.preventDefault()
    const next = validateRegister(form)
    setErrors(next)

    if (Object.keys(next).length) {
      return
    }

    setLoading(true)
    setTimeout(() => {
      localStorage.setItem('assetflow_user', JSON.stringify({ ...form, password: undefined, confirmPassword: undefined, role: 'EMPLOYEE' }))
      setLoading(false)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 1300)
    }, 800)
  }

  return <AuthLayout title="Join AssetFlow" message="Create your employee account and connect to a smarter, more transparent asset management experience.">
    <form onSubmit={submit} className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-[0_24px_70px_rgba(15,23,42,.10)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:p-9">
      <p className="text-sm font-bold uppercase tracking-[.2em] text-sky-600 dark:text-sky-300">Employee registration</p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 dark:text-white">Create your account</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-300">Enter your organization details below.</p>
      <div className="mt-6 flex gap-3 rounded-2xl border border-sky-200/70 bg-sky-50/80 p-3.5 text-xs leading-5 text-sky-900 dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-100">
        <BadgeCheck className="shrink-0 text-sky-500" size={19} />
        <span>All new accounts are created as <b>Employee accounts</b>. Higher-level roles are assigned by an administrator.</span>
      </div>
      {success && <div className="mt-5 rounded-2xl bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-700 dark:text-emerald-200">Account created successfully. Redirecting to login…</div>}
      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <InputField label="Full Name" name="fullName" value={form.fullName} onChange={update} error={errors.fullName} icon={UserRound} placeholder="Your full name" />
        <InputField label="Employee ID" name="employeeId" value={form.employeeId} onChange={update} error={errors.employeeId} icon={IdCard} placeholder="EMP-1024" />
        <InputField label="Email address" name="email" value={form.email} onChange={update} error={errors.email} icon={Mail} placeholder="name@company.com" autoComplete="email" />
        <InputField label="Contact number" name="contact" value={form.contact} onChange={update} error={errors.contact} icon={Phone} placeholder="10-digit number" />
        <InputField label="Department" name="department" value={form.department} onChange={update} error={errors.department} icon={Building2} placeholder="Operations" />
        <InputField label="Designation" name="designation" value={form.designation} onChange={update} error={errors.designation} icon={BriefcaseBusiness} placeholder="Team member" />
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <PasswordField label="Password" name="password" value={form.password} onChange={update} error={errors.password} placeholder="Create a password" />
        <PasswordField label="Confirm Password" name="confirmPassword" value={form.confirmPassword} onChange={update} error={errors.confirmPassword} placeholder="Repeat password" />
      </div>
      <label className="mt-5 flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
        <input type="checkbox" name="terms" checked={form.terms} onChange={update} className="mt-1 accent-brand-500" />
        <span>I confirm that the information provided is accurate and I understand that access is role-based.</span>
      </label>
      {errors.terms ? <FormError message={errors.terms} /> : null}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <LoadingButton loading={loading}>Create account</LoadingButton>
        <Link to="/login" className="rounded-2xl border border-slate-200/80 bg-white/85 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-sky-200 hover:text-sky-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">Back to login</Link>
      </div>
    </form>
  </AuthLayout>
}