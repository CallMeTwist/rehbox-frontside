import { Lock } from 'lucide-react';

interface Props {
  thumbnailUrl: string | null;
  onUpgrade: () => void;
}

export function LockedVideoOverlay({ thumbnailUrl, onUpgrade }: Props) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-blue-dark">
      {thumbnailUrl && (
        <img
          src={thumbnailUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-50 blur-sm"
          loading="lazy"
        />
      )}
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-3 backdrop-blur-sm bg-black/40 text-white">
        <Lock className="h-10 w-10 text-hot-pink" aria-hidden="true" />
        <p className="text-sm font-semibold">Premium Exercise</p>
        <button
          type="button"
          onClick={onUpgrade}
          className="rounded-full bg-gradient-pink px-5 py-2 text-sm font-semibold text-white shadow transition hover:-translate-y-0.5"
        >
          Upgrade to Unlock
        </button>
      </div>
    </div>
  );
}
