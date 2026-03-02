// src/features/shared/components/InstallPrompt.tsx
import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';

export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt]         = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after 30 seconds on the app
      setTimeout(() => setShowPrompt(true), 30000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShowPrompt(false);
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 bg-card border border-border rounded-2xl p-4 shadow-2xl">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-white font-display font-bold">Rx</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">Install ReHboX</p>
          <p className="text-xs text-muted-foreground">
            Add to home screen for the best experience
          </p>
        </div>
        <button onClick={() => setShowPrompt(false)}
          className="text-muted-foreground hover:text-foreground text-lg flex-shrink-0">
          ✕
        </button>
      </div>
      <button onClick={handleInstall}
        className="w-full mt-3 gradient-primary text-white rounded-xl py-2.5 text-sm font-semibold flex items-center justify-center gap-2">
        <Download size={16} /> Install App
      </button>
    </div>
  );
};