import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Mail, MapPin, Clock, Phone, Send, ChevronDown } from "lucide-react";
import { Eyebrow, GradientText } from "@/features/auth/components/public/primitives";
import { revealOnScroll, prefersReducedMotion } from "@/features/auth/components/public/useReveal";

const contactCards = [
  {
    icon: Mail,
    label: "Email us",
    value: "hello@rehbox.health",
    sub: "We reply within 24 hours",
    gradient: "var(--pub-grad-accent)",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Lagos, Nigeria",
    sub: "Serving clients across Africa",
    gradient: "var(--pub-grad-magenta)",
  },
  {
    icon: Clock,
    label: "Support hours",
    value: "Mon–Fri, 9am–6pm WAT",
    sub: "West Africa Time (UTC+1)",
    gradient: "var(--pub-grad-accent)",
  },
  {
    icon: Phone,
    label: "WhatsApp",
    value: "+234 800 REHBOX",
    sub: "For urgent clinical questions",
    gradient: "var(--pub-grad-magenta)",
  },
];

const faqs = [
  {
    q: "How do I get started as a physiotherapist?",
    a: "Sign up at rehbox.health, complete your professional profile, and our team will vet your credentials within 2 business days. You'll then be able to onboard clients and assign personalised exercise plans.",
  },
  {
    q: "Is my health data secure?",
    a: "Yes. All health data is encrypted at rest and in transit, stored on Nigerian servers, and processed under the Nigeria Data Protection Act (NDPA 2023). We never sell personal data.",
  },
  {
    q: "Can I use ReHboX on mobile?",
    a: "ReHboX is a progressive web app optimised for mobile browsers. Clients can follow video exercises and track progress from any smartphone without installing an app.",
  },
  {
    q: "What payment methods are accepted?",
    a: "We accept card payments (Visa, Mastercard), bank transfers, and USSD via Paystack — all optimised for Nigerian banking.",
  },
];

const inputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.15)",
  ["--tw-ring-color" as string]: "var(--pub-electric)",
};
const inputClass = "w-full text-white text-sm px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition";

const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="faq-item rounded-2xl overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.09)", background: "rgba(255,255,255,0.04)" }}
    >
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between px-6 py-5 text-left gap-4">
        <span className="font-display font-semibold text-white text-sm md:text-base">{q}</span>
        <ChevronDown
          size={18}
          className="text-white/40 flex-shrink-0 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-white/50 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
};

const Contact = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useGSAP(() => {
    if (!prefersReducedMotion()) {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from(".contact-title", { y: 30, opacity: 0, duration: 0.7 })
        .from(".contact-sub", { y: 24, opacity: 0, duration: 0.55 }, "-=0.35")
        .from(".contact-ctas", { y: 20, opacity: 0, duration: 0.5 }, "-=0.3");
    }
    const scope = containerRef.current;
    if (!scope) return;
    revealOnScroll(scope);
    revealOnScroll(scope, ".contact-card", { stagger: 0.08 });
    revealOnScroll(scope, ".faq-item", { stagger: 0.06 });
  }, { scope: containerRef });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1400);
  };

  return (
    <div ref={containerRef}>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-24 px-6 text-center overflow-hidden bg-pub-hero">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.035) 1px,transparent 1px)",
            backgroundSize: "46px 46px",
            maskImage: "radial-gradient(circle at 50% 30%, #000, transparent 70%)",
            WebkitMaskImage: "radial-gradient(circle at 50% 30%, #000, transparent 70%)",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="mb-6 flex justify-center"><Eyebrow tone="dark" live>We'd love to hear from you</Eyebrow></div>
          <h1 className="contact-title font-display font-bold text-4xl md:text-6xl text-white mb-6 leading-tight">
            Get in touch with <GradientText>our team</GradientText>
          </h1>
          <p className="contact-sub text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-8" style={{ color: "#AEBCD8" }}>
            Whether you're a physiotherapist ready to transform your practice, or a patient with questions — we're here.
          </p>
          <div className="contact-ctas flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:hello@rehbox.health"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--pub-grad-magenta)", boxShadow: "0 10px 28px rgba(224,71,155,0.4)" }}
            >
              <Mail size={16} />
              hello@rehbox.health
            </a>
            <Link
              to="/register/client"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-colors hover:bg-white/10"
              style={{ border: "1px solid rgba(255,255,255,0.25)" }}
            >
              Start for free →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CONTACT CARDS ────────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 py-16" style={{ background: "var(--pub-ink-base)" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactCards.map((card) => (
            <div
              key={card.label}
              className="contact-card rounded-2xl p-5 transition-transform duration-300 hover:-translate-y-1.5 cursor-default"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: card.gradient }}>
                <card.icon size={20} className="text-white" />
              </div>
              <p className="text-white/50 text-xs mb-1">{card.label}</p>
              <p className="text-white font-semibold text-sm mb-1">{card.value}</p>
              <p className="text-white/40 text-xs">{card.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FORM + FAQ ───────────────────────────────────────────────────── */}
      <section className="px-6 md:px-12 pb-24" style={{ background: "var(--pub-ink-base)" }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Form */}
          <div className="reveal rounded-3xl p-8" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <h2 className="font-display font-bold text-2xl text-white mb-2">Send a message</h2>
            <p className="text-white/50 text-sm mb-8">We'll get back to you within 24 hours.</p>

            {sent ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "var(--pub-grad-magenta)" }}>
                  <Send size={28} className="text-white" />
                </div>
                <h3 className="font-display text-white font-semibold text-lg mb-2">Message sent!</h3>
                <p className="text-white/50 text-sm">Expect a reply at your email within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/60 text-xs mb-1.5 font-medium">Name</label>
                    <input type="text" placeholder="Your name" required className={inputClass} style={inputStyle} />
                  </div>
                  <div>
                    <label className="block text-white/60 text-xs mb-1.5 font-medium">Email</label>
                    <input type="email" placeholder="you@example.com" required className={inputClass} style={inputStyle} />
                  </div>
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1.5 font-medium">I am a…</label>
                  <select
                    className={`${inputClass} appearance-none`}
                    style={{ ...inputStyle, background: "var(--pub-surface-dark)" }}
                  >
                    <option value="pt">Physiotherapist</option>
                    <option value="patient">Patient / Client</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1.5 font-medium">Subject</label>
                  <input type="text" placeholder="How can we help?" required className={inputClass} style={inputStyle} />
                </div>
                <div>
                  <label className="block text-white/60 text-xs mb-1.5 font-medium">Message</label>
                  <textarea rows={5} placeholder="Tell us more…" required className={`${inputClass} resize-none`} style={inputStyle} />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-sm transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ background: "var(--pub-grad-magenta)", boxShadow: "0 10px 28px rgba(224,71,155,0.35)" }}
                >
                  {sending ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Send message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* FAQ */}
          <div className="reveal">
            <h2 className="font-display font-bold text-2xl text-white mb-2">Frequently asked questions</h2>
            <p className="text-white/50 text-sm mb-8">Quick answers to common questions.</p>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <FaqItem key={i} q={faq.q} a={faq.a} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
