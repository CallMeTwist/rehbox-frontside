import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Camera, CameraOff, CheckCircle, Play, Pause } from "lucide-react";
import { mockExercises } from "@/mock/data";
import { useAuthStore } from "@/store/authStore";

const ClientSession = () => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const { addCoins } = useAuthStore();
  const exercise = mockExercises.find((e) => e.id === exerciseId) || mockExercises[0];
  const [cameraOn, setCameraOn] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [completed, setCompleted] = useState(false);
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
      setFeedback(feedbacks[currentSet] || feedbacks[0]);
    } else {
      setCompleted(true);
      addCoins(50);
    }
  };

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-slide-up">
        <div className="w-24 h-24 rounded-2xl bg-success/20 flex items-center justify-center mb-6">
          <CheckCircle size={48} className="text-success" />
        </div>
        <h2 className="font-display font-bold text-3xl mb-2">Session Complete! 🎉</h2>
        <p className="text-muted-foreground mb-2">Great work on {exercise.name}</p>
        <div className="coin-badge text-base mb-8">🪙 +50 coins earned!</div>
        <div className="flex gap-3">
          <button onClick={() => navigate("/client/plan")} className="gradient-primary text-white font-bold px-6 py-3 rounded-xl shadow-primary hover:opacity-90">Back to Plan</button>
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
      <div className="relative bg-brand-dark rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
        {cameraOn ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white/60 text-center">
              <Camera size={48} className="mx-auto mb-2 animate-pulse-soft" />
              <p className="text-sm">Camera active · MediaPipe tracking</p>
              <p className="text-xs opacity-60 mt-1">Pose overlay would appear here</p>
            </div>
            {/* Skeleton overlay placeholder */}
            <div className="absolute inset-0 pointer-events-none">
              <svg viewBox="0 0 400 300" className="w-full h-full opacity-30">
                <circle cx="200" cy="60" r="20" stroke="#1B3E8F" strokeWidth="3" fill="none" />
                <line x1="200" y1="80" x2="200" y2="180" stroke="#1B3E8F" strokeWidth="3" />
                <line x1="200" y1="110" x2="150" y2="150" stroke="#E5197D" strokeWidth="3" />
                <line x1="200" y1="110" x2="250" y2="150" stroke="#E5197D" strokeWidth="3" />
                <line x1="200" y1="180" x2="170" y2="250" stroke="#1B3E8F" strokeWidth="3" />
                <line x1="200" y1="180" x2="230" y2="250" stroke="#1B3E8F" strokeWidth="3" />
              </svg>
            </div>
          </div>
        ) : (
          <div className="text-white/60 text-center">
            <CameraOff size={48} className="mx-auto mb-2" />
            <p className="text-sm">Camera off</p>
          </div>
        )}
        <img src={exercise.thumbnail} alt={exercise.name} className={`absolute inset-0 w-full h-full object-cover ${cameraOn ? "opacity-20" : "opacity-60"}`} />
        <button onClick={() => setCameraOn(!cameraOn)} className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-white/30 transition-colors">
          {cameraOn ? <CameraOff size={14} /> : <Camera size={14} />}
          {cameraOn ? "Camera Off" : "Enable Camera"}
        </button>
      </div>

      {/* Feedback */}
      <div className="gradient-primary rounded-xl p-4 text-white flex items-center gap-3">
        <span className="text-2xl">💡</span>
        <p className="text-sm font-medium">{feedback}</p>
      </div>

      {/* Set progress */}
      <div className="bg-card rounded-2xl p-5 shadow-card border border-border">
        <div className="flex gap-2 mb-5">
          {Array.from({ length: exercise.sets }).map((_, i) => (
            <div key={i} className={`flex-1 h-2 rounded-full ${i < currentSet - 1 ? "bg-success" : i === currentSet - 1 ? "gradient-primary" : "bg-muted"}`} />
          ))}
        </div>
        <div className="flex items-center justify-center gap-6 mb-6">
          <div className="text-center">
            <p className="font-display font-bold text-4xl">{exercise.reps}</p>
            <p className="text-muted-foreground text-xs">Reps</p>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center">
            <p className="font-display font-bold text-4xl">{currentSet}/{exercise.sets}</p>
            <p className="text-muted-foreground text-xs">Sets</p>
          </div>
        </div>
        <button onClick={handleSetDone} className="w-full gradient-primary text-white font-bold py-4 rounded-xl shadow-primary hover:opacity-90 transition-opacity text-lg">
          {currentSet < exercise.sets ? `Complete Set ${currentSet}` : "Finish Session 🎉"}
        </button>
      </div>
    </div>
  );
};

export default ClientSession;
