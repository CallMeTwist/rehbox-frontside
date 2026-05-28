import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Activity, Shield, Award, Users,
  Brain, BarChart3, MessageSquare, Star,
  ChevronDown, Heart, TrendingUp, Clock, Check,
  PlayCircle, Zap,
} from "lucide-react";

// ── Data ──────────────────────────────────────────────────────────────────────

const features = [
  { icon: Activity, title: "AI Motion Tracking", desc: "Real-time pose analysis with computer vision detects form errors and guides corrections during every rep.", color: "#2C5FC3", glow: "rgba(44,95,195,0.35)" },
  { icon: Shield, title: "Expert-Led Plans", desc: "Personalised rehabilitation programmes built by vetted physiotherapists based on your specific condition.", color: "#E5197D", glow: "rgba(229,25,125,0.35)" },
  { icon: Brain, title: "AI Recovery Insights", desc: "Adaptive algorithms analyse your progress and recalibrate your plan automatically every 48 hours.", color: "#2C5FC3", glow: "rgba(44,95,195,0.35)" },
  { icon: MessageSquare, title: "Direct PT Messaging", desc: "Send videos, ask questions, and receive voice notes from your physiotherapist without clinic delays.", color: "#E5197D", glow: "rgba(229,25,125,0.35)" },
  { icon: Award, title: "Reward System", desc: "Earn coins and unlock badges for consistency. Exchange rewards for premium content and consultations.", color: "#2C5FC3", glow: "rgba(44,95,195,0.35)" },
  { icon: BarChart3, title: "Progress Analytics", desc: "Detailed weekly reports with pain levels, range of motion, and compliance scores shared with your PT.", color: "#E5197D", glow: "rgba(229,25,125,0.35)" },
];

const steps = [
  { num: "01", title: "Get Matched", desc: "Complete a 3-minute intake form. Our algorithm matches you with the best physiotherapist for your condition.", icon: Users, pink: false },
  { num: "02", title: "Follow Your Plan", desc: "Access your personalised exercise programme with step-by-step AI video guidance and real-time feedback.", icon: PlayCircle, pink: true },
  { num: "03", title: "Track & Recover", desc: "Log pain levels, review weekly analytics, and celebrate milestones as you reclaim your movement.", icon: TrendingUp, pink: false },
];

const testimonials = [
  { name: "Amaka O.", role: "Knee Reconstruction Patient", location: "Lagos", text: "After my ACL surgery I was terrified of re-injury. ReHboX gave me daily guided sessions and my PT was always a message away. I'm back to running.", rating: 5, avatar: "AO", color: "#1B3E8F" },
  { name: "Dr. Chukwudi N.", role: "Physiotherapist", location: "Abuja", text: "Managing 40+ clients used to be overwhelming. ReHboX gives me real-time compliance data, motion reports, and earnings I couldn't get in a clinic.", rating: 5, avatar: "CN", color: "#E5197D" },
  { name: "Funmi A.", role: "Chronic Back Pain Patient", location: "Port Harcourt", text: "I tried three clinics without improvement. Within 6 weeks on ReHboX with twice-weekly remote sessions, my pain dropped from 8 to 2.", rating: 5, avatar: "FA", color: "#2C5FC3" },
];

const stats = [
  { value: 500, suffix: "+", label: "Patients Recovered" },
  { value: 80, suffix: "+", label: "Certified PTs" },
  { value: 95, suffix: "%", label: "Recovery Rate" },
  { value: 6, suffix: "wk", label: "Avg. Recovery Time" },
];

const faqs = [
  { q: "How does the AI motion tracking work?", a: "ReHboX uses your device's camera and computer vision to analyse your body position in real time during exercises. It detects form deviations and gives immediate corrective feedback, similar to having a PT watch every rep." },
  { q: "Do I need special equipment?", a: "No equipment required. A smartphone or laptop with a camera is all you need. For some advanced plans, resistance bands or a yoga mat may be suggested — but the core programmes work anywhere." },
  { q: "How are physiotherapists vetted?", a: "Every PT on ReHboX goes through licence verification, credential checks, and a clinical assessment before being approved. Only verified, practising physiotherapists are listed." },
  { q: "Is my health data secure?", a: "Absolutely. All data is encrypted end-to-end. We comply with international health data standards and never sell or share patient information with third parties." },
  { q: "Can I switch physiotherapists?", a: "Yes. If you're not satisfied with your current match, you can request a re-match at any time. Your history and progress records transfer automatically." },
];

// ── Hooks ─────────────────────────────────────────────────────────────────────

function useCountUp(target: number, trigger: boolean): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let current = 0;
    const steps = 60;
    const increment = target / steps;
    const interval = 1800 / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, interval);
    return () => clearInterval(timer);
  }, [target, trigger]);
  return count;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const count = useCountUp(value, inView);
  return (
    <div ref={ref} className="text-center">
      <p className="font-display font-bold text-5xl md:text-6xl text-white mb-2">
        {count}{suffix}
      </p>
      <p className="text-white/50 text-xs tracking-widest uppercase">{label}</p>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-300"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <button
        className="w-full flex items-center justify-between px-6 py-5 text-left cursor-pointer"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-display font-semibold text-white text-sm md:text-base pr-4">{q}</span>
        <ChevronDown size={18} className={`text-white/40 flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-white/50 text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PhoneMockup() {
  return (
    <div className="relative w-[260px] md:w-[290px] mx-auto select-none">
      {/* Pulse rings */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute rounded-[3rem] border border-blue-500/10 pointer-events-none"
          style={{
            inset: `-${i * 24}px`,
            animation: `pulse-ring 3.5s ease-out ${i * 0.9}s infinite`,
          }}
        />
      ))}
      {/* Phone shell */}
      <div
        className="relative rounded-[2.5rem] overflow-hidden"
        style={{
          height: "520px",
          background: "linear-gradient(145deg, #1a2a5e 0%, #0d1b3e 100%)",
          border: "2px solid rgba(255,255,255,0.10)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black/60 rounded-b-2xl z-10" />
        {/* Screen */}
        <div className="absolute inset-[2px] rounded-[2.4rem] overflow-hidden" style={{ background: "#08102a" }}>
          {/* Status bar */}
          <div className="flex justify-between items-center px-6 pt-8 pb-1">
            <span className="text-white/40 text-[10px]">9:41</span>
            <span className="text-white/40 text-[10px]">●●● 100%</span>
          </div>
          {/* Greeting */}
          <div className="px-5 pt-2 pb-3">
            <p className="text-white/40 text-xs">Good morning,</p>
            <p className="text-white font-display font-bold text-base">Funmi</p>
          </div>
          {/* Progress card */}
          <div className="mx-4 p-4 rounded-2xl mb-3" style={{ background: "linear-gradient(135deg, #1B3E8F 0%, #2C5FC3 100%)" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/70 text-xs font-medium">Recovery Progress</span>
              <span className="text-white font-bold text-sm">87%</span>
            </div>
            <div className="w-full h-1.5 bg-white/20 rounded-full">
              <div className="h-1.5 rounded-full" style={{ width: "87%", background: "linear-gradient(90deg, #FF6BB5 0%, #E5197D 100%)" }} />
            </div>
            <p className="text-white/50 text-[10px] mt-2">Week 5 of 6 · Knee Rehabilitation</p>
          </div>
          {/* Mini stats */}
          <div className="flex gap-2 mx-4 mb-3">
            {[["5", "Sessions"], ["2", "Pain /10"], ["92%", "Form"]].map(([v, l]) => (
              <div key={l} className="flex-1 p-2 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-white font-display font-bold text-sm">{v}</p>
                <p className="text-white/40 text-[9px]">{l}</p>
              </div>
            ))}
          </div>
          {/* Today's plan */}
          <div className="mx-4">
            <p className="text-white/30 text-[10px] uppercase tracking-widest mb-2">Today's Plan</p>
            {[{ name: "Quad Sets", reps: "3×15", done: true }, { name: "Straight Leg Raise", reps: "3×12", done: true }, { name: "Wall Squats", reps: "2×10", done: false }].map((ex) => (
              <div key={ex.name} className="flex items-center gap-3 py-2 border-b border-white/[0.04]">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${ex.done ? "bg-green-500" : "border border-white/20"}`}>
                  {ex.done && <Check size={9} className="text-white" />}
                </div>
                <span className={`text-xs flex-1 ${ex.done ? "text-white/30 line-through" : "text-white/70"}`}>{ex.name}</span>
                <span className="text-[10px] text-white/30">{ex.reps}</span>
              </div>
            ))}
          </div>
          {/* Bottom nav */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-around py-3 border-t border-white/[0.04]" style={{ background: "rgba(8,16,42,0.95)" }}>
            {[Activity, Heart, BarChart3, MessageSquare].map((Icon, i) => (
              <div key={i} className={`p-2 rounded-xl ${i === 0 ? "bg-blue-500/20" : ""}`}>
                <Icon size={16} className={i === 0 ? "text-blue-400" : "text-white/25"} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Particles ─────────────────────────────────────────────────────────────────

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  size: Math.random() * 2.5 + 1,
  x: Math.random() * 100,
  y: Math.random() * 100,
  color: i % 3 === 0 ? "#E5197D" : i % 3 === 1 ? "#2C5FC3" : "#ffffff",
  opacity: Math.random() * 0.5 + 0.15,
  duration: Math.random() * 6 + 4,
  delay: Math.random() * 4,
}));

// ── Main ──────────────────────────────────────────────────────────────────────

const Landing = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -9999, y: -9999 });

  const stepsRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const stepsInView = useInView(stepsRef, { once: true, margin: "-100px" });
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-80px" });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: (i: number = 0) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: "#07101f" }}>

      {/* Mouse follow glow */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(700px circle at ${mousePos.x}px ${mousePos.y}px, rgba(27,62,143,0.07), transparent 65%)`,
        }}
      />

      {/* ── NAVBAR ─────────────────────────────────────────────────────── */}
      <nav
        className="fixed z-50 transition-all duration-500"
        style={
          scrolled
            ? {
                top: "12px", left: "16px", right: "16px",
                padding: "12px 24px",
                borderRadius: "16px",
                background: "rgba(7,16,31,0.88)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03)",
              }
            : { top: 0, left: 0, right: 0, padding: "20px 48px" }
        }
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo-icon.png" alt="ReHboX" className="w-9 h-9 object-contain" />
            <span className="font-display font-bold text-lg text-white">ReHboX</span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {[["Features", "features"], ["How It Works", "how-it-works"], ["Pricing", "pricing"], ["Testimonials", "testimonials"], ["FAQ", "faq"]].map(([label, id]) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-sm text-white/55 hover:text-white px-4 py-2 rounded-lg hover:bg-white/[0.06] transition-all duration-200 cursor-pointer"
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-white/60 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/[0.05]">
              Login
            </Link>
            <Link
              to="/register/client"
              className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl transition-all duration-200 hover:scale-105 hover:brightness-110"
              style={{ background: "linear-gradient(135deg, #E5197D 0%, #C4006A 100%)", boxShadow: "0 4px 20px rgba(229,25,125,0.4)" }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex flex-col justify-center overflow-hidden px-6 md:px-12 lg:px-20 pt-28 pb-20"
        style={{ background: "linear-gradient(160deg, #060c1e 0%, #091526 50%, #0e1e42 100%)" }}
      >
        {/* Ambient blobs */}
        <div className="absolute top-[-15%] right-[-8%] w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(27,62,143,0.28) 0%, transparent 65%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-[-10%] left-[-8%] w-[550px] h-[550px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(229,25,125,0.18) 0%, transparent 65%)", filter: "blur(80px)" }} />
        <div className="absolute top-[35%] left-[35%] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(44,95,195,0.12) 0%, transparent 65%)", filter: "blur(80px)", animation: "blob-drift 8s ease-in-out infinite" }} />

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "36px 36px" }} />

        {/* Particles */}
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: p.size, height: p.size,
              background: p.color,
              left: `${p.x}%`, top: `${p.y}%`,
              opacity: p.opacity,
              animation: `particle-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-14 items-center">

            {/* Left */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", backdropFilter: "blur(12px)" }}
              >
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-soft" />
                <span className="text-white/75 text-xs font-medium">Nigeria's #1 Digital Physiotherapy Platform</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="font-display font-bold text-5xl md:text-6xl lg:text-[4.5rem] leading-[1.04] mb-6 text-white"
              >
                Recover{" "}
                <span style={{ background: "linear-gradient(135deg, #FF6BB5 0%, #E5197D 55%, #C4006A 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Smarter.
                </span>
                <br />
                Move{" "}
                <span style={{ background: "linear-gradient(135deg, #93c5fd 0%, #2C5FC3 55%, #1B3E8F 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Freer.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }}
                className="text-white/55 text-lg md:text-xl leading-[1.75] mb-10 max-w-lg"
              >
                AI-powered physiotherapy at your fingertips. Connect with vetted PTs, follow guided recovery plans, and track your healing — anywhere in Nigeria.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.26 }}
                className="flex flex-col sm:flex-row gap-4 mb-10"
              >
                <Link
                  to="/register/client"
                  className="group flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-bold text-white text-base transition-all duration-300 hover:scale-[1.03] hover:brightness-110"
                  style={{ background: "linear-gradient(135deg, #E5197D 0%, #C4006A 100%)", boxShadow: "0 8px 36px rgba(229,25,125,0.45)" }}
                >
                  Start Your Recovery
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <Link
                  to="/register/physiotherapist"
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-white text-base transition-all duration-300 hover:bg-white/[0.09]"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(12px)" }}
                >
                  I'm a Physiotherapist
                </Link>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.42 }}
                className="flex flex-wrap gap-5"
              >
                {[{ icon: Shield, text: "HIPAA Compliant" }, { icon: Check, text: "Verified PTs Only" }, { icon: Clock, text: "24/7 Support" }].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5">
                    <Icon size={12} className="text-emerald-400" />
                    <span className="text-white/45 text-xs">{text}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — phone + floating cards */}
            <motion.div
              initial={{ opacity: 0, x: 36 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
              className="relative hidden lg:flex items-center justify-center"
              style={{ minHeight: "620px" }}
            >
              {/* Radial glow behind phone */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ background: "radial-gradient(ellipse 55% 55% at 50% 50%, rgba(27,62,143,0.35) 0%, transparent 70%)" }} />

              <PhoneMockup />

              {/* Recovery score card */}
              <div
                className="absolute top-[4%] right-[-2%] p-3 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.10)", animation: "float 4.2s ease-in-out infinite" }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Zap size={10} className="text-emerald-400" />
                  <span className="text-white/70 text-[10px] font-medium">Recovery Score</span>
                </div>
                <p className="text-white font-display font-bold text-2xl">87%</p>
                <p className="text-emerald-400 text-[10px]">+12% this week</p>
              </div>

              {/* Pain level card */}
              <div
                className="absolute bottom-[18%] left-[-6%] p-3 rounded-2xl"
                style={{ background: "rgba(229,25,125,0.10)", backdropFilter: "blur(20px)", border: "1px solid rgba(229,25,125,0.22)", animation: "float 5.2s ease-in-out 1.3s infinite" }}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <Heart size={10} className="text-pink-400" />
                  <span className="text-white/70 text-[10px] font-medium">Pain Level</span>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full" style={{ background: i < 2 ? "#E5197D" : "rgba(255,255,255,0.12)" }} />
                  ))}
                </div>
                <p className="text-white/50 text-[10px] mt-1.5">2/10 — Excellent</p>
              </div>

              {/* PT card */}
              <div
                className="absolute top-[42%] right-[-10%] p-3 rounded-2xl"
                style={{ background: "rgba(44,95,195,0.14)", backdropFilter: "blur(20px)", border: "1px solid rgba(44,95,195,0.28)", animation: "float 6s ease-in-out 0.7s infinite" }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-display font-bold text-white text-xs" style={{ background: "linear-gradient(135deg, #1B3E8F 0%, #2C5FC3 100%)" }}>SN</div>
                  <div>
                    <p className="text-white text-xs font-semibold">Dr. Sarah N.</p>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      <p className="text-white/45 text-[10px]">Your PT · Online</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sessions card */}
              <div
                className="absolute bottom-[34%] right-[0%] p-3 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.09)", animation: "float 4.8s ease-in-out 2.1s infinite" }}
              >
                <p className="text-white/40 text-[10px] mb-1.5">Sessions this week</p>
                <div className="flex gap-1 items-end">
                  {[5, 7, 4, 8, 6, 3, 7].map((h, i) => (
                    <div key={i} className="w-3.5 rounded-sm" style={{ height: `${h * 3}px`, background: i < 5 ? "linear-gradient(180deg, #2C5FC3 0%, #1B3E8F 100%)" : "rgba(255,255,255,0.08)" }} />
                  ))}
                </div>
                <p className="text-white/70 text-xs font-bold mt-1">5 / 7</p>
              </div>
            </motion.div>
          </div>

          {/* Bottom social proof */}
          <motion.div
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.55 }}
            className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <div className="flex -space-x-2.5">
              {["FA", "KO", "BN", "JA", "EM"].map((init, i) => (
                <div key={i} className="w-9 h-9 rounded-full border-2 flex items-center justify-center font-display font-bold text-white text-[10px]"
                  style={{ borderColor: "#07101f", background: i % 2 === 0 ? "linear-gradient(135deg,#1B3E8F,#2C5FC3)" : "linear-gradient(135deg,#E5197D,#C4006A)" }}>
                  {init}
                </div>
              ))}
            </div>
            <div>
              <div className="flex gap-0.5 mb-0.5">
                {Array.from({ length: 5 }, (_, i) => <Star key={i} size={11} className="text-yellow-400 fill-yellow-400" />)}
              </div>
              <p className="text-white/40 text-xs">Trusted by <span className="text-white font-semibold">500+</span> patients across Nigeria</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TRUST STRIP ────────────────────────────────────────────────── */}
      <section className="py-10 px-6 md:px-12 border-y border-white/[0.05]" style={{ background: "rgba(255,255,255,0.015)" }}>
        <p className="text-center text-white/25 text-[11px] uppercase tracking-[0.2em] mb-7">Trusted by clinics and hospitals across Nigeria</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 max-w-4xl mx-auto">
          {["LUTH", "National Orthopaedic", "PhysioAfrica", "HealthStack NG", "MedPlus"].map((name) => (
            <span key={name} className="text-white/18 text-sm font-display font-semibold tracking-wide hover:text-white/35 transition-colors duration-300 cursor-default">{name}</span>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        ref={stepsRef}
        className="relative py-28 px-6 md:px-12 lg:px-20 overflow-hidden"
        style={{ background: "linear-gradient(180deg, #07101f 0%, #091424 100%)" }}
      >
        <div className="absolute inset-0 opacity-[0.022] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.6) 1px,transparent 1px)", backgroundSize: "64px 64px" }} />

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" animate={stepsInView ? "visible" : "hidden"} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium text-pink-300 mb-4"
              style={{ background: "rgba(229,25,125,0.10)", border: "1px solid rgba(229,25,125,0.18)" }}>
              Simple Process
            </span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
              From sign-up to recovery{" "}
              <span style={{ color: "#FF6BB5" }}>in 3 steps</span>
            </h2>
            <p className="text-white/45 text-lg max-w-md mx-auto">No clinic visits. No waiting rooms. Expert care, on your schedule.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-14 left-[22%] right-[22%] h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(229,25,125,0.35), rgba(44,95,195,0.35), transparent)" }} />
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                variants={fadeUp} initial="hidden" animate={stepsInView ? "visible" : "hidden"} custom={i + 1}
                className="p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span className="font-display font-bold text-5xl leading-none block mb-4"
                  style={{ background: step.pink ? "linear-gradient(135deg,#E5197D,#C4006A)" : "linear-gradient(135deg,#2C5FC3,#1B3E8F)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  {step.num}
                </span>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: step.pink ? "rgba(229,25,125,0.12)" : "rgba(44,95,195,0.12)", border: `1px solid ${step.pink ? "rgba(229,25,125,0.25)" : "rgba(44,95,195,0.25)"}` }}>
                  <step.icon size={18} className={step.pink ? "text-pink-400" : "text-blue-400"} />
                </div>
                <h3 className="font-display font-semibold text-xl text-white mb-2">{step.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────── */}
      <section
        id="features"
        ref={featuresRef}
        className="relative py-28 px-6 md:px-12 lg:px-20 overflow-hidden"
        style={{ background: "linear-gradient(180deg, #091424 0%, #0b1730 100%)" }}
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.08] pointer-events-none"
          style={{ background: "radial-gradient(circle,#E5197D 0%,transparent 70%)", filter: "blur(90px)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.06] pointer-events-none"
          style={{ background: "radial-gradient(circle,#1B3E8F 0%,transparent 70%)", filter: "blur(90px)" }} />

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" animate={featuresInView ? "visible" : "hidden"} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium text-blue-300 mb-4"
              style={{ background: "rgba(44,95,195,0.10)", border: "1px solid rgba(44,95,195,0.18)" }}>
              Platform Features
            </span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
              Everything you need to{" "}
              <span style={{ color: "#93c5fd" }}>recover fully</span>
            </h2>
            <p className="text-white/45 text-lg max-w-md mx-auto">Powered by technology. Guided by certified experts.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp} initial="hidden" animate={featuresInView ? "visible" : "hidden"} custom={i}
                className="group p-6 rounded-2xl cursor-default transition-all duration-300 hover:-translate-y-1"
                style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(12px)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 60px ${f.glow}`;
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${f.color}35`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "";
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)";
                }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${f.color}18`, border: `1px solid ${f.color}35` }}>
                  <f.icon size={20} style={{ color: f.color === "#E5197D" ? "#f472b6" : "#93c5fd" }} />
                </div>
                <h3 className="font-display font-semibold text-white text-lg mb-2">{f.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────────────── */}
      <section
        ref={statsRef}
        className="relative py-28 px-6 md:px-12 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #060c1e 0%, #07101f 100%)" }}
      >
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(229,25,125,0.5),rgba(44,95,195,0.5),transparent)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(44,95,195,0.5),rgba(229,25,125,0.5),transparent)" }} />

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" animate={statsInView ? "visible" : "hidden"} className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
              Results that{" "}
              <span style={{ background: "linear-gradient(135deg,#FF6BB5,#E5197D)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>speak</span>
            </h2>
            <p className="text-white/45 text-lg">Real outcomes from real patients across Nigeria.</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16">
            {stats.map((s) => <StatCounter key={s.label} {...s} />)}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────────────── */}
      <section
        id="testimonials"
        ref={testimonialsRef}
        className="relative py-28 px-6 md:px-12 lg:px-20 overflow-hidden"
        style={{ background: "linear-gradient(180deg, #07101f 0%, #091424 100%)" }}
      >
        <div className="absolute top-20 left-[8%] w-72 h-72 rounded-full opacity-[0.12] pointer-events-none"
          style={{ background: "radial-gradient(circle,#1B3E8F 0%,transparent 70%)", filter: "blur(70px)" }} />
        <div className="absolute bottom-20 right-[8%] w-72 h-72 rounded-full opacity-[0.10] pointer-events-none"
          style={{ background: "radial-gradient(circle,#E5197D 0%,transparent 70%)", filter: "blur(70px)" }} />

        <div className="relative z-10 max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" animate={testimonialsInView ? "visible" : "hidden"} className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium text-pink-300 mb-4"
              style={{ background: "rgba(229,25,125,0.10)", border: "1px solid rgba(229,25,125,0.18)" }}>
              Patient Stories
            </span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
              Lives <span style={{ color: "#FF6BB5" }}>transformed</span>
            </h2>
            <p className="text-white/45 text-lg">Hear from real patients and physiotherapists.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                variants={fadeUp} initial="hidden" animate={testimonialsInView ? "visible" : "hidden"} custom={i}
                className="p-6 rounded-2xl flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }, (_, j) => <Star key={j} size={13} className="text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-white/60 text-sm leading-relaxed flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-white/[0.05]">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-white text-xs flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${t.color} 0%, ${t.color}99 100%)` }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-white/35 text-xs">{t.role} · {t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────────────── */}
      <section
        id="pricing"
        className="relative py-28 px-6 md:px-12 lg:px-20 overflow-hidden"
        style={{ background: "linear-gradient(180deg, #060c1e 0%, #091424 100%)" }}
      >
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg,transparent,rgba(229,25,125,0.4),rgba(44,95,195,0.4),transparent)" }} />
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium text-pink-300 mb-4"
              style={{ background: "rgba(229,25,125,0.10)", border: "1px solid rgba(229,25,125,0.18)" }}>
              Pricing
            </span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
              Simple, affordable <span style={{ color: "#FF6BB5" }}>pricing</span>
            </h2>
            <p className="text-white/45 text-lg max-w-md mx-auto">Start free. Upgrade when you're ready for the full experience.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Basic */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={0}
              className="rounded-2xl p-8 flex flex-col"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">Basic</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-display font-bold text-4xl text-white">₦3,500</span>
                <span className="text-white/40 text-sm">/month</span>
              </div>
              <p className="text-white/35 text-xs mb-6">General exercise library access</p>
              <ul className="space-y-3 mb-8 flex-1">
                {["Access to general exercise library", "1 session reminder", "Basic progress tracking", "50 coins per session"].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-white/55">
                    <Check size={14} className="text-white/40 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/register/client"
                className="block text-center py-3 rounded-xl text-sm font-semibold text-white/70 transition-all hover:text-white"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
              >
                Get Started
              </Link>
            </motion.div>

            {/* Standard */}
            <motion.div
              variants={fadeUp} initial="hidden" animate="visible" custom={1}
              className="rounded-2xl p-8 flex flex-col relative"
              style={{ background: "linear-gradient(145deg, rgba(44,95,195,0.18) 0%, rgba(229,25,125,0.12) 100%)", border: "1px solid rgba(229,25,125,0.28)", boxShadow: "0 0 60px rgba(229,25,125,0.12)" }}
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white"
                style={{ background: "linear-gradient(135deg,#E5197D,#C4006A)" }}>
                Most Popular
              </div>
              <p className="font-semibold text-xs uppercase tracking-widest mb-3" style={{ color: "#FF6BB5" }}>Standard</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="font-display font-bold text-4xl text-white">₦2,000</span>
                <span className="text-white/40 text-sm">/month</span>
              </div>
              <p className="text-white/35 text-xs mb-6">Full AI-powered recovery experience</p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Everything in Basic",
                  "Personalised PT exercise plan",
                  "Unlimited PT messaging + file sharing",
                  "Real-time AI motion tracking",
                  "Full progress analytics",
                  "200 coins per session",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-white/70">
                    <Check size={14} className="flex-shrink-0 mt-0.5" style={{ color: "#FF6BB5" }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/register/client"
                className="block text-center py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:scale-[1.02]"
                style={{ background: "linear-gradient(135deg,#E5197D,#C4006A)", boxShadow: "0 8px 28px rgba(229,25,125,0.35)" }}
              >
                Get Started — ₦2,000/mo
              </Link>
            </motion.div>
          </div>

          <p className="text-center text-white/30 text-sm mt-8">7-day free trial · Cancel anytime · Secure payment via Paystack</p>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────── */}
      <section
        id="faq"
        className="relative py-28 px-6 md:px-12 overflow-hidden"
        style={{ background: "linear-gradient(180deg, #091424 0%, #07101f 100%)" }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium text-blue-300 mb-4"
              style={{ background: "rgba(44,95,195,0.10)", border: "1px solid rgba(44,95,195,0.18)" }}>
              FAQ
            </span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
              Got <span style={{ color: "#93c5fd" }}>questions?</span>
            </h2>
            <p className="text-white/45 text-lg">Everything you need to know before you begin.</p>
          </div>
          <div className="flex flex-col gap-3">
            {faqs.map((faq) => <FAQItem key={faq.q} {...faq} />)}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section ref={ctaRef} className="relative py-20 px-6 md:px-12">
        <motion.div
          variants={fadeUp} initial="hidden" animate={ctaInView ? "visible" : "hidden"}
          className="max-w-4xl mx-auto relative rounded-3xl p-12 md:p-16 text-center overflow-hidden"
          style={{ background: "linear-gradient(135deg, #0F2557 0%, #1B3E8F 45%, #E5197D 100%)", boxShadow: "0 40px 100px rgba(229,25,125,0.22), 0 0 0 1px rgba(255,255,255,0.07)" }}
        >
          <div className="absolute inset-0 opacity-25 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 85% 55% at 50% 0%, rgba(255,255,255,0.18), transparent)" }} />
          <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{ backgroundImage: "radial-gradient(circle,#ffffff 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
          <div className="relative z-10">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium text-white/75 mb-6"
              style={{ background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.18)" }}>
              Ready to heal?
            </span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4 leading-tight">
              Your recovery journey<br />starts today.
            </h2>
            <p className="text-white/65 text-lg mb-10 max-w-lg mx-auto">
              Join thousands of Nigerians recovering smarter with AI-guided physiotherapy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register/client"
                className="group flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-base transition-all duration-300 hover:scale-[1.03]"
                style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.28)", backdropFilter: "blur(12px)", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}
              >
                Register as Patient
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/register/physiotherapist"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white/75 text-base transition-all duration-300 hover:text-white hover:bg-white/10"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)" }}
              >
                Register as PT
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.05] px-6 md:px-12 py-14" style={{ background: "#060c1d" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/logo-icon.png" alt="ReHboX" className="w-9 h-9 object-contain" />
              <span className="font-display font-bold text-lg text-white">ReHboX</span>
            </div>
            <p className="text-white/35 text-sm leading-relaxed max-w-xs">
              Nigeria's leading digital physiotherapy platform. AI-powered. Expert-guided. Accessible everywhere.
            </p>
          </div>
          <div>
            <p className="text-white/40 text-[11px] uppercase tracking-[0.15em] mb-4">Product</p>
            <ul className="flex flex-col gap-2.5">
              {["Features", "How It Works", "Pricing", "For Physiotherapists"].map((item) => (
                <li key={item}><span className="text-white/35 text-sm hover:text-white/60 transition-colors cursor-default">{item}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-white/40 text-[11px] uppercase tracking-[0.15em] mb-4">Legal</p>
            <ul className="flex flex-col gap-2.5">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "Contact Us"].map((item) => (
                <li key={item}><span className="text-white/35 text-sm hover:text-white/60 transition-colors cursor-default">{item}</span></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/[0.05] pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/25 text-xs">© 2026 ReHboX Health Technologies. All rights reserved.</p>
          <p className="text-white/18 text-xs">Built with care for Nigeria</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
