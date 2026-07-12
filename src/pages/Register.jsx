import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  BriefcaseBusiness,
  IdCard,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import {
  InputField,
  LoadingButton,
  PasswordField,
  FormError,
} from "../components/FormFields";
import { validateRegister } from "../utils/validation";
import { registerUser } from "../utils/auth";
import { REGISTRATION_ROLES } from "../utils/rbac";
const initial = {
  fullName: "",
  employeeId: "",
  email: "",
  contact: "",
  department: "",
  designation: "",
  role: "EMPLOYEE",
  password: "",
  confirmPassword: "",
  terms: false,
};
export default function Register() {
  const [form, setForm] = useState(initial),
    [errors, setErrors] = useState({}),
    [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const update = (e) => {
    const v = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "contact" ? v.replace(/\D/g, "").slice(0, 10) : v,
    });
  };
  const submit = (e) => {
    e.preventDefault();
    const next = validateRegister(form);
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    setTimeout(() => {
      try {
        registerUser({
          name: form.fullName,
          email: form.email.toLowerCase(),
          password: form.password,
          role: form.role,
          department: form.department,
          designation: form.designation,
          employeeId: form.employeeId,
          phone: form.contact,
        });
        navigate("/login", { replace: true, state: { registered: true } });
      } catch (error) {
        setErrors({ form: error.message });
        setLoading(false);
      }
    }, 500);
  };
  return (
    <AuthLayout
      title="Join AssetFlow"
      message="Create an organization account with access governed by your operational role."
    >
      <form
        onSubmit={submit}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-9"
      >
        <p className="text-sm font-bold text-brand-500">ACCOUNT REGISTRATION</p>
        <h2 className="mt-2 text-3xl font-extrabold text-navy-900">
          Create your account
        </h2>
        <div className="mt-6 flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-3.5 text-xs text-blue-900">
          <BadgeCheck size={19} />
          <span>
            Administrator is predefined and cannot be selected during
            registration.
          </span>
        </div>
        {errors.form && (
          <div className="mt-5 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-600">
            {errors.form}
          </div>
        )}
        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <InputField
            label="Full Name"
            name="fullName"
            value={form.fullName}
            onChange={update}
            error={errors.fullName}
            icon={UserRound}
          />
          <InputField
            label="Employee ID"
            name="employeeId"
            value={form.employeeId}
            onChange={update}
            error={errors.employeeId}
            icon={IdCard}
          />
          <InputField
            label="Email Address"
            name="email"
            value={form.email}
            onChange={update}
            error={errors.email}
            icon={Mail}
          />
          <InputField
            label="Contact Number"
            name="contact"
            value={form.contact}
            onChange={update}
            error={errors.contact}
            icon={Phone}
          />
          <label>
            <span className="mb-2 block text-sm font-semibold">Department</span>
            <select
              name="department"
              value={form.department}
              onChange={update}
              className="field"
            >
              <option value="">Select department</option>
              {[
                "Information Technology",
                "Human Resources",
                "Finance",
                "Operations",
                "Sales",
                "Marketing",
                "Administration",
                "Other",
              ].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
            <FormError>{errors.department}</FormError>
          </label>
          <InputField
            label="Designation"
            name="designation"
            value={form.designation}
            onChange={update}
            error={errors.designation}
            icon={BriefcaseBusiness}
          />
          <label className="sm:col-span-2">
            <span className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck size={16} /> Account Role
            </span>
            <select
              name="role"
              value={form.role}
              onChange={update}
              className="field"
            >
              {REGISTRATION_ROLES.map((x) => (
                <option key={x.value} value={x.value}>
                  {x.label}
                </option>
              ))}
            </select>
            <FormError>{errors.role}</FormError>
          </label>
          <PasswordField
            label="Password"
            name="password"
            value={form.password}
            onChange={update}
            error={errors.password}
          />
          <PasswordField
            label="Confirm Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={update}
            error={errors.confirmPassword}
          />
        </div>
        <label className="mt-5 flex gap-2 text-sm">
          <input
            type="checkbox"
            name="terms"
            checked={form.terms}
            onChange={update}
          />{" "}
          I agree to the Terms and Conditions.
        </label>
        <FormError>{errors.terms}</FormError>
        <div className="mt-6">
          <LoadingButton loading={loading}>Create Account</LoadingButton>
        </div>
        <p className="mt-6 text-center text-sm">
          Already registered?{" "}
          <Link to="/login" className="font-bold text-brand-500">
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
