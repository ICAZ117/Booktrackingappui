import { Plus, BookOpen, X, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogReading: (data: { pages: number; minutes: number; book: string }) => void;
  currentlyReadingBooks?: { id: string; title: string; progress: number; currentPage: number; pages: number; author?: string; cover?: string }[];
}

export function QuickLogModal({ isOpen, onClose, onLogReading, currentlyReadingBooks = [] }: QuickLogModalProps) {
  const { currentTheme } = useTheme();
  const [currentPage, setCurrentPage] = useState('');
  const [percentage, setPercentage] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [progressMode, setProgressMode] = useState<'pages' | 'percentage'>('pages');

  // Set default selected book when modal opens or books change
  useEffect(() => {
    if (isOpen && currentlyReadingBooks.length > 0) {
      const firstBook = currentlyReadingBooks[0];
      setSelectedBook(firstBook.title);
      // Pre-populate with current progress
      setCurrentPage(firstBook.currentPage.toString());
      setPercentage(Math.round(firstBook.progress).toString());
    }
  }, [isOpen, currentlyReadingBooks]);

  // Update when selected book changes
  useEffect(() => {
    if (selectedBook) {
      const book = currentlyReadingBooks.find(b => b.title === selectedBook);
      if (book) {
        setCurrentPage(book.currentPage.toString());
        setPercentage(Math.round(book.progress).toString());
      }
    }
  }, [selectedBook, currentlyReadingBooks]);

  const getGradientBg = () => {
    return currentTheme.isGradient
      ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
      : currentTheme.primary;
  };

  const handleUpdate = () => {
    const selectedBookData = currentlyReadingBooks.find(b => b.title === selectedBook);
    if (!selectedBookData) return;
    
    let targetPage = 0;
    let targetPercentage = 0;
    
    if (progressMode === 'pages') {
      targetPage = parseInt(currentPage) || 0;
      targetPercentage = Math.round((targetPage / selectedBookData.pages) * 100);
    } else {
      targetPercentage = parseInt(percentage) || 0;
      targetPage = Math.round((targetPercentage / 100) * selectedBookData.pages);
    }
    
    // Calculate pages read in this session
    const pagesRead = Math.max(0, targetPage - selectedBookData.currentPage);
    
    onLogReading({
      pages: pagesRead,
      minutes: 0, // No minutes tracking in this modal
      book: selectedBook,
      bookId: selectedBookData.id,
      targetPage: targetPage,
      targetPercentage: targetPercentage
    } as any);
    
    onClose();
  };

  const incrementPage = () => {
    const book = currentlyReadingBooks.find(b => b.title === selectedBook);
    if (!book) return;
    const newPage = Math.min(book.pages, parseInt(currentPage) + 1);
    setCurrentPage(newPage.toString());
    setPercentage(Math.round((newPage / book.pages) * 100).toString());
  };

  const decrementPage = () => {
    const newPage = Math.max(0, parseInt(currentPage) - 1);
    setCurrentPage(newPage.toString());
    const book = currentlyReadingBooks.find(b => b.title === selectedBook);
    if (book) {
      setPercentage(Math.round((newPage / book.pages) * 100).toString());
    }
  };

  const handlePageChange = (value: string) => {
    const book = currentlyReadingBooks.find(b => b.title === selectedBook);
    if (!book) return;
    const page = Math.min(book.pages, Math.max(0, parseInt(value) || 0));
    setCurrentPage(page.toString());
    setPercentage(Math.round((page / book.pages) * 100).toString());
  };

  const handlePercentageChange = (value: string) => {
    const book = currentlyReadingBooks.find(b => b.title === selectedBook);
    if (!book) return;
    const pct = Math.min(100, Math.max(0, parseInt(value) || 0));
    setPercentage(pct.toString());
    setCurrentPage(Math.round((pct / 100) * book.pages).toString());
  };

  if (!isOpen) return null;

  const selectedBookData = currentlyReadingBooks.find(b => b.title === selectedBook);
  if (!selectedBookData) return null;

  const displayPercentage = progressMode === 'pages' 
    ? Math.round((parseInt(currentPage) / selectedBookData.pages) * 100)
    : parseInt(percentage);

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
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 rounded-2xl z-50 overflow-hidden shadow-2xl max-w-md mx-auto"
            style={{ backgroundColor: currentTheme.cardColor }}
          >
            {/* Currently Reading Header */}
            <div className="p-5 border-b" style={{ borderColor: currentTheme.borderColor }}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold" style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}>
                  Currently Reading
                </h2>
                <button
                  className="text-xs font-semibold px-3 py-1 rounded-lg"
                  style={{ color: currentTheme.primary }}
                >
                  View All
                </button>
              </div>

              {/* Book Card */}
              <div 
                className="p-3 rounded-xl"
                style={{ backgroundColor: currentTheme.backgroundColor }}
              >
                <div className="flex gap-3">
                  {/* Book Cover */}
                  {selectedBookData.cover && (
                    <img 
                      src={selectedBookData.cover} 
                      alt={selectedBookData.title}
                      className="w-16 h-24 rounded-lg object-cover flex-shrink-0"
                    />
                  )}
                  
                  {/* Book Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold mb-0.5 truncate" style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}>
                      {selectedBookData.title}
                    </h3>
                    <p className="text-xs mb-2" style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}>
                      {selectedBookData.author || 'Unknown Author'}
                    </p>
                    <p className="text-xs mb-1.5" style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}>
                      {selectedBookData.currentPage} / {selectedBookData.pages} pages
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}>
                        <div 
                          className="h-full rounded-full transition-all duration-300"
                          style={{ 
                            width: `${selectedBookData.progress}%`,
                            background: getGradientBg(),
                          }}
                        />
                      </div>
                      <span className="text-xs font-bold" style={{ color: currentTheme.primary }}>
                        {Math.round(selectedBookData.progress)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Update Form */}
            <div className="p-5 space-y-4">
              {/* Mode Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setProgressMode('pages')}
                  className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all"
                  style={{
                    background: progressMode === 'pages' ? getGradientBg() : currentTheme.backgroundColor,
                    color: progressMode === 'pages' ? '#ffffff' : (currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af'),
                  }}
                >
                  Pages
                </button>
                <button
                  onClick={() => setProgressMode('percentage')}
                  className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all"
                  style={{
                    background: progressMode === 'percentage' ? getGradientBg() : currentTheme.backgroundColor,
                    color: progressMode === 'percentage' ? '#ffffff' : (currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af'),
                  }}
                >
                  Percentage
                </button>
              </div>

              {/* Input Field */}
              <div>
                <label className="text-sm font-semibold mb-2 block" style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}>
                  {progressMode === 'pages' ? 'Current Page' : 'Current Percentage'}
                </label>
                
                <div className="relative">
                  <input
                    type="number"
                    value={progressMode === 'pages' ? currentPage : percentage}
                    onChange={(e) => progressMode === 'pages' 
                      ? handlePageChange(e.target.value)
                      : handlePercentageChange(e.target.value)
                    }
                    className="w-full px-5 py-3.5 rounded-xl text-3xl font-bold focus:outline-none focus:ring-2 pr-14"
                    style={{ 
                      backgroundColor: currentTheme.backgroundColor,
                      color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827',
                      outlineColor: currentTheme.primary,
                    }}
                  />
                  
                  {/* Up/Down buttons */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
                    <button
                      onClick={progressMode === 'pages' ? incrementPage : () => handlePercentageChange((parseInt(percentage) + 1).toString())}
                      className="p-1.5 rounded-md transition-colors"
                      style={{ 
                        backgroundColor: currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)',
                      }}
                    >
                      <ChevronUp className="w-3.5 h-3.5" style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }} />
                    </button>
                    <button
                      onClick={progressMode === 'pages' ? decrementPage : () => handlePercentageChange((parseInt(percentage) - 1).toString())}
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

              {/* Updated Progress Display */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm" style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}>
                    Progress:
                  </span>
                  <span className="text-lg font-bold" style={{ color: currentTheme.primary }}>
                    {displayPercentage}%
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }}>
                  <div 
                    className="h-full rounded-full transition-all duration-300"
                    style={{ 
                      width: `${displayPercentage}%`,
                      background: getGradientBg(),
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-1">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl text-sm font-bold transition-all"
                  style={{ 
                    backgroundColor: currentTheme.backgroundColor,
                    color: currentTheme.textColor === 'light' ? '#d1d5db' : '#6b7280',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-lg"
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