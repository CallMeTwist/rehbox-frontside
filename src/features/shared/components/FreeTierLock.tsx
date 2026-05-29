import { Link } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';

type Feature = 'plan' | 'chat' | 'shop' | 'pt-connect' | 'self-plan' | 'tracking';
type Variant = 'page' | 'inline';

interface Props {
  feature: Feature;
  variant?: Variant;
  previewImage?: string;
}

const COPY: Record<Feature, { headline: string; body: string }> = {
  'plan': {
    headline: 'Unlock a personalised plan built by your PT',
    body: 'Upgrade to Standard and get an exercise plan tailored to your condition by a vetted physiotherapist.',
  },
  'chat': {
    headline: 'Chat with your physiotherapist',
    body: 'Standard members get unlimited messaging, voice notes, and file sharing with their PT.',
  },
  'shop': {
    headline: 'Spend your coins in the ReHboX shop',
    body: 'Your coins are accruing. Upgrade to redeem them for premium content, gear, and consultations.',
  },
  'pt-connect': {
    headline: 'Get matched with a vetted physiotherapist',
    body: 'Upgrade to Standard to be paired with a certified PT for your condition.',
  },
  'self-plan': {
    headline: 'Build your own plan from any exercise',
    body: 'Upgrade to assemble custom plans from the full exercise catalogue.',
  },
  'tracking': {
    headline: 'AI form feedback locked',
    body: 'Upgrade to unlock real-time form correction and range-of-motion tracking.',
  },
};

export function FreeTierLock({ feature, variant = 'page', previewImage }: Props) {
  const { headline, body } = COPY[feature];

  if (variant === 'inline') {
    return (
      <div
        className="flex items-center justify-between gap-3 p-3 rounded-xl"
        style={{
          background: 'rgba(229,25,125,0.10)',
          border: '1px solid rgba(229,25,125,0.30)',
        }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <Lock size={14} className="text-[#C4006A] flex-shrink-0" />
          <p className="text-xs font-semibold text-[#C4006A] truncate">{headline}</p>
        </div>
        <Link
          to="/upgrade"
          className="flex-shrink-0 text-xs font-semibold text-white px-3 py-1.5 rounded-lg"
          style={{ background: 'linear-gradient(135deg,#E5197D,#C4006A)' }}
        >
          Upgrade
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div
        className="w-full max-w-lg rounded-3xl p-10 text-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #060c1e 0%, #091526 50%, #0e1e42 100%)',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 40px 100px rgba(229,25,125,0.18), 0 0 0 1px rgba(255,255,255,0.04)',
        }}
      >
        {previewImage && (
          <img
            src={previewImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-15"
            style={{ filter: 'blur(18px)' }}
          />
        )}
        <div
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(229,25,125,0.25),transparent 65%)', filter: 'blur(60px)' }}
        />
        <div className="relative z-10">
          <div
            className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center"
            style={{ background: 'rgba(229,25,125,0.12)', border: '1px solid rgba(229,25,125,0.28)' }}
          >
            <Lock size={22} className="text-pink-400" />
          </div>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-3">{headline}</h2>
          <p className="text-white/55 text-sm md:text-base leading-relaxed mb-8">{body}</p>
          <Link
            to="/upgrade"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-white font-bold text-sm transition-all hover:scale-[1.03]"
            style={{
              background: 'linear-gradient(135deg,#E5197D,#C4006A)',
              boxShadow: '0 8px 28px rgba(229,25,125,0.4)',
            }}
          >
            Upgrade to Standard
            <ArrowRight size={16} />
          </Link>
          <p className="text-white/30 text-xs mt-5">₦2,000/month · Cancel anytime</p>
        </div>
      </div>
    </div>
  );
}
