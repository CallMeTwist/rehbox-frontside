// import { useNavigate } from "react-router-dom";
// import { CheckCircle, Zap, Crown } from "lucide-react";
// import { useAuthStore } from "@/store/authStore";

// const plans = [
//   { id: "basic", name: "Basic", price: 3500, period: "month", icon: Zap, features: ["Access to exercise library", "PT messaging (5 msgs/day)", "Basic progress tracking", "50 coins/session"], popular: false },
//   { id: "pro", name: "Pro", price: 7500, period: "month", icon: Crown, features: ["Everything in Basic", "Unlimited PT messaging", "Motion tracking with AI", "Full progress analytics", "200 coins/session", "Priority support"], popular: true },
// ];

// const PaymentGate = () => {
//   const navigate = useNavigate();
//   const { updateUser } = useAuthStore();

//   const handleSubscribe = (planId: string) => {
//     updateUser({ isSubscribed: true });
//     navigate("/client/home");
//   };

//   return (
//     <div className="min-h-screen bg-background flex items-center justify-center p-6">
//       <div className="w-full max-w-2xl">
//         <div className="text-center mb-10">
//           <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-primary"><Crown size={28} className="text-white" /></div>
//           <h1 className="font-display font-bold text-3xl mb-2">Choose your plan</h1>
//           <p className="text-muted-foreground">Unlock the full power of ReHboX to accelerate your recovery.</p>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {plans.map((plan) => (
//             <div key={plan.id} className={`bg-card rounded-2xl p-6 border-2 transition-all relative ${plan.popular ? "border-primary shadow-primary" : "border-border"}`}>
//               {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-pink text-white text-xs font-bold px-4 py-1 rounded-full">Most Popular</div>}
//               <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${plan.popular ? "gradient-primary shadow-primary" : "bg-muted"}`}>
//                 <plan.icon size={22} className={plan.popular ? "text-white" : "text-muted-foreground"} />
//               </div>
//               <h3 className="font-display font-bold text-xl mb-1">{plan.name}</h3>
//               <div className="flex items-baseline gap-1 mb-5"><span className="font-display font-bold text-3xl">₦{plan.price.toLocaleString()}</span><span className="text-muted-foreground text-sm">/{plan.period}</span></div>
//               <ul className="space-y-2 mb-6">{plan.features.map((f) => <li key={f} className="flex items-center gap-2 text-sm"><CheckCircle size={15} className="text-success flex-shrink-0" />{f}</li>)}</ul>
//               <button onClick={() => handleSubscribe(plan.id)} className={`w-full font-bold py-3 rounded-xl transition-opacity hover:opacity-90 ${plan.popular ? "gradient-primary text-white shadow-primary" : "border-2 border-border hover:border-primary"}`}>Get Started</button>
//             </div>
//           ))}
//         </div>
//         <p className="text-center text-sm text-muted-foreground mt-6">7-day free trial • Cancel anytime • Secure payment</p>
//       </div>
//     </div>
//   );
// };

// export default PaymentGate;


import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/lib/api';

const PLANS = [
  { id: 'basic',    label: 'Basic',    price: '₦5,000/mo',  features: ['Personalized plan', 'Exercise reminders', 'Progress tracking'] },
  { id: 'standard', label: 'Standard', price: '₦10,000/mo', features: ['Everything in Basic', 'Q&A with your PT', 'Coin rewards', 'Shop access'] },
  { id: 'premium',  label: 'Premium',  price: '₦20,000/mo', features: ['Everything in Standard', 'Priority PT response', 'Monthly report', 'Motion tracking AI'] },
];

const PaymentGate = () => {
  const [selectedPlan, setSelectedPlan] = useState('standard');

  const { mutate: subscribe, isPending } = useMutation({
    mutationFn: (plan: string) =>
      api.post('/client/subscribe', { plan }).then((r) => r.data),
    onSuccess: (data) => {
      // Redirect to Paystack hosted checkout
      window.location.href = data.authorization_url;
    },
    onError: () => toast.error('Could not initialize payment. Please try again.'),
  });

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-2xl">Choose Your Plan</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Unlock your personalized physiotherapy program
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {PLANS.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`rounded-2xl border-2 p-5 text-left transition-all ${
                selectedPlan === plan.id
                  ? 'border-primary bg-primary/5 shadow-primary'
                  : 'border-border bg-card hover:border-primary/30'
              }`}
            >
              <p className="font-display font-bold text-lg">{plan.label}</p>
              <p className="text-primary font-semibold text-sm mt-1">{plan.price}</p>
              <ul className="mt-3 space-y-1.5">
                {plan.features.map((f) => (
                  <li key={f} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="text-success mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        <button
          onClick={() => subscribe(selectedPlan)}
          disabled={isPending}
          className="w-full bg-primary text-white rounded-2xl py-4 font-display font-bold text-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {isPending ? 'Redirecting to payment...' : `Subscribe to ${PLANS.find(p => p.id === selectedPlan)?.label}`}
        </button>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Secured by Paystack · Cancel anytime
        </p>
      </div>
    </div>
  );
};

export default PaymentGate;