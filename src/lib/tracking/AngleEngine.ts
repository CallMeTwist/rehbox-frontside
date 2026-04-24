// Pure angle-calculation functions — no React, no side effects.
import { LANDMARK_MAP, MIRROR, MOVEMENT_PRIMARY_DIR, mirrorTriplet } from './LandmarkMap';

export const VISIBILITY_THRESHOLD = 0.5;

export interface Landmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export type MovementDirection = 'primary' | 'opposite' | 'neutral';

// ── Core geometry ─────────────────────────────────────────────────────────────

/** Interior angle (degrees) at vertex B formed by vectors B→A and B→C. */
export function calculateAngle(a: Landmark, b: Landmark, c: Landmark): number {
  const bax = a.x - b.x, bay = a.y - b.y;
  const bcx = c.x - b.x, bcy = c.y - b.y;
  const dot = bax * bcx + bay * bcy;
  const mag = Math.sqrt(bax ** 2 + bay ** 2) * Math.sqrt(bcx ** 2 + bcy ** 2);
  return (Math.acos(Math.max(-1, Math.min(1, dot / (mag + 1e-6)))) * 180) / Math.PI;
}

/** Compute angle for a triplet, null when any landmark is below visibility threshold. */
export function computeAngle(
  landmarks: Landmark[],
  triplet: [number, number, number],
): number | null {
  const [ai, bi, ci] = triplet;
  const a = landmarks[ai], b = landmarks[bi], c = landmarks[ci];
  if (!a || !b || !c) return null;
  if ((a.visibility ?? 1) < VISIBILITY_THRESHOLD) return null;
  if ((b.visibility ?? 1) < VISIBILITY_THRESHOLD) return null;
  if ((c.visibility ?? 1) < VISIBILITY_THRESHOLD) return null;
  return calculateAngle(a, b, c);
}

// ── Triplet resolution ────────────────────────────────────────────────────────

/**
 * Get the [proximal, vertex, distal] landmark triplet for a movement + side.
 * Falls back to a raw triplet if the movement key isn't in LANDMARK_MAP.
 */
export function resolveTriplet(
  movement: string,
  side: 'left' | 'right',
  fallbackTriplet?: [number, number, number],
): [number, number, number] | null {
  const base = LANDMARK_MAP[movement] ?? fallbackTriplet ?? null;
  if (!base) return null;
  return side === 'right' ? mirrorTriplet(base) : base;
}

/** Compute angle for a named movement on a specific side, with visibility check. */
export function computeMovementAngle(
  landmarks: Landmark[],
  movement: string,
  side: 'left' | 'right',
  fallbackTriplet?: [number, number, number],
): number | null {
  const triplet = resolveTriplet(movement, side, fallbackTriplet);
  if (!triplet) return null;
  return computeAngle(landmarks, triplet);
}

// ── Direction classification ──────────────────────────────────────────────────

/**
 * Classify whether the current angle represents the PRIMARY movement
 * (the therapeutic goal) or its OPPOSITE (returning to rest).
 *
 * Most joints are at ~160–180° at rest. Primary movement DECREASES the angle
 * for flexion/abduction, INCREASES it for extension/adduction.
 *
 * restAngle should be the down_threshold from the exercise config (rest position).
 */
export function classifyDirection(
  movement: string,
  angle: number,
  restAngle: number,
): MovementDirection {
  const dir = MOVEMENT_PRIMARY_DIR[movement];
  if (!dir) return 'neutral';
  if (dir === 'down') return angle < restAngle ? 'primary' : 'opposite';
  return angle > restAngle ? 'primary' : 'opposite';
}

// ── Smoothing ─────────────────────────────────────────────────────────────────

/** Returns a stateful smoother function. Call it each frame with the raw angle. */
export function createSmoother(windowSize = 5): (raw: number) => number {
  const buf: number[] = [];
  return (raw: number) => {
    buf.push(raw);
    if (buf.length > windowSize) buf.shift();
    return buf.reduce((a, b) => a + b, 0) / buf.length;
  };
}

// ── Landmark visibility helpers ───────────────────────────────────────────────

/** Returns the average visibility of a set of landmark indices. */
export function avgVisibility(landmarks: Landmark[], indices: number[]): number {
  const vals = indices.map(i => landmarks[i]?.visibility ?? 0);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

/** True if ALL landmarks in the triplet meet the visibility threshold. */
export function tripletVisible(
  landmarks: Landmark[],
  triplet: [number, number, number],
): boolean {
  return triplet.every(i => (landmarks[i]?.visibility ?? 0) >= VISIBILITY_THRESHOLD);
}
