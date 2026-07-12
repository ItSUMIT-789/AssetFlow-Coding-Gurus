import { ShieldX } from "lucide-react";
import { Link } from "react-router-dom";
export default function Forbidden() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-5">
      <section className="max-w-md rounded-3xl border bg-white p-9 text-center shadow-xl">
        <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-red-50 text-red-500">
          <ShieldX size={30} />
        </span>
        <h1 className="mt-6 text-2xl font-extrabold text-navy-900">
          Access forbidden
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Your role does not have permission to access this AssetFlow module.
        </p>
        <Link
          to="/dashboard"
          className="mt-7 inline-flex rounded-xl bg-brand-500 px-5 py-3 text-sm font-bold text-white"
        >
          Return to dashboard
        </Link>
      </section>
    </main>
  );
}
