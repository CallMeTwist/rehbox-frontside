import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Check, ArrowRight, Star, ChevronDown, Crown, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore, useIsPaid } from '@/store/authStore';
import api from '@/lib/api';

const STANDARD_FEATURES = [
  'Personal physiotherapist matched to your condition',
  'Custom exercise plan rebuilt every 48 hours',
  'AI form feedback + range-of-motion tracking',
  'Unlimited PT messaging with voice notes and files',
  'Weekly progress + pain analytics reports',
  'Full shop access — spend your saved coins',
  'Unlimited daily reminders',
  '200 coins per session (vs 50 on free)',
];

const FREE_FEATURES = [
  'General exercise library (condition-filtered)',
  'Basic body-line motion tracking',
  'Streak progress only',
  '1 daily reminder',
  "50 coins per session (can't spend)",
];

const faqs = [
  { q: 'Can I cancel anytime?', a: 'Yes. Cancel from Profile → Subscription. Access continues until the end of the paid period.' },
  { q: 'Is payment secure?', a: 'All payments are processed by Paystack. We never see or store your card details.' },
  { q: "What if I'm not satisfied?", a: 'Email support@rehbox.health within 7 days of payment for a full refund — no questions asked.' },
];

export default function Upgrade() {
  const navigate = useNavigate();
  const isPaid = useIsPaid();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (isPaid) navigate('/client/profile', { replace: true });
  }, [isPaid, navigate]);

  const streak = useQuery({
    queryKey: ['client', 'progress', 'free'],
    enabled: !isPaid && user?.role === 'client',
    queryFn: () =>
      api.get<{ current_streak: number }>('/client/progress').then((r) => r.data),
  });

  const { mutate: subscribe, isPending } = useMutation({
    mutationFn: () => api.post('/client/subscribe', { plan: 'standard' }).then((r) => r.data),
    onSuccess: (data: any) => {
      if (data?.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        toast.success('Subscription started!');
        navigate('/client/home');
      }
    },
    onError: () => toast.error('Could not start payment. Try again.'),
  });

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#07101f' }}>
      <section
        className="relative px-6 md:px-12 lg:px-20 pt-24 pb-16"
        style={{ background: 'linear-gradient(160deg,#060c1e 0%,#091526 50%,#0e1e42 100%)' }}
      >
        <div className="absolute top-[-15%] right-[-8%] w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(229,25,125,0.22),transparent 65%)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-[-10%] left-[-8%] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(44,95,195,0.18),transparent 65%)', filter: 'blur(80px)' }} />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background: 'rgba(229,25,125,0.10)', border: '1px solid rgba(229,25,125,0.22)' }}>
            <Crown size={14} className="text-pink-400" />
            <span className="text-pink-200 text-xs font-medium">Upgrade to Standard</span>
          </div>

          <h1 className="font-display font-bold text-4xl md:text-6xl text-white leading-[1.05] mb-5">
            Get the full
            <br />
            <span style={{ background: 'linear-gradient(135deg,#FF6BB5,#E5197D)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              ReHboX experience.
            </span>
          </h1>

          {streak.data?.current_streak ? (
            <p className="text-white/65 text-base md:text-lg mb-8">
              You're on a <span className="text-pink-300 font-semibold">{streak.data.current_streak}-day streak</span> — don't lose it.
            </p>
          ) : (
            <p className="text-white/55 text-base md:text-lg mb-8">
              Personal physio, AI tracking, and the full plan — for less than the price of a takeaway.
            </p>
          )}
        </motion.div>
      </section>

      <section className="relative px-6 md:px-12 lg:px-20 py-16" style={{ background: '#07101f' }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-3xl p-8"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <p className="font-display font-bold text-white/60 text-sm uppercase tracking-widest mb-4">Free (current)</p>
            <ul className="space-y-3">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-white/55 text-sm">
                  <Check size={15} className="text-white/35 flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-white/[0.06]">
              <p className="text-white/35 text-xs uppercase tracking-widest mb-3">Locked</p>
              <ul className="space-y-2">
                {['Personal PT', 'Custom plan', 'PT chat', 'AI form feedback', 'Shop access', 'Pain analytics'].map((l) => (
                  <li key={l} className="flex items-center gap-2 text-white/30 text-sm">
                    <Lock size={13} /> {l}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="rounded-3xl p-8 relative overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(44,95,195,0.18) 0%, rgba(229,25,125,0.14) 100%)',
              border: '1px solid rgba(229,25,125,0.32)',
              boxShadow: '0 0 80px rgba(229,25,125,0.18)',
            }}
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg,#E5197D,#C4006A)' }}>
              Recommended
            </div>
            <p className="font-display font-bold uppercase tracking-widest text-sm mb-2" style={{ color: '#FF6BB5' }}>Standard</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="font-display font-bold text-5xl text-white">₦2,000</span>
              <span className="text-white/45 text-sm">/month</span>
            </div>
            <p className="text-white/40 text-xs mb-6">Cancel anytime · 7-day free trial</p>

            <ul className="space-y-3 mb-8">
              {STANDARD_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-white/75 text-sm">
                  <Check size={15} className="flex-shrink-0 mt-0.5" style={{ color: '#FF6BB5' }} />
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => subscribe()}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white font-bold transition-all hover:scale-[1.02] disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg,#E5197D,#C4006A)',
                boxShadow: '0 10px 30px rgba(229,25,125,0.42)',
              }}
            >
              {isPending ? 'Redirecting to Paystack…' : 'Upgrade to Standard'}
              {!isPending && <ArrowRight size={16} />}
            </button>
            <p className="text-center text-white/35 text-xs mt-3">Secured by Paystack</p>
          </motion.div>
        </div>
      </section>

      <section className="relative px-6 md:px-12 py-16" style={{ background: 'linear-gradient(180deg,#07101f,#091424)' }}>
        <div className="max-w-2xl mx-auto rounded-3xl p-8 text-center"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex justify-center gap-0.5 mb-4">
            {Array.from({ length: 5 }, (_, i) => <Star key={i} size={15} className="text-yellow-400 fill-yellow-400" />)}
          </div>
          <p className="text-white/75 text-base md:text-lg leading-relaxed mb-5">
            "After my ACL surgery I was terrified of re-injury. ReHboX gave me daily guided sessions and my PT was always a message away. I'm back to running."
          </p>
          <p className="text-white font-semibold text-sm">Amaka O.</p>
          <p className="text-white/35 text-xs">Knee Reconstruction Patient · Lagos</p>
        </div>
      </section>

      <section className="px-6 md:px-12 py-16" style={{ background: '#07101f' }}>
        <div className="max-w-2xl mx-auto">
          <h3 className="font-display font-bold text-2xl text-white text-center mb-8">Questions</h3>
          <div className="flex flex-col gap-3">
            {faqs.map((f) => <FAQItem key={f.q} {...f} />)}
          </div>
        </div>
      </section>

      <div className="px-6 md:px-12 py-10 text-center" style={{ background: '#060c1d' }}>
        <Link to="/client/home" className="text-white/40 text-sm hover:text-white/70 transition-colors">
          Maybe later — back to dashboard
        </Link>
      </div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-2xl"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-display font-semibold text-white text-sm pr-3">{q}</span>
        <ChevronDown size={16} className={`text-white/40 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="px-5 pb-4 text-white/55 text-sm leading-relaxed">{a}</p>}
    </div>
  );
}
