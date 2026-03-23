import { X, RefreshCw, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';

interface MissingCoversBannerProps {
  missingCount: number;
  totalCount: number;
  onRestoreCovers: () => void;
  isRestoring: boolean;
}

export function MissingCoversBanner({ 
  missingCount, 
  totalCount, 
  onRestoreCovers,
  isRestoring 
}: MissingCoversBannerProps) {
  const { currentTheme } = useTheme();
  const [isDismissed, setIsDismissed] = useState(() => {
    // Check if user has dismissed this banner recently
    const dismissed = localStorage.getItem('covers_banner_dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      // Auto-show again after 1 hour
      return Date.now() - dismissedTime < 60 * 60 * 1000;
    }
    return false;
  });

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('covers_banner_dismissed', Date.now().toString());
  };

  // Don't show if dismissed or no missing covers
  if (isDismissed || missingCount === 0) return null;

  const percentage = Math.round((missingCount / totalCount) * 100);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mx-4 mt-4 mb-2 rounded-xl shadow-lg overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`,
        }}
      >
        <div className="p-4 flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-sm mb-1">
              Missing Book Covers Detected
            </h3>
            <p className="text-white/90 text-xs mb-3">
              {missingCount} of {totalCount} books ({percentage}%) are missing cover images. 
              Restore them automatically using our book database.
            </p>

            {/* Action Button */}
            <button
              onClick={onRestoreCovers}
              disabled={isRestoring}
              className="flex items-center gap-2 bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${isRestoring ? 'animate-spin' : ''}`} />
              {isRestoring ? 'Restoring Covers...' : 'Restore Covers Now'}
            </button>
          </div>

          {/* Dismiss Button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Progress bar during restore */}
        {isRestoring && (
          <div className="h-1 bg-white/20 overflow-hidden">
            <motion.div
              className="h-full bg-white"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
