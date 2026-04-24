import { ArrowLeft, Star, Calendar, BookOpen, Clock, Tag, Edit2, Trash2, Share2, Plus, Minus, ChevronDown, ChevronRight, TrendingUp, Award, Heart, Bookmark, BarChart3, Users, Zap, Target, Flame, ThumbsUp, ThumbsDown, MessageCircle, AlertCircle, Check, Smartphone, Headphones } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useMemo } from 'react';
import { BookCover } from './BookCover';
import { useTheme } from '../contexts/ThemeContext';
import { useBooks } from '../contexts/BooksContext';

// Cache-bust: Audiobook percentage mode syncs all data - v3.0
// AUDIOBOOK UPDATES (v3.0):
// - When Audio format is selected, shows "Minutes" and "Percentage" toggle options
// - Percentage mode properly syncs currentMinutes for audiobooks
// - Minutes mode properly syncs progress percentage
// - When switching to audiobook format, auto-initializes audioDuration and currentMinutes
// - All audio data stays in sync across the app
interface BookDetailPageProps {
  book: {
    id?: string;
    title: string;
    author: string;
    cover: string;
    status?: string;
    rating?: number;
    progress?: number;
    pages?: number;
    currentPage?: number;
    currentMinutes?: number; // For audiobook progress
    audioDuration?: number; // Total duration in minutes for audiobooks
    startDate?: string;
    finishDate?: string;
    genre?: string;
    notes?: string;
    format?: string;
    publisher?: string;
    yearPublished?: string;
    description?: string;
    categories?: string[]; // From Google Books API
    averageRating?: number; // From Google Books API
    ratingsCount?: number; // From Google Books API
    stats?: {
      pacing?: string;
      recommend?: string;
      rereadability?: string;
      characterDevelopment?: string;
      plotTwists?: string;
    };
  };
  onBack: () => void;
  onUpdateBook?: (updates: any) => void;
  onBookFinished?: (book: any) => void;
}

type DraftLogEntry = {
  id: string;
  date: string;
  mode: 'amount' | 'percent';
  value: string;
};

export function BookDetailPage({ book, onBack, onUpdateBook, onBookFinished }: BookDetailPageProps) {
  const { currentTheme } = useTheme();
  const { bookshelves, updateBookshelves, addBook, updateBook, logReadingSession, readingSessions } = useBooks();
  
  // Load custom shelves from localStorage
  const [customShelves, setCustomShelves] = useState<any[]>([]);
  
  useEffect(() => {
    const savedShelves = localStorage.getItem('readtrack_custom_shelves');
    if (savedShelves) {
      setCustomShelves(JSON.parse(savedShelves));
    }
  }, []);
  
  // Helper to generate dynamic gradient classes
  const dynamicGradient = currentTheme.isGradient
    ? currentTheme.tertiary
      ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.tertiary} 50%, ${currentTheme.secondary} 100%)`
      : `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
    : currentTheme.primary;
  
  // Helper for conditional gradient button styling
  const getButtonStyle = (isActive: boolean) => ({
    background: isActive ? dynamicGradient : currentTheme.backgroundColor,
    color: isActive ? '#ffffff' : (currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280')
  });
  
  const [rating, setRating] = useState(book.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showRatingPicker, setShowRatingPicker] = useState(false);
  const [currentPage, setCurrentPage] = useState(() => {
    const initialPage = book.currentPage || 0;
    return isNaN(initialPage) ? 0 : Math.max(0, initialPage);
  });
  
  const [currentMinutes, setCurrentMinutes] = useState(() => {
    const initialMinutes = book.currentMinutes || 0;
    return isNaN(initialMinutes) ? 0 : Math.max(0, initialMinutes);
  });
  
  // Progress mode state - automatically set based on format
  const [progressMode, setProgressMode] = useState<'pages' | 'minutes' | 'percent'>(() => {
    return book.format === 'audiobook' ? 'minutes' : 'pages';
  });
  const [percentComplete, setPercentComplete] = useState(() => {
    const initialPercent = book.progress || 0;
    return isNaN(initialPercent) ? 0 : Math.min(100, Math.max(0, initialPercent));
  });
  
  const [showPercentage, setShowPercentage] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    description: false,
    moreOptions: false,
  });
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showCoverModal, setShowCoverModal] = useState(false);
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [finishModalData, setFinishModalData] = useState({
    rating: 0,
    pacing: '',
    recommend: '',
    rereadability: '',
    characterDevelopment: '',
    plotTwists: '',
    notes: '',
  });
  const [isFavorited, setIsFavorited] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showStatusDropdown2, setShowStatusDropdown2] = useState(false);
  const [showDnfDropdown, setShowDnfDropdown] = useState(false);
  const [showFinishedDropdown, setShowFinishedDropdown] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(() => {
    // Initialize based on book's actual status
    if (!book.status) return 'Want to Read';
    const statusMap: Record<string, string> = {
      'reading': 'Currently Reading',
      'currently-reading': 'Currently Reading',
      'want-to-read': 'Want to Read',
      'finished': 'Finished',
      'dnf': 'DNF',
      'on-hold': 'On Hold',
    };
    return statusMap[book.status] || 'Want to Read';
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showShelfModal, setShowShelfModal] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [isOwned, setIsOwned] = useState(false);
  const [startDate, setStartDate] = useState(book.startDate || '');
  const [finishDate, setFinishDate] = useState(book.finishDate || '');
  const [tempStartYear, setTempStartYear] = useState('');
  const [tempStartMonth, setTempStartMonth] = useState('');
  const [tempStartDay, setTempStartDay] = useState('');
  const [tempFinishYear, setTempFinishYear] = useState('');
  const [tempFinishMonth, setTempFinishMonth] = useState('');
  const [tempFinishDay, setTempFinishDay] = useState('');
  const [tempLogEntries, setTempLogEntries] = useState<DraftLogEntry[]>([]);
  const [tempReview, setTempReview] = useState(book.notes || '');
  const [tempReviewRating, setTempReviewRating] = useState(book.rating || 0);

  const readingLogsForBook = useMemo(() => {
    if (!book.id) return [];
    return readingSessions
      .filter((session) => session.bookId === book.id)
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 8);
  }, [readingSessions, book.id]);

  // Sync dates with book prop
  useEffect(() => {
    if (book.startDate) {
      setStartDate(book.startDate);
    }
    if (book.finishDate) {
      setFinishDate(book.finishDate);
    }
  }, [book.startDate, book.finishDate]);

  const parseDateParts = (raw?: string) => {
    const value = (raw || '').trim();
    if (!value) return { year: '', month: '', day: '' };

    // YYYY-MM-DD or YYYY/MM/DD
    let match = value.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (match) {
      return {
        year: match[1],
        month: String(Number(match[2])),
        day: String(Number(match[3])),
      };
    }

    // Year only
    match = value.match(/^(\d{4})$/);
    if (match) {
      return { year: match[1], month: '', day: '' };
    }

    // Month-name formats like "Mar 26, 2026" / "March 26 2026" / "Mar, 2026"
    match = value.match(/^([A-Za-z]+)\s*(\d{1,2})?,?\s*(\d{4})$/);
    if (match) {
      const monthToken = match[1].slice(0, 3).toLowerCase();
      const monthOrder = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
      const monthIndex = monthOrder.indexOf(monthToken);
      return {
        year: match[3] || '',
        month: monthIndex >= 0 ? String(monthIndex + 1) : '',
        day: match[2] ? String(Number(match[2])) : '',
      };
    }

    // Last fallback with Date parser
    const fallback = new Date(value);
    if (!Number.isNaN(fallback.getTime())) {
      return {
        year: String(fallback.getFullYear()),
        month: String(fallback.getMonth() + 1),
        day: String(fallback.getDate()),
      };
    }

    return { year: '', month: '', day: '' };
  };

  const openReadingLogEditor = () => {
    const startParts = parseDateParts(startDate || book.startDate || '');
    const finishParts = parseDateParts(finishDate || book.finishDate || book.dateRead || '');

    setTempStartYear(startParts.year);
    setTempStartMonth(startParts.month);
    setTempStartDay(startParts.day);

    setTempFinishYear(finishParts.year);
    setTempFinishMonth(finishParts.month);
    setTempFinishDay(finishParts.day);

    setTempReview(book.notes || '');
    setTempReviewRating(book.rating || 0);
    setTempLogEntries([
      {
        id: `draft_${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        mode: 'amount',
        value: '',
      },
    ]);
    setShowDatePicker(true);
  };

  // Sync status with book's actual status
  useEffect(() => {
    if (!book.status) return;
    const statusMap: Record<string, string> = {
      'reading': 'Currently Reading',
      'currently-reading': 'Currently Reading',
      'want-to-read': 'Want to Read',
      'finished': 'Finished',
      'dnf': 'DNF',
      'on-hold': 'On Hold'
    };
    setCurrentStatus(statusMap[book.status] || 'Want to Read');
  }, [book.status]);

  // Check if book is in favorites shelf on mount
  useEffect(() => {
    if (book.id) {
      const favoritesShelf = bookshelves.find(s => s.id === 'favorites');
      if (favoritesShelf) {
        setIsFavorited(favoritesShelf.bookIds.includes(book.id));
      }
    }
  }, [book.id, bookshelves]);

  // Sync percentComplete with currentMinutes/currentPage whenever they change
  useEffect(() => {
    if (book.format === 'audiobook' && book.audioDuration && book.audioDuration > 0) {
      const calculatedPercent = Math.min(100, Math.max(0, Math.round((currentMinutes / book.audioDuration) * 100)));
      setPercentComplete(calculatedPercent);
    } else if (book.pages && book.pages > 0) {
      const calculatedPercent = Math.min(100, Math.max(0, Math.round((currentPage / book.pages) * 100)));
      setPercentComplete(calculatedPercent);
    }
  }, [currentMinutes, currentPage, book.format, book.audioDuration, book.pages]);

  // Toggle favorite status
  const toggleFavorite = () => {
    if (!book.id) return;

    const favoritesShelf = bookshelves.find(s => s.id === 'favorites');
    if (!favoritesShelf) return;

    const updatedShelves = bookshelves.map(shelf => {
      if (shelf.id === 'favorites') {
        const isCurrentlyFavorited = shelf.bookIds.includes(book.id!);
        return {
          ...shelf,
          bookIds: isCurrentlyFavorited
            ? shelf.bookIds.filter(id => id !== book.id)
            : [...shelf.bookIds, book.id!]
        };
      }
      return shelf;
    });

    updateBookshelves(updatedShelves);
    setIsFavorited(!isFavorited);
  };

  const progress = book.format === 'audiobook' 
    ? (book.audioDuration && book.audioDuration > 0 && currentMinutes >= 0
        ? Math.min(100, Math.max(0, Math.round((currentMinutes / book.audioDuration) * 100)))
        : 0)
    : (book.pages && book.pages > 0 && currentPage >= 0 
        ? Math.min(100, Math.max(0, Math.round((currentPage / book.pages) * 100)))
        : 0);
  const pagesLeft = (book.pages || 498) - currentPage;
  const minutesLeft = (book.audioDuration || 600) - currentMinutes;

  const handlePageUpdate = (increment: number) => {
    const newPage = Math.max(0, Math.min((book.pages || 498), currentPage + increment));
    setCurrentPage(newPage);
    onUpdateBook?.({ currentPage: newPage });
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleRatingSelect = (value: number) => {
    setRating(value);
    onUpdateBook?.({ rating: value });
    setShowRatingPicker(false);
  };

  // Render star with partial fill
  const renderStar = (position: number, currentRating: number) => {
    const fillPercentage = Math.max(0, Math.min(1, currentRating - position + 1)) * 100;
    
    if (fillPercentage === 0) {
      return <Star className="w-7 h-7 text-gray-700" />;
    } else if (fillPercentage === 100) {
      return <Star className="w-7 h-7 text-amber-500 fill-amber-500" />;
    } else {
      return (
        <div className="relative w-7 h-7">
          <Star className="w-7 h-7 text-gray-700 absolute" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercentage}%` }}>
            <Star className="w-7 h-7 text-amber-500 fill-amber-500" />
          </div>
        </div>
      );
    }
  };

  // Community stats - REMOVED PLACEHOLDER DATA
  // These would come from a community review service/API in a real app

  const bookDescription = book.description || "No description available.";

  return (
    <div 
      className="min-h-full relative"
      style={{ backgroundColor: currentTheme.cardColor }}
    >
      {/* Header */}
      <div 
        className="sticky top-0 z-20 border-b"
        style={{ 
          backgroundColor: currentTheme.cardColor,
          borderColor: currentTheme.borderColor,
        }}
      >
        <div className="px-4 py-3 flex items-center justify-between">
          <button
            onClick={onBack}
            className="p-2 rounded-full transition-colors"
            style={{
              backgroundColor: currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
            }}
          >
            <ArrowLeft className="w-5 h-5 text-gray-100" />
          </button>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleFavorite}
              className="p-2 rounded-full transition-colors"
              style={{
                backgroundColor: currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
              }}
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'text-rose-500 fill-rose-500' : 'text-gray-100'}`} />
            </button>
            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: book.title,
                    text: `Check out ${book.title} by ${book.author} on ReadTrack!`,
                  }).catch(() => {});
                } else {
                  alert('Copied link to clipboard!');
                }
              }}
              className="p-2 rounded-full transition-colors"
              style={{
                backgroundColor: currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
              }}
            >
              <Share2 className="w-5 h-5 text-gray-100" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="pb-6">
        {/* Book Info Section */}
        <div className="px-4 pt-4 pb-6">
          <div className="flex gap-4 mb-4">
            {/* Cover */}
            <div className="relative">
              <BookCover
                src={book.cover}
                alt={book.title}
                className="w-28 h-40 object-cover rounded-lg shadow-xl"
              />
              
              {/* Camera Icon Button for Cover Upload */}
              <button
                onClick={() => setShowCoverModal(true)}
                className="absolute -top-2 -right-2 p-1.5 rounded-full bg-white shadow-lg hover:scale-110 transition-transform active:scale-95"
                title="Change book cover"
              >
                <Edit2 className="w-3 h-3 text-gray-700" />
              </button>
            </div>
            
            {/* Info */}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-100 mb-1">{book.title}</h2>
              <p className="text-sm text-gray-400 mb-2">{book.author}</p>
              <p className="text-xs text-gray-500 mb-3">{book.pages || 498} pages • {book.yearPublished || '2023'}</p>
              
              {/* Quick Actions */}
              <div className="flex gap-2 relative">
                <button 
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="flex-1 text-white text-xs font-bold py-2 px-3 rounded-lg"
                  style={{
                    background: dynamicGradient
                  }}
                >
                  {book.id ? currentStatus : 'Add to Library'}
                </button>
                <button 
                  onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                  className="p-2 rounded-lg transition-colors"
                  style={{
                    backgroundColor: currentTheme.backgroundColor
                  }}
                >
                  <ChevronDown className="w-4 h-4 text-gray-300" />
                </button>
                
                {/* Status Dropdown Menu */}
                <AnimatePresence>
                  {showStatusDropdown && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowStatusDropdown(false)}
                        className="fixed inset-0 z-[100]"
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full mt-2 left-0 right-0 rounded-xl shadow-xl border overflow-hidden z-[110]"
                        style={{
                          backgroundColor: currentTheme.backgroundColor,
                          borderColor: currentTheme.borderColor,
                        }}
                      >
                        {['Currently Reading', 'Want to Read', 'Finished', 'Favorites', 'DNF', 'On Hold'].map((status) => (
                          <button
                            key={status}
                            onClick={async (e) => {
                              e.stopPropagation();
                              
                              // Generate book ID if it doesn't exist
                              const bookId = book.id || Date.now().toString();
                              const statusKeyRaw = status.toLowerCase().replace(/ /g, '-');
                              const statusKey = statusKeyRaw === 'currently-reading' ? 'reading' : statusKeyRaw;
                              
                              // If book doesn't exist, add it first
                              if (!book.id) {
                                await addBook({
                                  ...book,
                                  id: bookId,
                                  status: statusKey
                                });
                                // Update book object with new ID so subsequent operations work
                                book.id = bookId;
                              }
                              
                              // Special handling for Favorites shelf
                              if (status === 'Favorites') {
                                const favoritesShelf = bookshelves.find(s => s.id === 'favorites');
                                if (favoritesShelf) {
                                  const isAlreadyFavorited = favoritesShelf.bookIds.includes(bookId);
                                  
                                  if (!isAlreadyFavorited) {
                                    // Add to favorites
                                    const updatedShelves = bookshelves.map(shelf => 
                                      shelf.id === 'favorites' 
                                        ? { ...shelf, bookIds: [...shelf.bookIds, bookId] }
                                        : shelf
                                    );
                                    updateBookshelves(updatedShelves);
                                    setIsFavorited(true);
                                  }
                                }
                                setShowStatusDropdown(false);
                                return;
                              }
                              
                              // If marked as finished, trigger the finish flow (review + celebration)
                              if (status === 'Finished') {
                                // Instead of directly updating, trigger the finish modal
                                setShowFinishModal(true);
                                setShowStatusDropdown(false);
                                return; // Don't update immediately, wait for review submission
                              }
                              
                              // Update the book status
                              if (book.id) {
                                const statusUpdates: any = { status: statusKey };

                                // Reread flow: moving finished -> currently reading should reopen the book.
                                if (statusKey === 'reading') {
                                  statusUpdates.startDate = book.startDate || new Date().toISOString().split('T')[0];
                                  if (book.status === 'finished') {
                                    statusUpdates.progress = 0;
                                    statusUpdates.currentPage = 0;
                                    statusUpdates.currentMinutes = 0;
                                    statusUpdates.finishDate = '';
                                    statusUpdates.dateRead = '';
                                  }
                                }

                                // If book already exists, update it
                                await updateBook(bookId, statusUpdates);
                                onUpdateBook?.(statusUpdates);
                              }
                              
                              setCurrentStatus(status);
                              setShowStatusDropdown(false);
                              
                              // Now move the book to the correct shelf
                              // Map status to shelf ID
                              const statusToShelfMap: Record<string, string> = {
                                'want-to-read': 'want-to-read',
                                'dnf': 'dnf',
                              };
                              
                              const targetShelfId = statusToShelfMap[statusKey];
                              
                              if (targetShelfId) {
                                // Update shelves: add to target shelf, remove from others
                                const updatedShelves = bookshelves.map(shelf => {
                                  // Add to target shelf if not already there
                                  if (shelf.id === targetShelfId) {
                                    if (!shelf.bookIds.includes(bookId)) {
                                      return { ...shelf, bookIds: [...shelf.bookIds, bookId] };
                                    }
                                    return shelf;
                                  }
                                  // Remove from other status shelves
                                  if (shelf.id === 'want-to-read' || shelf.id === 'dnf') {
                                    return { ...shelf, bookIds: shelf.bookIds.filter(id => id !== bookId) };
                                  }
                                  return shelf;
                                });
                                
                                updateBookshelves(updatedShelves);
                              } else {
                                // For "Currently Reading" and "On Hold", just remove from want-to-read and dnf shelves
                                const updatedShelves = bookshelves.map(shelf => {
                                  if (shelf.id === 'want-to-read' || shelf.id === 'dnf') {
                                    return { ...shelf, bookIds: shelf.bookIds.filter(id => id !== bookId) };
                                  }
                                  return shelf;
                                });
                                
                                updateBookshelves(updatedShelves);
                              }
                            }}
                            className="w-full px-4 py-3 text-left text-sm text-gray-300 transition-colors"
                            style={{
                              backgroundColor: 'transparent'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            {status}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Community Reviews - Right below status button */}
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="flex items-center gap-1.5 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className="w-5 h-5 text-amber-500" 
                      style={{
                        fill: '#f59e0b'
                      }}
                    />
                  ))}
                  <span className="text-lg font-bold text-gray-300 ml-1">4.76 / 5</span>
                </div>
                <p className="text-[11px] text-gray-500">Average reader rating • 73,381 reviews</p>
              </div>
            </div>
          </div>

          {/* Format Selector */}
          <div className="mb-4">
            <div className="text-[9px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
              Format
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'physical', label: '📚 Physical' },
                { value: 'ebook', label: '📱 E-book' },
                { value: 'audiobook', label: '🎧 Audio' }
              ].map((format) => (
                <button
                  key={format.value}
                  onClick={() => {
                    const updates: any = { format: format.value };
                    
                    // When switching to audiobook, initialize audio fields if they don't exist
                    if (format.value === 'audiobook') {
                      setProgressMode('minutes');
                      
                      // Initialize audioDuration if not set (estimate from pages: 1 page ≈ 1.5 minutes)
                      if (!book.audioDuration && book.pages) {
                        updates.audioDuration = Math.round(book.pages * 1.5);
                      }
                      
                      // Initialize currentMinutes based on current progress
                      if (book.progress && updates.audioDuration) {
                        const estimatedMinutes = Math.round((book.progress / 100) * updates.audioDuration);
                        updates.currentMinutes = estimatedMinutes;
                        setCurrentMinutes(estimatedMinutes);
                      } else if (!book.currentMinutes) {
                        updates.currentMinutes = 0;
                        setCurrentMinutes(0);
                      }
                    } else if (progressMode === 'minutes') {
                      // Switch back to pages mode for non-audiobook formats
                      setProgressMode('pages');
                    }
                    
                    onUpdateBook?.(updates);
                  }}
                  className="px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-105"
                  style={{
                    background: book.format === format.value 
                      ? dynamicGradient
                      : currentTheme.backgroundColor,
                    color: book.format === format.value ? '#ffffff' : '#9ca3af',
                    border: book.format === format.value ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {format.label}
                </button>
              ))}
            </div>
          </div>

          {/* My Review - Only show if book is finished and has a rating */}
          {book.status === 'finished' && book.rating && book.rating > 0 && (
            <div className="mb-4">
              <div 
                className="rounded-xl p-4"
                style={{ backgroundColor: currentTheme.backgroundColor }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-gray-100 uppercase tracking-wide">My Review</h3>
                  <button 
                    onClick={() => {
                      // Pre-populate the modal with existing review data
                      setFinishModalData({
                        rating: book.rating || 0,
                        pacing: book.stats?.pacing || '',
                        recommend: book.stats?.recommend || '',
                        rereadability: book.stats?.rereadability || '',
                        characterDevelopment: book.stats?.characterDevelopment || '',
                        plotTwists: book.stats?.plotTwists || '',
                        notes: book.notes || ''
                      });
                      setShowFinishModal(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
                    style={{
                      backgroundColor: currentTheme.backgroundColor
                    }}
                  >
                    <Edit2 className="w-3 h-3 text-gray-300" />
                    <span className="text-[10px] font-semibold text-gray-300">Edit</span>
                  </button>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className="w-4 h-4 text-yellow-400" 
                        style={{
                          fill: star <= Math.floor(book.rating || 0) ? '#facc15' : star === Math.ceil(book.rating || 0) ? '#facc15' : 'none',
                          opacity: star === Math.ceil(book.rating || 0) && star > Math.floor(book.rating || 0) ? 0.5 : 1
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-bold" style={{
                    background: dynamicGradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>{book.rating}</span>
                </div>

                {/* Only show stats if they exist */}
                {book.stats && (
                  <div className="grid grid-cols-2 gap-2 text-[10px] mb-3">
                    {book.stats.pacing && (
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-3 h-3 text-emerald-500" />
                        <span className="text-gray-400">{book.stats.pacing}</span>
                      </div>
                    )}
                    {book.stats.recommend && (
                      <div className="flex items-center gap-1.5">
                        {book.stats.recommend === 'Recommend' ? (
                          <ThumbsUp className="w-3 h-3 text-emerald-500" />
                        ) : (
                          <ThumbsDown className="w-3 h-3 text-red-500" />
                        )}
                        <span className="text-gray-400">{book.stats.recommend}</span>
                      </div>
                    )}
                    {book.stats.rereadability && (
                      <div className="flex items-center gap-1.5">
                        <Target className="w-3 h-3 text-purple-500" />
                        <span className="text-gray-400">{book.stats.rereadability}</span>
                      </div>
                    )}
                    {book.stats.plotTwists && (
                      <div className="flex items-center gap-1.5">
                        <Flame className="w-3 h-3 text-purple-500" />
                        <span className="text-gray-400">{book.stats.plotTwists}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Written Review/Notes */}
                {book.notes && book.notes.trim() !== '' && (
                  <div className="mt-3 pt-3 border-t border-gray-700/50">
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {book.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Shelf Waistband - Horizontal scrollable strip */}
        <div className="px-4 pb-4">
          <div 
            className="rounded-xl p-4"
            style={{ backgroundColor: currentTheme.backgroundColor }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-gray-100 uppercase tracking-wide">Add to Shelf</h3>
              <button 
                onClick={() => setShowShelfModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
                style={{
                  background: dynamicGradient,
                  color: '#ffffff'
                }}
              >
                <span className="text-[10px] font-semibold">More</span>
              </button>
            </div>
            
            {/* Horizontal scrollable shelf pills */}
            <div className="overflow-x-auto scrollbar-hide -mx-1">
              <div className="flex gap-2 px-1 pb-1">
                {bookshelves.filter(shelf => shelf.id !== 'all-time-favorites').map((shelf) => {
                  const isOnShelf = book.id ? shelf.bookIds.includes(book.id) : false;
                  return (
                    <button
                      key={shelf.id}
                      onClick={() => {
                        if (!book.id) return;
                        
                        const updatedShelves = bookshelves.map(s => {
                          if (s.id === shelf.id) {
                            if (isOnShelf) {
                              return { ...s, bookIds: s.bookIds.filter(id => id !== book.id) };
                            } else {
                              return { ...s, bookIds: [...s.bookIds, book.id] };
                            }
                          }
                          return s;
                        });
                        
                        updateBookshelves(updatedShelves);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap text-xs font-medium transition-colors flex-shrink-0"
                      style={{
                        background: isOnShelf ? dynamicGradient : 'transparent',
                        color: isOnShelf ? '#ffffff' : '#9ca3af',
                        border: isOnShelf ? 'none' : '1px solid #4b5563'
                      }}
                    >
                      {isOnShelf && <Check className="w-3 h-3" />}
                      <span>{shelf.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Tracking - Prominent at top */}
        <div className="px-4 pb-6">
          <div 
            className="rounded-xl p-4"
            style={{ backgroundColor: currentTheme.backgroundColor }}
          >
            {/* Large Progress Bar with Percentage */}
            <div className="relative mb-3">
              <div 
                className="h-10 rounded-xl overflow-hidden flex items-center"
                style={{
                  backgroundColor: currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${isNaN(progress) ? 0 : Math.min(100, Math.max(0, progress))}%` }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-start px-4"
                >
                  <span className="text-lg font-bold text-white">{isNaN(progress) ? 0 : progress}%</span>
                </motion.div>
              </div>
            </div>

            {/* Reading Dates */}
            {(startDate || finishDate) && (
            <div className="space-y-2 mb-3">
              {startDate && (
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-400">Started</span>
                <span className="text-xs font-bold text-gray-200">{startDate}</span>
                <button 
                  onClick={openReadingLogEditor}
                  className="ml-auto p-1 rounded transition-colors"
                  style={{
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Edit2 className="w-3.5 h-3.5 text-gray-500" />
                </button>
              </div>
              )}
              
              {finishDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-400">Finished</span>
                  <span className="text-xs font-bold text-gray-200">{finishDate}</span>
                  {!startDate && (
                    <button
                      onClick={openReadingLogEditor}
                      className="ml-auto p-1 rounded transition-colors"
                      style={{ backgroundColor: 'transparent' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Edit2 className="w-3.5 h-3.5 text-gray-500" />
                    </button>
                  )}
                </div>
              )}
            </div>
            )}

            {/* Update Progress Section */}
            <div className="mb-3">
              <div 
                className="text-xs font-semibold mb-2 uppercase tracking-wide"
                style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
              >
                Update Progress
              </div>
              
              {/* Format Indicator */}
              <div className="flex gap-2 mb-3">
                {book.format === 'physical' && (
                  <div 
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md"
                    style={{
                      backgroundColor: currentTheme.textColor === 'light' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)',
                      borderColor: currentTheme.textColor === 'light' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.3)',
                      borderWidth: '1px',
                    }}
                  >
                    <BookOpen className="w-3 h-3" style={{ color: '#3b82f6' }} />
                    <span className="text-[10px] font-semibold" style={{ color: '#3b82f6' }}>Physical</span>
                  </div>
                )}
                {book.format === 'ebook' && (
                  <div 
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md"
                    style={{
                      backgroundColor: currentTheme.textColor === 'light' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(168, 85, 247, 0.15)',
                      borderColor: currentTheme.textColor === 'light' ? 'rgba(168, 85, 247, 0.4)' : 'rgba(168, 85, 247, 0.3)',
                      borderWidth: '1px',
                    }}
                  >
                    <Smartphone className="w-3 h-3" style={{ color: '#a855f7' }} />
                    <span className="text-[10px] font-semibold" style={{ color: '#a855f7' }}>eBook</span>
                  </div>
                )}
                {book.format === 'audiobook' && (
                  <div 
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md"
                    style={{
                      backgroundColor: currentTheme.textColor === 'light' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.15)',
                      borderColor: currentTheme.textColor === 'light' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(34, 197, 94, 0.3)',
                      borderWidth: '1px',
                    }}
                  >
                    <Headphones className="w-3 h-3" style={{ color: '#22c55e' }} />
                    <span className="text-[10px] font-semibold" style={{ color: '#22c55e' }}>Audiobook</span>
                  </div>
                )}
              </div>
              
              {/* Toggle Tabs */}
              <div className="flex gap-2 mb-3">
                {book.format === 'audiobook' ? (
                  <>
                    <button
                      onClick={() => setProgressMode('minutes')}
                      className="flex-1 py-2 px-3 rounded-lg font-semibold text-xs transition-all"
                      style={{
                        background: progressMode === 'minutes' ? dynamicGradient : currentTheme.backgroundColor,
                        color: progressMode === 'minutes' ? 'white' : (currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280')
                      }}
                    >
                      Minutes
                    </button>
                    <button
                      onClick={() => setProgressMode('percent')}
                      className="flex-1 py-2 px-3 rounded-lg font-semibold text-xs transition-all"
                      style={{
                        background: progressMode === 'percent' ? dynamicGradient : currentTheme.backgroundColor,
                        color: progressMode === 'percent' ? 'white' : (currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280')
                      }}
                    >
                      Percentage
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setProgressMode('pages')}
                      className="flex-1 py-2 px-3 rounded-lg font-semibold text-xs transition-all"
                      style={{
                        background: progressMode === 'pages' ? dynamicGradient : currentTheme.backgroundColor,
                        color: progressMode === 'pages' ? 'white' : (currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280')
                      }}
                    >
                      Pages
                    </button>
                    <button
                      onClick={() => setProgressMode('percent')}
                      className="flex-1 py-2 px-3 rounded-lg font-semibold text-xs transition-all"
                      style={{
                        background: progressMode === 'percent' ? dynamicGradient : currentTheme.backgroundColor,
                        color: progressMode === 'percent' ? 'white' : (currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280')
                      }}
                    >
                      Percentage
                    </button>
                  </>
                )}
              </div>

              {/* Pages Mode */}
              {progressMode === 'pages' && (
                <div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <input
                      type="number"
                      value={currentPage}
                      onChange={(e) => {
                        const val = Math.min(book.pages || 498, Math.max(0, parseInt(e.target.value) || 0));
                        setCurrentPage(val);
                      }}
                      className="w-[100px] text-center px-3 py-2.5 rounded-lg text-lg font-bold focus:outline-none"
                      style={{
                        backgroundColor: currentTheme.backgroundColor,
                        color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827',
                        borderColor: currentTheme.borderColor,
                        borderWidth: '1px',
                      }}
                      placeholder="156"
                    />
                    <span 
                      className="text-2xl font-bold"
                      style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                    >
                      /
                    </span>
                    <div 
                      className="w-[100px] text-center px-3 py-2.5 rounded-lg text-lg font-bold"
                      style={{
                        backgroundColor: currentTheme.backgroundColor,
                        color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280',
                        borderColor: currentTheme.borderColor,
                        borderWidth: '1px',
                      }}
                    >
                      {book.pages || 498}
                    </div>
                    <div 
                      className="px-4 py-2.5 rounded-lg"
                      style={{
                        backgroundColor: currentTheme.backgroundColor,
                        borderColor: currentTheme.borderColor,
                        borderWidth: '1px',
                      }}
                    >
                      <span 
                        className="text-sm font-semibold"
                        style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                      >
                        Pages
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      const newProgress = Math.round((currentPage / (book.pages || 1)) * 100);
                      const updates: any = { 
                        currentPage: currentPage,
                        progress: newProgress // Sync progress percentage
                      };
                      
                      // Update local percentage state to stay in sync
                      setPercentComplete(newProgress);
                      
                      // If progress reaches 100%, trigger review modal
                      if (newProgress >= 100) {
                        updates.status = 'finished';
                        updates.finishDate = new Date().toISOString();
                        updates.progress = 100;
                        updates.currentPage = book.pages || currentPage;
                        if (!book.startDate) {
                          updates.startDate = new Date().toISOString();
                        }
                        
                        // Update the book first
                        onUpdateBook?.(updates);
                        
                        // Then trigger the finish flow (review + celebration)
                        onBookFinished?.({ ...book, ...updates });
                      }
                      // If progress > 0 and currently "Want to Read", move to "Currently Reading"
                      else if (newProgress > 0 && book.status === 'want-to-read') {
                        updates.status = 'reading';
                        if (!book.startDate) {
                          updates.startDate = new Date().toISOString();
                        }
                        setCurrentStatus('Currently Reading');
                        onUpdateBook?.(updates);
                      } else {
                        onUpdateBook?.(updates);
                      }
                    }}
                    className="w-full text-white py-3 rounded-xl text-base font-bold mb-2"
                    style={{ background: dynamicGradient }}
                  >
                    Update Progress
                  </button>
                </div>
              )}

              {/* Minutes Mode (for Audiobooks) */}
              {progressMode === 'minutes' && book.format === 'audiobook' && (
                <div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <input
                      type="number"
                      value={currentMinutes}
                      onChange={(e) => {
                        const val = Math.min(book.audioDuration || 600, Math.max(0, parseInt(e.target.value) || 0));
                        setCurrentMinutes(val);
                      }}
                      className="w-[100px] text-center px-3 py-2.5 rounded-lg text-lg font-bold focus:outline-none"
                      style={{
                        backgroundColor: currentTheme.backgroundColor,
                        color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827',
                        borderColor: currentTheme.borderColor,
                        borderWidth: '1px',
                      }}
                      placeholder="0"
                    />
                    <span 
                      className="text-2xl font-bold"
                      style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                    >
                      /
                    </span>
                    <div 
                      className="w-[100px] text-center px-3 py-2.5 rounded-lg text-lg font-bold"
                      style={{
                        backgroundColor: currentTheme.backgroundColor,
                        color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280',
                        borderColor: currentTheme.borderColor,
                        borderWidth: '1px',
                      }}
                    >
                      {book.audioDuration || 600}
                    </div>
                    <div 
                      className="px-4 py-2.5 rounded-lg"
                      style={{
                        backgroundColor: currentTheme.backgroundColor,
                        borderColor: currentTheme.borderColor,
                        borderWidth: '1px',
                      }}
                    >
                      <span 
                        className="text-sm font-semibold"
                        style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                      >
                        Min
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      const newProgress = Math.round((currentMinutes / (book.audioDuration || 1)) * 100);
                      const updates: any = { 
                        currentMinutes: currentMinutes,
                        progress: newProgress // Sync progress percentage for audiobooks
                      };
                      
                      // Update local percentage state to stay in sync
                      setPercentComplete(newProgress);
                      
                      // If progress reaches 100%, trigger review modal
                      if (newProgress >= 100) {
                        updates.status = 'finished';
                        updates.finishDate = new Date().toISOString();
                        updates.progress = 100;
                        updates.currentMinutes = book.audioDuration || currentMinutes;
                        if (!book.startDate) {
                          updates.startDate = new Date().toISOString();
                        }
                        
                        // Update the book first
                        onUpdateBook?.(updates);
                        
                        // Then trigger the finish flow (review + celebration)
                        onBookFinished?.({ ...book, ...updates });
                      }
                      // If progress > 0 and currently "Want to Read", move to "Currently Reading"
                      else if (newProgress > 0 && book.status === 'want-to-read') {
                        updates.status = 'reading';
                        if (!book.startDate) {
                          updates.startDate = new Date().toISOString();
                        }
                        setCurrentStatus('Currently Reading');
                        onUpdateBook?.(updates);
                      } else {
                        onUpdateBook?.(updates);
                      }
                    }}
                    className="w-full text-white py-3 rounded-xl text-base font-bold mb-2"
                    style={{ background: dynamicGradient }}
                  >
                    Update Progress
                  </button>
                </div>
              )}

              {/* Percent Mode */}
              {progressMode === 'percent' && (
                <div>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <input
                      type="number"
                      value={percentComplete}
                      onChange={(e) => {
                        const val = Math.min(100, Math.max(0, parseInt(e.target.value) || 0));
                        setPercentComplete(val);
                      }}
                      className="w-[120px] text-center px-3 py-2.5 rounded-lg text-lg font-bold focus:outline-none"
                      style={{
                        backgroundColor: currentTheme.backgroundColor,
                        color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827',
                        borderColor: currentTheme.borderColor,
                        borderWidth: '1px',
                      }}
                      placeholder="0"
                      min="0"
                      max="100"
                    />
                    <div 
                      className="px-4 py-2.5 rounded-lg"
                      style={{
                        backgroundColor: currentTheme.backgroundColor,
                        borderColor: currentTheme.borderColor,
                        borderWidth: '1px',
                      }}
                    >
                      <span 
                        className="text-sm font-semibold"
                        style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                      >
                        %
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      const updates: any = { progress: percentComplete };
                      
                      // For audiobooks, calculate and sync currentMinutes based on percentage
                      if (book.format === 'audiobook' && book.audioDuration) {
                        const calculatedMinutes = Math.round((percentComplete / 100) * book.audioDuration);
                        updates.currentMinutes = calculatedMinutes;
                        setCurrentMinutes(calculatedMinutes);
                      } 
                      // For physical/ebook, calculate and sync currentPage based on percentage
                      else if (book.pages) {
                        const calculatedPage = Math.round((percentComplete / 100) * book.pages);
                        updates.currentPage = calculatedPage;
                        setCurrentPage(calculatedPage);
                      }
                      
                      // If progress reaches 100%, trigger review modal
                      if (percentComplete >= 100) {
                        updates.status = 'finished';
                        updates.finishDate = new Date().toISOString();
                        updates.progress = 100;
                        
                        // Set the appropriate max value based on format
                        if (book.format === 'audiobook' && book.audioDuration) {
                          updates.currentMinutes = book.audioDuration;
                        } else if (book.pages) {
                          updates.currentPage = book.pages;
                        }
                        
                        if (!book.startDate) {
                          updates.startDate = new Date().toISOString();
                        }
                        
                        // Update the book first
                        onUpdateBook?.(updates);
                        
                        // Then trigger the finish flow (review + celebration)
                        onBookFinished?.({ ...book, ...updates });
                      }
                      // If progress > 0 and currently "Want to Read", move to "Currently Reading"
                      else if (percentComplete > 0 && book.status === 'want-to-read') {
                        updates.status = 'reading';
                        if (!book.startDate) {
                          updates.startDate = new Date().toISOString();
                        }
                        setCurrentStatus('Currently Reading');
                        onUpdateBook?.(updates);
                      } else {
                        onUpdateBook?.(updates);
                      }
                    }}
                    className="w-full text-white py-3 rounded-xl text-base font-bold mb-2"
                    style={{ background: dynamicGradient }}
                  >
                    Update Progress
                  </button>
                </div>
              )}

              {/* Only show DNF/Finished buttons if not already finished */}
              {book.status !== 'finished' && (
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => {
                      onUpdateBook?.({ status: 'dnf', currentPage: currentPage });
                    }}
                    className="py-2.5 rounded-xl text-sm font-bold transition-all border-2 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      backgroundColor: currentTheme.backgroundColor,
                      borderColor: currentTheme.borderColor,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                      color: 'white'
                    }}
                  >
                    DNF
                  </button>
                  <button 
                    onClick={() => {
                      setShowFinishModal(true);
                    }}
                    className="py-2.5 rounded-xl text-sm font-bold transition-all border-2 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      backgroundColor: currentTheme.backgroundColor,
                      borderColor: currentTheme.borderColor,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                      color: 'white'
                    }}
                  >
                    Finished
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* More Options - Collapsible */}
        <div className="px-4 pb-4">
          <button
            onClick={() => toggleSection('moreOptions')}
            className="w-full rounded-xl p-4 flex items-center justify-between"
            style={{
              backgroundColor: currentTheme.backgroundColor
            }}
          >
            <span className="text-sm font-bold text-gray-100">MORE OPTIONS</span>
            {expandedSections.moreOptions ? (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          <AnimatePresence>
            {expandedSections.moreOptions && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => {
                      setIsOwned(!isOwned);
                      onUpdateBook?.({ owned: !isOwned });
                    }}
                    className="w-full rounded-lg p-3 text-sm text-left flex items-center justify-between transition-all"
                    style={{
                      background: isOwned ? dynamicGradient : '#1f2937',
                      color: isOwned ? '#ffffff' : '#d1d5db'
                    }}
                  >
                    <span>{isOwned ? '✓ Marked as Owned' : 'Mark as Owned'}</span>
                    <Bookmark className={`w-4 h-4 ${isOwned ? 'fill-white' : ''}`} />
                  </button>
                  <button
                    onClick={() => setShowShelfModal(true)}
                    className="w-full rounded-lg p-3 text-sm text-gray-300 text-left flex items-center justify-between"
                    style={{
                      backgroundColor: currentTheme.backgroundColor
                    }}
                  >
                    <span>Add to Shelf</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowGoalModal(true)}
                    className="w-full rounded-lg p-3 text-sm text-gray-300 text-left flex items-center justify-between"
                    style={{
                      backgroundColor: currentTheme.backgroundColor
                    }}
                  >
                    <span>Set Reading Goals</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Description */}
        <div className="px-4 pb-6">
          <div 
            className="rounded-xl p-5"
            style={{ backgroundColor: currentTheme.backgroundColor }}
          >
            <h3 className="text-sm font-bold text-gray-100 mb-3 uppercase tracking-wide">Description</h3>
            <p className={`text-sm text-gray-400 leading-relaxed ${!expandedSections.description ? 'line-clamp-4' : ''}`}>
              {bookDescription}
            </p>
            <button
              onClick={() => toggleSection('description')}
              className="mt-3 text-xs font-bold text-[#3298ff]"
            >
              {expandedSections.description ? 'Show Less' : 'Show More'}
            </button>
          </div>
        </div>

        {/* Genre Tags - Hardcoded */}
        <div className="px-4 pb-6">
          <div 
            className="rounded-xl p-5"
            style={{ backgroundColor: currentTheme.backgroundColor }}
          >
            <h3 className="text-sm font-bold text-gray-100 mb-3 uppercase tracking-wide flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Genres
            </h3>
            <div className="flex flex-wrap gap-2">
              <span 
                className="px-3 py-1.5 text-xs font-semibold rounded-full border"
                style={{
                  backgroundColor: currentTheme.cardColor,
                  borderColor: currentTheme.borderColor,
                  color: currentTheme.textColor === 'light' ? '#d1d5db' : '#6b7280',
                }}
              >
                Fantasy
              </span>
              <span 
                className="px-3 py-1.5 text-xs font-semibold rounded-full border"
                style={{
                  backgroundColor: currentTheme.cardColor,
                  borderColor: currentTheme.borderColor,
                  color: currentTheme.textColor === 'light' ? '#d1d5db' : '#6b7280',
                }}
              >
                Adventure
              </span>
              <span 
                className="px-3 py-1.5 text-xs font-semibold rounded-full border"
                style={{
                  backgroundColor: currentTheme.cardColor,
                  borderColor: currentTheme.borderColor,
                  color: currentTheme.textColor === 'light' ? '#d1d5db' : '#6b7280',
                }}
              >
                Magic
              </span>
              <span 
                className="px-3 py-1.5 text-xs font-semibold rounded-full border"
                style={{
                  backgroundColor: currentTheme.cardColor,
                  borderColor: currentTheme.borderColor,
                  color: currentTheme.textColor === 'light' ? '#d1d5db' : '#6b7280',
                }}
              >
                Young Adult
              </span>
            </div>
          </div>
        </div>

        {/* Community Reviews - Hardcoded */}
        <div className="px-4 pb-6">
          <div 
            className="rounded-xl p-5"
            style={{ backgroundColor: currentTheme.backgroundColor }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-100 uppercase tracking-wide">Community Reviews</h3>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="text-4xl font-bold text-gray-100">4.3</div>
              <div>
                <div className="flex gap-0.5 mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className="w-4 h-4 text-amber-500" 
                      style={{
                        fill: star <= 4 ? '#f59e0b' : 'none'
                      }}
                    />
                  ))}
                </div>
                <div className="text-xs text-gray-500">
                  Based on 2,847 reviews
                </div>
              </div>
            </div>

            {/* Rating Breakdown */}
            <div className="space-y-2 mb-4">
              {[
                { stars: 5, percentage: 62 },
                { stars: 4, percentage: 24 },
                { stars: 3, percentage: 10 },
                { stars: 2, percentage: 3 },
                { stars: 1, percentage: 1 },
              ].map(({ stars, percentage }) => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-8">{stars}★</span>
                  <div 
                    className="flex-1 h-2 rounded-full overflow-hidden"
                    style={{
                      backgroundColor: currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div
                      style={{ width: `${percentage}%` }}
                      className="h-full bg-amber-500"
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8 text-right">{percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Your Rating - Hardcoded */}
        <div className="px-4 pb-6">
          <div 
            className="rounded-xl p-5"
            style={{ backgroundColor: currentTheme.backgroundColor }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-100 uppercase tracking-wide">Your Rating</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold" style={{
                background: dynamicGradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>4.5</div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className="w-5 h-5 text-yellow-400" 
                    style={{
                      fill: star <= 4 ? '#facc15' : star === 5 ? '#facc15' : 'none',
                      opacity: star === 5 ? 0.5 : 1
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reading Stats - Poll Style (Hardcoded) */}
        <div className="px-4 pb-6 space-y-4">
          {/* Pacing */}
          <div 
            className="rounded-xl p-5"
            style={{ backgroundColor: currentTheme.backgroundColor }}
          >
            <h3 className="text-sm font-bold text-gray-100 mb-4">Pacing</h3>
            <div className="space-y-3">
              {[
                { option: 'Fast', percentage: 68, colorClass: 'bg-emerald-500' },
                { option: 'Medium', percentage: 28, colorClass: 'bg-amber-500' },
                { option: 'Slow', percentage: 4, colorClass: 'bg-rose-500' },
              ].map(({ option, percentage, colorClass }) => (
                <div key={option}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-gray-100">{option}</span>
                    <span className="text-xs font-bold text-gray-400">{percentage}%</span>
                  </div>
                  <div 
                    className="h-2.5 rounded-full overflow-hidden"
                    style={{
                      backgroundColor: currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div
                      style={{ width: `${percentage}%` }}
                      className={`h-full ${colorClass} transition-all duration-500`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Would Recommend */}
          <div 
            className="rounded-xl p-5"
            style={{ backgroundColor: currentTheme.backgroundColor }}
          >
            <h3 className="text-sm font-bold text-gray-100 mb-4">Would you recommend?</h3>
            <div className="space-y-3">
              {[
                { option: 'Yes', percentage: 89, colorClass: 'bg-emerald-500' },
                { option: 'Maybe', percentage: 8, colorClass: 'bg-amber-500' },
                { option: 'No', percentage: 3, colorClass: 'bg-rose-500' },
              ].map(({ option, percentage, colorClass }) => (
                <div key={option}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-gray-100">{option}</span>
                    <span className="text-xs font-bold text-gray-400">{percentage}%</span>
                  </div>
                  <div 
                    className="h-2.5 rounded-full overflow-hidden"
                    style={{
                      backgroundColor: currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div
                      style={{ width: `${percentage}%` }}
                      className={`h-full ${colorClass} transition-all duration-500`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rereadability */}
          <div 
            className="rounded-xl p-5"
            style={{ backgroundColor: currentTheme.backgroundColor }}
          >
            <h3 className="text-sm font-bold text-gray-100 mb-4">Rereadability</h3>
            <div className="space-y-3">
              {[
                { option: 'High', percentage: 72, colorClass: 'bg-purple-500' },
                { option: 'Medium', percentage: 21, colorClass: 'bg-indigo-500' },
                { option: 'Low', percentage: 7, colorClass: 'bg-gray-500' },
              ].map(({ option, percentage, colorClass }) => (
                <div key={option}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-gray-100">{option}</span>
                    <span className="text-xs font-bold text-gray-400">{percentage}%</span>
                  </div>
                  <div 
                    className="h-2.5 rounded-full overflow-hidden"
                    style={{
                      backgroundColor: currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div
                      style={{ width: `${percentage}%` }}
                      className={`h-full ${colorClass} transition-all duration-500`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Character Development */}
          <div 
            className="rounded-xl p-5"
            style={{ backgroundColor: currentTheme.backgroundColor }}
          >
            <h3 className="text-sm font-bold text-gray-100 mb-4">Character Development</h3>
            <div className="space-y-3">
              {[
                { option: 'Excellent', percentage: 76, colorClass: 'bg-emerald-500' },
                { option: 'Good', percentage: 20, colorClass: 'bg-blue-500' },
                { option: 'Poor', percentage: 4, colorClass: 'bg-rose-500' },
              ].map(({ option, percentage, colorClass }) => (
                <div key={option}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-gray-100">{option}</span>
                    <span className="text-xs font-bold text-gray-400">{percentage}%</span>
                  </div>
                  <div 
                    className="h-2.5 rounded-full overflow-hidden"
                    style={{
                      backgroundColor: currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div
                      style={{ width: `${percentage}%` }}
                      className={`h-full ${colorClass} transition-all duration-500`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Plot Twists */}
          <div 
            className="rounded-xl p-5"
            style={{ backgroundColor: currentTheme.backgroundColor }}
          >
            <h3 className="text-sm font-bold text-gray-100 mb-4">Plot Twists</h3>
            <div className="space-y-3">
              {[
                { option: 'Many', percentage: 54, colorClass: 'bg-purple-500' },
                { option: 'Some', percentage: 38, colorClass: 'bg-indigo-500' },
                { option: 'Few', percentage: 8, colorClass: 'bg-gray-500' },
              ].map(({ option, percentage, colorClass }) => (
                <div key={option}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-gray-100">{option}</span>
                    <span className="text-xs font-bold text-gray-400">{percentage}%</span>
                  </div>
                  <div 
                    className="h-2.5 rounded-full overflow-hidden"
                    style={{
                      backgroundColor: currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div
                      style={{ width: `${percentage}%` }}
                      className={`h-full ${colorClass} transition-all duration-500`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Finish Book Modal */}
      <AnimatePresence>
        {showFinishModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFinishModal(false)}
              className="absolute inset-0 z-40"
              style={{ 
                background: `linear-gradient(180deg, ${currentTheme.primary}33 0%, ${currentTheme.primary}66 100%)`
              }}
            />
            
            {/* Modal - Centered */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="rounded-[20px] w-full max-w-[400px] max-h-[90vh] overflow-hidden" style={{ backgroundColor: currentTheme.cardColor }}>
              {/* Scrollable Content */}
              <div className="overflow-y-auto max-h-[90vh] overscroll-contain">
                {/* Header */}
                <div className="px-4 pt-5 pb-5">
                  <h2 
                    className="text-lg font-bold mb-1"
                    style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
                  >
                    Finished Reading!
                  </h2>
                  <p 
                    className="text-xs"
                    style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                  >
                    Share your reading experience
                  </p>
                </div>

                <div className="px-4 pb-4 space-y-5">
                  {/* Rating */}
                  <div>
                    <label 
                      className="text-[9px] font-bold mb-2 block uppercase tracking-wider"
                      style={{ color: currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af' }}
                    >
                      RATING
                    </label>
                    
                    {/* Star Display */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const filled = finishModalData.rating >= star;
                        const remainder = finishModalData.rating - (star - 1);
                        const partialFilled = remainder > 0 && remainder < 1;
                        const fillPercentage = partialFilled ? remainder * 100 : 0;
                        
                        return (
                          <div key={star} className="relative">
                            {partialFilled ? (
                              <div className="relative">
                                <svg className="w-10 h-10" viewBox="0 0 24 24">
                                  <path
                                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                                    fill="none"
                                    stroke="rgba(255, 255, 255, 0.2)"
                                    strokeWidth="2"
                                  />
                                </svg>
                                <div className="absolute inset-0 overflow-hidden" style={{ width: `${fillPercentage}%` }}>
                                  <svg className="w-10 h-10" viewBox="0 0 24 24">
                                    <defs>
                                      <linearGradient id={`star-gradient-partial-${star}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor={currentTheme.primary} />
                                        <stop offset="100%" stopColor={currentTheme.secondary} />
                                      </linearGradient>
                                    </defs>
                                    <path
                                      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                                      fill={`url(#star-gradient-partial-${star})`}
                                      stroke={`url(#star-gradient-partial-${star})`}
                                      strokeWidth="2"
                                    />
                                  </svg>
                                </div>
                              </div>
                            ) : (
                              <svg className="w-10 h-10 transition-all duration-200" viewBox="0 0 24 24">
                                <defs>
                                  <linearGradient id={`star-gradient-${star}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor={currentTheme.primary} />
                                    <stop offset="100%" stopColor={currentTheme.secondary} />
                                  </linearGradient>
                                </defs>
                                <path
                                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                                  fill={filled ? `url(#star-gradient-${star})` : 'none'}
                                  stroke={filled ? `url(#star-gradient-${star})` : 'rgba(255, 255, 255, 0.2)'}
                                  strokeWidth="2"
                                />
                              </svg>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Rating Value Display */}
                    <div className="text-center mb-3">
                      <span 
                        className="text-2xl font-bold"
                        style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
                      >
                        {finishModalData.rating > 0 ? finishModalData.rating.toFixed(2) : '0.00'}
                      </span>
                      <span 
                        className="text-sm ml-1"
                        style={{ color: currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af' }}
                      >
                        / 5.00
                      </span>
                    </div>

                    {/* Slider */}
                    <div className="relative h-2 rounded-lg bg-gray-700">
                      <div 
                        className="absolute h-2 rounded-lg pointer-events-none transition-all duration-200"
                        style={{
                          width: `${(finishModalData.rating / 5) * 100}%`,
                          background: dynamicGradient
                        }}
                      />
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.25"
                        value={finishModalData.rating}
                        onChange={(e) => setFinishModalData({ ...finishModalData, rating: parseFloat(e.target.value) })}
                        className="absolute inset-0 w-full appearance-none cursor-pointer bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Pacing */}
                  <div>
                    <label 
                      className="text-[9px] font-bold mb-2 block uppercase tracking-wider"
                      style={{ color: currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af' }}
                    >
                      PACING
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['Fast', 'Medium', 'Slow'].map((option) => (
                        <button
                          key={option}
                          onClick={() => setFinishModalData({ ...finishModalData, pacing: option })}
                          className="h-10 rounded-lg text-sm font-medium transition-all active:scale-95"
                          style={getButtonStyle(finishModalData.pacing === option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Would Recommend */}
                  <div>
                    <label 
                      className="text-[9px] font-bold mb-2 block uppercase tracking-wider"
                      style={{ color: currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af' }}
                    >
                      WOULD RECOMMEND?
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['Yes', 'Maybe', 'No'].map((option) => (
                        <button
                          key={option}
                          onClick={() => setFinishModalData({ ...finishModalData, recommend: option })}
                          className="h-10 rounded-lg text-sm font-medium transition-all active:scale-95"
                          style={getButtonStyle(finishModalData.recommend === option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rereadability */}
                  <div>
                    <label 
                      className="text-[9px] font-bold mb-2 block uppercase tracking-wider"
                      style={{ color: currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af' }}
                    >
                      REREADABILITY
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['High', 'Medium', 'Low'].map((option) => (
                        <button
                          key={option}
                          onClick={() => setFinishModalData({ ...finishModalData, rereadability: option })}
                          className="h-10 rounded-lg text-sm font-medium transition-all active:scale-95"
                          style={getButtonStyle(finishModalData.rereadability === option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Character Development */}
                  <div>
                    <label 
                      className="text-[9px] font-bold mb-2 block uppercase tracking-wider"
                      style={{ color: currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af' }}
                    >
                      CHARACTER DEVELOPMENT
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['Excellent', 'Good', 'Poor'].map((option) => (
                        <button
                          key={option}
                          onClick={() => setFinishModalData({ ...finishModalData, characterDevelopment: option })}
                          className="h-10 rounded-lg text-sm font-medium transition-all active:scale-95"
                          style={getButtonStyle(finishModalData.characterDevelopment === option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Plot Twists */}
                  <div>
                    <label 
                      className="text-[9px] font-bold mb-2 block uppercase tracking-wider"
                      style={{ color: currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af' }}
                    >
                      PLOT TWISTS
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['Many', 'Some', 'Few'].map((option) => (
                        <button
                          key={option}
                          onClick={() => setFinishModalData({ ...finishModalData, plotTwists: option })}
                          className="h-10 rounded-lg text-sm font-medium transition-all active:scale-95"
                          style={getButtonStyle(finishModalData.plotTwists === option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes / Written Review */}
                  <div>
                    <label 
                      className="text-[9px] font-bold mb-2 block uppercase tracking-wider"
                      style={{ color: currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af' }}
                    >
                      NOTES / WRITTEN REVIEW
                    </label>
                    <textarea
                      value={finishModalData.notes}
                      onChange={(e) => setFinishModalData({ ...finishModalData, notes: e.target.value })}
                      placeholder="Share your thoughts, favorite quotes, or memorable moments..."
                      className="w-full rounded-lg p-3 text-sm resize-none focus:outline-none"
                      style={{
                        backgroundColor: currentTheme.backgroundColor,
                        color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827',
                        border: `1px solid ${currentTheme.borderColor}`,
                        minHeight: '120px'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Buttons */}
              <div className="px-4 pt-3 pb-4 space-y-2">
                <button
                  onClick={() => {
                    const updates: any = {
                      status: 'finished',
                      progress: 100,
                      finishDate: new Date().toISOString(),
                      rating: finishModalData.rating,
                      notes: finishModalData.notes,
                      stats: {
                        pacing: finishModalData.pacing,
                        recommend: finishModalData.recommend,
                        rereadability: finishModalData.rereadability,
                        characterDevelopment: finishModalData.characterDevelopment,
                        plotTwists: finishModalData.plotTwists,
                      }
                    };
                    
                    // Set appropriate progress based on format
                    if (book.format === 'audiobook') {
                      const totalMinutes = book.audioDuration || 600;
                      setCurrentMinutes(totalMinutes);
                      updates.currentMinutes = totalMinutes;
                    } else {
                      const totalPages = book.pages || 498;
                      setCurrentPage(totalPages);
                      updates.currentPage = totalPages;
                    }
                    
                    setRating(finishModalData.rating);
                    setPercentComplete(100);
                    setCurrentStatus('Finished');
                    onUpdateBook?.(updates);
                    
                    // Trigger celebration modal
                    onBookFinished?.(book);
                    
                    setShowFinishModal(false);
                    setFinishModalData({
                      rating: 0,
                      pacing: '',
                      recommend: '',
                      rereadability: '',
                      characterDevelopment: '',
                      plotTwists: '',
                      notes: '',
                    });
                  }}
                  className="w-full h-12 rounded-xl text-sm font-bold text-white active:scale-[0.98] transition-transform"
                  style={{ background: dynamicGradient }}
                >
                  Submit Review
                </button>
                <button
                  onClick={() => {
                    setShowFinishModal(false);
                    setFinishModalData({
                      rating: 0,
                      pacing: '',
                      recommend: '',
                      rereadability: '',
                      characterDevelopment: '',
                      plotTwists: '',
                      notes: '',
                    });
                  }}
                  className="w-full h-12 rounded-xl text-sm font-semibold active:scale-[0.98] transition-all"
                  style={{ 
                    backgroundColor: currentTheme.backgroundColor,
                    color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280'
                  }}
                >
                  Cancel
                </button>
              </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Date Picker Modal */}
      <AnimatePresence>
        {showDatePicker && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDatePicker(false)}
              className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#232323] rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
              >

                <div className="px-4 pt-4 pb-4">
                  <h2 className="text-lg font-bold text-white mb-1">Reading Log & Review</h2>
                  <p className="text-xs text-gray-400">Fix past reading days, update dates, and add your review in one place</p>
                </div>

                <div className="px-4 pb-4 space-y-5 max-h-[58vh] overflow-y-auto">
                  {/* Start Date Section */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Start Date</label>
                    <p className="text-xs text-gray-500 mb-3">Use full date for best calendar accuracy</p>
                    {(startDate || book.startDate) && (
                      <div className="text-[11px] text-gray-400 mb-2">
                        Current: <span className="text-gray-200 font-semibold">{startDate || book.startDate}</span>
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        placeholder="Year"
                        value={tempStartYear}
                        onChange={(e) => setTempStartYear(e.target.value)}
                        min="1900"
                        max="2100"
                        className="bg-[#3a3a3a] text-white px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3298ff] placeholder-gray-600"
                      />
                      <input
                        type="number"
                        placeholder="Month"
                        value={tempStartMonth}
                        onChange={(e) => setTempStartMonth(e.target.value)}
                        min="1"
                        max="12"
                        className="bg-[#3a3a3a] text-white px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3298ff] placeholder-gray-600"
                      />
                      <input
                        type="number"
                        placeholder="Day"
                        value={tempStartDay}
                        onChange={(e) => setTempStartDay(e.target.value)}
                        min="1"
                        max="31"
                        className="bg-[#3a3a3a] text-white px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3298ff] placeholder-gray-600"
                      />
                    </div>
                  </div>

                {/* Divider */}
                <div className="h-px bg-gray-700 my-4" />

                {/* Finish Date Section */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Finish Date</label>
                  <p className="text-xs text-gray-500 mb-3">Leave blank if you haven't finished yet</p>
                  {(finishDate || book.finishDate) && (
                    <div className="text-[11px] text-gray-400 mb-2">
                      Current: <span className="text-gray-200 font-semibold">{finishDate || book.finishDate}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      placeholder="Year"
                      value={tempFinishYear}
                      onChange={(e) => setTempFinishYear(e.target.value)}
                      min="1900"
                      max="2100"
                      className="bg-[#3a3a3a] text-white px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3298ff] placeholder-gray-600"
                    />
                    <input
                      type="number"
                      placeholder="Month"
                      value={tempFinishMonth}
                      onChange={(e) => setTempFinishMonth(e.target.value)}
                      min="1"
                      max="12"
                      className="bg-[#3a3a3a] text-white px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3298ff] placeholder-gray-600"
                    />
                    <input
                      type="number"
                      placeholder="Day"
                      value={tempFinishDay}
                      onChange={(e) => setTempFinishDay(e.target.value)}
                      min="1"
                      max="31"
                      className="bg-[#3a3a3a] text-white px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3298ff] placeholder-gray-600"
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-700 my-4" />

                {/* Reading Log Section */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Reading Log</label>
                  <p className="text-xs text-gray-500 mb-3">Add one or multiple missed entries with {book.format === 'audiobook' ? 'minutes' : 'pages'} or percentage</p>
                  <div className="space-y-2 mb-2">
                    {tempLogEntries.map((entry, idx) => (
                      <div key={entry.id} className="rounded-xl bg-[#2f2f2f] p-2.5 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-[11px] font-semibold text-gray-200">Log #{idx + 1}</div>
                          {tempLogEntries.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                setTempLogEntries((prev) => prev.filter((row) => row.id !== entry.id));
                              }}
                              className="text-[10px] px-2 py-0.5 rounded bg-[#3a3a3a] text-gray-300"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <input
                          type="date"
                          value={entry.date}
                          onChange={(e) => {
                            setTempLogEntries((prev) =>
                              prev.map((row) => (row.id === entry.id ? { ...row, date: e.target.value } : row)),
                            );
                          }}
                          className="w-full bg-[#3a3a3a] text-white px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3298ff]"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setTempLogEntries((prev) =>
                                prev.map((row) => (row.id === entry.id ? { ...row, mode: 'amount' } : row)),
                              );
                            }}
                            className="px-3 py-2 rounded-lg text-xs font-semibold"
                            style={{
                              background: entry.mode === 'amount' ? dynamicGradient : '#3a3a3a',
                              color: '#ffffff',
                            }}
                          >
                            {book.format === 'audiobook' ? 'Minutes' : 'Pages'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setTempLogEntries((prev) =>
                                prev.map((row) => (row.id === entry.id ? { ...row, mode: 'percent' } : row)),
                              );
                            }}
                            className="px-3 py-2 rounded-lg text-xs font-semibold"
                            style={{
                              background: entry.mode === 'percent' ? dynamicGradient : '#3a3a3a',
                              color: '#ffffff',
                            }}
                          >
                            Percentage
                          </button>
                        </div>
                        <input
                          type="number"
                          placeholder={entry.mode === 'percent' ? 'Target % (0-100)' : book.format === 'audiobook' ? 'Minutes listened' : 'Pages read'}
                          value={entry.value}
                          onChange={(e) => {
                            setTempLogEntries((prev) =>
                              prev.map((row) => (row.id === entry.id ? { ...row, value: e.target.value } : row)),
                            );
                          }}
                          min="0"
                          max={entry.mode === 'percent' ? '100' : undefined}
                          className="w-full bg-[#3a3a3a] text-white px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3298ff] placeholder-gray-600"
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setTempLogEntries((prev) => [
                          ...prev,
                          {
                            id: `draft_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                            date: new Date().toISOString().split('T')[0],
                            mode: 'amount',
                            value: '',
                          },
                        ]);
                      }}
                      className="w-full bg-[#3a3a3a] text-white px-3 py-2.5 rounded-xl text-xs font-semibold"
                    >
                      + Add Another Log
                    </button>
                    <div className="bg-[#2f2f2f] text-gray-300 px-3 py-2.5 rounded-xl text-xs text-center">
                      Every valid row creates a reading session and updates progress in order
                    </div>
                  </div>

                  {readingLogsForBook.length > 0 && (
                    <div className="mt-3">
                      <div className="text-[11px] text-gray-400 mb-2">Recent log entries</div>
                      <div className="space-y-1.5">
                        {readingLogsForBook.map((entry) => (
                          <div
                            key={entry.id}
                            className="flex items-center justify-between text-[11px] px-2.5 py-2 rounded-lg bg-[#2b2b2b]"
                          >
                            <span className="text-gray-200">{entry.date.split('T')[0]}</span>
                            <span className="text-gray-300">
                              {entry.pages || 0} pages • {entry.minutes || 0} min
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-700 my-4" />

                {/* Review Section */}
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Review</label>
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setTempReviewRating(star)}
                        className="p-1"
                        type="button"
                      >
                        <Star
                          className="w-5 h-5"
                          fill={star <= tempReviewRating ? '#fbbf24' : 'none'}
                          style={{ color: star <= tempReviewRating ? '#fbbf24' : '#6b7280' }}
                        />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={tempReview}
                    onChange={(e) => setTempReview(e.target.value)}
                    placeholder="Write your notes/review..."
                    className="w-full bg-[#3a3a3a] text-white px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3298ff] placeholder-gray-600 min-h-[90px]"
                  />
                </div>
              </div>

              <div className="px-4 pt-3 pb-4 space-y-2">
                <button
                  onClick={async () => {
                    const toIsoDate = (yearRaw: string, monthRaw: string, dayRaw: string): string => {
                      const year = parseInt(yearRaw || '', 10);
                      if (!year || Number.isNaN(year)) return '';
                      const month = parseInt(monthRaw || '1', 10);
                      const day = parseInt(dayRaw || '1', 10);
                      if (month < 1 || month > 12 || day < 1 || day > 31) return '';
                      return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    };

                    const updates: any = {};

                    const newStartDate = toIsoDate(tempStartYear, tempStartMonth, tempStartDay);
                    const newFinishDate = toIsoDate(tempFinishYear, tempFinishMonth, tempFinishDay);

                    if (newStartDate) {
                      setStartDate(newStartDate);
                      updates.startDate = newStartDate;
                    }
                    if (newFinishDate) {
                      setFinishDate(newFinishDate);
                      updates.finishDate = newFinishDate;
                    }

                    // Review updates
                    updates.notes = tempReview;
                    updates.rating = tempReviewRating || undefined;

                    // Reading logs (optional, multiple rows)
                    if (book.id) {
                      const validLogs = tempLogEntries
                        .map((entry) => ({
                          ...entry,
                          numericValue: Math.max(0, parseInt(entry.value || '0', 10) || 0),
                        }))
                        .filter((entry) => entry.date && entry.numericValue > 0)
                        .sort((a, b) => a.date.localeCompare(b.date));

                      let runningPage = currentPage || book.currentPage || 0;
                      let runningMinutes = currentMinutes || book.currentMinutes || 0;
                      let runningProgress = percentComplete || book.progress || 0;
                      const totalPages = book.pages || 0;
                      const totalMinutes = book.audioDuration || 0;

                      for (const entry of validLogs) {
                        let sessionPages = 0;
                        let sessionMinutes = 0;

                        if (entry.mode === 'amount') {
                          if (book.format === 'audiobook') {
                            const nextMinutes = totalMinutes > 0
                              ? Math.min(totalMinutes, runningMinutes + entry.numericValue)
                              : runningMinutes + entry.numericValue;
                            sessionMinutes = Math.max(0, nextMinutes - runningMinutes);
                            runningMinutes = nextMinutes;
                            if (totalMinutes > 0) {
                              runningProgress = Math.min(100, Math.round((runningMinutes / totalMinutes) * 100));
                            }
                          } else {
                            const nextPage = totalPages > 0
                              ? Math.min(totalPages, runningPage + entry.numericValue)
                              : runningPage + entry.numericValue;
                            sessionPages = Math.max(0, nextPage - runningPage);
                            runningPage = nextPage;
                            if (totalPages > 0) {
                              runningProgress = Math.min(100, Math.round((runningPage / totalPages) * 100));
                            }
                          }
                        } else {
                          const targetPercent = Math.min(100, entry.numericValue);
                          if (book.format === 'audiobook' && totalMinutes > 0) {
                            const targetMinutes = Math.round((targetPercent / 100) * totalMinutes);
                            sessionMinutes = Math.max(0, targetMinutes - runningMinutes);
                            runningMinutes = Math.max(runningMinutes, targetMinutes);
                            runningProgress = Math.min(100, Math.max(runningProgress, targetPercent));
                          } else if (totalPages > 0) {
                            const targetPage = Math.round((targetPercent / 100) * totalPages);
                            sessionPages = Math.max(0, targetPage - runningPage);
                            runningPage = Math.max(runningPage, targetPage);
                            runningProgress = Math.min(100, Math.max(runningProgress, targetPercent));
                          }
                        }

                        if (sessionPages > 0 || sessionMinutes > 0) {
                          await logReadingSession({
                            id: `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
                            bookId: book.id,
                            pages: sessionPages,
                            minutes: sessionMinutes,
                            date: entry.date,
                          });
                        }
                      }

                      if (book.format === 'audiobook') {
                        updates.currentMinutes = runningMinutes;
                        if (totalMinutes > 0) updates.progress = runningProgress;
                        setCurrentMinutes(runningMinutes);
                      } else {
                        updates.currentPage = runningPage;
                        if (totalPages > 0) updates.progress = runningProgress;
                        setCurrentPage(runningPage);
                      }
                      setPercentComplete(updates.progress || runningProgress);

                      if (!updates.startDate && !book.startDate && validLogs.length > 0) {
                        updates.startDate = validLogs[0].date;
                        setStartDate(validLogs[0].date);
                      }
                    }

                    if ((updates.progress || 0) >= 100 || newFinishDate) {
                      updates.status = 'finished';
                      updates.progress = 100;
                      if (!updates.finishDate) {
                        updates.finishDate = newFinishDate || new Date().toISOString().split('T')[0];
                      }
                      if (book.pages && book.format !== 'audiobook') {
                        updates.currentPage = book.pages;
                        setCurrentPage(book.pages);
                      }
                      if (book.audioDuration && book.format === 'audiobook') {
                        updates.currentMinutes = book.audioDuration;
                        setCurrentMinutes(book.audioDuration);
                      }
                      setCurrentStatus('Finished');
                    } else if ((updates.currentPage || updates.currentMinutes || 0) > 0 && book.status === 'want-to-read') {
                      updates.status = 'reading';
                      setCurrentStatus('Currently Reading');
                    }

                    if (Object.keys(updates).length > 0) {
                      onUpdateBook?.(updates);
                    }

                    setShowDatePicker(false);

                    // Reset temp fields
                    setTempStartYear('');
                    setTempStartMonth('');
                    setTempStartDay('');
                    setTempFinishYear('');
                    setTempFinishMonth('');
                    setTempFinishDay('');
                    setTempLogEntries([]);
                  }}
                  className="w-full h-12 rounded-xl text-sm font-semibold text-white active:scale-[0.98] transition-transform"
                  style={{ background: dynamicGradient }}
                  >
                    Save Dates
                  </button>
                  <button
                    onClick={() => {
                      setShowDatePicker(false);
                      // Reset temp fields
                      setTempStartYear('');
                      setTempStartMonth('');
                      setTempStartDay('');
                      setTempFinishYear('');
                      setTempFinishMonth('');
                      setTempFinishDay('');
                      setTempLogEntries([]);
                    }}
                    className="w-full h-12 rounded-xl text-sm font-semibold bg-transparent text-gray-400 active:bg-[#2a2a2a] active:scale-[0.98] transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add to Shelf Modal */}
      <AnimatePresence>
        {showShelfModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShelfModal(false)}
              className="fixed inset-0 bg-black/80 z-40 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="rounded-2xl w-[90%] max-w-md max-h-[80vh] flex flex-col"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.primary}15 0%, ${currentTheme.secondary}15 100%)`,
                  border: `1px solid ${currentTheme.primary}30`,
                  backgroundColor: '#1a1a1a'
                }}
              >
                <div 
                  className="px-5 pt-5 pb-4 border-b"
                  style={{
                    borderColor: `${currentTheme.primary}30`
                  }}
                >
                  <h2 
                    className="text-lg font-bold mb-1"
                    style={{
                      background: dynamicGradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    Add to Shelf
                  </h2>
                  <p className="text-xs text-gray-500">Choose shelves for this book</p>
                </div>

                <div className="overflow-y-auto flex-1">
                  <div className="p-4 space-y-2">
                  {/* STATUS OPTION: Currently Reading */}
                  <button
                    onClick={async () => {
                      if (!book.id) {
                        // If book doesn't exist, add it with reading status
                        const bookId = Date.now().toString();
                        await addBook({
                          ...book,
                          id: bookId,
                          status: 'reading',
                          startDate: new Date().toLocaleDateString('en-US', { 
                            month: 'short', day: 'numeric', year: 'numeric' 
                          })
                        });
                        book.id = bookId;
                      } else {
                        // Update existing book to reading
                        await updateBook(book.id, { 
                          status: 'reading',
                          startDate: book.startDate || new Date().toLocaleDateString('en-US', { 
                            month: 'short', day: 'numeric', year: 'numeric' 
                          })
                        });
                        onUpdateBook?.({ status: 'reading' });
                      }
                      setCurrentStatus('Currently Reading');
                      setShowShelfModal(false);
                    }}
                    className="w-full px-4 py-3 rounded-xl text-left text-sm font-medium active:scale-[0.98] transition-all flex items-center justify-between"
                    style={{
                      background: book.status === 'reading' || currentStatus === 'Currently Reading' ? dynamicGradient : '#2a2a2a',
                      color: book.status === 'reading' || currentStatus === 'Currently Reading' ? '#ffffff' : '#9ca3af',
                      border: book.status === 'reading' || currentStatus === 'Currently Reading' ? 'none' : `1px solid ${currentTheme.primary}20`
                    }}
                  >
                    <span>📖 Currently Reading</span>
                    {(book.status === 'reading' || currentStatus === 'Currently Reading') && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </button>
                  
                  {/* Default Shelves */}
                  {bookshelves.filter(shelf => shelf.id !== 'all-time-favorites').map((shelf) => {
                    const isOnShelf = book.id ? shelf.bookIds.includes(book.id) : false;
                    return (
                      <button
                        key={shelf.id}
                        onClick={() => {
                          if (!book.id) return;
                          
                          const updatedShelves = bookshelves.map(s => {
                            if (s.id === shelf.id) {
                              // Toggle: add or remove book from shelf
                              if (isOnShelf) {
                                return { ...s, bookIds: s.bookIds.filter(id => id !== book.id) };
                              } else {
                                return { ...s, bookIds: [...s.bookIds, book.id] };
                              }
                            }
                            return s;
                          });
                          
                          updateBookshelves(updatedShelves);
                        }}
                        className="w-full px-4 py-3 rounded-xl text-left text-sm font-medium active:scale-[0.98] transition-all flex items-center justify-between"
                        style={{
                          background: isOnShelf ? dynamicGradient : '#2a2a2a',
                          color: isOnShelf ? '#ffffff' : '#9ca3af',
                          border: isOnShelf ? 'none' : `1px solid ${currentTheme.primary}20`
                        }}
                      >
                        <span>{shelf.name}</span>
                        {isOnShelf && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </button>
                    );
                  })}
                  
                  {/* Custom Shelves */}
                  {customShelves.map((shelf) => {
                    const isOnShelf = book.id ? shelf.bookIds.includes(book.id) : false;
                    return (
                      <button
                        key={shelf.id}
                        onClick={() => {
                          if (!book.id) return;
                          
                          const updatedCustomShelves = customShelves.map(s => {
                            if (s.id === shelf.id) {
                              // Toggle: add or remove book from shelf
                              if (isOnShelf) {
                                return { ...s, bookIds: s.bookIds.filter(id => id !== book.id) };
                              } else {
                                return { ...s, bookIds: [...s.bookIds, book.id] };
                              }
                            }
                            return s;
                          });
                          
                          setCustomShelves(updatedCustomShelves);
                          localStorage.setItem('readtrack_custom_shelves', JSON.stringify(updatedCustomShelves));
                        }}
                        className="w-full px-4 py-3 rounded-xl text-left text-sm font-medium active:scale-[0.98] transition-all flex items-center justify-between"
                        style={{
                          background: isOnShelf ? dynamicGradient : '#2a2a2a',
                          color: isOnShelf ? '#ffffff' : '#9ca3af',
                          border: isOnShelf ? 'none' : `1px solid ${currentTheme.primary}20`
                        }}
                      >
                        <span>{shelf.name}</span>
                        {isOnShelf && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </button>
                    );
                  })}
                  </div>
                </div>

                <div 
                  className="px-4 py-3 border-t"
                  style={{
                    borderColor: `${currentTheme.primary}30`
                  }}
                >
                  <button
                    onClick={() => setShowShelfModal(false)}
                    className="w-full h-11 rounded-xl text-sm font-semibold active:scale-[0.98] transition-all"
                    style={{
                      background: dynamicGradient,
                      color: '#ffffff'
                    }}
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Set Reading Goals Modal */}
      <AnimatePresence>
        {showGoalModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGoalModal(false)}
              className="absolute inset-0 bg-black/95 z-40"
            />
            
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 35, stiffness: 400 }}
              className="absolute inset-x-0 bottom-0 z-50 bg-[#232323] rounded-t-[20px] max-h-[70vh] overflow-hidden"
            >
              <div className="flex justify-center pt-2 pb-3">
                <div 
                  className="w-10 h-1 rounded-full"
                  style={{
                    backgroundColor: currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'
                  }}
                />
              </div>

              <div className="px-4 pb-5">
                <h2 className="text-lg font-bold text-white mb-1">Set Reading Goals</h2>
                <p className="text-xs text-gray-500">Track your reading progress</p>
              </div>

              <div className="px-4 pb-4 space-y-4">
                <div>
                  <label className="text-[11px] font-semibold text-gray-500 mb-2 block uppercase tracking-wider">Finish by Date</label>
                  <input
                    type="date"
                    className="w-full bg-[#3a3a3a] text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3298ff]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-500 mb-2 block uppercase tracking-wider">Daily Page Goal</label>
                  <input
                    type="number"
                    placeholder="20"
                    className="w-full bg-[#3a3a3a] text-white px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3298ff]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-500 mb-2 block uppercase tracking-wider">Reading Session Reminders</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Morning', 'Afternoon', 'Evening', 'Night'].map((time) => (
                      <button
                        key={time}
                        className="bg-[#3a3a3a] text-gray-400 px-4 py-3 rounded-xl text-sm font-medium hover:bg-gradient-to-r hover:from-[#3298ff] hover:to-[#f83aef] hover:text-white transition-all"
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-4 pt-3 pb-4 space-y-2">
                <button
                  onClick={() => {
                    onUpdateBook?.({ goals: { enabled: true } });
                    setShowGoalModal(false);
                  }}
                  className="w-full h-12 rounded-xl text-sm font-semibold text-white active:scale-[0.98] transition-transform"
                  style={{ background: dynamicGradient }}
                >
                  Save Goals
                </button>
                <button
                  onClick={() => setShowGoalModal(false)}
                  className="w-full h-12 rounded-xl text-sm font-semibold bg-transparent text-gray-400 active:bg-[#2a2a2a] active:scale-[0.98] transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cover Upload Modal */}
      <AnimatePresence>
        {showCoverModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCoverModal(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md rounded-2xl p-6 z-50 shadow-2xl"
              style={{
                backgroundColor: currentTheme.backgroundColor
              }}
            >
              <h3 className="text-lg font-bold text-white mb-2">📸 Change Book Cover</h3>
              <p className="text-sm text-gray-400 mb-4">
                Paste a <strong>direct image URL</strong> (must end with .jpg, .png, or .webp)
              </p>
              
              {/* Warning for invalid URLs */}
              {customCoverUrl && (customCoverUrl.includes('amazon.com') || !customCoverUrl.match(/\.(jpg|jpeg|png|webp)(\?.*)?$/i)) && (
                <div className="mb-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                  <p className="text-xs text-red-400">
                    ⚠️ <strong>Invalid URL:</strong> This doesn't appear to be a direct image link.
                    {customCoverUrl.includes('amazon.com') && (
                      <span className="block mt-1">Amazon product pages don't work. Right-click the book cover image on Amazon → "Copy Image Address"</span>
                    )}
                  </p>
                </div>
              )}
              
              <input
                type="url"
                value={customCoverUrl}
                onChange={(e) => setCustomCoverUrl(e.target.value)}
                placeholder="https://example.com/book-cover.jpg"
                className="w-full px-4 py-3 rounded-xl border text-white focus:outline-none mb-4"
                style={{
                  backgroundColor: currentTheme.backgroundColor,
                  borderColor: currentTheme.borderColor,
                }}
                autoFocus
              />
              
              {/* Preview */}
              {customCoverUrl && customCoverUrl.match(/\.(jpg|jpeg|png|webp)(\?.*)?$/i) && (
                <div className="mb-4 text-center">
                  <div className="text-xs text-gray-400 mb-2">Preview:</div>
                  <img 
                    src={customCoverUrl} 
                    alt="Preview" 
                    className="w-24 h-36 object-cover rounded-lg mx-auto border-2 border-gray-600"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    console.log('💾 Saving cover:', customCoverUrl);
                    if (customCoverUrl && onUpdateBook) {
                      onUpdateBook({ cover: customCoverUrl });
                      setShowCoverModal(false);
                      setCustomCoverUrl('');
                    }
                  }}
                  disabled={!customCoverUrl || !customCoverUrl.match(/\.(jpg|jpeg|png|webp)(\?.*)?$/i)}
                  className="flex-1 text-white rounded-xl px-4 py-3 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                  style={{
                    background: (customCoverUrl && customCoverUrl.match(/\.(jpg|jpeg|png|webp)(\?.*)?$/i))
                      ? dynamicGradient
                      : '#4b5563'
                  }}
                >
                  Save Cover
                </button>
                <button
                  onClick={() => {
                    setShowCoverModal(false);
                    setCustomCoverUrl('');
                  }}
                  className="flex-1 text-gray-300 rounded-xl px-4 py-3 font-semibold text-sm transition-all active:scale-95"
                  style={{
                    backgroundColor: currentTheme.backgroundColor
                  }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
