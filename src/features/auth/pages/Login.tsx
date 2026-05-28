// src/features/auth/pages/Login.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Flame, Activity, MessageSquare } from "lucide-react";
import { usePTLogin, useClientLogin } from "@/features/auth/hooks/useAuth";



const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: Math.random() * 2.2 + 1,
  x: Math.random() * 100,
  y: Math.random() * 100,
  color: i % 3 === 0 ? "#E5197D" : i % 3 === 1 ? "#2C5FC3" : "#ffffff",
  opacity: Math.random() * 0.5 + 0.15,
  duration: Math.random() * 6 + 4,
  delay: Math.random() * 4,
}));

const Login = () => {
  const [role, setRole] = useState<"physiotherapist" | "client">("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const ptLogin = usePTLogin();
  const clientLogin = useClientLogin();
  const isPending = ptLogin.isPending || clientLogin.isPending;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const creds = { email, password };
    if (role === "physiotherapist") {
      ptLogin.mutate(creds);
    } else {
      clientLogin.mutate(creds);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#07101f" }}>
      {/* ── Left cinematic panel (desktop only) ──────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[55%] relative overflow-hidden flex-col justify-between p-12"
        style={{ background: "linear-gradient(160deg,#060c1e 0%,#091526 50%,#0e1e42 100%)" }}
      >
        <div
          className="absolute top-[-15%] right-[-8%] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(27,62,143,0.30),transparent 65%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute bottom-[-15%] left-[-8%] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(229,25,125,0.18),transparent 65%)", filter: "blur(80px)" }}
        />
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle,#ffffff 1px,transparent 1px)", backgroundSize: "36px 36px" }}
        />
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: p.size,
              height: p.size,
              background: p.color,
              left: `${p.x}%`,
              top: `${p.y}%`,
              opacity: p.opacity,
              animation: `particle-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
            }}
          />
        ))}

        <div className="relative z-10" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative z-10"
        >
          <h2 className="font-display font-bold text-5xl text-white leading-[1.05] mb-4">
            Welcome back.
            <br />
            <span
              style={{
                background: "linear-gradient(135deg,#FF6BB5,#E5197D)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Your recovery is waiting.
            </span>
          </h2>
          <p className="text-white/55 text-base max-w-md">
            Continue where you left off and keep making progress.
          </p>
        </motion.div>

        <div className="relative z-10 grid grid-cols-3 gap-3">
          {[
            { icon: Flame, label: "Streak", value: "5 days", color: "#FF6BB5" },
            { icon: Activity, label: "Recovery", value: "87%", color: "#93c5fd" },
            { icon: MessageSquare, label: "PT", value: "Online", color: "#7dd3fc" },
          ].map(({ icon: Icon, label, value, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
              className="rounded-2xl p-4"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(12px)",
              }}
            >
              <Icon size={16} style={{ color }} />
              <p className="text-white font-display font-bold text-lg mt-2">{value}</p>
              <p className="text-white/40 text-[10px] uppercase tracking-widest">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Right form panel ─────────────────────────────────────────── */}
      <div
        className="flex-1 flex items-center justify-center p-6 relative overflow-hidden"
        style={{ background: "linear-gradient(180deg,#07101f,#060c1e)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none lg:hidden"
          style={{ backgroundImage: "radial-gradient(circle,#ffffff 1px,transparent 1px)", backgroundSize: "36px 36px" }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-10"
        >
          <div
            className="rounded-3xl p-8"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(16px)",
              boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
            }}
          >
            <h1 className="font-display font-bold text-2xl text-white mb-1">Sign in</h1>
            <p className="text-white/50 text-sm mb-7">Welcome back! Please enter your details.</p>

            {/* Premium role toggle */}
            <div
              className="relative flex bg-white/[0.04] rounded-xl p-1 mb-6"
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}
            >
              {(["client", "physiotherapist"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  aria-pressed={role === r}
                  className="relative flex-1 text-xs font-semibold py-2.5 z-10 transition-colors"
                  style={{ color: role === r ? "#ffffff" : "rgba(255,255,255,0.45)" }}
                >
                  {r === "client" ? "Patient" : "Physiotherapist"}
                </button>
              ))}
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                className="absolute top-1 bottom-1 rounded-lg"
                style={{
                  width: "calc(50% - 4px)",
                  left: role === "client" ? "4px" : "calc(50% + 0px)",
                  background: "linear-gradient(135deg,#E5197D,#C4006A)",
                  boxShadow: "0 4px 16px rgba(229,25,125,0.4)",
                }}
              />
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <label className="block text-xs font-medium text-white/65 mb-1.5">Email address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none transition-all"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "rgba(229,25,125,0.45)";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(229,25,125,0.12)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
              >
                <label className="block text-xs font-medium text-white/65 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35" />
                  <input
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full pl-10 pr-10 py-3 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none transition-all"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "rgba(229,25,125,0.45)";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(229,25,125,0.12)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-right"
              >
                <a href="#" className="text-xs text-pink-300 hover:text-pink-200">
                  Forgot password?
                </a>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.36 }}
                type="submit"
                disabled={isPending}
                className="w-full text-white font-bold py-3.5 rounded-xl transition-all hover:scale-[1.01] disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg,#E5197D,#C4006A)",
                  boxShadow: "0 8px 28px rgba(229,25,125,0.4)",
                }}
              >
                {isPending ? "Signing in…" : "Sign in"}
              </motion.button>
            </form>

            <p className="text-center text-white/45 text-sm mt-6">
              Don't have an account?{" "}
              <Link
                to={`/register/${role === "client" ? "client" : "physio"}`}
                className="text-pink-300 font-semibold hover:text-pink-200"
              >
                Register
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
