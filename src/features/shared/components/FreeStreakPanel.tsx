import { Flame } from 'lucide-react';

interface Props {
  current: number;
  longest: number;
  last7: boolean[]; // oldest → newest
}

export function FreeStreakPanel({ current, longest, last7 }: Props) {
  return (
    <div
      className="rounded-3xl p-8 text-center relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #060c1e 0%, #091526 60%, #0e1e42 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div
        className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(229,25,125,0.22),transparent 65%)', filter: 'blur(50px)' }}
      />
      <div className="relative z-10">
        <div className="inline-flex items-center justify-center gap-2 mb-2">
          <Flame size={28} className="text-pink-400" />
          <span className="text-white/60 text-sm uppercase tracking-widest">Current streak</span>
        </div>
        <p
          className="font-display font-bold text-7xl md:text-8xl mb-2"
          style={{
            background: 'linear-gradient(135deg,#FF6BB5,#E5197D)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {current}
        </p>
        <p className="text-white/50 text-sm mb-6">{current === 1 ? 'day' : 'days'} in a row</p>

        <div className="flex justify-center gap-2 mb-6">
          {last7.map((active, i) => (
            <div
              key={i}
              data-testid={active ? 'streak-dot-active' : 'streak-dot'}
              className="w-3 h-3 rounded-full"
              style={{
                background: active ? 'linear-gradient(135deg,#FF6BB5,#E5197D)' : 'rgba(255,255,255,0.08)',
                boxShadow: active ? '0 0 10px rgba(229,25,125,0.5)' : 'none',
              }}
            />
          ))}
        </div>

        <p className="text-white/45 text-xs">Longest: {longest} {longest === 1 ? 'day' : 'days'}</p>
      </div>
    </div>
  );
}
