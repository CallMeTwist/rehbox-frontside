import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Lock, Play, Dumbbell } from "lucide-react";
import { useAuthStore, useIsFree } from "@/store/authStore";
import api from "@/features/shared/utils/api";

type Exercise = {
  id: number;
  title: string;
  area: string;
  area_label: string;
  category: string;
  category_label: string;
  difficulty?: string;
  thumbnail_url?: string | null;
  video: { source: string; url: string | null; youtube_id: string | null };
  is_locked: boolean;
  is_personalized: boolean;
};

const difficultyColor: Record<string, string> = {
  beginner:     "bg-green-100 text-green-700",
  intermediate: "bg-yellow-100 text-yellow-700",
  advanced:     "bg-red-100 text-red-700",
};

const ExerciseCard = ({ exercise, onClick }: { exercise: Exercise; onClick: () => void }) => (
  <button
    onClick={onClick}
    disabled={exercise.is_locked}
    className="group relative bg-card rounded-2xl overflow-hidden text-left border border-border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
  >
    {/* Thumbnail */}
    <div className="relative w-full aspect-video overflow-hidden bg-muted">
      {exercise.thumbnail_url ? (
        <img
          src={exercise.thumbnail_url}
          alt={exercise.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Dumbbell size={24} className="text-muted-foreground/40" />
        </div>
      )}

      {/* Play overlay on hover */}
      {!exercise.is_locked && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            <Play size={14} className="text-gray-900 ml-0.5" fill="currentColor" />
          </div>
        </div>
      )}

      {/* Lock overlay */}
      {exercise.is_locked && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <Lock size={20} className="text-white" />
        </div>
      )}

      {/* Personalized badge */}
      {exercise.is_personalized && (
        <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-gradient-primary text-white shadow-sm">
          My Plan
        </div>
      )}
    </div>

    {/* Content */}
    <div className="p-3">
      <p className="font-semibold text-sm leading-snug line-clamp-2 mb-1.5">{exercise.title}</p>
      <div className="flex items-center justify-between gap-1.5">
        <span className="text-xs text-muted-foreground truncate">{exercise.category_label}</span>
        {exercise.difficulty && (
          <span
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md flex-shrink-0 ${difficultyColor[exercise.difficulty] ?? "bg-muted text-muted-foreground"}`}
          >
            {exercise.difficulty}
          </span>
        )}
      </div>
    </div>
  </button>
);

const SkeletonCard = () => (
  <div className="rounded-2xl overflow-hidden border border-border animate-pulse">
    <div className="w-full aspect-video bg-muted" />
    <div className="p-3 space-y-2">
      <div className="h-3.5 bg-muted rounded w-3/4" />
      <div className="h-3 bg-muted rounded w-1/2" />
    </div>
  </div>
);

const ClientExercises = () => {
  const user = useAuthStore((s) => s.user);
  const isFree = useIsFree();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["client-exercises-library", isFree ? "flat" : "grouped"],
    queryFn: async () => (await api.get("/client/exercises")).data.data as Exercise[],
    enabled: user?.role === "client",
  });

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="h-8 bg-muted rounded w-48 mb-6 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  const flat = data ?? [];

  const gridCls = "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3";

  if (isFree) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-5">
          <h1 className="font-display font-bold text-2xl">Exercise Library</h1>
          {flat.length > 0 && (
            <span className="text-sm text-muted-foreground">{flat.length} exercises</span>
          )}
        </div>
        {flat.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Dumbbell size={40} className="mx-auto mb-3 opacity-30" />
            <p>No exercises available yet.</p>
          </div>
        ) : (
          <div className={gridCls}>
            {flat.map((ex) => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                onClick={() => !ex.is_locked && navigate(`/client/session/${ex.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const grouped = flat.reduce<Record<string, { label: string; items: Exercise[] }>>((acc, ex) => {
    if (!acc[ex.area]) acc[ex.area] = { label: ex.area_label, items: [] };
    acc[ex.area].items.push(ex);
    return acc;
  }, {});

  const entries = Object.entries(grouped);

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-2xl">Exercise Library</h1>
        {flat.length > 0 && (
          <span className="text-sm text-muted-foreground">{flat.length} exercises</span>
        )}
      </div>
      {entries.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Dumbbell size={40} className="mx-auto mb-3 opacity-30" />
          <p>No exercises available yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {entries.map(([area, { label, items }]) => (
            <section key={area}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="font-display font-bold text-base">{label}</h2>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{items.length}</span>
              </div>
              <div className={gridCls}>
                {items.map((ex) => (
                  <ExerciseCard
                    key={ex.id}
                    exercise={ex}
                    onClick={() => !ex.is_locked && navigate(`/client/session/${ex.id}`)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientExercises;
