// Positions are percentage-based over the figure box and tuned to hero-runner.png.
// Adjust during visual review so nodes/bones land on the athlete's joints.
const NODES = [
  { left: "50%", top: "14%", delay: "0s" },
  { left: "42%", top: "30%", delay: ".4s" },
  { left: "58%", top: "30%", delay: ".7s" },
  { left: "44%", top: "52%", delay: "1s" },
  { left: "56%", top: "54%", delay: ".5s" },
  { left: "47%", top: "74%", delay: "1.3s" },
];

const BONES = [
  { left: "50%", top: "15%", width: 60, rot: 118 },
  { left: "50%", top: "15%", width: 60, rot: 62 },
  { left: "42%", top: "31%", width: 80, rot: 80 },
  { left: "44%", top: "53%", width: 60, rot: 95 },
];

const HUD = [
  { label: "Range of Motion", value: "142°", note: "▲ optimal", pos: { left: "-4%", top: "20%" }, delay: "0s", show: "" },
  { label: "Form Accuracy",   value: "98%",  note: "· live",    pos: { right: "-6%", top: "42%" }, delay: "1.5s", show: "" },
  { label: "Session",         value: "Rep 12", note: "/ 15",    pos: { left: "2%", bottom: "10%" }, delay: "2.5s", show: "hidden lg:block" },
];

const HeroFigure = () => (
  <div className="hero-figure relative flex items-center justify-center min-h-[460px] md:min-h-[540px]">
    {/* spotlight */}
    <div
      className="absolute rounded-full pointer-events-none"
      style={{ width: "88%", height: "74%", background: "radial-gradient(circle, rgba(224,71,155,0.28), rgba(38,198,218,0.12) 45%, transparent 70%)" }}
      aria-hidden="true"
    />
    {/* orbital rings */}
    <div className="pub-anim-spin absolute rounded-full hidden sm:block pointer-events-none" style={{ width: 430, height: 430, border: "1px solid rgba(124,92,255,0.22)" }} aria-hidden="true" />
    <div className="pub-anim-spin-rev absolute rounded-full hidden sm:block pointer-events-none" style={{ width: 520, height: 520, border: "1px solid rgba(38,198,218,0.14)" }} aria-hidden="true" />

    {/* athlete */}
    <img
      src="/hero-runner.png"
      alt="Athlete with live AI pose-tracking skeleton"
      className="relative z-[2] w-full max-w-md object-contain"
      style={{ filter: "drop-shadow(0 0 50px rgba(38,198,218,0.4))" }}
    />

    {/* AI motion-tracking overlay (decorative) */}
    <div className="absolute inset-0 z-[3]" aria-hidden="true">
      {BONES.map((b, i) => (
        <span
          key={`bone-${i}`}
          className="absolute"
          style={{ left: b.left, top: b.top, width: b.width, height: 2, borderRadius: 2, transformOrigin: "left", transform: `rotate(${b.rot}deg)`, background: "linear-gradient(90deg,rgba(38,198,218,0.9),rgba(224,71,155,0.9))" }}
        />
      ))}
      {NODES.map((n, i) => (
        <span
          key={`node-${i}`}
          className="pub-anim-pulse absolute rounded-full"
          style={{ left: n.left, top: n.top, width: 11, height: 11, background: "#26C6DA", animationDelay: n.delay }}
        />
      ))}
      {/* scan line */}
      <span
        className="pub-anim-scan absolute"
        style={{ left: "18%", right: "18%", height: 2, background: "linear-gradient(90deg,transparent,rgba(38,198,218,0.9),transparent)", boxShadow: "0 0 14px rgba(38,198,218,0.8)" }}
      />
      {/* HUD chips */}
      {HUD.map((h) => (
        <div
          key={h.label}
          className={`hero-hud pub-anim-float absolute rounded-2xl px-3.5 py-2.5 ${h.show}`}
          style={{ ...h.pos, animationDelay: h.delay, background: "rgba(8,18,40,0.55)", border: "1px solid rgba(255,255,255,0.14)", boxShadow: "0 12px 30px rgba(0,0,0,0.35)", backdropFilter: "blur(12px)" }}
        >
          <div className="font-mono uppercase tracking-[0.12em] text-[9px]" style={{ color: "#9fc0ff" }}>{h.label}</div>
          <div className="font-display font-bold text-[1.05rem] text-white mt-0.5">
            {h.value} <span className="text-[0.7rem] font-sans font-semibold" style={{ color: "#34D399" }}>{h.note}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default HeroFigure;
