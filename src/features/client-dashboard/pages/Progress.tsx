// src/features/client-dashboard/pages/Progress.tsx
import { useProgress } from '../hooks/useProgress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line,
} from 'recharts';
import { tooltipStyle } from '@/styles/theme';

const CATEGORY_LABELS: Record<string, string> = {
  head_neck:  'Head & Neck',
  upper_limb: 'Upper Limb',
  back:       'Back',
  lower_limb: 'Lower Limb',
};

const Progress = () => {
  const { data, isLoading, isError } = useProgress();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
        <Skeleton className="h-52 rounded-2xl" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-4xl mb-3">📊</p>
        <h2 className="font-display font-bold text-xl mb-2">No Progress Yet</h2>
        <p className="text-muted-foreground text-sm">
          Complete your first exercise session to start tracking progress.
        </p>
      </div>
    );
  }


  const { summary, weekly_chart, recent_sessions } = data;

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h1 className="font-display font-bold text-2xl">My Progress</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track your recovery journey
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        {[
          {
            label: 'Sessions this month',
            value: summary.total_sessions_this_month,
            icon: '🏃', color: 'bg-primary/10',
          },
          {
            label: 'Day streak',
            value: `${summary.current_streak_days} 🔥`,
            icon: '📅', color: 'bg-warning/10',
          },
          {
            label: 'Avg form score',
            value: `${summary.avg_form_score}%`,
            icon: '🎯', color: 'bg-success/10',
          },
          {
            label: 'Coins earned',
            value: `${summary.coins_earned_this_month} 🪙`,
            icon: '💰', color: 'bg-hot-pink/10',
          },
        ].map((card) => (
          <div key={card.label}
            className="bg-card rounded-2xl border border-border p-4 shadow-card">
            <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center text-xl mb-3`}>
              {card.icon}
            </div>
            <p className="font-display font-bold text-xl">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Weekly activity chart */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-card">
        <h2 className="font-display font-semibold mb-5">Weekly Activity</h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weekly_chart} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip contentStyle={tooltipStyle}
              formatter={(v) => [v, 'Sessions']} />
            <Bar dataKey="sessions" fill="hsl(var(--primary))" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top body area */}
      {summary.top_category && (
        <div className="bg-card rounded-2xl border border-border p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl">
            💪
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Most exercised area</p>
            <p className="font-display font-bold">
              {CATEGORY_LABELS[summary.top_category] ?? summary.top_category}
            </p>
          </div>
        </div>
      )}

      {/* Recent sessions list */}
      <div className="bg-card rounded-2xl border border-border shadow-card">
        <div className="p-5 border-b border-border">
          <h2 className="font-display font-semibold">Recent Sessions</h2>
        </div>
        {recent_sessions.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">
            <p className="text-3xl mb-2">📊</p>
            <p className="text-sm">No sessions this month yet</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recent_sessions.map((session: any) => (
              <div key={session.id} className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-lg">
                  🏃
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{session.exercise}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(session.completed_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-bold ${
                    session.form_score >= 80 ? 'text-success'
                    : session.form_score >= 50 ? 'text-warning'
                    : 'text-muted-foreground'
                  }`}>
                    {session.form_score ?? '—'}%
                  </p>
                  <p className="text-xs text-muted-foreground">+{session.coins_earned}🪙</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;