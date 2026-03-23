import { X, Book, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { BookOpen, Headphones, Smartphone } from 'lucide-react';

interface QuickProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: {
    title: string;
    currentPage?: number;
    pages?: number;
    format?: 'physical' | 'ebook' | 'audiobook';
    audioDuration?: number; // in minutes
    currentMinutes?: number; // in minutes
  };
  onUpdate: (updates: any) => void;
}

export function QuickProgressModal({ isOpen, onClose, book, onUpdate }: QuickProgressModalProps) {
  const { currentTheme } = useTheme();
  
  const [inputMode, setInputMode] = useState<'pages' | 'percent'>('pages');
  const [selectedFormat, setSelectedFormat] = useState<'physical' | 'ebook' | 'audiobook'>(book.format || 'physical');
  
  // Page-based state
  const [pageInput, setPageInput] = useState((book.currentPage || 0).toString());
  const [percentInput, setPercentInput] = useState('0');

  useEffect(() => {
    if (isOpen) {
      // Initialize page inputs
      setInputMode('pages');
      setPageInput((book.currentPage || 0).toString());
      setSelectedFormat(book.format || 'physical');
      if (book.pages) {
        const percent = Math.round(((book.currentPage || 0) / book.pages) * 100);
        setPercentInput(percent.toString());
      }
    }
  }, [isOpen, book]);

  const handlePageChange = (value: string) => {
    setPageInput(value);
    const page = parseInt(value) || 0;
    if (book.pages && book.pages > 0) {
      const percent = Math.round((page / book.pages) * 100);
      setPercentInput(isNaN(percent) ? '0' : percent.toString());
    } else {
      setPercentInput('0');
    }
  };

  const handlePercentChange = (value: string) => {
    setPercentInput(value);
    const percent = parseInt(value) || 0;
    
    if (book.pages && book.pages > 0) {
      const calculatedPage = Math.round((percent / 100) * book.pages);
      setPageInput(isNaN(calculatedPage) ? '0' : calculatedPage.toString());
    } else {
      setPageInput('0');
    }
  };

  const handleSubmit = () => {
    const newPage = parseInt(pageInput) || 0;
    if (newPage >= 0 && (!book.pages || newPage <= book.pages)) {
      const updates: any = { 
        currentPage: newPage, 
        format: selectedFormat 
      };
      
      // Calculate progress percentage
      const progressPercent = book.pages && book.pages > 0 
        ? Math.round((newPage / book.pages) * 100) 
        : 0;
      
      updates.progress = progressPercent;
      
      // If progress reaches 100%, automatically mark as finished
      if (progressPercent >= 100) {
        updates.status = 'finished';
        updates.finishDate = new Date().toISOString();
      }
      
      onUpdate(updates);
      onClose();
    }
  };

  const incrementPage = () => {
    const newPage = Math.min(book.pages || 999, parseInt(pageInput) + 1);
    handlePageChange(newPage.toString());
  };

  const decrementPage = () => {
    const newPage = Math.max(0, parseInt(pageInput) - 1);
    handlePageChange(newPage.toString());
  };

  const incrementPercent = () => {
    const newPercent = Math.min(100, parseInt(percentInput) + 1);
    handlePercentChange(newPercent.toString());
  };

  const decrementPercent = () => {
    const newPercent = Math.max(0, parseInt(percentInput) - 1);
    handlePercentChange(newPercent.toString());
  };

  const currentPercent = Math.min(100, Math.max(0, parseInt(percentInput) || 0));

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
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[340px] rounded-2xl shadow-2xl z-[101]"
            style={{
              backgroundColor: currentTheme.cardColor,
              borderColor: currentTheme.borderColor,
              borderWidth: '1px',
            }}
          >
            {/* Header */}
            <div 
              className="flex items-center justify-between p-4 border-b"
              style={{ borderColor: currentTheme.borderColor }}
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: getGradientBg() }}
                >
                  <Book className="w-4 h-4 text-white" />
                </div>
                <h3 
                  className="font-bold"
                  style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
                >
                  Update Progress
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg transition-colors"
                style={{
                  backgroundColor: currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                }}
              >
                <X 
                  className="w-5 h-5" 
                  style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                />
              </button>
            </div>

            {/* Content */}
            <div className="p-5">
              <p 
                className="text-sm mb-1 font-semibold line-clamp-1"
                style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
              >
                {book.title}
              </p>
              
              {/* Format Selection Buttons */}
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setSelectedFormat('physical')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all"
                  style={{
                    backgroundColor: selectedFormat === 'physical' 
                      ? (currentTheme.textColor === 'light' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.25)')
                      : (currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.1)'),
                    borderColor: selectedFormat === 'physical' ? '#3b82f6' : currentTheme.borderColor,
                    borderWidth: '1px',
                  }}
                >
                  <BookOpen className="w-3 h-3" style={{ color: selectedFormat === 'physical' ? '#3b82f6' : (currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280') }} />
                  <span 
                    className="text-[10px] font-semibold" 
                    style={{ color: selectedFormat === 'physical' ? '#3b82f6' : (currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280') }}
                  >
                    Physical
                  </span>
                </button>
                
                <button
                  onClick={() => setSelectedFormat('ebook')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all"
                  style={{
                    backgroundColor: selectedFormat === 'ebook' 
                      ? (currentTheme.textColor === 'light' ? 'rgba(168, 85, 247, 0.3)' : 'rgba(168, 85, 247, 0.25)')
                      : (currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.1)'),
                    borderColor: selectedFormat === 'ebook' ? '#a855f7' : currentTheme.borderColor,
                    borderWidth: '1px',
                  }}
                >
                  <Smartphone className="w-3 h-3" style={{ color: selectedFormat === 'ebook' ? '#a855f7' : (currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280') }} />
                  <span 
                    className="text-[10px] font-semibold" 
                    style={{ color: selectedFormat === 'ebook' ? '#a855f7' : (currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280') }}
                  >
                    eBook
                  </span>
                </button>
                
                <button
                  onClick={() => setSelectedFormat('audiobook')}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all"
                  style={{
                    backgroundColor: selectedFormat === 'audiobook' 
                      ? (currentTheme.textColor === 'light' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.25)')
                      : (currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.1)'),
                    borderColor: selectedFormat === 'audiobook' ? '#22c55e' : currentTheme.borderColor,
                    borderWidth: '1px',
                  }}
                >
                  <Headphones className="w-3 h-3" style={{ color: selectedFormat === 'audiobook' ? '#22c55e' : (currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280') }} />
                  <span 
                    className="text-[10px] font-semibold" 
                    style={{ color: selectedFormat === 'audiobook' ? '#22c55e' : (currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280') }}
                  >
                    Audio
                  </span>
                </button>
              </div>
              
              <p 
                className="text-xs mb-4"
                style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
              >
                Total: {book.pages || 0} pages
              </p>

              {/* Warning when book has no pages */}
              {(!book.pages || book.pages === 0) && (
                <div 
                  className="mb-4 p-3 rounded-lg"
                  style={{
                    backgroundColor: 'rgba(245, 158, 11, 0.2)',
                    borderColor: 'rgba(245, 158, 11, 0.4)',
                    borderWidth: '1px',
                  }}
                >
                  <p className="text-xs text-amber-200">
                    ⚠️ This book has no page count. Please edit the book details to add pages for accurate progress tracking.
                  </p>
                </div>
              )}

              {/* Toggle Tabs */}
              <div 
                className="flex rounded-lg p-1 mb-4"
                style={{ backgroundColor: currentTheme.backgroundColor }}
              >
                <button
                  onClick={() => setInputMode('pages')}
                  className="flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-all"
                  style={{
                    background: inputMode === 'pages' ? getGradientBg() : 'transparent',
                    color: inputMode === 'pages' ? '#ffffff' : (currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280')
                  }}
                >
                  Pages
                </button>
                <button
                  onClick={() => setInputMode('percent')}
                  className="flex-1 py-2 px-3 rounded-md text-sm font-semibold transition-all"
                  style={{
                    background: inputMode === 'percent' ? getGradientBg() : 'transparent',
                    color: inputMode === 'percent' ? '#ffffff' : (currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280')
                  }}
                >
                  Percentage
                </button>
              </div>

              {/* Input Field */}
              {inputMode === 'pages' ? (
                <div>
                  <label 
                    className="block text-sm font-semibold mb-2"
                    style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
                  >
                    Current Page
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max={book.pages}
                      value={pageInput}
                      onChange={(e) => handlePageChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSubmit();
                      }}
                      className="w-full rounded-xl px-4 py-3 pr-14 text-lg font-bold focus:outline-none transition-colors"
                      style={{
                        backgroundColor: currentTheme.backgroundColor,
                        borderColor: currentTheme.borderColor,
                        borderWidth: '1px',
                        color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827',
                      }}
                      placeholder="0"
                      autoFocus
                    />
                    
                    {/* Up/Down buttons */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
                      <button
                        onClick={incrementPage}
                        className="p-1.5 rounded-md transition-colors"
                        style={{ 
                          backgroundColor: currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
                        }}
                      >
                        <ChevronUp className="w-3.5 h-3.5" style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }} />
                      </button>
                      <button
                        onClick={decrementPage}
                        className="p-1.5 rounded-md transition-colors"
                        style={{ 
                          backgroundColor: currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
                        }}
                      >
                        <ChevronDown className="w-3.5 h-3.5" style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label 
                    className="block text-sm font-semibold mb-2"
                    style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
                  >
                    Progress Percentage
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={percentInput}
                      onChange={(e) => handlePercentChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSubmit();
                      }}
                      className="w-full rounded-xl px-4 py-3 pr-16 text-lg font-bold focus:outline-none transition-colors"
                      style={{
                        backgroundColor: currentTheme.backgroundColor,
                        borderColor: currentTheme.borderColor,
                        borderWidth: '1px',
                        color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827',
                      }}
                      placeholder="0"
                      autoFocus
                    />
                    <span 
                      className="absolute right-12 top-1/2 -translate-y-1/2 text-lg font-bold"
                      style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                    >
                      %
                    </span>
                    
                    {/* Up/Down buttons */}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
                      <button
                        onClick={incrementPercent}
                        className="p-1.5 rounded-md transition-colors"
                        style={{ 
                          backgroundColor: currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
                        }}
                      >
                        <ChevronUp className="w-3.5 h-3.5" style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }} />
                      </button>
                      <button
                        onClick={decrementPercent}
                        className="p-1.5 rounded-md transition-colors"
                        style={{ 
                          backgroundColor: currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
                        }}
                      >
                        <ChevronDown className="w-3.5 h-3.5" style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-2 flex items-center justify-between text-xs">
                <span style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}>
                  {inputMode === 'pages' ? 'Progress:' : 'Current:'}
                </span>
                <span className="font-bold" style={{ color: currentTheme.primary }}>
                  {inputMode === 'pages' 
                    ? `${currentPercent}%`
                    : `${pageInput} / ${book.pages || 0}`
                  }
                </span>
              </div>

              {/* Progress Bar */}
              <div 
                className="mt-3 h-2 rounded-full overflow-hidden"
                style={{ 
                  backgroundColor: currentTheme.textColor === 'light' 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : 'rgba(0, 0, 0, 0.1)' 
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${currentPercent}%` }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                  style={{ background: getGradientBg() }}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2 mt-5">
                <button
                  onClick={onClose}
                  className="flex-1 font-bold py-3 rounded-xl transition-colors"
                  style={{
                    backgroundColor: currentTheme.backgroundColor,
                    color: currentTheme.textColor === 'light' ? '#d1d5db' : '#6b7280',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!pageInput || parseInt(pageInput) < 0 || (book.pages && parseInt(pageInput) > book.pages)}
                  className="flex-1 text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                  style={{ background: getGradientBg() }}
                >
                  Update
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}