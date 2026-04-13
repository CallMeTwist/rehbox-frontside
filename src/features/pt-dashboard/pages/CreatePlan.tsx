// src/features/pt-dashboard/pages/CreatePlan.tsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Minus, Plus } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface ExerciseOverride {
  sets: number;
  reps: number;
  hold_seconds: number;
  pt_notes: string;
}

// Compact number stepper used for sets/reps/hold
const Stepper = ({
  label,
  value,
  min = 0,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  onChange: (v: number) => void;
}) => (
  <div className="flex flex-col items-center gap-1">
    <span className="text-xs text-muted-foreground font-medium">{label}</span>
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
      >
        <Minus size={11} />
      </button>
      <span className="w-8 text-center text-sm font-bold">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
      >
        <Plus size={11} />
      </button>
    </div>
  </div>
);

const CreatePlan = () => {
  const [planName, setPlanName]             = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedDays, setSelectedDays]     = useState<string[]>([]);
  const [notes, setNotes]                   = useState("");
  const [submitted, setSubmitted]           = useState(false);
  const [createdPlanName, setCreatedPlanName]     = useState("");
  const [createdClientName, setCreatedClientName] = useState("");

  // Map of exercise id → override values
  const [overrides, setOverrides] = useState<Record<number, ExerciseOverride>>({});

  const selectedExerciseIds = Object.keys(overrides).map(Number);

  // Fetch real clients from API
  const { data: clientsData, isLoading: clientsLoading } = useQuery({
    queryKey: ['pt-clients'],
    queryFn:  () => api.get('/pt/clients').then(r => r.data.clients),
  });

  // Fetch real exercises from API
  const { data: exercisesData, isLoading: exercisesLoading } = useQuery({
    queryKey: ['pt-exercises'],
    queryFn:  () => api.get('/pt/exercises').then(r => {
      const d = r.data;
      return Array.isArray(d) ? d : (d.exercises ?? d.data ?? []);
    }),
  });

  const clients   = Array.isArray(clientsData)   ? clientsData   : [];
  const exercises = Array.isArray(exercisesData) ? exercisesData : [];

  const toggleExercise = (ex: any) => {
    setOverrides((prev) => {
      if (prev[ex.id]) {
        const next = { ...prev };
        delete next[ex.id];
        return next;
      }
      return {
        ...prev,
        [ex.id]: {
          sets:         ex.default_sets         ?? 3,
          reps:         ex.default_reps         ?? 10,
          hold_seconds: ex.default_hold_seconds ?? 0,
          pt_notes:     '',
        },
      };
    });
  };

  const updateOverride = (id: number, field: keyof ExerciseOverride, value: number | string) => {
    setOverrides((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const toggleDay = (day: string) =>
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );

  const createPlanMutation = useMutation({
    mutationFn: () =>
      api.post('/pt/plans', {
        client_id: parseInt(selectedClient),
        title:     planName,
        frequency: selectedDays.length > 0 ? 'custom' : 'daily',
        notes: [
          notes,
          selectedDays.length > 0 ? `Session days: ${selectedDays.join(', ')}` : null,
        ].filter(Boolean).join('\n') || null,
        exercises: selectedExerciseIds.map((id) => ({
          exercise_id:  id,
          sets:         overrides[id].sets,
          reps:         overrides[id].reps,
          hold_seconds: overrides[id].hold_seconds,
          pt_notes:     overrides[id].pt_notes || null,
        })),
      }),
    onSuccess: () => {
      const client = clients.find((c: any) => c.id === parseInt(selectedClient));
      setCreatedPlanName(planName);
      setCreatedClientName(client?.name ?? 'Client');
      setSubmitted(true);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to create plan.');
    },
  });

  const handleSubmit = () => {
    if (!planName || !selectedClient || selectedExerciseIds.length === 0) {
      toast.error('Please fill in all required fields and select at least one exercise.');
      return;
    }
    createPlanMutation.mutate();
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-2xl bg-success/20 flex items-center justify-center mb-6">
          <CheckCircle size={40} className="text-success" />
        </div>
        <h2 className="font-display font-bold text-2xl mb-2">Plan Created!</h2>
        <p className="text-muted-foreground mb-6">
          "{createdPlanName}" has been sent to {createdClientName}.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setPlanName("");
            setSelectedClient("");
            setOverrides({});
            setSelectedDays([]);
            setNotes("");
          }}
          className="gradient-primary text-white font-semibold px-6 py-2.5 rounded-xl shadow-primary hover:opacity-90 transition-opacity"
        >
          Create Another Plan
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up max-w-3xl">
      <div>
        <h1 className="font-display font-bold text-2xl">Create Exercise Plan</h1>
        <p className="text-muted-foreground text-sm mt-1">Build a personalised plan for your client.</p>
      </div>

      {/* Plan details */}
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border space-y-4">
        <h2 className="font-display font-semibold">Plan Details</h2>

        <div>
          <label className="block text-sm font-medium mb-1.5">Plan Name</label>
          <input
            type="text"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            placeholder="e.g. Knee Rehabilitation Phase 1"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Assign to Client</label>
          {clientsLoading ? (
            <div className="h-10 bg-muted rounded-xl animate-pulse" />
          ) : clients.length === 0 ? (
            <div className="p-3 rounded-xl bg-muted text-sm text-muted-foreground">
              No clients linked yet. Share your activation code with patients to get started.
            </div>
          ) : (
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            >
              <option value="">Select a client...</option>
              {clients.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.primary_condition ? `— ${c.primary_condition}` : ''}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Session Days</label>
          <div className="flex gap-2 flex-wrap">
            {days.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(day)}
                className={`w-12 h-12 rounded-xl text-sm font-semibold transition-all ${
                  selectedDays.includes(day)
                    ? "gradient-primary text-white shadow-primary"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Plan Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special instructions or notes for the client..."
            rows={2}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>
      </div>

      {/* Exercise selection */}
      <div>
        <h2 className="font-display font-semibold mb-1">Select Exercises</h2>
        <p className="text-muted-foreground text-sm mb-4">{selectedExerciseIds.length} selected</p>

        {exercisesLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-24 bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : exercises.length === 0 ? (
          <div className="p-8 text-center bg-muted rounded-2xl">
            <p className="text-3xl mb-2">🏋️</p>
            <p className="text-sm text-muted-foreground">
              No exercises in the library yet. Ask admin to add exercises.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {exercises.map((ex: any) => {
              const selected = !!overrides[ex.id];
              return (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => toggleExercise(ex)}
                  className={`text-left rounded-2xl border p-3 transition-all ${
                    selected
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                      : 'border-border bg-card hover:border-primary/40'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center mb-2 overflow-hidden">
                    {ex.illustration_url ? (
                      <img src={ex.illustration_url} alt={ex.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">🏃</span>
                    )}
                  </div>
                  <p className="text-xs font-semibold leading-tight line-clamp-2">{ex.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {ex.default_sets}×{ex.default_reps}
                  </p>
                  {selected && (
                    <span className="inline-block mt-1.5 text-xs bg-primary text-white px-1.5 py-0.5 rounded-full font-medium">
                      ✓ Added
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Per-exercise overrides — shown only when exercises are selected */}
      {selectedExerciseIds.length > 0 && (
        <div className="bg-card rounded-2xl border border-border shadow-card">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-display font-semibold">Customise Selected Exercises</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Adjust sets, reps, and hold time per exercise.</p>
          </div>
          <div className="divide-y divide-border">
            {selectedExerciseIds.map((id) => {
              const ex = exercises.find((e: any) => e.id === id);
              if (!ex) return null;
              const ov = overrides[id];
              return (
                <div key={id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                        {ex.illustration_url ? (
                          <img src={ex.illustration_url} alt={ex.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-base">🏃</span>
                        )}
                      </div>
                      <p className="text-sm font-semibold">{ex.title}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleExercise(ex)}
                      className="text-xs text-destructive hover:underline"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="flex gap-6">
                    <Stepper label="Sets" value={ov.sets} min={1} onChange={(v) => updateOverride(id, 'sets', v)} />
                    <Stepper label="Reps" value={ov.reps} min={1} onChange={(v) => updateOverride(id, 'reps', v)} />
                    <Stepper label="Hold (s)" value={ov.hold_seconds} min={0} onChange={(v) => updateOverride(id, 'hold_seconds', v)} />
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="PT notes for this exercise (optional)"
                      value={ov.pt_notes}
                      onChange={(e) => updateOverride(id, 'pt_notes', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Submit */}
      <div className="sticky bottom-4">
        <button
          onClick={handleSubmit}
          disabled={
            !planName ||
            !selectedClient ||
            selectedExerciseIds.length === 0 ||
            createPlanMutation.isPending
          }
          className="w-full gradient-primary text-white font-bold py-4 rounded-2xl shadow-primary hover:opacity-90 transition-opacity disabled:opacity-40 text-lg"
        >
          {createPlanMutation.isPending
            ? 'Creating...'
            : `Save Plan (${selectedExerciseIds.length} exercise${selectedExerciseIds.length !== 1 ? 's' : ''})`}
        </button>
      </div>
    </div>
  );
};

export default CreatePlan;
