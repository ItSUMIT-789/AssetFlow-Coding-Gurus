import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  BookOpenCheck,
  Building2,
  Check,
  ChevronRight,
  CloudDownload,
  DatabaseBackup,
  HardDrive,
  KeyRound,
  LockKeyhole,
  MonitorCog,
  Palette,
  RefreshCw,
  Save,
  ServerCog,
  Settings,
  ShieldCheck,
  Smartphone,
  Upload,
  UserRound,
  Users,
  Wrench,
} from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import AdminTopbar from "../components/AdminTopbar";

const sections = [
  [UserRound, "Profile"],
  [Building2, "Organization"],
  [Users, "User & Role Management"],
  [MonitorCog, "Asset Configuration"],
  [BookOpenCheck, "Booking Settings"],
  [Wrench, "Maintenance Settings"],
  [Bell, "Notification Preferences"],
  [ShieldCheck, "Security"],
  [Palette, "Appearance"],
  [DatabaseBackup, "Backup & Restore"],
  [ServerCog, "System Information"],
];

function Toggle({ checked, onChange, label, copy }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-100 p-4 transition hover:border-blue-200 dark:border-slate-800">
      <div>
        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
          {label}
        </p>
        {copy && (
          <p className="mt-1 text-xs leading-5 text-slate-400">{copy}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-brand-500" : "bg-slate-300 dark:bg-slate-700"}`}
      >
        <motion.span
          animate={{ x: checked ? 22 : 2 }}
          className="absolute left-0 top-1 size-4 rounded-full bg-white shadow"
        />
      </button>
    </label>
  );
}
function Card({ title, copy, icon: Icon, children }) {
  return (
    <section className="card overflow-hidden">
      <header className="flex items-start gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-brand-500 dark:bg-blue-500/10">
          <Icon size={18} />
        </span>
        <div>
          <h2 className="font-extrabold text-navy-900 dark:text-white">
            {title}
          </h2>
          {copy && <p className="mt-1 text-xs text-slate-400">{copy}</p>}
        </div>
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}
function Field({ label, value, onChange, type = "text", placeholder }) {
  return (
    <label>
      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="field"
      />
    </label>
  );
}
function Select({ label, value, onChange = () => {}, children }) {
  return (
    <label>
      <span className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="field"
      >
        {children}
      </select>
    </label>
  );
}
function SaveButton({ onClick, label = "Save Changes" }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:bg-brand-600"
    >
      <Save size={16} />
      {label}
    </button>
  );
}

function Profile({ save }) {
  const [form, setForm] = useState({
    name: "Abhay Sonone",
    email: "abhay.sonone@assetflow.io",
    phone: "+91 98765 43210",
    designation: "System Administrator",
    current: "",
    next: "",
    confirm: "",
  });
  const set = (k, v) => setForm({ ...form, [k]: v });
  return (
    <div className="grid gap-6">
      <Card
        title="Administrator Profile"
        copy="Manage your identity and contact information."
        icon={UserRound}
      >
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="relative mx-auto shrink-0 sm:mx-0">
            <div className="grid size-24 place-items-center rounded-3xl bg-gradient-to-br from-brand-500 to-indigo-600 text-2xl font-extrabold text-white shadow-xl shadow-blue-500/20">
              AS
            </div>
            <button className="absolute -bottom-2 -right-2 grid size-9 place-items-center rounded-xl border-4 border-white bg-navy-950 text-white dark:border-slate-900">
              <Upload size={14} />
            </button>
          </div>
          <div className="grid flex-1 gap-5 sm:grid-cols-2">
            <Field
              label="Full Name"
              value={form.name}
              onChange={(v) => set("name", v)}
            />
            <Field
              label="Email Address"
              type="email"
              value={form.email}
              onChange={(v) => set("email", v)}
            />
            <Field
              label="Phone Number"
              value={form.phone}
              onChange={(v) => set("phone", v)}
            />
            <Field
              label="Designation"
              value={form.designation}
              onChange={(v) => set("designation", v)}
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <SaveButton onClick={save} />
        </div>
      </Card>
      <Card
        title="Change Password"
        copy="Use a strong password you don't use elsewhere."
        icon={KeyRound}
      >
        <div className="grid gap-5 md:grid-cols-3">
          <Field
            label="Current Password"
            type="password"
            value={form.current}
            onChange={(v) => set("current", v)}
          />
          <Field
            label="New Password"
            type="password"
            value={form.next}
            onChange={(v) => set("next", v)}
          />
          <Field
            label="Confirm Password"
            type="password"
            value={form.confirm}
            onChange={(v) => set("confirm", v)}
          />
        </div>
        <div className="mt-5 flex justify-end">
          <SaveButton label="Update Password" onClick={save} />
        </div>
      </Card>
    </div>
  );
}

function Organization({ save }) {
  const [form, setForm] = useState({
    name: "AssetFlow Technologies Pvt. Ltd.",
    domain: "assetflow.io",
    email: "admin@assetflow.io",
    phone: "+91 1800 123 4567",
    address: "Bengaluru, Karnataka, India",
    timezone: "Asia/Kolkata",
    currency: "INR (₹)",
    financial: "April – March",
  });
  const set = (k, v) => setForm({ ...form, [k]: v });
  return (
    <Card
      title="Organization Details"
      copy="Company identity, localization, and financial defaults."
      icon={Building2}
    >
      <div className="mb-6 flex items-center gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
        <div className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-indigo-600 text-xl font-black text-white">
          AF
        </div>
        <div>
          <b className="text-sm">Organization Logo</b>
          <p className="mt-1 text-xs text-slate-400">
            PNG or SVG · Recommended 512×512
          </p>
          <button className="mt-2 text-xs font-bold text-brand-500">
            Replace logo
          </button>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Company Name"
          value={form.name}
          onChange={(v) => set("name", v)}
        />
        <Field
          label="Primary Domain"
          value={form.domain}
          onChange={(v) => set("domain", v)}
        />
        <Field
          label="Business Email"
          value={form.email}
          onChange={(v) => set("email", v)}
        />
        <Field
          label="Phone"
          value={form.phone}
          onChange={(v) => set("phone", v)}
        />
        <Field
          label="Registered Address"
          value={form.address}
          onChange={(v) => set("address", v)}
        />
        <Select
          label="Timezone"
          value={form.timezone}
          onChange={(v) => set("timezone", v)}
        >
          <option>Asia/Kolkata</option>
          <option>UTC</option>
          <option>America/New_York</option>
        </Select>
        <Select
          label="Currency"
          value={form.currency}
          onChange={(v) => set("currency", v)}
        >
          <option>INR (₹)</option>
          <option>USD ($)</option>
          <option>EUR (€)</option>
        </Select>
        <Select
          label="Financial Year"
          value={form.financial}
          onChange={(v) => set("financial", v)}
        >
          <option>April – March</option>
          <option>January – December</option>
        </Select>
      </div>
      <div className="mt-6 flex justify-end">
        <SaveButton onClick={save} />
      </div>
    </Card>
  );
}

function Roles({ save }) {
  const roles = [
    ["Administrator", 3, "Full system access", "Protected"],
    ["Asset Manager", 8, "Asset lifecycle and allocation", "Active"],
    ["Department Head", 12, "Department-level oversight", "Active"],
    ["Employee", 327, "Self-service access", "Default"],
  ];
  return (
    <Card
      title="User & Role Management"
      copy="Govern access with role-based permissions."
      icon={Users}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-left">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-slate-400">
              {["Role", "Users", "Permission Scope", "Status", "Action"].map(
                (x) => (
                  <th
                    key={x}
                    className="border-b px-3 py-3 dark:border-slate-800"
                  >
                    {x}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {roles.map(([role, count, scope, status]) => (
              <tr
                key={role}
                className="hover:bg-blue-50/40 dark:hover:bg-blue-950/15"
              >
                <td className="px-3 py-4 text-sm font-bold">{role}</td>
                <td className="px-3 py-4 text-sm">{count}</td>
                <td className="px-3 py-4 text-xs text-slate-400">{scope}</td>
                <td className="px-3 py-4">
                  <span
                    className={`rounded-full px-2 py-1 text-[9px] font-bold ${status === "Protected" ? "bg-violet-50 text-violet-600" : "bg-emerald-50 text-emerald-600"}`}
                  >
                    {status}
                  </span>
                </td>
                <td className="px-3 py-4">
                  <button className="text-xs font-bold text-brand-500">
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-5 flex justify-between">
        <button className="rounded-xl border px-4 py-2.5 text-sm font-bold dark:border-slate-700">
          + Create Role
        </button>
        <SaveButton onClick={save} />
      </div>
    </Card>
  );
}

function AssetConfig({ save }) {
  const [state, setState] = useState({
    autoTag: true,
    qr: true,
    depreciation: true,
    approval: false,
    format: "AF-{CAT}-{####}",
    method: "Straight Line",
  });
  return (
    <div className="grid gap-6">
      <Card
        title="Asset Identification"
        copy="Configure tagging and traceability defaults."
        icon={MonitorCog}
      >
        <div className="grid gap-3">
          <Toggle
            checked={state.autoTag}
            onChange={(v) => setState({ ...state, autoTag: v })}
            label="Automatic Asset Tag Generation"
            copy="Generate a unique tag when an asset is registered."
          />
          <Toggle
            checked={state.qr}
            onChange={(v) => setState({ ...state, qr: v })}
            label="Generate QR Codes"
            copy="Create scannable labels for physical verification."
          />
          <Field
            label="Asset Tag Format"
            value={state.format}
            onChange={(v) => setState({ ...state, format: v })}
          />
        </div>
      </Card>
      <Card
        title="Lifecycle Rules"
        copy="Standardize asset governance and financial treatment."
        icon={RefreshCw}
      >
        <div className="grid gap-3">
          <Toggle
            checked={state.depreciation}
            onChange={(v) => setState({ ...state, depreciation: v })}
            label="Track Depreciation"
          />
          <Toggle
            checked={state.approval}
            onChange={(v) => setState({ ...state, approval: v })}
            label="Require Registration Approval"
          />
          <Select
            label="Default Depreciation Method"
            value={state.method}
            onChange={(v) => setState({ ...state, method: v })}
          >
            <option>Straight Line</option>
            <option>Declining Balance</option>
          </Select>
        </div>
        <div className="mt-5 flex justify-end">
          <SaveButton onClick={save} />
        </div>
      </Card>
    </div>
  );
}

function Booking({ save }) {
  const [s, setS] = useState({
    approval: true,
    conflict: true,
    reminder: true,
    advance: "90",
    duration: "4",
    buffer: "15",
  });
  return (
    <Card
      title="Booking Policies"
      copy="Control reservations, conflicts, and shared-resource usage."
      icon={BookOpenCheck}
    >
      <div className="grid gap-3">
        <Toggle
          checked={s.approval}
          onChange={(v) => setS({ ...s, approval: v })}
          label="Approval for Premium Resources"
          copy="Route vehicles and conference halls through administrator approval."
        />
        <Toggle
          checked={s.conflict}
          onChange={(v) => setS({ ...s, conflict: v })}
          label="Strict Conflict Prevention"
          copy="Block overlapping time windows across all bookings."
        />
        <Toggle
          checked={s.reminder}
          onChange={(v) => setS({ ...s, reminder: v })}
          label="Automated Booking Reminders"
        />
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <Field
          label="Advance Window (days)"
          value={s.advance}
          onChange={(v) => setS({ ...s, advance: v })}
        />
        <Field
          label="Maximum Duration (hours)"
          value={s.duration}
          onChange={(v) => setS({ ...s, duration: v })}
        />
        <Field
          label="Buffer Between Bookings"
          value={s.buffer}
          onChange={(v) => setS({ ...s, buffer: v })}
        />
      </div>
      <div className="mt-5 flex justify-end">
        <SaveButton onClick={save} />
      </div>
    </Card>
  );
}

function Maintenance({ save }) {
  const [s, setS] = useState({
    sla: true,
    auto: true,
    vendor: false,
    critical: "4",
    high: "12",
    normal: "48",
  });
  return (
    <Card
      title="Maintenance Workflow"
      copy="Define SLA targets, automation, and escalation behavior."
      icon={Wrench}
    >
      <div className="grid gap-3">
        <Toggle
          checked={s.sla}
          onChange={(v) => setS({ ...s, sla: v })}
          label="SLA Monitoring"
          copy="Track response and resolution targets by priority."
        />
        <Toggle
          checked={s.auto}
          onChange={(v) => setS({ ...s, auto: v })}
          label="Automatic Technician Assignment"
        />
        <Toggle
          checked={s.vendor}
          onChange={(v) => setS({ ...s, vendor: v })}
          label="Allow External Vendor Access"
        />
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <Field
          label="Critical SLA (hours)"
          value={s.critical}
          onChange={(v) => setS({ ...s, critical: v })}
        />
        <Field
          label="High SLA (hours)"
          value={s.high}
          onChange={(v) => setS({ ...s, high: v })}
        />
        <Field
          label="Normal SLA (hours)"
          value={s.normal}
          onChange={(v) => setS({ ...s, normal: v })}
        />
      </div>
      <div className="mt-5 flex justify-end">
        <SaveButton onClick={save} />
      </div>
    </Card>
  );
}

function Notifications({ save }) {
  const [s, setS] = useState({
    email: true,
    push: true,
    sms: false,
    maintenance: true,
    transfers: true,
    bookings: true,
    audits: true,
    digest: true,
  });
  return (
    <div className="grid gap-6">
      <Card
        title="Delivery Channels"
        copy="Choose how administrators receive operational alerts."
        icon={Bell}
      >
        <div className="grid gap-3">
          <Toggle
            checked={s.email}
            onChange={(v) => setS({ ...s, email: v })}
            label="Email Notifications"
          />
          <Toggle
            checked={s.push}
            onChange={(v) => setS({ ...s, push: v })}
            label="In-App & Push Notifications"
          />
          <Toggle
            checked={s.sms}
            onChange={(v) => setS({ ...s, sms: v })}
            label="SMS for Critical Alerts"
          />
        </div>
      </Card>
      <Card
        title="Notification Events"
        copy="Select the workflow activity you want to follow."
        icon={Settings}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ["maintenance", "Maintenance & SLA"],
            ["transfers", "Transfer Approvals"],
            ["bookings", "Booking Activity"],
            ["audits", "Audit Discrepancies"],
            ["digest", "Weekly Executive Digest"],
          ].map(([k, l]) => (
            <Toggle
              key={k}
              checked={s[k]}
              onChange={(v) => setS({ ...s, [k]: v })}
              label={l}
            />
          ))}
        </div>
        <div className="mt-5 flex justify-end">
          <SaveButton onClick={save} />
        </div>
      </Card>
    </div>
  );
}

function Security({ save }) {
  const [two, setTwo] = useState(true);
  const sessions = [
    ["Windows · Chrome", "Bengaluru, India", "Current session", "Active"],
    ["iPhone · Safari", "Pune, India", "2 hours ago", "Active"],
    ["macOS · Chrome", "Mumbai, India", "4 days ago", "Expired"],
  ];
  return (
    <div className="grid gap-6">
      <Card
        title="Two-Factor Authentication"
        copy="Add an extra verification step to administrator login."
        icon={ShieldCheck}
      >
        <Toggle
          checked={two}
          onChange={setTwo}
          label={two ? "2FA is enabled" : "Enable two-factor authentication"}
          copy="Authenticator app verification is required for sensitive actions."
        />
        <div className="mt-4 flex justify-end">
          <SaveButton onClick={save} />
        </div>
      </Card>
      <Card
        title="Active Sessions"
        copy="Review and revoke devices signed into your account."
        icon={Smartphone}
      >
        <div className="space-y-3">
          {sessions.map(([device, place, time, status], i) => (
            <div
              key={device}
              className="flex flex-col justify-between gap-3 rounded-xl border border-slate-100 p-4 dark:border-slate-800 sm:flex-row sm:items-center"
            >
              <div className="flex gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-brand-500 dark:bg-blue-500/10">
                  <Smartphone size={17} />
                </span>
                <div>
                  <b className="text-sm">{device}</b>
                  <p className="mt-1 text-xs text-slate-400">
                    {place} · {time}
                  </p>
                </div>
              </div>
              {i === 0 ? (
                <span className="text-xs font-bold text-emerald-500">
                  {status}
                </span>
              ) : (
                <button className="text-xs font-bold text-red-500">
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </Card>
      <Card
        title="Password Policy"
        copy="Organization-wide sign-in requirements."
        icon={LockKeyhole}
      >
        <div className="grid gap-5 sm:grid-cols-3">
          <Select label="Minimum Length" value="12">
            <option>12 characters</option>
            <option>16 characters</option>
          </Select>
          <Select label="Password Expiry" value="90 days">
            <option>90 days</option>
            <option>180 days</option>
            <option>Never</option>
          </Select>
          <Select label="Failed Login Lockout" value="5 attempts">
            <option>5 attempts</option>
            <option>10 attempts</option>
          </Select>
        </div>
        <div className="mt-5 flex justify-end">
          <SaveButton onClick={save} />
        </div>
      </Card>
    </div>
  );
}

function Appearance({ dark, setDark, save }) {
  const [color, setColor] = useState("Blue");
  return (
    <Card
      title="Appearance"
      copy="Personalize your AssetFlow workspace."
      icon={Palette}
    >
      <div>
        <p className="text-sm font-bold">Interface Mode</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => setDark(false)}
            className={`rounded-2xl border p-4 text-left ${!dark ? "border-brand-500 bg-blue-50 ring-4 ring-blue-100 dark:bg-blue-950/20" : "border-slate-200 dark:border-slate-700"}`}
          >
            <div className="h-24 rounded-xl bg-white p-3 shadow">
              <div className="h-3 w-20 rounded bg-slate-200" />
              <div className="mt-3 grid grid-cols-3 gap-2">
                <i className="h-10 rounded bg-blue-100" />
                <i className="h-10 rounded bg-slate-100" />
                <i className="h-10 rounded bg-slate-100" />
              </div>
            </div>
            <b className="mt-3 block text-sm">Light Mode</b>
          </button>
          <button
            onClick={() => setDark(true)}
            className={`rounded-2xl border p-4 text-left ${dark ? "border-brand-500 bg-blue-950/30 ring-4 ring-blue-950" : "border-slate-200 dark:border-slate-700"}`}
          >
            <div className="h-24 rounded-xl bg-slate-950 p-3 shadow">
              <div className="h-3 w-20 rounded bg-slate-700" />
              <div className="mt-3 grid grid-cols-3 gap-2">
                <i className="h-10 rounded bg-blue-950" />
                <i className="h-10 rounded bg-slate-800" />
                <i className="h-10 rounded bg-slate-800" />
              </div>
            </div>
            <b className="mt-3 block text-sm">Dark Mode</b>
          </button>
        </div>
      </div>
      <div className="mt-7">
        <p className="text-sm font-bold">Theme Color</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {[
            ["Blue", "#3563e9"],
            ["Indigo", "#6366f1"],
            ["Violet", "#8b5cf6"],
            ["Emerald", "#10b981"],
            ["Orange", "#f97316"],
          ].map(([name, hex]) => (
            <button
              key={name}
              onClick={() => setColor(name)}
              aria-label={`${name} theme`}
              className={`grid size-11 place-items-center rounded-xl border ${color === name ? "ring-4 ring-blue-100 dark:ring-blue-950" : ""}`}
            >
              <i className="size-6 rounded-lg" style={{ background: hex }} />
              {color === name && (
                <Check className="absolute text-white" size={13} />
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <SaveButton onClick={save} />
      </div>
    </Card>
  );
}

function Backup({ save }) {
  const file = useRef();
  return (
    <div className="grid gap-6">
      <Card
        title="Backup Schedule"
        copy="Protect configuration and operational records."
        icon={DatabaseBackup}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Select label="Automatic Backup" value="Daily at 02:00 AM">
            <option>Daily at 02:00 AM</option>
            <option>Weekly</option>
            <option>Disabled</option>
          </Select>
          <Select label="Retention Period" value="90 days">
            <option>30 days</option>
            <option>90 days</option>
            <option>1 year</option>
          </Select>
        </div>
        <div className="mt-5 rounded-xl bg-emerald-50 p-4 text-xs text-emerald-700 dark:bg-emerald-500/10">
          <b>Last successful backup:</b> Today, 02:00 AM · 148.6 MB · Encrypted
        </div>
        <div className="mt-5 flex justify-end">
          <SaveButton onClick={save} />
        </div>
      </Card>
      <Card
        title="Backup & Restore"
        copy="Create an on-demand archive or restore a verified backup."
        icon={HardDrive}
      >
        <input ref={file} type="file" accept=".zip,.bak" className="hidden" />
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={save}
            className="flex items-center justify-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-5 font-bold text-brand-500 dark:border-blue-900 dark:bg-blue-950/20"
          >
            <CloudDownload /> Create Backup Now
          </button>
          <button
            onClick={() => file.current.click()}
            className="flex items-center justify-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 font-bold text-amber-600 dark:border-amber-900 dark:bg-amber-950/20"
          >
            <Upload /> Restore from Backup
          </button>
        </div>
      </Card>
    </div>
  );
}

function SystemInfo() {
  const rows = [
    ["AssetFlow Version", "2.6.0 Enterprise"],
    ["Environment", "Production"],
    ["React", "19.2.7"],
    ["Vite", "8.1.4"],
    ["Database", "PostgreSQL 17 · Connected"],
    ["API Status", "Operational"],
    ["Last Deployment", "12 July 2026 · 08:42 AM"],
    ["License", "Enterprise · 500 users"],
  ];
  return (
    <div className="grid gap-6">
      <Card
        title="System Information"
        copy="Runtime, build, and licensing details."
        icon={ServerCog}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between gap-4 rounded-xl bg-slate-50 p-4 text-xs dark:bg-slate-800"
            >
              <span className="text-slate-400">{label}</span>
              <b className="text-right">{value}</b>
            </div>
          ))}
        </div>
      </Card>
      <Card
        title="Platform Health"
        copy="Live status for core AssetFlow services."
        icon={RefreshCw}
      >
        <div className="grid gap-3 sm:grid-cols-3">
          {["Application API", "Database Cluster", "File Storage"].map((x) => (
            <div
              key={x}
              className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-900 dark:bg-emerald-950/20"
            >
              <span className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                <i className="size-2 rounded-full bg-emerald-500" /> Operational
              </span>
              <p className="mt-2 text-sm font-bold">{x}</p>
              <p className="mt-1 text-[10px] text-slate-400">99.99% uptime</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function SettingsPage() {
  const [collapsed, setCollapsed] = useState(false),
    [mobileOpen, setMobileOpen] = useState(false),
    [dark, setDark] = useState(
      () => localStorage.getItem("assetflow_theme") === "dark",
    ),
    [active, setActive] = useState("Profile"),
    [toast, setToast] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("assetflow_theme", dark ? "dark" : "light");
    return () => document.documentElement.classList.remove("dark");
  }, [dark]);
  const save = (message = "Settings saved successfully") => {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  };
  const logout = () => {
    localStorage.removeItem("assetflow_auth");
    navigate("/login", { replace: true });
  };
  const content =
    active === "Profile" ? (
      <Profile save={save} />
    ) : active === "Organization" ? (
      <Organization save={save} />
    ) : active === "User & Role Management" ? (
      <Roles save={save} />
    ) : active === "Asset Configuration" ? (
      <AssetConfig save={save} />
    ) : active === "Booking Settings" ? (
      <Booking save={save} />
    ) : active === "Maintenance Settings" ? (
      <Maintenance save={save} />
    ) : active === "Notification Preferences" ? (
      <Notifications save={save} />
    ) : active === "Security" ? (
      <Security save={save} />
    ) : active === "Appearance" ? (
      <Appearance dark={dark} setDark={setDark} save={save} />
    ) : active === "Backup & Restore" ? (
      <Backup save={() => save("Backup operation started successfully")} />
    ) : (
      <SystemInfo />
    );
  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 dark:bg-slate-950 dark:text-slate-300">
      <DashboardSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={logout}
        activePage="Settings"
      />
      <div
        className="transition-[margin] duration-300 lg:ml-[var(--side)]"
        style={{ "--side": collapsed ? "88px" : "256px" }}
      >
        <AdminTopbar
          dark={dark}
          setDark={setDark}
          setMobileOpen={setMobileOpen}
        />
        <main className="mx-auto max-w-[1500px] p-4 sm:p-6 lg:p-8">
          <header>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-brand-500">
              <Settings size={15} /> Administrator Control Center
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-navy-900 dark:text-white">
              Settings
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Configure your profile, organization, workflows, security, and
              AssetFlow platform behavior.
            </p>
          </header>
          <div className="mt-7 grid items-start gap-6 xl:grid-cols-[280px_1fr]">
            <aside className="card dashboard-scroll sticky top-24 flex gap-1 overflow-x-auto p-2 xl:block xl:overflow-visible">
              {sections.map(([Icon, label]) => (
                <button
                  key={label}
                  onClick={() => setActive(label)}
                  className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold transition xl:mb-1 xl:w-full ${active === label ? "bg-gradient-to-r from-brand-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-500 hover:bg-slate-100 hover:text-navy-900 dark:hover:bg-slate-800 dark:hover:text-white"}`}
                >
                  <Icon size={17} />
                  <span className="whitespace-nowrap">{label}</span>
                  <ChevronRight className="ml-auto hidden xl:block" size={14} />
                </button>
              ))}
            </aside>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                {content}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-5 right-5 z-[90] flex items-center gap-3 rounded-xl bg-navy-950 px-5 py-3 text-sm font-semibold text-white shadow-2xl"
          >
            <Check size={17} className="text-emerald-400" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
