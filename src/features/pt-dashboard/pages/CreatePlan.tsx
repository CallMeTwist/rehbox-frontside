// import { useState } from "react";
// import { mockClients, mockExercises } from "@/mock/data";
// import ExerciseCard from "@/features/pt-dashboard/components/ExerciseCard";
// import { CheckCircle } from "lucide-react";

// const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// const CreatePlan = () => {
//   const [planName, setPlanName] = useState("");
//   const [selectedClient, setSelectedClient] = useState("");
//   const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
//   const [selectedDays, setSelectedDays] = useState<string[]>([]);
//   const [submitted, setSubmitted] = useState(false);

//   const toggleExercise = (id: string) => setSelectedExercises((prev) => prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]);
//   const toggleDay = (day: string) => setSelectedDays((prev) => prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]);

//   const handleSubmit = () => {
//     if (!planName || !selectedClient || selectedExercises.length === 0) return;
//     setSubmitted(true);
//   };

//   if (submitted) {
//     return (
//       <div className="flex flex-col items-center justify-center py-20 text-center">
//         <div className="w-20 h-20 rounded-2xl bg-success/20 flex items-center justify-center mb-6"><CheckCircle size={40} className="text-success" /></div>
//         <h2 className="font-display font-bold text-2xl mb-2">Plan Created!</h2>
//         <p className="text-muted-foreground mb-6">"{planName}" has been sent to {mockClients.find(c => c.id === selectedClient)?.name}.</p>
//         <button onClick={() => { setSubmitted(false); setPlanName(""); setSelectedClient(""); setSelectedExercises([]); setSelectedDays([]); }}
//           className="gradient-primary text-white font-semibold px-6 py-2.5 rounded-xl shadow-primary hover:opacity-90 transition-opacity">Create Another Plan</button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 animate-slide-up max-w-3xl">
//       <div><h1 className="font-display font-bold text-2xl">Create Exercise Plan</h1><p className="text-muted-foreground text-sm mt-1">Build a personalised plan for your client.</p></div>
//       <div className="bg-card rounded-2xl p-6 shadow-card border border-border space-y-4">
//         <h2 className="font-display font-semibold">Plan Details</h2>
//         <div>
//           <label className="block text-sm font-medium mb-1.5">Plan Name</label>
//           <input type="text" value={planName} onChange={(e) => setPlanName(e.target.value)} placeholder="e.g. Knee Rehabilitation Phase 1"
//             className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all" />
//         </div>
//         <div>
//           <label className="block text-sm font-medium mb-1.5">Assign to Client</label>
//           <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}
//             className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all">
//             <option value="">Select a client...</option>
//             {mockClients.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.condition}</option>)}
//           </select>
//         </div>
//         <div>
//           <label className="block text-sm font-medium mb-2">Session Days</label>
//           <div className="flex gap-2 flex-wrap">
//             {days.map((day) => (
//               <button key={day} onClick={() => toggleDay(day)}
//                 className={`w-12 h-12 rounded-xl text-sm font-semibold transition-all ${selectedDays.includes(day) ? "gradient-primary text-white shadow-primary" : "bg-muted hover:bg-muted/80"}`}>{day}</button>
//             ))}
//           </div>
//         </div>
//       </div>
//       <div>
//         <h2 className="font-display font-semibold mb-1">Select Exercises</h2>
//         <p className="text-muted-foreground text-sm mb-4">{selectedExercises.length} selected</p>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {mockExercises.map((ex) => <ExerciseCard key={ex.id} exercise={ex} showSelect selected={selectedExercises.includes(ex.id)} onSelect={toggleExercise} />)}
//         </div>
//       </div>
//       <div className="sticky bottom-4">
//         <button onClick={handleSubmit} disabled={!planName || !selectedClient || selectedExercises.length === 0}
//           className="w-full gradient-primary text-white font-bold py-4 rounded-2xl shadow-primary hover:opacity-90 transition-opacity disabled:opacity-40 text-lg">
//           Save Plan ({selectedExercises.length} exercises)
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CreatePlan;


// src/features/pt-dashboard/pages/CreatePlan.tsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle } from "lucide-react";
import ExerciseCard from "@/features/pt-dashboard/components/ExerciseCard";
import api from "@/lib/api";
import toast from "react-hot-toast";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const CreatePlan = () => {
  const [planName, setPlanName]               = useState("");
  const [selectedClient, setSelectedClient]   = useState("");
  const [selectedExercises, setSelectedExercises] = useState<number[]>([]);
  const [selectedDays, setSelectedDays]       = useState<string[]>([]);
  const [notes, setNotes]                     = useState("");
  const [submitted, setSubmitted]             = useState(false);
  const [createdPlanName, setCreatedPlanName] = useState("");
  const [createdClientName, setCreatedClientName] = useState("");

  // Fetch real clients from API
  const { data: clientsData, isLoading: clientsLoading } = useQuery({
    queryKey: ['pt-clients'],
    queryFn:  () => api.get('/pt/clients').then(r => r.data.clients),
  });

  // Fetch real exercises from API
  const { data: exercisesData, isLoading: exercisesLoading } = useQuery({
  queryKey: ['pt-exercises'],
  queryFn:  () => api.get('/pt/exercises').then(r => {
    const d = r.data;
    return Array.isArray(d) ? d : (d.exercises ?? d.data ?? []);
  }),
});

  const clients = Array.isArray(clientsData) ? clientsData : [];
const exercises = Array.isArray(exercisesData) ? exercisesData : [];

  const toggleExercise = (id: number) =>
    setSelectedExercises((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );

  const toggleDay = (day: string) =>
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );

  const createPlanMutation = useMutation({
    mutationFn: () =>
      api.post('/pt/plans', {
        client_id:   parseInt(selectedClient),
        title:       planName,
        notes:       notes,
        frequency:   selectedDays.join(','),
        exercise_ids: selectedExercises,
      }),
    onSuccess: () => {
      const client = clients.find((c: any) => c.id === parseInt(selectedClient));
      setCreatedPlanName(planName);
      setCreatedClientName(client?.name ?? 'Client');
      setSubmitted(true);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message ?? 'Failed to create plan.');
    },
  });

  const handleSubmit = () => {
    if (!planName || !selectedClient || selectedExercises.length === 0) {
      toast.error('Please fill in all required fields and select at least one exercise.');
      return;
    }
    createPlanMutation.mutate();
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-2xl bg-success/20 flex items-center justify-center mb-6">
          <CheckCircle size={40} className="text-success" />
        </div>
        <h2 className="font-display font-bold text-2xl mb-2">Plan Created!</h2>
        <p className="text-muted-foreground mb-6">
          "{createdPlanName}" has been sent to {createdClientName}.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setPlanName("");
            setSelectedClient("");
            setSelectedExercises([]);
            setSelectedDays([]);
            setNotes("");
          }}
          className="gradient-primary text-white font-semibold px-6 py-2.5 rounded-xl shadow-primary hover:opacity-90 transition-opacity"
        >
          Create Another Plan
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up max-w-3xl">
      <div>
        <h1 className="font-display font-bold text-2xl">Create Exercise Plan</h1>
        <p className="text-muted-foreground text-sm mt-1">Build a personalised plan for your client.</p>
      </div>

      <div className="bg-card rounded-2xl p-6 shadow-card border border-border space-y-4">
        <h2 className="font-display font-semibold">Plan Details</h2>

        {/* Plan name */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Plan Name</label>
          <input
            type="text"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            placeholder="e.g. Knee Rehabilitation Phase 1"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>

        {/* Assign to client — from database */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Assign to Client</label>
          {clientsLoading ? (
            <div className="h-10 bg-muted rounded-xl animate-pulse" />
          ) : clients.length === 0 ? (
            <div className="p-3 rounded-xl bg-muted text-sm text-muted-foreground">
              No clients linked yet. Share your activation code with patients to get started.
            </div>
          ) : (
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            >
              <option value="">Select a client...</option>
              {clients.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.condition ? `— ${c.condition}` : ''}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Session days */}
        <div>
          <label className="block text-sm font-medium mb-2">Session Days</label>
          <div className="flex gap-2 flex-wrap">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`w-12 h-12 rounded-xl text-sm font-semibold transition-all ${
                  selectedDays.includes(day)
                    ? "gradient-primary text-white shadow-primary"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Plan Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special instructions or notes for the client..."
            rows={2}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>
      </div>

      {/* Exercises — from database */}
      <div>
        <h2 className="font-display font-semibold mb-1">Select Exercises</h2>
        <p className="text-muted-foreground text-sm mb-4">{selectedExercises.length} selected</p>

        {exercisesLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : exercises.length === 0 ? (
          <div className="p-8 text-center bg-muted rounded-2xl">
            <p className="text-3xl mb-2">🏋️</p>
            <p className="text-sm text-muted-foreground">
              No exercises in the library yet. Ask admin to add exercises.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {exercises.map((ex: any) => (
              <ExerciseCard
                key={ex.id}
                exercise={{
                  id:        String(ex.id),
                  name:      ex.title,
                  category:  ex.category,
                  sets:      ex.default_sets,
                  reps:      ex.default_reps,
                  duration:  Math.ceil(ex.default_hold_seconds / 60),
                  thumbnail: ex.illustration_url ?? 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
                  completed: false,
                }}
                showSelect
                selected={selectedExercises.includes(ex.id)}
                onSelect={() => toggleExercise(ex.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <div className="sticky bottom-4">
        <button
          onClick={handleSubmit}
          disabled={
            !planName ||
            !selectedClient ||
            selectedExercises.length === 0 ||
            createPlanMutation.isPending
          }
          className="w-full gradient-primary text-white font-bold py-4 rounded-2xl shadow-primary hover:opacity-90 transition-opacity disabled:opacity-40 text-lg"
        >
          {createPlanMutation.isPending
            ? 'Creating...'
            : `Save Plan (${selectedExercises.length} exercises)`}
        </button>
      </div>
    </div>
  );
};

export default CreatePlan;