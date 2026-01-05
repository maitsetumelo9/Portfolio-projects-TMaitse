import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Flame, Download, Smartphone, Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPage: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if running on iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  const handleContinue = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-amber-600 flex items-center justify-center shadow-lg shadow-primary/30">
            <Flame className="h-14 w-14 text-background" />
          </div>
          <h1 className="font-display text-3xl font-bold text-gold">Phoenix EA</h1>
          <p className="text-muted-foreground">Gold Trading Bot for MT5</p>
        </div>

        {/* Install Status */}
        {isInstalled ? (
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-2 text-success">
              <Check className="h-6 w-6" />
              <span className="font-semibold">App Installed!</span>
            </div>
            <p className="text-muted-foreground">
              Phoenix EA is now installed on your device. Open it from your home screen for the best experience.
            </p>
            <Button variant="gold" size="lg" onClick={handleContinue} className="w-full">
              Continue to App
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Features */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h2 className="font-semibold text-foreground">Install for the best experience</h2>
              <ul className="text-left space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <Smartphone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Works offline and loads instantly</span>
                </li>
                <li className="flex items-start gap-3">
                  <Download className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Access directly from your home screen</span>
                </li>
                <li className="flex items-start gap-3">
                  <Flame className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Full-screen trading experience</span>
                </li>
              </ul>
            </div>

            {/* Install Button or Instructions */}
            {deferredPrompt ? (
              <Button variant="gold" size="lg" onClick={handleInstall} className="w-full">
                <Download className="h-5 w-5 mr-2" />
                Install Phoenix EA
              </Button>
            ) : isIOS ? (
              <div className="bg-secondary/50 border border-border rounded-xl p-4 space-y-3">
                <p className="font-semibold text-foreground">Install on iOS:</p>
                <ol className="text-left text-sm text-muted-foreground space-y-2">
                  <li>1. Tap the <strong>Share</strong> button in Safari</li>
                  <li>2. Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                  <li>3. Tap <strong>"Add"</strong> to confirm</li>
                </ol>
              </div>
            ) : (
              <div className="bg-secondary/50 border border-border rounded-xl p-4 space-y-3">
                <p className="font-semibold text-foreground">Install on Android:</p>
                <ol className="text-left text-sm text-muted-foreground space-y-2">
                  <li>1. Tap the <strong>menu (⋮)</strong> in Chrome</li>
                  <li>2. Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong></li>
                  <li>3. Tap <strong>"Install"</strong> to confirm</li>
                </ol>
              </div>
            )}

            <Button variant="outline" size="lg" onClick={handleContinue} className="w-full">
              Continue in Browser
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstallPage;
