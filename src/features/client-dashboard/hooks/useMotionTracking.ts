import { useState, useCallback } from "react";

export function useMotionTracking() {
  const [isActive, setIsActive] = useState(false);
  const [accuracy, setAccuracy] = useState(85);
  const [repCount, setRepCount] = useState(0);
  const [feedback, setFeedback] = useState("Ready to start");

  const startTracking = useCallback(() => setIsActive(true), []);
  const stopTracking = useCallback(() => setIsActive(false), []);
  const incrementRep = useCallback(() => setRepCount(c => c + 1), []);

  return { isActive, accuracy, repCount, feedback, startTracking, stopTracking, incrementRep, setAccuracy, setFeedback };
}
