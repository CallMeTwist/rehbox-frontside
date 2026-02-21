import { Bell, Clock, CheckCircle, Calendar } from "lucide-react";

const mockReminders = [
  { id: "r1", title: "Knee Extension", time: "9:00 AM", day: "Today", completed: true, type: "exercise" },
  { id: "r2", title: "Standing Calf Raise", time: "5:00 PM", day: "Today", completed: false, type: "exercise" },
  { id: "r3", title: "Shoulder Pendulum", time: "10:00 AM", day: "Tomorrow", completed: false, type: "exercise" },
  { id: "r4", title: "PT Check-in with Dr. Adaeze", time: "2:00 PM", day: "Wednesday", completed: false, type: "appointment" },
  { id: "r5", title: "Progress Review", time: "11:00 AM", day: "Friday", completed: false, type: "review" },
];

const Reminders = () => (
  <div className="space-y-6 animate-slide-up">
    <div className="flex items-center justify-between">
      <div><h1 className="font-display font-bold text-2xl">Reminders</h1><p className="text-muted-foreground text-sm mt-1">Stay on track with your rehabilitation schedule.</p></div>
      <button className="gradient-primary text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-primary hover:opacity-90 flex items-center gap-2">
        <Bell size={16} /> Set Reminder
      </button>
    </div>

    <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
      <h2 className="font-display font-semibold mb-4">Upcoming</h2>
      <div className="space-y-3">
        {mockReminders.map((r) => (
          <div key={r.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${r.completed ? "bg-success/5 border-success/20" : "bg-muted/30 border-border"}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${r.completed ? "bg-success/20" : r.type === "appointment" ? "gradient-pink" : "gradient-primary"}`}>
              {r.completed ? <CheckCircle size={18} className="text-success" /> : r.type === "appointment" ? <Calendar size={18} className="text-white" /> : <Clock size={18} className="text-white" />}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-semibold ${r.completed ? "line-through text-muted-foreground" : ""}`}>{r.title}</p>
              <p className="text-xs text-muted-foreground">{r.day} · {r.time}</p>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${r.completed ? "badge-approved" : r.type === "appointment" ? "bg-hot-pink/10 text-hot-pink border border-hot-pink/30" : "badge-pending"}`}>
              {r.completed ? "Done" : r.type === "appointment" ? "Appointment" : "Upcoming"}
            </span>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
      <h2 className="font-display font-semibold mb-3">Notification Settings</h2>
      <div className="space-y-3">
        {[["Exercise reminders", true], ["PT messages", true], ["Progress updates", false], ["Reward notifications", true]].map(([label, enabled]) => (
          <div key={label as string} className="flex items-center justify-between p-3 rounded-xl bg-muted/30">
            <span className="text-sm">{label as string}</span>
            <div className={`w-10 h-6 rounded-full transition-colors cursor-pointer flex items-center ${enabled ? "bg-primary justify-end" : "bg-muted justify-start"}`}>
              <div className="w-4 h-4 rounded-full bg-white mx-1 shadow-sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Reminders;
