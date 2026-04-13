function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    let videoId: string | null = null;

    if (parsed.hostname === 'youtu.be') {
      videoId = parsed.pathname.slice(1);
    } else if (
      parsed.hostname === 'www.youtube.com' ||
      parsed.hostname === 'youtube.com'
    ) {
      if (parsed.pathname.startsWith('/embed/')) {
        // Already an embed URL — extract the ID so we can re-add our params
        videoId = parsed.pathname.replace('/embed/', '');
      } else if (parsed.pathname.startsWith('/shorts/')) {
        videoId = parsed.pathname.replace('/shorts/', '');
      } else {
        videoId = parsed.searchParams.get('v');
      }
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
}

const VideoPlayer = ({
  src,
  poster,
  className = '',
}: {
  src?: string;
  poster?: string;
  className?: string;
}) => {
  const embedUrl = src ? getYouTubeEmbedUrl(src) : null;

  return (
    <div
      className={`relative bg-brand-dark rounded-2xl overflow-hidden aspect-video flex items-center justify-center ${className}`}
    >
      {embedUrl ? (
        <iframe
          src={`${embedUrl}?autoplay=0&rel=0`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          title="Exercise video"
        />
      ) : src ? (
        <video
          src={src}
          poster={poster}
          controls
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="text-center text-white/60">
          <p className="text-4xl mb-2">🎬</p>
          <p className="text-sm">Video placeholder</p>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
