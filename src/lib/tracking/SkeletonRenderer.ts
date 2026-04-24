// Canvas drawing functions — no React, no state.
// Two-tier skeleton: ghost body (Layer A) + active joint highlight (Layer B).

import { ALL_CONNECTIONS, JOINT_BONE_SEGMENTS, MIRROR } from './LandmarkMap';
import type { MovementDirection } from './AngleEngine';

const VISIBILITY_THRESHOLD = 0.5;

// Brand colours
const PINK_PRIMARY = '#E5197D';
const PINK_DIM     = 'rgba(229, 25, 125, 0.45)';
const GHOST_COLOR  = 'rgba(180, 180, 200, 0.35)';

export interface Lm { x: number; y: number; visibility?: number }

// ── Layer A — Ghost skeleton ──────────────────────────────────────────────────

export function drawGhostSkeleton(
  ctx: CanvasRenderingContext2D,
  lms: Lm[],
  W: number,
  H: number,
): void {
  ctx.save();
  ctx.strokeStyle = GHOST_COLOR;
  ctx.lineWidth   = 1.5;
  ctx.lineCap     = 'round';

  for (const [ai, bi] of ALL_CONNECTIONS) {
    const a = lms[ai], b = lms[bi];
    if (!a || !b) continue;
    if ((a.visibility ?? 0) < VISIBILITY_THRESHOLD) continue;
    if ((b.visibility ?? 0) < VISIBILITY_THRESHOLD) continue;
    ctx.beginPath();
    ctx.moveTo(a.x * W, a.y * H);
    ctx.lineTo(b.x * W, b.y * H);
    ctx.stroke();
  }

  ctx.fillStyle = GHOST_COLOR;
  for (const lm of lms) {
    if (!lm || (lm.visibility ?? 0) < VISIBILITY_THRESHOLD) continue;
    ctx.beginPath();
    ctx.arc(lm.x * W, lm.y * H, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// ── Layer B — Active joint highlight ─────────────────────────────────────────

export function drawActiveJoint(
  ctx: CanvasRenderingContext2D,
  lms: Lm[],
  triplet: [number, number, number],
  direction: MovementDirection,
  W: number,
  H: number,
  isMobile = false,
): void {
  const [ai, bi, ci] = triplet;
  const a = lms[ai], b = lms[bi], c = lms[ci];
  if (!a || !b || !c) return;
  if (
    (a.visibility ?? 0) < VISIBILITY_THRESHOLD ||
    (b.visibility ?? 0) < VISIBILITY_THRESHOLD ||
    (c.visibility ?? 0) < VISIBILITY_THRESHOLD
  ) return;

  const color     = direction === 'primary' ? PINK_PRIMARY : PINK_DIM;
  const lineWidth = isMobile ? 4 * (window.devicePixelRatio ?? 1) : 4;

  const ax = a.x * W, ay = a.y * H;
  const bx = b.x * W, by = b.y * H;
  const cx = c.x * W, cy = c.y * H;

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth   = lineWidth;
  ctx.lineCap     = 'round';

  // Bone segments
  ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(cx, cy); ctx.stroke();

  // Angle arc at vertex
  const arcR  = Math.min(W, H) * 0.04;
  const ang1  = Math.atan2(ay - by, ax - bx);
  const ang2  = Math.atan2(cy - by, cx - bx);
  const diff  = ((ang2 - ang1) + 2 * Math.PI) % (2 * Math.PI);
  const [s, e, ccw] = diff <= Math.PI ? [ang1, ang2, false] : [ang2, ang1, false];
  ctx.beginPath();
  ctx.arc(bx, by, arcR, s, e, ccw);
  ctx.lineWidth   = 2;
  ctx.globalAlpha = 0.6;
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Endpoint dots
  for (const pt of [{ x: ax, y: ay }, { x: cx, y: cy }]) {
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

  // Vertex joint — larger, with white halo
  const vertR = 8;
  ctx.beginPath(); ctx.arc(bx, by, vertR + 3, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.fill();
  ctx.beginPath(); ctx.arc(bx, by, vertR, 0, Math.PI * 2);
  ctx.fillStyle = color; ctx.fill();
  ctx.beginPath(); ctx.arc(bx, by, vertR, 0, Math.PI * 2);
  ctx.strokeStyle = 'white'; ctx.lineWidth = 2; ctx.stroke();

  ctx.restore();
}

// ── Angle label on canvas ─────────────────────────────────────────────────────

export function drawAngleLabel(
  ctx: CanvasRenderingContext2D,
  vertexLm: Lm,
  label: string,
  angle: number,
  W: number,
  H: number,
  isMobile = false,
  small = false,  // true when showing opposite-direction label
): void {
  const fontSize = small ? (isMobile ? 10 : 12) : (isMobile ? 12 : 14);
  const text     = `${label}  ${Math.round(angle)}°`;
  const bx       = vertexLm.x * W;
  const by       = vertexLm.y * H;

  ctx.save();
  ctx.font         = `bold ${fontSize}px system-ui, sans-serif`;
  ctx.textBaseline = 'middle';

  const metrics = ctx.measureText(text);
  const pad     = 5;
  const rw      = metrics.width + pad * 2;
  const rh      = fontSize + pad * 2;

  // Position above/beside the joint — clamp to canvas bounds
  let rx = bx + 16;
  let ry = by - rh - 8;
  if (rx + rw > W - 4) rx = bx - rw - 16;
  if (ry < 4) ry = by + 16;

  // Dark pill background
  ctx.fillStyle = 'rgba(0,0,0,0.65)';
  ctx.beginPath();
  ctx.roundRect(rx, ry, rw, rh, 4);
  ctx.fill();

  ctx.fillStyle = 'white';
  ctx.fillText(text, rx + pad, ry + rh / 2);
  ctx.restore();
}

// ── Floating labels for composite exercises ───────────────────────────────────

export interface FloatingLabel {
  landmarkIndex: number;
  label: string;
  angle: number;
}

export function drawFloatingLabels(
  ctx: CanvasRenderingContext2D,
  lms: Lm[],
  labels: FloatingLabel[],
  W: number,
  H: number,
): void {
  ctx.save();
  ctx.font         = 'bold 10px system-ui, sans-serif';
  ctx.textBaseline = 'middle';

  for (const { landmarkIndex, label, angle } of labels) {
    const lm = lms[landmarkIndex];
    if (!lm || (lm.visibility ?? 0) < VISIBILITY_THRESHOLD) continue;

    const text    = `${label} ${Math.round(angle)}°`;
    const metrics = ctx.measureText(text);
    const pad     = 3;
    const rw      = metrics.width + pad * 2;
    const rh      = 10 + pad * 2;
    const rx      = lm.x * W + 12;
    const ry      = lm.y * H - rh / 2;

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath();
    ctx.roundRect(rx, ry, rw, rh, 3);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.fillText(text, rx + pad, ry + rh / 2);
  }

  ctx.restore();
}

// ── Pause overlays ────────────────────────────────────────────────────────────

export function drawLowConfidenceOverlay(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
): void {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(0, 0, W, H);

  ctx.font         = 'bold 16px system-ui, sans-serif';
  ctx.fillStyle    = 'white';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Move into frame', W / 2, H / 2 - 12);

  ctx.font      = '13px system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText('Keep your full body visible', W / 2, H / 2 + 14);
  ctx.restore();
}

export function drawNoPoseOverlay(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
): void {
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.60)';
  ctx.fillRect(0, 0, W, H);

  ctx.font         = 'bold 16px system-ui, sans-serif';
  ctx.fillStyle    = '#F59E0B';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('No pose detected', W / 2, H / 2 - 12);

  ctx.font      = '13px system-ui, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText('Step back so your full body is visible', W / 2, H / 2 + 14);
  ctx.restore();
}
