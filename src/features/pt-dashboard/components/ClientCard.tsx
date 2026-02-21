const ClientCard = ({ client }: { client: { id: string; name: string; avatar: string; condition: string; compliance: number; status: string } }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors">
    <img src={client.avatar} alt={client.name} className="w-10 h-10 rounded-full object-cover" />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold">{client.name}</p>
      <p className="text-xs text-muted-foreground">{client.condition}</p>
    </div>
    <div className="text-xs font-bold text-success">{client.compliance}%</div>
  </div>
);
export default ClientCard;
