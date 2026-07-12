import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import {
  InputField,
  LoadingButton,
  PasswordField,
} from "../components/FormFields";
import { validateLogin } from "../utils/validation";
import { loginUser } from "../utils/auth";
export default function Login() {
  const [form, setForm] = useState({
      email: "",
      password: "",
      remember: false,
    }),
    [errors, setErrors] = useState({}),
    [loading, setLoading] = useState(false);
  const navigate = useNavigate(),
    location = useLocation();
  const update = (e) =>
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "checkbox" ? e.target.checked : e.target.value,
    });
  const submit = (e) => {
    e.preventDefault();
    const next = validateLogin(form);
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    setTimeout(() => {
      try {
        loginUser(form.email, form.password);
        navigate(location.state?.from?.pathname || "/dashboard", {
          replace: true,
        });
      } catch (error) {
        setErrors({ form: error.message });
        setLoading(false);
      }
    }, 500);
  };
  return (
    <AuthLayout
      title="Welcome Back"
      message="Securely access your organization’s asset management workspace."
    >
      <form
        onSubmit={submit}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-9"
      >
        <p className="text-sm font-bold text-brand-500">WELCOME BACK</p>
        <h2 className="mt-2 text-3xl font-extrabold text-navy-900">
          Sign in to AssetFlow
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Enter your work credentials to continue.
        </p>
        {location.state?.registered && (
          <div className="mt-5 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
            Account created successfully. Sign in with your new credentials.
          </div>
        )}
        {errors.form && (
          <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-600">
            {errors.form}
          </div>
        )}
        <div className="mt-8 space-y-5">
          <InputField
            label="Email address"
            name="email"
            value={form.email}
            onChange={update}
            error={errors.email}
            icon={Mail}
            autoComplete="email"
          />
          <PasswordField
            label="Password"
            name="password"
            value={form.password}
            onChange={update}
            error={errors.password}
            autoComplete="current-password"
          />
        </div>
        <div className="my-5 flex justify-between text-sm">
          <label>
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={update}
            />{" "}
            Remember me
          </label>
          <a href="#" className="font-semibold text-brand-500">
            Forgot Password?
          </a>
        </div>
        <LoadingButton loading={loading}>Login</LoadingButton>
        <p className="mt-6 text-center text-sm text-slate-500">
          New to AssetFlow?{" "}
          <Link to="/register" className="font-bold text-brand-500">
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
