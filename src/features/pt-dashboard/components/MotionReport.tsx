const MotionReport = ({ accuracy, reps, sets }: { accuracy: number; reps: number; sets: number }) => (
  <div className="bg-card rounded-2xl p-5 shadow-card border border-border">
    <h3 className="font-display font-semibold mb-3">Motion Report</h3>
    <div className="grid grid-cols-3 gap-4 text-center">
      <div><p className="font-display font-bold text-2xl text-primary">{accuracy}%</p><p className="text-xs text-muted-foreground">Accuracy</p></div>
      <div><p className="font-display font-bold text-2xl">{reps}</p><p className="text-xs text-muted-foreground">Total Reps</p></div>
      <div><p className="font-display font-bold text-2xl">{sets}</p><p className="text-xs text-muted-foreground">Sets</p></div>
    </div>
  </div>
);
export default MotionReport;
