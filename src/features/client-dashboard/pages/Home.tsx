import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Play, TrendingUp, Award, MessageCircle, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { mockClient, mockPlan, mockRewards } from "@/mock/data";
import ProgressRing from "@/features/client-dashboard/components/ProgressRing";
import api from "@/features/shared/utils/api";

const StatsCard = ({ title, value, icon, colorClass, trend }: { title: string; value: string | number; icon: string; colorClass?: string; trend?: { value: string; positive: boolean } }) => (
  <div className="bg-card rounded-2xl p-5 shadow-card card-hover border border-border">
    <div className="flex items-start justify-between mb-3">
      <div className={`w-11 h-11 rounded-xl ${colorClass} flex items-center justify-center text-xl shadow-sm`}>{icon}</div>
      {trend && <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend.positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>{trend.positive ? "↑" : "↓"} {trend.value}</span>}
    </div>
    <p className="text-2xl font-display font-bold text-foreground">{value}</p>
    <p className="text-sm font-medium text-foreground mt-0.5">{title}</p>
  </div>
);



const Home = () => {
  const { user } = useAuthStore();
  const client = user || mockClient;
  const todayExercises = mockPlan.exercises.slice(0, 2);
  const { data: profileData } = useQuery({
    queryKey: ['client-profile'],
    queryFn: () => api.get('/client/profile').then(r => r.data),
  });

  const hasPT = !!profileData?.client?.physiotherapist_id;

  return (
    <div className="space-y-6 animate-slide-up">

      {!hasPT && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-start gap-4">
          <span className="text-3xl">👨‍⚕️</span>
          <div className="flex-1">
            <p className="font-semibold text-sm">Connect with a Physiotherapist</p>
            <p className="text-xs text-muted-foreground mt-1">
              Enter an activation code from your PT to unlock a personalized exercise plan.
            </p>
            <button className="mt-3 text-xs bg-primary text-white px-4 py-2 rounded-xl font-semibold">
              Enter Code
            </button>
          </div>
        </div>
      )}


      <div className="gradient-hero rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full opacity-10" style={{ background: 'hsl(var(--hot-pink))' }} />
        <p className="text-white/70 text-sm mb-1">Good morning 👋</p>
        <h1 className="font-display font-bold text-2xl mb-1">{client.name}</h1>
        <p className="text-white/80 text-sm mb-4">You're on a 7-day streak! Keep it up 🔥</p>
        <Link to="/client/plan" className="inline-flex items-center gap-2 gradient-pink text-white font-bold px-5 py-2.5 rounded-xl" style={{ boxShadow: 'var(--shadow-pink)' }}>
          <Play size={16} /> Start Today's Session
        </Link>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Sessions Done" value={34} icon="🏃" colorClass="bg-primary/10" trend={{ value: "+3", positive: true }} />
        <StatsCard title="Compliance" value="85%" icon="✅" colorClass="bg-success/10" />
        <StatsCard title="Coins Earned" value={(client.coins || 850).toLocaleString()} icon="🪙" colorClass="bg-coin/10" />
        <StatsCard title="Pain Score" value="3/10" icon="💊" colorClass="bg-warning/10" trend={{ value: "-2", positive: true }} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold">Today's Exercises</h2>
            <Link to="/client/plan" className="text-sm text-primary font-semibold flex items-center gap-1 hover:underline">Full plan <ChevronRight size={14} /></Link>
          </div>
          <div className="space-y-3">
            {todayExercises.map((ex) => (
              <div key={ex.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
                <img src={ex.thumbnail} alt={ex.name} className="w-12 h-12 rounded-xl object-cover" />
                <div className="flex-1"><p className="text-sm font-semibold">{ex.name}</p><p className="text-xs text-muted-foreground">{ex.sets} sets × {ex.reps} reps · {ex.duration}min</p></div>
                {ex.completed ? <span className="badge-approved">Done</span> : <Link to={`/client/session/${ex.id}`} className="gradient-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-primary hover:opacity-90">Start</Link>}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
          <h2 className="font-display font-semibold mb-4">Plan Progress</h2>
          <div className="flex justify-center mb-4"><ProgressRing value={mockPlan.progress} size={120} strokeWidth={10} label={mockPlan.name} sublabel="Phase 1" /></div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">PT</span><span className="font-medium">{mockPlan.ptName}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Ends</span><span className="font-medium">{mockPlan.endDate}</span></div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[{ icon: TrendingUp, label: "View Progress", to: "/client/progress", color: "gradient-primary" }, { icon: Award, label: "My Rewards", to: "/client/rewards", color: "gradient-pink" }, { icon: MessageCircle, label: "Chat with PT", to: "/client/chat", color: "gradient-coin" }].map((item) => (
          <Link key={item.label} to={item.to} className={`${item.color} rounded-2xl p-5 text-white flex items-center gap-3 hover:opacity-90 transition-opacity shadow-card`}>
            <item.icon size={22} /><span className="font-semibold">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;

