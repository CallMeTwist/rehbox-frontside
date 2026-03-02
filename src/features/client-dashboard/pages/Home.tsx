import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play, TrendingUp, Award, MessageCircle, ChevronRight, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import ProgressRing from "@/features/client-dashboard/components/ProgressRing";
import api from "@/features/shared/utils/api";
import toast from "react-hot-toast";

// ── Tooltip style ────────────────────────────────────────────────────
const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border:          '1px solid hsl(var(--border))',
  borderRadius:    '12px',
  fontSize:        '12px',
  color:           'hsl(var(--foreground))',
};

// ── Stats card ───────────────────────────────────────────────────────
const StatsCard = ({ title, value, icon, colorClass, trend }: {
  title: string; value: string | number; icon: string;
  colorClass?: string; trend?: { value: string; positive: boolean }
}) => (
  <div className="bg-card rounded-2xl p-5 shadow-card card-hover border border-border">
    <div className="flex items-start justify-between mb-3">
      <div className={`w-11 h-11 rounded-xl ${colorClass} flex items-center justify-center text-xl shadow-sm`}>
        {icon}
      </div>
      {trend && (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
          trend.positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
        }`}>
          {trend.positive ? "↑" : "↓"} {trend.value}
        </span>
      )}
    </div>
    <p className="text-2xl font-display font-bold text-foreground">{value}</p>
    <p className="text-sm font-medium text-foreground mt-0.5">{title}</p>
  </div>
);

// ── Enter Code Modal ─────────────────────────────────────────────────
const EnterCodeModal = ({ onClose }: { onClose: () => void }) => {
  const [code, setCode]   = useState('');
  const qc                = useQueryClient();
  const inputRef          = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const linkMutation = useMutation({
    mutationFn: () => api.post('/client/connect-pt', { activation_code: code }),
    onSuccess:  () => {
      toast.success('Physiotherapist linked successfully! 🎉');
      qc.invalidateQueries({ queryKey: ['client-profile'] });
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Invalid activation code.');
    },
  });

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg">Connect with a PT</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>
        <p className="text-sm text-muted-foreground">
          Enter the activation code your physiotherapist shared with you.
        </p>
        <input
          ref={inputRef}
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="e.g. REHBOX-PT-XXXXX"
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm font-mono tracking-widest uppercase focus:outline-none focus:ring-2 focus:ring-primary/30"
          maxLength={20}
        />
        <button
          onClick={() => linkMutation.mutate()}
          disabled={code.trim().length < 5 || linkMutation.isPending}
          className="w-full gradient-primary text-white rounded-xl py-3 font-bold disabled:opacity-50 transition"
        >
          {linkMutation.isPending ? 'Connecting...' : 'Connect'}
        </button>
      </div>
    </div>
  );
};

// ── Subscription expired banner ──────────────────────────────────────
const SubscriptionExpiredBanner = ({ status }: { status: string }) => {
  if (status !== 'expired') return null;
  return (
    <div className="bg-destructive/10 border border-destructive/30 rounded-2xl p-5 flex items-start gap-4">
      <span className="text-2xl">⚠️</span>
      <div className="flex-1">
        <p className="font-semibold text-sm text-destructive">Subscription Expired</p>
        <p className="text-xs text-muted-foreground mt-1">
          Your plan has expired. Renew now to keep access to your personalized exercises.
        </p>
        <Link to="/subscription"
          className="inline-block mt-3 bg-destructive text-white rounded-xl px-4 py-2 text-xs font-semibold">
          Renew Subscription
        </Link>
      </div>
    </div>
  );
};

// ── Main Home ────────────────────────────────────────────────────────
const Home = () => {
  const { user }         = useAuthStore();
  const [showCodeModal, setShowCodeModal] = useState(false);

  // Fetch real profile data
  const { data: profileData, isLoading } = useQuery({
    queryKey: ['client-profile'],
    queryFn:  () => api.get('/client/profile').then(r => r.data),
  });

  // Fetch real progress data
  const { data: progressData } = useQuery({
    queryKey: ['client-progress'],
    queryFn:  () => api.get('/client/progress').then(r => r.data),
    enabled:  !!profileData,
  });

  // Fetch active plan
  const { data: planData } = useQuery({
    queryKey: ['client-plan'],
    queryFn:  () => api.get('/client/plan').then(r => r.data),
    retry:    false, // 402 means no subscription — don't retry
  });

  const clientInfo     = profileData?.client;
  const planInfo       = planData?.plan;
  const progressSummary = progressData?.summary;
  const hasPT          = !!clientInfo?.physiotherapist_id;
  const subStatus      = clientInfo?.subscription_status ?? 'inactive';

  // Today's exercises — first 2 from plan
  const todayExercises = planInfo?.exercises?.slice(0, 2) ?? [];

  // Greeting based on time
  const hour     = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-40 bg-muted rounded-2xl" />
        <div className="grid grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-muted rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">

      {/* ── Banners ── */}
      <SubscriptionExpiredBanner status={subStatus} />

      {!hasPT && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-start gap-4">
          <span className="text-3xl">👨‍⚕️</span>
          <div className="flex-1">
            <p className="font-semibold text-sm">Connect with a Physiotherapist</p>
            <p className="text-xs text-muted-foreground mt-1">
              Enter an activation code from your PT to unlock a personalized exercise plan.
            </p>
            <button
              onClick={() => setShowCodeModal(true)}   // ✅ opens modal
              className="mt-3 text-xs bg-primary text-white px-4 py-2 rounded-xl font-semibold"
            >
              Enter Code
            </button>
          </div>
        </div>
      )}

      {/* ── Hero greeting ── */}
      <div className="gradient-hero rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10"
          style={{ background: 'hsl(var(--hot-pink))' }} />
        <p className="text-white/70 text-sm mb-1">{greeting} 👋</p>
        <h1 className="font-display font-bold text-2xl mb-1">
          {profileData?.user?.name ?? user?.name}
        </h1>
        {(progressSummary?.current_streak_days ?? 0) > 0 ? (
          <p className="text-white/80 text-sm mb-4">
            You're on a {progressSummary.current_streak_days}-day streak! Keep it up 🔥
          </p>
        ) : (
          <p className="text-white/80 text-sm mb-4">
            Start your first session today! 💪
          </p>
        )}
        <Link to="/client/plan"
          className="inline-flex items-center gap-2 gradient-pink text-white font-bold px-5 py-2.5 rounded-xl"
          style={{ boxShadow: 'var(--shadow-pink)' }}>
          <Play size={16} /> Start Today's Session
        </Link>
      </div>

      {/* ── Stats — from database ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Sessions Done"
          value={progressSummary?.total_sessions_this_month ?? 0}
          icon="🏃"
          colorClass="bg-primary/10"
        />
        <StatsCard
          title="Form Score"
          value={`${progressSummary?.avg_form_score ?? 0}%`}
          icon="✅"
          colorClass="bg-success/10"
        />
        <StatsCard
          title="Coins Earned"
          value={(clientInfo?.coin_balance ?? 0).toLocaleString()}
          icon="🪙"
          colorClass="bg-coin/10"
        />
        <StatsCard
          title="Streak"
          value={`${progressSummary?.current_streak_days ?? 0} days`}
          icon="🔥"
          colorClass="bg-warning/10"
        />
      </div>

      {/* ── Today's exercises + plan progress ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold">Today's Exercises</h2>
            <Link to="/client/plan"
              className="text-sm text-primary font-semibold flex items-center gap-1 hover:underline">
              Full plan <ChevronRight size={14} />
            </Link>
          </div>

          {subStatus !== 'active' ? (
            <div className="text-center py-8">
              <p className="text-3xl mb-2">🔒</p>
              <p className="text-sm text-muted-foreground mb-3">
                Subscribe to unlock your personalized plan
              </p>
              <Link to="/subscription"
                className="gradient-primary text-white text-xs font-bold px-4 py-2 rounded-xl">
                Subscribe Now
              </Link>
            </div>
          ) : todayExercises.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-3xl mb-2">📋</p>
              <p className="text-sm">No plan assigned yet.</p>
              <p className="text-xs mt-1">Your PT will create one shortly.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayExercises.map((ex: any) => (
                <div key={ex.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-xl flex-shrink-0">
                    🏃
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{ex.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {ex.pivot?.sets ?? ex.default_sets} sets ×{' '}
                      {ex.pivot?.reps ?? ex.default_reps} reps
                    </p>
                  </div>
                  <Link
                    to={`/client/session/${ex.id}`}
                    className="gradient-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-primary hover:opacity-90 flex-shrink-0"
                  >
                    Start
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Plan progress ring */}
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
          <h2 className="font-display font-semibold mb-4">Plan Progress</h2>
          {planInfo ? (
            <>
              <div className="flex justify-center mb-4">
                <ProgressRing
                  value={progressSummary?.total_sessions_this_month
                    ? Math.min(progressSummary.total_sessions_this_month * 10, 100)
                    : 0}
                  size={120}
                  strokeWidth={10}
                  label={planInfo.title}
                  sublabel="Active Plan"
                />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">PT</span>
                  <span className="font-medium">
                    {clientInfo?.physiotherapist?.name ?? '—'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-medium capitalize">{planInfo.status}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <p className="text-3xl mb-2">📋</p>
              <p className="text-xs text-center">
                {hasPT ? 'No active plan yet' : 'Connect with a PT first'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Quick links ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: TrendingUp,    label: "View Progress", to: "/client/progress", color: "gradient-primary" },
          { icon: Award,         label: "My Rewards",    to: "/client/rewards",  color: "gradient-pink"    },
          { icon: MessageCircle, label: "Chat with PT",  to: "/client/chat",     color: "gradient-coin"    },
        ].map((item) => (
          <Link key={item.label} to={item.to}
            className={`${item.color} rounded-2xl p-5 text-white flex items-center gap-3 hover:opacity-90 transition-opacity shadow-card`}>
            <item.icon size={22} />
            <span className="font-semibold">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* ── Enter Code Modal ── */}
      {showCodeModal && <EnterCodeModal onClose={() => setShowCodeModal(false)} />}

    </div>
  );
};

export default Home;