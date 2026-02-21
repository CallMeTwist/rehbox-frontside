import { mockRewards } from "@/mock/data";
import { useAuthStore } from "@/store/authStore";
import CoinBadge from "@/components/shared/CoinBadge";
import { Lock } from "lucide-react";

const ClientRewards = () => {
  const { user } = useAuthStore();
  const coins = user?.coins || 850;

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="font-display font-bold text-2xl">Rewards</h1>
        <p className="text-muted-foreground text-sm mt-1">Earn coins by completing sessions and hitting milestones.</p>
      </div>
      <div className="gradient-hero rounded-2xl p-6 text-white flex items-center justify-between">
        <div>
          <p className="text-white/70 text-sm mb-1">Your Coin Balance</p>
          <p className="font-display font-bold text-4xl">{coins.toLocaleString()}</p>
          <p className="text-white/60 text-xs mt-1">Use coins to discount shop purchases</p>
        </div>
        <div className="text-6xl animate-coin-float">🪙</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mockRewards.map((reward) => (
          <div key={reward.id} className={`bg-card rounded-2xl p-5 shadow-card border-2 transition-all ${reward.earned ? "border-success/40" : "border-border"}`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${reward.earned ? "bg-success/10" : "bg-muted"}`}>
                {reward.earned ? reward.icon : <Lock size={20} className="text-muted-foreground" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-sm">{reward.name}</p>
                  {reward.earned && <span className="badge-approved">Earned</span>}
                </div>
                <p className="text-xs text-muted-foreground mb-2">{reward.description}</p>
                <div className="coin-badge w-fit">{reward.earned ? "🪙" : "🔒"} {reward.coins} coins</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <h2 className="font-display font-semibold mb-3">How to earn coins</h2>
        <div className="space-y-2 text-sm">
          {[["Complete a session", "50 🪙"], ["7-day streak", "150 🪙"], ["Perfect compliance week", "200 🪙"], ["Refer a friend", "300 🪙"]].map(([action, coins]) => (
            <div key={action} className="flex justify-between items-center p-3 rounded-xl bg-muted/50">
              <span className="text-muted-foreground">{action}</span>
              <span className="font-bold">{coins}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientRewards;
