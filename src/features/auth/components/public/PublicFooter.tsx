import { Link } from "react-router-dom";

const COLS = [
  { title: "Platform", links: [
    { label: "For Patients", to: "/register/client" },
    { label: "For Physios", to: "/register/physio" },
    { label: "Pricing", to: "/#pricing" },
  ]},
  { title: "Company", links: [
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "Privacy", to: "/privacy" },
    { label: "Terms", to: "/terms" },
  ]},
];

const PublicFooter = () => (
  <footer style={{ background: "var(--pub-ink-base)", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
    <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
        <div className="col-span-2">
          <Link to="/" className="flex items-center gap-2.5 mb-4">
            <img src="/logo-icon.png" alt="ReHboX" className="w-9 h-9 object-contain" />
            <span className="font-display font-bold text-lg text-white">ReH<span style={{ color: "#E0479B" }}>bo</span>X</span>
          </Link>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
            Nigeria's leading digital physiotherapy platform. Connecting patients and physios for smarter recovery.
          </p>
        </div>
        {COLS.map((col) => (
          <div key={col.title}>
            <p className="text-white/30 text-xs uppercase tracking-widest font-bold mb-4">{col.title}</p>
            <div className="space-y-2.5">
              {col.links.map((l) => (
                <Link key={l.label} to={l.to} className="block text-sm text-white/50 hover:text-white/85 transition-colors">{l.label}</Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>© 2026 ReHboX Health Technologies Ltd. · Built for Nigeria 🇳🇬</p>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>NDPA 2023 Compliant · Secured by SSL</p>
      </div>
    </div>
  </footer>
);

export default PublicFooter;
