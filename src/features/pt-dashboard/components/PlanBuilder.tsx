const PlanBuilder = ({ children }: { children?: React.ReactNode }) => (
  <div className="bg-card rounded-2xl p-6 shadow-card border border-border">{children || <p className="text-muted-foreground text-sm">Plan builder component</p>}</div>
);
export default PlanBuilder;
