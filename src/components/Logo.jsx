import { Boxes } from "lucide-react";
import { Link } from "react-router-dom";

export default function Logo({ light = false }) {
  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2 text-xl font-bold ${light ? "text-white" : "text-navy-900"}`}
    >
      <span className="grid size-10 place-items-center rounded-xl bg-brand-500 text-white shadow-md shadow-blue-500/20">
        <Boxes size={21} />
      </span>
      Asset<span className="-ml-2 text-brand-500">Flow</span>
    </Link>
  );
}
