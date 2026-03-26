import { Book, Flame, Headphones, BookOpen, TrendingUp, Calendar, Sparkles, Award, AlertCircle, Zap, Heart, Check, Settings, Target, Plus, ChevronRight, Upload, Edit2, Smartphone, PieChart, Clock } from 'lucide-react';
import { StatCard } from './StatCard';
import { BookCard } from './BookCard';
import { BookCover } from './BookCover';
import { GoalSettingsModal, AllGoals } from './GoalSettingsModal';
import { AddBookModal } from './AddBookModal';
import { QuickProgressModal } from './QuickProgressModal';
import { ThemePicker } from './ThemePicker';
import { ImportBooksModal } from './ImportBooksModal';
import { DatabaseTestPanel } from './DatabaseTestPanel';
import { ReadingCalendarModal } from './ReadingCalendarModal';
import { DataFixTool } from './DataFixTool';
import { ReadingStories, StreakStory, BooksStory, AudiobooksStory, PagesStory, ThisWeekStory, ReadingGoalsStory, DetailedStatsStory, MonthlyRecapStory, YearInReviewStory, TopBooksStory, StreakDetailsStory, GenreBreakdownStory, ReadingSpeedStory, RatingBreakdownStory, ReadingCalendarStory, MonthlyBooksGridStory, MonthlyStatsGridStory, PagesPerDayChartStory, AverageStatsStory } from './ReadingStories';
import { useTheme, getTextColorForBackground } from '../contexts/ThemeContext';
import { useBooks } from '../contexts/BooksContext';
import { convertGoogleBookToBookData, getPopularBooksFeed, getTrendingBooks, searchBooks } from '../utils/googleBooksApi';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { motion } from 'motion/react';
import { useState, useEffect, useMemo } from 'react';
import { BookDetailModal } from './BookDetailModal';

// CACHE-BUST v4.1.0 - Audiobook support in currently reading
const DASHBOARD_VERSION = '4.1.0';
console.log(`Dashboard v${DASHBOARD_VERSION} loaded`);

type DiscoveryBook = {
  id?: string;
  googleBooksId?: string;
  title: string;
  author: string;
  cover: string;
  pages?: number;
  genre?: string;
  genres?: string[];
  rating?: number;
  ratingsCount?: number;
  description?: string;
  isbn?: string;
  publishedDate?: string;
  status?: string;
  format?: string;
  reason?: string;
};

const normalizeText = (value?: string) => (value || '').toLowerCase().replace(/\s+/g, ' ').trim();
const normalizeIsbn = (value?: string) => (value || '').replace(/[^0-9x]/gi, '').toLowerCase();

const getDiscoveryKey = (book: { title?: string; author?: string; isbn?: string }) => {
  const isbn = normalizeIsbn(book.isbn);
  if (isbn) return `isbn:${isbn}`;

  const normalizedTitle = normalizeText(book.title);
  const normalizedAuthor = normalizeText(book.author);
  if (!normalizedTitle) return '';
  return `${normalizedTitle}::${normalizedAuthor}`;
};

export function Dashboard({ onBookSelect, onNavigate, onOpenImport, onBookFinished }: { onBookSelect?: (book: any) => void; onNavigate?: (view: 'badges') => void; onOpenImport?: () => void; onBookFinished?: (book: any) => void }) {
  const { currentTheme } = useTheme();
  const { books, getCurrentlyReading, addBook, updateBook, logReadingSession, refreshBooks, isLoaded, bookshelves, updateBookshelves } = useBooks();
  
  // Calculate appropriate text color for cards (different from background text color)
  const cardTextColor = getTextColorForBackground(currentTheme.cardColor);
  
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [showBookDetail, setShowBookDetail] = useState(false);
  const [readingDays, setReadingDays] = useState([false, false, false, false, false, false, false]); // Start empty for new users
  const [showGoalSettings, setShowGoalSettings] = useState(false);
  const [showAddBook, setShowAddBook] = useState(false);
  const [showQuickProgress, setShowQuickProgress] = useState(false);
  const [showDatabaseTest, setShowDatabaseTest] = useState(false);
  const [showCalendarEdit, setShowCalendarEdit] = useState(false);
  const [showBadgesModal, setShowBadgesModal] = useState(false);
  const [onNavigateToBadges, setOnNavigateToBadges] = useState<(() => void) | undefined>(undefined);
  const [showDataFix, setShowDataFix] = useState(false);
  const [customShelves, setCustomShelves] = useState<any[]>([]);
  const [popularBooks, setPopularBooks] = useState<DiscoveryBook[]>([]);
  const [popularBooksSource, setPopularBooksSource] = useState<'nyt' | 'live-trending'>('live-trending');
  const [popularBooksFetchedAt, setPopularBooksFetchedAt] = useState<string>('');
  const [recommendedBooks, setRecommendedBooks] = useState<DiscoveryBook[]>([]);
  const [isLoadingPopularBooks, setIsLoadingPopularBooks] = useState(false);
  const [isLoadingRecommendedBooks, setIsLoadingRecommendedBooks] = useState(false);
  
  // Initialize reading history from localStorage or start fresh
  const [readingHistory, setReadingHistory] = useState<{ [date: string]: boolean }>(() => {
    // ALWAYS load from localStorage - no demo data!
    const saved = localStorage.getItem('readingHistory');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [selectedBookForProgress, setSelectedBookForProgress] = useState<number | null>(null);
  const [goals, setGoals] = useState<AllGoals>(() => {
    const saved = localStorage.getItem('readingGoals');
    return saved ? JSON.parse(saved) : {
      daily: { 
        pages: { value: 68, enabled: false },
        minutes: { value: 60, enabled: false }
      },
      monthly: { 
        books: { value: 4, enabled: false },
        pages: { value: 1200, enabled: false }
      },
      yearly: { 
        books: { value: 52, enabled: false },
        pages: { value: 20000, enabled: false }
      }
    };
  });

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

  // Debug: Log when goals change
  useEffect(() => {
    console.log('🎯 Dashboard - goals state updated:', goals);
    console.log('Daily pages enabled:', goals.daily.pages.enabled);
    console.log('Daily minutes enabled:', goals.daily.minutes.enabled);
  }, [goals]);

  // Persist readingHistory to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('readingHistory', JSON.stringify(readingHistory));
    console.log('💾 Saved readingHistory to localStorage:', readingHistory);
  }, [readingHistory]);

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

  const getTodayDateKey = () => {
    return formatDateKey(new Date());
  };

  // Mark today as read (used when logging reading progress)
  const markTodayAsRead = () => {
    const todayKey = getTodayDateKey();
    if (!readingHistory[todayKey]) {
      setReadingHistory(prev => ({
        ...prev,
        [todayKey]: true
      }));
    }
  };

  // Recalculate activeStreak whenever readingHistory changes
  const activeStreak = useMemo(() => calculateStreak(), [readingHistory]);
  
  // Get currently reading books from context
  const currentlyReading = getCurrentlyReading();
  
  // Calculate real stats from books
  const finishedBooks = books.filter(b => b.status === 'finished');
  const booksIn2026 = finishedBooks.filter(b => {
    // Check both finishDate and dateRead (imported books use dateRead)
    const dateToCheck = b.finishDate || b.dateRead;
    if (!dateToCheck) return false;
    return dateToCheck.includes('2026');
  }).length;
  
  const audiobooks = books.filter(b => b.format === 'audiobook');
  const totalMinutes = audiobooks.reduce((sum, book) => sum + (book.currentMinutes || 0), 0);
  const hoursListened = Math.round(totalMinutes / 60);
  
  // Calculate pages read in 2026 only
  const booksIn2026Full = finishedBooks.filter(b => {
    // Check both finishDate and dateRead (imported books use dateRead)
    const dateToCheck = b.finishDate || b.dateRead;
    if (!dateToCheck) return false;
    return dateToCheck.includes('2026');
  });
  
  // Include pages from finished books + progress from currently reading books
  const totalPagesFromFinished = booksIn2026Full.reduce((sum, book) => sum + (book.pages || 0), 0);
  const totalPagesFromReading = currentlyReading.reduce((sum, book) => sum + (book.currentPage || 0), 0);
  const totalPages = totalPagesFromFinished + totalPagesFromReading;
  const pagesReadFormatted = totalPages >= 1000 ? `${(totalPages / 1000).toFixed(1)}K` : totalPages.toString();
  
  // Calculate today's minutes from reading sessions
  const today = new Date().toISOString().split('T')[0];
  const readingSessions = JSON.parse(localStorage.getItem('readingSessions') || '[]');
  const todayMinutes = readingSessions
    .filter((session: { date: string }) => session.date === today)
    .reduce((sum: number, session: { minutes: number }) => sum + (session.minutes || 0), 0) || 0;
  
  // Calculate pages read today from daily page log
  const dailyPageLog = JSON.parse(localStorage.getItem('dailyPageLog') || '{}');
  const pagesToday = dailyPageLog[today] || 0;
  
  console.log('📊 [Dashboard] Daily calculation:', {
    today,
    pagesToday,
    todayMinutes,
    dailyPageLog
  });
  
  // Calculate average pages per day (if we have finished books in 2026)
  const avgPagesPerDay = booksIn2026Full.length > 0 && activeStreak > 0
    ? Math.round(totalPages / activeStreak)
    : 0;
  
  // Calculate unique genres read
  const uniqueGenres = new Set(finishedBooks.map(b => b.genre).filter(Boolean)).size;
  
  // Calculate milestone progress
  const milestones = [
    { 
      icon: Award, 
      label: "Speed Reader", 
      description: "Read 3 books in a week!", 
      earned: false, // Could calculate if we track date ranges
      color: 'from-purple-400 to-purple-600' 
    },
    { 
      icon: Flame, 
      label: "30-Day Streak", 
      description: "Read for 30 days straight", 
      earned: activeStreak >= 30, 
      color: 'from-orange-400 to-red-500' 
    },
    { 
      icon: Sparkles, 
      label: "Genre Explorer", 
      description: "Read 5 different genres", 
      earned: uniqueGenres >= 5, 
      progress: Math.min(Math.round((uniqueGenres / 5) * 100), 100), 
      current: uniqueGenres, 
      target: 5 
    },
    { 
      icon: Heart, 
      label: "50 Books", 
      description: "Read 50 books in a year", 
      earned: finishedBooks.length >= 50, 
      progress: Math.min(Math.round((finishedBooks.length / 50) * 100), 100), 
      current: finishedBooks.length, 
      target: 50 
    },
  ];
  
  // Calculate books finished this month (dynamically based on current date)
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-11 (0 = January, 2 = March)
  const currentYear = now.getFullYear();
  
  console.log('📅 [Dashboard] Current date info:', {
    currentMonth,
    currentYear,
    monthName: now.toLocaleString('default', { month: 'long' }),
    fullDate: now.toISOString()
  });
  
  const booksThisMonth = finishedBooks.filter(b => {
    if (!b.finishDate) return false;
    const finishDate = new Date(b.finishDate);
    const matches = finishDate.getMonth() === currentMonth && finishDate.getFullYear() === currentYear;
    
    if (matches) {
      console.log('✅ Book matched for current month:', {
        title: b.title,
        finishDate: b.finishDate,
        month: finishDate.getMonth(),
        year: finishDate.getFullYear()
      });
    }
    
    return matches;
  }).length;
  
  console.log('📊 [Dashboard] Books this month:', booksThisMonth);
  
  // Calculate pages read this month (finished books + current progress from reading books)
  const pagesThisMonthFromFinished = finishedBooks
    .filter(b => {
      if (!b.finishDate) return false;
      const finishDate = new Date(b.finishDate);
      return finishDate.getMonth() === currentMonth && finishDate.getFullYear() === currentYear;
    })
    .reduce((sum, book) => sum + (book.pages || 0), 0);
  const pagesThisMonth = pagesThisMonthFromFinished + totalPagesFromReading;
  
  console.log('📊 [Dashboard] Monthly calculation:', {
    booksThisMonth,
    pagesThisMonthFromFinished,
    pagesFromReading: totalPagesFromReading,
    pagesThisMonth
  });
  
  // Get monthly goals
  const monthlyBookGoal = goals.monthly.books.value || 4;
  const monthlyPageGoal = goals.monthly.pages.value || 1200;
  
  // Additional calculations for stories
  const uniqueAuthors = new Set(finishedBooks.map(b => b.author).filter(Boolean)).size;
  const fiveStarBooks = finishedBooks.filter(b => b.rating === 5).length;
  const avgRating = finishedBooks.length > 0 
    ? (finishedBooks.reduce((sum, b) => sum + (b.rating || 0), 0) / finishedBooks.length).toFixed(1)
    : '0.0';
  
  // Calculate reading days (days with any reading activity)
  const readingDaysCount = Object.keys(readingHistory).length;
  
  // Calculate monthly recap data
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonthName = monthNames[currentMonth];
  const booksThisMonthFull = finishedBooks.filter(b => {
    if (!b.finishDate) return false;
    const finishDate = new Date(b.finishDate);
    return finishDate.getMonth() === currentMonth && finishDate.getFullYear() === currentYear;
  });
  
  // Calculate favorite genre (most read this month)
  const genreCounts: Record<string, number> = {};
  booksThisMonthFull.forEach(book => {
    if (book.genre) {
      genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
    }
  });
  const favoriteGenre = Object.keys(genreCounts).length > 0
    ? Object.keys(genreCounts).reduce((a, b) => genreCounts[a] > genreCounts[b] ? a : b)
    : null;
  
  // Reading days this month
  const readingDaysThisMonth = Object.keys(readingHistory).filter(dateKey => {
    const date = new Date(dateKey);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;
  
  // Calculate top 3 books from this month (highest rated)
  const topBooksThisMonth = booksThisMonthFull
    .filter(b => b.rating && b.rating >= 4)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3);
  
  // Calculate longest streak (use localStorage)
  const longestStreak = parseInt(localStorage.getItem('longestStreak') || '0');
  if (activeStreak > longestStreak) {
    localStorage.setItem('longestStreak', activeStreak.toString());
  }
  const finalLongestStreak = Math.max(activeStreak, longestStreak);
  
  // Calculate year percentage (days read / days passed in 2026)
  const daysPassed = Math.floor((new Date().getTime() - new Date('2026-01-01').getTime()) / (1000 * 60 * 60 * 24));
  const yearPercentage = daysPassed > 0 ? Math.round((readingDaysCount / daysPassed) * 100) : 0;
  
  // Calculate genre breakdown for this month
  const genreBreakdownThisMonth: { name: string; count: number; }[] = [];
  const monthGenreCounts: Record<string, number> = {};
  booksThisMonthFull.forEach(book => {
    if (book.genre) {
      monthGenreCounts[book.genre] = (monthGenreCounts[book.genre] || 0) + 1;
    }
  });
  Object.entries(monthGenreCounts).forEach(([name, count]) => {
    genreBreakdownThisMonth.push({ name, count });
  });
  genreBreakdownThisMonth.sort((a, b) => b.count - a.count);
  
  // Calculate reading speed for this month
  const monthDays = readingDaysThisMonth || 1;
  const pagesPerDayThisMonth = Math.round(pagesThisMonth / monthDays);
  const minutesPerDayThisMonth = Math.round((totalMinutes / Math.max(1, booksThisMonth)) / monthDays);
  const daysPerBookThisMonth = booksThisMonth > 0 ? (monthDays / booksThisMonth).toFixed(1) : '0';
  
  // Find fastest read this month
  const fastestReadThisMonth = booksThisMonthFull.length > 0 
    ? booksThisMonthFull.reduce((fastest, book) => {
        const pages = book.pages || 0;
        const fastestPages = fastest.pages || 0;
        return pages > 0 && pages < fastestPages ? book : fastest;
      }, booksThisMonthFull[0])
    : null;
  
  // Calculate rating distribution for this month
  const ratingDistribution: { rating: number; count: number; }[] = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: booksThisMonthFull.filter(b => b.rating === rating).length,
  }));
  
  const avgRatingThisMonth = booksThisMonthFull.length > 0
    ? booksThisMonthFull.reduce((sum, b) => sum + (b.rating || 0), 0) / booksThisMonthFull.length
    : 0;
  
  // Prepare calendar data for Reading Calendar story
  // Use the current month if it has books, otherwise find the most recent month with data
  let calendarMonth = currentMonth;
  let calendarYear = currentYear;
  let calendarMonthName = currentMonthName;
  let calendarBooksRead = booksThisMonth;
  let calendarPagesRead = pagesThisMonth;
  
  // If current month has no finished books, find most recent month with books
  if (booksThisMonthFull.length === 0 && finishedBooks.length > 0) {
    // Find the most recent finished book
    const sortedBooks = [...finishedBooks].sort((a, b) => {
      const aDate = a.finishDate || a.dateRead || a.dateFinished;
      const bDate = b.finishDate || b.dateRead || b.dateFinished;
      if (!aDate || !bDate) return 0;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });
    
    const mostRecentFinishDate = sortedBooks[0]?.finishDate || sortedBooks[0]?.dateRead || sortedBooks[0]?.dateFinished;
    if (mostRecentFinishDate) {
      const mostRecentDate = new Date(mostRecentFinishDate);
      calendarMonth = mostRecentDate.getMonth();
      calendarYear = mostRecentDate.getFullYear();
      calendarMonthName = new Date(calendarYear, calendarMonth).toLocaleDateString('en-US', { month: 'long' });
      
      // Recalculate books and pages for this month
      const calendarMonthBooks = finishedBooks.filter(book => {
        const bookFinishDate = book.finishDate || book.dateRead || book.dateFinished;
        if (!bookFinishDate) return false;
        const finishDate = new Date(bookFinishDate);
        return finishDate.getMonth() === calendarMonth && finishDate.getFullYear() === calendarYear;
      });
      
      calendarBooksRead = calendarMonthBooks.length;
      calendarPagesRead = calendarMonthBooks.reduce((sum, book) => sum + (book.pages || 0), 0);
    }
  }
  
  const calendarData: { day: number; books: any[] }[] = [];
  const pagesPerDayArray: { day: number; pages: number }[] = [];
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const dayBooks = finishedBooks.filter(book => {
      const bookFinishDate = book.finishDate || book.dateRead || book.dateFinished;
      if (!bookFinishDate) return false;
      const finishDate = new Date(bookFinishDate);
      return finishDate.getDate() === day && 
             finishDate.getMonth() === calendarMonth && 
             finishDate.getFullYear() === calendarYear;
    });
    
    if (dayBooks.length > 0) {
      calendarData.push({ day, books: dayBooks });
    }
    
    // Calculate pages read on this day (from BOTH reading sessions AND daily page log)
    const dateKey = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Get pages from reading sessions
    const pagesFromSessions = readingSessions
      .filter((session: { date: string }) => session.date === dateKey)
      .reduce((sum: number, session: { pages: number }) => sum + (session.pages || 0), 0);
    
    // Get pages from daily page log (this is the primary source)
    const pagesFromLog = dailyPageLog[dateKey] || 0;
    
    // Use the MAXIMUM of the two sources (dailyPageLog is more comprehensive)
    const pagesOnDay = Math.max(pagesFromSessions, pagesFromLog);
    
    pagesPerDayArray.push({ day, pages: pagesOnDay });
  }
  
  // Debug calendar data
  console.log('Calendar Story Data:', {
    month: calendarMonthName,
    year: calendarYear,
    booksRead: calendarBooksRead,
    pagesRead: calendarPagesRead,
    calendarData,
    pagesPerDayArray,
    totalSessions: readingSessions.length,
    finishedBooksCount: finishedBooks.length
  });
  
  // Check if ANY goal is enabled
  const hasAnyGoalEnabled = 
    goals.daily.pages.enabled || 
    goals.daily.minutes.enabled || 
    goals.monthly.books.enabled || 
    goals.monthly.pages.enabled || 
    goals.yearly.books.enabled || 
    goals.yearly.pages.enabled;
  
  // Calculate if user is new (no finished books)
  const isNewUser = finishedBooks.length === 0;
  const hasStartedReading = books.length > 0;
  
  // Save reading history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('readingHistory', JSON.stringify(readingHistory));
  }, [readingHistory]);

  // Show loading state while books are loading
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div 
          className="text-lg font-semibold"
          style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
        >
          Loading your books...
        </div>
      </div>
    );
  }

  // Helper to get gradient background
  const getGradientBg = () => {
    return currentTheme.isGradient
      ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
      : currentTheme.primary;
  };

  const handleBookClick = (book: any) => {
    if (onBookSelect) {
      onBookSelect(book);
    } else {
      setSelectedBook(book);
      setShowBookDetail(true);
    }
  };

  const handleMarkReadToday = () => {
    markTodayAsRead(); // Auto-mark in reading history
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    const dayIndex = today === 0 ? 6 : today - 1; // Convert to Mon=0, Sun=6
    const newReadingDays = [...readingDays];
    newReadingDays[dayIndex] = true;
    setReadingDays(newReadingDays);
  };

  const getTodayIndex = () => {
    const today = new Date().getDay();
    return today === 0 ? 6 : today - 1; // Convert to Mon=0, Sun=6
  };

  const handleDayToggle = (dayIndex: number) => {
    // Calculate the date for this day of the week
    const getStartOfWeek = () => {
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 = Sunday
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Calculate days since Monday
      const monday = new Date(now);
      monday.setDate(now.getDate() - diff);
      monday.setHours(0, 0, 0, 0);
      return monday;
    };

    const startOfWeek = getStartOfWeek();
    const clickedDate = new Date(startOfWeek);
    clickedDate.setDate(startOfWeek.getDate() + dayIndex);
    const dateKey = formatDateKey(clickedDate);

    // Don't allow marking future dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (clickedDate > today) {
      return; // Can't mark future days
    }

    // Toggle in readingHistory
    const newValue = !readingHistory[dateKey];
    setReadingHistory(prev => {
      if (newValue) {
        return { ...prev, [dateKey]: true };
      } else {
        const updated = { ...prev };
        delete updated[dateKey];
        return updated;
      }
    });
  };

  // Sync readingDays with readingHistory for the current week
  useEffect(() => {
    const getStartOfWeek = () => {
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 = Sunday
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Calculate days since Monday
      const monday = new Date(now);
      monday.setDate(now.getDate() - diff);
      monday.setHours(0, 0, 0, 0);
      return monday;
    };

    const startOfWeek = getStartOfWeek();
    const newReadingDays = [false, false, false, false, false, false, false];
    
    // Check each day of the current week
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateKey = formatDateKey(date);
      
      // Mark as read if it exists in readingHistory
      if (readingHistory[dateKey]) {
        newReadingDays[i] = true;
      }
    }
    
    setReadingDays(newReadingDays);
  }, [readingHistory]);

  // Live popular books feed for dashboard home.
  useEffect(() => {
    let isActive = true;

    const fetchPopularBooks = async () => {
      setIsLoadingPopularBooks(true);
      try {
        const popularFeed = await getPopularBooksFeed();
        const mapped = popularFeed.books
          .filter((book) => book.title && book.author)
          .slice(0, 12);

        if (isActive) {
          setPopularBooks(mapped);
          setPopularBooksSource(popularFeed.source);
          setPopularBooksFetchedAt(popularFeed.fetchedAt);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard popular books:', error);
        if (isActive) {
          setPopularBooks([]);
        }
      } finally {
        if (isActive) {
          setIsLoadingPopularBooks(false);
        }
      }
    };

    fetchPopularBooks();
    return () => {
      isActive = false;
    };
  }, []);

  // Personalized recommendation feed based on user reading history.
  useEffect(() => {
    let isActive = true;

    const fetchRecommendations = async () => {
      if (!books.length) {
        setRecommendedBooks([]);
        return;
      }

      setIsLoadingRecommendedBooks(true);
      try {
        const ownedKeys = new Set(
          books
            .map((book) => getDiscoveryKey(book))
            .filter(Boolean),
        );

        const authorCounts: Record<string, number> = {};
        const genreCounts: Record<string, number> = {};
        const highRatedFinished = books
          .filter((book) => book.status === 'finished' && (book.rating || 0) >= 4)
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 3);

        books
          .filter((book) => book.status === 'reading' || book.status === 'finished')
          .forEach((book) => {
            if (book.author) {
              authorCounts[book.author] = (authorCounts[book.author] || 0) + (book.status === 'reading' ? 2 : 1);
            }

            const primaryGenre = book.genre || book.categories?.[0];
            if (primaryGenre) {
              genreCounts[primaryGenre] = (genreCounts[primaryGenre] || 0) + (book.status === 'reading' ? 2 : 1);
            }
          });

        const topAuthors = Object.entries(authorCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([author]) => author);

        const topGenres = Object.entries(genreCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([genre]) => genre);

        const queryPlans: Array<{ query: string; reason: string }> = [];
        const seenQueries = new Set<string>();
        const addQuery = (query: string, reason: string) => {
          const trimmed = query.trim();
          if (!trimmed || seenQueries.has(trimmed)) return;
          seenQueries.add(trimmed);
          queryPlans.push({ query: trimmed, reason });
        };

        topAuthors.forEach((author) => addQuery(`inauthor:"${author}"`, `Because you read ${author}`));
        topGenres.forEach((genre) => addQuery(`subject:${genre} fiction`, `Popular in your favorite genre: ${genre}`));
        highRatedFinished.forEach((book) =>
          addQuery(`${book.author} ${book.genre || 'novel'}`, `Because you liked ${book.title}`),
        );
        addQuery('subject:fiction bestseller', 'Popular with readers right now');

        const limitedPlans = queryPlans.slice(0, 6);
        const settled = await Promise.allSettled(
          limitedPlans.map((plan) =>
            searchBooks({
              query: plan.query,
              maxResults: 12,
              orderBy: 'relevance',
            }),
          ),
        );

        const deduped = new Map<string, DiscoveryBook>();
        settled.forEach((result, index) => {
          if (result.status !== 'fulfilled') return;
          const reason = limitedPlans[index]?.reason;

          result.value
            .map(convertGoogleBookToBookData)
            .forEach((candidate) => {
              const key = getDiscoveryKey(candidate);
              if (!key || ownedKeys.has(key) || deduped.has(key)) return;
              deduped.set(key, { ...candidate, reason });
            });
        });

        let picks = Array.from(deduped.values()).slice(0, 12);

        if (picks.length < 8) {
          const fallback = await getTrendingBooks();
          fallback
            .map(convertGoogleBookToBookData)
            .forEach((candidate) => {
              if (picks.length >= 12) return;
              const key = getDiscoveryKey(candidate);
              if (!key || ownedKeys.has(key) || deduped.has(key)) return;
              deduped.set(key, { ...candidate, reason: 'Popular with readers right now' });
            });

          picks = Array.from(deduped.values()).slice(0, 12);
        }

        if (isActive) {
          setRecommendedBooks(picks);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard recommendations:', error);
        if (isActive) {
          setRecommendedBooks([]);
        }
      } finally {
        if (isActive) {
          setIsLoadingRecommendedBooks(false);
        }
      }
    };

    fetchRecommendations();
    return () => {
      isActive = false;
    };
  }, [books]);

  const isReadToday = readingDays[getTodayIndex()];
  const hasAnyShelvedBooks =
    bookshelves.some((shelf) => (shelf.bookIds || []).length > 0) ||
    customShelves.some((shelf) => (shelf.bookIds || []).length > 0);
  const shouldShowPersonalizedRecommendations = books.length > 0 || hasAnyShelvedBooks;

  return (
    <div className="space-y-6">
      {/* Theme Picker */}
      <ThemePicker />

      {/* Import Files Button - Only show for new users without any books */}
      {books.length === 0 && (
        <motion.button
          onClick={() => onOpenImport?.()}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full rounded-xl p-4 shadow-lg transition-all group"
          style={{
            background: currentTheme.isGradient
              ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
              : currentTheme.primary,
          }}
        >
          <div className="flex items-center justify-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              <Upload className="w-5 h-5" style={{ color: '#ffffff' }} />
            </div>
            <div className="text-left">
              <div 
                className="font-bold text-sm"
                style={{ color: '#ffffff' }}
              >
                Import Files
              </div>
              <div 
                className="text-xs"
                style={{ color: 'rgba(255, 255, 255, 0.8)' }}
              >
                Migrate from Goodreads, StoryGraph & more
              </div>
            </div>
          </div>
        </motion.button>
      )}

      {/* Hero Section with Smart Insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden p-6 shadow-lg"
        style={{
          background: currentTheme.isGradient
            ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
            : currentTheme.primary,
        }}
      >
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-1" style={{ color: '#ffffff' }}>
            {isNewUser ? 'Welcome! 📚' : 'Welcome back! 📚'}
          </h2>
          {!isNewUser ? (
            <>
              <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.9)' }}>
                {booksIn2026} books this year{booksIn2026 > 10 ? " · You're crushing it!" : booksIn2026 > 0 ? " · Great start!" : ""}
              </p>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="backdrop-blur-sm rounded-xl p-3 text-sm"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#ffffff' }} />
                  <div style={{ color: '#ffffff' }}>
                    <span className="font-semibold">Keep up the great reading momentum!</span>
                    <br />
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      {activeStreak > 0 ? `You're on a ${activeStreak}-day streak 🔥` : "Start reading today to build your streak!"}
                    </span>
                  </div>
                </div>
              </motion.div>
            </>
          ) : (
            <>
              <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.9)' }}>Start your reading journey today!</p>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="backdrop-blur-sm rounded-xl p-3 text-sm"
                style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
              >
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#ffffff' }} />
                  <div style={{ color: '#ffffff' }}>
                    <span className="font-semibold">Ready to track your reading?</span>
                    <br />
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      Import your past reading data or add your first book 📖
                    </span>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </div>
        <div className="absolute right-4 bottom-4 opacity-10">
          <Book className="w-24 h-24" style={{ color: '#ffffff' }} />
        </div>
      </motion.div>

      {/* Reading Stories - Instagram Style */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ReadingStories
          stories={[
            {
              id: 'streak',
              icon: Flame,
              label: 'Streak',
              component: (
                <StreakStory 
                  streak={activeStreak} 
                  cardColor={currentTheme.cardColor}
                />
              ),
            },
            {
              id: 'calendar',
              icon: Calendar,
              label: 'Calendar',
              component: (
                <ReadingCalendarStory 
                  month={calendarMonthName}
                  year={calendarYear}
                  pagesRead={calendarPagesRead}
                  booksRead={calendarBooksRead}
                  calendarData={calendarData}
                  pagesPerDay={pagesPerDayArray}
                  readingSessions={readingSessions}
                  books={books}
                />
              ),
            },
            ...(topBooksThisMonth.length >= 3 ? [{
              id: 'topbooks',
              icon: Award,
              label: 'Top 3',
              component: (
                <TopBooksStory 
                  month={currentMonthName}
                  year={currentYear}
                  books={topBooksThisMonth}
                />
              ),
            }] : []),
            ...(booksThisMonthFull.length > 0 ? [{
              id: 'monthlygrid',
              icon: BookOpen,
              label: `${currentMonthName} Reads`,
              component: (
                <MonthlyBooksGridStory 
                  month={currentMonthName}
                  year={currentYear}
                  books={booksThisMonthFull}
                />
              ),
            }] : []),
            {
              id: 'books',
              icon: Book,
              label: 'Books 2026',
              component: (
                <BooksStory 
                  booksCount={booksIn2026} 
                  booksThisMonth={booksThisMonth}
                  cardColor={currentTheme.cardColor}
                />
              ),
            },
            {
              id: 'monthlystats',
              icon: PieChart,
              label: 'Stats',
              component: (
                <MonthlyStatsGridStory 
                  month={currentMonthName}
                  year={currentYear}
                  stats={{
                    pagesThisMonth: pagesThisMonth,
                    pagesThisYear: totalPages,
                    yearGoal: goals.yearly.pages.value || 10000,
                    longestDay: Math.max(0, ...Object.values(readingSessions || {})
                      .filter((s: any) => {
                        const sessionDate = new Date(s.date + 'T00:00:00');
                        return sessionDate.getMonth() === currentMonth && sessionDate.getFullYear() === currentYear;
                      })
                      .map((s: any) => s.pagesRead || 0)),
                    streak: activeStreak,
                    authorsRead: uniqueAuthors,
                    avgRating: avgRating,
                  }}
                />
              ),
            },
            ...(genreBreakdownThisMonth.length > 0 ? [{
              id: 'genres',
              icon: PieChart,
              label: 'Genres',
              component: (
                <GenreBreakdownStory 
                  month={currentMonthName}
                  year={currentYear}
                  genres={genreBreakdownThisMonth}
                />
              ),
            }] : []),
            {
              id: 'pagesperdaychart',
              icon: TrendingUp,
              label: 'Pages/Day',
              component: (
                <PagesPerDayChartStory 
                  month={currentMonthName}
                  year={currentYear}
                  pagesPerDay={pagesPerDayArray}
                />
              ),
            },
            {
              id: 'audiobooks',
              icon: Headphones,
              label: 'Listening',
              component: (
                <AudiobooksStory 
                  hours={hoursListened} 
                  audiobookCount={audiobooks.length}
                  cardColor={currentTheme.cardColor}
                />
              ),
            },
            {
              id: 'pages',
              icon: BookOpen,
              label: 'Pages',
              component: (
                <PagesStory 
                  pages={totalPages} 
                  avgPerDay={avgPagesPerDay}
                  cardColor={currentTheme.cardColor}
                />
              ),
            },
            {
              id: 'thisweek',
              icon: Calendar,
              label: 'This Week',
              component: (
                <ThisWeekStory 
                  readingDays={readingDays}
                  onDayToggle={handleDayToggle}
                  cardColor={currentTheme.cardColor}
                />
              ),
            },
            {
              id: 'goals',
              icon: Target,
              label: 'Goals',
              component: (
                <ReadingGoalsStory 
                  goals={goals}
                  progress={{
                    daily: {
                      pages: pagesToday,
                      minutes: todayMinutes,
                    },
                    monthly: {
                      books: booksThisMonth,
                      pages: pagesThisMonth,
                    },
                    yearly: {
                      books: booksIn2026,
                      pages: totalPages,
                    },
                  }}
                />
              ),
            },
            {
              id: 'stats',
              icon: TrendingUp,
              label: 'Stats',
              component: (
                <DetailedStatsStory 
                  stats={{
                    avgTimeMinutes: Math.round(totalMinutes / Math.max(1, booksIn2026)),
                    totalPages: totalPages,
                    fiveStarBooks: fiveStarBooks,
                    uniqueAuthors: uniqueAuthors,
                    badgesEarned: 10, // Would come from BadgesContext
                    totalBadges: 23,
                    readingDays: readingDaysCount,
                  }}
                />
              ),
            },
            {
              id: 'averages',
              icon: Clock,
              label: 'Averages',
              component: (
                <AverageStatsStory 
                  month={currentMonthName}
                  year={currentYear}
                  avgDaysToFinish={Math.round(parseFloat(daysPerBookThisMonth))}
                  avgBookLength={Math.round(booksThisMonthFull.reduce((sum, b) => sum + (b.pages || 0), 0) / Math.max(1, booksThisMonthFull.length))}
                />
              ),
            },
            {
              id: 'year',
              icon: Sparkles,
              label: '2026',
              component: (
                <YearInReviewStory 
                  year={2026}
                  stats={{
                    booksRead: booksIn2026,
                    pagesFormatted: pagesReadFormatted,
                    avgRating: avgRating,
                    timeReading: hoursListened > 0 ? `${hoursListened}h` : `${Math.round(totalMinutes / 60)}h`,
                  }}
                />
              ),
            },
            {
              id: 'monthly',
              icon: Calendar,
              label: `${currentMonthName}`,
              component: (
                <MonthlyRecapStory 
                  month={currentMonthName}
                  year={currentYear}
                  books={booksThisMonthFull}
                  stats={{
                    booksFinished: booksThisMonth,
                    pagesRead: pagesThisMonth,
                    readingDays: readingDaysThisMonth,
                    favoriteGenre: favoriteGenre,
                  }}
                />
              ),
            },
            {
              id: 'streakdetails',
              icon: Flame,
              label: 'Streak',
              component: (
                <StreakDetailsStory 
                  currentStreak={activeStreak}
                  longestStreak={finalLongestStreak}
                  yearPercentage={yearPercentage}
                />
              ),
            },
            {
              id: 'speed',
              icon: Zap,
              label: 'Speed',
              component: (
                <ReadingSpeedStory 
                  month={currentMonthName}
                  year={currentYear}
                  stats={{
                    pagesPerDay: pagesPerDayThisMonth,
                    minutesPerDay: minutesPerDayThisMonth,
                    daysPerBook: parseFloat(daysPerBookThisMonth),
                    fastestRead: fastestReadThisMonth ? {
                      title: fastestReadThisMonth.title,
                      time: `${Math.round((fastestReadThisMonth.pages || 0) / 50)} hours`,
                    } : null,
                  }}
                />
              ),
            },
            ...(booksThisMonthFull.length > 0 ? [{
              id: 'ratings',
              icon: Heart,
              label: 'Ratings',
              component: (
                <RatingBreakdownStory 
                  month={currentMonthName}
                  year={currentYear}
                  avgRating={avgRatingThisMonth}
                  distribution={ratingDistribution}
                />
              ),
            }] : []),
          ]}
        />
      </motion.div>

      {/* Currently Reading with Quick Update */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 
            className="text-xl font-bold"
            style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
          >
            Currently Reading
          </h2>
          <button 
            className="text-xs font-semibold"
            style={{ color: currentTheme.accentColor }}
          >
            View All
          </button>
        </div>
        <div className="space-y-4">
          {currentlyReading.map((book, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="rounded-xl p-4 shadow-sm"
              style={{
                backgroundColor: currentTheme.cardColor,
                borderColor: currentTheme.borderColor,
                borderWidth: '1px',
              }}
            >
              <div className="flex gap-3 mb-3">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: -2 }}
                  onClick={() => handleBookClick(book)}
                  className="w-16 h-24 rounded-lg overflow-hidden shadow-md flex-shrink-0 cursor-pointer"
                >
                  <BookCover 
                    src={book.cover} 
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <h3 
                    onClick={() => handleBookClick(book)}
                    className="font-semibold text-sm mb-1 line-clamp-2 cursor-pointer"
                    style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
                  >
                    {book.title}
                  </h3>
                  <p 
                    className="text-xs mb-2"
                    style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                  >
                    {book.author}
                  </p>
                  
                  {/* Format Indicator */}
                  {book.format && (
                    <div className="mb-3">
                      {book.format === 'physical' && (
                        <div 
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md"
                          style={{
                            backgroundColor: currentTheme.textColor === 'light' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)',
                            borderColor: currentTheme.textColor === 'light' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.3)',
                            borderWidth: '1px',
                          }}
                        >
                          <BookOpen className="w-2.5 h-2.5" style={{ color: '#3b82f6' }} />
                          <span className="text-[9px] font-semibold" style={{ color: '#3b82f6' }}>Physical</span>
                        </div>
                      )}
                      {book.format === 'ebook' && (
                        <div 
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md"
                          style={{
                            backgroundColor: currentTheme.textColor === 'light' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(168, 85, 247, 0.15)',
                            borderColor: currentTheme.textColor === 'light' ? 'rgba(168, 85, 247, 0.4)' : 'rgba(168, 85, 247, 0.3)',
                            borderWidth: '1px',
                          }}
                        >
                          <Smartphone className="w-2.5 h-2.5" style={{ color: '#a855f7' }} />
                          <span className="text-[9px] font-semibold" style={{ color: '#a855f7' }}>eBook</span>
                        </div>
                      )}
                      {book.format === 'audiobook' && (
                        <div 
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md"
                          style={{
                            backgroundColor: currentTheme.textColor === 'light' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.15)',
                            borderColor: currentTheme.textColor === 'light' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(34, 197, 94, 0.3)',
                            borderWidth: '1px',
                          }}
                        >
                          <Headphones className="w-2.5 h-2.5" style={{ color: '#22c55e' }} />
                          <span className="text-[9px] font-semibold" style={{ color: '#22c55e' }}>Audiobook</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}>
                        {book.format === 'audiobook' 
                          ? `${typeof book.currentMinutes === 'number' ? book.currentMinutes : 0} / ${typeof book.audioDuration === 'number' ? book.audioDuration : 0} min`
                          : `${typeof book.currentPage === 'number' ? book.currentPage : 0} / ${typeof book.pages === 'number' ? book.pages : 0} pages`
                        }
                      </span>
                      <span className="font-semibold" style={{ color: currentTheme.primary }}>
                        {typeof book.progress === 'number' ? book.progress : 0}%
                      </span>
                    </div>
                    <div 
                      className="h-2 rounded-full overflow-hidden"
                      style={{ 
                        backgroundColor: currentTheme.textColor === 'light' 
                          ? 'rgba(255, 255, 255, 0.1)' 
                          : 'rgba(0, 0, 0, 0.1)' 
                      }}
                    >
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${typeof book.progress === 'number' ? book.progress : 0}%` }}
                        transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                        className="h-full"
                        style={{
                          background: getGradientBg(),
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Quick Update Button */}
              <div 
                className="pt-3"
                style={{
                  borderTopColor: currentTheme.borderColor,
                  borderTopWidth: '1px',
                }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBookForProgress(index);
                    setShowQuickProgress(true);
                  }}
                  className="w-full text-white text-sm font-bold py-2.5 px-4 rounded-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
                  style={{
                    background: getGradientBg(),
                  }}
                >
                  <BookOpen className="w-4 h-4" />
                  Update Progress
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Add Book Button */}
        <motion.button
          onClick={() => setShowAddBook(true)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 rounded-xl p-4 border-2 border-dashed transition-all group"
          style={{
            backgroundColor: currentTheme.cardColor,
            borderColor: currentTheme.borderColor,
            color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280',
          }}
        >
          <div className="flex items-center justify-center gap-2">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
              style={{
                background: getGradientBg(),
              }}
            >
              <Plus className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <div 
                className="font-bold text-sm"
                style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
              >
                Add Book
              </div>
              <div 
                className="text-xs"
                style={{ color: currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af' }}
              >
                Start tracking a new read
              </div>
            </div>
          </div>
        </motion.button>
      </motion.div>

      {/* Reading Goals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl p-5 text-white shadow-lg"
        style={{
          background: currentTheme.isGradient
            ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
            : currentTheme.primary,
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            <h3 className="font-bold">Reading Goals</h3>
          </div>
          <button
            onClick={() => setShowGoalSettings(true)}
            className="flex items-center gap-1 px-2 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-semibold text-white transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Show "Set Reading Goals" CTA if no goals are enabled */}
        {!hasAnyGoalEnabled ? (
          <motion.button
            onClick={() => setShowGoalSettings(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-xl p-6 bg-white/10 hover:bg-white/20 transition-all border-2 border-dashed border-white/30"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div className="text-center">
                <div className="font-bold text-base mb-1">Set Your Reading Goals</div>
                <div className="text-sm text-white/80">
                  Track daily, monthly, and yearly progress
                </div>
              </div>
            </div>
          </motion.button>
        ) : (
          <>
            {/* Daily Goals */}
            {(goals.daily.pages.enabled || goals.daily.minutes.enabled) && (
          <div className="mb-3">
            <div className="text-xs font-semibold text-white/60 mb-1.5">TODAY</div>
            {goals.daily.pages.enabled && (
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-white/90">Pages</span>
                  <span className="font-bold">{pagesToday} / {goals.daily.pages.value}</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${goals.daily.pages.value > 0 ? Math.min((pagesToday / goals.daily.pages.value) * 100, 100) : 0}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
              </div>
            )}
            {goals.daily.minutes.enabled && (
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-white/90">Minutes</span>
                  <span className="font-bold">{todayMinutes || 0} / {goals.daily.minutes.value}</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${
                        goals.daily.minutes.value > 0 && todayMinutes >= 0
                          ? Math.min((todayMinutes / goals.daily.minutes.value) * 100, 100)
                          : 0
                      }%` 
                    }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Monthly Goals */}
        {(goals.monthly.books.enabled || goals.monthly.pages.enabled) && (
          <div className="mb-3">
            <div className="text-xs font-semibold text-white/60 mb-1.5">THIS MONTH</div>
            {goals.monthly.books.enabled && (
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-white/90">Books</span>
                  <span className="font-bold">{booksThisMonth} / {goals.monthly.books.value}</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${goals.monthly.books.value > 0 ? Math.min((booksThisMonth / goals.monthly.books.value) * 100, 100) : 0}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
              </div>
            )}
            {goals.monthly.pages.enabled && (
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-white/90">Pages</span>
                  <span className="font-bold">{pagesThisMonth} / {goals.monthly.pages.value}</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${goals.monthly.pages.value > 0 ? Math.min((pagesThisMonth / goals.monthly.pages.value) * 100, 100) : 0}%` }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Yearly Goals */}
        {(goals.yearly.books.enabled || goals.yearly.pages.enabled) && (
          <div>
            <div className="text-xs font-semibold text-white/60 mb-1.5">THIS YEAR (2026)</div>
            {goals.yearly.books.enabled && (
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-white/90">Books</span>
                  <span className="font-bold">{booksIn2026} / {goals.yearly.books.value}</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${goals.yearly.books.value > 0 ? Math.min((booksIn2026 / goals.yearly.books.value) * 100, 100) : 0}%` }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
              </div>
            )}
            {goals.yearly.pages.enabled && (
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-white/90">Pages</span>
                  <span className="font-bold">{totalPages} / {goals.yearly.pages.value}</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${goals.yearly.pages.value > 0 ? Math.min((totalPages / goals.yearly.pages.value) * 100, 100) : 0}%` }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
              </div>
            )}
          </div>
        )}
          </>
        )}
      </motion.div>

      {/* This Week Card - Reading Tracker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl p-5 shadow-lg"
        style={{
          backgroundColor: currentTheme.cardColor,
          borderColor: currentTheme.borderColor,
          borderWidth: '1px',
        }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="p-2.5 rounded-xl"
              style={{
                background: `${currentTheme.accentColor}20`,
              }}
            >
              <Calendar className="w-5 h-5" style={{ color: currentTheme.accentColor }} />
            </div>
            <div>
              <h3 
                className="font-bold"
                style={{ color: cardTextColor === 'light' ? '#ffffff' : '#111827' }}
              >
                This Week
              </h3>
              <p 
                className="text-xs"
                style={{ color: cardTextColor === 'light' ? '#9ca3af' : '#6b7280' }}
              >
                Track your reading days
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCalendarEdit(true)}
            className="p-2 rounded-lg hover:scale-110 transition-transform"
            style={{
              backgroundColor: `${currentTheme.accentColor}20`,
              color: currentTheme.accentColor,
            }}
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>

        {/* Active Streak Display */}
        {activeStreak > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 rounded-xl p-3 flex items-center justify-between"
            style={{
              background: `linear-gradient(135deg, ${currentTheme.accentColor}15 0%, ${currentTheme.accentColor}25 100%)`,
              borderColor: `${currentTheme.accentColor}40`,
              borderWidth: '1px',
            }}
          >
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5" style={{ color: currentTheme.accentColor }} />
              <div>
                <div 
                  className="text-sm font-bold"
                  style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
                >
                  {activeStreak} Day Streak! 🔥
                </div>
                <div 
                  className="text-xs"
                  style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                >
                  Keep it going!
                </div>
              </div>
            </div>
            <div 
              className="text-2xl font-bold"
              style={{ color: currentTheme.accentColor }}
            >
              {activeStreak}
            </div>
          </motion.div>
        )}

        {/* Big "I Read Today" Button */}
        <motion.button
          onClick={handleMarkReadToday}
          disabled={isReadToday}
          whileTap={!isReadToday ? { scale: 0.95 } : {}}
          className="w-full rounded-xl p-4 mb-4 font-bold text-lg text-white transition-all"
          style={{
            background: isReadToday ? currentTheme.successColor : getGradientBg(),
            opacity: isReadToday ? 0.9 : 1,
          }}
        >
          {isReadToday ? (
            <div className="flex items-center justify-center gap-2">
              <Check className="w-6 h-6" />
              <span>Marked for Today! 🎉</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <BookOpen className="w-5 h-5" />
              <span>I Read Today</span>
            </div>
          )}
        </motion.button>

        {/* Days of Week with Checkmarks */}
        <div className="grid grid-cols-7 gap-2">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
            const isRead = readingDays[i];
            const isToday = i === getTodayIndex();
            return (
              <motion.button
                key={`day-${i}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  // Calculate the date for this day of the week
                  const getStartOfWeek = () => {
                    const now = new Date();
                    const dayOfWeek = now.getDay(); // 0 = Sunday
                    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Calculate days since Monday
                    const monday = new Date(now);
                    monday.setDate(now.getDate() - diff);
                    monday.setHours(0, 0, 0, 0);
                    return monday;
                  };

                  const startOfWeek = getStartOfWeek();
                  const clickedDate = new Date(startOfWeek);
                  clickedDate.setDate(startOfWeek.getDate() + i);
                  const dateKey = formatDateKey(clickedDate);

                  // Don't allow marking future dates
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  if (clickedDate > today) {
                    return; // Can't mark future days
                  }

                  // Toggle in readingHistory
                  const newValue = !readingHistory[dateKey];
                  setReadingHistory(prev => {
                    if (newValue) {
                      return { ...prev, [dateKey]: true };
                    } else {
                      const updated = { ...prev };
                      delete updated[dateKey];
                      return updated;
                    }
                  });
                }}
                className="text-center"
              >
                <div 
                  className="h-12 rounded-lg mb-1.5 flex items-center justify-center relative transition-all"
                  style={{
                    backgroundColor: isRead ? currentTheme.successColor : (currentTheme.textColor === 'light' ? '#374151' : '#f3f4f6'),
                    ...(isToday && { ringWidth: '2px', ringColor: currentTheme.accentColor, ringStyle: 'solid' }),
                  }}
                >
                  {isRead && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                    >
                      <Check className="w-5 h-5 text-white" />
                    </motion.div>
                  )}
                </div>
                <div 
                  className="text-[10px] font-semibold"
                  style={{ color: isToday ? currentTheme.accentColor : (currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280') }}
                >
                  {day}
                  {isToday && (
                    <div className="text-[8px]" style={{ color: currentTheme.accentColor }}>
                      Today
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Stats Grid with animations */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Flame, label: "Reading Streak", value: activeStreak.toString(), subtext: activeStreak === 1 ? "day 🔥" : "days 🔥", gradient: true, delay: 0 },
          { icon: Book, label: "Books in 2026", value: booksIn2026.toString(), subtext: booksThisMonth > 0 ? `+${booksThisMonth} this month` : "Start reading!", gradient: false, delay: 0.1 },
          { icon: Headphones, label: "Hours Listened", value: hoursListened > 0 ? `${hoursListened}h` : "0h", subtext: audiobooks.length > 0 ? `${audiobooks.length} audiobooks` : "No audiobooks", gradient: false, delay: 0.2 },
          { icon: BookOpen, label: "Pages Read", value: pagesReadFormatted, subtext: avgPagesPerDay > 0 ? `Avg. ${avgPagesPerDay}/day` : "0/day", gradient: false, delay: 0.3 }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: stat.delay }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Popular Books */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" style={{ color: currentTheme.accentColor }} />
            <h2 
              className="text-xl font-bold"
              style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
            >
              Popular Books
            </h2>
          </div>
        </div>
        <p
          className="text-[11px] -mt-2 mb-3"
          style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
        >
          Source: {popularBooksSource === 'nyt' ? 'NYT Best Sellers' : 'Live Trending Index'}
          {popularBooksFetchedAt ? ` · Updated ${new Date(popularBooksFetchedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : ''}
        </p>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
          {isLoadingPopularBooks && popularBooks.length === 0 && (
            <div className="py-4">
              <LoadingSpinner text="Loading popular books..." />
            </div>
          )}
          {popularBooks.map((book, index) => (
            <motion.div
              key={book.isbn || book.googleBooksId || `${book.title}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="flex-shrink-0 w-32 cursor-pointer"
              onClick={() => handleBookClick(book)}
            >
              <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-md mb-2 relative">
                <BookCover 
                  src={book.cover} 
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 
                className="text-xs font-semibold line-clamp-2 mb-0.5"
                style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
              >
                {book.title}
              </h3>
              <p 
                className="text-[10px]"
                style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
              >
                {book.author}
              </p>
            </motion.div>
          ))}
          {!isLoadingPopularBooks && popularBooks.length === 0 && (
            <p
              className="text-sm"
              style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
            >
              Popular books are temporarily unavailable.
            </p>
          )}
        </div>
      </motion.div>

      {/* Personalized Recommendations */}
      {shouldShowPersonalizedRecommendations && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" style={{ color: currentTheme.accentColor }} />
              <h2
                className="text-xl font-bold"
                style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
              >
                Recommended for You
              </h2>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {isLoadingRecommendedBooks && recommendedBooks.length === 0 && (
              <div className="py-4">
                <LoadingSpinner text="Finding books you'll love..." />
              </div>
            )}
            {recommendedBooks.map((book, index) => (
              <motion.div
                key={book.isbn || book.googleBooksId || `recommended-${book.title}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.08 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="flex-shrink-0 w-32 cursor-pointer"
                onClick={() => handleBookClick(book)}
              >
                <div className="aspect-[2/3] rounded-lg overflow-hidden shadow-md mb-2 relative">
                  <BookCover
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                  {book.reason && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                      <span className="text-white text-[9px] font-semibold leading-tight">{book.reason}</span>
                    </div>
                  )}
                </div>
                <h3
                  className="text-xs font-semibold line-clamp-2 mb-0.5"
                  style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
                >
                  {book.title}
                </h3>
                <p
                  className="text-[10px]"
                  style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                >
                  {book.author}
                </p>
              </motion.div>
            ))}
            {!isLoadingRecommendedBooks && recommendedBooks.length === 0 && (
              <p
                className="text-sm"
                style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
              >
                Add or finish a few books to unlock personalized recommendations.
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Badges & Milestones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h2 
              className="text-xl font-bold"
              style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
            >
              {isNewUser ? 'Unlock Badges' : 'Recent Badges'}
            </h2>
          </div>
          <button 
            onClick={() => onNavigate && onNavigate('badges')}
            className="text-xs font-semibold"
            style={{ color: currentTheme.accentColor }}
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {milestones.map((milestone, index) => {
            const Icon = milestone.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                whileHover={{ scale: milestone.earned ? 1.05 : 1.02 }}
                className={`rounded-xl p-4 relative ${
                  milestone.earned 
                    ? `bg-gradient-to-br ${milestone.color} text-white shadow-lg` 
                    : ''
                }`}
                style={{
                  backgroundColor: milestone.earned ? undefined : currentTheme.cardColor,
                  borderColor: milestone.earned ? undefined : currentTheme.borderColor,
                  borderWidth: milestone.earned ? undefined : '1px',
                }}
              >
                <Icon 
                  className="w-6 h-6 mb-2" 
                  style={{ color: milestone.earned ? undefined : (currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280') }} 
                />
                <h3 
                  className="font-bold text-sm mb-1" 
                  style={{ color: milestone.earned ? undefined : (currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827') }}
                >
                  {milestone.label}
                </h3>
                <p 
                  className={`text-xs ${milestone.earned ? 'text-white/80' : ''}`} 
                  style={{ color: milestone.earned ? undefined : (currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280') }}
                >
                  {milestone.description}
                </p>
                
                {/* Progress bar for unearned badges */}
                {!milestone.earned && milestone.progress !== undefined && (
                  <div className="mt-3">
                    <div 
                      className="flex justify-between text-xs mb-1" 
                      style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                    >
                      <span>{milestone.current || 0}</span>
                      <span>{milestone.target}</span>
                    </div>
                    <div 
                      className="h-1.5 rounded-full overflow-hidden" 
                      style={{ backgroundColor: currentTheme.textColor === 'light' ? '#374151' : '#e5e7eb' }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${milestone.progress}%` }}
                        transition={{ duration: 0.5, delay: 1.1 + index * 0.1 }}
                        className="h-full"
                        style={{
                          background: getGradientBg(),
                        }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Monthly Reading Goal Progress */}
      {(booksThisMonth > 0 || pagesThisMonth > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="rounded-2xl p-5 shadow-lg"
          style={{
            backgroundColor: currentTheme.cardColor,
            borderColor: currentTheme.borderColor,
            borderWidth: '1px',
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 
                className="font-bold"
                style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
              >
                {new Date().toLocaleString('default', { month: 'long' })} Progress
              </h3>
              <p 
                className="text-xs"
                style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
              >
                {booksThisMonth > 0 || pagesThisMonth > 0 ? "You're on track!" : "Get started this month!"}
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}>Books Completed</span>
                <span className="font-semibold" style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}>{booksThisMonth} / {monthlyBookGoal}</span>
              </div>
              <div 
                className="h-2 rounded-full overflow-hidden" 
                style={{ backgroundColor: currentTheme.textColor === 'light' ? '#374151' : '#e5e7eb' }}
              >
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((booksThisMonth / monthlyBookGoal) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: 1.3 }}
                  className="h-full"
                  style={{
                    background: getGradientBg(),
                  }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}>Reading Goal</span>
                <span className="font-semibold" style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}>{pagesThisMonth} / {monthlyPageGoal} pages</span>
              </div>
              <div 
                className="h-2 rounded-full overflow-hidden" 
                style={{ backgroundColor: currentTheme.textColor === 'light' ? '#374151' : '#e5e7eb' }}
              >
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((pagesThisMonth / monthlyPageGoal) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: 1.4 }}
                  className="h-full"
                  style={{
                    background: getGradientBg(),
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Fun Comparison */}
      {totalPages > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7 }}
          className="rounded-2xl p-5 text-white shadow-lg"
          style={{
            background: getGradientBg(),
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5" />
            <h3 className="font-bold">Did You Know?</h3>
          </div>
          <p className="text-white/90 text-sm">
            You've read <span className="font-bold">{totalPages.toLocaleString()} pages</span> this year{totalPages >= 1000 && booksIn2026 > 0 ? (
              <>. That's equivalent to <span className="font-bold">{Math.round(totalPages / 350)} average novels</span>! 📚✨</>
            ) : totalPages > 0 ? (
              <>. Keep reading to reach new milestones! 🎯</>
            ) : null}
          </p>
        </motion.div>
      )}

      {/* Book Detail Modal */}
      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          isOpen={showBookDetail}
          onClose={() => setShowBookDetail(false)}
          onUpdateRating={(rating) => console.log('Updated rating:', rating)}
          onMoveShelf={(shelf) => console.log('Moved to shelf:', shelf)}
          onUpdateCover={(coverUrl) => {
            if (selectedBook?.id) {
              updateBook(selectedBook.id, { cover: coverUrl });
              setSelectedBook({ ...selectedBook, cover: coverUrl });
            }
          }}
        />
      )}

      {/* Goal Settings Modal */}
      <GoalSettingsModal
        isOpen={showGoalSettings}
        onClose={() => setShowGoalSettings(false)}
        currentGoals={goals}
        onSave={(newGoals) => {
          console.log('💾 Saving goals:', newGoals);
          setGoals(newGoals);
          localStorage.setItem('readingGoals', JSON.stringify(newGoals));
        }}
      />

      {/* Add Book Modal */}
      <AddBookModal
        isOpen={showAddBook}
        onClose={() => setShowAddBook(false)}
        availableShelves={[
          ...bookshelves.map(shelf => ({ id: shelf.id, name: shelf.name })),
          ...customShelves.map(shelf => ({ id: shelf.id, name: shelf.name }))
        ]}
        onAddBook={async (bookData, selectedShelfIds = []) => {
          console.log('📗 [Dashboard] onAddBook called with:', {
            title: bookData.title,
            status: bookData.status,
            selectedShelfIds,
          });
          
          const newBook = {
            id: Date.now().toString(),
            ...bookData,
            // IMPORTANT: Use the status from bookData, don't override it
            status: bookData.status || 'reading',
            currentPage: bookData.currentPage || 0,
            progress: bookData.progress || 0,
          };
          
          console.log('✅ [Dashboard] Adding book with status:', newBook.status);
          
          await addBook(newBook);
          
          // Update bookshelves if shelf IDs were provided
          if (selectedShelfIds.length > 0) {
            console.log('📚 [Dashboard] Adding book to shelves:', selectedShelfIds);
            
            // Update default bookshelves
            const updatedShelves = bookshelves.map(shelf => {
              if (selectedShelfIds.includes(shelf.id)) {
                return {
                  ...shelf,
                  bookIds: [...shelf.bookIds, newBook.id]
                };
              }
              return shelf;
            });
            await updateBookshelves(updatedShelves);
            
            // Update custom shelves
            const updatedCustomShelves = customShelves.map(shelf => {
              if (selectedShelfIds.includes(shelf.id)) {
                return {
                  ...shelf,
                  bookIds: [...shelf.bookIds, newBook.id]
                };
              }
              return shelf;
            });
            
            if (JSON.stringify(updatedCustomShelves) !== JSON.stringify(customShelves)) {
              setCustomShelves(updatedCustomShelves);
              localStorage.setItem('readtrack_custom_shelves', JSON.stringify(updatedCustomShelves));
            }
          }
          
          setShowAddBook(false);
        }}
      />

      {/* Quick Progress Modal */}
      {selectedBookForProgress !== null && currentlyReading[selectedBookForProgress] && (
        <QuickProgressModal
          isOpen={showQuickProgress}
          onClose={() => {
            setShowQuickProgress(false);
            setSelectedBookForProgress(null);
          }}
          book={currentlyReading[selectedBookForProgress]}
          onUpdate={async (updates) => {
            const bookToUpdate = currentlyReading[selectedBookForProgress];
            const oldPage = bookToUpdate.currentPage || 0;
            const newPage = updates.currentPage || 0;
            const pagesDelta = newPage - oldPage;
            
            // Use the progress from the modal (which checks for 100%)
            const updateData: any = {
              ...updates, // Include all updates from modal (currentPage, progress, status, finishDate)
            };
            
            // Handle audiobook-specific updates
            const finalFormat = updates.format || bookToUpdate.format;
            if (finalFormat === 'audiobook') {
              // Calculate audio duration (default 2 min/page or 10 hours)
              const totalDuration = bookToUpdate.audioDuration || (bookToUpdate.pages ? bookToUpdate.pages * 2 : 600);
              updateData.audioDuration = totalDuration;
              
              // Calculate current minutes based on progress
              const currentProgress = (updates.progress || 0) / 100;
              updateData.currentMinutes = Math.round(totalDuration * currentProgress);
            }
            
            // Check if the book is being finished (100% progress)
            if (updates.status === 'finished' && updates.finishDate) {
              // Close the progress modal first
              setShowQuickProgress(false);
              setSelectedBookForProgress(null);
              
              // Trigger the finish modal with review
              onBookFinished?.({...bookToUpdate, ...updateData});
              return; // Don't update yet, wait for review submission
            }
            
            await updateBook(bookToUpdate.id, updateData);
            
            // Log daily page increment
            if (pagesDelta > 0) {
              const today = new Date().toISOString().split('T')[0];
              const dailyPageLog = JSON.parse(localStorage.getItem('dailyPageLog') || '{}');
              dailyPageLog[today] = (dailyPageLog[today] || 0) + pagesDelta;
              localStorage.setItem('dailyPageLog', JSON.stringify(dailyPageLog));
              
              console.log('📖 [Dashboard] Logged daily pages:', {
                today,
                pagesDelta,
                totalToday: dailyPageLog[today]
              });
            }
            
            // Auto-mark today as read when updating progress
            markTodayAsRead();
            
            setShowQuickProgress(false);
            setSelectedBookForProgress(null);
          }}
        />
      )}

      {/* Import Books Modal */}
      {/* REMOVED: Duplicate import modal - using the one in App.tsx instead */}
      {/* This was causing duplicate imports! */}

      {/* Database Test Panel */}
      {showDatabaseTest && (
        <DatabaseTestPanel onClose={() => setShowDatabaseTest(false)} />
      )}

      {/* Reading Calendar Modal */}
      <ReadingCalendarModal
        isOpen={showCalendarEdit}
        onClose={() => setShowCalendarEdit(false)}
        readingHistory={readingHistory}
        onSave={(history) => {
          setReadingHistory(history);
          console.log('Saved reading history:', history);
        }}
      />

      {/* Data Fix Tool - TEMPORARY */}
      {showDataFix && <DataFixTool />}
    </div>
  );
}
