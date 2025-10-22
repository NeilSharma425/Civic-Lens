import { useEffect, useState } from "react";
import { useLocation } from "wouter";

interface DemoStep {
  type: 'navigate' | 'scroll' | 'type' | 'click' | 'wait' | 'highlight';
  target?: string;
  value?: string;
  duration?: number;
  text?: string;
  description?: string;
}

const demoSteps: DemoStep[] = [
  { type: 'wait', duration: 1000, description: 'Welcome to CivicLens!' },
  { type: 'scroll', target: 'top', duration: 800, description: 'Starting tour...' },
  { type: 'wait', duration: 1500, description: 'This is CivicLens - AI-powered civic feedback analysis' },
  { type: 'scroll', target: 'upload', duration: 1500, description: 'Scrolling to upload section...' },
  { type: 'wait', duration: 800, description: 'Here you can submit feedback' },
  { type: 'highlight', target: 'upload-section', duration: 3000, description: 'Upload via text or CSV files' },
  { type: 'wait', duration: 800, description: 'Let\'s submit some feedback...' },
  
  // First feedback in English
  { type: 'type', target: '#feedback-textarea', text: 'The new park needs better lighting and more accessibility features for everyone.', duration: 3500, description: 'Typing English feedback...' },
  { type: 'wait', duration: 1200, description: 'Ready to process!' },
  { type: 'click', target: '[data-testid="button-process-feedback"]', duration: 500, description: 'Submitting for AI analysis...' },
  { type: 'wait', duration: 3000, description: 'AI processing (1/3)...' },
  
  // Second feedback in Spanish
  { type: 'type', target: '#feedback-textarea', text: 'Necesitamos más transporte público en nuestra comunidad. Los autobuses son poco frecuentes.', duration: 3500, description: 'Typing Spanish feedback...' },
  { type: 'wait', duration: 1200, description: 'Ready to submit Spanish...' },
  { type: 'click', target: '[data-testid="button-process-feedback"]', duration: 500, description: 'Submitting Spanish feedback...' },
  { type: 'wait', duration: 3000, description: 'AI translating and analyzing (2/3)...' },
  
  // Third feedback in Chinese
  { type: 'type', target: '#feedback-textarea', text: '社区中心应该延长开放时间，以便让更多居民可以参与活动。', duration: 3500, description: 'Typing Chinese feedback...' },
  { type: 'wait', duration: 1200, description: 'Ready to submit Chinese...' },
  { type: 'click', target: '[data-testid="button-process-feedback"]', duration: 500, description: 'Submitting Chinese feedback...' },
  { type: 'wait', duration: 3000, description: 'AI translating and analyzing (3/3)...' },
  
  // Navigate to analytics and wait for results
  { type: 'wait', duration: 1000, description: 'All submissions complete!' },
  { type: 'navigate', value: '/analytics', duration: 800, description: 'Navigating to Analytics...' },
  { type: 'scroll', target: 'top', duration: 500, description: 'Starting at top...' },
  { type: 'wait', duration: 2500, description: 'Loading analytics dashboard...' },
  { type: 'wait', duration: 3000, description: 'Viewing sentiment analysis...' },
  { type: 'scroll', target: 'processing-results', duration: 2000, description: 'AI Processing Results' },
  { type: 'wait', duration: 3000, description: 'Viewing translations and analysis...' },
  { type: 'scroll', target: 'insights', duration: 2000, description: 'Policy Insights' },
  { type: 'wait', duration: 3000, description: 'View recommendations and export options' },
  { type: 'wait', duration: 1500, description: 'Demo complete - Thank you!' },
];

export default function DemoMode() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [, setLocation] = useLocation();
  const [highlightElement, setHighlightElement] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ',') {
        setIsActive(true);
        setCurrentStep(0);
        setShowWelcome(true);
        setTimeout(() => setShowWelcome(false), 3000);
      }
      if (e.key === 'Escape' && isActive) {
        setIsActive(false);
        setCurrentStep(0);
        setHighlightElement(null);
        setShowWelcome(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isActive]);

  useEffect(() => {
    if (!isActive || currentStep >= demoSteps.length) {
      if (currentStep >= demoSteps.length) {
        setTimeout(() => {
          setIsActive(false);
          setCurrentStep(0);
          setHighlightElement(null);
        }, 1000);
      }
      return;
    }

    const step = demoSteps[currentStep];
    const executionTime = step.duration || 1000;

    const executeStep = async () => {
      switch (step.type) {
        case 'navigate':
          if (step.value) {
            setLocation(step.value);
          }
          break;

        case 'scroll':
          if (step.target === 'top') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (step.target === 'bottom') {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          } else if (step.target === 'middle') {
            window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
          } else if (step.target) {
            const element = document.getElementById(step.target);
            if (element) {
              // Use 'start' for processing-results and insights to position heading near top
              const blockPosition = (step.target === 'processing-results' || step.target === 'insights') ? 'start' : 'center';
              element.scrollIntoView({ behavior: 'smooth', block: blockPosition });
            }
          }
          break;

        case 'highlight':
          if (step.target) {
            setHighlightElement(step.target);
            setIsFadingOut(false);
            // Start fade-out animation 700ms before removing
            const fadeOutTime = (step.duration || 2000) - 700;
            setTimeout(() => {
              setIsFadingOut(true);
              setTimeout(() => {
                setHighlightElement(null);
                setIsFadingOut(false);
              }, 700);
            }, fadeOutTime > 0 ? fadeOutTime : 0);
          }
          break;

        case 'click':
          if (step.target) {
            const element = document.querySelector(step.target) as HTMLElement;
            if (element) {
              // Scroll to element first
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              // Wait a moment then click
              setTimeout(() => {
                // Try multiple ways to trigger the click
                element.click();
                // Also dispatch mouse events for React
                element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
              }, 300);
            }
          }
          break;

        case 'type':
          if (step.target && step.text) {
            const element = document.querySelector(step.target) as HTMLInputElement | HTMLTextAreaElement;
            if (element) {
              element.focus();
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              
              // Simulate realistic typing
              const text = step.text;
              const typingSpeed = (step.duration || 2000) / text.length;
              
              for (let i = 0; i <= text.length; i++) {
                setTimeout(() => {
                  element.value = text.substring(0, i);
                  // Trigger React's synthetic event
                  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                    window.HTMLTextAreaElement.prototype,
                    'value'
                  )?.set;
                  if (nativeInputValueSetter) {
                    nativeInputValueSetter.call(element, text.substring(0, i));
                  }
                  element.dispatchEvent(new Event('input', { bubbles: true }));
                  element.dispatchEvent(new Event('change', { bubbles: true }));
                }, i * typingSpeed);
              }
            }
          }
          break;

        case 'wait':
          // Just wait
          break;
      }

      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, executionTime);
    };

    executeStep();
  }, [isActive, currentStep, setLocation]);

  if (!isActive) return null;

  const currentStepData = demoSteps[currentStep];

  return (
    <>
      {/* Welcome Message - Hidden */}
      {/* {showWelcome && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-card border-2 border-primary rounded-2xl p-8 max-w-md text-center shadow-2xl animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🎬</span>
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-3">Demo Mode</h2>
            <p className="text-muted-foreground mb-4">
              Sit back and watch an automated tour of CivicLens!
            </p>
            <div className="text-sm text-muted-foreground bg-muted px-4 py-2 rounded-lg">
              Press <kbd className="px-2 py-1 bg-background rounded border">ESC</kbd> to exit anytime
            </div>
          </div>
        </div>
      )} */}

      {/* Demo Mode Indicator - Hidden */}
      {/* <div className="fixed top-4 right-4 z-[100] bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg animate-pulse">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
          <span className="font-semibold">Demo Mode Active</span>
        </div>
        <p className="text-xs mt-1 opacity-90">Press ESC to exit</p>
      </div> */}

      {/* Current Step Description - Hidden */}
      {/* {currentStepData?.description && (
        <div className="fixed top-20 right-4 z-[100] bg-card border border-border text-foreground px-4 py-3 rounded-lg shadow-xl max-w-xs animate-in slide-in-from-right duration-300">
          <p className="text-sm font-medium">{currentStepData.description}</p>
        </div>
      )} */}

      {/* Highlight Overlay - Just darkens background, no blue border */}
      {highlightElement && (
        <div 
          className="fixed inset-0 z-[90] pointer-events-none"
          style={{
            background: 'rgba(0, 0, 0, 0.5)',
            animation: isFadingOut ? 'fadeOut 700ms ease-in-out forwards' : 'fadeIn 700ms ease-in-out',
          }}
        >
          <style>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
                background: rgba(0, 0, 0, 0);
              }
              to {
                opacity: 1;
                background: rgba(0, 0, 0, 0.5);
              }
            }
            
            @keyframes fadeOut {
              from {
                opacity: 1;
                background: rgba(0, 0, 0, 0.5);
              }
              to {
                opacity: 0;
                background: rgba(0, 0, 0, 0);
              }
            }
            
            #${highlightElement} {
              position: relative;
              z-index: 95 !important;
              border-radius: 8px;
            }
          `}</style>
        </div>
      )}

      {/* Progress Indicator - Hidden */}
      {/* <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[100] bg-card border border-border px-6 py-3 rounded-full shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {demoSteps.length}
          </div>
          <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div> */}
    </>
  );
}

