interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  trend?: { value: string; positive: boolean };
  colorClass?: string;
}

const StatsCard = ({ title, value, subtitle, icon, trend, colorClass = "bg-primary" }: StatsCardProps) => {
  return (
    <div className="bg-card rounded-2xl p-5 shadow-card card-hover border border-border">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl ${colorClass} flex items-center justify-center text-xl shadow-sm`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${trend.positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
            {trend.positive ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
      <p className="text-2xl font-display font-bold text-foreground">{value}</p>
      <p className="text-sm font-medium text-foreground mt-0.5">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
};

export default StatsCard;
