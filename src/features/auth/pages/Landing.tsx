import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Activity, Shield, Award, Users, CheckCircle, Brain, Star, Zap, Crown } from "lucide-react";

const features = [
  { icon: Activity, title: "Motion Tracking", desc: "Real-time pose analysis with AI-powered feedback during your exercises." },
  { icon: Shield, title: "Expert-Led Plans", desc: "Personalised rehabilitation plans created by certified physiotherapists." },
  { icon: Award, title: "Earn Rewards", desc: "Stay motivated with coins and badges for every completed session." },
  { icon: Users, title: "Direct PT Chat", desc: "Communicate with your physiotherapist anytime, anywhere." },
  { icon: Brain, title: "AI Posture Analysis", desc: "MediaPipe-powered pose detection to ensure perfect exercise form." },
  { icon: Star, title: "Progress Tracking", desc: "Detailed analytics on compliance, pain reduction and recovery." },
];

const pricingPlans = [
  { name: "Basic", price: 3500, features: ["Exercise library access", "5 PT messages/day", "Basic tracking", "50 coins/session"], icon: Zap },
  { name: "Standard", price: 7500, features: ["Everything in Basic", "Unlimited messaging", "Motion tracking", "Full analytics", "200 coins/session"], icon: Crown, popular: true },
  { name: "Premium", price: 15000, features: ["Everything in Standard", "Priority PT matching", "Video consultations", "Family accounts", "500 coins/session"], icon: Award },
];

const testimonials = [
  { name: "Amara O.", role: "Patient, Lagos", quote: "ReHboX changed my recovery journey. The motion tracking keeps me accountable!" },
  { name: "Dr. Bola A.", role: "Physiotherapist", quote: "I can monitor my clients' progress remotely. It's a game changer for my practice." },
  { name: "Emeka E.", role: "Patient, Abuja", quote: "The coin rewards keep me motivated. I've never been this consistent with my exercises." },
];

const Landing = () => (
  <div className="min-h-screen" style={{ background: 'hsl(var(--background))' }}>
    {/* Nav */}
    <nav className="flex items-center justify-between px-6 md:px-12 py-4">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-primary">
          <span className="text-white font-display font-bold">Rx</span>
        </div>
        <span className="font-display font-bold text-xl text-foreground">ReHboX</span>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors px-4 py-2">Login</Link>
        <Link to="/register/client" className="gradient-primary text-white text-sm font-semibold px-5 py-2 rounded-xl shadow-primary hover:opacity-90 transition-opacity">Get Started</Link>
      </div>
    </nav>

    {/* Hero */}
    <section className="relative overflow-hidden px-6 md:px-12 pt-12 pb-20">
      <div className="absolute inset-0 gradient-hero opacity-95 -z-10" />
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full opacity-10" style={{ background: 'hsl(var(--hot-pink))' }} />
        <div className="absolute bottom-0 left-20 w-64 h-64 rounded-full opacity-10 bg-primary" />
      </div>
      <div className="max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-white text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse-soft" />
            Nigeria's #1 Digital Physiotherapy Platform
          </span>
          <h1 className="font-display font-bold text-4xl md:text-6xl text-white leading-tight mb-6">
            Recover Smarter,<br /><span style={{ color: 'hsl(var(--hot-pink-light))' }}>Move Better</span>
          </h1>
          <p className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Connect with certified physiotherapists, follow guided exercise plans, and track your recovery — all from home.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register/client" className="gradient-pink text-white font-bold px-8 py-4 rounded-2xl shadow-pink hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-lg">
              I'm a Patient <ArrowRight size={20} />
            </Link>
            <Link to="/register/physio" className="glass text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/20 transition-colors flex items-center justify-center gap-2 text-lg border border-white/20">
              I'm a Physiotherapist
            </Link>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto">
          {[["500+", "Patients"], ["80+", "PTs"], ["95%", "Recovery Rate"]].map(([val, label]) => (
            <div key={label} className="text-center">
              <p className="font-display font-bold text-3xl text-white">{val}</p>
              <p className="text-white/70 text-sm">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>

    {/* Features (6 pillars) */}
    <section className="px-6 md:px-12 py-20 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">Everything you need to recover</h2>
        <p className="text-muted-foreground text-lg">Powered by technology, guided by experts.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f) => (
          <div key={f.title} className="bg-card rounded-2xl p-6 shadow-card card-hover border border-border flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-primary">
              <f.icon size={22} className="text-white" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-lg mb-1">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* Pricing */}
    <section className="px-6 md:px-12 py-20 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">Simple, transparent pricing</h2>
          <p className="text-muted-foreground text-lg">Choose the plan that fits your recovery needs.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPlans.map((plan) => (
            <div key={plan.name} className={`bg-card rounded-2xl p-6 border-2 transition-all relative ${plan.popular ? "border-primary shadow-primary" : "border-border"}`}>
              {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-pink text-white text-xs font-bold px-4 py-1 rounded-full">Most Popular</div>}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${plan.popular ? "gradient-primary shadow-primary" : "bg-muted"}`}>
                <plan.icon size={22} className={plan.popular ? "text-white" : "text-muted-foreground"} />
              </div>
              <h3 className="font-display font-bold text-xl mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="font-display font-bold text-3xl">₦{plan.price.toLocaleString()}</span>
                <span className="text-muted-foreground text-sm">/month</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm"><CheckCircle size={15} className="text-success flex-shrink-0" />{f}</li>
                ))}
              </ul>
              <Link to="/register/client" className={`block w-full text-center font-bold py-3 rounded-xl transition-opacity hover:opacity-90 ${plan.popular ? "gradient-primary text-white shadow-primary" : "border-2 border-border hover:border-primary"}`}>
                Get Started
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="px-6 md:px-12 py-20 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">Loved by patients & PTs</h2>
        <p className="text-muted-foreground text-lg">Hear from people who are recovering smarter.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div key={t.name} className="bg-card rounded-2xl p-6 shadow-card border border-border">
            <div className="flex gap-1 mb-4">
              {Array(5).fill(0).map((_, i) => <Star key={i} size={16} className="text-warning fill-warning" />)}
            </div>
            <p className="text-sm text-muted-foreground mb-4 italic">"{t.quote}"</p>
            <div>
              <p className="font-semibold text-sm">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="px-6 md:px-12 py-16">
      <div className="max-w-2xl mx-auto gradient-hero rounded-3xl p-12 text-center">
        <h2 className="font-display font-bold text-3xl text-white mb-4">Ready to start healing?</h2>
        <p className="text-white/80 mb-8">Join thousands of Nigerians recovering smarter with ReHboX.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/register/client" className="gradient-pink text-white font-bold px-8 py-3 rounded-xl shadow-pink hover:opacity-90 transition-opacity">Register as Patient</Link>
          <Link to="/register/physio" className="glass text-white font-semibold px-8 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors">Register as PT</Link>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="border-t border-border px-6 md:px-12 py-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-white font-display font-bold text-xs">Rx</span>
          </div>
          <span className="font-display font-bold">ReHboX</span>
        </div>
        <div className="flex gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">About</a>
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Contact</a>
        </div>
        <p className="text-sm text-muted-foreground">© 2025 ReHboX · Built for Nigeria 🇳🇬</p>
      </div>
    </footer>
  </div>
);

export default Landing;
