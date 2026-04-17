// src/features/client-dashboard/pages/Shop.tsx
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useShop } from '../hooks/useRewards';
import { Skeleton } from '@/components/ui/skeleton';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { ComingSoon } from '../components/ComingSoon';

const CATEGORIES = [
  { value: '',           label: 'All' },
  { value: 'hydration',  label: '💧 Hydration' },
  { value: 'equipment',  label: '🏋️ Equipment' },
  { value: 'recovery',   label: '🧊 Recovery' },
  { value: 'apparel',    label: '👕 Apparel' },
];

const SHOP_ENABLED = false;

const Shop = () => {
  const [category, setCategory]       = useState('');
  const [selected, setSelected]       = useState<any>(null);
  const [address, setAddress]         = useState('');
  const [payMethod, setPayMethod]     = useState<'coins' | 'cash'>('coins');
  const qc = useQueryClient();

  const { data, isLoading } = useShop(category);

  if (!SHOP_ENABLED) {
    return (
      <ComingSoon
        title="Shop Coming Soon"
        subtitle="Earn coins now by exercising with great form. You'll be able to spend them here very soon."
        backTo="/client"
      />
    );
  }

  const purchaseMutation = useMutation({
    mutationFn: () =>
      api.post(`/client/shop/${selected.id}/purchase`, {
        payment_method:   payMethod,
        delivery_address: address,
      }),
    onSuccess: ({ data: res }) => {
      toast.success(`Order placed! New balance: ${res.new_balance} 🪙`);
      qc.invalidateQueries({ queryKey: ['shop'] });
      qc.invalidateQueries({ queryKey: ['client-rewards'] });
      setSelected(null);
      setAddress('');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Purchase failed.');
    },
  });

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl">Shop</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Spend coins or pay cash for recovery gear
          </p>
        </div>
        {data && (
          <div className="bg-primary/10 rounded-xl px-3 py-2 text-center">
            <p className="font-bold text-primary">{data.coin_balance}</p>
            <p className="text-xs text-muted-foreground">coins</p>
          </div>
        )}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button key={cat.value} onClick={() => setCategory(cat.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              category === cat.value
                ? 'bg-primary text-white'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Items grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-52 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {data?.items?.map((item: any) => (
            <button key={item.id} onClick={() => setSelected(item)}
              className={`bg-card rounded-2xl border text-left overflow-hidden transition-all card-hover ${
                !item.in_stock ? 'opacity-50' : 'border-border hover:border-primary/40'
              }`}>
              <div className="h-32 bg-muted flex items-center justify-center">
                {item.image_url
                  ? <img src={item.image_url} alt={item.name}
                      className="w-full h-full object-cover" />
                  : <span className="text-4xl">📦</span>
                }
              </div>
              <div className="p-3">
                <p className="font-semibold text-sm leading-tight">{item.name}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {item.coin_cost && (
                    <span className="text-xs bg-warning/10 text-warning font-bold px-2 py-0.5 rounded-full">
                      {item.coin_cost} 🪙
                    </span>
                  )}
                  {item.cash_price && (
                    <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                      ₦{Number(item.cash_price).toLocaleString()}
                    </span>
                  )}
                </div>
                {!item.in_stock && (
                  <p className="text-xs text-destructive mt-1 font-medium">Out of stock</p>
                )}
                {item.can_afford_with_coins && item.in_stock && (
                  <p className="text-xs text-success mt-1 font-medium">✓ You can afford this</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Purchase modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-4">
          <div className="bg-card rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-display font-bold text-lg">{selected.name}</h3>
                <p className="text-muted-foreground text-sm">{selected.description}</p>
              </div>
              <button onClick={() => setSelected(null)}
                className="text-muted-foreground hover:text-foreground text-xl">
                ✕
              </button>
            </div>

            {/* Payment method */}
            <div>
              <p className="text-sm font-medium mb-2">Payment method</p>
              <div className="flex gap-2">
                {selected.coin_cost && (
                  <button onClick={() => setPayMethod('coins')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                      payMethod === 'coins'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border'
                    }`}>
                    {selected.coin_cost} 🪙 Coins
                  </button>
                )}
                {selected.cash_price && (
                  <button onClick={() => setPayMethod('cash')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                      payMethod === 'cash'
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border'
                    }`}>
                    ₦{Number(selected.cash_price).toLocaleString()} Cash
                  </button>
                )}
              </div>
              {payMethod === 'coins' && data?.coin_balance < selected.coin_cost && (
                <p className="text-xs text-destructive mt-2">
                  You need {selected.coin_cost - data?.coin_balance} more coins
                </p>
              )}
            </div>

            {/* Delivery address */}
            <div>
              <p className="text-sm font-medium mb-2">Delivery address</p>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your full delivery address..."
                rows={2}
                className="w-full border border-input rounded-xl px-3 py-2.5 text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <button
              onClick={() => purchaseMutation.mutate()}
              disabled={
                purchaseMutation.isPending ||
                !address.trim() ||
                (payMethod === 'coins' && data?.coin_balance < selected.coin_cost)
              }
              className="w-full gradient-primary text-white rounded-xl py-3 font-bold disabled:opacity-50 transition"
            >
              {purchaseMutation.isPending ? 'Processing...' : 'Confirm Order'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;