import { X, Star, Calendar, BookOpen, Clock, Tag, Edit2, Trash2, Share2, Image, Play, Pause, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { BookCover } from './BookCover';
import { useTheme } from '../contexts/ThemeContext';

interface BookDetailModalProps {
  book: {
    title: string;
    author: string;
    cover: string;
    rating?: number;
    progress?: number;
    pages?: number;
    currentPage?: number;
    startDate?: string;
    finishDate?: string;
    genre?: string;
    notes?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onUpdateRating?: (rating: number) => void;
  onMoveShelf?: (shelf: string) => void;
  onUpdateCover?: (coverUrl: string) => void;
}

export function BookDetailModal({ book, isOpen, onClose, onUpdateRating, onMoveShelf, onUpdateCover }: BookDetailModalProps) {
  const [rating, setRating] = useState(book.rating || 0);
  const [notes, setNotes] = useState(book.notes || '');
  const [showCoverInput, setShowCoverInput] = useState(false);
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const { currentTheme } = useTheme();

  // Update Progress State
  const [progressMode, setProgressMode] = useState<'pages' | 'percent'>('pages');
  const [currentPage, setCurrentPage] = useState(book.currentPage || 0);
  const [percentComplete, setPercentComplete] = useState(book.progress || 0);

  // Reading Timer State
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const intervalRef = useRef<number | null>(null);

  // Timer Logic
  useEffect(() => {
    if (isTimerRunning) {
      intervalRef.current = window.setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTimerRunning]);

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Save reading session
  const saveReadingSession = () => {
    if (elapsedSeconds > 0) {
      const today = new Date().toISOString().split('T')[0];
      const sessions = JSON.parse(localStorage.getItem('readingSessions') || '[]');
      
      sessions.push({
        date: today,
        bookTitle: book.title,
        minutes: Math.round(elapsedSeconds / 60),
        timestamp: new Date().toISOString()
      });
      
      localStorage.setItem('readingSessions', JSON.stringify(sessions));
      console.log('⏱️ Reading session saved:', Math.round(elapsedSeconds / 60), 'minutes');
    }
  };

  // Stop and save timer
  const handleStopTimer = () => {
    setIsTimerRunning(false);
    saveReadingSession();
    setElapsedSeconds(0);
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 top-20 bottom-20 bg-white rounded-3xl z-50 overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4 z-10">
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/20 backdrop-blur-sm ml-auto block"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="h-full overflow-y-auto">
              {/* Cover Section */}
              <div 
                className="relative h-64"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.primary}1A 0%, ${currentTheme.secondary}1A 100%)`
                }}
              >
                <BookCover
                  src={book.cover}
                  alt={book.title}
                  className="w-40 h-60 object-cover rounded-xl shadow-2xl absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
                />
                
                {/* Change Cover Button */}
                <button
                  onClick={() => setShowCoverInput(!showCoverInput)}
                  className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white transition-all active:scale-95"
                  title="Change book cover - Paste any image URL"
                >
                  <Image className="w-4 h-4 text-gray-700" />
                </button>
              </div>

              {/* Cover URL Input (if shown) */}
              {showCoverInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 pt-4"
                >
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="text-sm font-semibold text-gray-900 mb-2">📸 Add Custom Cover</div>
                    <div className="text-xs text-gray-600 mb-3">
                      <p className="mb-1">Paste any image URL from:</p>
                      <ul className="list-disc list-inside space-y-0.5 text-gray-500">
                        <li>Amazon (right-click on cover → Copy Image Address)</li>
                        <li>Goodreads book pages</li>
                        <li>Google Images (View Image → copy URL)</li>
                      </ul>
                    </div>
                    <input
                      type="url"
                      value={customCoverUrl}
                      onChange={(e) => setCustomCoverUrl(e.target.value)}
                      placeholder="https://example.com/book-cover.jpg"
                      className="w-full px-3 py-2 rounded-lg border border-blue-300 focus:border-blue-500 focus:outline-none text-sm mb-3"
                    />
                    
                    {/* Preview */}
                    {customCoverUrl && (
                      <div className="mb-3 text-center">
                        <div className="text-xs text-gray-600 mb-2">Preview:</div>
                        <img 
                          src={customCoverUrl} 
                          alt="Preview" 
                          className="w-24 h-36 object-cover rounded-lg mx-auto border-2 border-blue-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          if (customCoverUrl && onUpdateCover) {
                            onUpdateCover(customCoverUrl);
                            setShowCoverInput(false);
                            setCustomCoverUrl('');
                          }
                        }}
                        disabled={!customCoverUrl}
                        className="flex-1 text-white rounded-lg px-4 py-2 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        style={{
                          background: customCoverUrl 
                            ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
                            : '#d1d5db'
                        }}
                      >
                        Save Cover
                      </button>
                      <button
                        onClick={() => {
                          setShowCoverInput(false);
                          setCustomCoverUrl('');
                        }}
                        className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-300 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Content */}
              <div className={`px-6 pb-6 space-y-6 ${showCoverInput ? 'pt-4' : 'pt-36'}`}>
                {/* Title & Author */}
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{book.title}</h2>
                  <p className="text-gray-600">{book.author}</p>
                </div>

                {/* Rating */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="text-sm text-gray-600 mb-2 text-center">Your Rating</div>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => {
                          setRating(star);
                          onUpdateRating?.(star);
                        }}
                        className="transition-transform active:scale-125"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= rating
                              ? 'text-amber-500 fill-amber-500'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Progress Bar (if currently reading) */}
                {book.progress !== undefined && (
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-bold text-gray-900">{book.progress}%</span>
                    </div>
                    <div className="h-3 bg-white rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${book.progress}%` }}
                        className="h-full"
                        style={{
                          background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-2 text-center">
                      Page {book.currentPage || 0} of {book.pages || 0}
                    </div>
                  </div>
                )}

                {/* UPDATE PROGRESS */}
                <div 
                  className="rounded-2xl p-5"
                  style={{
                    background: `linear-gradient(135deg, ${currentTheme.primary}15 0%, ${currentTheme.secondary}15 100%)`,
                    border: `2px solid ${currentTheme.primary}30`
                  }}
                >
                  <div className="text-base font-bold text-gray-900 mb-4">Update Progress</div>
                  
                  {/* Toggle Tabs */}
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setProgressMode('pages')}
                      className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all"
                      style={{
                        background: progressMode === 'pages'
                          ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
                          : '#f3f4f6',
                        color: progressMode === 'pages' ? 'white' : '#6b7280'
                      }}
                    >
                      Pages
                    </button>
                    <button
                      onClick={() => setProgressMode('percent')}
                      className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all"
                      style={{
                        background: progressMode === 'percent'
                          ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
                          : '#f3f4f6',
                        color: progressMode === 'percent' ? 'white' : '#6b7280'
                      }}
                    >
                      Percentage
                    </button>
                  </div>

                  {/* Pages Mode */}
                  {progressMode === 'pages' && (
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Current Page</label>
                      <div className="flex items-center gap-3 mb-4">
                        <input
                          type="number"
                          value={currentPage}
                          onChange={(e) => setCurrentPage(Number(e.target.value))}
                          className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#3298ff] focus:outline-none text-center text-xl font-bold"
                        />
                        <span className="text-gray-400 text-lg">/</span>
                        <div className="flex-1 px-4 py-3 rounded-xl bg-gray-100 text-center text-xl font-bold text-gray-700">
                          {book.pages || 0}
                        </div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mb-3">
                        <span>Progress:</span>
                        <span className="font-bold" style={{ color: currentTheme.primary }}>
                          {book.pages && book.pages > 0 ? Math.round((currentPage / book.pages) * 100) : 0}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                        <div
                          className="h-full transition-all duration-300"
                          style={{
                            width: `${book.pages && book.pages > 0 ? Math.min(Math.max(0, (currentPage / book.pages) * 100), 100) : 0}%`,
                            background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Percent Mode */}
                  {progressMode === 'percent' && (
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Completion Percentage</label>
                      <div className="mb-4">
                        <input
                          type="number"
                          value={percentComplete}
                          onChange={(e) => setPercentComplete(Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
                          min="0"
                          max="100"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#3298ff] focus:outline-none text-center text-xl font-bold"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mb-3">
                        <span>Progress:</span>
                        <span className="font-bold" style={{ color: currentTheme.primary }}>
                          {isNaN(percentComplete) ? 0 : percentComplete}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                        <div
                          className="h-full transition-all duration-300"
                          style={{
                            width: `${Math.min(100, Math.max(0, percentComplete || 0))}%`,
                            background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Update Button */}
                  <button
                    className="w-full py-3 px-4 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
                    }}
                  >
                    Update Progress
                  </button>
                </div>

                {/* Reading Timer - Compact */}
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span className="text-xs font-semibold text-gray-700">Reading Timer:</span>
                      <span className="text-sm font-bold text-gray-900 font-mono">{formatTime(elapsedSeconds)}</span>
                    </div>
                    
                    <div className="flex gap-1.5">
                      {!isTimerRunning ? (
                        <button
                          onClick={() => setIsTimerRunning(true)}
                          className="py-1.5 px-3 text-white font-semibold rounded-lg text-xs flex items-center gap-1"
                          style={{
                            background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
                          }}
                        >
                          <Play className="w-3 h-3" />
                          Start
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => setIsTimerRunning(false)}
                            className="py-1.5 px-2.5 bg-yellow-500 text-white font-semibold rounded-lg text-xs"
                          >
                            <Pause className="w-3 h-3" />
                          </button>
                          <button
                            onClick={handleStopTimer}
                            className="py-1.5 px-2.5 bg-red-500 text-white font-semibold rounded-lg text-xs"
                          >
                            <Square className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {book.startDate && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs">Started</span>
                      </div>
                      <div className="font-bold text-gray-900">{book.startDate}</div>
                    </div>
                  )}
                  {book.finishDate && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs">Finished</span>
                      </div>
                      <div className="font-bold text-gray-900">{book.finishDate}</div>
                    </div>
                  )}
                  {book.pages && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-xs">Pages</span>
                      </div>
                      <div className="font-bold text-gray-900">{book.pages}</div>
                    </div>
                  )}
                  {book.genre && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-2 text-gray-600 mb-1">
                        <Tag className="w-4 h-4" />
                        <span className="text-xs">Genre</span>
                      </div>
                      <div className="font-bold text-gray-900">{book.genre}</div>
                    </div>
                  )}
                </div>

                {/* Notes Section */}
                <div className="bg-gray-50 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-gray-900">My Notes</span>
                    <Edit2 className="w-4 h-4 text-gray-400" />
                  </div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add your thoughts about this book..."
                    className="w-full bg-white rounded-xl p-3 text-sm text-gray-700 border border-gray-200 focus:border-[#3298ff] focus:outline-none resize-none"
                    rows={4}
                  />
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    className="text-white rounded-xl p-3 font-semibold text-sm flex flex-col items-center gap-1"
                    style={{
                      background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit</span>
                  </button>
                  <button className="bg-gray-100 text-gray-700 rounded-xl p-3 font-semibold text-sm flex flex-col items-center gap-1">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  <button className="bg-red-50 text-red-600 rounded-xl p-3 font-semibold text-sm flex flex-col items-center gap-1">
                    <Trash2 className="w-4 h-4" />
                    <span>Remove</span>
                  </button>
                </div>

                {/* Move to Shelf */}
                <div>
                  <div className="text-sm font-bold text-gray-900 mb-2">Move to Shelf</div>
                  <div className="flex gap-2 flex-wrap">
                    {['Favorites', 'Want to Read', 'DNF', 'Best of 2026'].map((shelf) => (
                      <button
                        key={shelf}
                        onClick={() => onMoveShelf?.(shelf)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold hover:bg-gray-200 transition-colors"
                      >
                        {shelf}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}