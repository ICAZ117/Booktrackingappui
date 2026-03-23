import { motion } from 'motion/react';
import { Sparkles, Trophy, Award, Target, Flame, Star, Calendar, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { BookCover } from './BookCover';

interface CelebrationModalProps {
  type: 'book_finished' | 'streak' | 'goal' | 'milestone';
  title: string;
  message: string;
  isOpen: boolean;
  onClose: () => void;
  bookData?: {
    title: string;
    cover?: string;
    rating?: number;
    daysToRead?: number;
  };
}

const celebrationIcons = {
  book_finished: Trophy,
  streak: Flame,
  goal: Target,
  milestone: Award
};

export function CelebrationModal({ type, title, message, isOpen, onClose, bookData }: CelebrationModalProps) {
  const { currentTheme } = useTheme();
  const Icon = celebrationIcons[type];

  const getGradientBg = () => {
    return currentTheme.isGradient
      ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
      : currentTheme.primary;
  };

  useEffect(() => {
    if (isOpen) {
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: [currentTheme.primary, currentTheme.secondary, currentTheme.successColor, '#f59e0b']
      });
    }
  }, [isOpen, currentTheme]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      className="fixed inset-x-4 top-1/2 -translate-y-1/2 rounded-3xl z-[300] shadow-2xl overflow-hidden max-w-sm mx-auto"
      style={{ backgroundColor: currentTheme.cardColor }}
    >
      {bookData ? (
        // Enhanced book finished celebration
        <>
          <div className="p-8 text-center relative" style={{ background: getGradientBg() }}>
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            
            <h2 className="text-3xl font-bold text-white mb-2">🎉 Congratulations!</h2>
            <p className="text-white/90 text-base font-semibold">You finished a book!</p>
          </div>
          
          <div className="p-6 space-y-5">
            {/* Book Cover */}
            {bookData.cover && (
              <div className="flex justify-center">
                <div className="w-32 h-48 rounded-xl overflow-hidden shadow-xl">
                  <BookCover
                    src={bookData.cover}
                    alt={bookData.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
            
            {/* Book Title */}
            <h3 
              className="text-xl font-bold text-center"
              style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
            >
              {bookData.title}
            </h3>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Rating */}
              {bookData.rating !== undefined && bookData.rating > 0 && (
                <div 
                  className="rounded-xl p-4 text-center"
                  style={{ backgroundColor: currentTheme.backgroundColor }}
                >
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star className="w-5 h-5" style={{ fill: currentTheme.primary, color: currentTheme.primary }} />
                    <span 
                      className="text-2xl font-bold"
                      style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
                    >
                      {bookData.rating.toFixed(1)}
                    </span>
                  </div>
                  <p 
                    className="text-xs font-semibold uppercase tracking-wide"
                    style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                  >
                    Your Rating
                  </p>
                </div>
              )}
              
              {/* Days to Read */}
              {bookData.daysToRead !== undefined && (
                <div 
                  className="rounded-xl p-4 text-center"
                  style={{ backgroundColor: currentTheme.backgroundColor }}
                >
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Calendar className="w-5 h-5" style={{ color: currentTheme.primary }} />
                    <span 
                      className="text-2xl font-bold"
                      style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
                    >
                      {bookData.daysToRead}
                    </span>
                  </div>
                  <p 
                    className="text-xs font-semibold uppercase tracking-wide"
                    style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                  >
                    Days to Read
                  </p>
                </div>
              )}
            </div>
            
            <button
              onClick={onClose}
              className="w-full text-white rounded-xl py-3.5 font-bold text-base"
              style={{ background: getGradientBg() }}
            >
              Awesome! 🎉
            </button>
          </div>
        </>
      ) : (
        // Default celebration
        <>
          <div className="p-8 text-center relative" style={{ background: getGradientBg() }}>
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                scale: [1, 1.2, 1.2, 1.2, 1]
              }}
              transition={{ duration: 0.6 }}
              className="w-20 h-20 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
            >
              <Icon className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
            <p className="text-white/90 text-sm">{message}</p>
          </div>
          <div className="p-4">
            <button
              onClick={onClose}
              className="w-full text-white rounded-xl py-3 font-bold"
              style={{ background: getGradientBg() }}
            >
              Awesome! 🎉
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}