import { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronLeft, BookOpen, CheckCircle2, Plus, X, Search, Filter, TrendingUp, Calendar, Sparkles, Clock, Library, Star, Share2, Download } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useBooks } from '../contexts/BooksContext';
import { useAuthors } from '../contexts/AuthorContext';
import { AuthorData, AuthorBook, SeriesData } from '../utils/authorDatabase';
import { BookCover } from './BookCover';
import { motion, AnimatePresence } from 'motion/react';

interface AuthorDetailViewProps {
  authorName: string;
  onClose: () => void;
  onAddBook?: (book: AuthorBook) => void;
}

export function AuthorDetailView({ authorName, onClose, onAddBook }: AuthorDetailViewProps) {
  const { currentTheme } = useTheme();
  const { books, addBook, updateBook, bookshelves, updateBookshelves } = useBooks();
  const { getAuthorByName, refreshAuthor } = useAuthors();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'read' | 'reading' | 'unread'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<AuthorBook | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showShelfSelector, setShowShelfSelector] = useState(false);
  const [bookForShelf, setBookForShelf] = useState<AuthorBook | null>(null);
  const [showMarkAsReadModal, setShowMarkAsReadModal] = useState(false);
  const [bookToMarkAsRead, setBookToMarkAsRead] = useState<AuthorBook | null>(null);
  const [finishDate, setFinishDate] = useState('');
  const [rating, setRating] = useState(0);
  
  // Date picker state
  const [tempStartYear, setTempStartYear] = useState('');
  const [tempStartMonth, setTempStartMonth] = useState('');
  const [tempStartDay, setTempStartDay] = useState('');
  const [tempFinishYear, setTempFinishYear] = useState('');
  const [tempFinishMonth, setTempFinishMonth] = useState('');
  const [tempFinishDay, setTempFinishDay] = useState('');
  const [hiddenBookKeys, setHiddenBookKeys] = useState<string[]>([]);
  const [isSharingChecklist, setIsSharingChecklist] = useState(false);
  const [isChecklistView, setIsChecklistView] = useState(false);
  const [checklistTheme, setChecklistTheme] = useState<'minimal' | 'bold' | 'vintage'>('bold');
  const checklistRef = useRef<HTMLDivElement>(null);

  const HIDDEN_BOOKS_STORAGE_KEY = 'readtrack_author_hidden_books';
  const buildHiddenKey = (book: AuthorBook) =>
    `${authorName.toLowerCase()}::${(book.googleBooksId || `${book.title}::${book.author}`).toLowerCase()}`;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HIDDEN_BOOKS_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        setHiddenBookKeys(parsed);
      }
    } catch {
      setHiddenBookKeys([]);
    }
  }, []);

  const hideBookFromList = (book: AuthorBook) => {
    const key = buildHiddenKey(book);
    setHiddenBookKeys((prev) => {
      if (prev.includes(key)) return prev;
      const next = [...prev, key];
      localStorage.setItem(HIDDEN_BOOKS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const authorData = getAuthorByName(authorName);

  // Auto-refresh when books change to keep statuses in sync
  useEffect(() => {
    if (authorData) {
      refreshAuthor(authorName);
    }
  }, [books]);

  const getGradientBg = () => {
    return currentTheme.isGradient
      ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
      : currentTheme.primary;
  };

  // Filter and sort books
  const filteredBooks = useMemo(() => {
    if (!authorData) return [];

    let filtered = [...authorData.books];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.series?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    switch (filterStatus) {
      case 'read':
        filtered = filtered.filter(b => b.status === 'finished');
        break;
      case 'reading':
        filtered = filtered.filter(b => b.status === 'reading');
        break;
      case 'unread':
        filtered = filtered.filter(b => !b.inUserLibrary);
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      // FIRST PRIORITY: Always put unread books at top, finished books at bottom
      const aIsFinished = a.status === 'finished';
      const bIsFinished = b.status === 'finished';
      
      if (!aIsFinished && bIsFinished) return -1; // a (not finished) comes before b (finished)
      if (aIsFinished && !bIsFinished) return 1;  // b (not finished) comes before a (finished)
      
      // SECOND PRIORITY: Within each group, apply the user's selected sort
      switch (sortBy) {
        case 'newest':
          return (b.publishedDate || '').localeCompare(a.publishedDate || '');
        case 'oldest':
          return (a.publishedDate || '').localeCompare(b.publishedDate || '');
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered.filter((book) => !hiddenBookKeys.includes(buildHiddenKey(book)));
  }, [authorData, searchQuery, filterStatus, sortBy, hiddenBookKeys]);

  // Count books by status
  const statusCounts = useMemo(() => {
    if (!authorData) return { read: 0, reading: 0, unread: 0 };
    return {
      read: authorData.books.filter(b => b.status === 'finished').length,
      reading: authorData.books.filter(b => b.status === 'reading').length,
      unread: authorData.books.filter(b => !b.inUserLibrary).length,
    };
  }, [authorData]);

  // Extract series
  const series = useMemo(() => {
    if (!authorData) return [];
    
    const seriesMap: { [name: string]: { books: AuthorBook[]; booksRead: number } } = {};
    
    authorData.books.forEach(book => {
      if (book.series) {
        if (!seriesMap[book.series]) {
          seriesMap[book.series] = { books: [], booksRead: 0 };
        }
        seriesMap[book.series].books.push(book);
        if (book.status === 'finished') {
          seriesMap[book.series].booksRead++;
        }
      }
    });

    return Object.entries(seriesMap).map(([name, data]) => ({
      name,
      books: data.books.sort((a, b) => {
        if (a.seriesPosition && b.seriesPosition) {
          return a.seriesPosition - b.seriesPosition;
        }
        return (a.publishedDate || '').localeCompare(b.publishedDate || '');
      }),
      totalBooks: data.books.length,
      booksRead: data.booksRead,
    }));
  }, [authorData]);

  const checklistBooks = useMemo(() => {
    if (!authorData) return [];
    return [...authorData.books]
      .filter((book) => !hiddenBookKeys.includes(buildHiddenKey(book)))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [authorData, hiddenBookKeys]);

  const checklistReadCount = checklistBooks.filter((book) => book.status === 'finished').length;

  const checklistThemeStyles = {
    minimal: {
      outerBg: 'linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)',
      borderColor: '#d7dee8',
      overlay: 'linear-gradient(rgba(148,163,184,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.04) 1px, transparent 1px)',
      coverBorder: '#cbd5e1',
      readColor: '#10b981',
      unreadColor: '#94a3b8',
    },
    bold: {
      outerBg: 'radial-gradient(circle at 12% 14%, rgba(56,189,248,0.20) 0%, rgba(56,189,248,0.02) 34%), radial-gradient(circle at 88% 10%, rgba(167,139,250,0.22) 0%, rgba(167,139,250,0.02) 36%), linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)',
      borderColor: '#d7dee8',
      overlay: 'linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)',
      coverBorder: '#cbd5e1',
      readColor: '#10b981',
      unreadColor: '#94a3b8',
    },
    vintage: {
      outerBg: 'radial-gradient(circle at 10% 8%, rgba(245,158,11,0.12) 0%, rgba(245,158,11,0.02) 36%), radial-gradient(circle at 88% 85%, rgba(217,119,6,0.10) 0%, rgba(217,119,6,0.02) 34%), linear-gradient(180deg, #f8f2e7 0%, #efe4d1 100%)',
      borderColor: '#d4bfa1',
      overlay: 'linear-gradient(rgba(120,53,15,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(120,53,15,0.06) 1px, transparent 1px)',
      coverBorder: '#d6c2a7',
      readColor: '#b45309',
      unreadColor: '#a8a29e',
    },
  } as const;

  const activeChecklistTheme = checklistThemeStyles[checklistTheme];

  const captureChecklistCanvas = async () => {
    if (!checklistRef.current) return null;
    const html2canvas = (await import('html2canvas')).default;
    return html2canvas(checklistRef.current, {
      backgroundColor: '#f3f4f6',
      scale: 2,
      allowTaint: true,
      useCORS: false,
      logging: false,
    });
  };

  const handleDownloadChecklist = async () => {
    try {
      const canvas = await captureChecklistCanvas();
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = `${authorData?.name || 'Author'}-checklist.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error downloading author checklist:', error);
    }
  };

  const handleShareChecklist = async () => {
    if (isSharingChecklist) return;
    setIsSharingChecklist(true);
    try {
      const canvas = await captureChecklistCanvas();
      if (!canvas) return;
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `${authorData?.name || 'Author'}-checklist.png`, { type: 'image/png' });
        try {
          if (navigator.share && navigator.canShare?.({ files: [file] })) {
            await navigator.share({
              files: [file],
              title: `${authorData?.name} Checklist`,
              text: `I’ve read ${checklistReadCount}/${checklistBooks.length} books by ${authorData?.name}!`,
            });
          } else {
            await handleDownloadChecklist();
          }
        } catch (shareError) {
          console.error('Error sharing author checklist:', shareError);
          await handleDownloadChecklist();
        } finally {
          setIsSharingChecklist(false);
        }
      }, 'image/png');
    } catch (error) {
      console.error('Error preparing checklist share:', error);
      setIsSharingChecklist(false);
    }
  };

  const handleOpenShelfSelector = async (book: AuthorBook) => {
    // Show modal immediately
    setBookForShelf(book);
    setShowShelfSelector(true);
  };

  const handleAddToShelf = async (shelfId: string) => {
    if (!bookForShelf) return;
    
    try {
      let bookId: string;
      
      // If book is not in library, add it first
      if (!bookForShelf.userBookId) {
        bookId = `book_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newBook = {
          id: bookId,
          title: bookForShelf.title,
          author: bookForShelf.author,
          cover: bookForShelf.cover || 'https://via.placeholder.com/400x600?text=No+Cover',
          pages: bookForShelf.pages || 0,
          status: 'want-to-read' as const,
          isbn: bookForShelf.isbn,
          shelves: [shelfId], // Add to shelf immediately
        };

        await addBook(newBook);
        console.log('✅ Book added to library with ID:', bookId);
      } else {
        // Book already in library, just add to shelf
        bookId = bookForShelf.userBookId;
        const userBook = books.find(b => b.id === bookForShelf.userBookId);
        if (!userBook) return;
        
        const currentShelves = userBook.shelves || [];
        if (!currentShelves.includes(shelfId)) {
          await updateBook(bookForShelf.userBookId, {
            shelves: [...currentShelves, shelfId]
          });
          console.log('✅ Book shelves array updated');
        }
      }
      
      // Update the shelf's bookIds array (critical for both new and existing books)
      const updatedShelves = bookshelves.map(shelf => {
        if (shelf.id === shelfId) {
          // Check if book is already in shelf's bookIds
          if (!shelf.bookIds.includes(bookId)) {
            console.log(`📚 Adding book ${bookId} to shelf "${shelf.name}"`);
            return {
              ...shelf,
              bookIds: [...shelf.bookIds, bookId]
            };
          }
        }
        return shelf;
      });
      
      await updateBookshelves(updatedShelves);
      console.log('✅ Shelf bookIds updated successfully');
      
      // Refresh in background
      refreshAuthor(authorName);
      
      setShowShelfSelector(false);
      setBookForShelf(null);
    } catch (error) {
      console.error('Failed to add book to shelf:', error);
    }
  };

  const handleMarkAsRead = async (book: AuthorBook) => {
    // Show the mark as read modal
    setBookToMarkAsRead(book);
    setRating(0);
    setFinishDate('');
    // Keep date fields blank so users can enter what they actually remember.
    setTempStartYear('');
    setTempStartMonth('');
    setTempStartDay('');
    setTempFinishYear('');
    setTempFinishMonth('');
    setTempFinishDay('');
    setShowMarkAsReadModal(true);
  };

  const handleConfirmMarkAsRead = async () => {
    if (!bookToMarkAsRead) return;
    
    try {
      // Build start date string
      let startDateString = '';
      if (tempStartYear) {
        if (tempStartMonth && tempStartDay) {
          // Full date
          const date = new Date(parseInt(tempStartYear), parseInt(tempStartMonth) - 1, parseInt(tempStartDay));
          startDateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } else if (tempStartMonth) {
          // Month and year only
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          startDateString = `${monthNames[parseInt(tempStartMonth) - 1]}, ${tempStartYear}`;
        } else {
          // Year only
          startDateString = tempStartYear;
        }
      }
      
      // Build finish date string
      let finishDateString = '';
      if (tempFinishYear) {
        if (tempFinishMonth && tempFinishDay) {
          // Full date
          const date = new Date(parseInt(tempFinishYear), parseInt(tempFinishMonth) - 1, parseInt(tempFinishDay));
          finishDateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } else if (tempFinishMonth) {
          // Month and year only
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          finishDateString = `${monthNames[parseInt(tempFinishMonth) - 1]}, ${tempFinishYear}`;
        } else {
          // Year only
          finishDateString = tempFinishYear;
        }
      }
      
      // If book is not in library, add it first with 'finished' status
      if (!bookToMarkAsRead.userBookId) {
        const newBook = {
          id: `book_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title: bookToMarkAsRead.title,
          author: bookToMarkAsRead.author,
          cover: bookToMarkAsRead.cover || 'https://via.placeholder.com/400x600?text=No+Cover',
          pages: bookToMarkAsRead.pages || 0,
          status: 'finished' as const,
          isbn: bookToMarkAsRead.isbn,
          rating: rating > 0 ? rating : undefined,
          startDate: startDateString || undefined,
          finishDate: finishDateString || undefined,
        };

        await addBook(newBook);
        console.log('✅ Book added and marked as read:', bookToMarkAsRead.title);
      } else {
        // Book already in library, just update status
        await updateBook(bookToMarkAsRead.userBookId, { 
          status: 'finished',
          rating: rating > 0 ? rating : undefined,
          startDate: startDateString || undefined,
          finishDate: finishDateString || undefined,
        });
        console.log('✅ Book marked as read:', bookToMarkAsRead.title);
      }
      
      // Refresh author data to update statuses
      await refreshAuthor(authorName);
      
      // Close modal
      setShowMarkAsReadModal(false);
      setBookToMarkAsRead(null);
      setRating(0);
      setFinishDate('');
    } catch (error) {
      console.error('Failed to mark book as read:', error);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshAuthor(authorName);
    setIsRefreshing(false);
  };

  if (!authorData) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: currentTheme.backgroundColor }}>
        <div className="text-center">
          <p style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}>
            Author not found
          </p>
          <button
            onClick={onClose}
            className="mt-4 px-6 py-2 rounded-xl font-semibold text-white"
            style={{ background: getGradientBg() }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const completionPercentage = authorData.totalBooks > 0
    ? Math.round((authorData.booksRead / authorData.totalBooks) * 100)
    : 0;

  if (isChecklistView) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto" style={{ backgroundColor: currentTheme.backgroundColor }}>
        <div className="sticky top-0 z-10 border-b" style={{ backgroundColor: currentTheme.backgroundColor, borderColor: currentTheme.borderColor }}>
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setIsChecklistView(false)}
              className="p-2 rounded-xl transition-colors"
              style={{ color: currentTheme.textColor === 'light' ? '#d1d5db' : '#374151' }}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h2
              className="text-lg font-bold flex-1 text-center"
              style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
            >
              Author Checklist
            </h2>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleShareChecklist}
                disabled={isSharingChecklist}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95"
                style={{
                  backgroundColor: currentTheme.textColor === 'light' ? 'rgba(255,255,255,0.08)' : '#f3f4f6',
                  color: currentTheme.textColor === 'light' ? '#e5e7eb' : '#374151',
                  opacity: isSharingChecklist ? 0.7 : 1,
                }}
              >
                <Share2 className="w-3.5 h-3.5" />
                Share
              </button>
              <button
                onClick={handleDownloadChecklist}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95"
                style={{
                  background: getGradientBg(),
                  color: '#ffffff',
                }}
              >
                <Download className="w-3.5 h-3.5" />
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 pt-4 pb-24">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span
              className="text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
            >
              Checklist Style
            </span>
            <div className="flex gap-1.5">
              {([
                { key: 'minimal', label: 'Minimal' },
                { key: 'bold', label: 'Bold' },
                { key: 'vintage', label: 'Vintage' },
              ] as const).map((themeOption) => (
                <button
                  key={themeOption.key}
                  onClick={() => setChecklistTheme(themeOption.key)}
                  className="px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all"
                  style={{
                    background:
                      checklistTheme === themeOption.key
                        ? getGradientBg()
                        : (currentTheme.textColor === 'light' ? 'rgba(255,255,255,0.08)' : '#f3f4f6'),
                    color:
                      checklistTheme === themeOption.key
                        ? '#ffffff'
                        : (currentTheme.textColor === 'light' ? '#d1d5db' : '#4b5563'),
                  }}
                >
                  {themeOption.label}
                </button>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl border overflow-hidden shadow-xl"
            style={{ borderColor: currentTheme.borderColor, backgroundColor: currentTheme.cardColor }}
          >
            <div
              className="px-4 py-3.5 border-b"
              style={{
                borderColor: currentTheme.borderColor,
                background: currentTheme.isGradient
                  ? `linear-gradient(135deg, ${currentTheme.primary}22 0%, ${currentTheme.secondary}22 100%)`
                  : currentTheme.cardColor,
              }}
            >
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h3
                    className="text-sm font-black tracking-[0.08em]"
                    style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
                  >
                    AUTHOR CHECKLIST
                  </h3>
                  <p
                    className="text-[11px] mt-0.5"
                    style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                  >
                    {authorData.name}
                  </p>
                </div>
                <div
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                  style={{
                    backgroundColor: currentTheme.textColor === 'light' ? 'rgba(255,255,255,0.1)' : '#e5e7eb',
                    color: currentTheme.textColor === 'light' ? '#e5e7eb' : '#374151',
                  }}
                >
                  {checklistReadCount}/{checklistBooks.length} COMPLETE
                </div>
              </div>
            </div>

            <div
              className="p-3.5"
              style={{
                backgroundColor: currentTheme.textColor === 'light' ? '#111827' : '#f8fafc',
              }}
            >
              <div
                ref={checklistRef}
                className="relative overflow-hidden rounded-[22px] p-4 border"
                style={{
                  background: activeChecklistTheme.outerBg,
                  borderColor: activeChecklistTheme.borderColor,
                  boxShadow:
                    '0 14px 28px rgba(15,23,42,0.12), inset 0 1px 0 rgba(255,255,255,0.95)',
                }}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: activeChecklistTheme.overlay,
                    backgroundSize: '22px 22px',
                    maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.08))',
                  }}
                />
                <div className="mb-4 flex items-end justify-between gap-3">
                  <div>
                    <h4 className="text-[24px] font-black text-slate-900 leading-tight tracking-tight">
                      {authorData.name}
                    </h4>
                    <p className="text-[18px] font-semibold text-slate-700 leading-tight">
                      Checklist
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-[22px] font-black text-emerald-600 leading-none">
                      {checklistReadCount}
                    </div>
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      Read
                    </div>
                  </div>
                </div>

                <div className="mb-3.5 h-px bg-slate-300/80" />

                <div className="grid grid-cols-4 gap-2.5">
                  {checklistBooks.map((book, index) => {
                    const isRead = book.status === 'finished';
                    return (
                      <div key={`${book.googleBooksId || book.title}-${index}`} className="flex flex-col items-center">
                        <div
                          className="w-full aspect-[2/3] rounded-xl overflow-hidden border bg-white shadow-md"
                          style={{ borderColor: activeChecklistTheme.coverBorder }}
                        >
                          {book.cover ? (
                            <BookCover src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-200">
                              <BookOpen className="w-7 h-7 text-slate-400" />
                            </div>
                          )}
                        </div>

                        <div className="mt-1.5 flex items-center justify-center gap-1.5">
                          <div
                            className="w-5 h-5 rounded-md border-2 flex items-center justify-center"
                            style={{
                              borderColor: isRead ? activeChecklistTheme.readColor : activeChecklistTheme.unreadColor,
                              backgroundColor: isRead ? activeChecklistTheme.readColor : '#ffffff',
                            }}
                          >
                            {isRead && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                          </div>
                          {isRead && (
                            <span
                              className="text-[9px] font-bold tracking-wide uppercase"
                              style={{ color: activeChecklistTheme.readColor }}
                            >
                              Read
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3.5 text-center text-[10px] font-medium text-slate-500">
                  Check off every title as you finish it
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ backgroundColor: currentTheme.backgroundColor }}>
      {/* Header */}
      <div className="sticky top-0 z-10" style={{ backgroundColor: currentTheme.backgroundColor }}>
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: currentTheme.borderColor }}>
          <button
            onClick={onClose}
            className="p-2 rounded-xl transition-colors"
            style={{ color: currentTheme.textColor === 'light' ? '#d1d5db' : '#374151' }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2
            className="text-lg font-bold flex-1 text-center"
            style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
          >
            {authorData.name}
          </h2>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl transition-all"
            style={{
              color: currentTheme.textColor === 'light' ? '#d1d5db' : '#374151',
              opacity: isRefreshing ? 0.5 : 1,
            }}
          >
            <Sparkles className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Stats Bar */}
        <div
          className="p-5"
          style={{
            background: getGradientBg(),
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="text-white">
              <div className="text-3xl font-bold mb-1">{authorData.booksRead} / {authorData.totalBooks}</div>
              <div className="text-white/80 text-sm">Books Read</div>
            </div>
            <div className="text-right text-white">
              <div className="text-3xl font-bold mb-1">{completionPercentage}%</div>
              <div className="text-white/80 text-sm">Complete</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="h-2.5 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>

          {/* Series Count */}
          {series.length > 0 && (
            <div className="mt-3 text-white/90 text-sm font-medium">
              📚 {series.length} {series.length === 1 ? 'Series' : 'Series'}
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="p-4 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
              style={{ color: currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af' }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm"
              style={{
                backgroundColor: currentTheme.cardColor,
                borderColor: currentTheme.borderColor,
                color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827',
              }}
            />
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['all', 'read', 'reading', 'unread'].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterStatus(filter as any)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all"
                style={{
                  background: filterStatus === filter ? getGradientBg() : currentTheme.cardColor,
                  color: filterStatus === filter ? '#ffffff' : (currentTheme.textColor === 'light' ? '#d1d5db' : '#374151'),
                  borderWidth: filterStatus === filter ? '0' : '1px',
                  borderColor: currentTheme.borderColor,
                }}
              >
                {filter === 'all' && 'All Books'}
                {filter === 'read' && '✓ Read'}
                {filter === 'reading' && '📖 Reading'}
                {filter === 'unread' && 'Unread'}
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex gap-2">
            <span
              className="text-xs font-medium flex items-center gap-1"
              style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
            >
              <Filter className="w-3 h-3" />
              Sort:
            </span>
            {['newest', 'oldest', 'title'].map((sort) => (
              <button
                key={sort}
                onClick={() => setSortBy(sort as any)}
                className="px-3 py-1 rounded-lg text-xs font-medium transition-all"
                style={{
                  backgroundColor: sortBy === sort ? currentTheme.accentColor + '20' : 'transparent',
                  color: sortBy === sort ? currentTheme.accentColor : (currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280'),
                }}
              >
                {sort === 'newest' && 'Newest'}
                {sort === 'oldest' && 'Oldest'}
                {sort === 'title' && 'Title'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Books List - Mobile Optimized */}
      <div className="px-4 pb-24 space-y-3">
        {checklistBooks.length > 0 && (
          <button
            onClick={() => setIsChecklistView(true)}
            className="w-full rounded-2xl border p-3 text-left transition-all active:scale-[0.99]"
            style={{
              borderColor: currentTheme.borderColor,
              backgroundColor: currentTheme.cardColor,
              boxShadow: currentTheme.textColor === 'light' ? '0 12px 28px rgba(0,0,0,0.28)' : '0 10px 24px rgba(17,24,39,0.08)',
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: getGradientBg(),
                  }}
                >
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div
                    className="text-[13px] font-extrabold leading-tight"
                    style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
                  >
                    View Author Checklist
                  </div>
                  <div
                    className="text-[11px] mt-0.5"
                    style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                  >
                    Share-ready graphic • {checklistReadCount}/{checklistBooks.length} complete
                  </div>
                </div>
              </div>
            </div>
          </button>
        )}

        {filteredBooks.map((book, index) => {
          // Determine status for visual indicators
          const isRead = book.status === 'finished';
          const isReading = book.status === 'reading';
          const isInLibrary = book.inUserLibrary && !isRead && !isReading;
          const isUnread = !book.inUserLibrary;

          return (
            <motion.div
              key={`${book.googleBooksId}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className="rounded-2xl overflow-hidden border shadow-sm"
              style={{
                backgroundColor: isRead 
                  ? (currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.15)')
                  : currentTheme.cardColor,
                borderColor: currentTheme.borderColor,
                opacity: isRead ? 0.65 : 1,
              }}
            >
              <div className="flex gap-3 p-3">
                {/* Book Cover - Smaller for list view */}
                <div className="relative flex-shrink-0 w-20 h-28 rounded-lg overflow-hidden bg-gray-100">
                  {book.cover ? (
                    <BookCover src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: getGradientBg() }}
                    >
                      <BookOpen className="w-8 h-8 text-white/50" />
                    </div>
                  )}

                  {/* Status Corner Badge */}
                  {book.inUserLibrary && (
                    <div className="absolute -top-1 -right-1">
                      {isRead ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg border-2 border-white">
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        </div>
                      ) : isReading ? (
                        <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center shadow-lg border-2 border-white">
                          <Clock className="w-3 h-3 text-white" />
                        </div>
                      ) : (
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                          style={{ background: getGradientBg() }}
                        >
                          <BookOpen className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Book Info - Expanded for list view */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    {/* Title */}
                    <h3
                      className="font-bold text-sm mb-1 line-clamp-2 leading-tight"
                      style={{ 
                        color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827',
                        opacity: isRead ? 0.7 : 1,
                        textDecoration: isRead ? 'line-through' : 'none'
                      }}
                    >
                      {book.title}
                    </h3>

                    {/* Series Info */}
                    {book.series && (
                      <p
                        className="text-[11px] mb-1.5 font-medium"
                        style={{ color: currentTheme.accentColor }}
                      >
                        {book.series} {book.seriesPosition && `#${book.seriesPosition}`}
                      </p>
                    )}

                    {/* Metadata */}
                    <div
                      className="flex items-center gap-1.5 text-[10px] mb-2"
                      style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                    >
                      {book.publishedDate && (
                        <>
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(book.publishedDate).getFullYear()}</span>
                        </>
                      )}
                      {book.pages && (
                        <>
                          <span>•</span>
                          <span>{book.pages}p</span>
                        </>
                      )}
                    </div>

                  </div>

                  {/* Status Indicator / Action Button */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {isRead && (
                      <>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="text-xs font-semibold">Read</span>
                        </div>
                        <button
                          onClick={() => handleOpenShelfSelector(book)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white transition-all active:scale-95"
                          style={{ background: getGradientBg() }}
                        >
                          <Library className="w-3.5 h-3.5" />
                          <span className="text-xs font-semibold">Add to Shelf</span>
                        </button>
                      </>
                    )}
                    
                    {isReading && (
                      <>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-xs font-semibold">Reading</span>
                        </div>
                        <button
                          onClick={() => handleOpenShelfSelector(book)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white transition-all active:scale-95"
                          style={{ background: getGradientBg() }}
                        >
                          <Library className="w-3.5 h-3.5" />
                          <span className="text-xs font-semibold">Add to Shelf</span>
                        </button>
                        <button
                          onClick={() => handleMarkAsRead(book)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-all active:scale-95"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="text-xs font-semibold">Mark Read</span>
                        </button>
                      </>
                    )}
                    
                    {isInLibrary && (
                      <>
                        <button
                          onClick={() => handleOpenShelfSelector(book)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white transition-all active:scale-95"
                          style={{ background: getGradientBg() }}
                        >
                          <Library className="w-3.5 h-3.5" />
                          <span className="text-xs font-semibold">Add to Shelf</span>
                        </button>
                        <button
                          onClick={() => handleMarkAsRead(book)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-all active:scale-95"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="text-xs font-semibold">Mark Read</span>
                        </button>
                      </>
                    )}
                    
                    {isUnread && (
                      <>
                        <button
                          onClick={() => handleOpenShelfSelector(book)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white transition-all active:scale-95"
                          style={{ background: getGradientBg() }}
                        >
                          <Library className="w-3.5 h-3.5" />
                          <span className="text-xs font-semibold">Add to Shelf</span>
                        </button>
                        <button
                          onClick={() => handleMarkAsRead(book)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-all active:scale-95"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span className="text-xs font-semibold">Mark Read</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Right rail actions */}
                <div className="ml-2 self-stretch flex flex-col items-end justify-between">
                  {isInLibrary && (
                    <div 
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                      style={{
                        backgroundColor: currentTheme.accentColor + '15',
                        color: currentTheme.accentColor,
                      }}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span className="text-xs font-semibold">In Library</span>
                    </div>
                  )}

                  <button
                    onClick={() => hideBookFromList(book)}
                    className="text-[8px] uppercase whitespace-nowrap leading-none underline underline-offset-2"
                    style={{
                      color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280',
                    }}
                  >
                    Remove from list
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}

        {filteredBooks.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }} />
            <p className="text-base font-medium mb-1" style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}>
              No books found
            </p>
            <p className="text-sm" style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}>
              {searchQuery ? 'Try adjusting your search' : 'Try a different filter'}
            </p>
          </div>
        )}
      </div>

      {/* Shelf Selector Modal */}
      <AnimatePresence>
        {showShelfSelector && bookForShelf && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={() => {
              setShowShelfSelector(false);
              setBookForShelf(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
              style={{ backgroundColor: currentTheme.cardColor }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="p-5"
                style={{ background: getGradientBg() }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Library className="w-6 h-6 text-white" />
                    <div>
                      <h3 className="text-lg font-bold text-white">Add to Shelf</h3>
                      <p className="text-sm text-white/80 line-clamp-1">{bookForShelf.title}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowShelfSelector(false);
                      setBookForShelf(null);
                    }}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Shelves List */}
              <div className="p-4 max-h-[60vh] overflow-y-auto">
                <div className="space-y-2">
                  {bookshelves.map((shelf) => {
                    const userBook = books.find(b => b.id === bookForShelf.userBookId);
                    const isOnShelf = userBook?.shelves?.includes(shelf.id);
                    
                    return (
                      <button
                        key={shelf.id}
                        onClick={() => handleAddToShelf(shelf.id)}
                        disabled={isOnShelf}
                        className="w-full p-4 rounded-xl border transition-all text-left"
                        style={{
                          backgroundColor: isOnShelf ? currentTheme.accentColor + '10' : currentTheme.backgroundColor,
                          borderColor: isOnShelf ? currentTheme.accentColor : currentTheme.borderColor,
                          opacity: isOnShelf ? 0.6 : 1,
                          cursor: isOnShelf ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{
                                background: isOnShelf ? currentTheme.accentColor : getGradientBg(),
                              }}
                            >
                              {isOnShelf ? (
                                <CheckCircle2 className="w-5 h-5 text-white" />
                              ) : (
                                <Library className="w-5 h-5 text-white" />
                              )}
                            </div>
                            <div>
                              <h4
                                className="font-semibold text-sm"
                                style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
                              >
                                {shelf.name}
                              </h4>
                              <p
                                className="text-xs mt-0.5"
                                style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                              >
                                {shelf.bookIds?.length || 0} books
                              </p>
                            </div>
                          </div>
                          {isOnShelf && (
                            <span
                              className="text-xs font-semibold px-2 py-1 rounded-lg"
                              style={{
                                backgroundColor: currentTheme.accentColor + '20',
                                color: currentTheme.accentColor,
                              }}
                            >
                              Already on shelf
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mark as Read Modal */}
      <AnimatePresence>
        {showMarkAsReadModal && bookToMarkAsRead && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={() => {
              setShowMarkAsReadModal(false);
              setBookToMarkAsRead(null);
              setRating(0);
              setFinishDate('');
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
              style={{ backgroundColor: currentTheme.cardColor }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="p-5"
                style={{ background: getGradientBg() }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                    <div>
                      <h3 className="text-lg font-bold text-white">Mark as Read</h3>
                      <p className="text-sm text-white/80 line-clamp-1">{bookToMarkAsRead.title}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowMarkAsReadModal(false);
                      setBookToMarkAsRead(null);
                      setRating(0);
                      setFinishDate('');
                    }}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <div className="p-4 max-h-[60vh] overflow-y-auto">
                <div className="space-y-5">
                  {/* Start Date */}
                  <div>
                    <label 
                      className="text-xs font-bold mb-2 block uppercase tracking-wider"
                      style={{ color: currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af' }}
                    >
                      When Did You Start?
                    </label>
                    <p
                      className="text-[11px] mb-2"
                      style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                    >
                      Enter what you remember. Year-only or month/year is totally fine.
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        value={tempStartYear}
                        onChange={(e) => setTempStartYear(e.target.value)}
                        placeholder="Year"
                        min="1900"
                        max="2100"
                        className="px-3 py-2.5 rounded-xl text-sm"
                        style={{
                          backgroundColor: currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.05)' : '#f3f4f6',
                          borderColor: currentTheme.borderColor,
                          color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827',
                        }}
                      />
                      <input
                        type="number"
                        value={tempStartMonth}
                        onChange={(e) => setTempStartMonth(e.target.value)}
                        placeholder="Month"
                        min="1"
                        max="12"
                        className="px-3 py-2.5 rounded-xl text-sm"
                        style={{
                          backgroundColor: currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.05)' : '#f3f4f6',
                          borderColor: currentTheme.borderColor,
                          color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827',
                        }}
                      />
                      <input
                        type="number"
                        value={tempStartDay}
                        onChange={(e) => setTempStartDay(e.target.value)}
                        placeholder="Day"
                        min="1"
                        max="31"
                        className="px-3 py-2.5 rounded-xl text-sm"
                        style={{
                          backgroundColor: currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.05)' : '#f3f4f6',
                          borderColor: currentTheme.borderColor,
                          color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827',
                        }}
                      />
                    </div>
                  </div>

                  {/* Divider */}
                  <div 
                    className="h-px" 
                    style={{ backgroundColor: currentTheme.borderColor }}
                  />

                  {/* Finish Date */}
                  <div>
                    <label 
                      className="text-xs font-bold mb-2 block uppercase tracking-wider"
                      style={{ color: currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af' }}
                    >
                      When Did You Finish?
                    </label>
                    <p
                      className="text-[11px] mb-2"
                      style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                    >
                      Only fill the parts you know. You can leave unknown fields blank.
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="number"
                        value={tempFinishYear}
                        onChange={(e) => setTempFinishYear(e.target.value)}
                        placeholder="Year"
                        min="1900"
                        max="2100"
                        className="px-3 py-2.5 rounded-xl text-sm"
                        style={{
                          backgroundColor: currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.05)' : '#f3f4f6',
                          borderColor: currentTheme.borderColor,
                          color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827',
                        }}
                      />
                      <input
                        type="number"
                        value={tempFinishMonth}
                        onChange={(e) => setTempFinishMonth(e.target.value)}
                        placeholder="Month"
                        min="1"
                        max="12"
                        className="px-3 py-2.5 rounded-xl text-sm"
                        style={{
                          backgroundColor: currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.05)' : '#f3f4f6',
                          borderColor: currentTheme.borderColor,
                          color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827',
                        }}
                      />
                      <input
                        type="number"
                        value={tempFinishDay}
                        onChange={(e) => setTempFinishDay(e.target.value)}
                        placeholder="Day"
                        min="1"
                        max="31"
                        className="px-3 py-2.5 rounded-xl text-sm"
                        style={{
                          backgroundColor: currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.05)' : '#f3f4f6',
                          borderColor: currentTheme.borderColor,
                          color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827',
                        }}
                      />
                    </div>
                  </div>

                  {/* Divider */}
                  <div 
                    className="h-px" 
                    style={{ backgroundColor: currentTheme.borderColor }}
                  />

                  {/* Rating */}
                  <div>
                    <label 
                      className="text-xs font-bold mb-2 block uppercase tracking-wider"
                      style={{ color: currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af' }}
                    >
                      Rating
                    </label>
                    
                    {/* Star Display */}
                    <div className="flex items-center justify-center gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const filled = rating >= star;
                        const remainder = rating - (star - 1);
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
                        {rating > 0 ? rating.toFixed(2) : '0.00'}
                      </span>
                      <span 
                        className="text-sm ml-1"
                        style={{ color: currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af' }}
                      >
                        / 5.00
                      </span>
                    </div>

                    {/* Slider with visible thumb */}
                    <div className="relative h-2 rounded-lg" style={{ backgroundColor: currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.1)' : '#e5e7eb' }}>
                      {/* Filled progress bar */}
                      <div 
                        className="absolute h-2 rounded-lg pointer-events-none transition-all duration-200"
                        style={{ 
                          width: `${(rating / 5) * 100}%`, 
                          background: getGradientBg()
                        }}
                      />
                      
                      {/* Visible circle thumb */}
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white shadow-lg pointer-events-none transition-all duration-200"
                        style={{ 
                          left: `calc(${(rating / 5) * 100}% - 10px)`,
                          background: getGradientBg(),
                        }}
                      />
                      
                      {/* Hidden input slider */}
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.25"
                        value={rating}
                        onChange={(e) => setRating(parseFloat(e.target.value))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-4 pt-3 pb-4 space-y-2">
                <button
                  onClick={handleConfirmMarkAsRead}
                  className="w-full py-3 rounded-xl text-white font-semibold transition-all active:scale-95"
                  style={{ background: getGradientBg() }}
                >
                  Confirm & Mark as Read
                </button>
                <button
                  onClick={() => {
                    setShowMarkAsReadModal(false);
                    setBookToMarkAsRead(null);
                    setRating(0);
                    setFinishDate('');
                  }}
                  className="w-full py-3 rounded-xl font-semibold transition-all active:scale-95"
                  style={{ 
                    backgroundColor: currentTheme.textColor === 'light' ? 'rgba(255, 255, 255, 0.05)' : '#f3f4f6',
                    color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280',
                  }}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
