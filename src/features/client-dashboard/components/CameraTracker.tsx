// src/features/client-dashboard/components/CameraTracker.tsx
import { useEffect, useRef, useState } from 'react';
import { Pose, Results, POSE_CONNECTIONS } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';

interface Props {
  onResults: (results: Results) => void;
  isActive: boolean;
}

export function CameraTracker({ onResults, isActive }: Props) {
  const videoRef  = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<Camera | null>(null);
  const poseRef   = useRef<Pose | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

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
      modelComplexity:    1,
      smoothLandmarks:    true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence:  0.5,
    });

    pose.onResults((results: Results) => {
      // Draw skeleton on canvas overlay
      const canvas = canvasRef.current;
      const ctx    = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

      if (results.poseLandmarks) {
        drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
          color: '#E5197D',
          lineWidth: 2,
        });
        drawLandmarks(ctx, results.poseLandmarks, {
          color: '#1B3E8F',
          lineWidth: 1,
          radius: 4,
        });
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
        width: 640,
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