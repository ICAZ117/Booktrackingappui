import { useState, useMemo, useId, useRef } from 'react';
import { Book, Clock, TrendingUp, Calendar, BookOpen, Star, Headphones, Award, Target, Flame, ChevronRight, Share2, Download, Zap, Users, Coffee, BookMarked, BarChart3, FileText, Sparkles, ChevronDown } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { WrapUpCards } from './WrapUpCards';
import { ReadingCalendar } from './ReadingCalendar';
import { useTheme } from '../contexts/ThemeContext';
import { useBooks } from '../contexts/BooksContext';
import { useBadges } from '../contexts/BadgesContext';

type TimePeriod = 'month' | 'year' | 'alltime';

export function Statistics({ onBookSelect }: { onBookSelect?: (book: any) => void }) {
  const { currentTheme } = useTheme();
  const { books, readingSessions } = useBooks();
  const { earnedBadges, allBadges } = useBadges();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('year');
  const [showWrapUp, setShowWrapUp] = useState(false);
  const [chartKey, setChartKey] = useState(0);
  
  // Add month selector state (defaults to current month)
  const now = new Date();
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1); // 1-indexed
  
  // Create truly unique IDs using useId for each chart type + random element for forced uniqueness
  const lineChartId = useId();
  const genrePieId = useId();
  const formatPieId = useId();
  const renderKey = useRef(0);
  
  // Create a data hash for keys
  const dataHash = useMemo(() => {
    return `${timePeriod}-${books.length}-${readingSessions.length}-${renderKey.current}`;
  }, [timePeriod, books.length, readingSessions.length]);


  // Force chart remount when time period changes
  const handleTimePeriodChange = (period: TimePeriod) => {
    setTimePeriod(period);
    renderKey.current += 1;
    setChartKey(prev => prev + 1);
  };

  // Calculate comprehensive statistics from real data
  const stats = useMemo(() => {
    const currentYear = selectedYear;
    const currentMonth = selectedMonth; // 1-indexed (1 = January, 2 = February, 3 = March, etc.)
    
    // Load daily page log once at the top for reuse
    const dailyPageLog = JSON.parse(localStorage.getItem('dailyPageLog') || '{}');
    
    // Get all finished books
    const finishedBooks = books.filter((b: any) => b.status === 'finished');
    
    // Get currently reading books for progress tracking
    const currentlyReading = books.filter((b: any) => b.status === 'reading');
    
    // Filter books by time period
    const booksInPeriod = finishedBooks.filter((b: any) => {
      if (!b.finishDate && !b.dateRead) return false;
      const finishDate = new Date(b.finishDate || b.dateRead);
      
      if (timePeriod === 'month') {
        return finishDate.getMonth() === currentMonth - 1 && finishDate.getFullYear() === currentYear;
      } else if (timePeriod === 'year') {
        return finishDate.getFullYear() === currentYear;
      }
      return true; // all time
    });

    // Basic counts - include progress from currently reading books
    const totalBooks = booksInPeriod.length;
    const totalPagesFromFinished = booksInPeriod.reduce((sum: number, book: any) => sum + (book.pages || 0), 0);
    const totalPagesFromReading = currentlyReading.reduce((sum: number, book: any) => sum + (book.currentPage || 0), 0);
    const totalPages = totalPagesFromFinished + totalPagesFromReading;
    
    console.log('📊 [Statistics] Pages calculation:', {
      finishedInPeriod: booksInPeriod.length,
      pagesFromFinished: totalPagesFromFinished,
      currentlyReading: currentlyReading.length,
      pagesFromReading: totalPagesFromReading,
      totalPages
    });
    
    const ratedBooks = booksInPeriod.filter((b: any) => b.rating && b.rating > 0);
    const avgRating = ratedBooks.length > 0
      ? (ratedBooks.reduce((sum: number, book: any) => sum + (book.rating || 0), 0) / ratedBooks.length).toFixed(2)
      : '0.00';
    
    const avgLength = totalBooks > 0 ? Math.round(totalPagesFromFinished / totalBooks) : 0;

    // Rating distribution
    const ratingDist = [0, 0, 0, 0, 0]; // [1-star, 2-star, 3-star, 4-star, 5-star]
    ratedBooks.forEach((book: any) => {
      const rating = Math.floor(book.rating || 0);
      if (rating >= 1 && rating <= 5) {
        ratingDist[rating - 1]++;
      }
    });

    // Genre distribution
    const genreCounts: { [key: string]: number } = {};
    booksInPeriod.forEach((book: any) => {
      if (book.genre) {
        genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
      }
    });

    // Format distribution - normalize all formats into three categories
    const formatCounts: { [key: string]: number } = {};
    booksInPeriod.forEach((book: any) => {
      const rawFormat = (book.format || 'Physical').toLowerCase();
      // Normalize to three main categories: Physical, eBook, Audio
      let normalizedFormat = 'Physical';
      if (rawFormat === 'audiobook' || rawFormat === 'audio') {
        normalizedFormat = 'Audio';
      } else if (rawFormat === 'ebook' || rawFormat === 'e-book' || rawFormat === 'digital') {
        normalizedFormat = 'eBook';
      } else if (rawFormat === 'physical' || rawFormat === 'paperback' || rawFormat === 'hardcover') {
        normalizedFormat = 'Physical';
      }
      formatCounts[normalizedFormat] = (formatCounts[normalizedFormat] || 0) + 1;
    });

    // Calculate time-based stats
    const booksWithDates = booksInPeriod.filter((b: any) => b.startDate && (b.finishDate || b.dateRead));
    const readingTimes = booksWithDates.map((b: any) => {
      const start = new Date(b.startDate);
      const finish = new Date(b.finishDate || b.dateRead);
      return Math.ceil((finish.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    }).filter(days => days > 0);
    
    const avgDaysToFinish = readingTimes.length > 0
      ? Math.round(readingTimes.reduce((sum, days) => sum + days, 0) / readingTimes.length)
      : 0;

    // Find fastest and slowest books
    const fastestBook = booksWithDates.length > 0 
      ? booksWithDates.reduce((fastest, book) => {
          const days = Math.ceil((new Date(book.finishDate || book.dateRead).getTime() - new Date(book.startDate).getTime()) / (1000 * 60 * 60 * 24));
          if (!fastest.days || days < fastest.days) {
            return { book, days };
          }
          return fastest;
        }, { book: null, days: null })
      : { book: null, days: null };

    const slowestBook = booksWithDates.length > 0
      ? booksWithDates.reduce((slowest, book) => {
          const days = Math.ceil((new Date(book.finishDate || book.dateRead).getTime() - new Date(book.startDate).getTime()) / (1000 * 60 * 60 * 24));
          if (!slowest.days || days > slowest.days) {
            return { book, days };
          }
          return slowest;
        }, { book: null, days: null })
      : { book: null, days: null };

    // Find shortest and longest books
    const booksWithPages = booksInPeriod.filter((b: any) => b.pages && b.pages > 0);
    const shortestBook = booksWithPages.length > 0
      ? booksWithPages.reduce((shortest, book) => (!shortest || book.pages < shortest.pages) ? book : shortest, null)
      : null;
    const longestBook = booksWithPages.length > 0
      ? booksWithPages.reduce((longest, book) => (!longest || book.pages > longest.pages) ? book : longest, null)
      : null;

    // Calculate reading sessions stats
    const sessionsInPeriod = readingSessions.filter((s: any) => {
      const sessionDate = new Date(s.date);
      if (timePeriod === 'month') {
        return sessionDate.getMonth() === currentMonth - 1 && sessionDate.getFullYear() === currentYear;
      } else if (timePeriod === 'year') {
        return sessionDate.getFullYear() === currentYear;
      }
      return true;
    });

    const totalSessionPages = sessionsInPeriod.reduce((sum: number, s: any) => sum + (s.pages || 0), 0);
    const totalSessionMinutes = sessionsInPeriod.reduce((sum: number, s: any) => sum + (s.minutes || 0), 0);
    const uniqueReadingDays = new Set(sessionsInPeriod.map((s: any) => s.date.split('T')[0])).size;
    
    // Calculate streak
    const sortedSessions = [...readingSessions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    let currentStreak = 0;
    let lastDate = new Date().setHours(0, 0, 0, 0);
    const oneDayMs = 24 * 60 * 60 * 1000;
    
    for (const session of sortedSessions) {
      const sessionDate = new Date(session.date).setHours(0, 0, 0, 0);
      const dayDiff = Math.round((lastDate - sessionDate) / oneDayMs);
      
      if (dayDiff === 0 || dayDiff === 1) {
        if (dayDiff === 1) currentStreak++;
        lastDate = sessionDate;
      } else {
        break;
      }
    }

    // Find longest single day
    const sessionsByDay: { [key: string]: number } = {};
    sessionsInPeriod.forEach((s: any) => {
      const day = s.date.split('T')[0];
      sessionsByDay[day] = (sessionsByDay[day] || 0) + (s.pages || 0);
    });
    
    // ALSO check dailyPageLog for comprehensive tracking
    Object.entries(dailyPageLog).forEach(([date, pages]) => {
      // Only include dates within the current period
      const logDate = new Date(date);
      let inPeriod = false;
      
      if (timePeriod === 'month') {
        inPeriod = logDate.getMonth() === currentMonth - 1 && logDate.getFullYear() === currentYear;
      } else if (timePeriod === 'year') {
        inPeriod = logDate.getFullYear() === currentYear;
      } else {
        inPeriod = true; // all time
      }
      
      if (inPeriod) {
        sessionsByDay[date] = Math.max(sessionsByDay[date] || 0, pages as number);
      }
    });
    
    const longestDay = Object.values(sessionsByDay).reduce((max, pages) => Math.max(max, pages), 0);

    // Calculate audiobook hours (use currentMinutes for actual listened time)
    const audioBooks = books.filter((b: any) => b.format === 'audiobook' || b.format === 'Audiobook');
    const totalAudioMinutes = audioBooks.reduce((sum: number, book: any) => sum + (book.currentMinutes || 0), 0);
    const totalAudioHours = Math.round(totalAudioMinutes / 60);

    // Count unique authors
    const uniqueAuthors = new Set(finishedBooks.map((b: any) => b.author)).size;

    // Average pages per day
    const avgPagesPerDay = uniqueReadingDays > 0 ? Math.round(totalSessionPages / uniqueReadingDays) : 0;

    // NEW: Fiction vs Non-Fiction tracking
    const fictionCount = booksInPeriod.filter((b: any) => {
      const genre = (b.genre || '').toLowerCase();
      return !genre.includes('non-fiction') && !genre.includes('nonfiction') && !genre.includes('biography') && !genre.includes('memoir');
    }).length;
    const nonFictionCount = totalBooks - fictionCount;

    // NEW: Top Authors calculation
    const authorCounts: { [key: string]: number } = {};
    booksInPeriod.forEach((book: any) => {
      if (book.author) {
        authorCounts[book.author] = (authorCounts[book.author] || 0) + 1;
      }
    });
    const topAuthors = Object.entries(authorCounts)
      .map(([author, count]) => ({ author, count: count as number }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // NEW: Reading speed calculation (pages per day based on finish dates)
    const pagesPerDayByBook = booksWithDates.map((b: any) => {
      const start = new Date(b.startDate);
      const finish = new Date(b.finishDate || b.dateRead);
      const days = Math.ceil((finish.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return days > 0 ? (b.pages || 0) / days : 0;
    }).filter(ppd => ppd > 0);
    
    const avgReadingSpeed = pagesPerDayByBook.length > 0
      ? Math.round(pagesPerDayByBook.reduce((sum, ppd) => sum + ppd, 0) / pagesPerDayByBook.length)
      : 0;

    // NEW: Books by page count ranges
    const pageRanges = {
      '0-200': 0,
      '201-400': 0,
      '401-600': 0,
      '601+': 0,
    };
    booksWithPages.forEach((b: any) => {
      if (b.pages <= 200) pageRanges['0-200']++;
      else if (b.pages <= 400) pageRanges['201-400']++;
      else if (b.pages <= 600) pageRanges['401-600']++;
      else pageRanges['601+']++;
    });

    // NEW: Total reading time in hours
    const totalReadingHours = Math.round(totalSessionMinutes / 60);

    // NEW: Best reading month (most books finished)
    const booksByMonth: { [key: string]: number } = {};
    finishedBooks.forEach((b: any) => {
      if (b.finishDate || b.dateRead) {
        const date = new Date(b.finishDate || b.dateRead);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        booksByMonth[monthKey] = (booksByMonth[monthKey] || 0) + 1;
      }
    });
    const bestMonth = Object.entries(booksByMonth)
      .sort(([, a], [, b]) => (b as number) - (a as number))[0];

    // Generate chart data by period
    let chartData: any[] = [];
    let dataPointCounter = 0; // Sequential counter for truly unique IDs
    
    console.log('📊 Chart Data Debug:', {
      timePeriod,
      finishedBooksCount: finishedBooks.length,
      sessionsInPeriodCount: sessionsInPeriod.length,
      sampleFinishedBooks: finishedBooks.slice(0, 3).map((b: any) => ({
        title: b.title,
        finishDate: b.finishDate,
        dateRead: b.dateRead,
        pages: b.pages
      }))
    });
    
    if (timePeriod === 'month') {
      // Daily data for current month - use readingSessions data
      const daysInMonth = new Date(currentYear, currentMonth, 0).getDate(); // Get actual days in current month
      
      // Aggregate pages from readingSessions by date
      const pagesByDate: { [key: string]: number } = {};
      
      // Process readingSessions for current month
      sessionsInPeriod.forEach((session: any) => {
        const sessionDate = new Date(session.date);
        const dateKey = `${sessionDate.getFullYear()}-${String(sessionDate.getMonth() + 1).padStart(2, '0')}-${String(sessionDate.getDate()).padStart(2, '0')}`;
        pagesByDate[dateKey] = (pagesByDate[dateKey] || 0) + (session.pages || 0);
      });
      
      console.log('📊 Pages by date from readingSessions:', pagesByDate);
      console.log(`📊 Current month (${currentYear}-${String(currentMonth).padStart(2, '0')}) data:`, pagesByDate);
      
      chartData = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const uniqueDataId = `${lineChartId}-dp-${dataPointCounter++}-${i}`;
        
        // Create date key for this day in the current month
        const dateKey = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        let pages = pagesByDate[dateKey] || 0;
        
        // FALLBACK: If no session data, use finished books' pages on their finish date
        if (pages === 0) {
          const finishedOnDay = finishedBooks.filter((book: any) => {
            if (!book.finishDate && !book.dateRead) return false;
            const finishDate = new Date(book.finishDate || book.dateRead);
            const bookDateStr = `${finishDate.getFullYear()}-${String(finishDate.getMonth() + 1).padStart(2, '0')}-${String(finishDate.getDate()).padStart(2, '0')}`;
            return bookDateStr === dateKey;
          });
          pages = finishedOnDay.reduce((sum: number, book: any) => sum + (book.pages || 0), 0);
        }
        
        if (pages > 0) {
          console.log(`📊 Day ${day}:`, pages, 'pages');
        }
        
        return { 
          day: day.toString(),
          pages,
          _recharts_id: uniqueDataId,
          _uid: uniqueDataId,
          index: i
        };
      });
      
      console.log('📊 Month chart data:', chartData.filter(d => d.pages > 0));
    } else if (timePeriod === 'year') {
      // Monthly data for 2026
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      chartData = months.map((month, i) => {
        const monthBooks = finishedBooks.filter((b: any) => {
          const finishDate = new Date(b.finishDate || b.dateRead);
          return finishDate.getFullYear() === currentYear && finishDate.getMonth() === i;
        });
        const monthPages = monthBooks.reduce((sum: number, book: any) => sum + (book.pages || 0), 0);
        // Use sequential counter for guaranteed uniqueness
        const uniqueDataId = `${lineChartId}-dp-${dataPointCounter++}-${i}`;
        
        if (monthBooks.length > 0) {
          console.log(`📊 ${month} 2026:`, monthBooks.length, 'books,', monthPages, 'pages');
        }
        
        return { 
          month,
          books: monthBooks.length, 
          pages: monthPages,
          _recharts_id: uniqueDataId, // Explicit ID for Recharts
          _uid: uniqueDataId,
          index: i
        };
      });
      
      console.log('📊 Year chart data:', chartData.filter(d => d.books > 0));
    } else {
      // Yearly data (all time)
      const yearSet = new Set<number>();
      finishedBooks.forEach((b: any) => {
        if (b.finishDate || b.dateRead) {
          const date = new Date(b.finishDate || b.dateRead);
          const year = date.getFullYear();
          if (!isNaN(year) && year > 1900 && year < 2100) {
            yearSet.add(year);
          }
        }
      });
      
      const sortedYears = Array.from(yearSet).sort((a, b) => a - b);
      
      chartData = sortedYears.map((year, index) => {
        const yearBooks = finishedBooks.filter((b: any) => {
          const finishDate = new Date(b.finishDate || b.dateRead);
          return finishDate.getFullYear() === year;
        });
        const yearPages = yearBooks.reduce((sum: number, book: any) => sum + (book.pages || 0), 0);
        // Use sequential counter for guaranteed uniqueness
        const uniqueDataId = `${lineChartId}-dp-${dataPointCounter++}-${index}`;
        return { 
          year: year.toString(),
          books: yearBooks.length, 
          pages: yearPages,
          _recharts_id: uniqueDataId, // Explicit ID for Recharts
          _uid: uniqueDataId,
          index
        };
      });

      // Ensure we have at least some data
      if (chartData.length === 0) {
        const uniqueDataId = `${lineChartId}-dp-${dataPointCounter++}-0`;
        chartData = [{ 
          year: '2026', 
          books: 0, 
          pages: 0, 
          _recharts_id: uniqueDataId,
          _uid: uniqueDataId,
          index: 0 
        }];
      }
    }

    // Calculate books for selected month
    const booksThisMonth = finishedBooks.filter((b: any) => {
      if (!b.finishDate && !b.dateRead) return false;
      const dateStr = b.finishDate || b.dateRead;
      const bookDate = new Date(dateStr);
      return bookDate.getMonth() === currentMonth - 1 && bookDate.getFullYear() === currentYear;
    }).length;
    
    // Calculate pages read in selected month (finished books + current progress from reading books)
    const pagesThisMonthFromFinished = finishedBooks
      .filter((b: any) => {
        if (!b.finishDate && !b.dateRead) return false;
        const dateStr = b.finishDate || b.dateRead;
        const bookDate = new Date(dateStr);
        return bookDate.getMonth() === currentMonth - 1 && bookDate.getFullYear() === currentYear;
      })
      .reduce((sum: number, book: any) => sum + (book.pages || 0), 0);
    const pagesThisMonth = pagesThisMonthFromFinished + totalPagesFromReading;
    
    // Calculate pages read today from daily page log
    const today = new Date().toISOString().split('T')[0];
    const pagesToday = dailyPageLog[today] || 0;
    
    console.log('📊 [Statistics] Monthly/Daily calculation:', {
      booksThisMonth,
      pagesThisMonthFromFinished,
      pagesFromReading: totalPagesFromReading,
      pagesThisMonth,
      today,
      pagesToday,
      dailyPageLog
    });

    // Load goals from localStorage (same as Dashboard)
    const savedGoals = localStorage.getItem('readingGoals');
    const goals = savedGoals ? JSON.parse(savedGoals) : {
      daily: { 
        pages: { value: 25, enabled: true },
        minutes: { value: 60, enabled: false }
      },
      monthly: { 
        books: { value: 5, enabled: true },
        pages: { value: 1200, enabled: true }
      },
      yearly: { 
        books: { value: 52, enabled: true },
        pages: { value: 20000, enabled: true }
      }
    };

    const monthlyGoal = goals.monthly.books.value || 5;
    const yearlyGoal = goals.yearly.books.value || 52;
    const dailyPageGoal = goals.daily.pages.value || 25;
    const monthlyPageGoal = goals.monthly.pages.value || 1200;
    const yearlyPageGoal = goals.yearly.pages.value || 20000;

    // NEW: Mood distribution (based on genres/tags - mock for now)
    const moodCounts = {
      tense: 0,
      dark: 0,
      mysterious: 0,
      emotional: 0,
      adventurous: 0,
      lighthearted: 0,
      reflective: 0,
      inspiring: 0,
      funny: 0,
      sad: 0,
      hopeful: 0,
      challenging: 0,
    };
    
    booksInPeriod.forEach((b: any) => {
      const genre = (b.genre || '').toLowerCase();
      const title = (b.title || '').toLowerCase();
      const categories = (b.categories || []).map((c: string) => c.toLowerCase());
      
      // Debug: Log genre data to see what we're working with
      if (genre || categories.length > 0) {
        console.log(`📚 "${b.title}": genre="${genre}", categories=[${categories.join(', ')}]`);
      }
      
      // Combine genre and categories for better matching
      const allGenreInfo = [genre, ...categories].join(' ');
      
      let matched = false;
      
      // More nuanced genre/mood mapping (can match multiple moods)
      if (allGenreInfo.includes('thriller') || allGenreInfo.includes('suspense') || title.includes('thriller')) {
        moodCounts.tense++;
        matched = true;
      }
      if (allGenreInfo.includes('horror') || allGenreInfo.includes('dark')) {
        moodCounts.dark++;
        matched = true;
      }
      if (allGenreInfo.includes('mystery') || allGenreInfo.includes('detective') || allGenreInfo.includes('crime')) {
        moodCounts.mysterious++;
        matched = true;
      }
      if (allGenreInfo.includes('romance') || allGenreInfo.includes('love')) {
        moodCounts.emotional++;
        matched = true;
      }
      if (allGenreInfo.includes('comedy') || allGenreInfo.includes('humor') || allGenreInfo.includes('funny')) {
        moodCounts.funny++;
        matched = true;
      }
      if (allGenreInfo.includes('adventure') || allGenreInfo.includes('action')) {
        moodCounts.adventurous++;
        matched = true;
      }
      if (allGenreInfo.includes('fantasy') || allGenreInfo.includes('magic') || allGenreInfo.includes('paranormal')) {
        moodCounts.hopeful++;
        matched = true;
      }
      if (allGenreInfo.includes('tragedy') || allGenreInfo.includes('sad') || allGenreInfo.includes('grief')) {
        moodCounts.sad++;
        matched = true;
      }
      if (allGenreInfo.includes('inspirational') || allGenreInfo.includes('motivational') || allGenreInfo.includes('self-help')) {
        moodCounts.inspiring++;
        matched = true;
      }
      if (allGenreInfo.includes('literary') || allGenreInfo.includes('philosophical') || allGenreInfo.includes('memoir')) {
        moodCounts.reflective++;
        matched = true;
      }
      if (allGenreInfo.includes('contemporary') || allGenreInfo.includes('slice of life')) {
        moodCounts.lighthearted++;
        matched = true;
      }
      if (allGenreInfo.includes('science') || allGenreInfo.includes('educational') || allGenreInfo.includes('history')) {
        moodCounts.challenging++;
        matched = true;
      }
      
      // Only log if nothing matched
      if (!matched && allGenreInfo.trim()) {
        console.log(`⚠️ No mood match for "${b.title}": ${allGenreInfo}`);
      }
    });

    const moodData = [
      { name: 'Tense', value: moodCounts.tense, fill: '#a855f7' },
      { name: 'Dark', value: moodCounts.dark, fill: '#1f2937' },
      { name: 'Mysterious', value: moodCounts.mysterious, fill: '#92400e' },
      { name: 'Emotional', value: moodCounts.emotional, fill: '#f97316' },
      { name: 'Adventurous', value: moodCounts.adventurous, fill: '#10b981' },
      { name: 'Lighthearted', value: moodCounts.lighthearted, fill: '#fbbf24' },
      { name: 'Reflective', value: moodCounts.reflective, fill: '#06b6d4' },
      { name: 'Inspiring', value: moodCounts.inspiring, fill: '#3b82f6' },
      { name: 'Funny', value: moodCounts.funny, fill: '#f59e0b' },
      { name: 'Sad', value: moodCounts.sad, fill: '#6366f1' },
      { name: 'Hopeful', value: moodCounts.hopeful, fill: '#ec4899' },
      { name: 'Challenging', value: moodCounts.challenging, fill: '#8b5cf6' },
    ].filter(m => m.value > 0);

    // NEW: Pace distribution (based on reading speed)
    const paceCounts = {
      fast: 0,
      medium: 0,
      slow: 0,
    };
    
    booksWithDates.forEach((b: any) => {
      const start = new Date(b.startDate);
      const finish = new Date(b.finishDate || b.dateRead);
      const days = Math.ceil((finish.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const pagesPerDay = days > 0 ? (b.pages || 0) / days : 0;
      
      if (pagesPerDay > 50) {
        paceCounts.fast++;
      } else if (pagesPerDay > 20) {
        paceCounts.medium++;
      } else {
        paceCounts.slow++;
      }
    });

    const paceData = [
      { name: 'fast', value: paceCounts.fast, fill: '#f59e0b' },
      { name: 'medium', value: paceCounts.medium, fill: '#ef4444' },
      { name: 'slow', value: paceCounts.slow, fill: '#8b5cf6' },
    ].filter(p => p.value > 0);

    return {
      totalBooks,
      booksThisMonth,
      pagesThisMonth,
      pagesToday,
      monthlyGoal,
      yearlyGoal,
      dailyPageGoal,
      monthlyPageGoal,
      yearlyPageGoal,
      totalPages,
      avgRating,
      avgLength,
      avgDaysToFinish,
      ratingDist,
      genreCounts,
      formatCounts,
      fiveStarCount: ratingDist[4],
      chartData,
      currentStreak,
      longestDay,
      totalAudioHours,
      avgPagesPerDay,
      uniqueAuthors,
      uniqueReadingDays,
      totalSessionMinutes,
      fastestBook,
      slowestBook,
      shortestBook,
      longestBook,
      fictionCount,
      nonFictionCount,
      topAuthors,
      avgReadingSpeed,
      pageRanges,
      totalReadingHours,
      bestMonth,
      moodData,
      paceData,
      currentYear,
      currentMonth,
    };
  }, [books, readingSessions, timePeriod, selectedYear, selectedMonth]);

  // Generate rating data
  const ratingData = [
    { rating: '5⭐', count: stats.ratingDist[4] },
    { rating: '4⭐', count: stats.ratingDist[3] },
    { rating: '3⭐', count: stats.ratingDist[2] },
    { rating: '2⭐', count: stats.ratingDist[1] },
    { rating: '1⭐', count: stats.ratingDist[0] },
  ];

  // Generate genre data
  const genreData = Object.entries(stats.genreCounts)
    .filter(([genre]) => genre && genre.trim())
    .map(([genre, count]) => ({
      genre,
      count: count as number,
      color: getGenreColor(genre),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Generate pie chart data for genres
  const genrePieData = Object.entries(stats.genreCounts)
    .filter(([genre]) => genre && genre.trim())
    .map(([name, value], index) => ({
      name,
      value: value as number,
      color: getGenreColor(name),
      _recharts_id: `genre-${genrePieId}-${index}-${name}`, // Unique ID for Recharts
      _uid: `genre-${genrePieId}-${index}-${name}`,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  // Generate format data (already normalized in stats calculation)
  const formatData = Object.entries(stats.formatCounts)
    .filter(([name]) => name && name.trim())
    .map(([name, value], index) => ({
      name, // Already normalized to 'Physical', 'eBook', or 'Audio'
      value: value as number,
      color: getFormatColor(name),
      _recharts_id: `format-${formatPieId}-${index}-${name}`, // Unique ID for Recharts
      _uid: `format-${formatPieId}-${index}-${name}`,
    }));

  function getGenreColor(genre: string): string {
    const colors: { [key: string]: string } = {
      'Fantasy': '#8b5cf6',
      'Romance': '#ec4899',
      'Mystery': '#10b981',
      'Thriller': '#f59e0b',
      'Sci-Fi': '#3b82f6',
      'Contemporary': '#06b6d4',
      'Historical': '#f97316',
      'Fiction': '#6366f1',
      'Non-Fiction': '#14b8a6',
    };
    return colors[genre] || '#6b7280';
  }

  function getFormatColor(format: string): string {
    const colors: { [key: string]: string } = {
      'Physical': '#3298ff',
      'eBook': '#f83aef',
      'Audio': '#10b981',
    };
    return colors[format] || '#6b7280';
  }

  const getGradientBg = () => {
    return currentTheme.isGradient
      ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
      : currentTheme.primary;
  };

  // Get chart config based on time period
  const getChartConfig = () => {
    if (timePeriod === 'month') {
      return { xKey: 'day', yKey: 'pages', label: 'Pages per Day' };
    } else if (timePeriod === 'year') {
      return { xKey: 'month', yKey: 'books', label: 'Books & Pages by Month', secondaryKey: 'pages' };
    } else {
      return { xKey: 'year', yKey: 'books', label: 'Books by Year', secondaryKey: 'pages' };
    }
  };

  const chartConfig = getChartConfig();

  if (showWrapUp && timePeriod === 'month') {
    return <WrapUpCards onBack={() => setShowWrapUp(false)} selectedMonth={selectedMonth} selectedYear={selectedYear} />;
  }

  // Count earned badges
  const earnedBadgeCount = earnedBadges.length;
  const totalBadgeCount = allBadges.length;

  return (
    <div className="space-y-6 pb-20">
      {/* Time Period Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => handleTimePeriodChange('month')}
          className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
          style={{
            background: timePeriod === 'month' ? getGradientBg() : currentTheme.cardColor,
            borderColor: timePeriod === 'month' ? 'transparent' : currentTheme.borderColor,
            borderWidth: timePeriod === 'month' ? '0' : '1px',
            color: timePeriod === 'month' ? '#ffffff' : (currentTheme.textColor === 'light' ? '#d1d5db' : '#374151'),
            boxShadow: timePeriod === 'month' ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
          }}
        >
          {new Date(selectedYear, selectedMonth - 1).toLocaleDateString('en-US', { month: 'short' })}
        </button>
        <button
          onClick={() => handleTimePeriodChange('year')}
          className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
          style={{
            background: timePeriod === 'year' ? getGradientBg() : currentTheme.cardColor,
            borderColor: timePeriod === 'year' ? 'transparent' : currentTheme.borderColor,
            borderWidth: timePeriod === 'year' ? '0' : '1px',
            color: timePeriod === 'year' ? '#ffffff' : (currentTheme.textColor === 'light' ? '#d1d5db' : '#374151'),
            boxShadow: timePeriod === 'year' ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
          }}
        >
          {selectedYear}
        </button>
        <button
          onClick={() => handleTimePeriodChange('alltime')}
          className="flex-1 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all"
          style={{
            background: timePeriod === 'alltime' ? getGradientBg() : currentTheme.cardColor,
            borderColor: timePeriod === 'alltime' ? 'transparent' : currentTheme.borderColor,
            borderWidth: timePeriod === 'alltime' ? '0' : '1px',
            color: timePeriod === 'alltime' ? '#ffffff' : (currentTheme.textColor === 'light' ? '#d1d5db' : '#374151'),
            boxShadow: timePeriod === 'alltime' ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
          }}
        >
          All Time
        </button>
      </div>

      {/* Month Selector - Only show for month view */}
      {timePeriod === 'month' && (
        <div 
          className="rounded-xl p-4 border"
          style={{
            backgroundColor: currentTheme.cardColor,
            borderColor: currentTheme.borderColor,
          }}
        >
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5" style={{ color: currentTheme.accentColor }} />
            <div className="flex-1">
              <label 
                className="text-xs font-semibold mb-1 block"
                style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
              >
                Select Month
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(parseInt(e.target.value));
                    setChartKey(prev => prev + 1);
                  }}
                  className="flex-1 px-3 py-2 rounded-lg font-medium text-sm"
                  style={{
                    backgroundColor: currentTheme.textColor === 'light' ? '#374151' : '#f3f4f6',
                    color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827',
                    borderColor: currentTheme.borderColor,
                    borderWidth: '1px',
                  }}
                >
                  <option value={1}>January</option>
                  <option value={2}>February</option>
                  <option value={3}>March</option>
                  <option value={4}>April</option>
                  <option value={5}>May</option>
                  <option value={6}>June</option>
                  <option value={7}>July</option>
                  <option value={8}>August</option>
                  <option value={9}>September</option>
                  <option value={10}>October</option>
                  <option value={11}>November</option>
                  <option value={12}>December</option>
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(parseInt(e.target.value));
                    setChartKey(prev => prev + 1);
                  }}
                  className="px-3 py-2 rounded-lg font-medium text-sm"
                  style={{
                    backgroundColor: currentTheme.textColor === 'light' ? '#374151' : '#f3f4f6',
                    color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827',
                    borderColor: currentTheme.borderColor,
                    borderWidth: '1px',
                  }}
                >
                  <option value={2024}>2024</option>
                  <option value={2025}>2025</option>
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Year Selector - Only show for year view */}
      {timePeriod === 'year' && (
        <div 
          className="rounded-xl p-4 border"
          style={{
            backgroundColor: currentTheme.cardColor,
            borderColor: currentTheme.borderColor,
          }}
        >
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5" style={{ color: currentTheme.accentColor }} />
            <div className="flex-1">
              <label 
                className="text-xs font-semibold mb-1 block"
                style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
              >
                Select Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(parseInt(e.target.value));
                  setChartKey(prev => prev + 1);
                }}
                className="w-full px-3 py-2 rounded-lg font-medium text-sm"
                style={{
                  backgroundColor: currentTheme.textColor === 'light' ? '#374151' : '#f3f4f6',
                  color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827',
                  borderColor: currentTheme.borderColor,
                  borderWidth: '1px',
                }}
              >
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Monthly Wrap-Up Button - Only show for month view */}
      {timePeriod === 'month' && (
        <button
          onClick={() => setShowWrapUp(true)}
          className="w-full bg-gradient-to-br from-cyan-400 via-blue-400 to-purple-400 rounded-2xl p-5 hover:shadow-xl transition-all group relative overflow-hidden text-white"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-300/20 via-blue-300/20 to-purple-300/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-base mb-0.5">{new Date(stats.currentYear, stats.currentMonth - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Wrap-Up</h3>
                <p className="text-xs opacity-90 font-medium">View shareable monthly summary</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 opacity-80 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      )}

      {/* NEW: Top Stats Row with Rounded Squares - Better Contrast */}
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div 
            className="w-20 h-20 rounded-2xl mx-auto mb-2 flex flex-col items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)' }}
          >
            <BookOpen className="w-6 h-6 text-white mb-1" />
            <div className="text-xl font-bold text-white">
              {timePeriod === 'month' ? stats.booksThisMonth : stats.totalBooks}
            </div>
          </div>
          <div className="text-xs text-gray-600 mt-0.5">Books Read</div>
        </div>
        <div className="text-center">
          <div 
            className="w-20 h-20 rounded-2xl mx-auto mb-2 flex flex-col items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #ffa500 0%, #ff8c42 100%)' }}
          >
            <Star className="w-6 h-6 text-white fill-white mb-1" />
            <div className="text-xl font-bold text-white">{stats.avgRating}</div>
          </div>
          <div className="text-xs text-gray-600 mt-0.5">Average Rating</div>
        </div>
        <div className="text-center">
          <div 
            className="w-20 h-20 rounded-2xl mx-auto mb-2 flex flex-col items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)' }}
          >
            <Target className="w-6 h-6 text-white mb-1" />
            <div className="text-xl font-bold text-white">
              {timePeriod === 'month' 
                ? Math.max(0, stats.monthlyGoal - stats.booksThisMonth)
                : timePeriod === 'year'
                ? Math.max(0, stats.yearlyGoal - stats.totalBooks)
                : stats.totalBooks}
            </div>
          </div>
          <div className="text-xs text-gray-600 mt-0.5">
            {timePeriod === 'alltime' ? 'All Time' : 'Books Left'}
          </div>
        </div>
      </div>

      {/* Reading Goal Card - Only show for month and year */}
      {(timePeriod === 'month' || timePeriod === 'year') && (
        <div 
          className="rounded-2xl p-5 border shadow-sm bg-white"
          style={{
            borderColor: '#e5e7eb',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" style={{ color: currentTheme.accentColor }} />
              <h3 
                className="text-xl font-bold text-gray-900"
              >
                Reading Goals
              </h3>
            </div>
            <button 
              className="p-2 rounded-lg transition-colors"
              style={{
                backgroundColor: `${currentTheme.accentColor}20`,
                color: currentTheme.accentColor,
              }}
              onClick={() => alert('Goal editing coming soon!')}
            >
              <Target className="w-4 h-4" />
            </button>
          </div>

          {/* TODAY */}
          <div className="mb-4">
            <div 
              className="text-xs font-bold mb-2 text-gray-500"
            >
              TODAY
            </div>
            <div className="space-y-3">
              {/* Daily Pages Goal */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span 
                    className="text-sm text-gray-900"
                  >
                    Pages
                  </span>
                  <span 
                    className="text-sm font-bold text-gray-900"
                  >
                    {stats.pagesToday} / {stats.dailyPageGoal}
                  </span>
                </div>
                <div 
                  className="h-2 rounded-full overflow-hidden bg-gray-200"
                >
                  <div 
                    className="h-full transition-all"
                    style={{
                      width: `${Math.min((stats.pagesToday / stats.dailyPageGoal) * 100, 100)}%`,
                      background: currentTheme.isGradient
                        ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
                        : currentTheme.primary,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* THIS MONTH */}
          <div className="mb-4">
            <div 
              className="text-xs font-bold mb-2 text-gray-500"
            >
              THIS MONTH
            </div>
            <div className="space-y-3">
              {/* Monthly Books Goal */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span 
                    className="text-sm text-gray-900"
                  >
                    Books
                  </span>
                  <span 
                    className="text-sm font-bold text-gray-900"
                  >
                    {stats.booksThisMonth} / {stats.monthlyGoal}
                  </span>
                </div>
                <div 
                  className="h-2 rounded-full overflow-hidden bg-gray-200"
                >
                  <div 
                    className="h-full transition-all"
                    style={{
                      width: `${Math.min((stats.booksThisMonth / stats.monthlyGoal) * 100, 100)}%`,
                      background: currentTheme.isGradient
                        ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
                        : currentTheme.primary,
                    }}
                  />
                </div>
              </div>

              {/* Monthly Pages Goal */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span 
                    className="text-sm text-gray-900"
                  >
                    Pages
                  </span>
                  <span 
                    className="text-sm font-bold text-gray-900"
                  >
                    {stats.pagesThisMonth} / {stats.monthlyPageGoal}
                  </span>
                </div>
                <div 
                  className="h-2 rounded-full overflow-hidden bg-gray-200"
                >
                  <div 
                    className="h-full transition-all"
                    style={{
                      width: `${Math.min((stats.pagesThisMonth / stats.monthlyPageGoal) * 100, 100)}%`,
                      background: currentTheme.isGradient
                        ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
                        : currentTheme.primary,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* THIS YEAR (2026) */}
          <div>
            <div 
              className="text-xs font-bold mb-2 text-gray-500"
            >
              THIS YEAR (2026)
            </div>
            <div className="space-y-3">
              {/* Yearly Books Goal */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span 
                    className="text-sm text-gray-900"
                  >
                    Books
                  </span>
                  <span 
                    className="text-sm font-bold text-gray-900"
                  >
                    {stats.totalBooks} / {stats.yearlyGoal}
                  </span>
                </div>
                <div 
                  className="h-2 rounded-full overflow-hidden bg-gray-200"
                >
                  <div 
                    className="h-full transition-all"
                    style={{
                      width: `${Math.min((stats.totalBooks / stats.yearlyGoal) * 100, 100)}%`,
                      background: currentTheme.isGradient
                        ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
                        : currentTheme.primary,
                    }}
                  />
                </div>
              </div>

              {/* Yearly Pages Goal */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span 
                    className="text-sm text-gray-900"
                  >
                    Pages
                  </span>
                  <span 
                    className="text-sm font-bold text-gray-900"
                  >
                    {stats.totalPages} / {stats.yearlyPageGoal}
                  </span>
                </div>
                <div 
                  className="h-2 rounded-full overflow-hidden bg-gray-200"
                >
                  <div 
                    className="h-full transition-all"
                    style={{
                      width: `${Math.min((stats.totalPages / stats.yearlyPageGoal) * 100, 100)}%`,
                      background: currentTheme.isGradient
                        ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
                        : currentTheme.primary,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW: Finished Books Visual Timeline */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="mb-3">
          <h3 
            className="text-xl font-bold mb-1"
            style={{ 
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {timePeriod === 'month' ? stats.booksThisMonth : stats.totalBooks}
          </h3>
          <p className="text-xs text-gray-600">
            {timePeriod === 'month' ? 'books this month 📖' : timePeriod === 'year' ? 'books this year 📖' : 'books all time 📖'}
          </p>
        </div>

        {/* Scrollable book covers timeline */}
        <div className="relative mb-4">
          <div className="overflow-x-auto pb-8" style={{ scrollbarWidth: 'thin' }}>
            <div className="flex gap-3 pb-1" style={{ minWidth: 'min-content' }}>
              {books
                .filter(b => {
                  if (b.status !== 'finished' || !b.cover) return false;
                  if (!b.finishDate && !b.dateRead) return false;
                  const finishDate = new Date(b.finishDate || b.dateRead);
                  
                  // Filter based on time period
                  if (timePeriod === 'month') {
                    return finishDate.getMonth() === selectedMonth - 1 && finishDate.getFullYear() === selectedYear;
                  } else if (timePeriod === 'year') {
                    return finishDate.getFullYear() === selectedYear;
                  } else {
                    return true; // all time
                  }
                })
                .map((book, i) => (
                  <button 
                    key={book.id}
                    onClick={() => onBookSelect?.(book)}
                    className="flex-shrink-0 relative group cursor-pointer"
                  >
                    <div className="w-16 h-24 rounded-lg overflow-hidden shadow-md border-2 border-white hover:border-pink-400 transition-all hover:scale-105">
                      <img 
                        src={book.cover} 
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Rating under the book */}
                    <div className="mt-1.5 flex items-center justify-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, starIdx) => {
                        const rating = book.rating || 0;
                        const isFilled = starIdx < Math.floor(rating);
                        const isHalf = starIdx === Math.floor(rating) && rating % 1 >= 0.5;
                        
                        return (
                          <Star 
                            key={starIdx} 
                            className="w-2.5 h-2.5 text-yellow-400" 
                            style={{
                              fill: isFilled ? '#facc15' : isHalf ? '#facc15' : 'none',
                              opacity: isHalf ? 0.5 : 1
                            }}
                          />
                        );
                      })}
                    </div>
                  </button>
                ))}
              {books.filter(b => {
                if (b.status !== 'finished' || !b.cover) return false;
                if (!b.finishDate && !b.dateRead) return false;
                const finishDate = new Date(b.finishDate || b.dateRead);
                
                if (timePeriod === 'month') {
                  return finishDate.getMonth() === selectedMonth - 1 && finishDate.getFullYear() === selectedYear;
                } else if (timePeriod === 'year') {
                  return finishDate.getFullYear() === selectedYear;
                } else {
                  return true;
                }
              }).length === 0 && (
                <div className="text-sm text-gray-400 py-4">
                  {timePeriod === 'month' ? 'No finished books this month yet' : timePeriod === 'year' ? 'No finished books this year yet' : 'No finished books yet'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reader insight */}
        <div className="mt-5 pt-4 border-t border-gray-100">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-pink-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-pink-500 mb-1">📖 Reader insight</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                {stats.totalBooks > 0 
                  ? `Keep it going! At your current pace, you're on track to meet your 2026 reading goal ${stats.bestMonth ? `in ${new Date(stats.bestMonth[0] + '-01').toLocaleDateString('en-US', { month: 'long' })}` : 'soon'}.`
                  : 'Start your reading journey today and build your 2026 collection!'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reading Calendar with Book Covers */}
      <ReadingCalendar onBookSelect={onBookSelect} />

      {/* Pages Tracker */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <h3 className="text-xs font-bold text-gray-900 mb-3">📄 Pages I've Read</h3>
        <div className="mb-3">
          <p className="text-[10px] text-gray-600 mb-2 leading-relaxed">
            {stats.totalPages >= 68612 
              ? `You've read the equivalent of climbing the Burj Khalifa ${Math.floor(stats.totalPages / 68612)} time${Math.floor(stats.totalPages / 68612) > 1 ? 's' : ''}! 🏗️`
              : stats.totalPages >= 10000
              ? '🏗️ If you were climbing the Burj Khalifa...'
              : '🏗️ Start your reading journey!'}
          </p>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {stats.totalPages.toLocaleString()}
          </div>
          <div className="text-[10px] text-gray-500 font-medium">pages this year</div>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all"
            style={{ 
              width: `${Math.min((stats.totalPages / 15000) * 100, 100)}%`,
              background: 'linear-gradient(90deg, #ff6b6b 0%, #ffa500 100%)',
            }}
          />
        </div>
      </div>

      {/* NEW: Colorful Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Longest Reading Day */}
        <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl p-4 text-white shadow-lg">
          <div className="text-xs font-semibold mb-1 opacity-90">Longest day</div>
          <div className="text-3xl font-bold mb-0.5">{stats.longestDay}</div>
          <div className="text-xs opacity-80">pages in one day</div>
        </div>

        {/* Reading Streak */}
        <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl p-4 text-white shadow-lg">
          <div className="text-xs font-semibold mb-1 opacity-90">Reading streak</div>
          <div className="text-3xl font-bold mb-0.5">{stats.currentStreak}</div>
          <div className="text-xs opacity-80">days in a row 🔥</div>
        </div>

        {/* Unique Authors */}
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-4 text-white shadow-lg">
          <div className="text-xs font-semibold mb-1 opacity-90">Authors read</div>
          <div className="text-3xl font-bold mb-0.5">{stats.uniqueAuthors}</div>
          <div className="text-xs opacity-80">different authors</div>
        </div>

        {/* Average Rating */}
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-4 text-white shadow-lg">
          <div className="text-xs font-semibold mb-1 opacity-90">Average rating</div>
          <div className="text-3xl font-bold mb-0.5">{stats.avgRating} ⭐</div>
          <div className="text-xs opacity-80">out of 5 stars</div>
        </div>
      </div>

      {/* Star Rating Distribution */}
      <div 
        className="rounded-xl p-5 shadow-sm"
        style={{
          backgroundColor: currentTheme.cardColor,
          borderColor: currentTheme.borderColor,
          borderWidth: '1px',
        }}
      >
        <h3 
          className="text-sm font-bold mb-4"
          style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
        >
          Star Rating Distribution
        </h3>
        <div className="space-y-3">
          {ratingData.map((item, i) => {
            const maxCount = Math.max(...ratingData.map(r => r.count), 1);
            const percentage = (item.count / maxCount) * 100;
            return (
              <div key={`rating-${i}-${item.rating}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span 
                    className="text-xs w-12"
                    style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                  >
                    {item.rating}
                  </span>
                  <div 
                    className="flex-1 h-3 rounded-full overflow-hidden mx-3"
                    style={{ backgroundColor: currentTheme.textColor === 'light' ? '#374151' : '#f3f4f6' }}
                  >
                    <div
                      className="h-full transition-all"
                      style={{ 
                        width: `${percentage}%`,
                        background: getGradientBg(),
                      }}
                    />
                  </div>
                  <span 
                    className="text-xs font-bold w-8 text-right"
                    style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
                  >
                    {item.count}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic Line Chart */}
      {stats.chartData.length > 0 && (
        <div key={`line-chart-${dataHash}`} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4">{chartConfig.label}</h3>
          <ResponsiveContainer key={`rc-line-${dataHash}-${chartKey}`} width="100%" height={220}>
            <LineChart 
              data={stats.chartData} 
              margin={{ top: 5, right: 5, bottom: 5, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                key={`xaxis-${lineChartId}-${chartKey}`}
                dataKey={chartConfig.xKey} 
                tick={{ fontSize: 10 }}
                stroke="#9ca3af"
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                key={`yaxis-${lineChartId}-${chartKey}`}
                yAxisId="left"
                tick={{ fontSize: 10 }}
                stroke="#9ca3af"
                allowDecimals={false}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                label={{ 
                  value: chartConfig.secondaryKey ? 'Books' : chartConfig.yKey === 'pages' ? 'Pages' : 'Books', 
                  angle: -90, 
                  position: 'insideLeft', 
                  style: { fontSize: 10, fill: '#6b7280' } 
                }}
              />
              {chartConfig.secondaryKey && (
                <YAxis 
                  key={`yaxis-right-${lineChartId}-${chartKey}`}
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 10 }}
                  stroke="#9ca3af"
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                  label={{ value: 'Pages', angle: 90, position: 'insideRight', style: { fontSize: 10, fill: '#6b7280' } }}
                />
              )}
              <Tooltip 
                key={`tooltip-${lineChartId}-${chartKey}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Line 
                key={`line-primary-${lineChartId}-${chartKey}`}
                type="monotone" 
                dataKey={chartConfig.yKey}
                yAxisId="left"
                stroke="#3298ff"
                strokeWidth={3}
                dot={false}
                isAnimationActive={false}
              />
              {chartConfig.secondaryKey && (
                <Line 
                  key={`line-secondary-${lineChartId}-${chartKey}`}
                  type="monotone" 
                  dataKey={chartConfig.secondaryKey}
                  yAxisId="right"
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={false}
                  strokeDasharray="5 5"
                  isAnimationActive={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
          {chartConfig.secondaryKey && (
            <div className="flex items-center justify-center gap-4 mt-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-blue-500" style={{ backgroundColor: '#3298ff' }} />
                <span className="text-xs text-gray-600">Books</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-emerald-500 border-t-2 border-dashed" style={{ borderColor: '#10b981', borderTopStyle: 'dashed' }} />
                <span className="text-xs text-gray-600">Pages</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reading Pace & Details */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <Clock className="w-4 h-4 text-blue-500 mb-2" />
          <div className="text-xs text-gray-600 mb-1">Avg. Time to Finish</div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.avgDaysToFinish > 0 ? `${stats.avgDaysToFinish}d` : 'N/A'}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <BookOpen className="w-4 h-4 text-purple-500 mb-2" />
          <div className="text-xs text-gray-600 mb-1">Avg. Book Length</div>
          <div className="text-2xl font-bold text-gray-900">
            {stats.avgLength > 0 ? `${stats.avgLength}p` : 'N/A'}
          </div>
        </div>
      </div>

      {/* Genre Breakdown */}
      {genreData.length > 0 && (
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Top Genres</h3>
          <div className="space-y-3">
            {genreData.map((genre, i) => {
              const maxCount = Math.max(...genreData.map(g => g.count), 1);
              const percentage = (genre.count / maxCount) * 100;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-600">{genre.genre}</span>
                    <span className="text-xs font-bold text-gray-900">{genre.count}</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: genre.color
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Additional Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100">
          <Flame className="w-5 h-5 text-orange-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stats.currentStreak}</div>
          <div className="text-xs text-gray-600 mt-0.5">Day Streak 🔥</div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-100">
          <Award className="w-5 h-5 text-amber-600 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stats.longestDay}p</div>
          <div className="text-xs text-gray-600 mt-0.5">Longest Day</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-xl p-4 border border-purple-100">
          <Headphones className="w-5 h-5 text-purple-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stats.totalAudioHours}h</div>
          <div className="text-xs text-gray-600 mt-0.5">Audio Time</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
          <TrendingUp className="w-5 h-5 text-emerald-500 mb-2" />
          <div className="text-2xl font-bold text-gray-900">{stats.avgPagesPerDay}</div>
          <div className="text-xs text-gray-600 mt-0.5">Pages/Day Avg</div>
        </div>
      </div>

      {/* Detailed Metrics Grid */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Detailed Stats</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-100">
            <Clock className="w-4 h-4 text-blue-500 mb-1" />
            <div className="text-xs text-gray-600 mb-0.5">Daily Avg Time</div>
            <div className="text-xl font-bold text-gray-900">
              {stats.uniqueReadingDays > 0 ? `${Math.round(stats.totalSessionMinutes / stats.uniqueReadingDays)}m` : '0m'}
            </div>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-100">
            <Target className="w-4 h-4 text-indigo-500 mb-1" />
            <div className="text-xs text-gray-600 mb-0.5">Total Pages</div>
            <div className="text-xl font-bold text-gray-900">
              {stats.totalPages >= 1000 ? `${(stats.totalPages / 1000).toFixed(1)}K` : stats.totalPages}
            </div>
          </div>
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-lg p-3 border border-rose-100">
            <Star className="w-4 h-4 text-rose-500 fill-rose-500 mb-1" />
            <div className="text-xs text-gray-600 mb-0.5">5-Star Books</div>
            <div className="text-xl font-bold text-gray-900">{stats.fiveStarCount}</div>
          </div>
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg p-3 border border-violet-100">
            <Users className="w-4 h-4 text-violet-500 mb-1" />
            <div className="text-xs text-gray-600 mb-0.5">Authors</div>
            <div className="text-xl font-bold text-gray-900">{stats.uniqueAuthors}</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100">
            <Award className="w-4 h-4 text-green-500 mb-1" />
            <div className="text-xs text-gray-600 mb-0.5">Badges Earned</div>
            <div className="text-xl font-bold text-gray-900">{earnedBadgeCount} / {totalBadgeCount}</div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-3 border border-orange-100">
            <Coffee className="w-4 h-4 text-orange-500 mb-1" />
            <div className="text-xs text-gray-600 mb-0.5">Reading Days</div>
            <div className="text-xl font-bold text-gray-900">{stats.uniqueReadingDays}</div>
          </div>
        </div>
      </div>

      {/* Genre Distribution Pie Chart */}
      {genrePieData.length > 0 && (
        <div key={`genre-pie-${dataHash}`} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Genre Distribution</h3>
          <ResponsiveContainer key={`rc-genre-${dataHash}-${chartKey}`} width="100%" height={200}>
            <PieChart>
              <Pie
                key={`pie-genre-${genrePieId}-${chartKey}`}
                data={genrePieData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                isAnimationActive={false}
              >
                {genrePieData.map((entry, index) => (
                  <Cell key={`cell-genre-${genrePieId}-${chartKey}-${index}-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip key={`tooltip-genre-${genrePieId}-${chartKey}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {genrePieData.map((genre, i) => (
              <div key={`legend-${genrePieId}-${i}-${genre.name}`} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: genre.color }}
                />
                <span className="text-xs text-gray-700">{genre.name}</span>
                <span className="text-xs font-bold text-gray-900 ml-auto">{genre.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Format Distribution Pie Chart */}
      {formatData.length > 0 && (
        <div key={`format-pie-${dataHash}`} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Format Breakdown</h3>
          <ResponsiveContainer key={`rc-format-${dataHash}-${chartKey}`} width="100%" height={200}>
            <PieChart>
              <Pie
                key={`pie-format-${formatPieId}-${chartKey}`}
                data={formatData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                isAnimationActive={false}
              >
                {formatData.map((entry, index) => (
                  <Cell key={`cell-format-${formatPieId}-${chartKey}-${index}-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip key={`tooltip-format-${formatPieId}-${chartKey}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {formatData.map((format, i) => (
              <div key={`flegend-${formatPieId}-${i}-${format.name}`} className="flex flex-col items-center gap-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: format.color }}
                />
                <span className="text-xs text-gray-700">{format.name}</span>
                <span className="text-xs font-bold text-gray-900">{format.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reading Pace Stats */}
      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Reading Pace Records</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100">
            <Zap className="w-4 h-4 text-green-500 mb-1" />
            <div className="text-xs text-gray-600 mb-1">Fastest Book</div>
            {stats.fastestBook.book ? (
              <>
                <div className="text-xl font-bold text-gray-900 mb-0.5">{stats.fastestBook.days}d</div>
                <div className="text-[10px] text-gray-500 truncate">{stats.fastestBook.book.title}</div>
              </>
            ) : (
              <div className="text-xl font-bold text-gray-400">N/A</div>
            )}
          </div>
          <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg p-3 border border-slate-100">
            <Clock className="w-4 h-4 text-slate-500 mb-1" />
            <div className="text-xs text-gray-600 mb-1">Slowest Book</div>
            {stats.slowestBook.book ? (
              <>
                <div className="text-xl font-bold text-gray-900 mb-0.5">{stats.slowestBook.days}d</div>
                <div className="text-[10px] text-gray-500 truncate">{stats.slowestBook.book.title}</div>
              </>
            ) : (
              <div className="text-xl font-bold text-gray-400">N/A</div>
            )}
          </div>
          <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-lg p-3 border border-sky-100">
            <BookOpen className="w-4 h-4 text-sky-500 mb-1" />
            <div className="text-xs text-gray-600 mb-1">Shortest Book</div>
            {stats.shortestBook ? (
              <>
                <div className="text-xl font-bold text-gray-900 mb-0.5">{stats.shortestBook.pages}p</div>
                <div className="text-[10px] text-gray-500 truncate">{stats.shortestBook.title}</div>
              </>
            ) : (
              <div className="text-xl font-bold text-gray-400">N/A</div>
            )}
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 rounded-lg p-3 border border-purple-100">
            <Book className="w-4 h-4 text-purple-500 mb-1" />
            <div className="text-xs text-gray-600 mb-1">Longest Book</div>
            {stats.longestBook ? (
              <>
                <div className="text-xl font-bold text-[#3298ff] mb-0.5">{stats.longestBook.pages.toLocaleString()}p</div>
                <div className="text-[10px] text-gray-500 truncate">{stats.longestBook.title}</div>
              </>
            ) : (
              <div className="text-xl font-bold text-gray-400">N/A</div>
            )}
          </div>
        </div>
      </div>

      {/* NEW: Fiction vs Non-Fiction Pie Chart */}
      {stats.totalBooks > 0 && (
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Fiction vs Non-Fiction</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Fiction', value: stats.fictionCount, color: '#3298ff' },
                  { name: 'Non-Fiction', value: stats.nonFictionCount, color: '#f83aef' },
                ].filter(d => d.value > 0)}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                isAnimationActive={false}
              >
                <Cell fill="#3298ff" />
                <Cell fill="#f83aef" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3298ff' }} />
                <span className="text-xs text-gray-700 font-medium">Fiction</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.fictionCount}</div>
              <div className="text-[10px] text-gray-500">
                {stats.totalBooks > 0 ? Math.round((stats.fictionCount / stats.totalBooks) * 100) : 0}%
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#f83aef' }} />
                <span className="text-xs text-gray-700 font-medium">Non-Fiction</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.nonFictionCount}</div>
              <div className="text-[10px] text-gray-500">
                {stats.totalBooks > 0 ? Math.round((stats.nonFictionCount / stats.totalBooks) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NEW: Top Authors */}
      {stats.topAuthors.length > 0 && (
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4">📚 Top Authors</h3>
          <div className="space-y-3">
            {stats.topAuthors.map((author, i) => {
              const maxCount = stats.topAuthors[0].count;
              const percentage = (author.count / maxCount) * 100;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-gray-700 font-medium truncate flex-1">{author.author}</span>
                    <span className="text-xs font-bold text-gray-900 ml-2">{author.count} book{author.count > 1 ? 's' : ''}</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all"
                      style={{ 
                        width: `${percentage}%`,
                        background: 'linear-gradient(135deg, #3298ff 0%, #f83aef 100%)',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* NEW: Page Length Distribution */}
      {stats.totalBooks > 0 && (
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4">📏 Book Length Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={[
                  { name: '0-200', value: stats.pageRanges['0-200'], fill: '#60a5fa' },
                  { name: '201-400', value: stats.pageRanges['201-400'], fill: '#f59e0b' },
                  { name: '401-600', value: stats.pageRanges['401-600'], fill: '#ef4444' },
                  { name: '601+', value: stats.pageRanges['601+'], fill: '#8b5cf6' },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, value }) => value > 0 ? `${name} (${value})` : ''}
                labelLine={false}
                isAnimationActive={false}
              >
                {[
                  { name: '0-200', value: stats.pageRanges['0-200'], fill: '#60a5fa' },
                  { name: '201-400', value: stats.pageRanges['201-400'], fill: '#f59e0b' },
                  { name: '401-600', value: stats.pageRanges['401-600'], fill: '#ef4444' },
                  { name: '601+', value: stats.pageRanges['601+'], fill: '#8b5cf6' },
                ].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center text-xs text-gray-500 mt-2">Pages</div>
        </div>
      )}

      {/* NEW: Moods Pie Chart */}
      {stats.totalBooks > 0 && stats.moodData.length > 0 && (
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4">😊 Moods</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={stats.moodData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ cx, cy, midAngle, outerRadius, name, percent }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = outerRadius + 25;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  
                  return (
                    <text 
                      x={x} 
                      y={y} 
                      fill="#374151" 
                      textAnchor={x > cx ? 'start' : 'end'} 
                      dominantBaseline="central"
                      fontSize="11"
                      fontWeight="600"
                    >
                      {`${name} ${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
                labelLine={{
                  stroke: '#d1d5db',
                  strokeWidth: 1
                }}
                isAnimationActive={false}
              >
                {stats.moodData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center text-xs text-gray-500 mt-2">Based on book genres & categories</div>
        </div>
      )}

      {/* NEW: Pace Pie Chart */}
      {stats.totalBooks > 0 && (
        <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 mb-4">⚡ Pace</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={stats.paceData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={true}
                isAnimationActive={false}
              >
                {stats.paceData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* NEW: Reading Speed & Time Stats */}
      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 mb-4">⚡ Reading Speed & Time</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-lg p-3 border border-cyan-100">
            <TrendingUp className="w-4 h-4 text-cyan-500 mb-1" />
            <div className="text-xs text-gray-600 mb-1">Reading Speed</div>
            <div className="text-xl font-bold text-gray-900">
              {stats.avgReadingSpeed > 0 ? `${stats.avgReadingSpeed}p/day` : 'N/A'}
            </div>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-100">
            <Clock className="w-4 h-4 text-indigo-500 mb-1" />
            <div className="text-xs text-gray-600 mb-1">Total Reading Time</div>
            <div className="text-xl font-bold text-gray-900">
              {stats.totalReadingHours > 0 ? `${stats.totalReadingHours}h` : '0h'}
            </div>
          </div>
          {stats.bestMonth && (
            <div className="col-span-2 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-3 border border-amber-100">
              <Sparkles className="w-4 h-4 text-amber-500 mb-1" />
              <div className="text-xs text-gray-600 mb-1">Best Reading Month</div>
              <div className="flex items-center justify-between">
                <div className="text-lg font-bold text-gray-900">
                  {new Date(stats.bestMonth[0] + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </div>
                <div className="text-xl font-bold text-amber-600">{stats.bestMonth[1]} books</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}