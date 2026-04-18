// src/features/client-dashboard/hooks/useMotionTracking.ts
import { useRef, useState, useCallback, useEffect } from 'react';
import { Results } from '@mediapipe/pose';
import {
  analyzeForm,
  computeAngleForRule,
  mirrorLandmarks,
  detectWrongExercise,
  JointRule,
  RepROM,
  RepTracker,
  VISIBILITY_THRESHOLD,
  JOINT_GROUPS,
  ROM_STANDARDS,
} from '@/features/shared/utils/motion';

interface MotionSnapshot {
  timestamp: number;
  landmarks: any[];
}

// Number of frames in the rolling wrong-exercise detection window (~3 seconds at 30fps)
const DETECTION_WINDOW = 90;

export function useMotionTracking(correctAngles?: JointRule[]) {
  const [formScore,           setFormScore]           = useState<number>(0);
  const [feedback,            setFeedback]            = useState<string>('');
  const [repCount,            setRepCount]            = useState<number>(0);
  const [lastROM,             setLastROM]             = useState<RepROM | null>(null);
  const [currentAngle,        setCurrentAngle]        = useState<number | null>(null);
  const [currentAngles,       setCurrentAngles]       = useState<Record<string, number>>({});
  const [wrongExerciseWarning,setWrongExerciseWarning]= useState<string | null>(null);
  const [velocity,            setVelocity]            = useState<number>(0);

  const snapshots           = useRef<MotionSnapshot[]>([]);
  const frameCount          = useRef(0);
  const trackerRef          = useRef<RepTracker | null>(null);
  const correctAnglesRef    = useRef(correctAngles);
  correctAnglesRef.current  = correctAngles;
  const angleBufferRef      = useRef<number[]>([]);
  const prevAngleRef        = useRef<number | null>(null);
  const SMOOTHING_FRAMES    = 5;

  // Rolling angle history for each joint group — used by wrong-exercise detector
  const angleHistoryRef = useRef<Record<string, number[]>>(
    Object.fromEntries(Object.keys(JOINT_GROUPS).map((g) => [g, []])),
  );

  // (Re-)initialise the RepTracker whenever the exercise changes
  useEffect(() => {
    const repRule = correctAngles?.find(
      (r) => r.rep_joint && r.up_threshold != null && r.down_threshold != null,
    );
    if (repRule) {
      trackerRef.current = new RepTracker(repRule.up_threshold!, repRule.down_threshold!);
    } else {
      trackerRef.current = null;
    }
    setRepCount(0);
    setLastROM(null);
    setCurrentAngle(null);
    setCurrentAngles({});
    setWrongExerciseWarning(null);
    angleHistoryRef.current = Object.fromEntries(
      Object.keys(JOINT_GROUPS).map((g) => [g, []]),
    );
  }, [correctAngles]);

  // Determine which joint group the exercise targets (for wrong-exercise detection)
  const targetGroupRef = useRef<string | null>(null);
  useEffect(() => {
    const repRule = correctAngles?.find((r) => r.rep_joint);
    if (repRule?.movement) {
      const std = ROM_STANDARDS[repRule.movement];
      targetGroupRef.current = std?.joint_group ?? null;
    } else {
      targetGroupRef.current = null;
    }
  }, [correctAngles]);

  const smoothAngle = useCallback((raw: number): number => {
    const buf = angleBufferRef.current;
    buf.push(raw);
    if (buf.length > SMOOTHING_FRAMES) buf.shift();
    return buf.reduce((a, b) => a + b, 0) / buf.length;
  }, []);

  const clampToPhysiological = useCallback((angle: number, movementKey?: string): number | null => {
    if (!movementKey) return angle;
    const standard = ROM_STANDARDS[movementKey];
    if (!standard) return angle;
    if (angle < standard.min - 5 || angle > standard.max + 15) return null;
    return angle;
  }, []);

  const processResults = useCallback((results: Results) => {
    if (!results.poseLandmarks) return;

    frameCount.current++;
    const lm = results.poseLandmarks;

    // ── 1. Rep counting (every frame — catches angle crossings) ──────────
    const repRule = correctAnglesRef.current?.find(
      (r) => r.rep_joint && r.up_threshold != null && r.down_threshold != null,
    );

    if (repRule && trackerRef.current) {
      const triplet: [number, number, number] = Array.isArray(repRule.landmarks)
        ? repRule.landmarks as [number, number, number]
        : [repRule.landmarks[0], repRule.landmarks[1], repRule.landmarks[2]];

      const side      = repRule.side ?? 'bilateral';
      const rawAngle  = computeAngleForRule(lm, triplet, side);
      const angle     = rawAngle !== null ? smoothAngle(rawAngle) : null;

      if (angle !== null) {
        const prevCount = trackerRef.current.repCount;
        trackerRef.current.update(angle);
        if (trackerRef.current.repCount !== prevCount) {
          setRepCount(trackerRef.current.repCount);
          setLastROM(trackerRef.current.lastROM());
        }
        setCurrentAngle(angle);
        if (prevAngleRef.current !== null) {
          setVelocity(Math.round(angle - prevAngleRef.current));
        }
        prevAngleRef.current = angle;
      }
    }

    // ── 2. Rolling joint-group angle history (every frame) ───────────────
    // Track all major joints regardless of the exercise rules — used for
    // wrong-exercise detection and the real-time overlay for all groups.
    const history = angleHistoryRef.current;
    for (const [group, { triplets }] of Object.entries(JOINT_GROUPS)) {
      let groupAngle: number | null = null;
      for (const t of triplets) {
        const a = lm[t[0]], b = lm[t[1]], c = lm[t[2]];
        if (
          a && b && c &&
          (a.visibility ?? 0) >= VISIBILITY_THRESHOLD &&
          (b.visibility ?? 0) >= VISIBILITY_THRESHOLD &&
          (c.visibility ?? 0) >= VISIBILITY_THRESHOLD
        ) {
          const ang = computeAngleForRule(lm, t as [number, number, number], 'bilateral');
          if (ang !== null) { groupAngle = ang; break; }
        }
      }
      if (groupAngle !== null) {
        history[group].push(groupAngle);
        if (history[group].length > DETECTION_WINDOW) {
          history[group].shift();
        }
      }
    }

    // ── 3. Every 30th frame: form scoring + snapshot + current angles ────
    if (frameCount.current % 30 !== 0) return;

    // Cap snapshots at 120 (~2 min of data at 1 per second)
    const snapshotInterval = snapshots.current.length >= 120 ? 60 : 30;
    if (frameCount.current % snapshotInterval === 0) {
      snapshots.current.push({
        timestamp: Date.now(),
        landmarks: lm.map((l) => ({
          x:          parseFloat(l.x.toFixed(4)),
          y:          parseFloat(l.y.toFixed(4)),
          z:          parseFloat(l.z.toFixed(4)),
          visibility: parseFloat((l.visibility ?? 0).toFixed(4)),
        })),
      });
    }

    // Current angle snapshot for each rule (for the ROM overlay panel)
    const rules = correctAnglesRef.current;
    if (rules && rules.length > 0) {
      const angles: Record<string, number> = {};
      for (const rule of rules) {
        const triplet: [number, number, number] = Array.isArray(rule.landmarks)
          ? rule.landmarks as [number, number, number]
          : [rule.landmarks[0], rule.landmarks[1], rule.landmarks[2]];
        const rawAngle = computeAngleForRule(lm, triplet, rule.side ?? 'bilateral');
        const angle = rawAngle !== null ? clampToPhysiological(rawAngle, rule.movement) : null;
        if (angle !== null) angles[rule.joint] = Math.round(angle);
      }
      setCurrentAngles(angles);

      const { score, feedback: fb } = analyzeForm(lm, rules);
      setFormScore(score);
      setFeedback(fb);
    } else {
      const visibleCount = lm.filter((l) => (l.visibility ?? 0) > 0.7).length;
      const score        = Math.round((visibleCount / 33) * 100);
      setFormScore(score);
      setFeedback(
        score >= 80 ? 'Great form! Keep it up 💪'
        : score >= 50 ? 'Good — try to face the camera more'
        : 'Move closer to the camera',
      );
    }

    // ── 4. Every 90th frame: wrong-exercise detection (~3 s) ─────────────
    if (frameCount.current % DETECTION_WINDOW === 0) {
      const targetGroup = targetGroupRef.current;
      if (targetGroup) {
        const warning = detectWrongExercise(angleHistoryRef.current, targetGroup);
        setWrongExerciseWarning(warning);
      }
    }
  }, []); // reads correctAngles via ref on every call

  const getMotionData = useCallback(() => ({
    snapshots:        snapshots.current,
    total_frames:     frameCount.current,
    duration_seconds: Math.round(frameCount.current / 30),
    rep_count:        trackerRef.current?.repCount ?? 0,
    peak_rom:         trackerRef.current?.bestROM() ?? null,
    avg_rom:          trackerRef.current?.avgAchievedROM() ?? null,
    rep_history:      trackerRef.current?.completedReps ?? [],
  }), []);

  const reset = useCallback(() => {
    snapshots.current  = [];
    frameCount.current = 0;
    trackerRef.current?.reset();
    angleHistoryRef.current = Object.fromEntries(
      Object.keys(JOINT_GROUPS).map((g) => [g, []]),
    );
    angleBufferRef.current = [];
    prevAngleRef.current   = null;
    setFormScore(0);
    setFeedback('');
    setRepCount(0);
    setLastROM(null);
    setCurrentAngle(null);
    setCurrentAngles({});
    setWrongExerciseWarning(null);
    setVelocity(0);
  }, []);

  return {
    processResults,
    formScore,
    feedback,
    repCount,
    lastROM,
    currentAngle,
    currentAngles,
    wrongExerciseWarning,
    velocity,
    getMotionData,
    reset,
  };
}
