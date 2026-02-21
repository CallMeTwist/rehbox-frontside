import { useState } from "react";

export function useMotionData() {
  const [isTracking, setIsTracking] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [repCount, setRepCount] = useState(0);

  return { isTracking, setIsTracking, accuracy, setAccuracy, repCount, setRepCount };
}
