import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { mockExercises } from "@/mock/data";
import { useAuthStore } from "@/store/authStore";
import CameraTracker from "@/features/client-dashboard/components/CameraTracker";
import RatingModal from "@/features/client-dashboard/components/RatingModal";

const ExerciseSession = () => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const { addCoins } = useAuthStore();
  const exercise = mockExercises.find((e) => e.id === exerciseId) || mockExercises[0];
  const [cameraOn, setCameraOn] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [accuracy, setAccuracy] = useState(85);
  const [feedback, setFeedback] = useState("Stand straight, feet shoulder-width apart");

  const feedbacks = [
    "Stand straight, feet shoulder-width apart",
    "Great form! Keep your back straight",
    "Slow down — control the movement",
    "Almost there! One more rep",
    "Perfect form! 🎉",
  ];

  const handleSetDone = () => {
    if (currentSet < exercise.sets) {
      setCurrentSet((s) => s + 1);
      setRepCount(0);
      setFeedback(feedbacks[currentSet] || feedbacks[0]);
      setAccuracy(Math.min(100, accuracy + Math.floor(Math.random() * 5)));
    } else {
      setCompleted(true);
      addCoins(50);
    }
  };

  if (showRating) {
    return <RatingModal exerciseName={exercise.name} onClose={() => navigate("/client/plan")} onSubmit={() => navigate("/client/plan")} />;
  }

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-slide-up">
        <div className="w-24 h-24 rounded-2xl bg-success/20 flex items-center justify-center mb-6"><CheckCircle size={48} className="text-success" /></div>
        <h2 className="font-display font-bold text-3xl mb-2">Session Complete! 🎉</h2>
        <p className="text-muted-foreground mb-2">Great work on {exercise.name}</p>
        <div className="flex gap-6 mb-4">
          <div className="text-center"><p className="font-display font-bold text-2xl text-primary">{accuracy}%</p><p className="text-xs text-muted-foreground">Accuracy</p></div>
          <div className="text-center"><p className="font-display font-bold text-2xl text-success">{exercise.sets * exercise.reps}</p><p className="text-xs text-muted-foreground">Total Reps</p></div>
        </div>
        <div className="coin-badge text-base mb-8">🪙 +50 coins earned!</div>
        <div className="flex gap-3">
          <button onClick={() => setShowRating(true)} className="gradient-primary text-white font-bold px-6 py-3 rounded-xl shadow-primary hover:opacity-90">Rate Session</button>
          <button onClick={() => navigate("/client/progress")} className="border border-border px-6 py-3 rounded-xl font-semibold hover:bg-muted transition-colors">View Progress</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up max-w-2xl mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-muted transition-colors"><ArrowLeft size={18} /></button>
        <div>
          <h1 className="font-display font-bold text-xl">{exercise.name}</h1>
          <p className="text-muted-foreground text-sm">Set {currentSet} of {exercise.sets} · {exercise.reps} reps</p>
        </div>
      </div>

      {/* Camera / Video area */}
      <div className="relative bg-brand-dark rounded-2xl overflow-hidden aspect-video">
        <CameraTracker active={cameraOn} onToggle={() => setCameraOn(!cameraOn)} />
        <img src={exercise.thumbnail} alt={exercise.name} className={`absolute inset-0 w-full h-full object-cover ${cameraOn ? "opacity-20" : "opacity-60"} -z-10`} />
      </div>

      {/* Real-time feedback */}
      <div className="gradient-primary rounded-xl p-4 text-white flex items-center gap-3">
        <span className="text-2xl">💡</span>
        <div className="flex-1">
          <p className="text-sm font-medium">{feedback}</p>
          <p className="text-xs text-white/60 mt-0.5">Accuracy: {accuracy}%</p>
        </div>
      </div>

      {/* Set progress */}
      <div className="bg-card rounded-2xl p-5 shadow-card border border-border">
        <div className="flex gap-2 mb-5">
          {Array.from({ length: exercise.sets }).map((_, i) => (
            <div key={i} className={`flex-1 h-2 rounded-full ${i < currentSet - 1 ? "bg-success" : i === currentSet - 1 ? "gradient-primary" : "bg-muted"}`} />
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mb-6">
          <div className="text-center"><p className="font-display font-bold text-4xl">{exercise.reps}</p><p className="text-muted-foreground text-xs">Reps</p></div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center"><p className="font-display font-bold text-4xl">{currentSet}/{exercise.sets}</p><p className="text-muted-foreground text-xs">Sets</p></div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center"><p className="font-display font-bold text-4xl">{accuracy}%</p><p className="text-muted-foreground text-xs">Accuracy</p></div>
        </div>
        <button onClick={handleSetDone} className="w-full gradient-primary text-white font-bold py-4 rounded-xl shadow-primary hover:opacity-90 transition-opacity text-lg">
          {currentSet < exercise.sets ? `Complete Set ${currentSet}` : "Finish Session 🎉"}
        </button>
      </div>
    </div>
  );
};

export default ExerciseSession;
