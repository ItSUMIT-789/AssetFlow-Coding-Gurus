import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, ImagePlus, Send } from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import AdminTopbar from "../components/AdminTopbar";
import { getCurrentUser, logoutUser } from "../utils/auth";
import { getAll, KEYS } from "../services/storageService";
import { raiseMaintenance } from "../services/workflowService";
export default function MaintenanceRequestPage() {
  const user = getCurrentUser(),
    navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false),
    [mobileOpen, setMobileOpen] = useState(false),
    [dark, setDark] = useState(false),
    [assetId, setAssetId] = useState(""),
    [issue, setIssue] = useState(""),
    [priority, setPriority] = useState("MEDIUM"),
    [image, setImage] = useState(""),
    [message, setMessage] = useState("");
  const assets = getAll(KEYS.assets).filter(
    (a) => a.currentHolderId === user.id,
  );
  useEffect(
    () => document.documentElement.classList.toggle("dark", dark),
    [dark],
  );
  const submit = (e) => {
    e.preventDefault();
    try {
      raiseMaintenance(
        {
          assetId,
          issueDescription: issue,
          priority,
          images: image ? [image] : [],
        },
        user,
      );
      setMessage("Maintenance request submitted for Asset Manager approval.");
      setIssue("");
      setImage("");
    } catch (error) {
      setMessage(error.message);
    }
  };
  const upload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={() => {
          logoutUser();
          navigate("/login");
        }}
        activePage="Maintenance"
      />
      <div className="transition-[margin] lg:ml-[256px]">
        <AdminTopbar
          dark={dark}
          setDark={setDark}
          setMobileOpen={setMobileOpen}
        />
        <main className="mx-auto max-w-4xl p-5 lg:p-8">
          <p className="text-xs font-bold uppercase text-brand-500">
            Self-Service Workflow
          </p>
          <h1 className="mt-2 text-3xl font-extrabold dark:text-white">
            Raise Maintenance Request
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Report an issue for an asset currently allocated to you.
          </p>
          {message && (
            <div className="mt-6 rounded-xl bg-blue-50 p-4 text-sm font-semibold text-brand-500">
              {message}
            </div>
          )}
          <form onSubmit={submit} className="card mt-6 p-6">
            <label>
              <span className="mb-2 block text-sm font-bold">
                Allocated Asset
              </span>
              <select
                value={assetId}
                onChange={(e) => setAssetId(e.target.value)}
                className="field"
              >
                <option value="">Select asset</option>
                {assets.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.tag} · {a.name}
                  </option>
                ))}
              </select>
            </label>
            {!assets.length && (
              <div className="mt-4 flex gap-2 rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
                <AlertTriangle size={18} />
                No assets are currently allocated to you.
              </div>
            )}
            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-bold">
                Issue Description
              </span>
              <textarea
                required
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                rows="5"
                className="field"
              />
            </label>
            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-bold">Priority</span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="field"
              >
                <option>LOW</option>
                <option>MEDIUM</option>
                <option>HIGH</option>
                <option>CRITICAL</option>
              </select>
            </label>
            <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-xl border border-dashed p-4">
              <ImagePlus className="text-brand-500" />
              Upload image
              <input
                type="file"
                accept="image/*"
                onChange={upload}
                className="hidden"
              />
            </label>
            <button
              disabled={!assetId || !issue}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-3 font-bold text-white disabled:opacity-40"
            >
              <Send size={17} />
              Submit Request
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
