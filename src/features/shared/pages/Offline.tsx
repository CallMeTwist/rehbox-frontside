export const OfflinePage = () => (
  <div className="min-h-screen bg-background flex items-center justify-center p-6">
    <div className="text-center">
      <p className="text-6xl mb-4">📡</p>
      <h1 className="font-display font-bold text-2xl mb-2">You're offline</h1>
      <p className="text-muted-foreground text-sm mb-6 max-w-xs">
        ReHboX needs an internet connection for most features.
        Connect to Wi-Fi or mobile data to continue.
      </p>
      <button onClick={() => window.location.reload()}
        className="gradient-primary text-white rounded-xl px-6 py-3 font-semibold">
        Try Again
      </button>
    </div>
  </div>
);