import { useNavigate } from "react-router-dom";
import { CheckCircle, Zap, Crown } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: 3500,
    period: "month",
    icon: Zap,
    color: "border-border",
    features: ["Access to exercise library", "PT messaging (5 msgs/day)", "Basic progress tracking", "50 coins/session"],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 7500,
    period: "month",
    icon: Crown,
    color: "border-primary shadow-primary",
    features: ["Everything in Basic", "Unlimited PT messaging", "Motion tracking with AI", "Full progress analytics", "200 coins/session", "Priority support"],
    popular: true,
  },
];

const Subscription = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuthStore();

  const handleSubscribe = (planId: string) => {
    updateUser({ isSubscribed: true });
    navigate("/client/home");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-primary">
            <Crown size={28} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-3xl mb-2">Choose your plan</h1>
          <p className="text-muted-foreground">Unlock the full power of ReHboX to accelerate your recovery.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className={`bg-card rounded-2xl p-6 border-2 transition-all relative ${plan.color}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-pink text-white text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${plan.popular ? "gradient-primary shadow-primary" : "bg-muted"}`}>
                <plan.icon size={22} className={plan.popular ? "text-white" : "text-muted-foreground"} />
              </div>
              <h3 className="font-display font-bold text-xl mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="font-display font-bold text-3xl">₦{plan.price.toLocaleString()}</span>
                <span className="text-muted-foreground text-sm">/{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <CheckCircle size={15} className="text-success flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSubscribe(plan.id)}
                className={`w-full font-bold py-3 rounded-xl transition-opacity hover:opacity-90 ${
                  plan.popular ? "gradient-primary text-white shadow-primary" : "border-2 border-border hover:border-primary"
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          7-day free trial • Cancel anytime • Secure payment
        </p>
      </div>
    </div>
  );
};

export default Subscription;
