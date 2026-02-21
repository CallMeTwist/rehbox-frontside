import { Link } from "react-router-dom";
import { Users, TrendingUp, ClipboardList, DollarSign, ChevronRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import StatsCard from "@/components/shared/StatsCard";
import { mockClients, mockPTStats, mockComplianceData } from "@/mock/data";

const PTHome = () => {
  const recentClients = mockClients.slice(0, 4);

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="font-display font-bold text-2xl">Good morning, Dr. Adaeze 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">Here's an overview of your practice today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Clients" value={mockPTStats.totalClients} icon="👥" colorClass="bg-primary/10" trend={{ value: "+2", positive: true }} />
        <StatsCard title="Active Clients" value={mockPTStats.activeClients} icon="✅" colorClass="bg-success/10" />
        <StatsCard title="Avg Compliance" value={`${mockPTStats.avgCompliance}%`} icon="📊" colorClass="bg-warning/10" trend={{ value: "+5%", positive: true }} />
        <StatsCard title="Plans Created" value={mockPTStats.plansCreated} icon="📋" colorClass="bg-hot-pink/10" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-card border border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold">Client Compliance (5 months)</h2>
            <span className="badge-approved">This Month: {mockComplianceData[mockComplianceData.length - 1].compliance}%</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockComplianceData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', fontSize: '12px' }}
                formatter={(value) => [`${value}%`, 'Compliance']}
              />
              <Bar dataKey="compliance" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Earnings */}
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
          <h2 className="font-display font-semibold mb-5">Earnings</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl gradient-primary text-white">
              <p className="text-white/70 text-xs mb-1">Monthly Revenue</p>
              <p className="font-display font-bold text-2xl">₦{mockPTStats.monthlyEarnings.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-xl bg-muted">
              <p className="text-muted-foreground text-xs mb-1">Commission Earned</p>
              <p className="font-display font-bold text-xl">₦{mockPTStats.commissionsEarned.toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-xl bg-muted">
              <p className="text-muted-foreground text-xs mb-1">Total Sessions</p>
              <p className="font-display font-bold text-xl">{mockPTStats.totalSessions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent clients */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold">Recent Clients</h2>
          <Link to="/pt/clients" className="text-sm text-primary font-semibold flex items-center gap-1 hover:underline">
            View all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="space-y-3">
          {recentClients.map((c) => (
            <Link key={c.id} to={`/pt/clients/${c.id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group">
              <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.condition}</p>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-success">{c.compliance}%</div>
                <div className="text-xs text-muted-foreground">compliance</div>
              </div>
              <ChevronRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PTHome;
