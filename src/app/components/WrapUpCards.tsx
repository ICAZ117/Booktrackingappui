import { Star, Share2, Palette, Download, Sparkles, Calendar, Trophy, Flame, Book, TrendingUp, ChevronLeft, ChevronRight, BarChart3, Clock, Heart, Zap } from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookCover } from './BookCover';
import { useTheme } from '../contexts/ThemeContext';
import { useBooks } from '../contexts/BooksContext';

const backgroundOptions = [
  { id: 'theme', name: 'Your Theme', type: 'gradient', value: null, decorColor: null },
  { id: 'pink', name: 'Pink Dreams', type: 'gradient', value: 'linear-gradient(180deg, #ffc6d9 0%, #ffa8c5 100%)', decorColor: '#ff85b3' },
  { id: 'lavender', name: 'Lavender Fields', type: 'gradient', value: 'linear-gradient(180deg, #dcd6f7 0%, #c9b8ff 100%)', decorColor: '#a89ff9' },
  { id: 'mint', name: 'Mint Fresh', type: 'gradient', value: 'linear-gradient(180deg, #b8f4d5 0%, #8ee7b8 100%)', decorColor: '#5dd19e' },
  { id: 'peach', name: 'Peachy Keen', type: 'gradient', value: 'linear-gradient(180deg, #ffd4b8 0%, #ffb88c 100%)', decorColor: '#ff9766' },
  { id: 'blue', name: 'Ocean Breeze', type: 'gradient', value: 'linear-gradient(180deg, #b8e7ff 0%, #8dd4ff 100%)', decorColor: '#5cb8ff' },
  { id: 'sunset', name: 'Sunset Glow', type: 'gradient', value: 'linear-gradient(180deg, #ffd6a5 0%, #ffb871 100%)', decorColor: '#ff9a4d' },
  { id: 'rainbow', name: 'Rainbow Vibes', type: 'gradient', value: 'linear-gradient(135deg, #ff6b9d 0%, #ffa057 25%, #ffd946 50%, #95e1d3 75%, #a18cd1 100%)', decorColor: '#ff6b9d' },
  { id: 'midnight', name: 'Midnight Sky', type: 'gradient', value: 'linear-gradient(180deg, #0f2027 0%, #203a43 50%, #2c5364 100%)', decorColor: '#203a43' },
  { id: 'cherry', name: 'Cherry Blossom', type: 'gradient', value: 'linear-gradient(135deg, #ffeef8 0%, #ffcce3 50%, #ffa6d5 100%)', decorColor: '#ffcce3' },
  { id: 'emerald', name: 'Emerald Dream', type: 'gradient', value: 'linear-gradient(180deg, #a8edea 0%, #6dd5b9 50%, #209f84 100%)', decorColor: '#6dd5b9' },
  { id: 'neon', name: 'Neon Nights', type: 'gradient', value: 'linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #4facfe 100%)', decorColor: '#f5576c' },
  { id: 'autumn', name: 'Autumn Leaves', type: 'gradient', value: 'linear-gradient(180deg, #ff9a56 0%, #ff6f47 50%, #d84a39 100%)', decorColor: '#ff6f47' },
  { id: 'cosmic', name: 'Cosmic Purple', type: 'gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)', decorColor: '#764ba2' },
  { id: 'cotton', name: 'Cotton Candy', type: 'gradient', value: 'linear-gradient(180deg, #fbc2eb 0%, #a6c1ee 50%, #d4a5ff 100%)', decorColor: '#a6c1ee' },
  { id: 'tropical', name: 'Tropical Punch', type: 'gradient', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 50%, #30cfd0 100%)', decorColor: '#fee140' },
  { id: 'forest', name: 'Forest Magic', type: 'gradient', value: 'linear-gradient(180deg, #c1dfc4 0%, #7fb285 50%, #5a9367 100%)', decorColor: '#7fb285' },
];

interface WrapUpCardsProps {
  onBack: () => void;
  selectedMonth: number; // 1-indexed (1 = January, 2 = February, 3 = March)
  selectedYear: number;
}

type CardTemplate = 'calendar' | 'book-grid' | 'yearly-stats' | 'monthly-stats' | 'top-3' | 'streak' | 'genre-stats' | 'reading-speed' | 'rating-breakdown';

export function WrapUpCards({ onBack, selectedMonth, selectedYear }: WrapUpCardsProps) {
  const { currentTheme } = useTheme();
  const { books, readingSessions } = useBooks();
  const [showBackgroundPicker, setShowBackgroundPicker] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<CardTemplate>('calendar');
  const [selectedBackground, setSelectedBackground] = useState(backgroundOptions[0]);

  // Convert 1-indexed month to 0-indexed for JavaScript Date operations
  const currentMonth = selectedMonth - 1; // 0-indexed (0 = January, 1 = February, 2 = March)
  const currentYear = selectedYear;
  
  // Get month name from the selected month
  const currentMonthName = new Date(currentYear, currentMonth, 1).toLocaleDateString('en-US', { month: 'long' });

  // Calculate real current month stats
  const februaryStats = useMemo(() => {
    const monthBooks = books.filter((b: any) => {
      if (b.status !== 'finished') return false;
      const finishDate = new Date(b.finishDate || b.dateRead);
      return finishDate.getMonth() === currentMonth && finishDate.getFullYear() === currentYear;
    });

    const totalPages = monthBooks.reduce((sum: number, book: any) => sum + (book.pages || 0), 0);
    
    // Get books sorted by rating for display
    const topBooks = [...monthBooks]
      .filter((b: any) => b.rating && b.rating > 0)
      .sort((a: any, b: any) => (b.rating || 0) - (a.rating || 0))
      .map((b: any) => ({
        title: b.title,
        author: b.author,
        rating: b.rating || 0,
        cover: b.cover
      }));

    // Calculate daily page data for current month
    const monthSessions = readingSessions.filter((s: any) => {
      const sessionDate = new Date(s.date);
      return sessionDate.getMonth() === currentMonth && sessionDate.getFullYear() === currentYear;
    });

    const dailyPages = Array.from({ length: new Date(currentYear, currentMonth + 1, 0).getDate() }, (_, i) => {
      const day = i + 1;
      const dayStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      return monthSessions
        .filter((s: any) => s.date.startsWith(dayStr))
        .reduce((sum: number, s: any) => sum + (s.pages || 0), 0);
    });

    // Create book assignments for calendar (map books to dates they were finished)
    const bookAssignments: { [key: number]: string } = {};
    monthBooks.forEach((book: any) => {
      const finishDate = new Date(book.finishDate || book.dateRead);
      const day = finishDate.getDate();
      if (day >= 1 && day <= new Date(currentYear, currentMonth + 1, 0).getDate()) {
        bookAssignments[day] = book.cover;
      }
    });

    return {
      totalBooks: monthBooks.length,
      totalPages,
      topBooks: topBooks.slice(0, 15), // Limit to 15 for display
      dailyPages,
      bookAssignments,
      allBooks: monthBooks.map((b: any) => ({
        title: b.title,
        author: b.author,
        rating: b.rating || 0,
        cover: b.cover
      }))
    };
  }, [books, readingSessions]);

  const templates: { id: CardTemplate; name: string; icon: any }[] = [
    { id: 'calendar', name: 'Calendar', icon: Calendar },
    { id: 'book-grid', name: 'Book Grid', icon: Book },
    { id: 'yearly-stats', name: '2026 Year', icon: Sparkles },
    { id: 'monthly-stats', name: currentMonthName, icon: Calendar },
    { id: 'top-3', name: 'Top 3', icon: Trophy },
    { id: 'streak', name: 'Streak', icon: Flame },
    { id: 'genre-stats', name: 'Genres', icon: BarChart3 },
    { id: 'reading-speed', name: 'Speed', icon: Zap },
    { id: 'rating-breakdown', name: 'Ratings', icon: Heart },
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${currentMonthName} Reads - ReadTrack`,
        text: `Check out my ${currentMonthName} ${currentYear} reading wrap-up!`,
      }).catch(() => {});
    } else {
      alert('Share feature copied to clipboard!');
    }
  };

  const getThemeGradientBg = () => {
    return currentTheme.isGradient
      ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
      : currentTheme.primary;
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="text-sm font-semibold transition-colors mb-2 flex items-center gap-1"
        style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
      >
        ← Back to stats
      </button>

      <h2 
        className="text-2xl font-bold mb-2"
        style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
      >
        {currentMonthName} {currentYear} Wrap-Up
      </h2>
      <p 
        className="text-sm mb-4"
        style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
      >
        Share your reading journey 📚
      </p>

      {/* Template Selector */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4">
        <div className="flex gap-2 min-w-max">
          {templates.map((template) => {
            const Icon = template.icon;
            const isActive = currentTemplate === template.id;
            return (
              <button
                key={template.id}
                onClick={() => setCurrentTemplate(template.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all whitespace-nowrap"
                style={{
                  background: isActive ? getThemeGradientBg() : currentTheme.cardColor,
                  borderColor: isActive ? 'transparent' : currentTheme.borderColor,
                  borderWidth: isActive ? '0' : '1px',
                  color: isActive ? '#ffffff' : (currentTheme.textColor === 'light' ? '#d1d5db' : '#374151'),
                  boxShadow: isActive ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
                }}
              >
                <Icon className="w-4 h-4" />
                {template.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Background Selector */}
      <div 
        className="rounded-xl p-4"
        style={{
          backgroundColor: currentTheme.cardColor,
          borderColor: currentTheme.borderColor,
          borderWidth: '1px',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <label 
            className="flex items-center gap-2 text-xs font-semibold"
            style={{ color: currentTheme.textColor === 'light' ? '#d1d5db' : '#374151' }}
          >
            <Palette className="w-4 h-4" />
            Background Style
          </label>
          <button
            onClick={() => setShowBackgroundPicker(!showBackgroundPicker)}
            className="text-xs font-semibold"
            style={{ color: currentTheme.accentColor }}
          >
            {showBackgroundPicker ? 'Hide' : 'Change'}
          </button>
        </div>
        
        <AnimatePresence>
          {showBackgroundPicker && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-3 gap-2 mt-2">
                {backgroundOptions.map((bg) => {
                  const getPreviewStyle = () => {
                    if (bg.id === 'theme') {
                      return { background: getThemeGradientBg() };
                    } else if (bg.type === 'gradient') {
                      return { background: bg.value };
                    } else if (bg.type === 'image') {
                      return { backgroundImage: `url(${bg.value})`, backgroundSize: 'cover', backgroundPosition: 'center' };
                    } else if (bg.type === 'pattern') {
                      // CSS patterns
                      if (bg.value === 'abstract-waves') {
                        return { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' };
                      } else if (bg.value === 'dots-pattern') {
                        return { background: '#667eea' };
                      }
                    }
                    return {};
                  };

                  return (
                    <button
                      key={bg.id}
                      onClick={() => {
                        setSelectedBackground(bg);
                        setShowBackgroundPicker(false);
                      }}
                      className={`aspect-square rounded-lg border-2 transition-all ${
                        selectedBackground.id === bg.id ? 'ring-2' : ''
                      }`}
                      style={{ 
                        ...getPreviewStyle(),
                        borderColor: selectedBackground.id === bg.id ? currentTheme.accentColor : currentTheme.borderColor,
                        ...(selectedBackground.id === bg.id && { 
                          boxShadow: `0 0 0 3px ${currentTheme.accentColor}20` 
                        })
                      }}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        {selectedBackground.id === bg.id && (
                          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <svg 
                              className="w-4 h-4" 
                              fill={currentTheme.accentColor} 
                              viewBox="0 0 20 20"
                            >
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div 
                className="text-center mt-2 text-xs font-medium"
                style={{ color: currentTheme.textColor === 'light' ? '#d1d5db' : '#374151' }}
              >
                {selectedBackground.name}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Wrap-Up Card */}
      <div className="relative">
        {/* Share Buttons */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={handleShare}
            className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <Share2 className="w-5 h-5 text-gray-700" />
          </button>
          <button
            onClick={() => alert('Download feature coming soon!')}
            className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <Download className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Main Card */}
        {currentTemplate === 'calendar' && <CalendarCard background={selectedBackground} stats={februaryStats} currentMonth={currentMonth} currentYear={currentYear} currentMonthName={currentMonthName} />}
        {currentTemplate === 'book-grid' && <BookGridCard background={selectedBackground} stats={februaryStats} currentMonthName={currentMonthName} />}
        {currentTemplate === 'yearly-stats' && <YearlyStatsCard background={selectedBackground} />}
        {currentTemplate === 'monthly-stats' && <MonthlyStatsCard background={selectedBackground} stats={februaryStats} currentMonthName={currentMonthName} currentYear={currentYear} />}
        {currentTemplate === 'top-3' && <Top3Card background={selectedBackground} stats={februaryStats} currentMonthName={currentMonthName} currentYear={currentYear} />}
        {currentTemplate === 'streak' && <StreakCard background={selectedBackground} />}
        {currentTemplate === 'genre-stats' && <GenreStatsCard background={selectedBackground} currentMonthName={currentMonthName} currentYear={currentYear} />}
        {currentTemplate === 'reading-speed' && <ReadingSpeedCard background={selectedBackground} currentMonthName={currentMonthName} currentYear={currentYear} />}
        {currentTemplate === 'rating-breakdown' && <RatingBreakdownCard background={selectedBackground} currentMonthName={currentMonthName} currentYear={currentYear} />}
      </div>

      {/* Info Text */}
      <div 
        className="text-center text-xs mt-4"
        style={{ color: currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af' }}
      >
        Perfect for Instagram Stories • 9:16 ratio
      </div>
    </div>
  );
}

// Helper function to get background style for all card types
const getBackgroundStyle = (background: typeof backgroundOptions[0], currentTheme: any) => {
  if (background.id === 'theme') {
    return currentTheme.isGradient
      ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
      : currentTheme.primary;
  } else if (background.type === 'gradient') {
    return background.value;
  } else if (background.type === 'image') {
    return `url(${background.value})`;
  } else if (background.type === 'pattern') {
    // CSS patterns
    if (background.value === 'abstract-waves') {
      return `
        radial-gradient(circle at 20% 50%, rgba(255, 107, 157, 0.4) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(255, 160, 87, 0.4) 0%, transparent 50%),
        radial-gradient(circle at 40% 20%, rgba(255, 217, 70, 0.4) 0%, transparent 50%),
        linear-gradient(135deg, #667eea 0%, #764ba2 100%)
      `;
    } else if (background.value === 'dots-pattern') {
      return '#667eea';
    }
  }
  return background.value || currentTheme.primary;
};

// Calendar Card Template
function CalendarCard({ background, stats, currentMonth, currentYear, currentMonthName }: { background: typeof backgroundOptions[0]; stats: any; currentMonth: number; currentYear: number; currentMonthName: string }) {
  const { currentTheme } = useTheme();

  const bgStyle = getBackgroundStyle(background, currentTheme);
  const isImage = background.type === 'image';
  const isDotsPattern = background.value === 'dots-pattern';

  // Generate calendar grid for current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDay = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sunday
  
  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const dayNumber = i - startDay + 1;
    if (dayNumber > 0 && dayNumber <= daysInMonth) {
      const bookCover = stats.bookAssignments[dayNumber];
      const pagesRead = stats.dailyPages[dayNumber - 1];
      const intensity = pagesRead > 0 ? Math.min(Math.floor(pagesRead / 50), 4) : 0;
      return { day: dayNumber, intensity, bookCover };
    }
    return null;
  });

  // Use real page data
  const pageData = stats.dailyPages;
  const maxPages = Math.max(...pageData, 1);
  const minPages = Math.min(...pageData.filter((p: number) => p > 0), 0);

  return (
    <div 
      className="aspect-[9/16] rounded-3xl shadow-2xl text-white p-6 flex flex-col relative overflow-hidden"
      style={{ 
        ...(isImage ? { backgroundImage: bgStyle, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: bgStyle })
      }}
    >
      {/* Pattern overlay for dots */}
      {isDotsPattern && (
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundImage: `radial-gradient(circle, white 1.5px, transparent 1.5px)`,
            backgroundSize: '24px 24px',
            opacity: 0.15
          }} 
        />
      )}
      
      {/* Darker overlay for image backgrounds */}
      {isImage && (
        <div className="absolute inset-0 bg-black/40" />
      )}
      
      <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-40 h-40 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 mb-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <Calendar className="w-6 h-6 mb-1.5" />
            <h1 className="text-xl font-bold mb-0.5">{currentMonthName} {currentYear}</h1>
            <p className="text-[10px] text-white/80">Reading Calendar</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{stats.totalPages.toLocaleString()}</div>
            <div className="text-[9px] text-white/70">Pages Read</div>
            <div className="text-lg font-bold mt-0.5">{stats.totalBooks}</div>
            <div className="text-[9px] text-white/70">Books Read</div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="relative z-10 flex-1 flex flex-col mb-3">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-0.5 mb-0.5">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div key={i} className="text-center text-[9px] font-semibold text-white/60">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days - More vertical for book covers */}
        <div className="grid grid-cols-7 gap-0.5 flex-1" style={{ minHeight: '140%' }}>
          {calendarDays.map((day, i) => (
            <div
              key={i}
              className="rounded-md flex items-center justify-center text-[9px] font-semibold relative overflow-hidden"
              style={{
                minHeight: '59px', // 40% taller than previous (42px * 1.4 = 59px)
                backgroundColor: day 
                  ? day.intensity === 0 
                    ? 'rgba(255, 255, 255, 0.1)' 
                    : `rgba(255, 255, 255, ${0.2 + day.intensity * 0.15})`
                  : 'transparent',
              }}
            >
              {day && day.bookCover ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="absolute inset-0"
                >
                  <img 
                    src={day.bookCover} 
                    alt={`Book ${day.day}`} 
                    className="w-full h-full object-cover rounded-md"
                  />
                  <div className="absolute top-0 left-0 bg-black/70 text-white text-[7px] font-bold px-1 py-0.5 rounded-br">
                    {day.day}
                  </div>
                </motion.div>
              ) : (
                day && day.day
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Line Graph - Pages Throughout Month */}
      <div className="relative z-10 bg-white/20 backdrop-blur-sm rounded-xl p-2.5">
        <div className="text-[10px] text-white/80 mb-1.5 font-semibold">Pages Throughout Month</div>
        <div className="flex gap-2">
          {/* Y-axis labels */}
          <div className="flex flex-col justify-between text-[7px] text-white/60 py-1">
            <div>{maxPages}</div>
            <div>{Math.round((maxPages + minPages) / 2)}</div>
            <div>0</div>
          </div>
          
          {/* Graph area */}
          <div className="flex-1 flex flex-col">
            <div className="h-16 relative">
              <svg className="w-full h-full" viewBox="0 0 280 64" preserveAspectRatio="none">
                {/* Grid lines */}
                <line x1="0" y1="0" x2="280" y2="0" stroke="white" strokeOpacity="0.1" strokeWidth="0.5" />
                <line x1="0" y1="21.33" x2="280" y2="21.33" stroke="white" strokeOpacity="0.1" strokeWidth="0.5" />
                <line x1="0" y1="42.66" x2="280" y2="42.66" stroke="white" strokeOpacity="0.1" strokeWidth="0.5" />
                <line x1="0" y1="64" x2="280" y2="64" stroke="white" strokeOpacity="0.1" strokeWidth="0.5" />
                
                {/* Area fill */}
                <motion.path
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  transition={{ duration: 0.8 }}
                  d={`
                    M 0 64
                    ${pageData.map((pages, i) => {
                      const x = (i / (pageData.length - 1)) * 280;
                      const y = 64 - (pages / maxPages) * 64;
                      return `L ${x} ${y}`;
                    }).join(' ')}
                    L 280 64
                    Z
                  `}
                  fill="white"
                />
                
                {/* Line */}
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  d={`
                    M 0 ${64 - (pageData[0] / maxPages) * 64}
                    ${pageData.slice(1).map((pages, i) => {
                      const x = ((i + 1) / (pageData.length - 1)) * 280;
                      const y = 64 - (pages / maxPages) * 64;
                      return `L ${x} ${y}`;
                    }).join(' ')}
                  `}
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                
                {/* Data points */}
                {pageData.map((pages, i) => {
                  const x = (i / (pageData.length - 1)) * 280;
                  const y = 64 - (pages / maxPages) * 64;
                  return (
                    <motion.circle
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.02 }}
                      cx={x}
                      cy={y}
                      r="1.5"
                      fill="white"
                    />
                  );
                })}
              </svg>
            </div>
            
            {/* X-axis - All dates */}
            <div className="grid grid-cols-7 text-[6px] text-white/60 mt-0.5 gap-0.5">
              {[1, 5, 9, 13, 17, 21, 25].map((day) => (
                <div key={day} className="text-center">{day}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 text-center mt-2">
        <p className="text-[10px] text-white/60">@readtrack_user • ReadTrack</p>
      </div>
    </div>
  );
}

// Book Grid Template
function BookGridCard({ background, stats, currentMonthName }: { background: typeof backgroundOptions[0]; stats: any; currentMonthName: string }) {
  const { currentTheme } = useTheme();

  const getGradientBg = () => {
    if (background.id === 'theme') {
      return currentTheme.isGradient
        ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
        : currentTheme.primary;
    }
    return background.gradient;
  };

  const topBooks = stats.topBooks;

  return (
    <div 
      className="aspect-[9/16] rounded-3xl shadow-2xl relative overflow-hidden text-white"
      style={{ background: getGradientBg() }}
    >
      <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-40 h-40 rounded-full bg-white/10 blur-3xl" />

      <div className="absolute inset-0 flex flex-col p-6">
        <div className="flex-shrink-0 mb-6 relative z-10">
          <h3 className="text-4xl font-bold mb-2">{currentMonthName} Reads</h3>
          <div className="text-sm text-white/80 font-medium">{stats.totalBooks} amazing books completed 📚</div>
        </div>

        <div className="flex-1 overflow-hidden relative z-10">
          <div className="grid grid-cols-4 gap-2 h-full content-start">
            {topBooks.slice(0, 15).map((book: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: i * 0.05 }}
                className="aspect-[2/3] relative group"
              >
                <div className="w-full h-full rounded-lg overflow-hidden shadow-lg border-2 border-white/40 transform hover:scale-105 hover:rotate-2 transition-transform">
                  <BookCover 
                    src={book.cover} 
                    alt={book.title} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                  {[...Array(5)].map((_, starIdx) => (
                    <svg
                      key={starIdx}
                      className="w-2.5 h-2.5 drop-shadow-md"
                      fill={starIdx < Math.round(book.rating) ? "#fbbf24" : "#ffffff80"}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-center z-10">
          <div className="text-xs font-semibold text-white/70">
            @readtrack_user • ReadTrack
          </div>
        </div>
      </div>
    </div>
  );
}

// Yearly Stats Card
function YearlyStatsCard({ background }: { background: typeof backgroundOptions[0] }) {
  const { currentTheme } = useTheme();

  const getGradientBg = () => {
    if (background.id === 'theme') {
      return currentTheme.isGradient
        ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
        : currentTheme.primary;
    }
    return background.gradient;
  };

  return (
    <div 
      className="aspect-[9/16] rounded-3xl shadow-2xl text-white p-6 flex flex-col justify-between relative overflow-hidden"
      style={{ background: getGradientBg() }}
    >
      <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-40 h-40 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10">
        <Sparkles className="w-8 h-8 mb-3" />
        <h1 className="text-3xl font-bold mb-1">2026</h1>
        <p className="text-sm text-white/80">Year in Books</p>
      </div>

      <div className="relative z-10 space-y-4">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
          <div className="text-5xl font-bold mb-1">42</div>
          <div className="text-sm text-white/80">Books Read</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <div className="text-2xl font-bold mb-0.5">12.4K</div>
            <div className="text-[10px] text-white/80">Pages</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
            <div className="text-2xl font-bold mb-0.5">4.3⭐</div>
            <div className="text-[10px] text-white/80">Avg Rating</div>
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
          <div className="text-xl font-bold mb-0.5">2,680 min</div>
          <div className="text-[10px] text-white/80">Time Reading</div>
        </div>
      </div>

      <div className="relative z-10 text-center">
        <p className="text-xs text-white/60">@readtrack_user • ReadTrack</p>
      </div>
    </div>
  );
}

// Monthly Stats Card
function MonthlyStatsCard({ background, stats, currentMonthName, currentYear }: { background: typeof backgroundOptions[0]; stats: any; currentMonthName: string; currentYear: number }) {
  const { currentTheme } = useTheme();

  const getGradientBg = () => {
    if (background.id === 'theme') {
      return currentTheme.isGradient
        ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
        : currentTheme.primary;
    }
    return background.gradient;
  };

  return (
    <div 
      className="aspect-[9/16] rounded-3xl shadow-2xl text-white p-6 flex flex-col justify-between relative overflow-hidden"
      style={{ background: getGradientBg() }}
    >
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10">
        <Calendar className="w-7 h-7 mb-3" />
        <h1 className="text-2xl font-bold mb-1">{currentMonthName} {currentYear}</h1>
        <p className="text-xs text-white/80">Reading Recap</p>
      </div>

      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-xl p-3">
          <div className="flex items-center gap-2">
            <Book className="w-5 h-5" />
            <span className="text-sm">Books Finished</span>
          </div>
          <span className="text-2xl font-bold">{stats.totalBooks}</span>
        </div>

        <div className="flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-xl p-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm">Pages Read</span>
          </div>
          <span className="text-2xl font-bold">{stats.totalPages.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-xl p-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5" />
            <span className="text-sm">Reading Days</span>
          </div>
          <span className="text-2xl font-bold">{stats.dailyPages.filter((p: number) => p > 0).length}</span>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
          <div className="text-xs text-white/80 mb-1">Favorite Genre</div>
          <div className="text-lg font-bold">Mystery & Thriller</div>
        </div>
      </div>

      <div className="relative z-10 text-center">
        <p className="text-xs text-white/60">@readtrack_user • ReadTrack</p>
      </div>
    </div>
  );
}

// Top 3 Card (with book covers)
function Top3Card({ background, stats, currentMonthName, currentYear }: { background: typeof backgroundOptions[0]; stats: ReturnType<typeof getFebruaryStats>; currentMonthName: string; currentYear: number }) {
  const { currentTheme } = useTheme();

  const getGradientBg = () => {
    if (background.id === 'theme') {
      return currentTheme.isGradient
        ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
        : currentTheme.primary;
    }
    return background.gradient;
  };

  const topBooks = stats.topBooks;

  const top3Books = [
    { title: "Fourth Wing", author: "Rebecca Yarros", rating: 5, cover: topBooks[0]?.cover || '' },
    { title: "Iron Flame", author: "Rebecca Yarros", rating: 5, cover: topBooks[7]?.cover || '' },
    { title: "Project Hail Mary", author: "Andy Weir", rating: 5, cover: topBooks[5]?.cover || '' },
  ];

  return (
    <div 
      className="aspect-[9/16] rounded-3xl shadow-2xl text-white p-6 flex flex-col justify-between relative overflow-hidden"
      style={{ background: getGradientBg() }}
    >
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10">
        <Trophy className="w-8 h-8 mb-3" />
        <h1 className="text-3xl font-bold mb-1">Top 3 Books</h1>
        <p className="text-sm text-white/80">Best of {currentMonthName} {currentYear}</p>
      </div>

      <div className="relative z-10 space-y-4">
        {top3Books.map((book, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white/30 flex items-center justify-center font-bold text-2xl">
              {index + 1}
            </div>
            <div className="w-16 h-24 rounded-lg overflow-hidden shadow-xl border-2 border-white/50 flex-shrink-0">
              <BookCover src={book.cover} alt={book.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-lg font-bold truncate">{book.title}</div>
              <div className="text-xs text-white/70 truncate mb-1">{book.author}</div>
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < book.rating ? 'fill-yellow-400 text-yellow-400' : 'text-white/30'}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 text-center">
        <p className="text-xs text-white/60">@readtrack_user • ReadTrack</p>
      </div>
    </div>
  );
}

// Streak Card
function StreakCard({ background }: { background: typeof backgroundOptions[0] }) {
  const { currentTheme } = useTheme();

  const getGradientBg = () => {
    if (background.id === 'theme') {
      return currentTheme.isGradient
        ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
        : currentTheme.primary;
    }
    return background.gradient;
  };

  return (
    <div 
      className="aspect-[9/16] rounded-3xl shadow-2xl text-white p-6 flex flex-col justify-between relative overflow-hidden"
      style={{ background: getGradientBg() }}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10">
        <Flame className="w-7 h-7 mb-3" />
        <h1 className="text-2xl font-bold mb-1">Reading Streak</h1>
        <p className="text-xs text-white/80">Keep it going!</p>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="text-8xl font-bold mb-4">47</div>
        <div className="text-xl font-semibold mb-6">Day Streak 🔥</div>
        
        <div className="w-full space-y-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
            <div className="text-2xl font-bold mb-0.5">47</div>
            <div className="text-[10px] text-white/80">Current Streak</div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="text-xl font-bold mb-0.5">89</div>
              <div className="text-[10px] text-white/80">Longest</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
              <div className="text-xl font-bold mb-0.5">78%</div>
              <div className="text-[10px] text-white/80">This Year</div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 text-center">
        <p className="text-xs text-white/60">@readtrack_user • ReadTrack</p>
      </div>
    </div>
  );
}

// Genre Stats Card
function GenreStatsCard({ background, currentMonthName, currentYear }: { background: typeof backgroundOptions[0]; currentMonthName: string; currentYear: number }) {
  const { currentTheme } = useTheme();

  const getGradientBg = () => {
    if (background.id === 'theme') {
      return currentTheme.isGradient
        ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
        : currentTheme.primary;
    }
    return background.gradient;
  };

  const genres = [
    { name: 'Mystery & Thriller', count: 8, percentage: 53 },
    { name: 'Fantasy', count: 3, percentage: 20 },
    { name: 'Romance', count: 2, percentage: 13 },
    { name: 'Sci-Fi', count: 1, percentage: 7 },
    { name: 'Literary Fiction', count: 1, percentage: 7 },
  ];

  return (
    <div 
      className="aspect-[9/16] rounded-3xl shadow-2xl text-white p-6 flex flex-col justify-between relative overflow-hidden"
      style={{ background: getGradientBg() }}
    >
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10">
        <BarChart3 className="w-8 h-8 mb-3" />
        <h1 className="text-3xl font-bold mb-1">Genre Breakdown</h1>
        <p className="text-sm text-white/80">{currentMonthName} {currentYear}</p>
      </div>

      <div className="relative z-10 space-y-3 flex-1 flex flex-col justify-center">
        {genres.map((genre, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/20 backdrop-blur-sm rounded-xl p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">{genre.name}</span>
              <span className="text-lg font-bold">{genre.count}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${genre.percentage}%` }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                className="bg-white h-full rounded-full"
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 text-center">
        <p className="text-xs text-white/60">@readtrack_user • ReadTrack</p>
      </div>
    </div>
  );
}

// Reading Speed Card
function ReadingSpeedCard({ background, currentMonthName, currentYear }: { background: typeof backgroundOptions[0]; currentMonthName: string; currentYear: number }) {
  const { currentTheme } = useTheme();

  const getGradientBg = () => {
    if (background.id === 'theme') {
      return currentTheme.isGradient
        ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
        : currentTheme.primary;
    }
    return background.gradient;
  };

  return (
    <div 
      className="aspect-[9/16] rounded-3xl shadow-2xl text-white p-6 flex flex-col justify-between relative overflow-hidden"
      style={{ background: getGradientBg() }}
    >
      <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-40 h-40 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10">
        <Zap className="w-8 h-8 mb-3" />
        <h1 className="text-3xl font-bold mb-1">Reading Speed</h1>
        <p className="text-sm text-white/80">{currentMonthName} {currentYear}</p>
      </div>

      <div className="relative z-10 space-y-4">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5 text-center">
          <div className="text-6xl font-bold mb-2">135</div>
          <div className="text-sm text-white/80">Pages Per Day</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
            <Clock className="w-6 h-6 mx-auto mb-2" />
            <div className="text-2xl font-bold mb-0.5">96</div>
            <div className="text-[10px] text-white/80">Minutes/Day</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
            <Book className="w-6 h-6 mx-auto mb-2" />
            <div className="text-2xl font-bold mb-0.5">1.9</div>
            <div className="text-[10px] text-white/80">Days/Book</div>
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
          <div className="text-xs text-white/70 mb-1">Fastest Read</div>
          <div className="text-base font-bold">The Housemaid - 6 hours</div>
        </div>
      </div>

      <div className="relative z-10 text-center">
        <p className="text-xs text-white/60">@readtrack_user • ReadTrack</p>
      </div>
    </div>
  );
}

// Rating Breakdown Card
function RatingBreakdownCard({ background, currentMonthName, currentYear }: { background: typeof backgroundOptions[0]; currentMonthName: string; currentYear: number }) {
  const { currentTheme } = useTheme();

  const getGradientBg = () => {
    if (background.id === 'theme') {
      return currentTheme.isGradient
        ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
        : currentTheme.primary;
    }
    return background.gradient;
  };

  const ratings = [
    { stars: 5, count: 6, percentage: 40 },
    { stars: 4, count: 5, percentage: 33 },
    { stars: 3, count: 3, percentage: 20 },
    { stars: 2, count: 1, percentage: 7 },
    { stars: 1, count: 0, percentage: 0 },
  ];

  return (
    <div 
      className="aspect-[9/16] rounded-3xl shadow-2xl text-white p-6 flex flex-col justify-between relative overflow-hidden"
      style={{ background: getGradientBg() }}
    >
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10">
        <Heart className="w-8 h-8 mb-3" />
        <h1 className="text-3xl font-bold mb-1">Rating Breakdown</h1>
        <p className="text-sm text-white/80">{currentMonthName} {currentYear}</p>
      </div>

      <div className="relative z-10 space-y-3 flex-1 flex flex-col justify-center">
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mb-2 text-center">
          <div className="text-5xl font-bold mb-1">4.3</div>
          <div className="flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <div className="text-xs text-white/70 mt-1">Average Rating</div>
        </div>

        {ratings.map((rating, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.08 }}
            className="flex items-center gap-3"
          >
            <div className="flex items-center gap-1 w-14">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">{rating.stars}</span>
            </div>
            <div className="flex-1 bg-white/20 rounded-full h-6 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${rating.percentage}%` }}
                transition={{ delay: index * 0.08 + 0.2, duration: 0.5 }}
                className="bg-white h-full rounded-full flex items-center justify-end pr-2"
              >
                <span className="text-xs font-bold text-gray-800">{rating.count}</span>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 text-center">
        <p className="text-xs text-white/60">@readtrack_user • ReadTrack</p>
      </div>
    </div>
  );
}