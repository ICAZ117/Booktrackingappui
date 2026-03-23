import { Sparkles, Heart, Trophy, Bookmark, XCircle, Library, Star, BookOpen, User, TrendingUp, Calendar, ChevronRight, Plus, Settings, Flame, Zap, Music, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookDetailModal } from './BookDetailModal';
import { AddBookModal } from './AddBookModal';
import { ShelfDetailView } from './ShelfDetailView';
import { ProfileSettingsModal } from './ProfileSettingsModal';
import { CreateShelfModal } from './CreateShelfModal';
import { BookCover } from './BookCover';
import { useTheme } from '../contexts/ThemeContext';
import { useBooks } from '../contexts/BooksContext';

interface BookshelvesProps {
  onBookSelect?: (book: any) => void;
}

export function Bookshelves({ onBookSelect }: BookshelvesProps) {
  const { currentTheme } = useTheme();
  const { books, bookshelves, getBooksInShelf, getCurrentlyReading, getWantToRead, isLoaded, updateBook, addBook, updateBookshelves } = useBooks();
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [showBookDetail, setShowBookDetail] = useState(false);
  const [showAddBook, setShowAddBook] = useState(false);
  const [selectedShelf, setSelectedShelf] = useState<any>(null);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showCreateShelf, setShowCreateShelf] = useState(false);
  const [customShelves, setCustomShelves] = useState<any[]>([]);
  const [contextShelfId, setContextShelfId] = useState<string | null>(null); // Track which shelf context we're in
  
  // Profile state
  const [username, setUsername] = useState('@bookworm2026');
  const [bio, setBio] = useState('Reading enthusiast 📚');
  const [avatar, setAvatar] = useState('📚');

  // Load custom shelves from localStorage
  useEffect(() => {
    const savedShelves = localStorage.getItem('readtrack_custom_shelves');
    if (savedShelves) {
      setCustomShelves(JSON.parse(savedShelves));
    }
  }, []);

  // Save custom shelves to localStorage
  useEffect(() => {
    if (customShelves.length > 0) {
      localStorage.setItem('readtrack_custom_shelves', JSON.stringify(customShelves));
    }
  }, [customShelves]);

  // Load profile data from localStorage
  useEffect(() => {
    const savedUsername = localStorage.getItem('readtrack_username') || '@bookworm2026';
    const savedBio = localStorage.getItem('readtrack_bio') || 'Reading enthusiast 📚';
    const savedAvatar = localStorage.getItem('readtrack_avatar') || '📚';
    
    setUsername(savedUsername);
    setBio(savedBio);
    setAvatar(savedAvatar);
  }, []);

  // Listen for profile updates
  useEffect(() => {
    const handleProfileUpdate = () => {
      const savedUsername = localStorage.getItem('readtrack_username') || '@bookworm2026';
      const savedBio = localStorage.getItem('readtrack_bio') || 'Reading enthusiast 📚';
      const savedAvatar = localStorage.getItem('readtrack_avatar') || '📚';
      
      setUsername(savedUsername);
      setBio(savedBio);
      setAvatar(savedAvatar);
    };

    window.addEventListener('profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('profileUpdated', handleProfileUpdate);
  }, []);

  const getGradientBg = () => {
    return currentTheme.isGradient
      ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
      : currentTheme.primary;
  };

  // Map icon string to component
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, any> = {
      Library,
      Heart,
      Star,
      Trophy,
      Sparkles,
      Bookmark,
      BookOpen,
      Flame,
      Zap,
      Music,
      Globe,
    };
    return iconMap[iconName] || Library;
  };

  // Handle custom shelf creation
  const handleCreateShelf = (shelfData: { name: string; icon: string; color: string }) => {
    const newShelf = {
      id: `custom-${Date.now()}`,
      name: shelfData.name,
      icon: shelfData.icon,
      color: shelfData.color,
      bookIds: [],
    };
    setCustomShelves([...customShelves, newShelf]);
    setShowCreateShelf(false);
  };

  // Enrich bookshelves with UI properties AND books
  const enrichedShelves = bookshelves
    .filter(shelf => shelf.id !== 'all-time-favorites') // Remove All-Time Favorites shelf
    .map(shelf => {
    let icon = Library;
    let color = 'from-gray-400 to-gray-600';
    
    switch(shelf.id) {
      case 'favorites':
        icon = Sparkles;
        color = 'from-yellow-400 to-amber-600';
        break;
      case 'best-of-2026':
        icon = Trophy;
        color = 'from-purple-400 to-pink-600';
        break;
      case 'want-to-read':
        icon = Bookmark;
        color = 'from-blue-400 to-cyan-600';
        break;
      case 'dnf':
        icon = XCircle;
        color = 'from-gray-400 to-gray-600';
        break;
    }
    
    // Get actual books for this shelf
    const shelfBooks = getBooksInShelf(shelf.id);
    
    return {
      ...shelf,
      icon,
      color,
      books: shelfBooks,
      // Override bookIds to match actual books (fixes count mismatch)
      bookIds: shelfBooks.map(b => b.id),
    };
  });

  const openBookDetailModal = (book) => {
    setSelectedBook(book);
    setShowBookDetail(true);
    if (onBookSelect) {
      onBookSelect(book);
    }
  };

  const closeBookDetailModal = () => {
    setSelectedBook(null);
    setShowBookDetail(false);
  };

  const openAddBookModal = (shelfId?: string) => {
    setContextShelfId(shelfId || null);
    setShowAddBook(true);
  };

  const closeAddBookModal = () => {
    setShowAddBook(false);
    setContextShelfId(null);
  };

  const openShelfDetail = (shelf) => {
    setSelectedShelf(shelf);
  };

  const closeShelfDetail = () => {
    setSelectedShelf(null);
  };

  // If a shelf is selected, show the detail view
  if (selectedShelf) {
    return (
      <>
        <ShelfDetailView
          shelf={selectedShelf}
          onBack={closeShelfDetail}
          onBookClick={openBookDetailModal}
          onAddBook={() => openAddBookModal(selectedShelf.id)}
        />
        
        {/* Modals need to be rendered even in shelf detail view */}
        {showBookDetail && selectedBook && (
          <BookDetailModal
            book={selectedBook}
            onClose={closeBookDetailModal}
            onUpdate={(updates) => {
              updateBook(selectedBook.id, updates);
              closeBookDetailModal();
            }}
          />
        )}

        {showAddBook && (
          <AddBookModal
            isOpen={showAddBook}
            onClose={closeAddBookModal}
            onAddBook={(book, selectedShelfIds) => {
              console.log('Added book:', book, 'to shelves:', selectedShelfIds);
              
              // Ensure book has an ID
              const bookId = book.id || Date.now().toString();
              const bookWithId = { ...book, id: bookId };
              
              // Add the book to the books list
              addBook(bookWithId);
              
              // Add the book to selected shelves
              if (selectedShelfIds.length > 0) {
                // Update default bookshelves
                const updatedDefaultShelves = bookshelves.map(shelf => {
                  if (selectedShelfIds.includes(shelf.id)) {
                    return {
                      ...shelf,
                      bookIds: [...shelf.bookIds, bookId]
                    };
                  }
                  return shelf;
                });
                updateBookshelves(updatedDefaultShelves);
                
                // Update custom shelves
                const updatedCustomShelves = customShelves.map(shelf => {
                  if (selectedShelfIds.includes(shelf.id)) {
                    return {
                      ...shelf,
                      bookIds: [...shelf.bookIds, bookId]
                    };
                  }
                  return shelf;
                });
                setCustomShelves(updatedCustomShelves);
              }
              
              closeAddBookModal();
            }}
            availableShelves={[
              ...bookshelves.map(shelf => ({ id: shelf.id, name: shelf.name })),
              ...customShelves.map(shelf => ({ id: shelf.id, name: shelf.name }))
            ]}
            contextShelfId={contextShelfId}
          />
        )}
      </>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div 
        className="rounded-2xl p-6 text-white shadow-lg"
        style={{
          background: getGradientBg(),
        }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold mb-0.5">{username}</h1>
            <p className="text-white/80 text-xs">{bio}</p>
          </div>
          <button
            onClick={() => setShowProfileSettings(true)}
            className="p-1 rounded-full bg-white/20 backdrop-blur-sm"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Badges */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-2xl font-bold mb-0.5">{books.filter(b => b.status === 'finished').length}</div>
            <div className="text-white/80 text-[10px]">Books</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-2xl font-bold mb-0.5">
              {(() => {
                const finishedPages = books.filter(b => b.status === 'finished').reduce((sum, b) => sum + (b.pages || 0), 0);
                const readingPages = books.filter(b => b.status === 'reading').reduce((sum, b) => sum + (b.currentPage || 0), 0);
                const totalPages = finishedPages + readingPages;
                return totalPages >= 1000 ? `${(totalPages / 1000).toFixed(1)}K` : totalPages;
              })()}
            </div>
            <div className="text-white/80 text-[10px]">Pages</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-2xl font-bold mb-0.5">
              {(() => {
                const ratedBooks = books.filter(b => b.status === 'finished' && b.rating);
                if (ratedBooks.length === 0) return '0.0';
                const avgRating = ratedBooks.reduce((sum, b) => sum + (b.rating || 0), 0) / ratedBooks.length;
                return avgRating.toFixed(1);
              })()}
            </div>
            <div className="text-white/80 text-[10px]">Avg Rating</div>
          </div>
        </div>
      </div>

      {/* Reading Bio */}
      <div 
        className="rounded-xl p-4"
        style={{
          backgroundColor: currentTheme.cardColor,
          borderColor: currentTheme.borderColor,
          borderWidth: '1px',
        }}
      >
        <p 
          className="text-sm leading-relaxed"
          style={{
            color: currentTheme.textColor === 'light' ? '#d1d5db' : '#374151',
          }}
        >
          Mostly reads <span className="font-semibold" style={{ color: currentTheme.accentColor }}>fiction</span> books that are <span className="font-semibold" style={{ color: currentTheme.accentColor }}>dark</span>, <span className="font-semibold" style={{ color: currentTheme.accentColor }}>mysterious</span>, and <span className="font-semibold" style={{ color: currentTheme.accentColor }}>tense</span>. Typically chooses <span className="font-semibold text-emerald-600">fast-paced</span> books that are <span className="font-semibold text-amber-600">300-500 pages long</span>.
        </p>
      </div>

      {/* Currently Reading */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 
            className="font-bold"
            style={{
              color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827',
            }}
          >
            Currently Reading ({getCurrentlyReading().length})
          </h2>
          <button
            onClick={openAddBookModal}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: `${currentTheme.accentColor}20`,
              color: currentTheme.accentColor,
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Book
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
          {getCurrentlyReading().map((book, index) => (
            <button
              key={index}
              onClick={() => openBookDetailModal(book)}
              className="flex-shrink-0 w-28"
            >
              <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-md mb-2 relative hover:scale-105 transition-transform">
                <BookCover 
                  src={book.cover} 
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <div className="text-[9px] text-white/80 mb-1">{book.progress}%</div>
                  <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full"
                      style={{ 
                        width: `${book.progress}%`,
                        background: getGradientBg(),
                      }}
                    />
                  </div>
                </div>
              </div>
              <h3 
                className="text-[11px] font-semibold line-clamp-2 mb-0.5 text-left"
                style={{
                  color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827',
                }}
              >
                {book.title}
              </h3>
              <p 
                className="text-[9px] line-clamp-1 text-left"
                style={{
                  color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280',
                }}
              >
                {book.author}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Want to Read */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => openShelfDetail({
              id: 'want-to-read',
              name: 'Want to Read',
              books: getWantToRead(),
              icon: Bookmark,
              color: 'from-blue-400 to-cyan-600'
            })}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <h2 
              className="font-bold"
              style={{
                color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827',
              }}
            >
              Want to Read ({getWantToRead().length})
            </h2>
            <ChevronRight 
              className="w-4 h-4"
              style={{
                color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280',
              }}
            />
          </button>
          <button
            onClick={openAddBookModal}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: `${currentTheme.accentColor}20`,
              color: currentTheme.accentColor,
            }}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Book
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
          {getWantToRead().map((book, index) => (
            <button
              key={index}
              onClick={() => openBookDetailModal(book)}
              className="flex-shrink-0 w-28"
            >
              <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-md mb-2 relative hover:scale-105 transition-transform">
                <BookCover 
                  src={book.cover} 
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 
                className="text-[11px] font-semibold line-clamp-2 mb-0.5 text-left"
                style={{
                  color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827',
                }}
              >
                {book.title}
              </h3>
              <p 
                className="text-[9px] line-clamp-1 text-left"
                style={{
                  color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280',
                }}
              >
                {book.author}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 2026 Reading Goals */}
      <div 
        className="rounded-xl p-4"
        style={{
          backgroundColor: currentTheme.cardColor,
          borderColor: currentTheme.borderColor,
          borderWidth: '1px',
        }}
      >
        <h3 
          className="font-bold mb-3"
          style={{
            color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827',
          }}
        >
          2026 Reading Goals
        </h3>
        <div className="space-y-3">
          <div>
            {(() => {
              const booksIn2026 = books.filter(b => b.status === 'finished' && b.finishDate?.includes('2026')).length;
              const goalBooks = 50;
              const percentage = Math.min(Math.round((booksIn2026 / goalBooks) * 100), 100);
              return (
                <>
                  <div className="flex justify-between mb-1.5">
                    <span 
                      className="text-xs font-semibold"
                      style={{
                        color: currentTheme.textColor === 'light' ? '#d1d5db' : '#374151',
                      }}
                    >
                      BOOKS
                    </span>
                    <span className="text-xs" style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}>
                      <span className="font-bold" style={{ color: currentTheme.accentColor }}>{booksIn2026}</span> / {goalBooks} books
                    </span>
                  </div>
                  <div 
                    className="h-2 rounded-full overflow-hidden"
                    style={{
                      backgroundColor: currentTheme.textColor === 'light' ? '#374151' : '#f3f4f6',
                    }}
                  >
                    <div
                      className="h-full"
                      style={{ 
                        width: `${percentage}%`,
                        background: getGradientBg(),
                      }}
                    />
                  </div>
                  <div className="text-right mt-1">
                    <span 
                      className="text-[10px]"
                      style={{
                        color: currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af',
                      }}
                    >
                      {percentage}%
                    </span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Custom Shelves */}
      <div>
        <h2 
          className="font-bold mb-3"
          style={{
            color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827',
          }}
        >
          My Shelves
        </h2>
        <div className="space-y-2">
          {enrichedShelves.map((shelf) => {
            const Icon = shelf.icon;
            return (
              <button
                key={shelf.id}
                className="w-full bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between hover:border-gray-300 transition-colors"
                onClick={() => openShelfDetail(shelf)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${shelf.color}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-sm text-gray-900">{shelf.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">{shelf.bookIds.length}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </button>
            );
          })}
          
          {/* Custom Shelves */}
          {customShelves.map((shelf) => {
            const Icon = getIconComponent(shelf.icon);
            return (
              <button
                key={shelf.id}
                className="w-full bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between hover:border-gray-300 transition-colors"
                onClick={() => openShelfDetail({
                  ...shelf,
                  icon: Icon,
                  books: books.filter(b => shelf.bookIds.includes(b.id)),
                })}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${shelf.color}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-semibold text-sm text-gray-900">{shelf.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">{shelf.bookIds.length}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </button>
            );
          })}

          {/* Read Books - All Time */}
          <button 
            onClick={() => openShelfDetail({ id: 'finished', name: 'Read Books', books: books.filter(b => b.status === 'finished'), icon: BookOpen, color: 'from-green-400 to-emerald-600' })}
            className="w-full bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-400 to-emerald-600">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm text-gray-900">Read Books</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">{books.filter(b => b.status === 'finished').length}</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </button>
          
          {/* Create Shelf Button */}
          <button
            onClick={() => setShowCreateShelf(true)}
            className="w-full rounded-xl p-4 border-2 border-dashed flex items-center justify-center gap-2 transition-all hover:border-gray-400"
            style={{
              borderColor: currentTheme.textColor === 'light' ? '#4b5563' : '#d1d5db',
            }}
          >
            <Plus 
              className="w-4 h-4"
              style={{
                color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280',
              }}
            />
            <span 
              className="text-sm font-semibold"
              style={{
                color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280',
              }}
            >
              Create Your Own Shelf
            </span>
          </button>
        </div>
      </div>

      {/* Add Book Button */}
      <div className="mt-4">
        <button
          className="w-full text-white rounded-xl p-3.5 flex items-center justify-center transition-colors"
          style={{
            background: getGradientBg(),
          }}
          onClick={openAddBookModal}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Add Book
        </button>
      </div>

      {/* Book Detail Modal */}
      {showBookDetail && (
        <BookDetailModal
          book={selectedBook}
          isOpen={showBookDetail}
          onClose={closeBookDetailModal}
          onUpdateCover={(coverUrl) => {
            if (selectedBook?.id) {
              updateBook(selectedBook.id, { cover: coverUrl });
              setSelectedBook({ ...selectedBook, cover: coverUrl });
            }
          }}
        />
      )}

      {/* Add Book Modal */}
      <AddBookModal
        isOpen={showAddBook}
        onClose={closeAddBookModal}
        availableShelves={[
          ...bookshelves.map(shelf => ({ id: shelf.id, name: shelf.name })),
          ...customShelves.map(shelf => ({ id: shelf.id, name: shelf.name }))
        ]}
        contextShelfId={contextShelfId}
        onAddBook={async (book, selectedShelfIds) => {
          console.log('Added book:', book, 'to shelves:', selectedShelfIds);
          
          // Ensure book has an ID
          const bookId = book.id || Date.now().toString();
          const bookWithId = { ...book, id: bookId };
          
          // Add the book to the books list
          await addBook(bookWithId);
          
          // Add the book to selected shelves
          if (selectedShelfIds.length > 0) {
            // Update default bookshelves
            const updatedDefaultShelves = bookshelves.map(shelf => {
              if (selectedShelfIds.includes(shelf.id)) {
                return {
                  ...shelf,
                  bookIds: [...shelf.bookIds, bookId]
                };
              }
              return shelf;
            });
            await updateBookshelves(updatedDefaultShelves);
            
            // Update custom shelves
            const updatedCustomShelves = customShelves.map(shelf => {
              if (selectedShelfIds.includes(shelf.id)) {
                return {
                  ...shelf,
                  bookIds: [...shelf.bookIds, bookId]
                };
              }
              return shelf;
            });
            setCustomShelves(updatedCustomShelves);
          }
          
          closeAddBookModal();
        }}
      />

      {/* Profile Settings Modal */}
      <ProfileSettingsModal
        isOpen={showProfileSettings}
        onClose={() => setShowProfileSettings(false)}
      />

      {/* Create Shelf Modal */}
      <CreateShelfModal
        isOpen={showCreateShelf}
        onClose={() => setShowCreateShelf(false)}
        onCreateShelf={handleCreateShelf}
      />
    </div>
  );
}