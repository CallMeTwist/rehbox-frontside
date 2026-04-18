// MediaPipe Pose helpers — goniometry-based ROM tracking for ReHboX

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

// ── Standardised clinical ROM ranges (degrees) ────────────────────────
// Source: established goniometric norms used in physiotherapy assessment.
// These are the reference values shown in the session overlay and PT reports.
export const ROM_STANDARDS: Record<string, { min: number; max: number; label: string; joint_group: string }> = {
  // Neck
  neck_flexion:        { min: 0, max: 45,  label: 'Neck Flexion',        joint_group: 'neck' },
  neck_extension:      { min: 0, max: 45,  label: 'Neck Extension',      joint_group: 'neck' },
  neck_lateral:        { min: 0, max: 45,  label: 'Neck Lateral Tilt',   joint_group: 'neck' },
  neck_rotation:       { min: 0, max: 60,  label: 'Neck Rotation',       joint_group: 'neck' },
  // Shoulder
  shoulder_flexion:    { min: 0, max: 180, label: 'Shoulder Flexion',    joint_group: 'shoulder' },
  shoulder_extension:  { min: 0, max: 60,  label: 'Shoulder Extension',  joint_group: 'shoulder' },
  shoulder_abduction:  { min: 0, max: 180, label: 'Shoulder Abduction',  joint_group: 'shoulder' },
  shoulder_adduction:  { min: 0, max: 30,  label: 'Shoulder Adduction',  joint_group: 'shoulder' },
  shoulder_ir:         { min: 0, max: 70,  label: 'Internal Rotation',   joint_group: 'shoulder' },
  shoulder_er:         { min: 0, max: 90,  label: 'External Rotation',   joint_group: 'shoulder' },
  // Wrist
  wrist_flexion:       { min: 0, max: 80,  label: 'Wrist Flexion',       joint_group: 'wrist' },
  wrist_extension:     { min: 0, max: 70,  label: 'Wrist Extension',     joint_group: 'wrist' },
  // Elbow
  elbow_flexion:       { min: 0, max: 160, label: 'Elbow Flexion',       joint_group: 'elbow' },
  elbow_extension:     { min: 0, max: 10,  label: 'Elbow Extension',     joint_group: 'elbow' },
  elbow_hyperextension:{ min: 0, max: 15,  label: 'Elbow Hyperextension',joint_group: 'elbow' },
  // Hip
  hip_flexion:         { min: 0, max: 125, label: 'Hip Flexion',         joint_group: 'hip' },
  hip_extension:       { min: 0, max: 15,  label: 'Hip Extension',       joint_group: 'hip' },
  hip_abduction:       { min: 0, max: 45,  label: 'Hip Abduction',       joint_group: 'hip' },
  hip_adduction:       { min: 0, max: 30,  label: 'Hip Adduction',       joint_group: 'hip' },
  hip_ir:              { min: 0, max: 45,  label: 'Hip Internal Rotation', joint_group: 'hip' },
  hip_er:              { min: 0, max: 45,  label: 'Hip External Rotation', joint_group: 'hip' },
  // Knee
  knee_flexion:        { min: 0, max: 140, label: 'Knee Flexion',        joint_group: 'knee' },
  knee_extension:      { min: 0, max: 140, label: 'Knee Extension',      joint_group: 'knee' },
  // Ankle
  ankle_dorsiflexion:  { min: 0, max: 20,  label: 'Ankle Dorsiflexion',  joint_group: 'ankle' },
  ankle_plantarflexion:{ min: 0, max: 50,  label: 'Ankle Plantarflexion', joint_group: 'ankle' },
  // Spine
  spine_flexion:       { min: 0, max: 80,  label: 'Spine Flexion',       joint_group: 'spine' },
  spine_extension:     { min: 0, max: 25,  label: 'Spine Extension',     joint_group: 'spine' },
  spine_rotation:      { min: 0, max: 45,  label: 'Spine Rotation',      joint_group: 'spine' },
};

// ── MediaPipe landmark indices ─────────────────────────────────────────
export const LANDMARKS = {
  NOSE:            0,
  LEFT_EYE_INNER: 1,
  LEFT_EYE:       2,
  LEFT_EYE_OUTER: 3,
  RIGHT_EYE_INNER:4,
  RIGHT_EYE:      5,
  RIGHT_EYE_OUTER:6,
  LEFT_EAR:       7,
  RIGHT_EAR:      8,
  LEFT_SHOULDER:  11,
  RIGHT_SHOULDER: 12,
  LEFT_ELBOW:     13,
  RIGHT_ELBOW:    14,
  LEFT_WRIST:     15,
  RIGHT_WRIST:    16,
  LEFT_HIP:       23,
  RIGHT_HIP:      24,
  LEFT_KNEE:      25,
  RIGHT_KNEE:     26,
  LEFT_ANKLE:     27,
  RIGHT_ANKLE:    28,
  LEFT_HEEL:      29,
  RIGHT_HEEL:     30,
  LEFT_FOOT_INDEX:31,
  RIGHT_FOOT_INDEX:32,
} as const;

// ── Bilateral mirror map ───────────────────────────────────────────────
// Maps each LEFT landmark index to its RIGHT counterpart and vice versa.
// Used to compute the same angle for the opposite side without duplicating rules.
export const LANDMARK_MIRROR: Record<number, number> = {
  7:8,   8:7,    // ears
  11:12, 12:11,  // shoulders
  13:14, 14:13,  // elbows
  15:16, 16:15,  // wrists
  17:18, 18:17,  // pinky finger
  19:20, 20:19,  // index finger
  21:22, 22:21,  // thumb
  23:24, 24:23,  // hips
  25:26, 26:25,  // knees
  27:28, 28:27,  // ankles
  29:30, 30:29,  // heels
  31:32, 32:31,  // foot index
};

// Returns the mirrored landmark triplet for the opposite body side.
export function mirrorLandmarks(
  triplet: [number, number, number],
): [number, number, number] {
  return [
    LANDMARK_MIRROR[triplet[0]] ?? triplet[0],
    LANDMARK_MIRROR[triplet[1]] ?? triplet[1],
    LANDMARK_MIRROR[triplet[2]] ?? triplet[2],
  ];
}

// Skeleton connections for drawing overlay
export const SKELETON_CONNECTIONS: [number, number][] = [
  [LANDMARKS.LEFT_SHOULDER,  LANDMARKS.RIGHT_SHOULDER],
  [LANDMARKS.LEFT_SHOULDER,  LANDMARKS.LEFT_ELBOW],
  [LANDMARKS.LEFT_ELBOW,     LANDMARKS.LEFT_WRIST],
  [LANDMARKS.RIGHT_SHOULDER, LANDMARKS.RIGHT_ELBOW],
  [LANDMARKS.RIGHT_ELBOW,    LANDMARKS.RIGHT_WRIST],
  [LANDMARKS.LEFT_SHOULDER,  LANDMARKS.LEFT_HIP],
  [LANDMARKS.RIGHT_SHOULDER, LANDMARKS.RIGHT_HIP],
  [LANDMARKS.LEFT_HIP,       LANDMARKS.RIGHT_HIP],
  [LANDMARKS.LEFT_HIP,       LANDMARKS.LEFT_KNEE],
  [LANDMARKS.LEFT_KNEE,      LANDMARKS.LEFT_ANKLE],
  [LANDMARKS.RIGHT_HIP,      LANDMARKS.RIGHT_KNEE],
  [LANDMARKS.RIGHT_KNEE,     LANDMARKS.RIGHT_ANKLE],
];

// ── Major joint groups used for wrong-exercise detection ──────────────
// For each group, store representative landmark triplets (left + right).
export const JOINT_GROUPS: Record<string, {
  name: string;
  triplets: [number, number, number][];
}> = {
  neck:     { name: 'neck',     triplets: [[7, 11, 23], [8, 12, 24]] },       // ear-shoulder-hip
  shoulder: { name: 'shoulder', triplets: [[23, 11, 13], [24, 12, 14]] },     // hip-shoulder-elbow
  elbow:    { name: 'elbow',    triplets: [[11, 13, 15], [12, 14, 16]] },     // shoulder-elbow-wrist
  hip:      { name: 'hip',      triplets: [[11, 23, 25], [12, 24, 26]] },     // shoulder-hip-knee
  knee:     { name: 'knee',     triplets: [[23, 25, 27], [24, 26, 28]] },     // hip-knee-ankle
};

/**
 * Goniometric angle at joint B formed by A→B and C→B vectors.
 * Uses the dot-product formula — stable for any 2-D orientation.
 */
export function calculateAngle(
  a: PoseLandmark,
  b: PoseLandmark,
  c: PoseLandmark,
): number {
  const bax = a.x - b.x;
  const bay = a.y - b.y;
  const bcx = c.x - b.x;
  const bcy = c.y - b.y;
  const dot    = bax * bcx + bay * bcy;
  const magBA  = Math.sqrt(bax * bax + bay * bay);
  const magBC  = Math.sqrt(bcx * bcx + bcy * bcy);
  const cosine = dot / (magBA * magBC + 1e-6);
  return (Math.acos(Math.max(-1, Math.min(1, cosine))) * 180) / Math.PI;
}

/**
 * Compute the angle for a rule, accounting for side (left / right / bilateral).
 *
 * - 'left'/'right' → only track that triplet.
 * - 'bilateral'    → calculate for both sides and return the one with better
 *                    average visibility, or the average if both are equally visible.
 *
 * Returns null when the required landmarks are not visible.
 */
export function computeAngleForRule(
  landmarks: PoseLandmark[],
  triplet: [number, number, number],
  side: 'left' | 'right' | 'bilateral' = 'bilateral',
): number | null {
  const threshold = VISIBILITY_THRESHOLD;

  function tryTriplet(t: [number, number, number]): number | null {
    const a = landmarks[t[0]];
    const b = landmarks[t[1]];
    const c = landmarks[t[2]];
    if (
      !a || !b || !c ||
      (a.visibility ?? 0) < threshold ||
      (b.visibility ?? 0) < threshold ||
      (c.visibility ?? 0) < threshold
    ) {
      return null;
    }
    return calculateAngle(a, b, c);
  }

  const leftAngle  = tryTriplet(triplet);
  if (side === 'left')  return leftAngle;

  const rightTriplet = mirrorLandmarks(triplet);
  const rightAngle   = tryTriplet(rightTriplet);
  if (side === 'right') return rightAngle;

  // Bilateral: prefer the side with better visibility; average when both available
  if (leftAngle === null && rightAngle === null) return null;
  if (leftAngle === null) return rightAngle;
  if (rightAngle === null) return leftAngle;
  return (leftAngle + rightAngle) / 2;
}

// ── Rep tracking ──────────────────────────────────────────────────────

export const FORM_GRACE_DEGREES  = 15;
export const VISIBILITY_THRESHOLD = 0.6;

export interface JointRule {
  joint: string;
  /**
   * MediaPipe landmark triplet [proximal, vertex, distal].
   * Always store the LEFT-side indices — `side` determines how it is used.
   * May arrive as PHP object {"0":23,"1":25,"2":27} — normalised in code.
   */
  landmarks: [number, number, number] | Record<number, number>;
  min: number;
  max: number;
  feedback_low: string;   // shown when angle > max
  feedback_high: string;  // shown when angle < min
  weight?: number;
  /**
   * Which body side to track.
   * 'bilateral' → track both sides, report average.
   * 'left' / 'right' → track only that side (post-surgical prescription).
   */
  side?: 'left' | 'right' | 'bilateral';
  /**
   * Key into ROM_STANDARDS — drives the clinical reference display.
   * e.g. 'knee_flexion', 'shoulder_abduction'
   */
  movement?: string;
  /** Mark exactly one joint per exercise as the rep-counting driver. */
  rep_joint?: boolean;
  /** Angle that signals the top of movement (e.g. 150° = arm overhead). */
  up_threshold?: number;
  /** Angle that signals the bottom of movement (e.g. 30° = arm at side). */
  down_threshold?: number;
}

export interface RepROM {
  min: number;
  max: number;
}

/**
 * Tracks completed reps and records per-rep min/max angle (achieved ROM).
 * This is the digital equivalent of a goniometer measurement per repetition.
 */
export class RepTracker {
  private state: 'up' | 'down' = 'down';
  private repAngles: number[]   = [];
  completedReps: RepROM[]       = [];

  constructor(
    private readonly upThreshold:   number,
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

  /** Average achieved ROM (max angle) across all completed reps. */
  avgAchievedROM(): number | null {
    if (this.completedReps.length === 0) return null;
    return this.completedReps.reduce((s, r) => s + r.max, 0) / this.completedReps.length;
  }

  /** Best (maximum) angle achieved across all reps — closest to full normal ROM. */
  bestROM(): number | null {
    if (this.completedReps.length === 0) return null;
    return Math.max(...this.completedReps.map((r) => r.max));
  }

  reset(): void {
    this.completedReps = [];
    this.repAngles     = [];
    this.state         = 'down';
  }
}

// ── Wrong-exercise detection ───────────────────────────────────────────

/**
 * Detect whether the patient is exercising a joint other than the one
 * prescribed in the exercise plan.
 *
 * Algorithm:
 *  1. Compute the angle variation (range) of the *target* joint over the window.
 *  2. Compute variation for every other major joint group.
 *  3. If target variation < WRONG_EX_TARGET_THRESHOLD and any other joint
 *     varies > WRONG_EX_OTHER_THRESHOLD, return a warning message.
 *
 * @param angleHistory  Record<joint_group_name, angle[]> — last N frames per group
 * @param targetGroup   Joint group the exercise is supposed to target ('knee', 'shoulder', …)
 * @returns Warning string, or null if no problem detected.
 */
export const WRONG_EX_TARGET_THRESHOLD = 12;  // target joint variation (°) to count as "moving"
export const WRONG_EX_OTHER_THRESHOLD  = 20;  // other joint variation (°) to flag as "active"

export function detectWrongExercise(
  angleHistory: Record<string, number[]>,
  targetGroup:  string,
): string | null {
  const targetAngles = angleHistory[targetGroup] ?? [];
  if (targetAngles.length < 10) return null; // not enough data yet

  const variation = (arr: number[]) =>
    arr.length < 2 ? 0 : Math.max(...arr) - Math.min(...arr);

  const targetVariation = variation(targetAngles);
  if (targetVariation >= WRONG_EX_TARGET_THRESHOLD) return null; // target IS moving

  const std = ROM_STANDARDS;
  const groupLabels: Record<string, string> = {
    neck:     'your neck',
    shoulder: 'your shoulder',
    elbow:    'your elbow',
    hip:      'your hip',
    knee:     'your knee',
  };

  for (const [group, history] of Object.entries(angleHistory)) {
    if (group === targetGroup) continue;
    if (variation(history) > WRONG_EX_OTHER_THRESHOLD) {
      return `This exercise targets ${groupLabels[targetGroup] ?? targetGroup}. Focus there — we can see ${groupLabels[group] ?? group} moving instead.`;
    }
  }
  return null;
}

// ── Form analysis ──────────────────────────────────────────────────────

export interface FormAnalysisResult {
  score:       number;
  feedback:    string;
  jointScores: Record<string, number>;
}

/**
 * Analyse pose landmarks against per-exercise joint angle rules (goniometry).
 * Returns a weighted form score (0–100) and the most critical feedback message.
 * Handles bilateral tracking and PHP-encoded landmark objects automatically.
 */
export function analyzeForm(
  landmarks: PoseLandmark[],
  rules:     JointRule[],
): FormAnalysisResult {
  if (!landmarks.length || !rules.length) {
    return { score: 0, feedback: '', jointScores: {} };
  }

  const jointScores: Record<string, number>                    = {};
  const feedbackCandidates: { deficit: number; message: string }[] = [];
  let totalWeight = 0;
  let weightedSum = 0;

  for (const rule of rules) {
    // Normalise PHP Repeater object {"0":23,"1":25,"2":27} → [23,25,27]
    const triplet: [number, number, number] = Array.isArray(rule.landmarks)
      ? rule.landmarks as [number, number, number]
      : [rule.landmarks[0], rule.landmarks[1], rule.landmarks[2]];

    const side  = rule.side ?? 'bilateral';
    const angle = computeAngleForRule(landmarks, triplet, side);
    if (angle === null) continue; // landmarks invisible — don't penalise

    const weight = rule.weight ?? 1.0;
    let jointScore: number;
    let deficit    = 0;
    let feedbackMsg: string | null = null;

    if (angle < rule.min) {
      deficit      = rule.min - angle;
      jointScore   = Math.max(0, 100 - (deficit / FORM_GRACE_DEGREES) * 100);
      feedbackMsg  = rule.feedback_high;
    } else if (angle > rule.max) {
      deficit      = angle - rule.max;
      jointScore   = Math.max(0, 100 - (deficit / FORM_GRACE_DEGREES) * 100);
      feedbackMsg  = rule.feedback_low;
    } else {
      jointScore = 100;
    }

    jointScores[rule.joint] = Math.round(jointScore);
    totalWeight             += weight;
    weightedSum             += jointScore * weight;
    if (feedbackMsg) feedbackCandidates.push({ deficit, message: feedbackMsg });
  }

  // All joints invisible — fall back to visibility-based score
  if (totalWeight === 0) {
    const visibleCount = landmarks.filter((l) => (l.visibility ?? 0) > 0.7).length;
    return {
      score:    Math.round((visibleCount / 33) * 100),
      feedback: 'Move closer to the camera',
      jointScores: {},
    };
  }

  feedbackCandidates.sort((a, b) => b.deficit - a.deficit);

  return {
    score:    Math.round(weightedSum / totalWeight),
    feedback: feedbackCandidates[0]?.message ?? 'Good form — keep it up! 💪',
    jointScores,
  };
}

/**
 * Draw skeleton overlay on a canvas.
 * Optionally colour landmarks red/amber/green based on ROM status.
 */
export function drawSkeleton(
  ctx:       CanvasRenderingContext2D,
  landmarks: PoseLandmark[],
  width:     number,
  height:    number,
  jointStatus?: Record<number, 'normal' | 'warning' | 'error'>,
) {
  ctx.clearRect(0, 0, width, height);

  // Connections
  ctx.strokeStyle = '#1B3E8F';
  ctx.lineWidth   = 3;
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

  // Joints — colour by ROM status when provided
  for (let i = 0; i < landmarks.length; i++) {
    const lm = landmarks[i];
    if (!lm || lm.visibility <= 0.5) continue;
    const status = jointStatus?.[i];
    ctx.fillStyle =
      status === 'error'   ? '#EF4444' :
      status === 'warning' ? '#F59E0B' :
      status === 'normal'  ? '#22C55E' :
      '#E5197D';
    ctx.beginPath();
    ctx.arc(lm.x * width, lm.y * height, 5, 0, 2 * Math.PI);
    ctx.fill();
  }
}

// Simple legacy posture check (kept for compatibility)
export function assessPosture(landmarks: PoseLandmark[]): {
  score: number;
  feedback: string;
} {
  if (landmarks.length < 33) return { score: 0, feedback: 'No pose detected' };

  const shoulderAngle = calculateAngle(
    landmarks[LANDMARKS.LEFT_ELBOW],
    landmarks[LANDMARKS.LEFT_SHOULDER],
    landmarks[LANDMARKS.LEFT_HIP],
  );
  const kneeAngle = calculateAngle(
    landmarks[LANDMARKS.LEFT_HIP],
    landmarks[LANDMARKS.LEFT_KNEE],
    landmarks[LANDMARKS.LEFT_ANKLE],
  );

  let score    = 100;
  let feedback = 'Perfect form! Keep it up 🎉';

  if (shoulderAngle < 60 || shoulderAngle > 160) {
    score   -= 20;
    feedback = 'Watch your shoulder alignment';
  }
  if (kneeAngle < 90) {
    score   -= 15;
    feedback = "Don't over-bend your knees";
  }

  return { score: Math.max(0, score), feedback };
}

// Legacy rep counter factory (kept for compatibility)
export function createRepCounter(thresholdUp = 160, thresholdDown = 90) {
  let state: 'up' | 'down' = 'up';
  let count = 0;

  return {
    update(angle: number): number {
      if (state === 'up' && angle < thresholdDown)   state = 'down';
      else if (state === 'down' && angle > thresholdUp) { state = 'up'; count++; }
      return count;
    },
    getCount: () => count,
    reset:    () => { count = 0; state = 'up'; },
  };
}
