import { useState } from "react";
import { Bell, Clock, Trash2, Plus, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

type ReminderType = "exercise" | "posture" | "hydration" | "diet";
type DayName =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

interface Reminder {
  id: number;
  client_id: number;
  type: ReminderType;
  times: string[];
  days: DayName[];
  is_active: boolean;
}

const TYPES: { value: ReminderType; label: string }[] = [
  { value: "exercise", label: "Exercise 🏃" },
  { value: "posture", label: "Posture 🧍" },
  { value: "hydration", label: "Hydration 💧" },
  { value: "diet", label: "Diet 🥗" },
];

const DAYS: { value: DayName; label: string }[] = [
  { value: "monday", label: "Mon" },
  { value: "tuesday", label: "Tue" },
  { value: "wednesday", label: "Wed" },
  { value: "thursday", label: "Thu" },
  { value: "friday", label: "Fri" },
  { value: "saturday", label: "Sat" },
  { value: "sunday", label: "Sun" },
];

const labelFor = (t: ReminderType) => TYPES.find((x) => x.value === t)?.label ?? t;

const ReminderForm = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const qc = useQueryClient();
  const [type, setType] = useState<ReminderType>("exercise");
  const [time, setTime] = useState("08:00");
  const [times, setTimes] = useState<string[]>(["08:00"]);
  const [days, setDays] = useState<DayName[]>([
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
  ]);

  const create = useMutation({
    mutationFn: (payload: {
      type: ReminderType;
      times: string[];
      days: DayName[];
    }) => api.post("/client/reminders", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["client-reminders"] });
      toast.success("Reminder created");
      onClose();
    },
    onError: (err: any) => {
      const errors = err.response?.data?.errors;
      if (errors) {
        const first = Object.values(errors)[0] as string[];
        toast.error(first[0]);
      } else {
        toast.error(err.response?.data?.message ?? "Could not save reminder.");
      }
    },
  });

  const toggleDay = (d: DayName) =>
    setDays((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d]));

  const addTime = () => {
    if (!time) return;
    if (!times.includes(time)) setTimes((cur) => [...cur, time].sort());
  };

  const removeTime = (t: string) =>
    setTimes((cur) => cur.filter((x) => x !== t));

  const submit = () => {
    if (times.length === 0) {
      toast.error("Add at least one time.");
      return;
    }
    if (days.length === 0) {
      toast.error("Pick at least one day.");
      return;
    }
    create.mutate({ type, times, days });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-card w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg">New Reminder</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium mb-2">Type</p>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    type === t.value
                      ? "gradient-primary text-white shadow-primary"
                      : "bg-muted text-foreground hover:bg-muted/70"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Times</p>
            <div className="flex gap-2 mb-2">
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="flex-1 bg-card border border-border rounded-xl px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={addTime}
                className="gradient-primary text-white px-3 py-2 rounded-xl text-sm font-semibold"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {times.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => removeTime(t)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Days</p>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => toggleDay(d.value)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                    days.includes(d.value)
                      ? "gradient-primary text-white shadow-primary"
                      : "bg-muted text-foreground hover:bg-muted/70"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={submit}
            disabled={create.isPending}
            className="w-full gradient-primary text-white font-semibold py-3 rounded-xl shadow-primary hover:opacity-90 disabled:opacity-60"
          >
            {create.isPending ? "Saving…" : "Save reminder"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ReminderRow = ({ r }: { r: Reminder }) => {
  const qc = useQueryClient();
  const toggle = useMutation({
    mutationFn: () => api.patch(`/client/reminders/${r.id}/toggle`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["client-reminders"] }),
  });
  const remove = useMutation({
    mutationFn: () => api.delete(`/client/reminders/${r.id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["client-reminders"] });
      toast.success("Reminder removed");
    },
  });

  const dayLabels = r.days
    .map((d) => DAYS.find((x) => x.value === d)?.label ?? d)
    .join(", ");

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
        r.is_active ? "bg-muted/30 border-border" : "bg-muted/10 border-border opacity-60"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          r.is_active ? "gradient-primary" : "bg-muted"
        }`}
      >
        <Clock size={18} className={r.is_active ? "text-white" : "text-muted-foreground"} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold capitalize">{labelFor(r.type)}</p>
        <p className="text-xs text-muted-foreground truncate">
          {r.times.join(" · ")} — {dayLabels}
        </p>
      </div>
      <button
        onClick={() => toggle.mutate()}
        className={`text-xs px-3 py-1 rounded-full font-medium border ${
          r.is_active
            ? "bg-success/10 text-success border-success/30"
            : "bg-muted text-muted-foreground border-border"
        }`}
      >
        {r.is_active ? "On" : "Off"}
      </button>
      <button
        onClick={() => {
          if (confirm("Delete this reminder?")) remove.mutate();
        }}
        className="text-muted-foreground hover:text-destructive p-1"
        aria-label="Delete reminder"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

const Reminders = () => {
  const user = useAuthStore((s) => s.user);
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["client-reminders"],
    queryFn: async () => (await api.get("/client/reminders")).data.data as Reminder[],
    enabled: user?.role === "client",
  });

  const reminders = data ?? [];

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl">Reminders</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Stay on track with your rehabilitation schedule.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="gradient-primary text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-primary hover:opacity-90 flex items-center gap-2"
        >
          <Plus size={16} /> New
        </button>
      </div>

      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <h2 className="font-display font-semibold mb-4 flex items-center gap-2">
          <Bell size={16} /> Your Reminders
        </h2>
        {isLoading ? (
          <p className="text-muted-foreground text-sm text-center py-6">Loading…</p>
        ) : reminders.length > 0 ? (
          <div className="space-y-3">
            {reminders.map((r) => (
              <ReminderRow key={r.id} r={r} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-3xl mb-3">🔔</p>
            <p className="text-sm font-semibold text-foreground">No reminders yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Tap "New" to schedule your first session reminder.
            </p>
          </div>
        )}
      </div>

      {showForm && <ReminderForm onClose={() => setShowForm(false)} />}
    </div>
  );
};

export default Reminders;
