// src/features/client-dashboard/pages/ExerciseSession.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { CameraTracker } from '../components/CameraTracker';
import { useMotionTracking } from '../hooks/useMotionTracking';
import { useMyPlan } from '../hooks/useMyPlan';

type Phase = 'intro' | 'active' | 'complete';

const ExerciseSession = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate       = useNavigate();
  const [phase, setPhase]           = useState<Phase>('intro');
  const [sessionId, setSessionId]   = useState<number | null>(null);
  const [rating, setRating]         = useState<number>(0);
  const [cameraOn, setCameraOn]     = useState(false);
  const [elapsed, setElapsed]       = useState(0);

  const { processResults, formScore, feedback, getMotionData, reset } = useMotionTracking();
  const { data: planData } = useMyPlan();

  // Find the exercise from the active plan
  const exercise = planData?.plan?.exercises?.find(
    (ex: any) => ex.id === parseInt(exerciseId ?? '0')
  );
  const planId = planData?.plan?.id;

  // Timer during active phase
  useEffect(() => {
    if (phase !== 'active') return;
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [phase]);

  // Start session API call
  const startMutation = useMutation({
    mutationFn: () =>
      api.post('/client/sessions', {
        exercise_plan_id: planId,
        exercise_id:      parseInt(exerciseId ?? '0'),
      }),
    onSuccess: ({ data }) => {
      setSessionId(data.session_id);
      setPhase('active');
      setCameraOn(true);
    },
    onError: () => toast.error('Could not start session. Try again.'),
  });

  // Complete session API call
  const completeMutation = useMutation({
    mutationFn: () => {
      const motionData = getMotionData();
      return api.put(`/client/sessions/${sessionId}/complete`, {
        motion_data: motionData,
        form_score:  formScore,
        rating:      rating || null,
      });
    },
    onSuccess: ({ data }) => {
      setCameraOn(false);
      setPhase('complete');
      toast.success(`+${data.coins_earned} coins earned! 🪙`);
    },
    onError: () => toast.error('Could not save session. Try again.'),
  });

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  if (!exercise) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-4xl mb-3">❌</p>
          <p className="font-semibold">Exercise not found in your plan</p>
          <button onClick={() => navigate('/client/plan')}
            className="mt-4 text-primary text-sm underline">
            Back to plan
          </button>
        </div>
      </div>
    );
  }

  // ── INTRO PHASE ──────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <button onClick={() => navigate('/client/plan')}
            className="text-muted-foreground hover:text-foreground transition-colors">
            ← Back
          </button>
          <h1 className="font-display font-bold">{exercise.title}</h1>
        </div>

        <div className="flex-1 p-6 space-y-6 max-w-lg mx-auto w-full">
          {/* Exercise illustration */}
          <div className="bg-muted rounded-2xl h-52 flex items-center justify-center">
            {exercise.illustration_url
              ? <img src={exercise.illustration_url} alt={exercise.title}
                  className="w-full h-full object-cover rounded-2xl" />
              : <span className="text-6xl">🏃</span>
            }
          </div>

          {/* Exercise details */}
          <div className="bg-card rounded-2xl border border-border p-5 space-y-3">
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: 'Sets', value: exercise.pivot?.sets ?? exercise.default_sets },
                { label: 'Reps', value: exercise.pivot?.reps ?? exercise.default_reps },
                { label: 'Hold', value: `${exercise.pivot?.hold_seconds ?? 0}s` },
              ].map((item) => (
                <div key={item.label} className="bg-muted rounded-xl p-3">
                  <p className="font-display font-bold text-xl">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>

            {exercise.pivot?.pt_notes && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
                <p className="text-xs font-semibold text-primary mb-1">PT Note</p>
                <p className="text-sm text-muted-foreground">{exercise.pivot.pt_notes}</p>
              </div>
            )}
          </div>

          {/* Instructions */}
          {exercise.instructions && (
            <div className="bg-card rounded-2xl border border-border p-5">
              <p className="text-sm font-semibold mb-2">Instructions</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {exercise.instructions}
              </p>
            </div>
          )}

          {/* Camera tip */}
          <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 flex gap-3">
            <span className="text-xl">📱</span>
            <div>
              <p className="text-sm font-semibold">Position your camera</p>
              <p className="text-xs text-muted-foreground mt-1">
                Place your phone 6–8 feet away so your full body is visible
              </p>
            </div>
          </div>

          <button
            onClick={() => startMutation.mutate()}
            disabled={startMutation.isPending}
            className="w-full gradient-primary text-white font-bold py-4 rounded-2xl shadow-primary hover:opacity-90 transition disabled:opacity-50 text-lg"
          >
            {startMutation.isPending ? 'Starting...' : '▶ Start Exercise'}
          </button>
        </div>
      </div>
    );
  }

  // ── ACTIVE PHASE ─────────────────────────────────────────────────────
  if (phase === 'active') {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between p-4 bg-black/80 text-white">
          <div>
            <p className="font-display font-bold">{exercise.title}</p>
            <p className="text-white/60 text-xs">
              {exercise.pivot?.sets} sets · {exercise.pivot?.reps} reps
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono font-bold text-lg">{formatTime(elapsed)}</p>
            <p className="text-white/60 text-xs">elapsed</p>
          </div>
        </div>

        {/* Split view — video instruction + camera */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
          {/* Left: exercise video or illustration */}
          <div className="bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-center">
            {exercise.video_url
              ? <video src={exercise.video_url} autoPlay loop muted
                  className="w-full h-full object-cover" />
              : <div className="text-center text-white p-8">
                  <div className="text-7xl mb-4">🏃</div>
                  <p className="font-semibold">{exercise.title}</p>
                  <p className="text-white/60 text-sm mt-2">Follow along</p>
                </div>
            }
          </div>

          {/* Right: live camera + pose overlay */}
          <div className="relative rounded-2xl overflow-hidden">
            <CameraTracker onResults={processResults} isActive={cameraOn} />

            {/* Form score overlay */}
            <div className="absolute top-3 left-3 bg-black/70 rounded-xl px-3 py-2">
              <p className="text-white text-xs font-semibold">Form Score</p>
              <p className={`font-display font-bold text-lg ${
                formScore >= 80 ? 'text-green-400'
                : formScore >= 50 ? 'text-yellow-400'
                : 'text-red-400'
              }`}>
                {formScore}%
              </p>
            </div>
          </div>
        </div>

        {/* AI feedback bar */}
        {feedback && (
          <div className="mx-2 mb-2 bg-[#E8358A]/90 rounded-xl px-4 py-3 text-white text-sm font-medium text-center">
            {feedback}
          </div>
        )}

        {/* Complete button */}
        <div className="p-4">
          <button
            onClick={() => completeMutation.mutate()}
            disabled={completeMutation.isPending}
            className="w-full bg-success text-white font-bold py-4 rounded-2xl hover:opacity-90 transition disabled:opacity-50 text-lg"
          >
            {completeMutation.isPending ? 'Saving...' : '✅ Complete Session'}
          </button>
        </div>
      </div>
    );
  }

  // ── COMPLETE PHASE ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="bg-card rounded-2xl border border-border shadow-card max-w-sm w-full p-8 text-center">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="font-display font-bold text-2xl mb-1">Session Complete!</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Great work on {exercise.title}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Time', value: formatTime(elapsed) },
            { label: 'Form',  value: `${formScore}%` },
            { label: 'Coins', value: formScore >= 80 ? '+3 🪙' : formScore >= 50 ? '+2 🪙' : '+1 🪙' },
          ].map((s) => (
            <div key={s.label} className="bg-muted rounded-xl p-3">
              <p className="font-display font-bold text-lg">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Rating */}
        <div className="mb-6">
          <p className="text-sm font-medium mb-3">Rate this exercise</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl transition-transform hover:scale-125 ${
                  star <= rating ? 'opacity-100' : 'opacity-30'
                }`}
              >
                ⭐
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate('/client/plan')}
            className="flex-1 border border-border rounded-xl py-3 text-sm font-semibold hover:bg-muted transition"
          >
            Back to Plan
          </button>
          <button
            onClick={() => navigate('/client/progress')}
            className="flex-1 gradient-primary text-white rounded-xl py-3 text-sm font-semibold"
          >
            View Progress
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseSession;