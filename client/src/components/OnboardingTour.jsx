import { useState, useEffect } from 'react';
import { HelpCircle, ChevronRight, X, Sparkles, AlertCircle } from 'lucide-react';

const allSteps = [
  {
    title: "Welcome to Clinova",
    description: "Your modern, unified health workspace. Let's take a brief walkthrough of the interface.",
    target: "body"
  },
  {
    title: "Global Omnisearch (⌘K)",
    description: "Access patient profiles, navigate directories, and launch clinical actions instantly using the fuzzy command palette.",
    target: "search-trigger"
  },
  {
    title: "Real-Time Notifications",
    description: "Stay informed with live alerts for check-ins, lab results, and patient arrivals powered by Socket.io.",
    target: "notification-bell"
  },
  {
    title: "Consultation Queue",
    description: "Monitor and sign-off today's active patient appointments sorted by chronological priority.",
    target: "consultations-queue"
  },
  {
    title: "Laboratory Testing Board",
    description: "Track diagnostic test workflows from collection to technician review via columns.",
    target: "lab-kanban-board"
  },
  {
    title: "Health Metrics Profile",
    description: "Review patient profiles, contact details, insurance credentials, and blood group listings.",
    target: "patient-health-profile"
  },
  {
    title: "Patient Intake Register",
    description: "Check in existing appointments or register brand new patient files into the system.",
    target: "receptionist-register-form"
  }
];

export default function OnboardingTour() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSteps, setActiveSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Initialize and filter steps that actually exist on the current page
  useEffect(() => {
    const hasCompletedTour = localStorage.getItem('clinova_tour_completed');
    
    // We delay the DOM check slightly to allow the dashboard elements to fully render
    const timer = setTimeout(() => {
      const filtered = allSteps.filter(step => {
        if (step.target === 'body') return true;
        const el = document.getElementById(step.target);
        return el !== null;
      });
      setActiveSteps(filtered);

      if (!hasCompletedTour && filtered.length > 0) {
        setIsOpen(true);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Handle highlighting/scrolling when current step changes
  useEffect(() => {
    if (!isOpen || activeSteps.length === 0) return;

    // First clean up any existing highlights
    allSteps.forEach(s => {
      if (s.target !== 'body') {
        const el = document.getElementById(s.target);
        if (el) el.classList.remove('tour-highlight');
      }
    });

    const step = activeSteps[currentStep];
    if (step && step.target !== 'body') {
      const targetEl = document.getElementById(step.target);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetEl.classList.add('tour-highlight');
      }
    }

    return () => {
      // Cleanup on unmount or change
      allSteps.forEach(s => {
        if (s.target !== 'body') {
          const el = document.getElementById(s.target);
          if (el) el.classList.remove('tour-highlight');
        }
      });
    };
  }, [currentStep, isOpen, activeSteps]);

  const handleNext = () => {
    if (currentStep < activeSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('clinova_tour_completed', 'true');
    setIsOpen(false);
    
    // Clean up highlights
    allSteps.forEach(s => {
      if (s.target !== 'body') {
        const el = document.getElementById(s.target);
        if (el) el.classList.remove('tour-highlight');
      }
    });
  };

  const handleRestart = () => {
    const filtered = allSteps.filter(step => {
      if (step.target === 'body') return true;
      const el = document.getElementById(step.target);
      return el !== null;
    });
    setActiveSteps(filtered);
    setCurrentStep(0);
    setIsOpen(true);
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={handleRestart}
        className="fixed bottom-6 left-6 z-[90] flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white px-3.5 py-2.5 text-[12px] font-medium text-slate-500 shadow-premium transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 active:scale-95"
        title="Take onboarding tour"
      >
        <Sparkles className="h-3.5 w-3.5 text-slate-400" />
        <span>Tour guide</span>
      </button>
    );
  }

  const step = activeSteps[currentStep];
  if (!step) return null;

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[99] bg-slate-950/[0.06] backdrop-blur-[0.5px]" />

      <div className="fixed bottom-6 right-6 z-[100] w-full max-w-sm animate-scale-in overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-premium-lg">
        <div className="absolute inset-x-0 top-0 h-px bg-slate-200" />

        <button
          type="button"
          onClick={handleComplete}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
          aria-label="Close tour"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-3.5 mt-1 flex items-center gap-2">
          <span className="badge badge-neutral uppercase tracking-wider">
            Step {currentStep + 1} of {activeSteps.length}
          </span>
        </div>

        <h3 className="mb-1.5 pr-6 text-[15px] font-medium leading-tight text-slate-900">
          {step.title}
        </h3>
        <p className="mb-5 text-[12.5px] font-normal leading-relaxed text-slate-500">
          {step.description}
        </p>

        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={handleComplete}
            className="text-[12px] font-medium text-slate-400 transition-colors hover:text-slate-600"
          >
            Skip
          </button>

          <button type="button" onClick={handleNext} className="btn btn-primary btn-sm">
            <span>{currentStep === activeSteps.length - 1 ? 'Finish' : 'Next'}</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </>
  );
}
