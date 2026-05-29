import { useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowRight, Activity, Shield, Award, Users, CheckCircle,
  Brain, Star, Zap, Crown, BarChart2,
  Smartphone, Video, TrendingUp,
} from "lucide-react";
import {
  Eyebrow, SectionHeading, GradientText, MonogramAvatar,
} from "@/features/auth/components/public/primitives";
import {
  revealOnScroll, prefersReducedMotion,
} from "@/features/auth/components/public/useReveal";
import Hero from "@/features/auth/components/public/Hero";

// ── Data ─────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: Activity,
    title: "Real-Time Motion Tracking",
    desc: "AI-powered pose analysis gives instant feedback during every exercise session. Know if your form is correct before you finish the rep.",
  },
  {
    icon: Shield,
    title: "Expert-Led Plans",
    desc: "Personalised rehabilitation plans built and monitored by certified Nigerian physiotherapists — tailored to your exact diagnosis.",
  },
  {
    icon: Award,
    title: "Earn as You Recover",
    desc: "Collect coins for every completed session. Redeem them in the ReHboX shop for health products and premium features.",
  },
  {
    icon: Users,
    title: "Direct PT Messaging",
    desc: "Chat with your physio anytime — send progress photos, ask questions, and get replies without booking another appointment.",
  },
  {
    icon: Brain,
    title: "AI Posture Analysis",
    desc: "MediaPipe skeleton detection overlays your live camera feed so you can see exactly how your body is moving in real time.",
  },
  {
    icon: BarChart2,
    title: "Progress Analytics",
    desc: "Detailed compliance rates, pain reduction trends, and ROM improvement charts — for both patients and their physiotherapists.",
  },
];

const howItWorks = [
  {
    step: "01",
    icon: Smartphone,
    title: "Sign up & get matched",
    desc: "Create your account as a patient or PT. Patients are matched with a certified physiotherapist based on their condition.",
  },
  {
    step: "02",
    icon: Video,
    title: "Follow your personalised plan",
    desc: "Your PT builds an exercise plan in minutes. Follow step-by-step video guides with live AI tracking — from home.",
  },
  {
    step: "03",
    icon: TrendingUp,
    title: "Track progress & recover",
    desc: "Every session is logged. Your PT reviews your data, adjusts the plan, and you both celebrate your recovery milestones.",
  },
];

const pricingPlans = [
  {
    name: "Free", price: 0, icon: Zap, popular: false, isEnterprise: false,
    features: ["Access to general exercises", "Basic progress tracking", "Coin rewards system"],
  },
  {
    name: "Standard", price: 2_000, icon: Crown, popular: true, isEnterprise: false,
    features: ["Personalised PT exercise plan", "Chat with your PT (text + files)", "MediaPipe motion tracking", "Coin rewards & shop", "Progress analytics"],
  },
  {
    name: "Enterprise", price: 0, icon: Award, popular: false, isEnterprise: true,
    features: ["Everything in Standard", "Multiple PT accounts under one clinic", "Clinic-wide analytics dashboard", "Priority support"],
  },
];

const testimonials = [
  {
    name: "Amara O.",
    role: "Patient · Lagos",
    quote: "ReHboX changed my recovery journey. The motion tracking keeps me truly accountable. My knee is 80% better after just 6 weeks!",
  },
  {
    name: "Dr. Bola A.",
    role: "Physiotherapist · Abuja",
    quote: "I monitor all 23 of my clients remotely with detailed analytics. I can see their form, compliance, and pain scores without them coming in.",
  },
  {
    name: "Emeka E.",
    role: "Patient · Port Harcourt",
    quote: "The coin rewards keep me motivated. I've never been this consistent with physio in my life — and my back pain is finally gone.",
  },
];

// ── Main ─────────────────────────────────────────────────────────────────────

const Landing = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const scope = containerRef.current;
    if (!scope) return;
    revealOnScroll(scope);
    revealOnScroll(scope, ".feature-card", { stagger: 0.07 });
    revealOnScroll(scope, ".how-step", { stagger: 0.12 });
    revealOnScroll(scope, ".pricing-card", { stagger: 0.09 });
    revealOnScroll(scope, ".testimonial-card", { stagger: 0.08 });
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <Hero />

      {/* ── TRUST STRIP ──────────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-14" style={{ background: "var(--pub-card-light)" }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-[11px] font-mono uppercase tracking-[0.18em] mb-8" style={{ color: "var(--pub-ink-mute)" }}>
            Trusted by patients and clinics across Nigeria
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {[
              { stat: "500+", label: "Active patients" },
              { stat: "80+", label: "Certified PTs" },
              { stat: "113", label: "Exercise videos" },
              { stat: "4.9★", label: "Average rating" },
            ].map((item) => (
              <div key={item.stat} className="text-center reveal">
                <p className="font-display font-bold text-2xl md:text-3xl" style={{ color: "var(--pub-blue-ink)" }}>{item.stat}</p>
                <p className="text-sm mt-1" style={{ color: "var(--pub-ink-mute)" }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-24" style={{ background: "var(--pub-ivory)" }}>
        <div className="max-w-6xl mx-auto">
          <SectionHeading
            tone="light"
            eyebrow="Platform Features"
            title="Everything you need to recover"
            subtitle="Powered by artificial intelligence and guided by certified experts — all from your phone."
          />
          <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="feature-card rounded-3xl p-7 transition-transform duration-300 hover:-translate-y-1.5"
                style={{ background: "var(--pub-card-light)", border: "1px solid var(--pub-border-light)", boxShadow: "0 8px 30px rgba(10,20,48,0.06)" }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{ background: "var(--pub-grad-accent)" }}>
                  <f.icon size={22} className="text-white" />
                </div>
                <h3 className="font-display font-bold text-lg mb-2" style={{ color: "var(--pub-ink-text)" }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--pub-ink-mute)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="px-6 md:px-12 py-24" style={{ background: "var(--pub-canvas-dark)" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="reveal">
            <img
              src="/exercise-pose.jpg"
              alt="Patient performing a guided exercise with live AI pose overlay"
              className="w-full rounded-3xl object-cover"
              style={{ border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 30px 60px rgba(0,0,0,0.4)" }}
            />
          </div>
          <div>
            <div className="mb-10">
              <div className="mb-4"><Eyebrow tone="dark">How it works</Eyebrow></div>
              <h2 className="font-display font-bold text-3xl md:text-5xl text-white tracking-tight">
                Three steps to <GradientText>healing</GradientText>
              </h2>
            </div>
            <div className="space-y-8">
              {howItWorks.map((step) => (
                <div key={step.step} className="how-step flex gap-5">
                  <span className="pub-gradient-text font-display font-bold text-3xl md:text-4xl leading-none flex-shrink-0">{step.step}</span>
                  <div>
                    <h3 className="font-display font-bold text-lg text-white mb-1.5">{step.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#9FB2D8" }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="px-6 md:px-12 py-24" style={{ background: "var(--pub-ivory)" }}>
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            tone="light"
            eyebrow="Pricing"
            title="Simple, transparent pricing"
            subtitle="Choose the plan that fits your recovery journey. No hidden fees. Cancel anytime."
          />
          <div className="pricing-grid grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {pricingPlans.map((plan) => {
              const isPopular = plan.popular;
              return (
                <div
                  key={plan.name}
                  className={`pricing-card relative rounded-3xl p-8 transition-transform duration-300 hover:-translate-y-1.5 ${isPopular ? "md:-mt-4" : ""}`}
                  style={{
                    background: "var(--pub-card-light)",
                    border: isPopular ? "1.5px solid var(--pub-blue-ink)" : "1px solid var(--pub-border-light)",
                    boxShadow: isPopular ? "0 20px 50px rgba(46,91,186,0.18)" : "0 8px 30px rgba(10,20,48,0.06)",
                  }}
                >
                  {isPopular && (
                    <div className="absolute top-0 right-6 -translate-y-1/2">
                      <span
                        className="inline-block font-bold text-xs text-white px-4 py-1.5 rounded-full"
                        style={{ background: "var(--pub-grad-magenta)", boxShadow: "0 6px 18px rgba(224,71,155,0.4)" }}
                      >
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: isPopular ? "var(--pub-grad-accent)" : "rgba(46,91,186,0.1)" }}>
                      <plan.icon size={20} style={{ color: isPopular ? "#fff" : "var(--pub-blue-ink)" }} />
                    </div>
                    <h3 className="font-display font-bold text-xl" style={{ color: "var(--pub-ink-text)" }}>{plan.name}</h3>
                  </div>
                  <div className="flex items-baseline gap-1 mb-8">
                    {plan.isEnterprise
                      ? <span className="font-display font-bold text-3xl" style={{ color: "var(--pub-ink-text)" }}>Contact us</span>
                      : plan.price === 0
                        ? <span className="font-display font-bold text-4xl" style={{ color: "var(--pub-ink-text)" }}>Free</span>
                        : <>
                            <span className="font-display font-bold text-4xl" style={{ color: "var(--pub-ink-text)" }}>₦{plan.price.toLocaleString()}</span>
                            <span className="text-sm" style={{ color: "var(--pub-ink-mute)" }}>/month</span>
                          </>
                    }
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-sm">
                        <CheckCircle size={15} style={{ color: "#22C55E", flexShrink: 0, marginTop: 1 }} />
                        <span style={{ color: "var(--pub-ink-text)" }}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                  {plan.isEnterprise
                    ? <a
                        href="mailto:hello@rehbox.health?subject=Enterprise%20Enquiry"
                        className="flex items-center justify-center w-full font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity"
                        style={{ border: "2px solid var(--pub-blue-ink)", color: "var(--pub-blue-ink)" }}
                      >
                        Contact Sales
                      </a>
                    : <Link
                        to="/register/client"
                        className="flex items-center justify-center w-full font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity"
                        style={isPopular
                          ? { background: "var(--pub-grad-magenta)", color: "#fff", boxShadow: "0 10px 28px rgba(224,71,155,0.4)" }
                          : { border: "2px solid var(--pub-blue-ink)", color: "var(--pub-blue-ink)" }}
                      >
                        Get Started
                      </Link>
                  }
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-24" style={{ background: "var(--pub-card-light)" }}>
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            tone="light"
            eyebrow="Testimonials"
            title="Loved by patients & PTs"
            subtitle="Hear from people who are recovering smarter."
          />
          <div className="testimonials-grid grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className="testimonial-card rounded-3xl p-7 flex flex-col"
                style={{ background: "var(--pub-ivory)", border: "1px solid var(--pub-border-light)", boxShadow: "0 8px 30px rgba(10,20,48,0.06)" }}
              >
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, j) => <Star key={j} size={15} style={{ color: "#F59E0B", fill: "#F59E0B" }} />)}
                </div>
                <p className="text-sm leading-relaxed flex-1 mb-6" style={{ color: "var(--pub-ink-text)" }}>"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-4" style={{ borderTop: "1px solid var(--pub-border-light)" }}>
                  <div style={{ width: 40, flexShrink: 0 }}>
                    <MonogramAvatar name={t.name} idx={i} size={40} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "var(--pub-ink-text)" }}>{t.name}</p>
                    <p className="text-xs" style={{ color: "var(--pub-ink-mute)" }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-24" style={{ background: "var(--pub-ink-base)" }}>
        <div
          className="reveal max-w-4xl mx-auto rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(120deg,#1a1030,#0c1830)", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(224,71,155,0.22), transparent 70%)" }} />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(38,198,218,0.16), transparent 70%)" }} />
          <div className="relative">
            <h2 className="font-display font-bold text-3xl md:text-5xl text-white mb-5 leading-tight">
              Ready to start <GradientText>healing?</GradientText>
            </h2>
            <p className="text-lg mb-10 max-w-lg mx-auto" style={{ color: "#9FB2D8" }}>
              Join thousands of Nigerians recovering smarter with ReHboX — free to start, no credit card needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register/client"
                className="inline-flex items-center justify-center gap-2 font-bold px-10 py-4 rounded-2xl text-white hover:opacity-90 transition-opacity"
                style={{ background: "var(--pub-grad-magenta)", boxShadow: "0 12px 32px rgba(224,71,155,0.4)" }}
              >
                Register as Patient <ArrowRight size={16} />
              </Link>
              <Link
                to="/register/physio"
                className="inline-flex items-center justify-center gap-2 font-semibold px-10 py-4 rounded-2xl text-white hover:bg-white/10 transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.3)" }}
              >
                Register as PT
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
