// src/features/client-dashboard/hooks/useMotionTracking.ts
import { useRef, useState, useCallback, useEffect } from 'react';
import { Results } from '@mediapipe/pose';
import {
  analyzeForm,
  calculateAngle,
  JointRule,
  RepROM,
  RepTracker,
  VISIBILITY_THRESHOLD,
} from '@/features/shared/utils/motion';

interface MotionSnapshot {
  timestamp: number;
  landmarks: any[];
}

export function useMotionTracking(correctAngles?: JointRule[]) {
  const [formScore, setFormScore] = useState<number>(0);
  const [feedback, setFeedback]   = useState<string>('');
  const [repCount, setRepCount]   = useState<number>(0);
  const [lastROM, setLastROM]     = useState<RepROM | null>(null);

  const snapshots      = useRef<MotionSnapshot[]>([]);
  const frameCount     = useRef(0);
  const trackerRef     = useRef<RepTracker | null>(null);
  const correctAnglesRef = useRef(correctAngles);
  correctAnglesRef.current = correctAngles;

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
  }, [correctAngles]);

  const processResults = useCallback((results: Results) => {
    if (!results.poseLandmarks) return;

    frameCount.current++;
    const lm = results.poseLandmarks;

    // ── Per-frame: rep counting (must run every frame to catch crossings) ──
    const repRule = correctAnglesRef.current?.find(
      (r) => r.rep_joint && r.up_threshold != null && r.down_threshold != null,
    );
    if (repRule && trackerRef.current) {
      const [ai, bi, ci] = Array.isArray(repRule.landmarks)
        ? repRule.landmarks
        : [repRule.landmarks[0], repRule.landmarks[1], repRule.landmarks[2]];

      const a = lm[ai];
      const b = lm[bi];
      const c = lm[ci];

      if (
        a && b && c &&
        (a.visibility ?? 0) >= VISIBILITY_THRESHOLD &&
        (b.visibility ?? 0) >= VISIBILITY_THRESHOLD &&
        (c.visibility ?? 0) >= VISIBILITY_THRESHOLD
      ) {
        const angle = calculateAngle(a, b, c);
        const prevCount = trackerRef.current.repCount;
        trackerRef.current.update(angle);
        if (trackerRef.current.repCount !== prevCount) {
          setRepCount(trackerRef.current.repCount);
          setLastROM(trackerRef.current.lastROM());
        }
      }
    }

    // ── Every 30th frame: form scoring + landmark snapshot ──
    if (frameCount.current % 30 !== 0) return;

    // Cap at 120 snapshots (~2 min of data). For longer sessions keep every
    // other snapshot so the payload stays bounded.
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

    const rules = correctAnglesRef.current;

    if (rules && rules.length > 0) {
      const { score, feedback: fb } = analyzeForm(lm, rules);
      setFormScore(score);
      setFeedback(fb);
    } else {
      const visibleCount = lm.filter((l) => (l.visibility ?? 0) > 0.7).length;
      const score = Math.round((visibleCount / 33) * 100);
      setFormScore(score);
      if (score >= 80) setFeedback('Great form! Keep it up 💪');
      else if (score >= 50) setFeedback('Good — try to face the camera more');
      else setFeedback('Move closer to the camera');
    }
  }, []); // reads correctAngles via ref on every call

  const getMotionData = useCallback(() => ({
    snapshots:        snapshots.current,
    total_frames:     frameCount.current,
    duration_seconds: Math.round(frameCount.current / 30),
    rep_count:        trackerRef.current?.repCount ?? 0,
    peak_rom:         trackerRef.current?.lastROM() ?? null,
    rep_history:      trackerRef.current?.completedReps ?? [],
  }), []);

  const reset = useCallback(() => {
    snapshots.current  = [];
    frameCount.current = 0;
    trackerRef.current?.reset();
    setFormScore(0);
    setFeedback('');
    setRepCount(0);
    setLastROM(null);
  }, []);

  return { processResults, formScore, feedback, repCount, lastROM, getMotionData, reset };
}
