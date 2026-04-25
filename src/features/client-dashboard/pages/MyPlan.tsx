import { useState } from 'react';
import { useMyPlan } from '../hooks/useMyPlan';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Lock, ChevronDown, ChevronUp, Play, CheckCircle, PauseCircle, Clock, Dumbbell, Pencil, Trash2 } from 'lucide-react';
import api from '@/features/shared/utils/api';
import { useIsFree } from '@/store/authStore';
import ExerciseGridCard from '../components/ExerciseGridCard';
import MarkDoneSheet from '../components/MarkDoneSheet';

type MarkingDone = { id: number | string; title: string } | null;

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

function PlanCard({
  plan,
  defaultOpen,
  onExerciseTap,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plan: any;
  defaultOpen?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onExerciseTap: (ex: any) => void;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const isActive = plan.status === 'active';
  const isSelfBuilt = plan.is_self_built === true;
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/client/plans/self/${plan.id}`).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-plan'] });
      toast.success('Plan deleted');
    },
    onError: (err: unknown) => {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Could not delete plan';
      toast.error(message);
    },
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this plan? This cannot be undone.')) {
      deleteMutation.mutate();
    }
  };

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
          {isSelfBuilt && (
            <div className="flex items-center gap-3 mb-3">
              <Link
                to="/client/plan/build"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
              >
                <Pencil size={12} /> Edit
              </Link>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-destructive hover:underline disabled:opacity-50"
              >
                <Trash2 size={12} /> {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          )}
          {plan.notes && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mb-3">
              <p className="text-xs font-semibold text-primary mb-0.5">Note from your Physiotherapist</p>
              <p className="text-sm text-muted-foreground">{plan.notes}</p>
            </div>
          )}

          {plan.exercises?.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No exercises in this plan yet.</p>
          )}

          {plan.exercises?.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {plan.exercises.map((ex: any, i: number) => (
                <ExerciseGridCard
                  key={ex.id}
                  exercise={{
                    id: ex.id,
                    title: ex.title,
                    illustration_url: ex.illustration_url,
                    sets: ex.pivot?.sets ?? ex.sets,
                    reps: ex.pivot?.reps ?? ex.reps,
                    scheduled_days: ex.pivot?.scheduled_days ?? ex.scheduled_days,
                    completed: ex.completed,
                  }}
                  onTap={() => onExerciseTap(ex)}
                  delay={i * 50}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const MyPlan = () => {
  const { data, isLoading, error } = useMyPlan();
  const isFree = useIsFree();
  const navigate = useNavigate();
  const [markingDone, setMarkingDone] = useState<MarkingDone>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTap = (ex: any) => {
    if (ex.completed) return;
    if (isFree) {
      setMarkingDone({ id: ex.id, title: ex.title });
    } else {
      navigate(`/client/session/${ex.id}`);
    }
  };

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
    if (isFree) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-card rounded-2xl border border-border p-10 text-center max-w-sm">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Dumbbell size={28} className="text-primary" />
            </div>
            <h2 className="font-display font-bold text-xl mb-2">No plan yet</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Build a simple plan for yourself — pick a few exercises and the days you'll do them.
            </p>
            <Link
              to="/client/plan/build"
              className="block w-full gradient-primary text-white rounded-xl py-3 font-semibold text-center shadow-primary"
            >
              Build My Plan
            </Link>
          </div>
        </div>
      );
    }
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
              <PlanCard key={plan.id} plan={plan} defaultOpen={i === 0} onExerciseTap={handleTap} />
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
            <PlanCard key={plan.id} plan={plan} defaultOpen={false} onExerciseTap={handleTap} />
          ))}
        </div>
      )}

      <MarkDoneSheet exercise={markingDone} onClose={() => setMarkingDone(null)} />
    </div>
  );
};

export default MyPlan;
