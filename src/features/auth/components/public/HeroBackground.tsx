const PARTICLES = [
  { left: "20%", top: "30%", delay: "0s" },
  { left: "62%", top: "22%", delay: "1.5s" },
  { left: "48%", top: "68%", delay: "3s" },
  { left: "80%", top: "58%", delay: "2s" },
  { left: "33%", top: "80%", delay: "4s" },
];

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")";

const HeroBackground = () => (
  <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
    {/* blueprint grid (masked) */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.035) 1px,transparent 1px)",
        backgroundSize: "46px 46px",
        maskImage: "radial-gradient(circle at 70% 42%, #000, transparent 72%)",
        WebkitMaskImage: "radial-gradient(circle at 70% 42%, #000, transparent 72%)",
      }}
    />
    {/* glow A — magenta→violet, top-right */}
    <div
      className="absolute rounded-full"
      style={{ right: "-6%", top: "-10%", width: 680, height: 680, filter: "blur(8px)", background: "radial-gradient(circle, rgba(224,71,155,0.20), rgba(124,92,255,0.10) 40%, transparent 68%)" }}
    />
    {/* glow B — cyan, bottom-left */}
    <div
      className="absolute rounded-full"
      style={{ left: "-12%", bottom: "-18%", width: 560, height: 560, filter: "blur(10px)", background: "radial-gradient(circle, rgba(38,198,218,0.15), transparent 66%)" }}
    />
    {/* movement waveform */}
    <svg className="absolute left-0 right-0" style={{ bottom: "8%", height: 200, opacity: 0.5 }} viewBox="0 0 1440 200" preserveAspectRatio="none">
      <path d="M0 120 Q 360 40 720 120 T 1440 120" fill="none" stroke="rgba(124,92,255,0.22)" strokeWidth="1.5" />
      <path d="M0 150 Q 360 80 720 150 T 1440 150" fill="none" stroke="rgba(38,198,218,0.16)" strokeWidth="1.5" />
    </svg>
    {/* grain */}
    <div className="absolute inset-0" style={{ opacity: 0.05, mixBlendMode: "overlay", backgroundImage: GRAIN }} />
    {/* floating particles */}
    {PARTICLES.map((p, i) => (
      <span
        key={i}
        className="pub-anim-float absolute rounded-full"
        style={{ left: p.left, top: p.top, width: 4, height: 4, background: "rgba(159,192,255,0.7)", boxShadow: "0 0 8px rgba(159,192,255,0.8)", animationDelay: p.delay }}
      />
    ))}
  </div>
);

export default HeroBackground;
