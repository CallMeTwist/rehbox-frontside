// Add to src/features/pt-dashboard/pages/Profile.tsx
import { useEarnings } from '../hooks/useMotionData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { tooltipStyle } from '@/styles/theme';

const EarningsSection = () => {
  const { data, isLoading } = useEarnings();
  if (isLoading) return <Skeleton className="h-48 rounded-2xl" />;

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-5">
      <h2 className="font-display font-semibold">Earnings Breakdown</h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted rounded-xl p-4">
          <p className="text-xs text-muted-foreground">This Month</p>
          <p className="font-display font-bold text-xl mt-1">
            ₦{Number(data?.summary?.monthly_earnings).toLocaleString()}
          </p>
        </div>
        <div className="bg-muted rounded-xl p-4">
          <p className="text-xs text-muted-foreground">Commission Rate</p>
          <p className="font-display font-bold text-xl mt-1">
            {data?.summary?.commission_rate}
          </p>
        </div>
      </div>

      {/* 6-month chart */}
      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data?.earning_history} barSize={24}>
          <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle}
            formatter={(v) => [`₦${Number(v).toLocaleString()}`, 'Earnings']} />
          <Bar dataKey="earnings" fill="hsl(var(--primary))" radius={[4,4,0,0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Per-client breakdown */}
      <div className="space-y-2">
        {data?.client_breakdown?.map((c: any) => (
          <div key={c.client_name}
            className="flex items-center justify-between p-3 rounded-xl bg-muted">
            <div>
              <p className="text-sm font-medium">{c.client_name}</p>
              <p className="text-xs text-muted-foreground capitalize">
                {c.subscription_plan} plan
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-sm">
                ₦{Number(c.your_commission).toLocaleString()}
              </p>
              <p className={`text-xs ${
                c.status === 'active' ? 'text-success' : 'text-muted-foreground'
              }`}>
                {c.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};