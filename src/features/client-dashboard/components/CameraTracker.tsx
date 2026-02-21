import { useState, useRef, useEffect } from "react";
import { Camera, CameraOff } from "lucide-react";

interface CameraTrackerProps {
  active: boolean;
  onToggle: () => void;
  onPoseDetected?: (landmarks: unknown) => void;
}

const CameraTracker = ({ active, onToggle, onPoseDetected }: CameraTrackerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    if (!active) {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
        videoRef.current.srcObject = null;
      }
      return;
    }

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 640, height: 480 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasPermission(true);
        }
      } catch {
        setHasPermission(false);
      }
    };

    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, [active]);

  return (
    <div className="relative w-full h-full">
      {active && hasPermission ? (
        <>
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
          {/* Skeleton overlay placeholder */}
          <div className="absolute inset-0 pointer-events-none">
            <svg viewBox="0 0 400 300" className="w-full h-full opacity-30">
              <circle cx="200" cy="60" r="20" stroke="hsl(225, 63%, 47%)" strokeWidth="3" fill="none" />
              <line x1="200" y1="80" x2="200" y2="180" stroke="hsl(225, 63%, 47%)" strokeWidth="3" />
              <line x1="200" y1="110" x2="150" y2="150" stroke="hsl(328, 78%, 56%)" strokeWidth="3" />
              <line x1="200" y1="110" x2="250" y2="150" stroke="hsl(328, 78%, 56%)" strokeWidth="3" />
              <line x1="200" y1="180" x2="170" y2="250" stroke="hsl(225, 63%, 47%)" strokeWidth="3" />
              <line x1="200" y1="180" x2="230" y2="250" stroke="hsl(225, 63%, 47%)" strokeWidth="3" />
            </svg>
          </div>
          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
            📹 MediaPipe Pose active
          </div>
        </>
      ) : active && hasPermission === false ? (
        <div className="flex items-center justify-center h-full text-center text-white/60">
          <div>
            <CameraOff size={48} className="mx-auto mb-2" />
            <p className="text-sm">Camera permission denied</p>
            <p className="text-xs opacity-60">Allow camera access in browser settings</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-center text-white/60">
          <div>
            <CameraOff size={48} className="mx-auto mb-2" />
            <p className="text-sm">Camera off</p>
          </div>
        </div>
      )}
      <button onClick={onToggle} className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-white/30 transition-colors">
        {active ? <CameraOff size={14} /> : <Camera size={14} />}
        {active ? "Camera Off" : "Enable Camera"}
      </button>
    </div>
  );
};

export default CameraTracker;
