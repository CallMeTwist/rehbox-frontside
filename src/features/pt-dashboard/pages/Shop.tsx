// src/features/pt-dashboard/pages/Shop.tsx
import { useState } from "react";
import { ShoppingCart, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

// PT views shop as a catalogue to recommend — they don't purchase
const categories = ["All", "hydration", "equipment", "recovery", "apparel"];
const CATEGORY_LABELS: Record<string, string> = {
  All:        'All',
  hydration:  'Hydration',
  equipment:  'Equipment',
  recovery:   'Recovery',
  apparel:    'Apparel',
};

const PTShop = () => {
  const [category, setCategory] = useState("All");

  const { data, isLoading } = useQuery({
    queryKey: ['shop-items', category],
    queryFn:  () =>
      api.get('/client/shop', {
        params: category !== 'All' ? { category } : {},
      }).then(r => r.data),
  });

  const items = data?.items ?? [];

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl">Shop</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Recommend products to your clients
          </p>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-shrink-0 text-sm font-medium px-4 py-1.5 rounded-full transition-all ${
              category === cat
                ? "gradient-primary text-white shadow-primary"
                : "bg-card border border-border hover:border-primary"
            }`}
          >
            {CATEGORY_LABELS[cat] ?? cat}
          </button>
        ))}
      </div>

      {/* Items grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-4xl mb-3">🛍️</p>
          <p className="text-sm">No items in this category yet.</p>
          <p className="text-xs mt-1">Admin can add items from the admin panel.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item: any) => (
            <div
              key={item.id}
              className="bg-card rounded-2xl overflow-hidden shadow-card card-hover border border-border"
            >
              <div className="relative">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-44 object-cover"
                  />
                ) : (
                  <div className="w-full h-44 bg-muted flex items-center justify-center">
                    <span className="text-4xl">📦</span>
                  </div>
                )}
                {!item.in_stock && (
                  <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                    <span className="badge-locked text-sm px-3 py-1">Out of Stock</span>
                  </div>
                )}
                <span className="absolute top-2 left-2 bg-muted/80 text-xs font-medium px-2 py-0.5 rounded-full backdrop-blur-sm capitalize">
                  {item.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm mb-3">{item.name}</h3>
                <div className="mb-3">
                  {item.cash_price && (
                    <p className="font-display font-bold text-lg">
                      ₦{Number(item.cash_price).toLocaleString()}
                    </p>
                  )}
                  {item.coin_cost && (
                    <p className="text-xs text-muted-foreground">
                      or {item.coin_cost} 🪙 coins
                    </p>
                  )}
                </div>
                <div className={`w-full text-center text-xs font-semibold py-2 rounded-xl ${
                  item.in_stock
                    ? 'bg-primary/10 text-primary'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {item.in_stock ? 'Available' : 'Out of Stock'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PTShop;