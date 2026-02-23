// src/features/client-dashboard/hooks/useMotionTracking.ts
import { useRef, useState, useCallback } from 'react';
import { Results } from '@mediapipe/pose';

interface MotionSnapshot {
  timestamp: number;
  landmarks: any[];
}

export function useMotionTracking() {
  const [formScore, setFormScore]     = useState<number>(0);
  const [feedback, setFeedback]       = useState<string>('');
  const snapshots = useRef<MotionSnapshot[]>([]);
  const frameCount = useRef(0);

  const processResults = useCallback((results: Results) => {
    if (!results.poseLandmarks) return;

    frameCount.current++;

    // Capture a snapshot every 30 frames (~1 sec at 30fps)
    if (frameCount.current % 30 === 0) {
      snapshots.current.push({
        timestamp: Date.now(),
        landmarks: results.poseLandmarks.map((l) => ({
          x: parseFloat(l.x.toFixed(4)),
          y: parseFloat(l.y.toFixed(4)),
          z: parseFloat(l.z.toFixed(4)),
          visibility: parseFloat((l.visibility ?? 0).toFixed(4)),
        })),
      });

      // Simple form scoring based on landmark visibility
      // (Full AI scoring would be a backend model — this is the foundation)
      const visibleLandmarks = results.poseLandmarks.filter(
        (l) => (l.visibility ?? 0) > 0.7
      ).length;
      const score = Math.round((visibleLandmarks / 33) * 100);
      setFormScore(score);

      if (score >= 80) setFeedback('Great form! Keep it up 💪');
      else if (score >= 50) setFeedback('Good — try to face the camera more');
      else setFeedback('Move closer to the camera');
    }
  }, []);

  const getMotionData = useCallback(() => ({
    snapshots:   snapshots.current,
    total_frames: frameCount.current,
    duration_seconds: Math.round(frameCount.current / 30),
  }), []);

  const reset = useCallback(() => {
    snapshots.current = [];
    frameCount.current = 0;
    setFormScore(0);
    setFeedback('');
  }, []);

  return { processResults, formScore, feedback, getMotionData, reset };
}