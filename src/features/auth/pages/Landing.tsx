import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight, Activity, Shield, Award, Users, CheckCircle,
  Brain, Star, Zap, Crown, Flame, Play, BarChart2, MessageSquare,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const features = [
  { icon: Activity,      title: "Real-Time Motion Tracking",  desc: "AI-powered pose analysis gives instant feedback during every exercise session." },
  { icon: Shield,        title: "Expert-Led Plans",           desc: "Personalised rehabilitation plans built by certified Nigerian physiotherapists." },
  { icon: Award,         title: "Earn as You Recover",        desc: "Collect coins for every completed session and redeem them for real rewards." },
  { icon: Users,         title: "Direct PT Messaging",        desc: "Chat with your physio anytime — no appointment needed, no waiting room." },
  { icon: Brain,         title: "AI Posture Analysis",        desc: "MediaPipe-powered detection ensures correct form and prevents re-injury." },
  { icon: BarChart2,     title: "Progress Analytics",         desc: "Detailed compliance, pain reduction, and recovery trend reports over time." },
];

const pricingPlans = [
  {
    name: "Basic", price: 3_500, icon: Zap, popular: false,
    features: ["Exercise library access", "5 PT messages/day", "Basic tracking", "50 coins/session"],
  },
  {
    name: "Standard", price: 7_500, icon: Crown, popular: true,
    features: ["Everything in Basic", "Unlimited PT messaging", "Full motion tracking", "Advanced analytics", "200 coins/session"],
  },
  {
    name: "Premium", price: 15_000, icon: Award, popular: false,
    features: ["Everything in Standard", "Priority PT matching", "Video consultations", "Family accounts", "500 coins/session"],
  },
];

const testimonials = [
  { name: "Amara O.",    role: "Patient · Lagos",    quote: "ReHboX changed my recovery journey. The motion tracking keeps me truly accountable!" },
  { name: "Dr. Bola A.", role: "Physiotherapist",    quote: "I monitor my clients remotely with detailed analytics. It's a game changer for my practice." },
  { name: "Emeka E.",    role: "Patient · Abuja",    quote: "The coin rewards keep me motivated. I've never been this consistent with my exercises." },
];

// ─────────────────────────────────────────────────────────────────────────────
// Scroll-triggered reveal wrapper
// ─────────────────────────────────────────────────────────────────────────────
const Reveal = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// App Preview Card — sits in hero right column (desktop)
// ─────────────────────────────────────────────────────────────────────────────
const AppPreviewCard = () => (
  <motion.div
    initial={{ opacity: 0, x: 40, y: 20 }}
    animate={{ opacity: 1, x: 0,  y: 0 }}
    transition={{ duration: 0.7, delay: 0.45, ease: "easeOut" }}
    className="hidden lg:block w-[320px] flex-shrink-0"
  >
    {/* Phone-shaped container */}
    <div
      className="rounded-3xl border border-white/20 p-4 relative overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(20px)",
        boxShadow: "0 32px 80px rgba(15,37,87,0.6), 0 0 0 1px rgba(255,255,255,0.1)",
      }}
    >
      {/* Status bar */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-white/50 text-[10px] font-mono">09:41</span>
        <div className="flex gap-1">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-white/40" />
          ))}
        </div>
      </div>

      {/* Greeting card */}
      <div
        className="rounded-2xl p-4 mb-3 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1B3E8F 0%, #2C5FC3 100%)" }}
      >
        <div
          className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #E5197D, transparent)" }}
        />
        <p className="text-white/60 text-[10px] mb-0.5">Good morning 👋</p>
        <p className="text-white font-display font-bold text-sm">Amara O.</p>
        <p className="text-white/70 text-[10px] mt-1">3-day streak 🔥 Keep going!</p>
        <div className="mt-3 flex items-center gap-2 bg-white/15 rounded-xl px-3 py-2 w-fit">
          <Play size={10} className="text-white" fill="white" />
          <span className="text-white text-[10px] font-bold">Start Session</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: "Sessions", value: "12" },
          { label: "Form", value: "87%" },
          { label: "Coins", value: "340" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-2.5 text-center"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p className="text-white font-display font-bold text-sm">{s.value}</p>
            <p className="text-white/50 text-[9px] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Exercise list */}
      <p className="text-white/60 text-[10px] font-semibold uppercase tracking-wider mb-2 px-1">
        Today's Plan
      </p>
      {[
        { name: "Knee Extension", sets: "3 × 15" },
        { name: "Hip Flexor Stretch", sets: "2 × 30s" },
      ].map((ex) => (
        <div
          key={ex.name}
          className="flex items-center gap-3 rounded-xl p-2.5 mb-1.5"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #E5197D, #C4006A)" }}
          >
            <Activity size={12} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[10px] font-semibold truncate">{ex.name}</p>
            <p className="text-white/50 text-[9px]">{ex.sets}</p>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
        </div>
      ))}

      {/* Chat snippet */}
      <div
        className="mt-3 rounded-xl p-2.5 flex items-start gap-2"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <MessageSquare size={12} className="text-white/50 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-white/50 text-[9px] font-medium mb-0.5">Dr. Bola A. · Just now</p>
          <p className="text-white text-[10px]">"Great session today! Keep it up 💪"</p>
        </div>
      </div>
    </div>

    {/* Floating badge */}
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="absolute -bottom-4 -left-6 rounded-2xl px-4 py-3 flex items-center gap-2.5"
      style={{
        background: "rgba(255,255,255,0.12)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255,255,255,0.2)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center flex-shrink-0">
        <Star size={14} className="text-white fill-white" />
      </div>
      <div>
        <p className="text-white text-[11px] font-bold">87% Form Score</p>
        <p className="text-white/60 text-[9px]">Personal best!</p>
      </div>
    </motion.div>
  </motion.div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main Landing Component
// ─────────────────────────────────────────────────────────────────────────────
const Landing = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#F4F7FF" }}>

      {/* ── NAVBAR ─────────────────────────────────────────────────────────── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(15, 37, 87, 0.97)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #1B3E8F 0%, #2C5FC3 100%)",
                boxShadow: "0 4px 16px rgba(27,62,143,0.5)",
              }}
            >
              <span className="text-white font-display font-bold text-sm">Rx</span>
            </div>
            <span className="font-display font-bold text-xl text-white">
              ReH<span style={{ color: "#E5197D" }}>bo</span>X
            </span>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:inline-flex items-center text-sm font-semibold text-white/80 hover:text-white transition-colors px-4 py-2 rounded-xl border border-white/20 hover:border-white/40 hover:bg-white/5"
            >
              Sign In
            </Link>
            <Link
              to="/register/client"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-white px-5 py-2.5 rounded-xl transition-opacity hover:opacity-90"
              style={{
                background: "#E5197D",
                boxShadow: "0 8px 24px rgba(229,25,125,0.4)",
              }}
            >
              Get Started <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: "linear-gradient(145deg, #0F2557 0%, #1B3E8F 55%, #2C5FC3 100%)" }}
      >
        {/* Dot-pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            opacity: 0.4,
          }}
        />

        {/* Blurred orbs */}
        <div
          className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(229,25,125,0.18) 0%, transparent 65%)" }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(44,95,195,0.25) 0%, transparent 65%)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(27,62,143,0.15) 0%, transparent 70%)" }}
        />

        {/* Content */}
        <div className="relative max-w-6xl mx-auto px-6 md:px-12 pt-24 pb-20 w-full">
          <div className="flex items-center gap-16">

            {/* Left column */}
            <div className="flex-1 min-w-0">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 mb-7 px-4 py-2 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white/80 text-sm font-medium">
                  Nigeria's #1 Digital Physiotherapy Platform
                </span>
                <Flame size={13} className="text-orange-400" />
              </motion.div>

              {/* Headline — pure white, no gradient */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="font-display font-bold text-5xl md:text-7xl text-white leading-[1.06] tracking-tight mb-6"
              >
                Recover Smarter,<br />
                Move Better.
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-white/70 text-lg md:text-xl leading-relaxed mb-10 max-w-lg"
              >
                Connect with certified physiotherapists, follow AI-guided exercise plans,
                and track every step of your recovery — from home.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 mb-14"
              >
                <Link
                  to="/register/client"
                  className="inline-flex items-center justify-center gap-2.5 font-bold px-8 py-4 rounded-2xl text-white text-base transition-opacity hover:opacity-90"
                  style={{
                    background: "#E5197D",
                    boxShadow: "0 8px 32px rgba(229,25,125,0.4)",
                  }}
                >
                  I'm a Patient <ArrowRight size={18} />
                </Link>
                <Link
                  to="/register/physio"
                  className="inline-flex items-center justify-center gap-2.5 font-bold px-8 py-4 rounded-2xl text-white text-base transition-colors hover:bg-white/10"
                  style={{ border: "2px solid rgba(255,255,255,0.35)" }}
                >
                  I'm a Physiotherapist
                </Link>
              </motion.div>

              {/* Trust stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-center gap-10"
              >
                {[["500+", "Patients"], ["80+", "Certified PTs"], ["95%", "Recovery Rate"]].map(([val, label]) => (
                  <div key={label}>
                    <p className="font-display font-bold text-3xl text-white">{val}</p>
                    <p className="text-white/50 text-sm mt-0.5">{label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right column — app preview */}
            <div className="relative">
              <AppPreviewCard />
            </div>

          </div>
        </div>

        {/* Wave bottom edge */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#F4F7FF" />
          </svg>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-24" style={{ background: "#F4F7FF" }}>
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1.5 rounded-full"
              style={{ color: "#E5197D", background: "rgba(229,25,125,0.08)" }}
            >
              Platform Features
            </span>
            <h2
              className="font-display font-bold text-3xl md:text-4xl mb-4"
              style={{ color: "#0F2557" }}
            >
              Everything you need to recover
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              Powered by artificial intelligence, guided by certified experts.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.06}>
                <motion.div
                  className="bg-white rounded-2xl p-6 flex items-start gap-4 group cursor-default"
                  style={{
                    border: "1px solid #dbeafe",
                    boxShadow: "0 2px 16px rgba(27,62,143,0.08)",
                  }}
                  whileHover={{
                    y: -4,
                    boxShadow: "0 12px 40px rgba(27,62,143,0.15)",
                    borderColor: "rgba(27,62,143,0.25)",
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #1B3E8F 0%, #2C5FC3 100%)",
                      boxShadow: "0 4px 16px rgba(27,62,143,0.35)",
                    }}
                  >
                    <f.icon size={20} className="text-white" />
                  </div>
                  <div>
                    <h3
                      className="font-display font-semibold text-base mb-1.5 group-hover:text-primary transition-colors"
                      style={{ color: "#0F2557" }}
                    >
                      {f.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-24 bg-white">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-16">
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1.5 rounded-full"
              style={{ color: "#E5197D", background: "rgba(229,25,125,0.08)" }}
            >
              Pricing
            </span>
            <h2
              className="font-display font-bold text-3xl md:text-4xl mb-4"
              style={{ color: "#0F2557" }}
            >
              Simple, transparent pricing
            </h2>
            <p className="text-gray-500 text-base max-w-lg mx-auto">
              Choose the plan that fits your recovery journey. Cancel anytime.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {pricingPlans.map((plan, i) => {
              const isPopular = plan.popular;
              return (
                <Reveal key={plan.name} delay={i * 0.08}>
                  <motion.div
                    className={`relative rounded-2xl p-7 overflow-hidden ${isPopular ? "md:-mt-4 md:-mb-4" : ""}`}
                    style={
                      isPopular
                        ? {
                            background: "linear-gradient(145deg, #1B3E8F 0%, #2C5FC3 100%)",
                            boxShadow: "0 20px 60px rgba(27,62,143,0.35)",
                            border: "none",
                          }
                        : {
                            background: "#fff",
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 2px 16px rgba(27,62,143,0.06)",
                          }
                    }
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.08 }}
                    whileHover={{ y: isPopular ? -2 : -4 }}
                  >
                    {/* Decorative orb on popular */}
                    {isPopular && (
                      <div
                        className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none"
                        style={{ background: "radial-gradient(circle, rgba(229,25,125,0.25), transparent)" }}
                      />
                    )}

                    {/* Most Popular badge */}
                    {isPopular && (
                      <div className="absolute -top-0 right-6">
                        <span
                          className="inline-block font-bold text-xs text-white px-4 py-1.5 rounded-b-xl"
                          style={{
                            background: "#E5197D",
                            boxShadow: "0 4px 16px rgba(229,25,125,0.4)",
                          }}
                        >
                          Most Popular
                        </span>
                      </div>
                    )}

                    {/* Plan icon + name */}
                    <div className="flex items-center gap-3 mb-5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={
                          isPopular
                            ? { background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }
                            : { background: "#EEF2FF" }
                        }
                      >
                        <plan.icon size={18} className={isPopular ? "text-white" : "text-primary"} style={isPopular ? {} : { color: "#1B3E8F" }} />
                      </div>
                      <h3
                        className="font-display font-bold text-xl"
                        style={{ color: isPopular ? "#fff" : "#0F2557" }}
                      >
                        {plan.name}
                      </h3>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-1 mb-6">
                      <span
                        className="font-display font-bold text-4xl"
                        style={{ color: isPopular ? "#fff" : "#0F2557" }}
                      >
                        ₦{plan.price.toLocaleString()}
                      </span>
                      <span
                        className="text-sm"
                        style={{ color: isPopular ? "rgba(255,255,255,0.6)" : "#9ca3af" }}
                      >
                        /month
                      </span>
                    </div>

                    {/* Features */}
                    <ul className="space-y-2.5 mb-8">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex items-center gap-2.5 text-sm">
                          <CheckCircle
                            size={15}
                            style={{ color: isPopular ? "#86efac" : "#22C55E", flexShrink: 0 }}
                          />
                          <span style={{ color: isPopular ? "rgba(255,255,255,0.85)" : "#374151" }}>
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Link
                      to="/register/client"
                      className="flex items-center justify-center gap-2 w-full font-bold py-3.5 rounded-xl transition-all hover:opacity-90"
                      style={
                        isPopular
                          ? {
                              background: "#E5197D",
                              color: "#fff",
                              boxShadow: "0 8px 24px rgba(229,25,125,0.45)",
                            }
                          : {
                              border: "2px solid #1B3E8F",
                              color: "#1B3E8F",
                              background: "transparent",
                            }
                      }
                    >
                      Get Started
                    </Link>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-24" style={{ background: "#F4F7FF" }}>
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-14">
            <span
              className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1.5 rounded-full"
              style={{ color: "#E5197D", background: "rgba(229,25,125,0.08)" }}
            >
              Testimonials
            </span>
            <h2
              className="font-display font-bold text-3xl md:text-4xl mb-3"
              style={{ color: "#0F2557" }}
            >
              Loved by patients &amp; PTs
            </h2>
            <p className="text-gray-500 text-base">Hear from people who are recovering smarter.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 0.07}>
                <motion.div
                  className="bg-white rounded-2xl p-6 h-full flex flex-col"
                  style={{
                    border: "1px solid #dbeafe",
                    boxShadow: "0 2px 16px rgba(27,62,143,0.07)",
                  }}
                  whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(27,62,143,0.14)" }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={14} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed flex-1 italic mb-5">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{
                        background: "linear-gradient(135deg, #1B3E8F 0%, #2C5FC3 100%)",
                        boxShadow: "0 4px 12px rgba(27,62,143,0.35)",
                      }}
                    >
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: "#0F2557" }}>{t.name}</p>
                      <p className="text-xs text-gray-400">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA BANNER ───────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-20 bg-white">
        <Reveal>
          <div
            className="max-w-3xl mx-auto rounded-3xl p-12 text-center relative overflow-hidden"
            style={{ background: "linear-gradient(145deg, #0F2557 0%, #1B3E8F 60%, #2C5FC3 100%)" }}
          >
            <div
              className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(229,25,125,0.2), transparent)" }}
            />
            <div
              className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(44,95,195,0.3), transparent)" }}
            />
            <div className="relative">
              <span
                className="inline-flex items-center gap-1.5 mb-5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                <Flame size={11} className="text-orange-400" /> Start your recovery today
              </span>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4 leading-tight">
                Ready to start healing?
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-lg mx-auto">
                Join thousands of Nigerians recovering smarter with ReHboX.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register/client"
                  className="inline-flex items-center justify-center gap-2 font-bold px-8 py-4 rounded-xl text-white hover:opacity-90 transition-opacity"
                  style={{ background: "#E5197D", boxShadow: "0 8px 32px rgba(229,25,125,0.4)" }}
                >
                  Register as Patient <ArrowRight size={16} />
                </Link>
                <Link
                  to="/register/physio"
                  className="inline-flex items-center justify-center gap-2 font-semibold px-8 py-4 rounded-xl text-white hover:bg-white/15 transition-colors"
                  style={{ border: "2px solid rgba(255,255,255,0.3)" }}
                >
                  Register as PT
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <footer
        style={{
          background: "#0F2557",
          borderTop: "2px solid rgba(229,25,125,0.25)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #1B3E8F 0%, #2C5FC3 100%)" }}
            >
              <span className="text-white font-display font-bold text-xs">Rx</span>
            </div>
            <span className="font-display font-bold text-white">
              ReH<span style={{ color: "#E5197D" }}>bo</span>X
            </span>
          </div>

          {/* Links */}
          <div className="flex gap-6">
            {["About", "Privacy", "Terms", "Contact"].map((l) => (
              <a
                key={l}
                href="#"
                className="text-sm transition-colors"
                style={{ color: "rgba(255,255,255,0.55)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
              >
                {l}
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
            © 2025 ReHboX · Built for Nigeria 🇳🇬
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
