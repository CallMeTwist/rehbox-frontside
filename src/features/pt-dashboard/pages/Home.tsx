// src/features/pt-dashboard/pages/Home.tsx
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { usePTDashboard } from "../hooks/usePTDashboard";
import VettingPendingScreen from "@/features/auth/components/VettingPendingScreen";
import { useAuthStore } from "@/store/authStore";

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border:          '1px solid hsl(var(--border))',
  borderRadius:    '12px',
  fontSize:        '12px',
  color:           'hsl(var(--foreground))',
};

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

const Home = () => {
  const user = useAuthStore((s) => s.user);

  if (user?.vetting_status !== "approved") {
    return <VettingPendingScreen />;
  }

  const { data, isLoading } = usePTDashboard();

  const stats          = data?.stats;
  const complianceChart = data?.compliance_chart ?? [];
  const recentClients  = data?.recent_clients ?? [];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-28 bg-muted rounded-2xl" />)}
        </div>
        <div className="h-64 bg-muted rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="font-display font-bold text-2xl">
          Good morning, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Here's an overview of your practice today.
        </p>
      </div>

      {/* Stats cards — from database */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Clients"
          value={stats?.total_clients ?? 0}
          icon="👥"
          colorClass="bg-primary/10"
        />
        <StatsCard
          title="Active Clients"
          value={stats?.active_clients ?? 0}
          icon="✅"
          colorClass="bg-success/10"
        />
        <StatsCard
          title="Avg Compliance"
          value={`${stats?.avg_compliance ?? 0}%`}
          icon="📊"
          colorClass="bg-warning/10"
        />
        <StatsCard
          title="Plans Created"
          value={stats?.plans_created ?? 0}
          icon="📋"
          colorClass="bg-hot-pink/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compliance chart */}
        <div className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-card border border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold">Client Compliance (5 months)</h2>
            {complianceChart.length > 0 && (
              <span className="badge-approved">
                This Month: {complianceChart[complianceChart.length - 1]?.compliance ?? 0}%
              </span>
            )}
          </div>
          {complianceChart.length === 0 ? (
            <div className="h-52 bg-muted rounded-xl flex items-center justify-center">
              <p className="text-sm text-muted-foreground">No session data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={complianceChart} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false} tickLine={false} domain={[0, 100]}
                />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}`, 'Sessions']} />
                <Bar dataKey="compliance" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Earnings summary */}
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
          <h2 className="font-display font-semibold mb-5">Earnings</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl gradient-primary text-white">
              <p className="text-white/70 text-xs mb-1">Monthly Revenue</p>
              <p className="font-display font-bold text-2xl">
                ₦{Number(stats?.monthly_revenue ?? 0).toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-muted">
              <p className="text-muted-foreground text-xs mb-1">Commission (15%)</p>
              <p className="font-display font-bold text-xl">
                ₦{Number(stats?.commission_earned ?? 0).toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-muted">
              <p className="text-muted-foreground text-xs mb-1">Total Sessions</p>
              <p className="font-display font-bold text-xl">
                {stats?.total_sessions ?? 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent clients — from database */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold">Recent Clients</h2>
          <Link to="/pt/clients"
            className="text-sm text-primary font-semibold flex items-center gap-1 hover:underline">
            View all <ChevronRight size={14} />
          </Link>
        </div>

        {recentClients.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-3xl mb-2">👥</p>
            <p className="text-sm">No recent clients.</p>
            <p className="text-xs mt-1">
              Share your activation code to onboard your first patient.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentClients.map((c: any) => (
              <Link
                key={c.id}
                to={`/pt/clients/${c.id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group"
              >
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold flex-shrink-0">
                  {c.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {c.condition ?? 'No condition set'}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`text-xs font-bold ${
                    c.compliance >= 80 ? 'text-success'
                    : c.compliance >= 50 ? 'text-warning'
                    : 'text-muted-foreground'
                  }`}>
                    {c.compliance}%
                  </div>
                  <div className="text-xs text-muted-foreground">compliance</div>
                </div>
                <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;