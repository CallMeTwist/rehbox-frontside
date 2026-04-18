// src/features/client-dashboard/pages/ExerciseSession.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { CameraTracker } from '../components/CameraTracker';
import { useMotionTracking } from '../hooks/useMotionTracking';
import { useMyPlan } from '../hooks/useMyPlan';
import VideoPlayer from '@/features/shared/components/VideoPlayer';
import { ROM_STANDARDS } from '@/features/shared/utils/motion';

type Phase = 'intro' | 'active' | 'complete';

// ── ROM Gauge — digital goniometer display ────────────────────────────
interface ROMGaugeProps {
  jointName:    string;    // display name
  movement?:    string;    // key into ROM_STANDARDS
  currentAngle: number;    // live angle from MediaPipe
  sessionBest:  number;    // best angle achieved this session
}

function ROMGauge({ jointName, movement, currentAngle, sessionBest }: ROMGaugeProps) {
  const standard = movement ? ROM_STANDARDS[movement] : null;
  const normalMax = standard?.max ?? 180;

  // % of normal ROM achieved (capped at 100%)
  const pctCurrent = Math.min(100, Math.round((currentAngle / normalMax) * 100));
  const pctBest    = Math.min(100, Math.round((sessionBest  / normalMax) * 100));

  const barColor =
    pctBest >= 85 ? '#22C55E' :   // green — excellent
    pctBest >= 60 ? '#F59E0B' :   // amber — moderate
    '#EF4444';                     // red   — restricted

  return (
    <div className="bg-black/75 rounded-2xl p-4 w-56 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-white text-xs font-semibold uppercase tracking-wide truncate">
          {jointName}
        </p>
        {standard && (
          <p className="text-white/50 text-xs">0–{normalMax}°</p>
        )}
      </div>

      {/* Current angle + percentage */}
      <div className="flex items-end gap-2">
        <p className="text-white font-display font-bold text-3xl leading-none">
          {currentAngle}°
        </p>
        <p className="text-white/60 text-xs mb-1">{pctCurrent}% of range</p>
      </div>

      {/* Progress bar */}
      {standard && (
        <div className="w-full h-2.5 bg-white/15 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-150"
            style={{ width: `${pctCurrent}%`, backgroundColor: barColor }}
          />
        </div>
      )}

      {/* Session best */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/50">Session best</span>
        <span className="font-semibold" style={{ color: barColor }}>
          {sessionBest}° ({pctBest}%)
        </span>
      </div>
    </div>
  );
}

// ── Main ExerciseSession ──────────────────────────────────────────────
const ExerciseSession = () => {
  const { exerciseId } = useParams<{ exerciseId: string }>();
  const navigate       = useNavigate();
  const [phase, setPhase]           = useState<Phase>('intro');
  const [sessionId, setSessionId]   = useState<number | null>(null);
  const [rating, setRating]         = useState<number>(0);
  const [cameraOn, setCameraOn]     = useState(false);
  const [elapsed, setElapsed]       = useState(0);
  const [sessionBestAngle, setSessionBestAngle] = useState(0);

  const { data: planData } = useMyPlan();

  const targetId = parseInt(exerciseId ?? '0');
  let exercise: any = null;
  let planId: number | null = null;
  for (const plan of (planData?.plans ?? [])) {
    const found = plan.exercises?.find((ex: any) => ex.id === targetId);
    if (found) { exercise = found; planId = plan.id; break; }
  }

  const {
    processResults,
    formScore,
    feedback,
    repCount,
    lastROM,
    currentAngle,
    wrongExerciseWarning,
    getMotionData,
    reset,
  } = useMotionTracking(
    exercise?.correct_angles ?? undefined,
    exercise?.tracking_config ?? undefined,
  );

  // Track session-best angle for the ROM gauge
  useEffect(() => {
    if (currentAngle !== null && currentAngle > sessionBestAngle) {
      setSessionBestAngle(currentAngle);
    }
  }, [currentAngle]);

  // Timer during active phase
  useEffect(() => {
    if (phase !== 'active') return;
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [phase]);

  const startMutation = useMutation({
    mutationFn: () =>
      api.post('/client/sessions', {
        exercise_plan_id: planId,
        exercise_id:      parseInt(exerciseId ?? '0'),
      }),
    onSuccess: ({ data }) => {
      setSessionId(data.session_id);
      setSessionBestAngle(0);
      reset();
      setPhase('active');
      setCameraOn(true);
    },
    onError: () => toast.error('Could not start session. Try again.'),
  });

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
      toast.success(`+${data.coins_earned} coins earned! 🪙`);
    },
    onError: () =>
      toast.error('Session data could not be saved — your progress was still recorded.'),
  });

  const handleComplete = () => {
    setCameraOn(false);
    setPhase('complete');
    completeMutation.mutate();
  };

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

  // Pull rep joint rule for the ROM gauge
  const repRule = exercise?.correct_angles?.find((r: any) => r.rep_joint);
  const romStandard = repRule?.movement ? ROM_STANDARDS[repRule.movement] : null;

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
          <div className="bg-muted rounded-2xl h-52 flex items-center justify-center overflow-hidden">
            {exercise.illustration_url
              ? <img src={exercise.illustration_url} alt={exercise.title}
                  className="w-full h-full object-cover" />
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

            {/* Normal ROM reference */}
            {romStandard && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
                <p className="text-xs font-semibold text-primary mb-0.5">Target Range of Motion</p>
                <p className="text-sm text-muted-foreground">
                  {romStandard.label}: <span className="font-semibold text-foreground">0–{romStandard.max}°</span>
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Your achieved ROM will be measured live using goniometric tracking.
                </p>
              </div>
            )}

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
                Place your device 6–8 feet away so your full body is visible.
                {repRule?.side === 'left'  && ' Face the camera with your LEFT side visible.'}
                {repRule?.side === 'right' && ' Face the camera with your RIGHT side visible.'}
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
    const showROMGauge = !!repRule && currentAngle !== null;

    return (
      <div className="min-h-screen bg-black flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between p-4 bg-black/80 text-white">
          <div>
            <p className="font-display font-bold">{exercise.title}</p>
            <p className="text-white/60 text-xs">
              {exercise.pivot?.sets} sets · {exercise.pivot?.reps} reps
              {repRule?.movement && ` · ${ROM_STANDARDS[repRule.movement]?.label ?? ''}`}
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono font-bold text-lg">{formatTime(elapsed)}</p>
            <p className="text-white/60 text-xs">elapsed</p>
          </div>
        </div>

        {/* Split view */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
          {/* Left: exercise video or illustration */}
          <div className="rounded-2xl overflow-hidden flex items-center justify-center" style={{ background: '#0F2557' }}>
            {exercise.video_url
              ? <VideoPlayer src={exercise.video_url} className="w-full h-full rounded-none" />
              : <div className="text-center text-white p-8">
                  <div className="text-7xl mb-4">🏃</div>
                  <p className="font-semibold">{exercise.title}</p>
                  <p className="text-white/60 text-sm mt-2">Follow along</p>
                </div>
            }
          </div>

          {/* Right: live camera + overlays */}
          <div className="relative rounded-2xl overflow-hidden">
            <CameraTracker
              onResults={processResults}
              isActive={cameraOn}
              jointRules={exercise?.correct_angles ?? undefined}
            />

            {/* Form score — top left */}
            <div className="absolute top-3 left-3 bg-black/75 rounded-xl px-3 py-2">
              <p className="text-white text-xs font-semibold">Form Score</p>
              <p className={`font-display font-bold text-lg ${
                formScore >= 80 ? 'text-green-400'
                : formScore >= 50 ? 'text-amber-400'
                : 'text-red-400'
              }`}>
                {formScore}%
              </p>
            </div>

            {/* Rep counter — top right */}
            {repRule && (
              <div className="absolute top-3 right-3 bg-black/75 rounded-xl px-3 py-2 text-right">
                <p className="text-white text-xs font-semibold">Reps</p>
                <p className="font-display font-bold text-2xl text-white">{repCount}</p>
                {lastROM && (
                  <p className="text-white/60 text-xs">
                    Last: {lastROM.min.toFixed(0)}°–{lastROM.max.toFixed(0)}°
                  </p>
                )}
              </div>
            )}

            {/* ROM gauge — bottom left */}
            {showROMGauge && (
              <div className="absolute bottom-3 left-3">
                <ROMGauge
                  jointName={romStandard?.label ?? repRule.joint}
                  movement={repRule.movement}
                  currentAngle={Math.round(currentAngle!)}
                  sessionBest={sessionBestAngle}
                />
              </div>
            )}

            {/* Side indicator when single-sided */}
            {repRule?.side && repRule.side !== 'bilateral' && (
              <div className="absolute bottom-3 right-3 bg-black/75 rounded-xl px-3 py-1.5">
                <p className="text-white text-xs font-semibold uppercase tracking-wider">
                  {repRule.side === 'left' ? '◀ Left' : 'Right ▶'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Wrong-exercise warning — amber bar, only when triggered */}
        {wrongExerciseWarning && !feedback && (
          <div className="mx-2 mb-1 rounded-xl px-4 py-3 text-white text-sm font-medium text-center bg-amber-600/90">
            ⚠ {wrongExerciseWarning}
          </div>
        )}

        {/* Form feedback bar */}
        {feedback && (
          <div
            className="mx-2 mb-2 rounded-xl px-4 py-3 text-white text-sm font-medium text-center"
            style={{ background: 'rgba(229,25,125,0.90)' }}
          >
            {feedback}
          </div>
        )}

        {/* Complete button */}
        <div className="p-4">
          <button
            onClick={handleComplete}
            className="w-full bg-success text-white font-bold py-4 rounded-2xl hover:opacity-90 transition text-lg"
          >
            ✅ Complete Session
          </button>
        </div>
      </div>
    );
  }

  // ── COMPLETE PHASE ───────────────────────────────────────────────────
  const motionData = getMotionData();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="bg-card rounded-2xl border border-border shadow-card max-w-sm w-full p-8 text-center">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="font-display font-bold text-2xl mb-1">Session Complete!</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Great work on {exercise.title}
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-muted rounded-xl p-3">
            <p className="font-display font-bold text-base">{formatTime(elapsed)}</p>
            <p className="text-xs text-muted-foreground">Duration</p>
          </div>
          <div className="bg-muted rounded-xl p-3">
            <p className={`font-display font-bold text-base ${
              formScore >= 80 ? 'text-green-600' : formScore >= 50 ? 'text-amber-600' : 'text-red-600'
            }`}>
              {formScore}%
            </p>
            <p className="text-xs text-muted-foreground">Form Score</p>
          </div>

          {motionData.rep_count > 0 && (
            <div className="bg-muted rounded-xl p-3">
              <p className="font-display font-bold text-base">{motionData.rep_count}</p>
              <p className="text-xs text-muted-foreground">Reps Completed</p>
            </div>
          )}

          {sessionBestAngle > 0 && romStandard && (
            <div className="bg-muted rounded-xl p-3">
              <p className="font-display font-bold text-base">
                {sessionBestAngle}°
              </p>
              <p className="text-xs text-muted-foreground">
                Best ROM ({Math.round((sessionBestAngle / romStandard.max) * 100)}% of normal)
              </p>
            </div>
          )}

          <div className="bg-muted rounded-xl p-3 col-span-2">
            <p className="font-display font-bold text-base text-primary">
              {formScore >= 80 ? '+3 🪙' : formScore >= 50 ? '+2 🪙' : '+1 🪙'}
            </p>
            <p className="text-xs text-muted-foreground">Coins Earned</p>
          </div>
        </div>

        {/* Per-rep ROM breakdown */}
        {motionData.rep_history.length > 0 && romStandard && (
          <div className="bg-muted/50 rounded-xl p-4 mb-6 text-left">
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
              Per-Rep ROM — {romStandard.label}
            </p>
            <div className="space-y-1.5 max-h-32 overflow-y-auto">
              {motionData.rep_history.map((rep: any, i: number) => {
                const pct = Math.min(100, Math.round((rep.max / romStandard.max) * 100));
                return (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-10">Rep {i + 1}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: pct >= 85 ? '#22C55E' : pct >= 60 ? '#F59E0B' : '#EF4444',
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium w-12 text-right">{rep.max.toFixed(0)}°</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
