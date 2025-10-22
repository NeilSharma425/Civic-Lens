import { useState, useEffect } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DemoHint() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the hint
    const wasDismissed = localStorage.getItem('demo-hint-dismissed');
    if (wasDismissed) {
      setDismissed(true);
      return;
    }

    // Show hint after a short delay
    const timer = setTimeout(() => {
      setShow(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem('demo-hint-dismissed', 'true');
  };

  const handleStartDemo = () => {
    // Simulate pressing the comma key
    const event = new KeyboardEvent('keydown', { key: ',' });
    window.dispatchEvent(event);
    handleDismiss();
  };

  if (dismissed || !show) return null;

  return (
    <div className="fixed bottom-8 left-8 z-50 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-card border-2 border-primary rounded-xl shadow-2xl p-4 max-w-sm">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Dismiss"
        >
          ✕
        </button>
        
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
            <Play className="text-primary w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-foreground mb-1">
              Try Demo Mode!
            </h4>
            <p className="text-sm text-muted-foreground mb-3">
              Watch an automated tour of CivicLens features
            </p>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                onClick={handleStartDemo}
                className="bg-primary hover:bg-primary/90"
              >
                <Play className="w-4 h-4 mr-1" />
                Start Demo
              </Button>
              <span className="text-xs text-muted-foreground">
                or press <kbd className="px-1.5 py-0.5 bg-muted rounded text-foreground">,</kbd>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




