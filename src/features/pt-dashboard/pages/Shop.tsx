import { useState } from "react";
import { ShoppingCart, Star } from "lucide-react";
import { mockShopItems } from "@/mock/data";

const categories = ["All", "Equipment", "Recovery", "Education", "Digital"];

const Shop = () => {
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<string[]>([]);
  const filtered = category === "All" ? mockShopItems : mockShopItems.filter((i) => i.category === category);
  const addToCart = (id: string) => setCart((prev) => prev.includes(id) ? prev : [...prev, id]);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display font-bold text-2xl">Shop</h1><p className="text-muted-foreground text-sm mt-1">Recommend products to your clients</p></div>
        <button className="gradient-primary text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-primary">
          <ShoppingCart size={16} /> Cart {cart.length > 0 && <span className="bg-white/20 rounded-full px-1.5 text-xs">{cart.length}</span>}
        </button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`flex-shrink-0 text-sm font-medium px-4 py-1.5 rounded-full transition-all ${category === cat ? "gradient-primary text-white shadow-primary" : "bg-card border border-border hover:border-primary"}`}>{cat}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div key={item.id} className="bg-card rounded-2xl overflow-hidden shadow-card card-hover border border-border">
            <div className="relative">
              <img src={item.image} alt={item.name} className="w-full h-44 object-cover" />
              {!item.inStock && <div className="absolute inset-0 bg-background/70 flex items-center justify-center"><span className="badge-locked text-sm px-3 py-1">Out of Stock</span></div>}
              <span className="absolute top-2 left-2 bg-muted/80 text-xs font-medium px-2 py-0.5 rounded-full backdrop-blur-sm">{item.category}</span>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-sm mb-1">{item.name}</h3>
              <div className="flex items-center gap-1 mb-3"><Star size={12} className="text-warning fill-warning" /><span className="text-xs font-medium">{item.rating}</span><span className="text-xs text-muted-foreground">({item.reviews})</span></div>
              <div className="mb-3"><p className="font-display font-bold text-lg">₦{item.price.toLocaleString()}</p><p className="text-xs text-muted-foreground">or use {item.coinDiscount} 🪙</p></div>
              <button onClick={() => addToCart(item.id)} disabled={!item.inStock || cart.includes(item.id)}
                className={`w-full text-sm font-semibold py-2 rounded-xl transition-all ${cart.includes(item.id) ? "bg-success/10 text-success border border-success/30" : item.inStock ? "gradient-primary text-white shadow-primary hover:opacity-90" : "bg-muted text-muted-foreground cursor-not-allowed"}`}>
                {cart.includes(item.id) ? "✓ Added" : item.inStock ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
