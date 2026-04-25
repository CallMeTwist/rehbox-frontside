import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore, useIsFree } from "@/store/authStore";
import api from "@/features/shared/utils/api";

type Exercise = {
  id: number;
  title: string;
  area?: string;
  category?: string;
  difficulty?: string;
  description?: string;
  illustration_url?: string | null;
  video_url?: string | null;
  is_personalized: boolean;
  exercise_type?: string;
};

const ExerciseCard = ({ exercise, onClick }: { exercise: Exercise; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="bg-card rounded-2xl overflow-hidden text-left hover:shadow-lg transition-shadow border border-border"
  >
    {exercise.illustration_url ? (
      <img
        src={exercise.illustration_url}
        alt={exercise.title}
        className="w-full aspect-square object-cover"
      />
    ) : (
      <div className="w-full aspect-square bg-muted flex items-center justify-center text-muted-foreground text-sm">
        No image
      </div>
    )}
    <div className="p-3">
      <p className="font-semibold text-sm line-clamp-2">{exercise.title}</p>
      {exercise.category && (
        <p className="text-xs text-muted-foreground capitalize mt-1">
          {exercise.category.replace(/_/g, " ")}
        </p>
      )}
    </div>
  </button>
);

const ClientExercises = () => {
  const user = useAuthStore((s) => s.user);
  const isFree = useIsFree();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["client-exercises-library", isFree ? "flat" : "grouped"],
    queryFn: async () => (await api.get("/client/exercises")).data.data,
    enabled: user?.role === "client",
  });

  if (isLoading) {
    return <div className="p-6 text-center text-muted-foreground">Loading exercises…</div>;
  }

  if (isFree) {
    const flat = (data ?? []) as Exercise[];
    return (
      <div className="p-2">
        <h1 className="font-display font-bold text-2xl mb-4">Exercise Library</h1>
        {flat.length === 0 ? (
          <p className="text-muted-foreground">No exercises available yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {flat.map((ex) => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                onClick={() => navigate(`/client/session/${ex.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const grouped = (data ?? {}) as Record<string, Exercise[]>;
  const entries = Object.entries(grouped);

  return (
    <div className="p-2">
      <h1 className="font-display font-bold text-2xl mb-6">Exercise Library</h1>
      {entries.length === 0 ? (
        <p className="text-muted-foreground">No exercises available yet.</p>
      ) : (
        <div className="space-y-6">
          {entries.map(([category, items]) => (
            <section key={category}>
              <h2 className="font-display font-bold text-lg mb-3 capitalize">
                {category.replace(/_/g, " ")}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {items.map((ex) => (
                  <ExerciseCard
                    key={ex.id}
                    exercise={ex}
                    onClick={() => navigate(`/client/session/${ex.id}`)}
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
