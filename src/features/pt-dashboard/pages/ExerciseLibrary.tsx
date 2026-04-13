// src/features/pt-dashboard/pages/ExerciseLibrary.tsx
import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useExerciseLibrary, Exercise } from '../hooks/useExerciseLibrary';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import VideoPlayer from '@/features/shared/components/VideoPlayer';

const PAGE_SIZE = 12;

const AREAS = [
  { value: '',                    label: 'All Areas' },
  { value: 'neck',                label: 'Neck' },
  { value: 'shoulder',            label: 'Shoulder' },
  { value: 'elbow_forearm_wrist', label: 'Elbow / Forearm / Wrist' },
  { value: 'back',                label: 'Back' },
  { value: 'lower_limb',          label: 'Lower Limb' },
];

const CATEGORIES = [
  { value: '',               label: 'All Types' },
  { value: 'strengthening',  label: 'Strengthening' },
  { value: 'stretching',     label: 'Stretching' },
  { value: 'rom',            label: 'Range of Motion' },
  { value: 'functional',     label: 'Functional' },
  { value: 'endurance',      label: 'Endurance' },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner:     'bg-success/10 text-success',
  intermediate: 'bg-warning/10 text-warning',
  advanced:     'bg-destructive/10 text-destructive',
};

const AREA_LABELS: Record<string, string> = {
  neck:                'Neck',
  shoulder:            'Shoulder',
  elbow_forearm_wrist: 'Elbow / Forearm / Wrist',
  back:                'Back',
  lower_limb:          'Lower Limb',
};

const CATEGORY_LABELS: Record<string, string> = {
  strengthening: 'Strengthening',
  stretching:    'Stretching',
  rom:           'Range of Motion',
  functional:    'Functional',
  endurance:     'Endurance',
};

const FilterPills = ({
  options,
  active,
  onSelect,
}: {
  options: { value: string; label: string }[];
  active: string;
  onSelect: (v: string) => void;
}) => (
  <div className="flex gap-2 flex-wrap">
    {options.map((opt) => (
      <button
        key={opt.value}
        onClick={() => onSelect(opt.value)}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
          active === opt.value
            ? 'bg-primary text-white shadow-primary'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        }`}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

// Side drawer showing full exercise details + video
const ExerciseDrawer = ({
  exercise,
  onClose,
}: {
  exercise: Exercise;
  onClose: () => void;
}) => (
  <>
    {/* Backdrop */}
    <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

    {/* Drawer panel */}
    <div className="fixed right-0 top-0 h-full w-full max-w-md bg-card shadow-2xl z-50 flex flex-col overflow-hidden animate-slide-left">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-border flex-shrink-0">
        <h2 className="font-display font-bold text-lg leading-tight pr-4">{exercise.title}</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-xl hover:bg-muted transition-colors flex-shrink-0"
        >
          <X size={18} />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        {/* Media */}
        {exercise.video_url ? (
          <VideoPlayer src={exercise.video_url} className="rounded-none" />
        ) : exercise.illustration_url ? (
          <img
            src={exercise.illustration_url}
            alt={exercise.title}
            className="w-full aspect-video object-cover"
          />
        ) : (
          <div className="w-full aspect-video bg-muted flex items-center justify-center">
            <span className="text-7xl">🏃</span>
          </div>
        )}

        <div className="p-6 space-y-5">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${DIFFICULTY_COLORS[exercise.difficulty] ?? ''}`}>
              {exercise.difficulty}
            </span>
            {exercise.area && (
              <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-primary/10 text-primary">
                {AREA_LABELS[exercise.area] ?? exercise.area}
              </span>
            )}
            {exercise.category && (
              <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-muted text-muted-foreground">
                {CATEGORY_LABELS[exercise.category] ?? exercise.category}
              </span>
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Sets',    value: exercise.default_sets },
              { label: 'Reps',    value: exercise.default_reps },
              { label: 'Hold (s)', value: exercise.default_hold_seconds },
            ].map((s) => (
              <div key={s.label} className="bg-muted rounded-2xl p-3 text-center">
                <p className="text-xl font-display font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          {exercise.description && (
            <div>
              <h3 className="text-sm font-semibold mb-1.5">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{exercise.description}</p>
            </div>
          )}

          {/* Instructions */}
          {exercise.instructions_en && (
            <div>
              <h3 className="text-sm font-semibold mb-1.5">Instructions</h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {exercise.instructions_en}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  </>
);

const ExerciseLibrary = () => {
  const {
    exercises, isLoading,
    area, setArea,
    category, setCategory,
    search, setSearch,
  } = useExerciseLibrary();

  const [page, setPage]                           = useState(1);
  const [selectedExercise, setSelectedExercise]   = useState<Exercise | null>(null);

  const handleSearch   = (v: string) => { setSearch(v);   setPage(1); };
  const handleArea     = (v: string) => { setArea(v);     setPage(1); };
  const handleCategory = (v: string) => { setCategory(v); setPage(1); };

  const totalPages = Math.max(1, Math.ceil(exercises.length / PAGE_SIZE));
  const paginated  = exercises.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-5 animate-slide-up">
      <div>
        <h1 className="font-display font-bold text-2xl">Exercise Library</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {isLoading ? 'Loading…' : `${exercises.length} exercises available`}
        </p>
      </div>

      {/* Search */}
      <Input
        placeholder="Search exercises..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="max-w-sm"
      />

      {/* Area tabs */}
      <div className="space-y-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Body Area</p>
        <FilterPills options={AREAS} active={area} onSelect={handleArea} />
      </div>

      {/* Category tabs */}
      <div className="space-y-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Exercise Type</p>
        <FilterPills options={CATEGORIES} active={category} onSelect={handleCategory} />
      </div>

      {/* Exercise grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <Skeleton key={i} className="h-52 rounded-2xl" />
          ))}
        </div>
      ) : paginated.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium">No exercises found</p>
          <p className="text-sm">Try a different search, area, or type</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginated.map((ex: Exercise) => (
            <button
              key={ex.id}
              onClick={() => setSelectedExercise(ex)}
              className="text-left bg-card rounded-2xl border border-border shadow-card card-hover overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {/* Illustration */}
              <div className="h-32 bg-muted flex items-center justify-center overflow-hidden relative">
                {ex.illustration_url ? (
                  <img
                    src={ex.illustration_url}
                    alt={ex.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl">🏃</span>
                )}
                {ex.video_url && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                      <span className="text-lg">▶</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3">
                <p className="font-semibold text-sm leading-tight">{ex.title}</p>
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${DIFFICULTY_COLORS[ex.difficulty] ?? ''}`}>
                    {ex.difficulty}
                  </span>
                  {ex.category && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-muted text-muted-foreground capitalize">
                      {CATEGORY_LABELS[ex.category] ?? ex.category}
                    </span>
                  )}
                </div>
                <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                  <span>{ex.default_sets} sets</span>
                  <span>{ex.default_reps} reps</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && exercises.length > PAGE_SIZE && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-xl bg-muted hover:bg-muted/80 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-medium text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-xl bg-muted hover:bg-muted/80 disabled:opacity-40 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Exercise detail drawer */}
      {selectedExercise && (
        <ExerciseDrawer
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}
    </div>
  );
};

export default ExerciseLibrary;
