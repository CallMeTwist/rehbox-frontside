import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play, TrendingUp, Award, MessageCircle, ChevronRight, X, Flame, Zap, Target, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import ProgressRing from "@/features/client-dashboard/components/ProgressRing";
import { ReminderBanner } from "@/features/client-dashboard/components/ReminderBanner";
import api from "@/features/shared/utils/api";
import toast from "react-hot-toast";

// ── Animation helpers ─────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial:  { opacity: 0, y: 20 },
  animate:  { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: "easeOut" },
});

// ── Count-up number animation ─────────────────────────────────────────
const CountUp = ({ to, suffix = "" }: { to: number; suffix?: string }) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (to === 0) return;
    let start = 0;
    const step = to / 30;
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 25);
    return () => clearInterval(timer);
  }, [to]);
  return <>{val.toLocaleString()}{suffix}</>;
};

// ── Enter Code Modal ──────────────────────────────────────────────────
const EnterCodeModal = ({ onClose }: { onClose: () => void }) => {
  const [code, setCode] = useState("");
  const qc              = useQueryClient();
  const inputRef        = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const linkMutation = useMutation({
    mutationFn: () => api.post("/client/connect-pt", { activation_code: code }),
    onSuccess: () => {
      toast.success("Physiotherapist linked! 🎉");
      qc.invalidateQueries({ queryKey: ["client-profile"] });
      onClose();
    },
    onError: (err: any) => toast.error(err.response?.data?.message ?? "Invalid activation code."),
  });

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-card rounded-3xl w-full max-w-sm p-6 border border-border"
          style={{ boxShadow: 'var(--shadow-elevated)' }}
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-lg">Connect with a PT</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Enter the activation code from your physiotherapist.</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
              <X size={18} />
            </button>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="REHBOX-PT-XXXXX"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm font-mono tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all mb-4"
            maxLength={20}
          />
          <button
            onClick={() => linkMutation.mutate()}
            disabled={code.trim().length < 5 || linkMutation.isPending}
            className="w-full text-white font-bold py-3 rounded-xl disabled:opacity-50 transition"
            style={{ background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-primary)' }}
          >
            {linkMutation.isPending ? "Connecting..." : "Connect"}
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ── Stat tile ─────────────────────────────────────────────────────────
const StatTile = ({
  icon: Icon, label, value, suffix = "", accent, delay,
}: {
  icon: React.ElementType; label: string; value: number; suffix?: string;
  accent: { bg: string; icon: string }; delay: number;
}) => (
  <motion.div
    {...fadeUp(delay)}
    className="bg-card rounded-2xl p-5 border border-border relative overflow-hidden group"
    style={{ boxShadow: 'var(--shadow-card)' }}
    whileHover={{ y: -2, boxShadow: 'var(--shadow-elevated)' }}
    transition={{ duration: 0.18 }}
  >
    <div className={`absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-15 blur-lg ${accent.bg}`} />
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${accent.bg}`}>
      <Icon size={18} className={accent.icon} />
    </div>
    <p className="font-display font-bold text-2xl text-foreground tracking-tight">
      <CountUp to={value} suffix={suffix} />
    </p>
    <p className="text-xs text-muted-foreground mt-0.5 font-medium">{label}</p>
  </motion.div>
);

// ── Main ──────────────────────────────────────────────────────────────
const Home = () => {
  const { user }         = useAuthStore();
  const [showCode, setShowCode] = useState(false);

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["client-profile"],
    queryFn:  () => api.get("/client/profile").then(r => r.data),
  });

  const { data: progressData } = useQuery({
    queryKey: ["client-progress"],
    queryFn:  () => api.get("/client/progress").then(r => r.data),
    enabled:  !!profileData,
  });

  const { data: planData } = useQuery({
    queryKey: ["client-plan"],
    queryFn:  () => api.get("/client/plan").then(r => r.data),
    retry:    false,
  });

  const clientInfo      = profileData?.client;
  const planInfo        = planData?.active_plan ?? planData?.plan;
  const progressSummary = progressData?.summary;
  const hasPT           = !!clientInfo?.physiotherapist_id;
  const subStatus       = clientInfo?.subscription_status ?? "inactive";
  const todayExercises  = planInfo?.exercises?.slice(0, 3) ?? [];

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const streakDays = progressSummary?.current_streak_days ?? 0;
  const formScore  = progressSummary?.avg_form_score ?? 0;
  const sessions   = progressSummary?.total_sessions_this_month ?? 0;
  const coins      = clientInfo?.coin_balance ?? 0;
  const progress   = planData?.compliance_rate ?? (sessions ? Math.min(sessions * 10, 100) : 0);

  if (isLoading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-56 rounded-3xl bg-muted" />
        <div className="grid grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-muted rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 h-64 bg-muted rounded-2xl" />
          <div className="h-64 bg-muted rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* ── Subscription expired ─────────────────────────────────── */}
      {subStatus === "expired" && (
        <motion.div {...fadeUp(0)}
          className="bg-destructive/8 border border-destructive/25 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-destructive/15 flex items-center justify-center flex-shrink-0">
            <Zap size={18} className="text-destructive" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm text-destructive">Subscription Expired</p>
            <p className="text-xs text-muted-foreground mt-1">Renew to keep access to your personalized exercise plan.</p>
            <Link to="/subscription"
              className="inline-flex items-center gap-1.5 mt-3 bg-destructive text-white rounded-xl px-4 py-2 text-xs font-bold">
              Renew Now <ChevronRight size={12} />
            </Link>
          </div>
        </motion.div>
      )}

      {/* ── Connect PT banner ────────────────────────────────────── */}
      {!hasPT && (
        <motion.div {...fadeUp(0.05)}
          className="border border-primary/20 rounded-2xl p-5 flex items-start gap-4"
          style={{ background: 'rgba(27, 62, 143, 0.05)' }}>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Target size={18} className="text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">Connect with a Physiotherapist</p>
            <p className="text-xs text-muted-foreground mt-1">Enter your PT's activation code to unlock your personalised plan.</p>
            <button onClick={() => setShowCode(true)}
              className="mt-3 text-xs font-bold px-4 py-2 rounded-xl text-white"
              style={{ background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-primary)' }}>
              Enter Code
            </button>
          </div>
        </motion.div>
      )}

      {/* ── Reminder banner ──────────────────────────────────────── */}
      {hasPT && planInfo && <ReminderBanner planTitle={planInfo.title} />}

      {/* ── Hero greeting ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
        className="relative rounded-3xl overflow-hidden"
        style={{ background: 'var(--gradient-hero)' }}
      >
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #E5197D, transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 w-56 h-32 opacity-10"
            style={{ background: 'radial-gradient(ellipse, #2C5FC3, transparent 70%)' }} />
        </div>

        <div className="relative p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Left: greeting + CTA */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-white/60 text-sm">{greeting} 👋</p>
              {streakDays > 0 && (
                <span className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-2.5 py-0.5 text-white text-xs font-bold">
                  <Flame size={11} className="text-orange-400" /> {streakDays}-day streak
                </span>
              )}
            </div>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-white leading-tight mb-1 truncate">
              {profileData?.user?.name ?? user?.name}
            </h1>
            <p className="text-white/60 text-sm mb-5">
              {streakDays > 0
                ? `You're doing great. Keep the momentum going! 💪`
                : "Start your first session and build your streak."}
            </p>
            <Link
              to="/client/plan"
              className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-xl text-white text-sm"
              style={{ background: 'var(--gradient-pink)', boxShadow: 'var(--shadow-pink)' }}
            >
              <Play size={16} fill="white" /> Start Today's Session
            </Link>
          </div>

          {/* Right: progress ring */}
          <div className="flex-shrink-0 bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-5 flex flex-col items-center gap-2">
            <ProgressRing value={progress} size={100} strokeWidth={9} />
            <p className="text-white/60 text-xs text-center">Monthly progress</p>
          </div>
        </div>
      </motion.div>

      {/* ── Stats bento ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          icon={Play}    label="Sessions This Month" value={sessions}
          accent={{ bg: "bg-gradient-primary", icon: "text-white" }} delay={0.15}
        />
        <StatTile
          icon={Target}  label="Avg Form Score" value={formScore} suffix="%"
          accent={{ bg: "bg-success", icon: "text-white" }} delay={0.20}
        />
        <StatTile
          icon={Award}   label="Coins Earned" value={coins}
          accent={{ bg: "bg-gradient-coin", icon: "text-white" }} delay={0.25}
        />
        <StatTile
          icon={Flame}   label="Day Streak" value={streakDays}
          accent={{ bg: "bg-warning", icon: "text-white" }} delay={0.30}
        />
      </div>

      {/* ── Plan + progress ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Today's exercises */}
        <motion.div
          {...fadeUp(0.35)}
          className="lg:col-span-2 bg-card rounded-2xl border border-border overflow-hidden"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div>
              <h2 className="font-display font-semibold text-lg">Today's Exercises</h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {todayExercises.length > 0 ? `${todayExercises.length} exercise${todayExercises.length > 1 ? "s" : ""} in your plan` : "No exercises yet"}
              </p>
            </div>
            <Link to="/client/plan"
              className="text-xs font-semibold text-primary flex items-center gap-1 hover:underline">
              Full plan <ChevronRight size={12} />
            </Link>
          </div>

          <div className="p-4 space-y-2.5">
            {subStatus !== "active" ? (
              <div className="text-center py-10">
                <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Clock size={22} className="text-muted-foreground" />
                </div>
                <p className="text-sm font-semibold text-foreground mb-1">Subscribe to unlock</p>
                <p className="text-xs text-muted-foreground mb-4">Get access to your personalized exercise plan.</p>
                <Link to="/subscription"
                  className="inline-flex items-center gap-1.5 font-bold text-xs text-white px-5 py-2.5 rounded-xl"
                  style={{ background: 'var(--gradient-primary)', boxShadow: 'var(--shadow-primary)' }}>
                  Subscribe Now
                </Link>
              </div>
            ) : todayExercises.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <p className="text-3xl mb-2">📋</p>
                <p className="text-sm font-semibold">No plan assigned yet</p>
                <p className="text-xs mt-1">{hasPT ? "Your PT will create one shortly." : "Connect with a PT first."}</p>
              </div>
            ) : (
              todayExercises.map((ex: any, idx: number) => (
                <motion.div
                  key={ex.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.06 }}
                  className="flex items-center gap-3.5 p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/60 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0 text-white text-xl"
                    style={{ boxShadow: 'var(--shadow-primary)' }}>
                    🏃
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-foreground">{ex.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {ex.pivot?.sets ?? ex.default_sets} sets × {ex.pivot?.reps ?? ex.default_reps} reps
                      {ex.pivot?.hold_seconds > 0 && ` · ${ex.pivot.hold_seconds}s hold`}
                    </p>
                  </div>
                  <Link
                    to={`/client/session/${ex.id}`}
                    className="flex-shrink-0 inline-flex items-center gap-1.5 font-bold text-xs text-white px-4 py-2 rounded-lg"
                    style={{ background: 'var(--gradient-pink)', boxShadow: 'var(--shadow-pink)' }}
                  >
                    <Play size={11} fill="white" /> Start
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Plan progress */}
        <motion.div
          {...fadeUp(0.40)}
          className="bg-card rounded-2xl border border-border p-6 flex flex-col"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <h2 className="font-display font-semibold text-lg mb-5">Plan Progress</h2>
          {planInfo ? (
            <>
              <div className="flex justify-center mb-5">
                <ProgressRing value={progress} size={120} strokeWidth={10} label={planInfo.title} sublabel="Active Plan" />
              </div>
              <div className="space-y-3 text-sm mt-auto">
                <div className="flex justify-between items-center py-2.5 border-b border-border">
                  <span className="text-muted-foreground text-xs font-medium">Physiotherapist</span>
                  <span className="font-semibold text-xs text-foreground truncate max-w-[120px] text-right">
                    {clientInfo?.physiotherapist?.name ?? "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-border">
                  <span className="text-muted-foreground text-xs font-medium">Status</span>
                  <span className={`text-xs font-bold capitalize px-2 py-0.5 rounded-full ${
                    planInfo.status === "active"
                      ? "bg-success/10 text-success"
                      : planInfo.status === "paused"
                      ? "bg-warning/10 text-warning"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {planInfo.status}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2.5">
                  <span className="text-muted-foreground text-xs font-medium">Frequency</span>
                  <span className="font-semibold text-xs text-foreground capitalize">
                    {(planInfo.frequency ?? "daily").replace("_", " ")}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center py-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Target size={22} className="text-primary" />
              </div>
              <p className="text-sm font-semibold text-foreground">No active plan</p>
              <p className="text-xs text-muted-foreground">{hasPT ? "Your PT will assign one shortly." : "Connect with a PT to get started."}</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Quick links ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: TrendingUp, label: "View Progress", sub: "Track your recovery",
            to: "/client/progress", gradient: "var(--gradient-primary)", shadow: "var(--shadow-primary)",
          },
          {
            icon: Award, label: "My Rewards", sub: `${coins.toLocaleString()} coins available`,
            to: "/client/rewards", gradient: "var(--gradient-pink)", shadow: "var(--shadow-pink)",
          },
          {
            icon: MessageCircle, label: "Chat with PT", sub: "Ask your physiotherapist",
            to: "/client/chat", gradient: "var(--gradient-coin)", shadow: "var(--shadow-coin)",
          },
        ].map((item, i) => (
          <motion.div key={item.label} {...fadeUp(0.45 + i * 0.06)}>
            <Link
              to={item.to}
              className="flex items-center gap-4 p-5 rounded-2xl text-white hover:opacity-90 transition-opacity"
              style={{ background: item.gradient, boxShadow: item.shadow }}
            >
              <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                <item.icon size={20} />
              </div>
              <div>
                <p className="font-display font-semibold text-sm">{item.label}</p>
                <p className="text-white/70 text-xs mt-0.5">{item.sub}</p>
              </div>
              <ChevronRight size={16} className="ml-auto opacity-60" />
            </Link>
          </motion.div>
        ))}
      </div>

      {showCode && <EnterCodeModal onClose={() => setShowCode(false)} />}
    </div>
  );
};

export default Home;
