// src/features/client-dashboard/pages/Rewards.tsx
import { useRewards } from '../hooks/useRewards';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { Lock } from 'lucide-react';
import { useIsFree } from '@/store/authStore';

const Rewards = () => {
  const isFree = useIsFree();
  const { data, isLoading, error } = useRewards();

  if (isFree || (error as any)?.response?.status === 402) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-card rounded-2xl border border-border p-10 text-center max-w-sm">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-muted-foreground" />
          </div>
          <h2 className="font-display font-bold text-xl mb-2">Rewards Locked</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Earn coins for every session and redeem them in the shop. Available on the
            Standard plan.
          </p>
          <Link
            to="/subscription"
            className="block w-full gradient-primary text-white rounded-xl py-3 font-semibold text-center shadow-primary"
          >
            Upgrade to Standard
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) return (
    <div className="space-y-4">
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-64 rounded-2xl" />
    </div>
  );

  const { coin_balance, transactions, stats } = data;

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="font-display font-bold text-2xl">Rewards</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Earn coins by exercising. Spend them in the shop.
        </p>
      </div>

      {/* Coin wallet card */}
      <div className="gradient-primary rounded-2xl p-6 text-white shadow-primary">
        <p className="text-white/70 text-sm mb-1">Your Coin Balance</p>
        <p className="font-display font-bold text-5xl mb-4">
          {coin_balance} <span className="text-3xl">🪙</span>
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-white/60 text-xs">Total Earned</p>
            <p className="font-bold text-lg">{stats.total_earned} 🪙</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-white/60 text-xs">Total Spent</p>
            <p className="font-bold text-lg">{stats.total_spent} 🪙</p>
          </div>
        </div>
      </div>

      {/* How to earn */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <h2 className="font-display font-semibold mb-4">How to earn coins</h2>
        <div className="space-y-3">
          {[
            { icon: '🏃', label: 'Complete any exercise', coins: '+1 🪙' },
            { icon: '🎯', label: 'Good form (50%+)', coins: '+2 🪙' },
            { icon: '💪', label: 'Great form (80%+)', coins: '+3 🪙' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <span className="flex-1 text-sm">{item.label}</span>
              <span className="font-bold text-sm text-primary">{item.coins}</span>
            </div>
          ))}
        </div>
        <Link to="/client/shop"
          className="block w-full mt-5 bg-primary text-white text-center rounded-xl py-3 font-semibold text-sm">
          Browse Shop →
        </Link>
      </div>

      {/* Transaction history */}
      <div className="bg-card rounded-2xl border border-border shadow-card">
        <div className="p-5 border-b border-border">
          <h2 className="font-display font-semibold">Transaction History</h2>
        </div>
        {transactions?.data?.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground text-sm">
            No transactions yet — start exercising to earn coins!
          </div>
        ) : (
          <div className="divide-y divide-border">
            {transactions?.data?.map((tx: any) => (
              <div key={tx.id} className="flex items-center gap-3 p-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${
                  tx.amount > 0 ? 'bg-success/10' : 'bg-destructive/10'
                }`}>
                  {tx.amount > 0 ? '⬆️' : '⬇️'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </p>
                </div>
                <p className={`font-bold text-sm ${
                  tx.amount > 0 ? 'text-success' : 'text-destructive'
                }`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount} 🪙
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Rewards;