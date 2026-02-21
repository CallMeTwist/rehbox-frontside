// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { Search, ChevronRight, Plus } from "lucide-react";
// import { mockClients } from "@/mock/data";

// const MyClients = () => {
//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("all");
//   const filtered = mockClients.filter((c) => {
//     const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.condition.toLowerCase().includes(search.toLowerCase());
//     const matchFilter = filter === "all" || c.status === filter;
//     return matchSearch && matchFilter;
//   });

//   return (
//     <div className="space-y-6 animate-slide-up">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="font-display font-bold text-2xl">My Clients</h1>
//           <p className="text-muted-foreground text-sm mt-1">{mockClients.length} clients total</p>
//         </div>
//         <button className="gradient-primary text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-primary hover:opacity-90 transition-opacity flex items-center gap-2">
//           <Plus size={16} /> Invite Client
//         </button>
//       </div>
//       <div className="flex gap-3 flex-wrap">
//         <div className="relative flex-1 min-w-48">
//           <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
//           <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search clients..."
//             className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
//         </div>
//         <div className="flex gap-2">
//           {["all", "active", "inactive"].map((f) => (
//             <button key={f} onClick={() => setFilter(f)}
//               className={`text-sm font-medium px-4 py-2 rounded-xl transition-all capitalize ${filter === f ? "gradient-primary text-white shadow-primary" : "bg-card border border-border hover:border-primary"}`}>
//               {f}
//             </button>
//           ))}
//         </div>
//       </div>
//       <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
//         {filtered.map((client, idx) => (
//           <Link key={client.id} to={`/pt/clients/${client.id}`}
//             className={`flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors group ${idx !== filtered.length - 1 ? "border-b border-border" : ""}`}>
//             <div className="relative">
//               <img src={client.avatar} alt={client.name} className="w-12 h-12 rounded-full object-cover" />
//               <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card ${client.status === "active" ? "bg-success" : "bg-muted-foreground"}`} />
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="font-semibold text-sm">{client.name}</p>
//               <p className="text-xs text-muted-foreground">{client.condition}</p>
//               <p className="text-xs text-muted-foreground mt-0.5">Age: {client.age} · Last: {client.lastSession}</p>
//             </div>
//             <div className="text-center">
//               <div className={`text-sm font-bold ${client.compliance >= 80 ? "text-success" : client.compliance >= 60 ? "text-warning" : "text-destructive"}`}>{client.compliance}%</div>
//               <div className="text-xs text-muted-foreground">compliance</div>
//             </div>
//             <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${client.status === "active" ? "badge-approved" : "badge-locked"}`}>{client.status}</span>
//             <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
//           </Link>
//         ))}
//         {filtered.length === 0 && <div className="py-16 text-center text-muted-foreground"><p className="text-4xl mb-3">👥</p><p>No clients found</p></div>}
//       </div>
//     </div>
//   );
// };

// export default MyClients;


// src/features/pt-dashboard/pages/MyClients.tsx
import { Link } from 'react-router-dom';
import { useClients } from '../hooks/useClients';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight, Users } from 'lucide-react';

const ComplianceBadge = ({ rate }: { rate: number }) => (
  <span
    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
      rate >= 70
        ? 'bg-success/10 text-success'
        : rate >= 40
        ? 'bg-warning/10 text-warning'
        : 'bg-destructive/10 text-destructive'
    }`}
  >
    {rate}%
  </span>
);

const MyClients = () => {
  const { data, isLoading } = useClients();
  const clients    = data?.clients ?? [];
  const slotsLeft  = data?.slots_remaining ?? 5;

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl">My Clients</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {clients.length}/5 slots used · {slotsLeft} remaining
          </p>
        </div>
        {/* Slot indicator */}
        <div className="flex gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i < clients.length ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : clients.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-12 text-center">
          <Users className="mx-auto mb-3 text-muted-foreground" size={40} />
          <p className="font-semibold">No clients yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Share your activation code from your Profile to onboard clients.
          </p>
          <Link
            to="/pt/profile"
            className="inline-block mt-4 bg-primary text-white rounded-xl px-5 py-2 text-sm font-semibold"
          >
            View My Code
          </Link>
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-border divide-y divide-border">
          {clients.map((client: any) => (
            <Link
              key={client.id}
              to={`/pt/clients/${client.id}`}
              className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors group"
            >
              {/* Avatar placeholder */}
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm flex-shrink-0">
                {client.name.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{client.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {client.primary_condition ?? 'No condition listed'} ·{' '}
                  {client.active_plan_title ?? 'No active plan'}
                </p>
              </div>

              <div className="text-right flex-shrink-0">
                <ComplianceBadge rate={client.compliance_rate} />
                <p className="text-xs text-muted-foreground mt-1">compliance</p>
              </div>

              <ChevronRight
                size={16}
                className="text-muted-foreground group-hover:text-primary transition-colors"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyClients;