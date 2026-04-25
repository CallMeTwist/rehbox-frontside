import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Check } from "lucide-react";
import api from "@/features/shared/utils/api";
import { useAuthStore } from "@/store/authStore";

type Exercise = {
  id: number;
  title: string;
  area?: string;
  category?: string;
  difficulty?: string;
  description?: string;
  illustration_url?: string | null;
  default_sets?: number | null;
  default_reps?: number | null;
};

const DAYS: { value: string; label: string }[] = [
  { value: "mon", label: "Mon" },
  { value: "tue", label: "Tue" },
  { value: "wed", label: "Wed" },
  { value: "thu", label: "Thu" },
  { value: "fri", label: "Fri" },
  { value: "sat", label: "Sat" },
  { value: "sun", label: "Sun" },
];

const MAX_EXERCISES = 3;

const PlanBuild = () => {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("My Plan");
  const [selectedExercises, setSelectedExercises] = useState<number[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>(["mon", "wed", "fri"]);

  const { data: exercises, isLoading } = useQuery({
    queryKey: ["client-exercises-library", "flat"],
    queryFn: async () => (await api.get("/client/exercises")).data.data as Exercise[],
    enabled: user?.role === "client",
  });

  const saveMutation = useMutation({
    mutationFn: async () =>
      (
        await api.post("/client/plans/self", {
          title,
          exercise_ids: selectedExercises,
          scheduled_days: selectedDays,
        })
      ).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-plan"] });
      toast.success("Plan saved!");
      navigate("/client/plan");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Could not save plan");
    },
  });

  const toggleExercise = (id: number) => {
    setSelectedExercises((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= MAX_EXERCISES) {
        return prev;
      }
      return [...prev, id];
    });
  };

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const canSave =
    selectedExercises.length > 0 && selectedDays.length > 0 && title.trim().length > 0;

  const flat = (exercises ?? []) as Exercise[];
  const limitReached = selectedExercises.length >= MAX_EXERCISES;

  return (
    <div className="pb-28 space-y-6 animate-slide-up">
      <div>
        <h1 className="font-display font-bold text-2xl">Build Your Plan</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Pick up to {MAX_EXERCISES} exercises and the days you'll do them.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold">Plan name</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Plan"
          className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold">Schedule</label>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((d) => {
            const active = selectedDays.includes(d.value);
            return (
              <button
                key={d.value}
                type="button"
                onClick={() => toggleDay(d.value)}
                className={`px-3 py-2 rounded-full text-xs font-semibold border transition-colors ${
                  active
                    ? "bg-primary text-white border-primary shadow-primary"
                    : "bg-card border-border text-muted-foreground hover:bg-muted/40"
                }`}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold">Exercises</label>
          <span className="text-xs text-muted-foreground">
            {selectedExercises.length}/{MAX_EXERCISES} selected
          </span>
        </div>

        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading exercises…</p>
        ) : flat.length === 0 ? (
          <p className="text-sm text-muted-foreground">No exercises available yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {flat.map((ex) => {
              const selected = selectedExercises.includes(ex.id);
              const disabled = !selected && limitReached;
              return (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => toggleExercise(ex.id)}
                  disabled={disabled}
                  className={`relative bg-card rounded-2xl overflow-hidden text-left border transition-all ${
                    selected
                      ? "border-primary shadow-md ring-2 ring-primary/30"
                      : "border-border"
                  } ${disabled ? "opacity-40 cursor-not-allowed" : "hover:shadow-md"}`}
                >
                  {selected && (
                    <div className="absolute top-2 right-2 z-10 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                      <Check size={14} />
                    </div>
                  )}
                  {ex.illustration_url ? (
                    <img
                      src={ex.illustration_url}
                      alt={ex.title}
                      className="w-full aspect-square object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-square bg-muted flex items-center justify-center text-muted-foreground text-sm">
                      No image
                    </div>
                  )}
                  <div className="p-3">
                    <p className="font-semibold text-sm line-clamp-2">{ex.title}</p>
                    {ex.category && (
                      <p className="text-xs text-muted-foreground capitalize mt-1">
                        {ex.category.replace(/_/g, " ")}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur border-t border-border p-4 z-40">
        <div className="max-w-2xl mx-auto">
          <button
            type="button"
            onClick={() => saveMutation.mutate()}
            disabled={!canSave || saveMutation.isPending}
            className="w-full gradient-primary text-white font-semibold rounded-xl py-3 shadow-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saveMutation.isPending ? "Saving…" : "Save Plan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlanBuild;
