import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { CheckCircle, Lock } from 'lucide-react';
import api from '@/lib/api';

const PLANS = [
  {
    name: 'Basic',
    price: '₦3,500',
    period: '/month',
    features: [
      'Access to general exercises',
      'Basic progress tracking',
      'Coin rewards system',
    ],
    locked: ['Personalized PT plan', 'Chat with your PT', 'Motion tracking'],
    comingSoon: undefined,
    cta: 'Get Basic',
    planKey: 'basic',
    highlight: false,
    isEnterprise: false,
  },
  {
    name: 'Standard',
    price: '₦7,500',
    period: '/month',
    features: [
      'Personalized exercise plan from your PT',
      'Chat with your PT (text + files)',
      'MediaPipe motion tracking',
      'Coin rewards & shop',
      'Progress analytics',
    ],
    locked: undefined,
    comingSoon: ['Audio/video calls'],
    cta: 'Get Standard',
    planKey: 'standard',
    highlight: true,
    isEnterprise: false,
  },
  {
    name: 'Enterprise',
    price: 'Contact us',
    period: '',
    features: [
      'Everything in Standard',
      'Multiple PT accounts under one clinic',
      'Clinic-wide analytics dashboard',
      'Priority support',
    ],
    locked: undefined,
    comingSoon: undefined,
    cta: 'Contact Sales',
    planKey: 'enterprise',
    highlight: false,
    isEnterprise: true,
  },
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

  const activePlan = PLANS.find((p) => p.planKey === selectedPlan);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="font-display font-bold text-2xl">Choose Your Plan</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Unlock your personalized physiotherapy program
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {PLANS.map((plan) => (
            <div
              key={plan.planKey}
              onClick={() => !plan.isEnterprise && setSelectedPlan(plan.planKey)}
              className={`rounded-2xl border-2 p-5 text-left transition-all relative ${
                plan.isEnterprise
                  ? 'border-border bg-card cursor-default'
                  : 'cursor-pointer'
              } ${
                selectedPlan === plan.planKey && !plan.isEnterprise
                  ? 'border-primary bg-primary/5 shadow-primary'
                  : !plan.isEnterprise
                  ? 'border-border bg-card hover:border-primary/30'
                  : ''
              } ${
                plan.highlight && selectedPlan !== plan.planKey
                  ? 'border-primary/40'
                  : ''
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-pink text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                  Most Popular
                </div>
              )}

              <p className="font-display font-bold text-lg">{plan.name}</p>
              <div className="flex items-baseline gap-1 mt-1 mb-3">
                <span className="text-primary font-semibold text-sm">{plan.price}</span>
                {plan.period && (
                  <span className="text-muted-foreground text-xs">{plan.period}</span>
                )}
              </div>

              <ul className="space-y-1.5 mb-3">
                {plan.features.map((f) => (
                  <li key={f} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <CheckCircle size={13} className="text-success mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {plan.comingSoon && plan.comingSoon.length > 0 && (
                <ul className="space-y-1.5 mb-3">
                  {plan.comingSoon.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{f}</span>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full font-medium whitespace-nowrap">
                        Soon
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {plan.locked && plan.locked.length > 0 && (
                <ul className="space-y-1.5">
                  {plan.locked.map((f) => (
                    <li key={f} className="text-xs text-muted-foreground/50 flex items-start gap-1.5">
                      <Lock size={12} className="mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {activePlan?.isEnterprise ? (
          <a
            href="mailto:hello@rehbox.health?subject=Enterprise%20Enquiry"
            className="block w-full text-center font-bold py-3 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all"
          >
            Contact Sales
          </a>
        ) : (
          <button
            onClick={() => subscribe(selectedPlan)}
            disabled={isPending}
            className="w-full bg-primary text-white rounded-2xl py-4 font-display font-bold text-lg hover:opacity-90 transition disabled:opacity-50"
          >
            {isPending
              ? 'Redirecting to payment...'
              : `Subscribe to ${activePlan?.name ?? ''}`}
          </button>
        )}

        <p className="text-center text-xs text-muted-foreground mt-4">
          Secured by Paystack · Cancel anytime
        </p>
      </div>
    </div>
  );
};

export default PaymentGate;
