import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { mockComplianceData } from "@/mock/data";
import { tooltipStyle } from "@/styles/theme";

const ComplianceChart = () => (
  <ResponsiveContainer width="100%" height={200}>
    <BarChart data={mockComplianceData} barSize={32}>
      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
      <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} domain={[0, 100]} />
      <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${value}%`, 'Compliance']} />
      <Bar dataKey="compliance" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

export default ComplianceChart;
