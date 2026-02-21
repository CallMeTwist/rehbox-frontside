// import { Link } from "react-router-dom";
// import { Play, CheckCircle } from "lucide-react";
// import { mockPlan } from "@/mock/data";
// import ProgressRing from "@/features/client-dashboard/components/ProgressRing";

// const MyPlan = () => (
//   <div className="space-y-6 animate-slide-up">
//     <div><h1 className="font-display font-bold text-2xl">{mockPlan.name}</h1><p className="text-muted-foreground text-sm mt-1">Assigned by {mockPlan.ptName} · Ends {mockPlan.endDate}</p></div>
//     <div className="bg-card rounded-2xl p-6 shadow-card border border-border flex items-center gap-6">
//       <ProgressRing value={mockPlan.progress} size={100} strokeWidth={10} />
//       <div>
//         <p className="font-display font-bold text-2xl">{mockPlan.progress}%</p>
//         <p className="text-muted-foreground text-sm">Overall completion</p>
//         <p className="text-xs text-muted-foreground mt-1">{mockPlan.exercises.filter(e => e.completed).length}/{mockPlan.exercises.length} exercises done today</p>
//       </div>
//     </div>
//     <div className="space-y-4">
//       {mockPlan.exercises.map((ex) => (
//         <div key={ex.id} className="bg-card rounded-2xl p-4 shadow-card border border-border flex items-center gap-4">
//           <img src={ex.thumbnail} alt={ex.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
//           <div className="flex-1 min-w-0">
//             <p className="font-semibold text-sm">{ex.name}</p>
//             <p className="text-xs text-muted-foreground mt-0.5">{ex.sets} sets × {ex.reps} reps · {ex.duration}min</p>
//             <div className="flex gap-1 mt-2 flex-wrap">{ex.scheduledDays.map(d => <span key={d} className="text-xs bg-muted px-2 py-0.5 rounded-full">{d}</span>)}</div>
//           </div>
//           {ex.completed ? <div className="flex flex-col items-center gap-1"><CheckCircle size={24} className="text-success" /><span className="text-xs text-success font-medium">Done</span></div>
//             : <Link to={`/client/session/${ex.id}`} className="flex-shrink-0 gradient-primary text-white text-sm font-bold px-4 py-2 rounded-xl shadow-primary hover:opacity-90 flex items-center gap-2"><Play size={14} /> Start</Link>}
//         </div>
//       ))}
//     </div>
//   </div>
// );

// export default MyPlan;



import { useMyPlan } from '../hooks/useMyPlan';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Lock } from 'lucide-react';

const MyPlan = () => {
  const { data, isLoading, error } = useMyPlan();

  // Not subscribed
  if ((error as any)?.response?.status === 402) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-card rounded-2xl border border-border p-10 text-center max-w-sm">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-muted-foreground" />
          </div>
          <h2 className="font-display font-bold text-xl mb-2">Plan Locked</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Subscribe to unlock your personalized exercise plan created by your physiotherapist.
          </p>
          <Link
            to="/subscription"
            className="block w-full bg-primary text-white rounded-xl py-3 font-semibold text-center"
          >
            Subscribe Now
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    );
  }

  if (!data?.plan) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-semibold">No plan assigned yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Your physiotherapist will create your personalized plan shortly.
          </p>
        </div>
      </div>
    );
  }

  const { plan, compliance_rate } = data;

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="font-display font-bold text-2xl">{plan.title}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {plan.duration_weeks} week program · {compliance_rate}% compliance
        </p>
      </div>

      {/* Compliance bar */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium">Overall Progress</span>
          <span className="font-bold text-primary">{compliance_rate}%</span>
        </div>
        <div className="h-2.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${compliance_rate}%` }}
          />
        </div>
      </div>

      {/* Exercises list */}
      <div className="space-y-3">
        <h2 className="font-display font-semibold">Your Exercises</h2>
        {plan.exercises.map((ex: any, i: number) => (
          <Link
            key={ex.id}
            to={`/client/session/${ex.id}`}
            className="flex items-center gap-4 bg-card rounded-2xl border border-border p-4 hover:border-primary/50 transition-colors group"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-xl font-bold text-primary">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{ex.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {ex.pivot.sets} sets · {ex.pivot.reps} reps
                {ex.pivot.hold_seconds > 0 && ` · ${ex.pivot.hold_seconds}s hold`}
              </p>
              {ex.pivot.pt_notes && (
                <p className="text-xs text-primary mt-1 italic">
                  💬 {ex.pivot.pt_notes}
                </p>
              )}
            </div>
            <span className="text-muted-foreground group-hover:text-primary text-sm transition-colors">
              Start →
            </span>
          </Link>
        ))}
      </div>

      {plan.notes && (
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
          <p className="text-xs font-semibold text-primary mb-1">Note from your Physiotherapist</p>
          <p className="text-sm text-muted-foreground">{plan.notes}</p>
        </div>
      )}
    </div>
  );
};

export default MyPlan;