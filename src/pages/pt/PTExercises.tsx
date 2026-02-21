import { useState } from "react";
import { Search, Plus, Filter } from "lucide-react";
import ExerciseCard from "@/components/shared/ExerciseCard";
import { mockExercises } from "@/mock/data";

const categories = ["All", "Lower Body", "Upper Body", "Core", "Balance", "Flexibility"];

const PTExercises = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = mockExercises.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.bodyPart.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || e.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl">Exercise Library</h1>
          <p className="text-muted-foreground text-sm mt-1">{mockExercises.length} exercises available</p>
        </div>
        <button className="gradient-primary text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-primary hover:opacity-90 transition-opacity flex items-center gap-2">
          <Plus size={16} />
          Add Exercise
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exercises..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-shrink-0 text-sm font-medium px-4 py-1.5 rounded-full transition-all ${
              category === cat
                ? "gradient-primary text-white shadow-primary"
                : "bg-card border border-border hover:border-primary hover:text-primary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((ex) => (
          <ExerciseCard key={ex.id} exercise={ex} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-muted-foreground">
            <p className="text-4xl mb-3">🏋️</p>
            <p className="font-medium">No exercises found</p>
            <p className="text-sm">Try a different search or category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PTExercises;
