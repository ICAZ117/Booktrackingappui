import { X, Search, Plus, Camera, BookOpen, Barcode, Edit3, TrendingUp, Sparkles, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { BookCover } from './BookCover';
import { useTheme } from '../contexts/ThemeContext';
import { searchBooks, getTrendingBooks, convertGoogleBookToBookData, BookData } from '../utils/googleBooksApi';
import { LoadingSpinner } from './LoadingSpinner';

interface AddBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBook: (book: any, selectedShelfIds: string[]) => void;
  availableShelves?: { id: string; name: string }[];
  contextShelfId?: string | null;
}

const popularBooks = [
  { title: "Fourth Wing", author: "Rebecca Yarros", cover: "https://images.unsplash.com/photo-1760448847959-bd3aec9e672c?w=400", genre: "Fantasy", rating: 4.8, pages: 498 },
  { title: "The Housemaid", author: "Freida McFadden", cover: "https://images.unsplash.com/photo-1760696473709-a7da66ee87a6?w=400", genre: "Thriller", rating: 4.6, pages: 336 },
  { title: "Happy Place", author: "Emily Henry", cover: "https://images.unsplash.com/photo-1711185896093-460428ace516?w=400", genre: "Romance", rating: 4.4, pages: 400 },
  { title: "Holly", author: "Stephen King", cover: "https://images.unsplash.com/photo-1614193471837-27a61f4ccc8d?w=400", genre: "Horror", rating: 4.2, pages: 464 },
  { title: "The Woman in Me", author: "Britney Spears", cover: "https://images.unsplash.com/photo-1770304171975-4e2feedf3247?w=400", genre: "Biography", rating: 4.7, pages: 288 },
  { title: "Lessons in Chemistry", author: "Bonnie Garmus", cover: "https://images.unsplash.com/photo-1721552023489-6c2ec21d297f?w=400", genre: "Fiction", rating: 4.5, pages: 400 },
  { title: "Iron Flame", author: "Rebecca Yarros", cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400", genre: "Fantasy", rating: 4.7, pages: 623 },
  { title: "The Midnight Library", author: "Matt Haig", cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400", genre: "Fiction", rating: 4.3, pages: 304 },
];

export function AddBookModal({ isOpen, onClose, onAddBook, availableShelves = [], contextShelfId = null }: AddBookModalProps) {
  const { currentTheme } = useTheme();
  const [view, setView] = useState<'main' | 'search' | 'manual' | 'isbn' | 'confirm'>('main');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShelf, setSelectedShelf] = useState('Want to Read');
  const [selectedShelfIds, setSelectedShelfIds] = useState<string[]>([]);
  const [pendingBook, setPendingBook] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<BookData[]>([]);
  const [trendingBooks, setTrendingBooks] = useState<BookData[]>([]);
  const [showShelfPopup, setShowShelfPopup] = useState(false);
  const [selectedBookForShelf, setSelectedBookForShelf] = useState<any>(null);
  const [manualBookData, setManualBookData] = useState({
    title: '',
    author: '',
    pages: '',
    genre: '',
    yearPublished: '',
    format: 'physical' as 'physical' | 'ebook' | 'audiobook',
    audioDuration: '', // in minutes
  });

  // Load trending books when opening the modal
  useEffect(() => {
    if (isOpen && view === 'main') {
      loadTrendingBooks();
    }
  }, [isOpen, view]);

  // Initialize selected shelves based on context
  useEffect(() => {
    if (isOpen) {
      if (contextShelfId) {
        setSelectedShelfIds([contextShelfId]);
      } else {
        setSelectedShelfIds([]);
      }
    }
  }, [isOpen, contextShelfId]);

  // Search books when query changes
  useEffect(() => {
    if (view === 'search' && searchQuery.trim().length > 0) {
      const timeoutId = setTimeout(() => {
        performSearch();
      }, 500); // Debounce search

      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, view]);

  const loadTrendingBooks = async () => {
    try {
      const books = await getTrendingBooks();
      const bookData = books.map(convertGoogleBookToBookData);
      setTrendingBooks(bookData.slice(0, 9));
    } catch (error) {
      console.error('Error loading trending books:', error);
      // Fallback to empty array if trending books fail to load
      setTrendingBooks([]);
    }
  };

  const performSearch = async () => {
    setIsSearching(true);
    try {
      const results = await searchBooks({
        query: searchQuery,
        maxResults: 20,
      });
      const bookData = results.map(convertGoogleBookToBookData);
      setSearchResults(bookData);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const getGradientBg = () => {
    if (!currentTheme.isGradient) {
      return currentTheme.primary;
    }
    
    // Support 3-color gradients (Red → Purple → Blue)
    if (currentTheme.tertiary) {
      return `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.tertiary} 50%, ${currentTheme.secondary} 100%)`;
    }
    
    // Standard 2-color gradient
    return `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`;
  };

  const filteredBooks = popularBooks.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddBook = (book: any) => {
    console.log('📚 [AddBookModal] handleAddBook called with book:', {
      title: book.title,
      author: book.author,
      status: book.status,
      hasStatus: 'status' in book
    });
    setSelectedBookForShelf(book);
    setShowShelfPopup(true);
  };

  const handleShelfSelection = (shelfId: string, shelfName: string) => {
    console.log('🔵 [AddBookModal] handleShelfSelection called with:', { shelfId, shelfName });
    
    if (selectedBookForShelf) {
      // Map shelf to actual shelf ID and status
      let shelfIds: string[] = [];
      let status = 'want-to-read';
      
      // Handle special "Currently Reading" status
      if (shelfName === 'Currently Reading' || shelfId === 'currently-reading') {
        shelfIds = [];
        status = 'reading';
        console.log('  📗 Mapped to: Currently Reading (no shelf), status=reading');
      } else {
        // For all other shelves (including custom ones), use the shelf ID
        shelfIds = [shelfId];
        status = 'want-to-read';
        console.log(`  📘 Mapped to: ${shelfName} shelf (${shelfId}), status=want-to-read`);
      }
      
      console.log('  ✅ Final mapping:', { shelfIds, status });
      
      const bookToAdd = { ...selectedBookForShelf, status };
      console.log('  📦 Book to add:', {
        title: bookToAdd.title,
        status: bookToAdd.status,
        shelfIds
      });
      
      onAddBook(bookToAdd, shelfIds);
      setShowShelfPopup(false);
      setSelectedBookForShelf(null);
      onClose();
      setView('main');
      setSearchQuery('');
      setSelectedShelfIds([]);
    }
  };

  const confirmAddBook = () => {
    if (pendingBook) {
      onAddBook(pendingBook, selectedShelfIds);
      onClose();
      setView('main');
      setSearchQuery('');
      setSelectedShelfIds([]);
      setPendingBook(null);
    }
  };

  const toggleShelfSelection = (shelfId: string) => {
    setSelectedShelfIds(prev => {
      if (prev.includes(shelfId)) {
        return prev.filter(id => id !== shelfId);
      } else {
        return [...prev, shelfId];
      }
    });
  };

  const handleManualAdd = () => {
    if (manualBookData.title && manualBookData.author) {
      const bookToAdd: any = {
        ...manualBookData,
        cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
        shelf: selectedShelf,
        status: 'want-to-read',
        pages: parseInt(manualBookData.pages) || 0,
        format: manualBookData.format,
      };
      
      // If audiobook, convert hours to minutes for audioDuration
      if (manualBookData.format === 'audiobook' && manualBookData.audioDuration) {
        bookToAdd.audioDuration = parseFloat(manualBookData.audioDuration) * 60; // Convert hours to minutes
        bookToAdd.currentMinutes = 0; // Initialize listening progress
      }
      
      setPendingBook(bookToAdd);
      setView('confirm');
    }
  };

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      setView('main');
      setSearchQuery('');
    }, 300);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-50"
              onClick={resetAndClose}
            />

            {/* Bottom Sheet Modal */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 35, stiffness: 400 }}
              className="fixed left-1/2 -translate-x-1/2 bottom-0 z-50 rounded-t-[20px] h-[85vh] w-full max-w-[428px] overflow-hidden flex flex-col shadow-2xl"
              style={{
                background: `linear-gradient(145deg, ${currentTheme.primary}30 0%, ${currentTheme.secondary}25 100%)`,
                backdropFilter: 'blur(20px)'
              }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-2 pb-2 flex-shrink-0">
                <div className="w-10 h-1 bg-gray-700 rounded-full" />
              </div>

              {/* Main View - Add Options */}
              {view === 'main' && (
                <div className="flex-1 overflow-y-auto flex flex-col">
                  {/* Header */}
                  <div className="px-4 pb-3 flex-shrink-0">
                    <div className="flex items-center justify-between mb-1">
                      <h2 className="text-xl font-bold text-white">Add Book</h2>
                      <button
                        onClick={resetAndClose}
                        className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">Choose how you'd like to add</p>
                  </div>

                  {/* Add Options Grid */}
                  <div className="px-4 pb-4 grid grid-cols-2 gap-2.5 flex-shrink-0">
                    {/* Search & Browse */}
                    <button
                      onClick={() => setView('search')}
                      className="rounded-xl p-4 text-left active:scale-95 transition-transform"
                      style={{
                        background: getGradientBg(),
                      }}
                    >
                      <div className="bg-white/20 rounded-lg p-2 w-fit mb-2">
                        <Search className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-sm font-bold text-white mb-0.5">Search</h3>
                      <p className="text-[10px] text-white/70">Find books</p>
                    </button>

                    {/* Scan ISBN */}
                    <button
                      onClick={() => setView('isbn')}
                      className="rounded-xl p-4 text-left active:scale-95 transition-transform"
                      style={{
                        background: getGradientBg(),
                      }}
                    >
                      <div className="bg-white/20 rounded-lg p-2 w-fit mb-2">
                        <Barcode className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-sm font-bold text-white mb-0.5">Scan ISBN</h3>
                      <p className="text-[10px] text-white/70">Barcode scan</p>
                    </button>

                    {/* Manual Entry */}
                    <button
                      onClick={() => setView('manual')}
                      className="rounded-xl p-4 text-left active:scale-95 transition-transform"
                      style={{
                        background: getGradientBg(),
                      }}
                    >
                      <div className="bg-white/20 rounded-lg p-2 w-fit mb-2">
                        <Edit3 className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-sm font-bold text-white mb-0.5">Manual Entry</h3>
                      <p className="text-[10px] text-white/70">Type details</p>
                    </button>

                    {/* Import from Camera */}
                    <button
                      onClick={() => alert('Camera feature coming soon!')}
                      className="rounded-xl p-4 text-left active:scale-95 transition-transform"
                      style={{
                        background: getGradientBg(),
                      }}
                    >
                      <div className="bg-white/20 rounded-lg p-2 w-fit mb-2">
                        <Camera className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-sm font-bold text-white mb-0.5">Cover Photo</h3>
                      <p className="text-[10px] text-white/70">Snap cover</p>
                    </button>
                  </div>

                  {/* Quick Add Section */}
                  <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                    <div className="px-4 py-2 flex items-center gap-2 border-t border-gray-800 flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-[#3298ff]" />
                      <h3 className="text-xs font-bold text-white">Trending Now</h3>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto px-4 pb-4">
                      <div className="grid grid-cols-3 gap-2.5">
                        {trendingBooks.map((book, index) => (
                          <div
                            key={book.isbn || book.googleBooksId || `modal-trending-${book.title}-${index}`}
                            className="relative group"
                          >
                            {/* Clickable book cover - opens detail page */}
                            <button
                              onClick={() => {
                                // Navigate to book detail page
                                const bookToAdd = { ...book, status: 'want-to-read' };
                                onAddBook(bookToAdd, []);
                                onClose();
                                setView('main');
                              }}
                              className="w-full"
                            >
                              <div className="relative mb-1.5">
                                <BookCover
                                  src={book.cover}
                                  alt={book.title}
                                  className="w-full aspect-[2/3] object-cover rounded-lg shadow-lg"
                                />
                              </div>
                              <h4 className="text-[9px] font-bold text-gray-300 line-clamp-2 leading-tight text-left">{book.title}</h4>
                            </button>
                            
                            {/* Add to shelf button - overlayed on cover */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddBook(book);
                              }}
                              className="absolute top-0 right-0 m-1.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 active:scale-90 transition-all shadow-lg"
                            >
                              <Plus className="w-4 h-4 text-gray-900" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Search View */}
              {view === 'search' && (
                <div className="flex-1 overflow-hidden flex flex-col">
                  {/* Header with Back */}
                  <div className="px-4 pb-3 flex-shrink-0">
                    <div className="flex items-center gap-2 mb-3">
                      <button
                        onClick={() => {
                          setView('main');
                          setSearchQuery('');
                        }}
                        className="p-1.5 -ml-1.5 rounded-full hover:bg-gray-800 transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-400" />
                      </button>
                      <div>
                        <h2 className="text-lg font-bold text-white">Search Books</h2>
                        <p className="text-[10px] text-gray-500">Find and add to your library</p>
                      </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-3">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Search title or author..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#3298ff] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Results */}
                  <div className="flex-1 overflow-y-auto px-4 pb-4">
                    {isSearching ? (
                      <LoadingSpinner text="Searching books..." />
                    ) : (
                      <>
                        <div className="text-[10px] font-bold text-gray-500 mb-2">
                          {searchQuery ? `${searchResults.length} RESULTS` : 'START TYPING TO SEARCH'}
                        </div>
                        
                        {searchResults.length > 0 && (
                          <div className="space-y-2.5">
                            {searchResults.map((book, index) => (
                              <div
                                key={index}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 flex items-center gap-2.5 hover:border-[#3298ff] transition-all relative"
                              >
                                {/* Clickable area for book details (cover + info) */}
                                <button
                                  onClick={() => {
                                    // Navigate to book detail page
                                    const bookToAdd = { ...book, status: 'want-to-read' };
                                    onAddBook(bookToAdd, []);
                                    onClose();
                                    setView('main');
                                    setSearchQuery('');
                                  }}
                                  className="flex items-center gap-2.5 flex-1 min-w-0 text-left active:opacity-70 transition-opacity"
                                >
                                  <BookCover
                                    src={book.cover}
                                    alt={book.title}
                                    className="w-10 h-14 object-cover rounded shadow-md flex-shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-white text-xs mb-0.5 truncate">{book.title}</h3>
                                    <p className="text-[10px] text-gray-400 mb-1 truncate">{book.author}</p>
                                    <div className="flex items-center gap-1.5 text-[9px]">
                                      {book.genres && book.genres[0] && (
                                        <span 
                                          className="px-1.5 py-0.5 rounded font-bold"
                                          style={{
                                            background: `linear-gradient(135deg, ${currentTheme.primary}33 0%, ${currentTheme.secondary}33 100%)`,
                                            color: currentTheme.primary
                                          }}
                                        >
                                          {book.genres[0]}
                                        </span>
                                      )}
                                      {book.pages && <span className="text-gray-500">{book.pages}p</span>}
                                    </div>
                                  </div>
                                </button>
                                
                                {/* Add to shelf button */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddBook(book);
                                  }}
                                  className="p-2 rounded-lg hover:bg-gray-700 active:scale-95 transition-all flex-shrink-0"
                                >
                                  <Plus className="w-4 h-4 text-gray-500" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {searchResults.length === 0 && searchQuery && !isSearching && (
                          <div className="text-center py-8">
                            <BookOpen className="w-10 h-10 text-gray-700 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">No books found</p>
                            <p className="text-[10px] text-gray-600 mt-1">Try a different search term</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Manual Entry View */}
              {view === 'manual' && (
                <div className="flex-1 overflow-hidden flex flex-col">
                  {/* Header with Back */}
                  <div className="px-4 pb-3 flex-shrink-0">
                    <div className="flex items-center gap-2 mb-1">
                      <button
                        onClick={() => setView('main')}
                        className="p-1.5 -ml-1.5 rounded-full hover:bg-gray-800 transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-400" />
                      </button>
                      <div>
                        <h2 className="text-lg font-bold text-white">Manual Entry</h2>
                        <p className="text-[10px] text-gray-500">Enter book details</p>
                      </div>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="flex-1 overflow-y-auto px-4 pb-4">
                    <div className="space-y-3">
                      {/* Title */}
                      <div>
                        <label className="text-[9px] font-bold text-gray-500 mb-1.5 block uppercase tracking-wider">
                          Title *
                        </label>
                        <input
                          type="text"
                          placeholder="Enter book title"
                          value={manualBookData.title}
                          onChange={(e) => setManualBookData({ ...manualBookData, title: e.target.value })}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#3298ff] transition-colors"
                        />
                      </div>

                      {/* Author */}
                      <div>
                        <label className="text-[9px] font-bold text-gray-500 mb-1.5 block uppercase tracking-wider">
                          Author *
                        </label>
                        <input
                          type="text"
                          placeholder="Enter author name"
                          value={manualBookData.author}
                          onChange={(e) => setManualBookData({ ...manualBookData, author: e.target.value })}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#3298ff] transition-colors"
                        />
                      </div>

                      {/* Pages & Year */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-[9px] font-bold text-gray-500 mb-1.5 block uppercase tracking-wider">
                            Pages
                          </label>
                          <input
                            type="number"
                            placeholder="300"
                            value={manualBookData.pages}
                            onChange={(e) => setManualBookData({ ...manualBookData, pages: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#3298ff] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-bold text-gray-500 mb-1.5 block uppercase tracking-wider">
                            Year
                          </label>
                          <input
                            type="text"
                            placeholder="2026"
                            value={manualBookData.yearPublished}
                            onChange={(e) => setManualBookData({ ...manualBookData, yearPublished: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#3298ff] transition-colors"
                          />
                        </div>
                      </div>

                      {/* Genre */}
                      <div>
                        <label className="text-[9px] font-bold text-gray-500 mb-1.5 block uppercase tracking-wider">
                          Genre
                        </label>
                        <input
                          type="text"
                          placeholder="Fantasy, Romance, Thriller..."
                          value={manualBookData.genre}
                          onChange={(e) => setManualBookData({ ...manualBookData, genre: e.target.value })}
                          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#3298ff] transition-colors"
                        />
                      </div>

                      {/* Format Selector */}
                      <div>
                        <label className="text-[9px] font-bold text-gray-500 mb-1.5 block uppercase tracking-wider">
                          Format
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { value: 'physical', label: '📚 Physical', icon: '📚' },
                            { value: 'ebook', label: '📱 E-book', icon: '📱' },
                            { value: 'audiobook', label: '🎧 Audio', icon: '🎧' }
                          ].map((format) => (
                            <button
                              key={format.value}
                              type="button"
                              onClick={() => setManualBookData({ ...manualBookData, format: format.value as any })}
                              className="px-2 py-2.5 rounded-lg text-[10px] font-bold transition-all"
                              style={{
                                background: manualBookData.format === format.value ? getGradientBg() : '#1f2937',
                                color: manualBookData.format === format.value ? '#ffffff' : '#9ca3af',
                              }}
                            >
                              {format.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Conditional: Audio Duration (only for audiobooks) */}
                      {manualBookData.format === 'audiobook' && (
                        <div>
                          <label className="text-[9px] font-bold text-gray-500 mb-1.5 block uppercase tracking-wider">
                            Audio Duration (hours)
                          </label>
                          <input
                            type="number"
                            placeholder="e.g., 12.5"
                            step="0.5"
                            value={manualBookData.audioDuration}
                            onChange={(e) => setManualBookData({ ...manualBookData, audioDuration: e.target.value })}
                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#3298ff] transition-colors"
                          />
                          <p className="text-[9px] text-gray-500 mt-1">Total listening time</p>
                        </div>
                      )}

                      {/* Shelf Selector */}
                      <div>
                        <label className="text-[9px] font-bold text-gray-500 mb-1.5 block uppercase tracking-wider">
                          Add to Shelf
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {['Want to Read', 'Currently Reading', 'Favorites', 'Best of 2026'].map((shelf) => (
                            <button
                              key={shelf}
                              onClick={() => setSelectedShelf(shelf)}
                              className="px-2.5 py-2 rounded-lg text-[10px] font-bold transition-all"
                              style={{
                                background: selectedShelf === shelf ? getGradientBg() : '#1f2937',
                                color: selectedShelf === shelf ? '#ffffff' : '#9ca3af',
                              }}
                            >
                              {shelf}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Buttons */}
                  <div className="px-4 pt-2 pb-4 border-t border-gray-800 space-y-2 flex-shrink-0">
                    <button
                      onClick={handleManualAdd}
                      disabled={!manualBookData.title || !manualBookData.author}
                      className="w-full h-11 rounded-lg text-sm font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
                      style={{
                        background: getGradientBg(),
                      }}
                    >
                      Add Book
                    </button>
                    <button
                      onClick={() => setView('main')}
                      className="w-full h-10 rounded-lg text-sm font-bold bg-transparent text-gray-400 active:bg-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm & Select Shelves View */}
              {view === 'confirm' && pendingBook && (
                <div className="flex-1 overflow-hidden flex flex-col">
                  {/* Header with Back */}
                  <div className="px-4 pb-3 flex-shrink-0">
                    <div className="flex items-center gap-2 mb-1">
                      <button
                        onClick={() => {
                          setView('main');
                          setPendingBook(null);
                        }}
                        className="p-1.5 -ml-1.5 rounded-full hover:bg-gray-800 transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-400" />
                      </button>
                      <div>
                        <h2 className="text-lg font-bold text-white">Add to Shelves</h2>
                        <p className="text-[10px] text-gray-500">Select where to add this book</p>
                      </div>
                    </div>
                  </div>

                  {/* Book Preview */}
                  <div className="px-4 pb-4 flex-shrink-0">
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 flex gap-3">
                      <BookCover
                        src={pendingBook.cover}
                        alt={pendingBook.title}
                        className="w-16 h-24 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-white mb-1 line-clamp-2">{pendingBook.title}</h3>
                        <p className="text-xs text-gray-400 mb-2">{pendingBook.author}</p>
                        {pendingBook.pages && (
                          <p className="text-[10px] text-gray-500">{pendingBook.pages} pages</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Shelf Selection */}
                  <div className="flex-1 overflow-y-auto px-4">
                    <div className="space-y-2 pb-4">
                      {availableShelves.length > 0 ? (
                        availableShelves.map((shelf) => {
                          const isSelected = selectedShelfIds.includes(shelf.id);
                          return (
                            <button
                              key={shelf.id}
                              onClick={() => toggleShelfSelection(shelf.id)}
                              className="w-full bg-gray-800 border rounded-lg p-3.5 flex items-center justify-between transition-all active:scale-[0.98]"
                              style={{
                                borderColor: isSelected ? currentTheme.accentColor : '#374151',
                                backgroundColor: isSelected ? `${currentTheme.accentColor}15` : '#1f2937',
                              }}
                            >
                              <span className="text-sm font-semibold text-white">{shelf.name}</span>
                              <div 
                                className="w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
                                style={{
                                  borderColor: isSelected ? currentTheme.accentColor : '#6b7280',
                                  backgroundColor: isSelected ? currentTheme.accentColor : 'transparent',
                                }}
                              >
                                {isSelected && (
                                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                            </button>
                          );
                        })
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-sm text-gray-500">No shelves available</p>
                          <p className="text-xs text-gray-600 mt-1">Book will be added to your library</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Button */}
                  <div className="px-4 pt-2 pb-4 border-t border-gray-800 flex-shrink-0">
                    <button
                      onClick={confirmAddBook}
                      className="w-full h-11 rounded-lg text-sm font-bold text-white active:scale-95 transition-transform"
                      style={{
                        background: getGradientBg(),
                      }}
                    >
                      Add Book {selectedShelfIds.length > 0 && `to ${selectedShelfIds.length} ${selectedShelfIds.length === 1 ? 'Shelf' : 'Shelves'}`}
                    </button>
                  </div>
                </div>
              )}

              {/* ISBN Scan View */}
              {view === 'isbn' && (
                <div className="flex-1 overflow-hidden flex flex-col">
                  {/* Header with Back */}
                  <div className="px-4 pb-3 flex-shrink-0">
                    <div className="flex items-center gap-2 mb-1">
                      <button
                        onClick={() => setView('main')}
                        className="p-1.5 -ml-1.5 rounded-full hover:bg-gray-800 transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5 text-gray-400" />
                      </button>
                      <div>
                        <h2 className="text-lg font-bold text-white">Scan ISBN</h2>
                        <p className="text-[10px] text-gray-500">Scan barcode to auto-fill</p>
                      </div>
                    </div>
                  </div>

                  {/* Camera Placeholder */}
                  <div className="flex-1 flex items-center justify-center px-4">
                    <div className="text-center">
                      <div className="w-40 h-40 rounded-2xl border-2 border-dashed border-gray-700 flex items-center justify-center mx-auto mb-4" style={{
                        background: currentTheme.isGradient 
                          ? `linear-gradient(135deg, ${currentTheme.primary}20 0%, ${currentTheme.secondary}20 100%)`
                          : `${currentTheme.primary}20`,
                      }}>
                        <Barcode className="w-16 h-16 text-gray-600" />
                      </div>
                      <h3 className="text-base font-bold text-white mb-1.5">ISBN Scanner</h3>
                      <p className="text-xs text-gray-400 mb-5 max-w-[240px] mx-auto">
                        Position barcode in frame to scan
                      </p>
                      <button
                        onClick={() => alert('Camera feature coming soon!')}
                        className="px-5 py-2.5 text-white rounded-lg font-bold text-sm active:scale-95 transition-transform"
                        style={{
                          background: getGradientBg(),
                        }}
                      >
                        Open Camera
                      </button>
                    </div>
                  </div>

                  {/* Bottom Button */}
                  <div className="px-4 pt-2 pb-4 border-t border-gray-800 flex-shrink-0">
                    <button
                      onClick={() => setView('main')}
                      className="w-full h-11 rounded-lg text-sm font-bold bg-transparent text-gray-400 active:bg-gray-800 transition-colors"
                    >
                      Back
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Shelf Selection Popup */}
      <AnimatePresence>
        {showShelfPopup && selectedBookForShelf && (
          <>
            {/* Popup Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[60]"
              onClick={() => {
                setShowShelfPopup(false);
                setSelectedBookForShelf(null);
              }}
            />

            {/* Shelf Popup Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[61] bg-gray-900 rounded-2xl w-[90%] max-w-[340px] p-5 shadow-2xl border border-gray-700"
            >
              <h3 className="text-base font-bold text-white mb-2">Add to Shelf</h3>
              <p className="text-xs text-gray-400 mb-4">{selectedBookForShelf.title}</p>
              
              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {/* ALWAYS show "Currently Reading" option first */}
                <button
                  onClick={() => handleShelfSelection('currently-reading', 'Currently Reading')}
                  className="w-full py-3 px-4 rounded-lg text-sm font-bold text-white transition-all active:scale-95"
                  style={{
                    background: getGradientBg(),
                  }}
                >
                  📖 Currently Reading
                </button>
                
                {/* Then show available shelves */}
                {availableShelves.length > 0 ? (
                  availableShelves.map((shelf) => (
                    <button
                      key={shelf.id}
                      onClick={() => handleShelfSelection(shelf.id, shelf.name)}
                      className="w-full py-3 px-4 rounded-lg text-sm font-bold text-white transition-all active:scale-95"
                      style={{
                        background: getGradientBg(),
                      }}
                    >
                      {shelf.name}
                    </button>
                  ))
                ) : (
                  // Fallback to default shelves if no availableShelves provided
                  ['Want to Read', 'Favorites'].map((shelf) => (
                    <button
                      key={shelf}
                      onClick={() => handleShelfSelection(shelf.toLowerCase().replace(/ /g, '-'), shelf)}
                      className="w-full py-3 px-4 rounded-lg text-sm font-bold text-white transition-all active:scale-95"
                      style={{
                        background: getGradientBg(),
                      }}
                    >
                      {shelf}
                    </button>
                  ))
                )}
              </div>

              <button
                onClick={() => {
                  setShowShelfPopup(false);
                  setSelectedBookForShelf(null);
                }}
                className="w-full mt-3 py-2.5 rounded-lg text-sm font-semibold text-gray-400 bg-gray-800 active:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
