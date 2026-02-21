import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { mockExercises } from "@/mock/data";
import { useAuthStore } from "@/store/authStore";
import CameraTracker from "@/features/client-dashboard/components/CameraTracker";
import RatingModal from "@/features/client-dashboard/components/RatingModal";

const ExercisePlayer = () => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const { addCoins } = useAuthStore();
  const exercise = mockExercises.find((e) => e.id === exerciseId) || mockExercises[0];
  const [cameraOn, setCameraOn] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [feedback, setFeedback] = useState("Stand straight, feet shoulder-width apart");
  const [accuracy, setAccuracy] = useState(85);

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
      setAccuracy(Math.min(100, accuracy + Math.floor(Math.random() * 5)));
    } else {
      setCompleted(true);
      addCoins(50);
    }
  };

  if (showRating) {
    return <RatingModal exerciseName={exercise.name} onClose={() => { setShowRating(false); navigate("/client/plan"); }} onSubmit={() => { setShowRating(false); navigate("/client/plan"); }} />;
  }

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-slide-up">
        <div className="w-24 h-24 rounded-2xl bg-success/20 flex items-center justify-center mb-6"><CheckCircle size={48} className="text-success" /></div>
        <h2 className="font-display font-bold text-3xl mb-2">Session Complete! 🎉</h2>
        <p className="text-muted-foreground mb-2">Great work on {exercise.name}</p>
        <p className="text-sm text-muted-foreground mb-1">Accuracy: <span className="font-bold text-primary">{accuracy}%</span></p>
        <div className="coin-badge text-base mb-8 animate-coin-earn">🪙 +50 coins earned!</div>
        <div className="flex gap-3">
          <button onClick={() => setShowRating(true)} className="gradient-primary text-white font-bold px-6 py-3 rounded-xl shadow-primary hover:opacity-90">Rate Session</button>
          <button onClick={() => navigate("/client/progress")} className="border border-border px-6 py-3 rounded-xl font-semibold hover:bg-muted transition-colors">View Progress</button>
        </div>
      </div>
    );
  }

  return null; // Used inside ExerciseSession page
};

export default ExercisePlayer;
