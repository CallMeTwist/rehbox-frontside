const VideoPlayer = ({ src, poster, className = "" }: { src?: string; poster?: string; className?: string }) => {
  return (
    <div className={`relative bg-brand-dark rounded-2xl overflow-hidden aspect-video flex items-center justify-center ${className}`}>
      {src ? (
        <video src={src} poster={poster} controls className="w-full h-full object-cover" />
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
