import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, ClipboardList, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { mockClients, mockProgressData } from "@/mock/data";
import ProgressRing from "@/features/client-dashboard/components/ProgressRing";
import { tooltipStyle } from "@/styles/theme";

const ClientDetail = () => {
  const { id } = useParams();
  const client = mockClients.find((c) => c.id === id) || mockClients[0];

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center gap-4">
        <Link to="/pt/clients" className="p-2 rounded-xl hover:bg-muted transition-colors"><ArrowLeft size={18} /></Link>
        <div className="flex items-center gap-3 flex-1">
          <img src={client.avatar} alt={client.name} className="w-12 h-12 rounded-full object-cover" />
          <div>
            <h1 className="font-display font-bold text-xl">{client.name}</h1>
            <p className="text-muted-foreground text-sm">{client.condition} · Age {client.age}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/pt/messages" className="flex items-center gap-2 border border-border px-4 py-2 rounded-xl text-sm font-semibold hover:bg-muted transition-colors"><MessageCircle size={15} /> Message</Link>
          <Link to="/pt/plans/create" className="gradient-primary text-white flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shadow-primary hover:opacity-90 transition-opacity"><ClipboardList size={15} /> New Plan</Link>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border flex flex-col items-center gap-4">
          <ProgressRing value={client.compliance} size={120} strokeWidth={10} label="Overall Compliance" />
          <div className="w-full space-y-3 pt-4 border-t border-border">
            {[{ label: "Last Session", value: client.lastSession }, { label: "Status", value: client.status }, { label: "Sessions Done", value: "34" }].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-sm"><span className="text-muted-foreground">{item.label}</span><span className="font-semibold capitalize">{item.value}</span></div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-card border border-border">
          <h2 className="font-display font-semibold mb-4">Recovery Progress</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={mockProgressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line dataKey="compliance" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4, fill: 'hsl(var(--primary))' }} name="Compliance %" />
              <Line dataKey="sessions" stroke="hsl(var(--hot-pink))" strokeWidth={2.5} dot={{ r: 4, fill: 'hsl(var(--hot-pink))' }} name="Sessions" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
        <h2 className="font-display font-semibold mb-4">Session History</h2>
        <div className="space-y-3">
          {mockProgressData.map((week) => (
            <div key={week.week} className="flex items-center gap-4 p-3 rounded-xl bg-muted/50">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center"><Calendar size={14} className="text-white" /></div>
              <div className="flex-1"><p className="text-sm font-semibold">{week.week}</p><p className="text-xs text-muted-foreground">{week.sessions} sessions</p></div>
              <div className="text-right"><p className="text-sm font-bold text-success">{week.compliance}%</p><p className="text-xs text-muted-foreground">Pain: {week.pain}/10</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
