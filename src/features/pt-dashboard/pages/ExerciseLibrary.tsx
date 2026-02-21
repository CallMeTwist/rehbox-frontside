// import { useState } from "react";
// import { Search, Plus } from "lucide-react";
// import ExerciseCard from "@/features/pt-dashboard/components/ExerciseCard";
// import { mockExercises } from "@/mock/data";

// const categories = ["All", "Lower Body", "Upper Body", "Core", "Balance", "Flexibility"];

// const ExerciseLibrary = () => {
//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("All");

//   const filtered = mockExercises.filter((e) => {
//     const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.bodyPart.toLowerCase().includes(search.toLowerCase());
//     const matchCat = category === "All" || e.category === category;
//     return matchSearch && matchCat;
//   });

//   return (
//     <div className="space-y-6 animate-slide-up">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="font-display font-bold text-2xl">Exercise Library</h1>
//           <p className="text-muted-foreground text-sm mt-1">{mockExercises.length} exercises available</p>
//         </div>
//         <button className="gradient-primary text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-primary hover:opacity-90 transition-opacity flex items-center gap-2">
//           <Plus size={16} /> Add Exercise
//         </button>
//       </div>
//       <div className="relative flex-1 min-w-48">
//         <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
//         <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search exercises..."
//           className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
//       </div>
//       <div className="flex gap-2 overflow-x-auto pb-1">
//         {categories.map((cat) => (
//           <button key={cat} onClick={() => setCategory(cat)}
//             className={`flex-shrink-0 text-sm font-medium px-4 py-1.5 rounded-full transition-all ${category === cat ? "gradient-primary text-white shadow-primary" : "bg-card border border-border hover:border-primary hover:text-primary"}`}>
//             {cat}
//           </button>
//         ))}
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//         {filtered.map((ex) => <ExerciseCard key={ex.id} exercise={ex} />)}
//         {filtered.length === 0 && (
//           <div className="col-span-full text-center py-16 text-muted-foreground">
//             <p className="text-4xl mb-3">🏋️</p><p className="font-medium">No exercises found</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ExerciseLibrary;


import { useExerciseLibrary } from '../hooks/useExerciseLibrary';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const CATEGORIES = [
  { value: '',           label: 'All' },
  { value: 'head_neck',  label: 'Head & Neck' },
  { value: 'upper_limb', label: 'Upper Limb' },
  { value: 'back',       label: 'Back' },
  { value: 'lower_limb', label: 'Lower Limb' },
];

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner:     'bg-success/10 text-success',
  intermediate: 'bg-warning/10 text-warning',
  advanced:     'bg-destructive/10 text-destructive',
};

const ExerciseLibrary = () => {
  const { exercises, isLoading, category, setCategory, search, setSearch } =
    useExerciseLibrary();

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="font-display font-bold text-2xl">Exercise Library</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Browse and add exercises to your clients' plans.
        </p>
      </div>

      {/* Search */}
      <Input
        placeholder="Search exercises..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              category === cat.value
                ? 'bg-primary text-white shadow-primary'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Exercise grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-52 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {exercises.map((ex: any) => (
            <div
              key={ex.id}
              className="bg-card rounded-2xl border border-border shadow-card card-hover overflow-hidden"
            >
              {/* Illustration */}
              <div className="h-32 bg-muted flex items-center justify-center">
                {ex.illustration_url ? (
                  <img
                    src={ex.illustration_url}
                    alt={ex.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl">🏃</span>
                )}
              </div>

              <div className="p-3">
                <p className="font-semibold text-sm leading-tight">{ex.title}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      DIFFICULTY_COLORS[ex.difficulty]
                    }`}
                  >
                    {ex.difficulty}
                  </span>
                </div>
                <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                  <span>{ex.default_sets} sets</span>
                  <span>{ex.default_reps} reps</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && exercises.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium">No exercises found</p>
          <p className="text-sm">Try a different search or category</p>
        </div>
      )}
    </div>
  );
};

export default ExerciseLibrary;