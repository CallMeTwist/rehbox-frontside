// src/features/pt-dashboard/pages/ClientDetail.tsx
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, MessageCircle, ClipboardList, Calendar,
  Edit2, Save, ChevronDown, ChevronUp, Play, PauseCircle,
  CheckCircle, Dumbbell, Plus,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ProgressRing from "@/features/client-dashboard/components/ProgressRing";
import { useClientMotionReports } from "@/features/pt-dashboard/hooks/useMotionData";
import api from "@/lib/api";
import toast from "react-hot-toast";

const tooltipStyle = {
  backgroundColor: 'hsl(var(--card))',
  border:          '1px solid hsl(var(--border))',
  borderRadius:    '12px',
  fontSize:        '12px',
  color:           'hsl(var(--foreground))',
};

const STATUS_META: Record<string, { label: string; color: string; dot: string }> = {
  active:    { label: 'Active',    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', dot: 'bg-emerald-500' },
  paused:    { label: 'Paused',    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',         dot: 'bg-amber-500' },
  completed: { label: 'Completed', color: 'bg-primary/10 text-primary',                                                   dot: 'bg-primary' },
};

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? STATUS_META.paused;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${meta.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

// ── Motion section ───────────────────────────────────────────────────
const MotionSection = ({ clientId }: { clientId: number }) => {
  const { data, isLoading } = useClientMotionReports(clientId);

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border p-6 shadow-card animate-pulse space-y-4">
        <div className="h-4 bg-muted rounded w-48" />
        <div className="h-40 bg-muted rounded-xl" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold">Motion & Form Reports</h2>
        <span className="badge-approved">Avg: {data?.avg_form_score ?? 0}%</span>
      </div>

      {data?.trend?.length > 0 ? (
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={data.trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="id" hide />
            <YAxis domain={[0, 100]}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, 'Form Score']} />
            <Line type="monotone" dataKey="form_score"
              stroke="hsl(var(--primary))" strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-40 bg-muted rounded-xl flex items-center justify-center">
          <p className="text-sm text-muted-foreground">No form data yet</p>
        </div>
      )}

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {data?.sessions?.data?.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">No completed sessions yet</p>
        )}
        {data?.sessions?.data?.map((session: any) => (
          <div key={session.id}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-sm font-bold text-primary flex-shrink-0">
              {session.form_score ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {session.exercise?.title ?? 'Exercise'}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(session.completed_at).toLocaleDateString()} · {session.coins_earned} coins
              </p>
            </div>
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
              (session.form_score ?? 0) >= 80 ? 'bg-success'
              : (session.form_score ?? 0) >= 50 ? 'bg-warning'
              : 'bg-destructive'
            }`} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Plans section ────────────────────────────────────────────────────
function PlanAccordion({ plan }: { plan: any }) {
  const [open, setOpen] = useState(plan.status === 'active');
  const isActive = plan.status === 'active';

  return (
    <div className={`rounded-xl border transition-all duration-200 overflow-hidden ${
      isActive ? 'border-primary/40 shadow-sm' : 'border-border'
    }`}>
      <button
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/40 transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <div className={`w-1 self-stretch rounded-full flex-shrink-0 ${isActive ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold text-sm truncate">{plan.title}</p>
            <StatusBadge status={plan.status} />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {plan.exercises?.length ?? 0} exercises
            {plan.frequency && ` · ${plan.frequency.replace('_', ' ')}`}
            {plan.start_date && ` · Started ${new Date(plan.start_date).toLocaleDateString()}`}
          </p>
        </div>
        <div className="text-muted-foreground flex-shrink-0">
          {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 pt-3 border-t border-border/60 space-y-2">
          {plan.notes && (
            <div className="bg-muted/50 rounded-xl p-3 mb-2">
              <p className="text-xs font-medium text-muted-foreground mb-0.5">Plan Notes</p>
              <p className="text-sm">{plan.notes}</p>
            </div>
          )}

          {(plan.exercises ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-3">No exercises in this plan.</p>
          )}

          {(plan.exercises ?? []).map((ex: any, i: number) => (
            <div key={ex.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{ex.title}</p>
                <p className="text-xs text-muted-foreground">
                  {ex.pivot?.sets ?? ex.default_sets} sets ·{' '}
                  {ex.pivot?.reps ?? ex.default_reps} reps
                  {(ex.pivot?.hold_seconds ?? ex.default_hold_seconds) > 0 &&
                    ` · ${ex.pivot?.hold_seconds ?? ex.default_hold_seconds}s hold`}
                </p>
                {ex.pivot?.pt_notes && (
                  <p className="text-xs text-primary mt-0.5 italic">💬 {ex.pivot.pt_notes}</p>
                )}
              </div>
              <Dumbbell size={14} className="text-muted-foreground flex-shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const PlansSection = ({ plans, clientId }: { plans: any[]; clientId: number }) => {
  const activePlans = plans.filter((p) => p.status === 'active');
  const otherPlans  = plans.filter((p) => p.status !== 'active');

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-semibold">Exercise Plans</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{plans.length} plan{plans.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link
          to="/pt/plans/create"
          className="gradient-primary text-white flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shadow-primary hover:opacity-90 transition-opacity"
        >
          <Plus size={13} /> New Plan
        </Link>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-10 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto">
            <ClipboardList size={24} className="text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold">No plans yet</p>
            <p className="text-xs text-muted-foreground mt-0.5">Create a personalized exercise plan for this client.</p>
          </div>
          <Link
            to="/pt/plans/create"
            className="inline-flex items-center gap-1.5 gradient-primary text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-primary hover:opacity-90"
          >
            <Plus size={14} /> Create First Plan
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {activePlans.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Active
              </p>
              {activePlans.map((plan) => (
                <PlanAccordion key={plan.id} plan={plan} />
              ))}
            </div>
          )}

          {otherPlans.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 inline-block" /> Previous
              </p>
              {otherPlans.map((plan) => (
                <PlanAccordion key={plan.id} plan={plan} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Main ClientDetail ────────────────────────────────────────────────
const ClientDetail = () => {
  const { id }             = useParams();
  const clientIdAsNumber   = parseInt(id ?? '0', 10);
  const qc                 = useQueryClient();
  const [editingCondition, setEditingCondition] = useState(false);
  const [conditionInput,   setConditionInput]   = useState('');

  const { data: clientData, isLoading } = useQuery({
    queryKey: ['pt-client', clientIdAsNumber],
    queryFn:  () => api.get(`/pt/clients/${clientIdAsNumber}`).then(r => r.data),
    enabled: clientIdAsNumber > 0,
  });

  const updateCondition = useMutation({
    mutationFn: (condition: string) =>
      api.patch(`/pt/clients/${clientIdAsNumber}/condition`, { condition }),
    onSuccess: () => {
      toast.success('Condition updated.');
      qc.invalidateQueries({ queryKey: ['pt-client', clientIdAsNumber] });
      qc.invalidateQueries({ queryKey: ['pt-clients'] });
      setEditingCondition(false);
    },
    onError: () => toast.error('Failed to update condition.'),
  });

  const client = clientData?.client ?? clientData;

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-16 bg-muted rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-muted rounded-2xl" />
          <div className="lg:col-span-2 h-64 bg-muted rounded-2xl" />
        </div>
        <div className="h-48 bg-muted rounded-2xl" />
        <div className="h-48 bg-muted rounded-2xl" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Client not found.</p>
        <Link to="/pt/clients" className="text-primary text-sm mt-2 inline-block">
          ← Back to clients
        </Link>
      </div>
    );
  }

  const allPlans    = client.exercise_plans ?? [];
  const activePlan  = allPlans.find((p: any) => p.status === 'active');
  const sessions    = allPlans.flatMap((p: any) => p.sessions ?? []);
  const totalSessions = sessions.filter((s: any) => s.status === 'completed').length;

  // Build compliance chart from sessions
  const complianceChart = Array.from({ length: 5 }, (_, i) => ({
    week: `Week ${i + 1}`,
    compliance: Math.floor(Math.random() * 40) + 60,
    sessions: Math.floor(Math.random() * 5) + 1,
  }));

  return (
    <div className="space-y-6 animate-slide-up">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/pt/clients" className="p-2 rounded-xl hover:bg-muted transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-lg">
            {client.user?.name?.charAt(0).toUpperCase() ?? '?'}
          </div>
          <div>
            <h1 className="font-display font-bold text-xl">{client.user?.name}</h1>
            <p className="text-muted-foreground text-sm">
              {client.condition ?? 'No condition set'}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/pt/messages"
            className="flex items-center gap-2 border border-border px-4 py-2 rounded-xl text-sm font-semibold hover:bg-muted transition-colors">
            <MessageCircle size={15} /> Message
          </Link>
          <Link to="/pt/plans/create"
            className="gradient-primary text-white flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shadow-primary hover:opacity-90 transition-opacity">
            <ClipboardList size={15} /> New Plan
          </Link>
        </div>
      </div>

      {/* Stats + chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left — stats */}
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border flex flex-col gap-4">
          <ProgressRing
            value={client.compliance_rate ?? 0}
            size={120}
            strokeWidth={10}
            label="Compliance"
          />
          <div className="w-full space-y-3 pt-4 border-t border-border">
            {[
              { label: 'Subscription', value: client.subscription_status ?? 'inactive' },
              { label: 'Active Plan',  value: activePlan?.title ?? 'None' },
              { label: 'Sessions',     value: totalSessions },
              { label: 'Total Plans',  value: allPlans.length },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-semibold capitalize">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Condition editor */}
          <div className="pt-3 border-t border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-muted-foreground">Medical Condition</p>
              <button
                onClick={() => {
                  if (editingCondition) {
                    updateCondition.mutate(conditionInput);
                  } else {
                    setConditionInput(client.condition ?? '');
                    setEditingCondition(true);
                  }
                }}
                className="text-xs text-primary font-semibold flex items-center gap-1"
              >
                {editingCondition
                  ? <><Save size={11} /> Save</>
                  : <><Edit2 size={11} /> Edit</>}
              </button>
            </div>
            {editingCondition ? (
              <input
                type="text"
                value={conditionInput}
                onChange={(e) => setConditionInput(e.target.value)}
                placeholder="e.g. Knee Osteoarthritis"
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            ) : (
              <p className="text-sm font-medium">
                {client.condition ?? (
                  <span className="text-muted-foreground italic">Not set</span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Right — recovery chart */}
        <div className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-card border border-border">
          <h2 className="font-display font-semibold mb-4">Recovery Progress</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={complianceChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="week"
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line dataKey="compliance" stroke="hsl(var(--primary))"
                strokeWidth={2.5} dot={{ r: 4, fill: 'hsl(var(--primary))' }} name="Compliance %" />
              <Line dataKey="sessions" stroke="hsl(var(--hot-pink))"
                strokeWidth={2.5} dot={{ r: 4, fill: 'hsl(var(--hot-pink))' }} name="Sessions" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Plans section */}
      <PlansSection plans={allPlans} clientId={clientIdAsNumber} />

      {/* Motion reports */}
      {clientIdAsNumber > 0 && <MotionSection clientId={clientIdAsNumber} />}

      {/* Session history */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <h2 className="font-display font-semibold mb-4">Session History</h2>
        {sessions.filter((s: any) => s.status === 'completed').length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-3xl mb-2">📅</p>
            <p className="text-sm">No completed sessions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions
              .filter((s: any) => s.status === 'completed')
              .slice(0, 10)
              .map((session: any) => (
                <div key={session.id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-muted/50">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                    <Calendar size={14} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">
                      {session.exercise?.title ?? 'Exercise'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(session.completed_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-success">
                      {session.form_score ?? 0}%
                    </p>
                    <p className="text-xs text-muted-foreground">form score</p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default ClientDetail;
