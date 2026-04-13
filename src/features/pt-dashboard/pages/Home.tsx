// src/features/pt-dashboard/pages/Home.tsx
import { Link } from "react-router-dom";
import { ChevronRight, TrendingUp, Users, Activity, FileText, DollarSign, ArrowUpRight, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { usePTDashboard } from "../hooks/usePTDashboard";
import VettingPendingScreen from "@/features/auth/components/VettingPendingScreen";
import { useAuthStore } from "@/store/authStore";

// ── Animation variants ────────────────────────────────────────────────
const fadeUp = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.07, ease: "easeOut" } }),
};

// ── Custom chart tooltip ──────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-elevated text-sm">
      <p className="font-semibold text-foreground mb-0.5">{label}</p>
      <p className={`font-bold text-lg font-display ${
        val >= 70 ? "text-success" : val >= 40 ? "text-warning" : "text-destructive"
      }`}>{val}%</p>
      <p className="text-muted-foreground text-xs">compliance</p>
    </div>
  );
};

// ── Stat card ─────────────────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  accent: string;      // Tailwind gradient class or bg class
  trend?: { label: string; up: boolean };
  i: number;
}

const StatCard = ({ title, value, icon: Icon, accent, trend, i }: StatCardProps) => (
  <motion.div
    custom={i}
    variants={fadeUp}
    initial="hidden"
    animate="visible"
    className="relative bg-card rounded-2xl p-5 border border-border overflow-hidden group cursor-default"
    style={{ boxShadow: 'var(--shadow-card)' }}
    whileHover={{ y: -3, boxShadow: 'var(--shadow-elevated)' }}
    transition={{ duration: 0.2 }}
  >
    {/* Subtle corner glow */}
    <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 blur-xl ${accent}`} />

    <div className="relative flex items-start justify-between mb-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accent} shadow-sm`}>
        <Icon size={20} className="text-white" />
      </div>
      {trend && (
        <span className={`inline-flex items-center gap-0.5 text-xs font-bold px-2 py-1 rounded-full ${
          trend.up ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
        }`}>
          <ArrowUpRight size={11} className={trend.up ? "" : "rotate-90"} />
          {trend.label}
        </span>
      )}
    </div>
    <motion.p
      className="font-display font-bold text-3xl text-foreground tracking-tight"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: i * 0.07 + 0.2, duration: 0.4, ease: "easeOut" }}
    >
      {value}
    </motion.p>
    <p className="text-sm text-muted-foreground mt-1 font-medium">{title}</p>
  </motion.div>
);

// ── Main ──────────────────────────────────────────────────────────────
const Home = () => {
  const user = useAuthStore((s) => s.user);

  if (user?.vetting_status !== "approved") return <VettingPendingScreen />;

  const { data, isLoading } = usePTDashboard();
  const stats           = data?.stats;
  const complianceChart = data?.compliance_chart ?? [];
  const recentClients   = data?.recent_clients ?? [];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.name?.split(" ")[0] ?? "Doctor";

  const today = new Date().toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long" });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-48 rounded-3xl bg-muted" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-muted rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72 bg-muted rounded-2xl" />
          <div className="h-72 bg-muted rounded-2xl" />
        </div>
      </div>
    );
  }

  const avgCompliance = stats?.avg_compliance ?? 0;

  return (
    <div className="space-y-6">

      {/* ── Hero banner ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative rounded-3xl overflow-hidden"
        style={{ background: 'var(--gradient-hero)', minHeight: 160 }}
      >
        {/* Decorative geometry */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-8 -right-8 w-64 h-64 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #E5197D 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full opacity-8"
            style={{ background: 'radial-gradient(circle, #2C5FC3 0%, transparent 70%)' }} />
          {/* Grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="relative px-6 py-7 md:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-white/60 text-sm font-medium mb-1">{today}</p>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-white leading-tight">
              {greeting}, <span className="text-white">Dr. {firstName}</span> 👋
            </h1>
            <p className="text-white/70 text-sm mt-2">
              {(stats?.active_clients ?? 0) > 0
                ? `You have ${stats.active_clients} active client${stats.active_clients > 1 ? "s" : ""} today.`
                : "Share your activation code to onboard your first patient."}
            </p>
          </div>

          {/* Compliance badge */}
          <div className="flex-shrink-0">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-4 text-center">
              <p className="text-white/60 text-xs mb-1 font-medium">Avg Compliance</p>
              <p className={`font-display font-bold text-3xl ${
                avgCompliance >= 70 ? "text-green-400" : avgCompliance >= 40 ? "text-yellow-400" : "text-white"
              }`}>
                {avgCompliance > 0 ? `${avgCompliance}%` : "—"}
              </p>
              {avgCompliance >= 70 && (
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Flame size={11} className="text-orange-400" />
                  <span className="text-white/60 text-xs">On track</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Stat cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard i={0} title="Total Clients"   value={stats?.total_clients ?? 0}   icon={Users}      accent="bg-gradient-primary" />
        <StatCard i={1} title="Active Clients"  value={stats?.active_clients ?? 0}   icon={Activity}   accent="bg-success" />
        <StatCard i={2} title="Plans Created"   value={stats?.plans_created ?? 0}    icon={FileText}   accent="gradient-pink bg-gradient-pink" />
        <StatCard i={3} title="Total Sessions"  value={stats?.total_sessions ?? 0}   icon={TrendingUp} accent="bg-warning" />
      </div>

      {/* ── Chart + Earnings ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Compliance chart */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-semibold text-lg">Client Compliance</h2>
              <p className="text-muted-foreground text-xs mt-0.5">Last 5 months</p>
            </div>
            {complianceChart.length > 0 && (
              <div className={`text-center px-3 py-1.5 rounded-xl text-xs font-bold ${
                complianceChart[complianceChart.length - 1]?.compliance >= 70
                  ? "bg-success/10 text-success"
                  : "bg-warning/10 text-warning"
              }`}>
                This month: {complianceChart[complianceChart.length - 1]?.compliance ?? 0}%
              </div>
            )}
          </div>

          {complianceChart.length === 0 ? (
            <div className="h-52 rounded-xl bg-muted flex flex-col items-center justify-center gap-2">
              <Activity size={28} className="text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No session data yet</p>
              <p className="text-xs text-muted-foreground">Compliance data will appear after clients complete sessions</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={complianceChart} barSize={36} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontFamily: 'Plus Jakarta Sans' }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))', fontFamily: 'Plus Jakarta Sans' }}
                  axisLine={false} tickLine={false} domain={[0, 100]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted)/0.4)', radius: 8 }} />
                <Bar dataKey="compliance" radius={[8, 8, 0, 0]}>
                  {complianceChart.map((entry: any, index: number) => {
                    const isLast = index === complianceChart.length - 1;
                    const c = entry.compliance;
                    const fill = c >= 70 ? '#22C55E' : c >= 40 ? '#F59E0B' : '#EF4444';
                    return <Cell key={index} fill={isLast ? '#1B3E8F' : fill} opacity={isLast ? 1 : 0.7} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Earnings panel */}
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="bg-card rounded-2xl p-6 border border-border flex flex-col gap-4"
          style={{ boxShadow: 'var(--shadow-card)' }}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-lg">Earnings</h2>
            <div className="w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center">
              <DollarSign size={16} className="text-white" />
            </div>
          </div>

          {/* Revenue hero */}
          <div className="rounded-2xl p-5 relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, #E5197D, transparent)' }} />
            <p className="text-white/60 text-xs mb-1 font-medium">Monthly Revenue</p>
            <p className="font-display font-bold text-2xl text-white">
              ₦{Number(stats?.monthly_revenue ?? 0).toLocaleString()}
            </p>
          </div>

          {/* Commission */}
          <div className="rounded-xl p-4 bg-muted/60 border border-border">
            <p className="text-muted-foreground text-xs mb-1">Commission (15%)</p>
            <p className="font-display font-bold text-xl text-foreground">
              ₦{Number(stats?.commission_earned ?? 0).toLocaleString()}
            </p>
          </div>

          <Link to="/pt/profile"
            className="flex items-center justify-between text-sm font-semibold text-primary hover:underline mt-auto">
            View earnings <ChevronRight size={14} />
          </Link>
        </motion.div>
      </div>

      {/* ── Recent Clients ───────────────────────────────────────────── */}
      <motion.div
        custom={6}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="bg-card rounded-2xl border border-border overflow-hidden"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="font-display font-semibold text-lg">Recent Clients</h2>
            <p className="text-muted-foreground text-xs mt-0.5">Latest activity across your patients</p>
          </div>
          <Link to="/pt/clients"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-gradient-primary px-4 py-2 rounded-xl"
            style={{ boxShadow: 'var(--shadow-primary)' }}>
            View all <ChevronRight size={14} />
          </Link>
        </div>

        {recentClients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-3 text-center px-6">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Users size={24} className="text-primary" />
            </div>
            <p className="font-semibold text-foreground">No clients yet</p>
            <p className="text-sm text-muted-foreground max-w-xs">Share your activation code with patients to start onboarding them.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentClients.map((c: any, idx: number) => {
              const compliance = c.compliance ?? 0;
              const compColor = compliance >= 70 ? "text-success" : compliance >= 40 ? "text-warning" : "text-destructive";
              const barColor  = compliance >= 70 ? "bg-success"   : compliance >= 40 ? "bg-warning"   : "bg-destructive";

              return (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + idx * 0.05, duration: 0.3 }}
                >
                  <Link
                    to={`/pt/clients/${c.id}`}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition-colors group"
                  >
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-full bg-gradient-primary flex items-center justify-center text-white font-display font-bold text-base flex-shrink-0"
                      style={{ boxShadow: 'var(--shadow-primary)' }}>
                      {c.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {c.condition ?? "No condition set"}
                      </p>
                    </div>

                    {/* Compliance bar */}
                    <div className="flex-shrink-0 w-24 hidden sm:block">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${compColor}`}>{compliance}%</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                          style={{ width: `${compliance}%` }}
                        />
                      </div>
                    </div>

                    <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

    </div>
  );
};

export default Home;
