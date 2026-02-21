import { mockPTStats } from "@/mock/data";

const EarningsWidget = () => (
  <div className="bg-card rounded-2xl p-5 shadow-card border border-border">
    <h3 className="font-display font-semibold mb-3">Earnings</h3>
    <div className="p-4 rounded-xl gradient-primary text-white mb-3">
      <p className="text-white/70 text-xs mb-1">Monthly Revenue</p>
      <p className="font-display font-bold text-2xl">₦{mockPTStats.monthlyEarnings.toLocaleString()}</p>
    </div>
    <div className="p-3 rounded-xl bg-muted">
      <p className="text-muted-foreground text-xs mb-1">Commission</p>
      <p className="font-display font-bold text-lg">₦{mockPTStats.commissionsEarned.toLocaleString()}</p>
    </div>
  </div>
);
export default EarningsWidget;
