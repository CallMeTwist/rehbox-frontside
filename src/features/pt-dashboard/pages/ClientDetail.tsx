// Add to src/features/pt-dashboard/pages/ClientDetail.tsx
import { useClientMotionReports } from '../hooks/useMotionData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { tooltipStyle } from '@/styles/theme';

// Add this section inside ClientDetail, after the existing client info:
const MotionSection = ({ clientId }: { clientId: number }) => {
  const { data, isLoading } = useClientMotionReports(clientId);

  if (isLoading) return <Skeleton className="h-48 rounded-2xl" />;

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-semibold">Motion & Form Reports</h2>
        <span className="badge-approved">
          Avg: {data?.avg_form_score ?? 0}%
        </span>
      </div>

      {/* Form score trend line chart */}
      {data?.trend?.length > 0 && (
        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={data.trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
            <XAxis dataKey="id" hide />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle}
              formatter={(v) => [`${v}%`, 'Form Score']} />
            <Line type="monotone" dataKey="form_score"
              stroke="hsl(var(--primary))" strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', r: 3 }}
              activeDot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      )}

      {/* Session list */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {data?.sessions?.data?.map((session: any) => (
          <div key={session.id}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-sm font-bold text-primary">
              {session.form_score ?? '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {session.exercise?.title ?? 'Exercise'}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(session.completed_at).toLocaleDateString()} ·{' '}
                {session.coins_earned} coins earned
              </p>
            </div>
            <div className={`w-2 h-2 rounded-full ${
              (session.form_score ?? 0) >= 80 ? 'bg-success'
              : (session.form_score ?? 0) >= 50 ? 'bg-warning'
              : 'bg-destructive'
            }`} />
          </div>
        ))}
      </div>
    </div>
  );
};