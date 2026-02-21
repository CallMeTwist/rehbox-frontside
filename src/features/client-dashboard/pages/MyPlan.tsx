import { Link } from "react-router-dom";
import { Play, CheckCircle } from "lucide-react";
import { mockPlan } from "@/mock/data";
import ProgressRing from "@/features/client-dashboard/components/ProgressRing";

const MyPlan = () => (
  <div className="space-y-6 animate-slide-up">
    <div><h1 className="font-display font-bold text-2xl">{mockPlan.name}</h1><p className="text-muted-foreground text-sm mt-1">Assigned by {mockPlan.ptName} · Ends {mockPlan.endDate}</p></div>
    <div className="bg-card rounded-2xl p-6 shadow-card border border-border flex items-center gap-6">
      <ProgressRing value={mockPlan.progress} size={100} strokeWidth={10} />
      <div>
        <p className="font-display font-bold text-2xl">{mockPlan.progress}%</p>
        <p className="text-muted-foreground text-sm">Overall completion</p>
        <p className="text-xs text-muted-foreground mt-1">{mockPlan.exercises.filter(e => e.completed).length}/{mockPlan.exercises.length} exercises done today</p>
      </div>
    </div>
    <div className="space-y-4">
      {mockPlan.exercises.map((ex) => (
        <div key={ex.id} className="bg-card rounded-2xl p-4 shadow-card border border-border flex items-center gap-4">
          <img src={ex.thumbnail} alt={ex.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{ex.name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{ex.sets} sets × {ex.reps} reps · {ex.duration}min</p>
            <div className="flex gap-1 mt-2 flex-wrap">{ex.scheduledDays.map(d => <span key={d} className="text-xs bg-muted px-2 py-0.5 rounded-full">{d}</span>)}</div>
          </div>
          {ex.completed ? <div className="flex flex-col items-center gap-1"><CheckCircle size={24} className="text-success" /><span className="text-xs text-success font-medium">Done</span></div>
            : <Link to={`/client/session/${ex.id}`} className="flex-shrink-0 gradient-primary text-white text-sm font-bold px-4 py-2 rounded-xl shadow-primary hover:opacity-90 flex items-center gap-2"><Play size={14} /> Start</Link>}
        </div>
      ))}
    </div>
  </div>
);

export default MyPlan;
