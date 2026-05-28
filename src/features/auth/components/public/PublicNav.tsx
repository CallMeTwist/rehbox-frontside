import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";

const LINKS = [
  { label: "How it works", to: "/#how-it-works" },
  { label: "Pricing", to: "/#pricing" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const PublicNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(7,15,36,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/logo-icon.png" alt="ReHboX" className="w-9 h-9 object-contain" />
          <span className="font-display font-bold text-xl text-white">
            ReH<span style={{ color: "#E0479B" }}>bo</span>X
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <a key={l.label} href={l.to} className="text-white/70 hover:text-white text-sm transition-colors">{l.label}</a>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-3">
          <Link to="/login" className="text-sm font-semibold text-white/80 hover:text-white transition-colors px-4 py-2 rounded-xl border border-white/20 hover:border-white/40 hover:bg-white/5">
            Sign In
          </Link>
          <Link to="/register/client" className="inline-flex items-center gap-1.5 text-sm font-bold text-white px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity" style={{ background: "var(--pub-grad-accent)", boxShadow: "0 8px 24px rgba(79,141,247,0.4)" }}>
            Get Started <ArrowRight size={14} />
          </Link>
        </div>

        <button className="sm:hidden text-white p-2" aria-label="Menu" onClick={() => setOpen((v) => !v)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="sm:hidden px-6 pb-5 pt-2 space-y-3" style={{ background: "rgba(7,15,36,0.97)", backdropFilter: "blur(20px)" }}>
          {LINKS.map((l) => (
            <a key={l.label} href={l.to} onClick={() => setOpen(false)} className="block text-white/80 text-sm py-1.5">{l.label}</a>
          ))}
          <Link to="/login" onClick={() => setOpen(false)} className="block text-white/80 text-sm py-1.5">Sign In</Link>
          <Link to="/register/client" onClick={() => setOpen(false)} className="inline-flex items-center gap-1.5 text-sm font-bold text-white px-5 py-2.5 rounded-xl mt-1" style={{ background: "var(--pub-grad-magenta)" }}>
            Get Started <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </header>
  );
};

export default PublicNav;
