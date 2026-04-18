import { useState } from 'react';
import { useMyPlan } from '../hooks/useMyPlan';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Lock, ChevronDown, ChevronUp, Play, CheckCircle, PauseCircle, Clock } from 'lucide-react';

const STATUS_META: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  active:    { label: 'Active',    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: <Play size={11} /> },
  paused:    { label: 'Paused',    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',         icon: <PauseCircle size={11} /> },
  completed: { label: 'Completed', color: 'bg-primary/10 text-primary',                                                   icon: <CheckCircle size={11} /> },
};

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? STATUS_META.paused;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${meta.color}`}>
      {meta.icon} {meta.label}
    </span>
  );
}

function PlanCard({ plan, defaultOpen }: { plan: any; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const isActive = plan.status === 'active';

  const wasUpdated = plan.updated_at && plan.created_at &&
    new Date(plan.updated_at).getTime() - new Date(plan.created_at).getTime() > 60_000;

  return (
    <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
      isActive
        ? 'border-primary/40 shadow-md bg-card'
        : 'border-border bg-card/60'
    }`}>
      {/* Card header — always visible */}
      <button
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-muted/40 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        {/* Left accent */}
        <div className={`w-1.5 self-stretch rounded-full flex-shrink-0 ${isActive ? 'bg-primary' : 'bg-muted-foreground/30'}`} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={`font-display font-semibold text-base truncate ${isActive ? '' : 'text-muted-foreground'}`}>
              {plan.title}
            </p>
            <StatusBadge status={plan.status} />
            {wasUpdated && (
              <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                ✏️ Updated
              </span>
            )}
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground">
              {plan.exercises?.length ?? 0} exercises
              {plan.frequency && ` · ${plan.frequency.replace('_', ' ')}`}
              {plan.start_date && ` · Started ${new Date(plan.start_date).toLocaleDateString()}`}
            </p>
            {wasUpdated && (
              <p className="text-xs text-muted-foreground">
                Last edited {new Date(plan.updated_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        <div className="text-muted-foreground flex-shrink-0">
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {/* Expanded exercises */}
      {open && (
        <div className="px-5 pb-5 space-y-2 border-t border-border/60 pt-4">
          {plan.notes && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mb-3">
              <p className="text-xs font-semibold text-primary mb-0.5">Note from your Physiotherapist</p>
              <p className="text-sm text-muted-foreground">{plan.notes}</p>
            </div>
          )}

          {plan.exercises?.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No exercises in this plan yet.</p>
          )}

          {plan.exercises?.map((ex: any, i: number) => (
            <div
              key={ex.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3 group"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{ex.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {ex.pivot?.sets} sets · {ex.pivot?.reps} reps
                  {ex.pivot?.hold_seconds > 0 && ` · ${ex.pivot.hold_seconds}s hold`}
                </p>
                {ex.pivot?.pt_notes && (
                  <p className="text-xs text-primary mt-0.5 italic">💬 {ex.pivot.pt_notes}</p>
                )}
              </div>
              {isActive && (
                <Link
                  to={`/client/session/${ex.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-shrink-0 gradient-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-primary hover:opacity-90 flex items-center gap-1.5"
                >
                  <Play size={12} /> Start
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const MyPlan = () => {
  const { data, isLoading, error } = useMyPlan();

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
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
    );
  }

  const plans: any[] = data?.plans ?? [];
  const activePlan   = data?.active_plan;
  const compliance   = data?.compliance_rate ?? 0;

  if (plans.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-semibold">No plans assigned yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Your physiotherapist will create your personalized plan shortly.
          </p>
        </div>
      </div>
    );
  }

  const otherPlans = plans.filter((p) => p.status !== 'active');

  return (
    <div className="space-y-6 animate-slide-up">

      {/* Page title */}
      <div>
        <h1 className="font-display font-bold text-2xl">My Plans</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {plans.length} plan{plans.length !== 1 ? 's' : ''} assigned by your physiotherapist
        </p>
      </div>

      {/* Active plan compliance bar */}
      {activePlan && (
        <div className="bg-card rounded-2xl border border-primary/30 p-5 shadow-md">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium">Active Plan Compliance</span>
            <span className="font-bold text-primary">{compliance}%</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700"
              style={{ width: `${compliance}%` }}
            />
          </div>
        </div>
      )}

      {/* Active plans */}
      {plans.filter((p) => p.status === 'active').length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <h2 className="font-display font-semibold text-sm uppercase tracking-wide text-muted-foreground">
              Active
            </h2>
          </div>
          {plans
            .filter((p) => p.status === 'active')
            .map((plan, i) => (
              <PlanCard key={plan.id} plan={plan} defaultOpen={i === 0} />
            ))}
        </div>
      )}

      {/* Other plans */}
      {otherPlans.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-muted-foreground" />
            <h2 className="font-display font-semibold text-sm uppercase tracking-wide text-muted-foreground">
              Previous Plans
            </h2>
          </div>
          {otherPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} defaultOpen={false} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPlan;
