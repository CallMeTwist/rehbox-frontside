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
  LEFT_HEEL: 29,
  RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31,
  RIGHT_FOOT_INDEX: 32,
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
 * Calculate angle in degrees at joint B, formed by segments B→A and B→C.
 * Uses the dot-product formula — stable for any orientation and 3-D coords.
 */
export function calculateAngle(a: PoseLandmark, b: PoseLandmark, c: PoseLandmark): number {
  const bax = a.x - b.x;
  const bay = a.y - b.y;
  const bcx = c.x - b.x;
  const bcy = c.y - b.y;
  const dot = bax * bcx + bay * bcy;
  const magBA = Math.sqrt(bax * bax + bay * bay);
  const magBC = Math.sqrt(bcx * bcx + bcy * bcy);
  const cosine = dot / (magBA * magBC + 1e-6);
  return (Math.acos(Math.max(-1, Math.min(1, cosine))) * 180) / Math.PI;
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

// ── Exercise-specific form analysis ──────────────────────────────────

export const FORM_GRACE_DEGREES = 15;
export const VISIBILITY_THRESHOLD = 0.6;

export interface JointRule {
  joint: string;
  /** [proximal, vertex, distal] MediaPipe indices — may arrive as array or PHP object */
  landmarks: [number, number, number] | Record<number, number>;
  min: number;
  max: number;
  feedback_low: string;    // shown when angle > max (joint too open)
  feedback_high: string;   // shown when angle < min (joint too closed)
  weight?: number;
  /** Mark true on exactly one joint per exercise to drive the rep counter */
  rep_joint?: boolean;
  /** Angle that signals top of movement (e.g. 150° for shoulder flexion overhead) */
  up_threshold?: number;
  /** Angle that signals bottom of movement (e.g. 30° for shoulder at side) */
  down_threshold?: number;
}

// ── Rep tracking ──────────────────────────────────────────────────────

export interface RepROM {
  min: number;
  max: number;
}

/**
 * Tracks completed reps and records the min/max angle (ROM) for each rep.
 * Call update() on every frame; read repCount and lastROM() at any time.
 */
export class RepTracker {
  private state: 'up' | 'down' = 'down';
  private repAngles: number[] = [];
  completedReps: RepROM[] = [];

  constructor(
    private readonly upThreshold: number,
    private readonly downThreshold: number,
  ) {}

  update(angle: number): void {
    this.repAngles.push(angle);
    if (this.state === 'down' && angle > this.upThreshold) {
      this.state = 'up';
    } else if (this.state === 'up' && angle < this.downThreshold) {
      this.completedReps.push({
        min: Math.min(...this.repAngles),
        max: Math.max(...this.repAngles),
      });
      this.repAngles = [];
      this.state = 'down';
    }
  }

  get repCount(): number {
    return this.completedReps.length;
  }

  lastROM(): RepROM | null {
    return this.completedReps.at(-1) ?? null;
  }

  reset(): void {
    this.completedReps = [];
    this.repAngles = [];
    this.state = 'down';
  }
}

export interface FormAnalysisResult {
  score: number;
  feedback: string;
  jointScores: Record<string, number>;
}

/**
 * Analyse pose landmarks against exercise-specific joint angle rules.
 * Returns a weighted form score (0-100) and the most critical feedback message.
 */
export function analyzeForm(
  landmarks: PoseLandmark[],
  rules: JointRule[],
): FormAnalysisResult {
  if (!landmarks.length || !rules.length) {
    return { score: 0, feedback: '', jointScores: {} };
  }

  const jointScores: Record<string, number> = {};
  const feedbackCandidates: { deficit: number; message: string }[] = [];
  let totalWeight = 0;
  let weightedSum = 0;

  for (const rule of rules) {
    // Normalize: PHP Repeater may send {"0":23,"1":25,"2":27} instead of [23,25,27]
    const [ai, bi, ci] = Array.isArray(rule.landmarks)
      ? rule.landmarks
      : [rule.landmarks[0], rule.landmarks[1], rule.landmarks[2]];

    const a = landmarks[ai];
    const b = landmarks[bi];
    const c = landmarks[ci];

    if (
      !a || !b || !c ||
      (a.visibility ?? 0) < VISIBILITY_THRESHOLD ||
      (b.visibility ?? 0) < VISIBILITY_THRESHOLD ||
      (c.visibility ?? 0) < VISIBILITY_THRESHOLD
    ) {
      continue; // skip invisible joints — don't penalise
    }

    const angle = calculateAngle(a, b, c);
    const weight = rule.weight ?? 1.0;
    let jointScore: number;
    let deficit = 0;
    let feedbackMsg: string | null = null;

    if (angle < rule.min) {
      deficit = rule.min - angle;
      jointScore = Math.max(0, 100 - (deficit / FORM_GRACE_DEGREES) * 100);
      feedbackMsg = rule.feedback_high;
    } else if (angle > rule.max) {
      deficit = angle - rule.max;
      jointScore = Math.max(0, 100 - (deficit / FORM_GRACE_DEGREES) * 100);
      feedbackMsg = rule.feedback_low;
    } else {
      jointScore = 100;
    }

    jointScores[rule.joint] = Math.round(jointScore);
    totalWeight += weight;
    weightedSum += jointScore * weight;
    if (feedbackMsg) feedbackCandidates.push({ deficit, message: feedbackMsg });
  }

  // All joints invisible — fall back to visibility-based score
  if (totalWeight === 0) {
    const visibleCount = landmarks.filter((l) => (l.visibility ?? 0) > 0.7).length;
    return {
      score: Math.round((visibleCount / 33) * 100),
      feedback: 'Move closer to the camera',
      jointScores: {},
    };
  }

  // Surface the feedback for the most out-of-range joint
  feedbackCandidates.sort((a, b) => b.deficit - a.deficit);

  return {
    score: Math.round(weightedSum / totalWeight),
    feedback: feedbackCandidates[0]?.message ?? 'Good form — keep it up! 💪',
    jointScores,
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
  ctx.strokeStyle = "#1B3E8F";
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
  ctx.fillStyle = "#E5197D";
  for (const landmark of landmarks) {
    if (landmark.visibility > 0.5) {
      ctx.beginPath();
      ctx.arc(landmark.x * width, landmark.y * height, 5, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
}
