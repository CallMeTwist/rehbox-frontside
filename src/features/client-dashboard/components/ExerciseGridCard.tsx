import { CheckCircle, Play } from 'lucide-react';

interface Props {
  exercise: {
    id: number | string;
    title: string;
    illustration_url?: string | null;
    sets?: number;
    reps?: number;
    duration?: number;
    scheduled_days?: string[] | string | null;
    completed?: boolean;
  };
  onTap: () => void;
  delay?: number;
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function coerceDays(input: Props['exercise']['scheduled_days']): string[] {
  if (!input) return [];
  if (Array.isArray(input)) return input.map((d) => String(d).toLowerCase());
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed.map((d) => String(d).toLowerCase()) : [];
      } catch {
        return [];
      }
    }
    return trimmed
      .split(',')
      .map((d) => d.trim().toLowerCase())
      .filter(Boolean);
  }
  return [];
}

const ExerciseGridCard = ({ exercise, onTap, delay = 0 }: Props) => {
  const days = coerceDays(exercise.scheduled_days);
  const hasSetsReps =
    typeof exercise.sets === 'number' && typeof exercise.reps === 'number';

  return (
    <button
      type="button"
      onClick={onTap}
      className="bg-card rounded-2xl overflow-hidden text-left shadow-card hover:shadow-lg transition-shadow border border-border animate-slide-up flex flex-col"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative w-full aspect-square">
        {exercise.illustration_url ? (
          <img
            src={exercise.illustration_url}
            alt={exercise.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-primary/10 to-muted" />
        )}

        {/* Day dots top-left */}
        <div className="absolute top-2 left-2 flex gap-0.5 bg-black/30 backdrop-blur-sm rounded-full px-1.5 py-1">
          {DAY_LABELS.map((label) => {
            const key = label.toLowerCase();
            const active =
              days.includes(key) ||
              days.includes(label) ||
              days.includes(label.toLowerCase()) ||
              days.some((d) => d.startsWith(key));
            return (
              <span
                key={label}
                title={label}
                className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-primary' : 'bg-white/30'}`}
              />
            );
          })}
        </div>

        {/* Status icon top-right */}
        <div className="absolute top-2 right-2">
          {exercise.completed ? (
            <CheckCircle size={22} className="text-emerald-400 fill-emerald-500/20" />
          ) : (
            <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center shadow-primary">
              <Play size={12} className="text-white fill-white ml-0.5" />
            </div>
          )}
        </div>
      </div>

      <div className="p-3 flex-1">
        <p className="font-semibold text-sm line-clamp-2">{exercise.title}</p>
        {hasSetsReps && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {exercise.sets} × {exercise.reps}
          </p>
        )}
      </div>
    </button>
  );
};

export default ExerciseGridCard;
