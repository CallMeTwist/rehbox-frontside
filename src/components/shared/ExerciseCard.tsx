import { Clock, Dumbbell, Star, ChevronRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Exercise {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  duration: number;
  reps: number;
  sets: number;
  thumbnail: string;
  description: string;
  bodyPart: string;
}

interface ExerciseCardProps {
  exercise: Exercise;
  showStart?: boolean;
  showSelect?: boolean;
  selected?: boolean;
  onSelect?: (id: string) => void;
}

const difficultyColor: Record<string, string> = {
  Beginner: "bg-success/10 text-success",
  Intermediate: "bg-warning/10 text-warning",
  Advanced: "bg-destructive/10 text-destructive",
};

const ExerciseCard = ({ exercise, showStart, showSelect, selected, onSelect }: ExerciseCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      className={`bg-card rounded-2xl overflow-hidden shadow-card card-hover border-2 transition-all duration-150 ${
        selected ? "border-primary shadow-primary" : "border-transparent"
      }`}
    >
      <div className="relative">
        <img
          src={exercise.thumbnail}
          alt={exercise.name}
          className="w-full h-40 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span className={`absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full ${difficultyColor[exercise.difficulty] || "bg-muted text-muted-foreground"}`}>
          {exercise.difficulty}
        </span>
        <span className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
          {exercise.category}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-display font-semibold text-sm mb-1">{exercise.name}</h3>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{exercise.description}</p>

        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {exercise.duration}min
          </span>
          <span className="flex items-center gap-1">
            <Dumbbell size={12} />
            {exercise.sets}×{exercise.reps}
          </span>
          <span className="flex items-center gap-1">
            <Star size={12} />
            {exercise.bodyPart}
          </span>
        </div>

        {showStart && (
          <button
            onClick={() => navigate(`/client/session/${exercise.id}`)}
            className="w-full gradient-primary text-white text-sm font-semibold py-2 rounded-xl shadow-primary hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Play size={14} />
            Start Session
          </button>
        )}

        {showSelect && (
          <button
            onClick={() => onSelect?.(exercise.id)}
            className={`w-full text-sm font-semibold py-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
              selected
                ? "bg-primary text-white shadow-primary"
                : "border border-border hover:border-primary hover:text-primary"
            }`}
          >
            {selected ? "✓ Selected" : "Select Exercise"}
          </button>
        )}

        {!showStart && !showSelect && (
          <button className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
            View details <ChevronRight size={12} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ExerciseCard;
