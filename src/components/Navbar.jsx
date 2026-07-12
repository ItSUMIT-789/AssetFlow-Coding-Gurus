import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import Button from "./Button";

const links = [
  ["Home", "top"],
  ["Features", "features"],
  ["How It Works", "how-it-works"],
  ["Benefits", "benefits"],
  ["Contact", "contact"],
];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Logo />
        <div className="hidden items-center gap-7 lg:flex">
          {links.map(([label, id]) => (
            <a
              key={id}
              href={`#${id}`}
              className="text-sm font-medium text-slate-600 hover:text-brand-500"
            >
              {label}
            </a>
          ))}
        </div>
        <div className="hidden gap-2 lg:flex">
          <Button to="/login" variant="secondary" className="py-2.5">
            Login
          </Button>
          <Button to="/register" className="py-2.5">
            Get Started
          </Button>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-slate-700 lg:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <div className="border-t bg-white px-5 py-4 lg:hidden">
          {links.map(([label, id]) => (
            <a
              onClick={() => setOpen(false)}
              key={id}
              href={`#${id}`}
              className="block py-3 text-sm font-medium text-slate-700"
            >
              {label}
            </a>
          ))}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Button to="/login" variant="secondary">
              Login
            </Button>
            <Button to="/register">Get Started</Button>
          </div>
        </div>
      )}
    </header>
  );
}
