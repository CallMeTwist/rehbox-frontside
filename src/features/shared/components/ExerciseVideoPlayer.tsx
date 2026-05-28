import { useNavigate } from 'react-router-dom';
import type { ExerciseVideo } from '@/types/exercise';
import { LockedVideoOverlay } from './LockedVideoOverlay';

interface Props {
  video: ExerciseVideo;
  thumbnailUrl: string | null;
  isLocked: boolean;
  title: string;
  onUpgrade?: () => void;
}

export function ExerciseVideoPlayer({ video, thumbnailUrl, isLocked, title, onUpgrade }: Props) {
  const navigate = useNavigate();
  const upgrade = onUpgrade ?? (() => navigate('/profile'));

  if (isLocked) {
    return <LockedVideoOverlay thumbnailUrl={thumbnailUrl} onUpgrade={upgrade} />;
  }

  if (video.source === 'upload' && video.url) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
        <video
          controls
          preload="metadata"
          poster={thumbnailUrl ?? undefined}
          src={video.url}
          className="h-full w-full"
          aria-label={title}
        />
      </div>
    );
  }

  if (video.source === 'youtube' && video.youtube_id) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.youtube_id}?rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted-blue">
      {thumbnailUrl && (
        <img src={thumbnailUrl} alt="" className="h-full w-full object-cover opacity-60" />
      )}
      <p className="absolute inset-0 flex items-center justify-center text-blue-mid">
        Video coming soon
      </p>
    </div>
  );
}
