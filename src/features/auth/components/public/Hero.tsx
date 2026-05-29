import { useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Activity, Award, Home } from "lucide-react";
import { Eyebrow } from "@/features/auth/components/public/primitives";
import HeroBackground from "@/features/auth/components/public/HeroBackground";
import HeroFigure from "@/features/auth/components/public/HeroFigure";
import { prefersReducedMotion } from "@/features/auth/components/public/useReveal";

const PILLS = [
  { icon: Activity, label: "Real-time AI tracking",      grad: "linear-gradient(135deg,#26C6DA,#7C5CFF)" },
  { icon: Award,    label: "Certified physiotherapists", grad: "var(--pub-grad-magenta)" },
  { icon: Home,     label: "Recover from home",          grad: "linear-gradient(135deg,#26C6DA,#7C5CFF)" },
];

const Hero = () => {
  const ref = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .from(".hero-eyebrow", { opacity: 0, y: 18, duration: 0.5 })
      .from(".hero-title",   { opacity: 0, y: 28, duration: 0.7 }, "-=0.25")
      .from(".hero-sub",     { opacity: 0, y: 22, duration: 0.55 }, "-=0.4")
      .from(".hero-ctas",    { opacity: 0, y: 20, duration: 0.5 }, "-=0.35")
      .from(".hero-pills > *", { opacity: 0, y: 16, duration: 0.45, stagger: 0.08 }, "-=0.3")
      .from(".hero-figure",  { opacity: 0, scale: 0.92, duration: 0.85, ease: "power2.out" }, "-=0.7")
      .from(".hero-hud",     { opacity: 0, scale: 0.9, duration: 0.5, stagger: 0.12 }, "-=0.5");
  }, { scope: ref });

  return (
    <section ref={ref} className="pub-hero relative min-h-screen flex items-center overflow-hidden bg-pub-hero pt-16">
    <HeroBackground />
    <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-20 w-full grid md:grid-cols-2 gap-12 items-center">
      {/* ── Copy column ── */}
      <div className="hero-copy">
        <span className="hero-eyebrow inline-block">
          <Eyebrow tone="dark" live>Nigeria's digital physiotherapy platform</Eyebrow>
        </span>

        <h1 className="hero-title font-display font-bold text-5xl md:text-[4.6rem] text-white leading-[1.02] tracking-tight mt-6">
          Recover with<br />precision, <span className="pub-grad-text-3">at home.</span>
        </h1>

        <p className="hero-sub text-lg md:text-xl mt-5 max-w-md" style={{ color: "#AEBCD8" }}>
          AI motion tracking and certified physiotherapists, working together to guide every rep.
        </p>

        <div className="hero-ctas flex flex-col sm:flex-row gap-4 mt-8">
          <Link
            to="/register/client"
            className="group inline-flex items-center justify-center gap-2.5 font-bold px-8 py-4 rounded-2xl text-white text-base transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: "var(--pub-grad-magenta)", boxShadow: "0 14px 38px rgba(224,71,155,0.42), inset 0 0 0 1px rgba(255,255,255,0.06)" }}
          >
            I'm a Patient <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            to="/register/physio"
            className="inline-flex items-center justify-center gap-2.5 font-bold px-8 py-4 rounded-2xl text-white text-base transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/10"
            style={{ border: "1px solid rgba(255,255,255,0.22)", background: "rgba(255,255,255,0.03)", backdropFilter: "blur(8px)" }}
          >
            I'm a Physiotherapist
          </Link>
        </div>

        <ul className="hero-pills flex flex-wrap gap-3 mt-10">
          {PILLS.map((p) => (
            <li
              key={p.label}
              className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full text-sm font-medium"
              style={{ color: "#dce6fb", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(8px)" }}
            >
              <span className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: p.grad }}>
                <p.icon size={13} className="text-white" />
              </span>
              {p.label}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Figure ── */}
      <HeroFigure />
    </div>
    </section>
  );
};

export default Hero;
