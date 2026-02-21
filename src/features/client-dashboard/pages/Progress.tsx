import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { mockProgressData } from "@/mock/data";
import ProgressRing from "@/features/client-dashboard/components/ProgressRing";
import { tooltipStyle } from "@/styles/theme";

const Progress = () => (
  <div className="space-y-6 animate-slide-up">
    <div><h1 className="font-display font-bold text-2xl">My Progress</h1><p className="text-muted-foreground text-sm mt-1">Track your recovery journey over time.</p></div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-card rounded-2xl p-5 shadow-card border border-border flex flex-col items-center gap-2"><ProgressRing value={85} size={90} strokeWidth={8} label="Compliance" /></div>
      <div className="bg-card rounded-2xl p-5 shadow-card border border-border flex flex-col items-center gap-2"><ProgressRing value={68} size={90} strokeWidth={8} label="Plan Progress" /></div>
      <div className="bg-card rounded-2xl p-5 shadow-card border border-border flex flex-col items-center gap-2"><ProgressRing value={70} size={90} strokeWidth={8} label="Pain Reduction" /></div>
    </div>
    <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
      <h2 className="font-display font-semibold mb-4">Compliance Over Time</h2>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={mockProgressData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="week" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} domain={[0, 100]} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line dataKey="compliance" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4, fill: 'hsl(var(--primary))' }} name="Compliance %" />
        </LineChart>
      </ResponsiveContainer>
    </div>
    <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
      <h2 className="font-display font-semibold mb-4">Sessions Per Week</h2>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={mockProgressData} barSize={32}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis dataKey="week" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="sessions" fill="hsl(var(--hot-pink))" radius={[6, 6, 0, 0]} name="Sessions" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default Progress;
