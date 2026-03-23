import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, CheckCircle, AlertCircle, BookOpen, X } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { MigrationProgress } from '../utils/bookMigration';

interface MigrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartMigration: () => void;
  progress?: MigrationProgress;
  isMigrating: boolean;
  booksNeedingMigration: number;
}

export function MigrationModal({
  isOpen,
  onClose,
  onStartMigration,
  progress,
  isMigrating,
  booksNeedingMigration,
}: MigrationModalProps) {
  const { currentTheme } = useTheme();

  const getGradientBg = () => {
    return currentTheme.isGradient
      ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
      : currentTheme.primary;
  };

  const progressPercentage = progress ? (progress.current / progress.total) * 100 : 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden"
              style={{ backgroundColor: currentTheme.backgroundColor }}
            >
              {/* Header */}
              <div className="relative p-6 text-center text-white" style={{ background: getGradientBg() }}>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                  disabled={isMigrating}
                >
                  <X className="w-5 h-5" />
                </button>
                <RefreshCw className={`w-12 h-12 mx-auto mb-3 ${isMigrating ? 'animate-spin' : ''}`} />
                <h2 className="text-xl font-bold mb-1">Upgrade Book Covers</h2>
                <p className="text-white/80 text-sm">Get real book covers from Google Books</p>
              </div>

              {/* Content */}
              <div className="p-6">
                {!isMigrating && progress?.status !== 'complete' && (
                  <>
                    <div 
                      className="rounded-xl p-4 mb-4 border"
                      style={{
                        backgroundColor: currentTheme.cardColor,
                        borderColor: currentTheme.borderColor,
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <BookOpen 
                          className="w-5 h-5 flex-shrink-0 mt-0.5"
                          style={{ color: currentTheme.primary }}
                        />
                        <div>
                          <p 
                            className="text-sm font-semibold mb-1"
                            style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
                          >
                            {booksNeedingMigration} {booksNeedingMigration === 1 ? 'book' : 'books'} will be upgraded
                          </p>
                          <p 
                            className="text-xs"
                            style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                          >
                            We'll search Google Books and update covers while preserving your reading progress, ratings, and notes.
                          </p>
                        </div>
                      </div>
                    </div>

                    <ul 
                      className="space-y-2 text-xs mb-6"
                      style={{ color: currentTheme.textColor === 'light' ? '#d1d5db' : '#374151' }}
                    >
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>Replace placeholder covers with real book covers</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>Add ISBN, genres, and descriptions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span>Keep all your progress and ratings</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        <span>Takes ~30 seconds per book</span>
                      </li>
                    </ul>

                    <button
                      onClick={onStartMigration}
                      className="w-full py-3 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-transform"
                      style={{ background: getGradientBg() }}
                    >
                      Start Upgrade
                    </button>
                  </>
                )}

                {isMigrating && progress && (
                  <>
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span 
                          className="font-semibold"
                          style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
                        >
                          Upgrading books...
                        </span>
                        <span 
                          style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                        >
                          {progress.current} / {progress.total}
                        </span>
                      </div>
                      <div 
                        className="h-2 rounded-full overflow-hidden"
                        style={{ backgroundColor: currentTheme.cardColor }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: getGradientBg() }}
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercentage}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>

                    {/* Current Book */}
                    <div 
                      className="rounded-xl p-4 border"
                      style={{
                        backgroundColor: currentTheme.cardColor,
                        borderColor: currentTheme.borderColor,
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <RefreshCw 
                          className="w-5 h-5 animate-spin flex-shrink-0"
                          style={{ color: currentTheme.primary }}
                        />
                        <div className="flex-1 min-w-0">
                          <p 
                            className="text-xs font-semibold mb-0.5"
                            style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
                          >
                            {progress.status === 'searching' ? 'Searching' : 'Updating'}...
                          </p>
                          <p 
                            className="text-xs truncate"
                            style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                          >
                            {progress.bookTitle}
                          </p>
                        </div>
                      </div>
                    </div>

                    <p 
                      className="text-xs text-center mt-4"
                      style={{ color: currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af' }}
                    >
                      Please don't close this window
                    </p>
                  </>
                )}

                {progress?.status === 'complete' && (
                  <>
                    <div className="text-center py-6">
                      <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                      <h3 
                        className="text-lg font-bold mb-2"
                        style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
                      >
                        Upgrade Complete!
                      </h3>
                      <p 
                        className="text-sm mb-6"
                        style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                      >
                        All your books now have real covers from Google Books
                      </p>
                      <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-transform"
                        style={{ background: getGradientBg() }}
                      >
                        Done
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}