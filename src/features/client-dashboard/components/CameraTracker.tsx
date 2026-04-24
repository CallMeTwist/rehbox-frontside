// src/features/client-dashboard/components/CameraTracker.tsx
import { useEffect, useRef, useState } from 'react';
import { Pose, Results } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { mirrorLandmarks, POSE_PRESENCE_THRESHOLD, type JointRule } from '@/features/shared/utils/motion';
import {
  drawActiveJoint,
  drawAngleLabel,
  drawFloatingLabels,
  drawLowConfidenceOverlay,
  drawNoPoseOverlay,
  type FloatingLabel,
} from '@/lib/tracking/SkeletonRenderer';
import type { MovementDirection } from '@/lib/tracking/AngleEngine';
import { OPPOSITE_LABEL } from '@/lib/tracking/LandmarkMap';
import { ROM_STANDARDS } from '@/features/shared/utils/motion';

/** Normalise a landmarks field that may arrive from PHP as {0:x, 1:y, 2:z} */
function normaliseTriplet(
  raw: [number, number, number] | Record<number, number>,
): [number, number, number] {
  if (Array.isArray(raw)) return raw;
  return [raw[0], raw[1], raw[2]];
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  onResults:          (results: Results) => void;
  isActive:           boolean;
  jointRules?:        JointRule[];
  movementDirection?: MovementDirection;
  /** Live angle (degrees) for the rep joint — rendered as a canvas label */
  currentAngle?:      number | null;
  /** Movement key (e.g. 'shoulder_abduction') for the label text */
  movement?:          string;
  /** Per-joint live angles keyed by rule.joint — used for floating labels on non-rep joints */
  currentAngles?:     Record<string, number>;
  /** When the user has selected a side, restrict joint drawing to that side only */
  activeSide?:        'left' | 'right';
}

export function CameraTracker({
  onResults, isActive, jointRules,
  movementDirection = 'neutral',
  currentAngle, movement, currentAngles,
  activeSide,
}: Props) {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<Camera | null>(null);
  const poseRef   = useRef<Pose | null>(null);
  const rulesRef        = useRef<JointRule[] | undefined>(jointRules);
  const directionRef    = useRef<MovementDirection>(movementDirection);
  const angleRef        = useRef<number | null | undefined>(currentAngle);
  const movementRef     = useRef<string | undefined>(movement);
  const currentAnglesRef = useRef<Record<string, number> | undefined>(currentAngles);
  const activeSideRef   = useRef<'left' | 'right' | undefined>(activeSide);
  const noPoseStartRef  = useRef<number | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => { rulesRef.current         = jointRules;        }, [jointRules]);
  useEffect(() => { directionRef.current     = movementDirection; }, [movementDirection]);
  useEffect(() => { angleRef.current         = currentAngle;      }, [currentAngle]);
  useEffect(() => { movementRef.current      = movement;          }, [movement]);
  useEffect(() => { currentAnglesRef.current = currentAngles;     }, [currentAngles]);
  useEffect(() => { activeSideRef.current    = activeSide;        }, [activeSide]);

  useEffect(() => {
    if (!isActive) {
      cameraRef.current?.stop();
      return;
    }

    // Liveness flag: MediaPipe runs async, so frames can complete processing
    // AFTER the component has torn down. Every callback below checks this
    // before touching the canvas, firing onResults, or calling pose.send.
    // Set false in cleanup; all late-arriving work becomes a no-op.
    let isAlive = true;

    const pose = new Pose({
      // Self-hosted assets — see vite.config.ts `mediapipePosePlugin`.
      // Same-origin loading avoids jsDelivr outages, clinic firewalls, and CSP
      // violations, and lets the service worker precache the wasm/model files.
      locateFile: (file) => `/mediapipe/${file}`,
    });

    pose.setOptions({
      modelComplexity:          1,
      smoothLandmarks:          true,
      enableSegmentation:       false,
      minDetectionConfidence:   0.3,
      minTrackingConfidence:    0.3,
    });

    pose.onResults((results: Results) => {
      // Guard: this frame may have been in-flight when the component tore down.
      if (!isAlive) return;
      const canvas = canvasRef.current;
      const ctx    = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const W = canvas.width;
      const H = canvas.height;

      ctx.save();
      ctx.clearRect(0, 0, W, H);
      // Draw camera feed mirrored via canvas transform so text overlays stay readable
      ctx.save();
      ctx.translate(W, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(results.image, 0, 0, W, H);
      ctx.restore();

      if (!results.poseLandmarks) {
        // Track how long we've had no pose
        const now = Date.now();
        if (noPoseStartRef.current === null) noPoseStartRef.current = now;
        if (now - noPoseStartRef.current >= 3000) {
          drawNoPoseOverlay(ctx, W, H);
        }
        ctx.restore();
        return;
      }

      // Pose is present — reset the no-pose timer
      noPoseStartRef.current = null;

      if (results.poseLandmarks) {
        const lms   = results.poseLandmarks;
        // Flip landmark x-coords to match the mirrored image draw above.
        // Drawing functions receive mirrored coords so overlays align correctly
        // while leaving the canvas ctx un-flipped — keeping text glyphs readable.
        const mirroredLms = lms.map((lm) => ({ ...lm, x: 1 - lm.x }));
        const rules = rulesRef.current;
        const dir   = directionRef.current;
        const aside = activeSideRef.current;
        const isMob = window.innerWidth < 768;

        // Low-confidence guard — fewer than 7 landmarks visible means the user is
        // significantly out of frame; overlay + skip onResults to pause rep counting.
        // Kept low so arm-only exercises (bicep curl etc.) aren't blocked.
        const visibleCount = lms.filter((l) => (l.visibility ?? 0) >= POSE_PRESENCE_THRESHOLD).length;
        if (visibleCount < 7) {
          drawLowConfidenceOverlay(ctx, W, H);
          ctx.restore();
          return;
        }

        if (rules && rules.length > 0) {
          // Active joint highlight: non-rep joints first, rep joint on top
          const sorted = [...rules].sort((a, b) =>
            (a.rep_joint ? 1 : 0) - (b.rep_joint ? 1 : 0),
          );

          for (const rule of sorted) {
            const triplet = normaliseTriplet(rule.landmarks);
            const ruleSide = rule.side ?? 'bilateral';
            // When the user has selected a side, bilateral rules collapse to that side
            const effectiveSide = (ruleSide === 'bilateral' && aside) ? aside : ruleSide;
            const ruleDir = rule.rep_joint ? dir : 'opposite';

            let activeTriplet: [number, number, number] = triplet;
            if (effectiveSide === 'right') {
              activeTriplet = mirrorLandmarks(triplet);
              drawActiveJoint(ctx, mirroredLms, activeTriplet, ruleDir, W, H, isMob);
            } else if (effectiveSide === 'left') {
              drawActiveJoint(ctx, mirroredLms, triplet, ruleDir, W, H, isMob);
            } else {
              // Truly bilateral (no side selected) — draw both
              drawActiveJoint(ctx, mirroredLms, triplet,                  ruleDir, W, H, isMob);
              drawActiveJoint(ctx, mirroredLms, mirrorLandmarks(triplet), 'opposite', W, H, isMob);
            }

            // Canvas angle label — only on the rep joint when we have an angle
            if (rule.rep_joint) {
              const angle = angleRef.current;
              const mov   = movementRef.current;
              if (angle != null && mov) {
                const isOpposite = dir !== 'primary';
                const label = isOpposite
                  ? (OPPOSITE_LABEL[mov] ?? 'Return')
                  : (ROM_STANDARDS[mov]?.label ?? mov.replace(/_/g, ' '));
                const vertexLm = mirroredLms[activeTriplet[1]];
                if (vertexLm) {
                  drawAngleLabel(ctx, vertexLm, label, angle, W, H, isMob, isOpposite);
                }
              }
            }
          }

          // Floating labels for non-rep joints (composite / multi-joint mobility exercises)
          const angles = currentAnglesRef.current;
          if (angles) {
            const floatingLabels: FloatingLabel[] = sorted
              .filter((r) => !r.rep_joint && angles[r.joint] != null)
              .map((r) => {
                const triplet  = normaliseTriplet(r.landmarks);
                const fSide    = r.side ?? 'bilateral';
                const fEffSide = (fSide === 'bilateral' && aside) ? aside : fSide;
                // Use mirrored vertex for right-side rules so label sits on the correct joint
                const vertexIdx = fEffSide === 'right'
                  ? (mirrorLandmarks(triplet) as [number, number, number])[1]
                  : triplet[1];
                return {
                  landmarkIndex: vertexIdx,
                  label: ROM_STANDARDS[r.movement ?? '']?.label ?? r.joint,
                  angle: angles[r.joint],
                };
              });
            if (floatingLabels.length > 0) {
              drawFloatingLabels(ctx, mirroredLms, floatingLabels, W, H);
            }
          }
        }
      }

      ctx.restore();
      // Final liveness check before handing results to the parent hook; the
      // above drawing can span a frame, during which teardown may have fired.
      if (!isAlive) return;
      onResults(results);
    });

    poseRef.current = pose;

    if (videoRef.current) {
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          // Guard before send — avoids queuing a new frame after teardown,
          // which otherwise rejects during pose.close() and logs a stack trace.
          if (!isAlive || !videoRef.current) return;
          try {
            await pose.send({ image: videoRef.current });
          } catch {
            // pose.send rejects if the solution is closing — expected during
            // teardown, not a bug. Swallowing silently.
          }
        },
        width:  640,
        height: 480,
      });

      camera.start()
        .then(() => { if (isAlive) setHasPermission(true); })
        .catch(() => { if (isAlive) setHasPermission(false); });

      cameraRef.current = camera;
    }

    return () => {
      isAlive = false;
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
        className="absolute inset-0 w-full h-full object-cover"
      />
      {hasPermission === null && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <p className="text-white text-sm">Starting camera...</p>
        </div>
      )}
    </div>
  );
}
