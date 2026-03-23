import { useState, useMemo, useRef } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useBooks } from '../contexts/BooksContext';
import { useTheme } from '../contexts/ThemeContext';
import { CalendarCustomizer } from './CalendarCustomizer';

interface WrapUpCalendarProps {
  onBookSelect?: (book: any) => void;
}

export function WrapUpCalendar({ onBookSelect }: WrapUpCalendarProps) {
  const { books, readingSessions } = useBooks();
  const { currentTheme } = useTheme();
  const calendarRef = useRef<HTMLDivElement>(null);
  const [hoveredDay, setHoveredDay] = useState<{ day: number; pages: number; x: number; y: number } | null>(null);
  
  // Current year and selected month (user can click to change)
  const now = new Date();
  const currentYear = now.getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth()); // 0-indexed
  const [customBackground, setCustomBackground] = useState<any>(null);
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonthName = monthNames[selectedMonth];

  // Calculate stats for the selected month
  const stats = useMemo(() => {
    const monthBooks = books.filter((b: any) => {
      if (b.status !== 'finished') return false;
      if (!b.finishDate && !b.dateRead) return false;
      const finishDate = new Date(b.finishDate || b.dateRead);
      return finishDate.getMonth() === selectedMonth && finishDate.getFullYear() === currentYear;
    });

    const totalPages = monthBooks.reduce((sum: number, book: any) => sum + (book.pages || 0), 0);

    // Calculate daily page data for current month
    const monthSessions = readingSessions.filter((s: any) => {
      const sessionDate = new Date(s.date);
      return sessionDate.getMonth() === selectedMonth && sessionDate.getFullYear() === currentYear;
    });

    const daysInMonth = new Date(currentYear, selectedMonth + 1, 0).getDate();
    const dailyPages = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const dayStr = `${currentYear}-${String(selectedMonth + 1).padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      return monthSessions
        .filter((s: any) => s.date.startsWith(dayStr))
        .reduce((sum: number, s: any) => sum + (s.pages || 0), 0);
    });

    // Create book assignments for calendar (map books to dates they were finished)
    const bookAssignments: { [key: number]: any } = {}; // Store full book object
    monthBooks.forEach((book: any) => {
      const finishDate = new Date(book.finishDate || book.dateRead);
      const day = finishDate.getDate();
      if (day >= 1 && day <= daysInMonth) {
        // If multiple books on same day, only show one
        if (!bookAssignments[day]) {
          bookAssignments[day] = book;
        }
      }
    });

    return {
      totalBooks: monthBooks.length,
      totalPages,
      dailyPages,
      bookAssignments,
    };
  }, [books, readingSessions, selectedMonth, currentYear]);

  // Generate calendar grid for current month
  const daysInMonth = new Date(currentYear, selectedMonth + 1, 0).getDate();
  const startDay = new Date(currentYear, selectedMonth, 1).getDay(); // 0 = Sunday
  
  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const dayNumber = i - startDay + 1;
    if (dayNumber > 0 && dayNumber <= daysInMonth) {
      const book = stats.bookAssignments[dayNumber];
      const bookCover = book?.cover;
      const pagesRead = stats.dailyPages[dayNumber - 1];
      const intensity = pagesRead > 0 ? Math.min(Math.floor(pagesRead / 50), 4) : 0;
      return { day: dayNumber, intensity, bookCover, book };
    }
    return null;
  });

  // Use real page data
  const pageData = stats.dailyPages;
  const maxPages = Math.max(...pageData, 1);
  const minPages = Math.min(...pageData.filter((p: number) => p > 0), 0);
  
  // Calculate Y-axis in increments of 100
  const maxYAxis = Math.ceil(maxPages / 100) * 100;
  const yAxisLabels = [];
  for (let i = maxYAxis; i >= 0; i -= 100) {
    yAxisLabels.push(i);
  }

  const getGradientBg = () => {
    // Use custom background if set, otherwise use theme
    if (customBackground && customBackground.value) {
      return customBackground.value;
    }
    return currentTheme.isGradient
      ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
      : currentTheme.primary;
  };

  const goToPreviousMonth = () => {
    if (selectedMonth > 0) {
      setSelectedMonth(selectedMonth - 1);
    } else {
      // Can't go before January of current year for now
      setSelectedMonth(0);
    }
  };

  const goToNextMonth = () => {
    const today = new Date();
    if (selectedMonth < today.getMonth() || currentYear < today.getFullYear()) {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  return (
    <div className="space-y-4">
      {/* Customizer Toolbar */}
      <CalendarCustomizer
        calendarRef={calendarRef}
        onBackgroundChange={setCustomBackground}
        currentBackground={customBackground}
        calendarName={`${currentMonthName}-${currentYear}`}
      />

      {/* Calendar */}
      <div 
        ref={calendarRef}
        className="rounded-3xl shadow-2xl text-white p-6 flex flex-col relative overflow-hidden"
        style={{ 
          background: getGradientBg(),
          minHeight: '600px',
        }}
      >
        {/* Decorative blurred circles */}
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-40 h-40 rounded-full bg-white/10 blur-3xl" />

        {/* Header */}
        <div className="relative z-10 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <button
                onClick={goToPreviousMonth}
                className="p-2 rounded-lg hover:bg-white/20 transition-all"
                disabled={selectedMonth === 0}
                style={{ opacity: selectedMonth === 0 ? 0.3 : 1 }}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <Calendar className="w-6 h-6 mb-1.5" />
                <h1 className="text-2xl font-bold mb-0.5">{currentMonthName} {currentYear}</h1>
                <p className="text-xs text-white/80">Reading Calendar</p>
              </div>
              <button
                onClick={goToNextMonth}
                className="p-2 rounded-lg hover:bg-white/20 transition-all"
                disabled={selectedMonth >= now.getMonth()}
                style={{ opacity: selectedMonth >= now.getMonth() ? 0.3 : 1 }}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{stats.totalPages.toLocaleString()}</div>
              <div className="text-xs text-white/70">Pages Read</div>
              <div className="text-2xl font-bold mt-1">{stats.totalBooks}</div>
              <div className="text-xs text-white/70">Books Read</div>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="relative z-10 flex-1 flex flex-col mb-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="text-center text-xs font-semibold text-white/60">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1 flex-1">
            {calendarDays.map((day, i) => (
              <div
                key={i}
                className="rounded-lg flex items-center justify-center text-sm font-semibold relative overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                style={{
                  backgroundColor: day 
                    ? day.intensity === 0 
                      ? 'rgba(255, 255, 255, 0.1)' 
                      : `rgba(255, 255, 255, ${0.2 + day.intensity * 0.15})`
                    : 'transparent',
                  aspectRatio: '1 / 1.4', // 40% taller to better fit book covers
                }}
                onClick={() => {
                  if (day?.book && onBookSelect) {
                    onBookSelect(day.book);
                  }
                }}
                onMouseEnter={(e) => {
                  if (day) {
                    setHoveredDay({ day: day.day, pages: day.intensity * 50, x: e.clientX, y: e.clientY });
                  }
                }}
                onMouseLeave={() => {
                  setHoveredDay(null);
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
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute top-0.5 left-0.5 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
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
        <div className="relative z-10 bg-white/20 backdrop-blur-sm rounded-xl p-3">
          <div className="text-xs text-white/80 mb-2 font-semibold">Pages Throughout Month</div>
          <div className="flex gap-2">
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between text-[9px] text-white/60 py-1">
              {yAxisLabels.map((label, i) => (
                <div key={i}>{label}</div>
              ))}
            </div>
            
            {/* Graph area */}
            <div className="flex-1 flex flex-col">
              <div className="h-24 relative" onMouseLeave={() => setHoveredDay(null)}>
                <svg className="w-full h-full" viewBox="0 0 280 96" preserveAspectRatio="none">
                  {/* Grid lines - based on 100 page increments */}
                  {yAxisLabels.map((label, i) => {
                    const y = (i / (yAxisLabels.length - 1)) * 96;
                    return (
                      <line 
                        key={i}
                        x1="0" 
                        y1={y} 
                        x2="280" 
                        y2={y} 
                        stroke="white" 
                        strokeOpacity="0.1" 
                        strokeWidth="0.5" 
                      />
                    );
                  })}
                  
                  {/* Area fill */}
                  <motion.path
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ duration: 0.8 }}
                    d={`
                      M 0 96
                      ${pageData.map((pages, i) => {
                        const x = (i / (pageData.length - 1)) * 280;
                        const y = 96 - (pages / maxYAxis) * 96;
                        return `L ${x} ${y}`;
                      }).join(' ')}
                      L 280 96
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
                      M 0 ${96 - (pageData[0] / maxYAxis) * 96}
                      ${pageData.slice(1).map((pages, i) => {
                        const x = ((i + 1) / (pageData.length - 1)) * 280;
                        const y = 96 - (pages / maxYAxis) * 96;
                        return `L ${x} ${y}`;
                      }).join(' ')}
                    `}
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  
                  {/* Interactive Data points */}
                  {pageData.map((pages, i) => {
                    const x = (i / (pageData.length - 1)) * 280;
                    const y = 96 - (pages / maxYAxis) * 96;
                    return (
                      <g key={i}>
                        <motion.circle
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + i * 0.02 }}
                          cx={x}
                          cy={y}
                          r="3"
                          fill="white"
                          className="cursor-pointer hover:r-[5]"
                          style={{ transition: 'r 0.2s' }}
                        />
                        {/* Invisible larger circle for easier hover */}
                        <circle
                          cx={x}
                          cy={y}
                          r="8"
                          fill="transparent"
                          className="cursor-pointer"
                          onMouseEnter={(e) => {
                            const svgRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                            if (svgRect) {
                              setHoveredDay({ 
                                day: i + 1, 
                                pages: pages,
                                x: svgRect.left + (x / 280) * svgRect.width,
                                y: svgRect.top + (y / 96) * svgRect.height
                              });
                            }
                          }}
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>
              
              {/* X-axis labels - show every day */}
              <div className="grid text-[7px] text-white/60 mt-1" style={{ gridTemplateColumns: `repeat(${pageData.length}, 1fr)` }}>
                {pageData.map((_, i) => (
                  <div key={i} className="text-center">
                    {(i + 1) % 2 === 0 ? i + 1 : ''}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hovered Day Tooltip */}
      {hoveredDay && (
        <div
          className="fixed bg-black/90 text-white text-xs px-3 py-2 rounded-lg pointer-events-none z-50 shadow-xl"
          style={{
            left: hoveredDay.x + 10,
            top: hoveredDay.y - 40,
          }}
        >
          <div className="font-semibold">{currentMonthName} {hoveredDay.day}, {currentYear}</div>
          <div className="text-white/80">{hoveredDay.pages} pages read</div>
        </div>
      )}
    </div>
  );
}