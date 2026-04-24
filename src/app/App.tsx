import { useState, useEffect, useMemo, useRef } from 'react';
import { Home, Calendar, Search, Library, TrendingUp, Book } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { CalendarView } from './components/CalendarView';
import { Browse } from './components/Browse';
import { Bookshelves } from './components/Bookshelves';
import { Insights } from './components/Insights';
import { BadgesPage } from './components/BadgesPage';
import { FloatingActionButton } from './components/FloatingActionButton';
import { QuickLogModal } from './components/QuickLogModal';
import { QuickActionMenu } from './components/QuickActionMenu';
import { AddBookModal } from './components/AddBookModal';
import { GoalsPage } from './components/GoalsPage';
import { CelebrationModal } from './components/CelebrationModal';
import { BookDetailPage } from './components/BookDetailPage';
import { MigrationModal } from './components/MigrationModal';
import { OnboardingModal } from './components/OnboardingModal';
import { SettingsModal } from './components/SettingsModal';
import { ImportBooksModal } from './components/ImportBooksModal';
import { MissingCoversBanner } from './components/MissingCoversBanner';
import { BookDataDiagnostic } from './components/BookDataDiagnostic';
import { ImageDebugger } from './components/ImageDebugger';
import { CoverFixerTool } from './components/CoverFixerTool';
import { BrokenCoversList } from './components/BrokenCoversList';
import { DataFixTool } from './components/DataFixTool';
import { EmergencyDataRecovery } from './components/EmergencyDataRecovery';
import { ImportBackupTool } from './components/ImportBackupTool';
import { AuthScreen } from './components/AuthScreen';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { BooksProvider, useBooks } from './contexts/BooksContext';
import { BadgesProvider, useBadges } from './contexts/BadgesContext';
import { AuthorProvider } from './contexts/AuthorContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { checkBadges } from './utils/badgeChecker';
import { motion, AnimatePresence } from 'motion/react';
import { getMigrationCount, migrateAllBooks, MigrationProgress } from './utils/bookMigration';
import { api } from './utils/api';
import { repairMissingBookCovers } from './services/coverRepairService';

// CACHE-BUST VERSION CHECK - v4.0.2
const APP_VERSION = '4.0.3-RECOVERY-' + Date.now();
console.log(`%c🚀 APP.TSX VERSION ${APP_VERSION} LOADED`, 'background: #0000ff; color: #ffffff; font-size: 18px; font-weight: bold; padding: 8px;');
console.log('%c⚠️ IF YOU SEE RATE LIMIT ERRORS WITH 4s/8s/16s DELAYS, DO A HARD REFRESH (Ctrl+Shift+R)!', 'background: #ff0000; color: #ffffff; font-size: 14px; font-weight: bold; padding: 6px;');

// Suppress Google Books CORS errors from html2canvas and dom-to-image
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

const shouldSuppressMessage = (message: string) => {
  return message.includes('books.google.com') && 
         (message.includes('Status:0') || message.includes('fetching resource'));
};

console.error = (...args: any[]) => {
  const message = args[0]?.toString() || '';
  if (shouldSuppressMessage(message)) return;
  originalConsoleError.apply(console, args);
};

console.warn = (...args: any[]) => {
  const message = args[0]?.toString() || '';
  if (shouldSuppressMessage(message)) return;
  originalConsoleWarn.apply(console, args);
};

console.log = (...args: any[]) => {
  const message = args[0]?.toString() || '';
  if (shouldSuppressMessage(message)) return;
  originalConsoleLog.apply(console, args);
};

type View = 'dashboard' | 'calendar' | 'browse' | 'shelves' | 'insights' | 'book-detail' | 'badges' | 'goals';

// Navigation tabs for bottom bar
const navigation: { id: View; name: string; icon: typeof Home }[] = [
  { id: 'dashboard', name: 'Home', icon: Home },
  { id: 'calendar', name: 'Calendar', icon: Calendar },
  { id: 'browse', name: 'Browse', icon: Search },
  { id: 'shelves', name: 'Shelves', icon: Library },
  { id: 'insights', name: 'Insights', icon: TrendingUp },
];

export default function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}

function AuthenticatedApp() {
  const { user, isLoading, isConfigured } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#0b0f19] text-white">
        Loading ReadTrack...
      </div>
    );
  }

  if (isConfigured && !user) {
    return <AuthScreen />;
  }

  return (
    <ThemeProvider>
      <BooksProvider>
        <AuthorProvider>
          <BadgesProvider>
            <AppContent />
          </BadgesProvider>
        </AuthorProvider>
      </BooksProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  const { currentTheme } = useTheme();
  const { books, readingSessions, bookshelves, updateBook, addBook, logReadingSession, updateBookshelves, refreshBooks, fetchMissingCovers, refetchAllCovers, restoreCoversFromBackup, emergencyRecovery, isLoaded: booksLoaded } = useBooks();
  const { earnedBadges, unlockBadge, isLoaded: badgesLoaded } = useBadges();
  
  // ALL useState hooks MUST come before any conditional returns
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [navigationHistory, setNavigationHistory] = useState<View[]>([]);
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState<any>(null);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [finishModalData, setFinishModalData] = useState({
    rating: 0,
    pacing: '',
    recommend: '',
    rereadability: '',
    characterDevelopment: '',
    plotTwists: '',
    notes: '',
  });
  const [isMigrationModalOpen, setIsMigrationModalOpen] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState<MigrationProgress | undefined>(undefined);
  const [isMigrating, setIsMigrating] = useState(false);
  const [booksNeedingMigration, setBooksNeedingMigration] = useState(0);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isImportBooksOpen, setIsImportBooksOpen] = useState(false);
  const [isRestoringCovers, setIsRestoringCovers] = useState(false);
  const [customShelves, setCustomShelves] = useState<any[]>([]);
  const hasRunCoverRepair = useRef(false);
  
  // Initialize reading history from localStorage
  const [readingHistory, setReadingHistory] = useState<{ [date: string]: boolean }>(() => {
    const saved = localStorage.getItem('readingHistory');
    return saved ? JSON.parse(saved) : {};
  });
  
  // Calculate active streak (consecutive days from today backwards)
  const calculateStreak = () => {
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);

    // Check backwards from today
    while (true) {
      const dateKey = formatDateKey(currentDate);
      if (readingHistory[dateKey]) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const activeStreak = useMemo(() => calculateStreak(), [readingHistory]);
  
  // Load custom shelves from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('readtrack_custom_shelves');
    if (stored) {
      try {
        setCustomShelves(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse custom shelves:', e);
      }
    }
  }, []);

  // Listen for changes to custom shelves in localStorage
  useEffect(() => {
    const handleCustomShelvesChange = () => {
      const stored = localStorage.getItem('readtrack_custom_shelves');
      if (stored) {
        try {
          setCustomShelves(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse custom shelves:', e);
        }
      }
    };

    // Poll every 1 second to catch changes from other components
    const interval = setInterval(handleCustomShelvesChange, 1000);
    return () => clearInterval(interval);
  }, []);
  
  // Listen for changes to readingHistory in localStorage and update state
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('readingHistory');
      if (saved) {
        setReadingHistory(JSON.parse(saved));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also poll every 2 seconds to catch changes within same tab
    const interval = setInterval(() => {
      const saved = localStorage.getItem('readingHistory');
      if (saved) {
        const parsed = JSON.parse(saved);
        setReadingHistory(prev => {
          if (JSON.stringify(prev) !== JSON.stringify(parsed)) {
            return parsed;
          }
          return prev;
        });
      }
    }, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);
  
  // ALL useEffect hooks MUST come before any conditional returns
  // Check if onboarding has been completed on mount
  useEffect(() => {
    if (!booksLoaded || !badgesLoaded) return;
    
    const hasCompletedOnboarding = localStorage.getItem('readtrack_onboarding_completed');
    if (!hasCompletedOnboarding) {
      // Show onboarding after a brief delay
      setTimeout(() => {
        setIsOnboardingOpen(true);
      }, 500);
    }
  }, [booksLoaded, badgesLoaded]);

  // Auto-check for new badges whenever books or reading sessions change
  useEffect(() => {
    if (!booksLoaded || !badgesLoaded) return;

    const newBadges = checkBadges(books, readingSessions, earnedBadges);
    
    if (newBadges.length > 0) {
      console.log('🎉 New badges earned:', newBadges);
      // Unlock all new badges
      newBadges.forEach(badgeId => {
        unlockBadge(badgeId);
      });
    }
  }, [books.length, readingSessions.length, booksLoaded, badgesLoaded]);

  // Check if books need migration and auto-open modal
  useEffect(() => {
    if (!booksLoaded) return;
    
    const count = getMigrationCount(books);
    setBooksNeedingMigration(count);
    
    // DISABLED: Don't auto-open migration modal since APIs are having issues
    // The user can manually trigger it later when APIs are working
    // const hasShownMigration = localStorage.getItem('migration_shown');
    // if (count > 0 && !hasShownMigration) {
    //   setTimeout(() => {
    //     setIsMigrationModalOpen(true);
    //     localStorage.setItem('migration_shown', 'true');
    //   }, 2000);
    // }
  }, [booksLoaded, books.length]);

  // Background cover repair job (throttled) for missing/invalid covers
  useEffect(() => {
    if (!booksLoaded || hasRunCoverRepair.current) return;
    hasRunCoverRepair.current = true;

    const COVER_REPAIR_INTERVAL_MS = 1000 * 60 * 60 * 6; // 6 hours
    const lastRunRaw = localStorage.getItem('readtrack_cover_repair_last_run');
    const lastRun = lastRunRaw ? Number(lastRunRaw) : 0;
    const shouldRun = Date.now() - lastRun > COVER_REPAIR_INTERVAL_MS;

    if (!shouldRun) return;

    const runRepair = async () => {
      try {
        const result = await repairMissingBookCovers(books, updateBook, { maxBooks: 15 });
        console.log('🛠️ Cover repair completed:', result);
        localStorage.setItem('readtrack_cover_repair_last_run', String(Date.now()));
      } catch (error) {
        console.error('Cover repair job failed:', error);
      }
    };

    runRepair();
  }, [booksLoaded, books, updateBook]);

  // Calculate missing covers count - MUST be before conditional return
  const missingCoversCount = useMemo(() => {
    const missing = books.filter(book => {
      // Check if cover is missing or invalid
      if (!book.cover || book.cover.length === 0) return true;
      if (!book.cover.startsWith('http')) return true;
      return false;
    }).length;
    
    if (booksLoaded && books.length > 0 && missing > 0) {
      console.log(`📸 Missing covers detected: ${missing} of ${books.length} books`);
    }
    
    return missing;
  }, [books, booksLoaded]);
  
  // Filter books that are currently being read - MUST be before conditional return
  const currentlyReadingBooks = useMemo(() => {
    return books
      .filter(book => book.status === 'reading')
      .map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        cover: book.cover,
        progress: book.progress || 0,
        currentPage: book.currentPage || 0,
        pages: book.pages || 0
      }));
  }, [books]);
  
  // Don't render until contexts are loaded (AFTER all hooks are declared)
  if (!booksLoaded || !badgesLoaded) {
    return (
      <div className="min-h-dvh w-full flex items-center justify-center" style={{ backgroundColor: currentTheme.backgroundColor }}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full animate-pulse" style={{ 
            background: currentTheme.tertiary 
              ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.tertiary} 50%, ${currentTheme.secondary} 100%)`
              : `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
          }} />
          <p className="text-sm font-medium" style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}>Loading ReadTrack...</p>
          <p className="text-xs mt-2" style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}>
            Books: {booksLoaded ? '✓' : '...'} | Badges: {badgesLoaded ? '✓' : '...'}
          </p>
        </div>
      </div>
    );
  }
  
  console.log('✅ App fully loaded:', { booksLoaded, badgesLoaded, booksCount: books.length });
  
  const handleStartMigration = async () => {
    setIsMigrating(true);
    
    const migratedBooks = await migrateAllBooks(books, (progress) => {
      setMigrationProgress(progress);
    });
    
    // Update all books in database
    for (const book of migratedBooks) {
      await updateBook(book.id, book);
    }
    
    setIsMigrating(false);
  };

  const handleRestoreCovers = async () => {
    setIsRestoringCovers(true);
    try {
      console.log('🔄 Starting cover restoration...');
      
      // STEP 0: Emergency recovery of known good covers
      console.log('🚨 Step 0: Emergency recovery of known books...');
      const emergencyCount = emergencyRecovery();
      console.log(`   ✅ Emergency recovered ${emergencyCount} covers`);
      
      // STEP 1: Try to restore from backup history
      console.log('📦 Step 1: Restoring from backup history...');
      const backupResult = restoreCoversFromBackup();
      console.log(`   ✅ Restored ${backupResult.restored} covers from backup`);
      
      // STEP 2: Fetch new covers for books that still don't have them
      console.log('🎨 Step 2: Fetching missing covers from APIs...');
      const result = await refetchAllCovers();
      console.log(`   ✅ Fetched ${result.success} new covers from APIs`);
      
      const totalRestored = emergencyCount + backupResult.restored + result.success;
      console.log(`\n✅ Cover restoration complete! ${totalRestored} total covers restored.`);
      
      // Refresh books to show new covers
      await refreshBooks();
      
      // Show success message
      if (totalRestored > 0) {
        alert(`✅ Successfully restored ${totalRestored} book covers!\n\n` +
              `🚨 Emergency recovery: ${emergencyCount}\n` +
              `📦 From backup: ${backupResult.restored}\n` +
              `🆕 From APIs: ${result.success}`);
      } else {
        alert(`ℹ️ No additional covers could be restored.\n\nAll available covers are already in place.`);
      }
      
      // Clear the banner dismissal so it can be shown again if needed
      localStorage.removeItem('covers_banner_dismissed');
    } catch (error) {
      console.error('❌ Cover restoration failed:', error);
      alert('❌ Cover restoration encountered an error. Check the console for details.');
    } finally {
      setIsRestoringCovers(false);
    }
  };

  const handleLogReading = async (data: { pages: number; minutes: number; book: string; bookId?: string; targetPage?: number; targetPercentage?: number }) => {
    console.log('📖 Logging reading session:', data);
    
    // Find the book being logged
    const book = books.find(b => b.title === data.book || b.id === data.bookId);
    if (!book) {
      console.error('❌ Book not found:', data.book);
      return;
    }
    
    console.log('📚 Current book state:', {
      title: book.title,
      currentPage: book.currentPage,
      progress: book.progress,
      totalPages: book.pages
    });
    
    // Use targetPage if provided (from percentage mode), otherwise calculate from pages
    let newCurrentPage: number;
    let newProgress: number;
    
    if (data.targetPage !== undefined) {
      // Percentage mode: set to exact target
      newCurrentPage = data.targetPage;
      newProgress = data.targetPercentage || Math.min(100, (newCurrentPage / book.pages) * 100);
    } else {
      // Pages mode: add pages read
      newCurrentPage = (book.currentPage || 0) + data.pages;
      newProgress = Math.min(100, (newCurrentPage / book.pages) * 100);
    }
    
    console.log('✏️ Updating to:', {
      newCurrentPage,
      newProgress: `${Math.round(newProgress)}%`,
      pagesRead: data.pages
    });
    
    // Update the book's progress
    await updateBook(book.id, {
      currentPage: newCurrentPage,
      progress: newProgress,
    });
    
    // Create a reading session
    const today = new Date().toISOString().split('T')[0];
    const session = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      bookId: book.id,
      pages: data.pages,
      minutes: data.minutes,
      date: today,
    };
    await logReadingSession(session);
    
    // Update reading history (mark today as read)
    const newHistory = { ...readingHistory, [today]: true };
    setReadingHistory(newHistory);
    localStorage.setItem('readingHistory', JSON.stringify(newHistory));
    
    console.log('✅ Reading session logged successfully');
    
    // Show celebration if milestone reached
    if (data.pages >= 50) {
      setShowCelebration(true);
    }
  };

  const handleBookSelect = (book: any) => {
    // Save current view to history before navigating
    setNavigationHistory(prev => [...prev, currentView]);
    setSelectedBook(book);
    setCurrentView('book-detail');
  };

  // Universal back handler - navigates to previous view from history
  const handleGoBack = () => {
    if (navigationHistory.length > 0) {
      // Pop the last view from history
      const previousView = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, -1));
      setCurrentView(previousView);
      
      // Clear selected book if going back from book detail
      if (currentView === 'book-detail') {
        setSelectedBook(null);
      }
    } else {
      // Fallback: go to dashboard if no history
      setCurrentView('dashboard');
      setSelectedBook(null);
    }
  };

  const handleBackFromBook = () => {
    setSelectedBook(null);
    setCurrentView('dashboard');
  };

  // Update book using BooksContext AND update local state
  const handleUpdateBook = async (bookId: string, updates: any) => {
    // Update in context (persists to database)
    await updateBook(bookId, updates);
    
    // Update local selectedBook state for immediate UI feedback
    setSelectedBook((prev: any) => prev ? { ...prev, ...updates } : prev);
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard 
          onBookSelect={handleBookSelect} 
          onNavigate={(view) => setCurrentView(view)}
          onOpenImport={() => setIsImportBooksOpen(true)}
          onBookFinished={(book) => {
            setSelectedBook(book);
            setFinishModalData({
              rating: book.rating || 0,
              pacing: book.stats?.pacing || '',
              recommend: book.stats?.recommend || '',
              rereadability: book.stats?.rereadability || '',
              characterDevelopment: book.stats?.characterDevelopment || '',
              plotTwists: book.stats?.plotTwists || '',
            });
            setShowFinishModal(true);
          }}
        />;
      case 'calendar':
        return <CalendarView onBookSelect={handleBookSelect} />;
      case 'shelves':
        return <Bookshelves onBookSelect={handleBookSelect} />;
      case 'insights':
        return <Insights onNavigateToBadges={() => {
          // Save current view to history before navigating
          setNavigationHistory(prev => [...prev, currentView]);
          setCurrentView('badges');
        }} onBookSelect={handleBookSelect} />;
      case 'browse':
        return <Browse onBookSelect={handleBookSelect} />;
      case 'book-detail':
        return selectedBook ? (
          <BookDetailPage 
            book={selectedBook} 
            onBack={handleGoBack}
            onUpdateBook={(updates) => handleUpdateBook(selectedBook.id, updates)}
            onBookFinished={(book) => {
              // Calculate reading duration for celebration
              const startDate = book.startDate ? new Date(book.startDate) : null;
              const finishDate = new Date(book.finishDate || new Date().toISOString());
              let daysToRead = 0;
              if (startDate) {
                const diffTime = finishDate.getTime() - startDate.getTime();
                daysToRead = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
              }
              
              // Set celebration data and show celebration modal
              setCelebrationData({
                title: book.title,
                cover: book.cover,
                rating: book.rating || 0,
                daysToRead: daysToRead,
              });
              setShowCelebration(true);
            }}
          />
        ) : null;
      case 'badges':
        return <BadgesPage onBack={handleGoBack} />;
      case 'goals':
        return <GoalsPage onBack={handleGoBack} />;
      default:
        return <Dashboard 
          onBookSelect={handleBookSelect} 
          onNavigate={(view) => setCurrentView(view)}
          onOpenImport={() => setIsImportBooksOpen(true)}
          onBookFinished={(book) => {
            setSelectedBook(book);
            setFinishModalData({
              rating: book.rating || 0,
              pacing: book.stats?.pacing || '',
              recommend: book.stats?.recommend || '',
              rereadability: book.stats?.rereadability || '',
              characterDevelopment: book.stats?.characterDevelopment || '',
              plotTwists: book.stats?.plotTwists || '',
            });
            setShowFinishModal(true);
          }}
        />;
    }
  };

  return (
    <div 
      className="min-h-dvh w-full overflow-x-hidden flex items-stretch justify-center md:items-center md:p-4"
      style={{ backgroundColor: currentTheme.backgroundColor }}
    >
      {/* Phone Frame */}
      <div 
        className="w-full max-w-[430px] min-h-dvh safe-top md:min-h-0 md:h-[932px] md:rounded-[60px] md:shadow-2xl flex flex-col relative overflow-hidden md:border-8"
        style={{
          backgroundColor: currentTheme.backgroundColor,
          borderColor: currentTheme.backgroundColor,
        }}
      >
        {/* Notch */}
        <div 
          className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 rounded-b-3xl z-50"
          style={{ backgroundColor: currentTheme.backgroundColor }}
        />
        
        {/* Header - Hide on book detail and badges */}
        {currentView !== 'book-detail' && currentView !== 'badges' && currentView !== 'goals' && (
          <header 
            className="px-6 py-3 shadow-lg"
            style={{
              background: currentTheme.isGradient
                ? currentTheme.tertiary
                  ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.tertiary} 50%, ${currentTheme.secondary} 100%)`
                  : `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
                : currentTheme.primary,
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div 
                className="w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center font-bold text-sm"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: '#ffffff',
                }}
              >
                R
              </div>
              <div>
                <h1 
                  className="text-lg font-bold"
                  style={{ color: '#ffffff' }}
                >
                  ReadTrack
                </h1>
                <p 
                  className="text-[10px]"
                  style={{ 
                    color: 'rgba(255,255,255,0.8)' 
                  }}
                >
                  Your Reading Journey
                </p>
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-3 gap-2">
              <div 
                className="backdrop-blur-sm rounded-lg py-1 px-1.5"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }}
              >
                <div className="flex items-center gap-1 mb-0">
                  <TrendingUp 
                    className="w-2.5 h-2.5"
                    style={{ 
                      color: 'rgba(255,255,255,0.8)' 
                    }}
                  />
                  <span 
                    className="text-[9px] font-medium"
                    style={{ 
                      color: 'rgba(255,255,255,0.7)' 
                    }}
                  >
                    Streak
                  </span>
                </div>
                <div 
                  className="text-sm font-bold"
                  style={{ color: '#ffffff' }}
                >
                  {activeStreak}
                </div>
              </div>
              
              <div 
                className="backdrop-blur-sm rounded-lg py-1 px-1.5"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }}
              >
                <div className="flex items-center gap-1 mb-0">
                  <Book 
                    className="w-2.5 h-2.5"
                    style={{ 
                      color: 'rgba(255,255,255,0.8)' 
                    }}
                  />
                  <span 
                    className="text-[9px] font-medium"
                    style={{ 
                      color: 'rgba(255,255,255,0.7)' 
                    }}
                  >
                    2026
                  </span>
                </div>
                <div 
                  className="text-sm font-bold"
                  style={{ color: '#ffffff' }}
                >
                  {books.filter(b => b.status === 'finished' && b.finishDate?.includes('2026')).length}
                </div>
              </div>
              
              <div 
                className="backdrop-blur-sm rounded-lg py-1 px-1.5"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                }}
              >
                <div className="flex items-center gap-1 mb-0">
                  <Calendar 
                    className="w-2.5 h-2.5"
                    style={{ 
                      color: 'rgba(255,255,255,0.8)' 
                    }}
                  />
                  <span 
                    className="text-[9px] font-medium"
                    style={{ 
                      color: 'rgba(255,255,255,0.7)' 
                    }}
                  >
                    Pages
                  </span>
                </div>
                <div 
                  className="text-sm font-bold"
                  style={{ color: '#ffffff' }}
                >
                  {(() => {
                    const pagesIn2026 = books
                      .filter(b => b.status === 'finished' && b.finishDate?.includes('2026'))
                      .reduce((sum, b) => sum + (b.pages || 0), 0);
                    console.log('📊 Header Pages:', {
                      totalBooks: books.length,
                      finishedBooks: books.filter(b => b.status === 'finished').length,
                      finishedIn2026: books.filter(b => b.status === 'finished' && b.finishDate?.includes('2026')).length,
                      pagesIn2026,
                      sampleBooks: books.filter(b => ['Fourth Wing', 'The Housemaid', 'Project Hail Mary'].includes(b.title))
                    });
                    return pagesIn2026 >= 1000 
                      ? `${(pagesIn2026 / 1000).toFixed(1)}K` 
                      : pagesIn2026.toLocaleString();
                  })()}
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Missing Covers Banner - Show when covers are missing */}
        {booksLoaded && books.length > 0 && missingCoversCount > 0 && (
          <MissingCoversBanner
            missingCount={missingCoversCount}
            totalCount={books.length}
            onRestoreCovers={handleRestoreCovers}
            isRestoring={isRestoringCovers}
          />
        )}

        {/* Main Content - Scrollable */}
        <main 
          className={`flex-1 overflow-y-auto overflow-x-hidden ${(currentView !== 'book-detail' && currentView !== 'badges' && currentView !== 'goals') ? 'pb-24' : 'pb-0'}`}
          style={{ backgroundColor: currentTheme.backgroundColor }}
        >
          <div className={(currentView !== 'book-detail' && currentView !== 'badges' && currentView !== 'goals') ? 'p-4' : ''}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {renderView()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Bottom Navigation - Hide on book detail and badges */}
        {currentView !== 'book-detail' && currentView !== 'badges' && currentView !== 'goals' && (
          <nav 
            className="fixed bottom-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 border-t safe-bottom md:absolute md:left-0 md:right-0 md:max-w-none md:translate-x-0"
            style={{
              backgroundColor: currentTheme.cardColor,
              borderTopColor: currentTheme.borderColor,
            }}
          >
            <div className="grid grid-cols-5 gap-1 px-2 py-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    className="flex flex-col items-center gap-1 py-2 px-1 rounded-xl transition-all"
                    style={{
                      backgroundColor: isActive ? `${currentTheme.accentColor}20` : 'transparent'
                    }}
                  >
                    <Icon 
                      className="w-6 h-6"
                      style={{ 
                        color: isActive ? currentTheme.accentColor : (currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af')
                      }}
                    />
                    <span 
                      className="text-[10px] font-semibold"
                      style={{ 
                        color: isActive ? currentTheme.accentColor : (currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af')
                      }}
                    >
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>
        )}

        {/* Floating Action Button - Hide on book detail and badges */}
        {currentView !== 'book-detail' && currentView !== 'badges' && currentView !== 'goals' && (
          <FloatingActionButton onClick={() => setIsQuickMenuOpen(true)} />
        )}

        {/* Quick Action Menu */}
        <QuickActionMenu
          isOpen={isQuickMenuOpen}
          onClose={() => setIsQuickMenuOpen(false)}
          onLogProgress={() => setIsQuickLogOpen(true)}
          onAddBook={() => setIsAddBookOpen(true)}
          onViewGoals={() => setCurrentView('goals')}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Add Book Modal */}
        <AddBookModal
          isOpen={isAddBookOpen}
          onClose={() => setIsAddBookOpen(false)}
          availableShelves={[
            ...bookshelves.map(shelf => ({ id: shelf.id, name: shelf.name })),
            ...customShelves.map(shelf => ({ id: shelf.id, name: shelf.name }))
          ]}
          onAddBook={async (bookData, selectedShelfIds = []) => {
            console.log('📗 [App.tsx] onAddBook called with:', {
              title: bookData.title,
              pages: bookData.pages,
              status: bookData.status,
              selectedShelfIds,
              fullBookData: bookData
            });
            
            // Generate a unique ID for the book
            const bookId = Date.now().toString();
            
            // IMPORTANT: Use bookData.status as-is, only default to 'want-to-read' if undefined
            const bookStatus = bookData.status !== undefined ? bookData.status : 'want-to-read';
            console.log(`  📊 Status assignment: ${bookData.status} → ${bookStatus}`);
            
            // Add the book to the books list
            await addBook({
              ...bookData,
              id: bookId,
              status: bookStatus,
              currentPage: bookData.currentPage || 0,
              progress: bookData.progress || 0,
              pages: bookData.pages || 0,
              shelfIds: selectedShelfIds,
            });
            
            console.log(`  ✅ Book added with status: ${bookStatus}`);
            
            // Update bookshelves to include this book
            if (selectedShelfIds.length > 0) {
              console.log('📚 [App.tsx] Adding book to shelves:', selectedShelfIds);
              
              // Update default bookshelves
              const updatedShelves = bookshelves.map(shelf => {
                if (selectedShelfIds.includes(shelf.id)) {
                  console.log(`  ✅ Adding book to default shelf: ${shelf.name}`);
                  return {
                    ...shelf,
                    bookIds: [...shelf.bookIds, bookId]
                  };
                }
                return shelf;
              });
              await updateBookshelves(updatedShelves);
              
              // Update custom shelves
              const updatedCustomShelves = customShelves.map(shelf => {
                if (selectedShelfIds.includes(shelf.id)) {
                  console.log(`  ✅ Adding book to custom shelf: ${shelf.name}`);
                  return {
                    ...shelf,
                    bookIds: [...shelf.bookIds, bookId]
                  };
                }
                return shelf;
              });
              
              if (JSON.stringify(updatedCustomShelves) !== JSON.stringify(customShelves)) {
                setCustomShelves(updatedCustomShelves);
                localStorage.setItem('readtrack_custom_shelves', JSON.stringify(updatedCustomShelves));
              }
              
              console.log('✅ [App.tsx] Bookshelves updated successfully');
            }
            
            setIsAddBookOpen(false);
          }}
        />

        {/* Quick Log Modal */}
        <QuickLogModal
          isOpen={isQuickLogOpen}
          onClose={() => setIsQuickLogOpen(false)}
          onLogReading={handleLogReading}
          currentlyReadingBooks={currentlyReadingBooks}
        />

        {/* Celebration Modal */}
        <CelebrationModal
          type="book_finished"
          title="Amazing! 🎉"
          message="You hit a reading milestone!"
          isOpen={showCelebration}
          onClose={() => {
            setShowCelebration(false);
            setCelebrationData(null);
          }}
          bookData={celebrationData}
        />

        {/* Migration Modal */}
        <MigrationModal
          isOpen={isMigrationModalOpen}
          onClose={() => setIsMigrationModalOpen(false)}
          onStartMigration={handleStartMigration}
          progress={migrationProgress}
          isMigrating={isMigrating}
          booksNeedingMigration={booksNeedingMigration}
        />

        {/* Onboarding Modal */}
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => {
            setIsOnboardingOpen(false);
            localStorage.setItem('readtrack_onboarding_completed', 'true');
          }}
        />

        {/* Settings Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onOpenImport={() => {
            setIsSettingsOpen(false);
            setIsImportBooksOpen(true);
          }}
        />

        {/* Import Books Modal */}
        <ImportBooksModal
          isOpen={isImportBooksOpen}
          onClose={() => setIsImportBooksOpen(false)}
          onImport={async (importedBooks) => {
            try {
              console.log(`📚 [App.tsx] onImport called with ${importedBooks?.length} books`);
              console.log('[App.tsx] typeof importedBooks:', typeof importedBooks);
              console.log('[App.tsx] First book data:', importedBooks[0]);
              
              // 🚨 CLEAR ALL EXISTING DATA FIRST 🚨
              console.log('🗑️ CLEARING ALL EXISTING DATA...');
              
              // Clear localStorage
              localStorage.removeItem('readtrack_books');
              localStorage.removeItem('readtrack_sessions');
              localStorage.removeItem('readtrack_shelves');
              
              console.log('✅ Cleared all existing data from localStorage');
              console.log('📥 Now importing fresh data...');
              
              // Mark that user has imported books (so we don't load sample data on next reload)
              localStorage.setItem('readtrack_has_imported', 'true');
              // IMPORTANT: Remove the skip_sample_data flag so imported books will be saved and loaded
              localStorage.removeItem('skip_sample_data');
              console.log('🗑️ Removed skip_sample_data flag to allow book imports');
              console.log('✅ Set readtrack_has_imported flag to prevent sample data loading');
              
              let successCount = 0;
              let errorCount = 0;
              const successfullyImportedBooks: any[] = [];
              
              console.log(`📥 Starting to add ${importedBooks.length} imported books...`);
              
              // Add each book to the database with a small delay to avoid overwhelming the system
              for (let i = 0; i < importedBooks.length; i++) {
                const bookData = importedBooks[i];
                try {
                  const toNumber = (value: unknown): number | undefined => {
                    if (typeof value === 'number' && Number.isFinite(value)) return value;
                    if (typeof value !== 'string') return undefined;
                    const cleaned = value.replace(/[^0-9.]/g, '');
                    if (!cleaned) return undefined;
                    const parsed = Number(cleaned);
                    return Number.isFinite(parsed) ? parsed : undefined;
                  };

                  const normalizedStatus =
                    bookData.status === 'currently-reading'
                      ? 'reading'
                      : (bookData.status || 'finished');

                  const normalizedPages = Math.max(0, Math.round(toNumber(bookData.pages) || 0));
                  const importedCurrentPage = Math.max(0, Math.round(toNumber(bookData.currentPage) || 0));
                  const importedProgressRaw = toNumber(bookData.progress);
                  const importedProgress =
                    importedProgressRaw !== undefined
                      ? Math.max(0, Math.min(100, importedProgressRaw))
                      : undefined;

                  const isFinished = normalizedStatus === 'finished';
                  const finalCurrentPage = isFinished
                    ? (normalizedPages || importedCurrentPage)
                    : importedCurrentPage;

                  let finalProgress = isFinished ? 100 : (importedProgress ?? 0);
                  if (!isFinished && finalProgress === 0 && normalizedPages > 0 && finalCurrentPage > 0) {
                    finalProgress = Math.min(100, (finalCurrentPage / normalizedPages) * 100);
                  }

                  const generatedBookId = `imported_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`;
                  const bookToAdd = {
                    ...bookData,
                    id: generatedBookId,
                    status: normalizedStatus,
                    pages: normalizedPages,
                    currentPage: finalCurrentPage,
                    progress: finalProgress,
                  };
                  
                  console.log(`📖 [${i + 1}/${importedBooks.length}] Adding book: \"${bookToAdd.title}\" by ${bookToAdd.author}`, {
                    cover: bookToAdd.cover ? bookToAdd.cover.substring(0, 60) + '...' : 'NO COVER',
                    isbn: bookToAdd.isbn || 'NO ISBN',
                    pages: bookToAdd.pages || 'NO PAGES'
                  });
                  await addBook(bookToAdd);
                  console.log(`✅ [${i + 1}/${importedBooks.length}] Book added successfully`);
                  successCount++;
                  successfullyImportedBooks.push(bookToAdd);
                  
                  // Small delay to avoid overwhelming the database
                  if (i < importedBooks.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                  }
                } catch (error) {
                  console.error(`❌ Error adding book "${bookData.title}":`, error);
                  errorCount++;
                }
              }
              
              console.log(`✅ [App.tsx] Import complete! Success: ${successCount}, Errors: ${errorCount}`);
              
              // Generate reading sessions from imported books
              console.log('📊 Generating reading sessions from imported books...');
              const currentSessions = JSON.parse(localStorage.getItem('readtrack_sessions') || '[]');
              const newSessions: any[] = [...currentSessions];
              
              successfullyImportedBooks.forEach((book: any, index: number) => {
                if (book.status === 'finished' && (book.finishDate || book.dateRead) && book.pages) {
                  const finishDate = book.finishDate || book.dateRead;
                  const dateStr = finishDate.split('T')[0]; // Get YYYY-MM-DD format
                  
                  // Create a reading session for this book
                  const session = {
                    id: `imported_session_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`,
                    bookId: book.id,
                    pages: book.pages,
                    minutes: Math.round(book.pages * 1.5), // Estimate 1.5 minutes per page
                    date: dateStr,
                  };
                  
                  newSessions.push(session);
                  console.log(`  ✅ Created session for "${book.title}" on ${dateStr}: ${book.pages} pages`);
                }
              });
              
              // Save all sessions
              localStorage.setItem('readtrack_sessions', JSON.stringify(newSessions));
              console.log(`📊 Generated ${newSessions.length - currentSessions.length} new reading sessions`);
              
              // CHECK FINAL STATE IN LOCALSTORAGE
              const finalBooksInStorage = localStorage.getItem('readtrack_books');
              const finalBooks = finalBooksInStorage ? JSON.parse(finalBooksInStorage) : [];
              console.log(`📊 [App.tsx] AFTER IMPORT - Books in localStorage: ${finalBooks.length}`);
              
              
              // FORCE REFRESH: Reload all books from localStorage to ensure UI updates
              console.log('🔄 Forcing books refresh from localStorage...');
              await refreshBooks();
              console.log(`📊 Total books in state after refresh:`, books.length);
              
              // AUTO-ENRICH MISSING COVERS
              console.log('🎨 Triggering cover enrichment...');
              setTimeout(async () => {
                await fetchMissingCovers();
              }, 2000); // Wait 2 seconds for books to settle
              
              setIsImportBooksOpen(false);
              
              // Count enriched books
              const booksWithCovers = importedBooks.filter(b => b.cover).length;
              const booksWithPages = importedBooks.filter(b => b.pages).length;
              
              // Show success message with enrichment stats
              let successMessage = `✅ Successfully imported ${successCount} ${successCount === 1 ? 'book' : 'books'}!`;
              
              if (booksWithCovers > 0 || booksWithPages > 0) {
                successMessage += `\n\n📚 Enriched from database:`;
                if (booksWithCovers > 0) {
                  successMessage += `\n  📷 ${booksWithCovers} book ${booksWithCovers === 1 ? 'cover' : 'covers'}`;
                }
                if (booksWithPages > 0) {
                  successMessage += `\n  📖 ${booksWithPages} page ${booksWithPages === 1 ? 'count' : 'counts'}`;
                }
              }
              
              if (errorCount > 0) {
                successMessage += `\n\n⚠️ ${errorCount} books failed to import.`;
              }
              
              alert(successMessage);
            } catch (error) {
              console.error('Error in onImport:', error);
              alert('An error occurred during the import process. Please try again.');
            }
          }}
        />

        {/* Finish Book Review Modal */}
        <AnimatePresence>
          {showFinishModal && selectedBook && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFinishModal(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
              />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[400px] rounded-2xl shadow-2xl z-[201] max-h-[85vh] overflow-y-auto"
                style={{ backgroundColor: currentTheme.cardColor }}
              >
                <div className="p-5 space-y-5">
                  {/* Header */}
                  <div>
                    <h2 className="text-xl font-bold mb-1" style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}>
                      Finished Reading!
                    </h2>
                    <p className="text-sm" style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}>
                      Share your reading experience
                    </p>
                  </div>

                  {/* Rating Stars */}
                  <div>
                    <label className="text-[9px] font-bold mb-2 block uppercase tracking-wider" style={{ color: currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af' }}>
                      Rating
                    </label>
                    <div className="flex gap-2 justify-center mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setFinishModalData(prev => ({ ...prev, rating: star }))}
                          className="transition-transform hover:scale-110"
                        >
                          <svg className="w-10 h-10" viewBox="0 0 24 24">
                            <defs>
                              <linearGradient id={`star-grad-${star}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={currentTheme.primary} />
                                <stop offset="100%" stopColor={currentTheme.secondary} />
                              </linearGradient>
                            </defs>
                            <path
                              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                              fill={finishModalData.rating >= star ? `url(#star-grad-${star})` : 'none'}
                              stroke={finishModalData.rating >= star ? `url(#star-grad-${star})` : 'rgba(255, 255, 255, 0.2)'}
                              strokeWidth="2"
                            />
                          </svg>
                        </button>
                      ))}
                    </div>

                    {/* Numeric Rating Display */}
                    <div className="text-center mb-3">
                      <span className="text-3xl font-bold" style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}>
                        {finishModalData.rating.toFixed(2)}
                      </span>
                      <span className="text-lg ml-1" style={{ color: currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af' }}>
                        / 5.00
                      </span>
                    </div>

                    {/* Rating Slider */}
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.25"
                      value={finishModalData.rating}
                      onChange={(e) => setFinishModalData(prev => ({ ...prev, rating: parseFloat(e.target.value) }))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, ${currentTheme.primary} 0%, ${currentTheme.primary} ${(finishModalData.rating / 5) * 100}%, ${currentTheme.backgroundColor} ${(finishModalData.rating / 5) * 100}%, ${currentTheme.backgroundColor} 100%)`
                      }}
                    />
                  </div>

                  {/* Pacing */}
                  <div>
                    <label className="text-[9px] font-bold mb-2 block uppercase tracking-wider" style={{ color: currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af' }}>
                      Pacing
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Fast', 'Medium', 'Slow'].map((option) => (
                        <button
                          key={option}
                          onClick={() => setFinishModalData(prev => ({ ...prev, pacing: option }))}
                          className="py-2.5 rounded-lg font-semibold text-sm transition-colors"
                          style={{
                            backgroundColor: currentTheme.backgroundColor,
                            borderColor: finishModalData.pacing === option ? currentTheme.primary : currentTheme.borderColor,
                            borderWidth: '2px',
                            color: finishModalData.pacing === option ? currentTheme.primary : (currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280')
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Would Recommend */}
                  <div>
                    <label className="text-[9px] font-bold mb-2 block uppercase tracking-wider" style={{ color: currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af' }}>
                      Would Recommend?
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Yes', 'Maybe', 'No'].map((option) => (
                        <button
                          key={option}
                          onClick={() => setFinishModalData(prev => ({ ...prev, recommend: option }))}
                          className="py-2.5 rounded-lg font-semibold text-sm transition-colors"
                          style={{
                            backgroundColor: currentTheme.backgroundColor,
                            borderColor: finishModalData.recommend === option ? currentTheme.primary : currentTheme.borderColor,
                            borderWidth: '2px',
                            color: finishModalData.recommend === option ? currentTheme.primary : (currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280')
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Rereadability */}
                  <div>
                    <label className="text-[9px] font-bold mb-2 block uppercase tracking-wider" style={{ color: currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af' }}>
                      Rereadability
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['High', 'Medium', 'Low'].map((option) => (
                        <button
                          key={option}
                          onClick={() => setFinishModalData(prev => ({ ...prev, rereadability: option }))}
                          className="py-2.5 rounded-lg font-semibold text-sm transition-colors"
                          style={{
                            backgroundColor: currentTheme.backgroundColor,
                            borderColor: finishModalData.rereadability === option ? currentTheme.primary : currentTheme.borderColor,
                            borderWidth: '2px',
                            color: finishModalData.rereadability === option ? currentTheme.primary : (currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280')
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Character Development */}
                  <div>
                    <label className="text-[9px] font-bold mb-2 block uppercase tracking-wider" style={{ color: currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af' }}>
                      Character Development
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Excellent', 'Good', 'Poor'].map((option) => (
                        <button
                          key={option}
                          onClick={() => setFinishModalData(prev => ({ ...prev, characterDevelopment: option }))}
                          className="py-2.5 rounded-lg font-semibold text-sm transition-colors"
                          style={{
                            backgroundColor: currentTheme.backgroundColor,
                            borderColor: finishModalData.characterDevelopment === option ? currentTheme.primary : currentTheme.borderColor,
                            borderWidth: '2px',
                            color: finishModalData.characterDevelopment === option ? currentTheme.primary : (currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280')
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Plot Twists */}
                  <div>
                    <label className="text-[9px] font-bold mb-2 block uppercase tracking-wider" style={{ color: currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af' }}>
                      Plot Twists
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Many', 'Some', 'Few'].map((option) => (
                        <button
                          key={option}
                          onClick={() => setFinishModalData(prev => ({ ...prev, plotTwists: option }))}
                          className="py-2.5 rounded-lg font-semibold text-sm transition-colors"
                          style={{
                            backgroundColor: currentTheme.backgroundColor,
                            borderColor: finishModalData.plotTwists === option ? currentTheme.primary : currentTheme.borderColor,
                            borderWidth: '2px',
                            color: finishModalData.plotTwists === option ? currentTheme.primary : (currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280')
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes / Written Review */}
                  <div>
                    <label className="text-[9px] font-bold mb-2 block uppercase tracking-wider" style={{ color: currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af' }}>
                      Notes / Written Review
                    </label>
                    <textarea
                      value={finishModalData.notes || ''}
                      onChange={(e) => setFinishModalData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Share your thoughts, favorite quotes, or memorable moments..."
                      className="w-full h-32 rounded-xl p-3 text-sm resize-none focus:outline-none"
                      style={{
                        backgroundColor: currentTheme.backgroundColor,
                        borderColor: currentTheme.borderColor,
                        borderWidth: '1px',
                        color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827'
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={async () => {
                      const updates: any = {
                        status: 'finished',
                        finishDate: selectedBook.finishDate || new Date().toISOString(),
                        rating: finishModalData.rating,
                        notes: finishModalData.notes,
                        progress: 100,
                        stats: {
                          pacing: finishModalData.pacing,
                          recommend: finishModalData.recommend,
                          rereadability: finishModalData.rereadability,
                          characterDevelopment: finishModalData.characterDevelopment,
                          plotTwists: finishModalData.plotTwists,
                        }
                      };

                      // Set progress to 100% for the format
                      if (selectedBook.format === 'audiobook') {
                        updates.currentMinutes = selectedBook.audioDuration || 600;
                      } else {
                        updates.currentPage = selectedBook.pages || 0;
                      }

                      await updateBook(selectedBook.id, updates);
                      
                      // Calculate reading duration
                      const startDate = selectedBook.startDate ? new Date(selectedBook.startDate) : null;
                      const finishDate = new Date(updates.finishDate);
                      let daysToRead = 0;
                      if (startDate) {
                        const diffTime = finishDate.getTime() - startDate.getTime();
                        daysToRead = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
                      }
                      
                      console.log('📊 Celebration Data:', {
                        title: selectedBook.title,
                        cover: selectedBook.cover,
                        rating: finishModalData.rating,
                        daysToRead: daysToRead,
                        startDate: selectedBook.startDate,
                        finishDate: updates.finishDate
                      });
                      
                      // Prepare celebration data
                      setCelebrationData({
                        title: selectedBook.title,
                        cover: selectedBook.cover,
                        rating: finishModalData.rating,
                        daysToRead: daysToRead,
                      });
                      
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
                      
                      // Show celebration modal
                      setShowCelebration(true);
                    }}
                    className="w-full py-3.5 rounded-xl font-bold text-white text-base"
                    style={{ 
                      background: currentTheme.isGradient
                        ? currentTheme.tertiary
                          ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.tertiary} 50%, ${currentTheme.secondary} 100%)`
                          : `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
                        : currentTheme.primary
                    }}
                  >
                    Submit Review
                  </button>

                  {/* Cancel Link */}
                  <button
                    onClick={() => setShowFinishModal(false)}
                    className="w-full text-center text-sm font-semibold"
                    style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Diagnostic Tools - DISABLED FOR PRODUCTION */}
      {/* <BookDataDiagnostic /> */}
      {/* <ImageDebugger /> */}
      {/* <BrokenCoversList /> */}
      {/* <CoverFixerTool /> */}
      {/* <DataFixTool /> */}
      {/* <EmergencyDataRecovery /> - DISABLED */}
      {/* <ImportBackupTool /> - DISABLED */}
    </div>
  );
}
