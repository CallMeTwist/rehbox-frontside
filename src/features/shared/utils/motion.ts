// MediaPipe Pose helpers for browser-based motion tracking
// These utilities wrap MediaPipe Pose for use in the exercise session player

export interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

export interface PoseResult {
  landmarks: PoseLandmark[];
  worldLandmarks: PoseLandmark[];
}

// Key body landmark indices (MediaPipe convention)
export const LANDMARKS = {
  NOSE: 0,
  LEFT_SHOULDER: 11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13,
  RIGHT_ELBOW: 14,
  LEFT_WRIST: 15,
  RIGHT_WRIST: 16,
  LEFT_HIP: 23,
  RIGHT_HIP: 24,
  LEFT_KNEE: 25,
  RIGHT_KNEE: 26,
  LEFT_ANKLE: 27,
  RIGHT_ANKLE: 28,
} as const;

// Skeleton connections for drawing overlay
export const SKELETON_CONNECTIONS: [number, number][] = [
  [LANDMARKS.LEFT_SHOULDER, LANDMARKS.RIGHT_SHOULDER],
  [LANDMARKS.LEFT_SHOULDER, LANDMARKS.LEFT_ELBOW],
  [LANDMARKS.LEFT_ELBOW, LANDMARKS.LEFT_WRIST],
  [LANDMARKS.RIGHT_SHOULDER, LANDMARKS.RIGHT_ELBOW],
  [LANDMARKS.RIGHT_ELBOW, LANDMARKS.RIGHT_WRIST],
  [LANDMARKS.LEFT_SHOULDER, LANDMARKS.LEFT_HIP],
  [LANDMARKS.RIGHT_SHOULDER, LANDMARKS.RIGHT_HIP],
  [LANDMARKS.LEFT_HIP, LANDMARKS.RIGHT_HIP],
  [LANDMARKS.LEFT_HIP, LANDMARKS.LEFT_KNEE],
  [LANDMARKS.LEFT_KNEE, LANDMARKS.LEFT_ANKLE],
  [LANDMARKS.RIGHT_HIP, LANDMARKS.RIGHT_KNEE],
  [LANDMARKS.RIGHT_KNEE, LANDMARKS.RIGHT_ANKLE],
];

/**
 * Calculate angle between three landmarks (in degrees)
 */
export function calculateAngle(a: PoseLandmark, b: PoseLandmark, c: PoseLandmark): number {
  const radians =
    Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180) / Math.PI);
  if (angle > 180) angle = 360 - angle;
  return angle;
}

/**
 * Assess posture quality from key angles
 */
export function assessPosture(landmarks: PoseLandmark[]): {
  score: number;
  feedback: string;
} {
  if (landmarks.length < 33) return { score: 0, feedback: "No pose detected" };

  const shoulderAngle = calculateAngle(
    landmarks[LANDMARKS.LEFT_ELBOW],
    landmarks[LANDMARKS.LEFT_SHOULDER],
    landmarks[LANDMARKS.LEFT_HIP]
  );

  const kneeAngle = calculateAngle(
    landmarks[LANDMARKS.LEFT_HIP],
    landmarks[LANDMARKS.LEFT_KNEE],
    landmarks[LANDMARKS.LEFT_ANKLE]
  );

  let score = 100;
  let feedback = "Perfect form! Keep it up 🎉";

  if (shoulderAngle < 60 || shoulderAngle > 160) {
    score -= 20;
    feedback = "Watch your shoulder alignment";
  }

  if (kneeAngle < 90) {
    score -= 15;
    feedback = "Don't over-bend your knees";
  }

  return { score: Math.max(0, score), feedback };
}

/**
 * Simple rep counter based on angle oscillation
 */
export function createRepCounter(
  thresholdUp: number = 160,
  thresholdDown: number = 90
) {
  let state: "up" | "down" = "up";
  let count = 0;

  return {
    update(angle: number): number {
      if (state === "up" && angle < thresholdDown) {
        state = "down";
      } else if (state === "down" && angle > thresholdUp) {
        state = "up";
        count++;
      }
      return count;
    },
    getCount: () => count,
    reset: () => {
      count = 0;
      state = "up";
    },
  };
}

/**
 * Draw skeleton overlay on a canvas
 */
export function drawSkeleton(
  ctx: CanvasRenderingContext2D,
  landmarks: PoseLandmark[],
  width: number,
  height: number
) {
  ctx.clearRect(0, 0, width, height);

  // Draw connections
  ctx.strokeStyle = "hsl(225, 63%, 47%)";
  ctx.lineWidth = 3;
  for (const [start, end] of SKELETON_CONNECTIONS) {
    const a = landmarks[start];
    const b = landmarks[end];
    if (a && b && a.visibility > 0.5 && b.visibility > 0.5) {
      ctx.beginPath();
      ctx.moveTo(a.x * width, a.y * height);
      ctx.lineTo(b.x * width, b.y * height);
      ctx.stroke();
    }
  }

  // Draw joints
  ctx.fillStyle = "hsl(328, 78%, 56%)";
  for (const landmark of landmarks) {
    if (landmark.visibility > 0.5) {
      ctx.beginPath();
      ctx.arc(landmark.x * width, landmark.y * height, 5, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
}
