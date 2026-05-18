import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Search } from 'lucide-react';
import { useExerciseLibrary, type LibraryFilters } from '../hooks/useExerciseLibrary';
import type { Exercise, ExerciseArea } from '@/types/exercise';

const AREAS: { value: ExerciseArea; label: string }[] = [
  { value: 'general', label: 'General Exercises' },
  { value: 'back', label: 'Back' },
  { value: 'chest', label: 'Chest' },
  { value: 'head_neck', label: 'Head & Neck' },
  { value: 'upper_limbs', label: 'Upper Limbs' },
  { value: 'lower_limbs', label: 'Lower Limbs' },
  { value: 'elbow_forearm_wrist', label: 'Elbow, Forearm & Wrist' },
  { value: 'pelvic', label: 'Pelvic' },
];

export default function ExerciseLibrary() {
  const [filters, setFilters] = useState<LibraryFilters>({});
  const [search, setSearch] = useState('');
  const { data: exercises = [], isLoading } = useExerciseLibrary(filters);

  const filtered = exercises.filter((e) =>
    e.title.toLowerCase().includes(search.toLowerCase()),
  );

  const grouped = filtered.reduce<Record<string, Exercise[]>>((acc, e) => {
    (acc[e.area_label] ??= []).push(e);
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="space-y-6 p-4"
    >
      <header className="space-y-3">
        <h1 className="text-2xl font-bold text-blue-dark">Exercise Library</h1>
        <div className="flex items-center gap-2 rounded-full bg-muted-blue px-4 py-2">
          <Search className="h-4 w-4 text-blue-mid" />
          <input
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm outline-none placeholder:text-blue-mid/60"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {AREAS.map((a) => (
            <button
              key={a.value}
              onClick={() => setFilters((f) => ({ ...f, area: f.area === a.value ? undefined : a.value }))}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                filters.area === a.value
                  ? 'bg-blue-primary text-white'
                  : 'bg-muted-blue text-blue-mid hover:bg-blue-mid/20'
              }`}
            >
              {a.label}
            </button>
          ))}
        </div>
      </header>

      {isLoading && (
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-video animate-pulse rounded-lg bg-muted-blue" />
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="rounded-lg bg-muted-blue p-8 text-center">
          <p className="text-2xl">🔍</p>
          <p className="mt-2 font-semibold text-blue-dark">No exercises match</p>
          <p className="text-sm text-blue-mid">Try clearing the filters or search.</p>
        </div>
      )}

      {!isLoading && Object.entries(grouped).map(([region, items]) => (
        <section key={region} className="space-y-3">
          <h2 className="text-lg font-semibold text-blue-dark">{region}</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {items.map((ex) => (
              <Link
                key={ex.id}
                to={`/library/${ex.id}`}
                className="group relative overflow-hidden rounded-lg bg-white shadow transition hover:-translate-y-0.5 hover:shadow-elevated"
              >
                <div className="relative aspect-video bg-muted-blue">
                  {ex.thumbnail_url && (
                    <img src={ex.thumbnail_url} alt="" className="h-full w-full object-cover" loading="lazy" />
                  )}
                  {ex.is_locked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                      <Lock className="h-6 w-6 text-hot-pink" />
                    </div>
                  )}
                  <span
                    className={`absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      ex.access_tier === 'free'
                        ? 'border border-blue-mid/20 bg-blue-mid/10 text-blue-mid'
                        : 'bg-gradient-pink text-white'
                    }`}
                  >
                    {ex.access_tier === 'free' ? 'Free' : 'Premium'}
                  </span>
                </div>
                <p className="p-2 text-sm font-medium text-blue-dark">{ex.title}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </motion.div>
  );
}
