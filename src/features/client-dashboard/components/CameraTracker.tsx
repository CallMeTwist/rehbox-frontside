// src/features/client-dashboard/components/CameraTracker.tsx
import { useEffect, useRef, useState } from 'react';
import { Pose, Results } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { mirrorLandmarks, SKELETON_CONNECTIONS, type JointRule } from '@/features/shared/utils/motion';

// ── Drawing helpers ───────────────────────────────────────────────────────────

const VISIBILITY_THRESHOLD = 0.5;

/** Normalise a landmarks field that may arrive from PHP as {0:x, 1:y, 2:z} */
function normaliseTriplet(
  raw: [number, number, number] | Record<number, number>,
): [number, number, number] {
  if (Array.isArray(raw)) return raw;
  return [raw[0], raw[1], raw[2]];
}

/** Draw a ghost skeleton — very faint so it doesn't distract */
function drawGhostSkeleton(
  ctx: CanvasRenderingContext2D,
  landmarks: { x: number; y: number; visibility?: number }[],
  W: number,
  H: number,
) {
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 1.5;
  ctx.lineCap = 'round';

  for (const [ai, bi] of SKELETON_CONNECTIONS) {
    const a = landmarks[ai];
    const b = landmarks[bi];
    if (!a || !b) continue;
    if ((a.visibility ?? 0) < VISIBILITY_THRESHOLD) continue;
    if ((b.visibility ?? 0) < VISIBILITY_THRESHOLD) continue;
    ctx.beginPath();
    ctx.moveTo(a.x * W, a.y * H);
    ctx.lineTo(b.x * W, b.y * H);
    ctx.stroke();
  }

  // Small dots at visible joints
  ctx.fillStyle = '#94A3B8';
  for (const lm of landmarks) {
    if (!lm || (lm.visibility ?? 0) < VISIBILITY_THRESHOLD) continue;
    ctx.beginPath();
    ctx.arc(lm.x * W, lm.y * H, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Draw the two bone segments forming the angle, the angle arc at the vertex,
 * and the three landmark dots — sized and coloured to make the joint prominent.
 */
function drawJointRule(
  ctx: CanvasRenderingContext2D,
  landmarks: { x: number; y: number; visibility?: number }[],
  triplet: [number, number, number],
  isRepJoint: boolean,
  W: number,
  H: number,
) {
  const [ai, bi, ci] = triplet;
  const a = landmarks[ai];
  const b = landmarks[bi]; // vertex — the joint being measured
  const c = landmarks[ci];

  if (!a || !b || !c) return;
  if (
    (a.visibility ?? 0) < VISIBILITY_THRESHOLD ||
    (b.visibility ?? 0) < VISIBILITY_THRESHOLD ||
    (c.visibility ?? 0) < VISIBILITY_THRESHOLD
  ) return;

  const ax = a.x * W, ay = a.y * H;
  const bx = b.x * W, by = b.y * H;
  const cx = c.x * W, cy = c.y * H;

  const PRIMARY   = '#E5197D'; // brand pink — rep-counting joint
  const SECONDARY = '#1B3E8F'; // brand blue — secondary joint
  const lineColor = isRepJoint ? PRIMARY : SECONDARY;
  const lineWidth = isRepJoint ? 4 : 3;

  // ── Bone lines ──────────────────────────────────────────────────────────
  ctx.save();
  ctx.strokeStyle = lineColor;
  ctx.lineWidth   = lineWidth;
  ctx.lineCap     = 'round';

  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.lineTo(bx, by);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(bx, by);
  ctx.lineTo(cx, cy);
  ctx.stroke();

  // ── Angle arc at vertex ─────────────────────────────────────────────────
  const arcRadius = Math.min(W, H) * 0.045;
  const angle1    = Math.atan2(ay - by, ax - bx);
  const angle2    = Math.atan2(cy - by, cx - bx);

  // Draw the smaller of the two arcs to represent the interior angle
  const diff = ((angle2 - angle1) + 2 * Math.PI) % (2 * Math.PI);
  const [startAngle, endAngle, ccw] =
    diff <= Math.PI ? [angle1, angle2, false] : [angle2, angle1, false];

  ctx.beginPath();
  ctx.arc(bx, by, arcRadius, startAngle, endAngle, ccw);
  ctx.strokeStyle = lineColor;
  ctx.lineWidth   = 2;
  ctx.globalAlpha = 0.65;
  ctx.stroke();
  ctx.globalAlpha = 1.0;

  // ── Endpoint dots (proximal & distal) ───────────────────────────────────
  for (const pt of [{ x: ax, y: ay }, { x: cx, y: cy }]) {
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
    ctx.fillStyle   = lineColor;
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }

  // ── Vertex joint — larger, always fully opaque ──────────────────────────
  const vertexR = isRepJoint ? 11 : 7;

  // White halo
  ctx.beginPath();
  ctx.arc(bx, by, vertexR + 3, 0, Math.PI * 2);
  ctx.fillStyle   = 'rgba(255,255,255,0.25)';
  ctx.fill();

  // Filled dot
  ctx.beginPath();
  ctx.arc(bx, by, vertexR, 0, Math.PI * 2);
  ctx.fillStyle   = lineColor;
  ctx.fill();

  // White ring
  ctx.beginPath();
  ctx.arc(bx, by, vertexR, 0, Math.PI * 2);
  ctx.strokeStyle = 'white';
  ctx.lineWidth   = 2;
  ctx.stroke();

  ctx.restore();
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  onResults:  (results: Results) => void;
  isActive:   boolean;
  /** correct_angles from the exercise — drives selective joint visualisation */
  jointRules?: JointRule[];
}

export function CameraTracker({ onResults, isActive, jointRules }: Props) {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<Camera | null>(null);
  const poseRef   = useRef<Pose | null>(null);
  // Keep a live reference so the pose.onResults closure always has the latest rules
  const rulesRef  = useRef<JointRule[] | undefined>(jointRules);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Update rulesRef whenever jointRules prop changes (no need to reinitialise pose)
  useEffect(() => {
    rulesRef.current = jointRules;
  }, [jointRules]);

  useEffect(() => {
    if (!isActive) {
      cameraRef.current?.stop();
      return;
    }

    const pose = new Pose({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity:          1,
      smoothLandmarks:          true,
      enableSegmentation:       false,
      minDetectionConfidence:   0.5,
      minTrackingConfidence:    0.5,
    });

    pose.onResults((results: Results) => {
      const canvas = canvasRef.current;
      const ctx    = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const W = canvas.width;
      const H = canvas.height;

      ctx.save();
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(results.image, 0, 0, W, H);

      if (results.poseLandmarks) {
        const lms   = results.poseLandmarks;
        const rules = rulesRef.current;

        if (!rules || rules.length === 0) {
          // No specific joint rules — draw faint ghost skeleton so the user
          // can see pose is being detected (visibility-based exercises).
          drawGhostSkeleton(ctx, lms, W, H);
        } else {
          // Draw only the landmark triplets defined in the rules.
          // Non-rep joints first (blue), rep joint on top (pink).
          const sorted = [...rules].sort((a, b) =>
            (a.rep_joint ? 1 : 0) - (b.rep_joint ? 1 : 0),
          );

          for (const rule of sorted) {
            const triplet = normaliseTriplet(rule.landmarks);
            const side    = rule.side ?? 'bilateral';
            const isRep   = !!rule.rep_joint;

            if (side === 'right') {
              // Prescribed right side only — mirror the stored left triplet
              const rightTriplet = mirrorLandmarks(triplet);
              drawJointRule(ctx, lms, rightTriplet, isRep, W, H);
            } else if (side === 'left') {
              drawJointRule(ctx, lms, triplet, isRep, W, H);
            } else {
              // Bilateral — draw both sides
              drawJointRule(ctx, lms, triplet,                  isRep, W, H);
              drawJointRule(ctx, lms, mirrorLandmarks(triplet), isRep, W, H);
            }
          }
        }
      }

      ctx.restore();
      onResults(results);
    });

    poseRef.current = pose;

    if (videoRef.current) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current) {
            await pose.send({ image: videoRef.current });
          }
        },
        width:  640,
        height: 480,
      });

      camera.start()
        .then(() => setHasPermission(true))
        .catch(() => setHasPermission(false));

      cameraRef.current = camera;
    }

    return () => {
      cameraRef.current?.stop();
      poseRef.current?.close();
    };
  }, [isActive]);

  if (hasPermission === false) {
    return (
      <div className="w-full h-full bg-muted rounded-2xl flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-4xl mb-3">📷</p>
          <p className="font-semibold text-sm">Camera access denied</p>
          <p className="text-xs text-muted-foreground mt-1">
            Enable camera in your browser settings to use motion tracking
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
        playsInline
        muted
      />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
      />
      {hasPermission === null && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <p className="text-white text-sm">Starting camera...</p>
        </div>
      )}
    </div>
  );
}
