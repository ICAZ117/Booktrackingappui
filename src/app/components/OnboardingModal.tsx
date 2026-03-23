import { X, BookOpen, Search, Calendar, Award, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const onboardingSteps = [
  {
    icon: BookOpen,
    title: 'Welcome to ReadTrack! 📚',
    description: 'Your personal reading companion that helps you track books, discover new reads, and celebrate your progress.',
    gradient: 'from-blue-500 to-purple-500',
  },
  {
    icon: Search,
    title: 'Discover Amazing Books',
    description: 'Browse 25-50 curated recommendations in every genre. Search millions of books via Open Library and Google Books APIs.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Calendar,
    title: 'Track Your Reading Streak',
    description: 'Mark your reading days and build an epic streak! See your progress with a beautiful calendar heatmap.',
    gradient: 'from-pink-500 to-red-500',
  },
  {
    icon: Award,
    title: 'Earn 23 Unique Badges',
    description: 'Unlock achievements as you read! From "Speed Reader" to "Bookworm Supreme" - collect them all.',
    gradient: 'from-orange-500 to-yellow-500',
  },
  {
    icon: Sparkles,
    title: 'Customize Your Experience',
    description: 'Create unlimited custom themes with live preview. Make ReadTrack truly yours with gradients, colors, and more!',
    gradient: 'from-green-500 to-teal-500',
  },
];

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const { currentTheme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Mark onboarding as completed
      localStorage.setItem('readtrack_onboarding_completed', 'true');
      onClose();
    }
  };

  const handleSkip = () => {
    localStorage.setItem('readtrack_onboarding_completed', 'true');
    onClose();
  };

  const step = onboardingSteps[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === onboardingSteps.length - 1;

  const getGradientBg = () => {
    return currentTheme.isGradient
      ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
      : currentTheme.primary;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden"
              style={{ backgroundColor: currentTheme.backgroundColor }}
            >
              {/* Header with Skip Button */}
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 rounded-full font-semibold text-sm backdrop-blur-sm transition-all hover:scale-105"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: '#ffffff',
                  }}
                >
                  Skip
                </button>
              </div>

              {/* Content */}
              <div className="p-8 text-center">
                {/* Animated Icon */}
                <motion.div
                  key={currentStep}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className={`w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-2xl`}
                >
                  <Icon className="w-12 h-12 text-white" />
                </motion.div>

                {/* Title */}
                <motion.h2
                  key={`title-${currentStep}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl font-bold mb-4"
                  style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
                >
                  {step.title}
                </motion.h2>

                {/* Description */}
                <motion.p
                  key={`desc-${currentStep}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg leading-relaxed mb-8"
                  style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                >
                  {step.description}
                </motion.p>

                {/* Progress Dots */}
                <div className="flex justify-center gap-2 mb-8">
                  {onboardingSteps.map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.8 }}
                      animate={{
                        scale: index === currentStep ? 1.2 : 0.8,
                        opacity: index === currentStep ? 1 : 0.3,
                      }}
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        background: index === currentStep ? getGradientBg() : currentTheme.borderColor,
                      }}
                    />
                  ))}
                </div>

                {/* Next Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="w-full py-4 px-6 rounded-2xl font-bold text-lg text-white shadow-lg transition-all flex items-center justify-center gap-3"
                  style={{ background: getGradientBg() }}
                >
                  {isLastStep ? "Let's Get Started!" : 'Next'}
                  <ChevronRight className="w-6 h-6" />
                </motion.button>

                {/* Step Counter */}
                <div
                  className="mt-4 text-sm font-semibold"
                  style={{ color: currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af' }}
                >
                  {currentStep + 1} of {onboardingSteps.length}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
