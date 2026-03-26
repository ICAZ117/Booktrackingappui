import { useMemo, useState, useRef } from 'react';
import { useBooks } from '../contexts/BooksContext';
import { useTheme } from '../contexts/ThemeContext';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { BookCover } from './BookCover';
import { motion } from 'motion/react';
import { CalendarCustomizer } from './CalendarCustomizer';

interface MonthlyCalendarProps {
  onBookSelect?: (book: any) => void;
}

export function MonthlyCalendar({ onBookSelect }: MonthlyCalendarProps) {
  const { books, readingSessions } = useBooks();
  const { currentTheme } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [customBackground, setCustomBackground] = useState<any>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Get books finished on each date
  const { booksByDate, finishedBooksByDate } = useMemo(() => {
    const dateMap: { [date: string]: Set<string> } = {}; // Use Set to track book IDs and prevent duplicates
    const bookMap: { [date: string]: any[] } = {};
    const finishedDateMap: { [date: string]: Set<string> } = {};
    const finishedBookMap: { [date: string]: any[] } = {};

    console.log('📅 MonthlyCalendar: Processing books for calendar...');

    // Helper function to parse date string to YYYY-MM-DD
    const parseDate = (dateStr: string): string | null => {
      if (!dateStr) return null;
      // Check if date is already in YYYY-MM-DD format
      const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (isoMatch) {
        return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
      }
      
      // Handle "YYYY/MM/DD" format
      const slashMatch = dateStr.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})/);
      if (slashMatch) {
        const year = slashMatch[1];
        const month = String(slashMatch[2]).padStart(2, '0');
        const day = String(slashMatch[3]).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
      
      // Use Date parser for other formats
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          return null;
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      } catch (e) {
        return null;
      }
    };

    const addBookToDate = (
      targetSetMap: { [date: string]: Set<string> },
      targetBookMap: { [date: string]: any[] },
      dateKey: string,
      book: any,
    ) => {
      if (!targetSetMap[dateKey]) {
        targetSetMap[dateKey] = new Set();
        targetBookMap[dateKey] = [];
      }
      if (!targetSetMap[dateKey].has(book.id)) {
        targetSetMap[dateKey].add(book.id);
        targetBookMap[dateKey].push(book);
      }
    };

    books
      .filter(b => b.status === 'finished' && (b.finishDate || b.dateRead))
      .forEach(book => {
        const finishDateStr = book.finishDate || book.dateRead;
        const startDateStr = book.startDate;
        if (!finishDateStr) return;

        // Special debugging for "Love, Mom"
        if (book.title?.toLowerCase().includes('love') && book.title?.toLowerCase().includes('mom')) {
          console.log(`🔍 LOVE MOM DEBUG - RAW DATA:`, {
            title: book.title,
            startDate: startDateStr,
            finishDate: finishDateStr,
            dateRead: book.dateRead,
            startType: typeof startDateStr,
            finishType: typeof finishDateStr,
          });
        }

        console.log(`📅 Processing book: "${book.title}" - Start: "${startDateStr}", Finish: "${finishDateStr}"`);

        const finishKey = parseDate(finishDateStr);
        if (!finishKey) {
          console.warn(`  ⚠️ Invalid finish date: "${finishDateStr}"`);
          return;
        }

        // Special debugging for "Love, Mom" - after parsing
        if (book.title?.toLowerCase().includes('love') && book.title?.toLowerCase().includes('mom')) {
          console.log(`🔍 LOVE MOM DEBUG - PARSED:`, {
            title: book.title,
            parsedFinishKey: finishKey,
            willUseStartDate: !!startDateStr,
          });
        }

        // If there's a start date, add book to all days in between
        if (startDateStr) {
          const startKey = parseDate(startDateStr);
          if (startKey) {
            let startDate = new Date(startKey + 'T00:00:00');
            let finishDate = new Date(finishKey + 'T00:00:00');
            
            // Validate date range - swap if backwards
            if (startDate > finishDate) {
              console.log(`  📅 Swapping dates for "${book.title}": ${startKey} ↔️ ${finishKey}`);
              // Swap the dates
              const temp = startDate;
              startDate = finishDate;
              finishDate = temp;
            }
            
            const dayCount = Math.floor((finishDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            
            // Check for unreasonable date ranges (more than 365 days)
            if (dayCount > 365) {
              console.error(`  ⚠️ Unreasonable date range for "${book.title}": ${dayCount} days. Check dates!`);
              // Just add to finish date
              addBookToDate(dateMap, bookMap, finishKey, book);
              addBookToDate(finishedDateMap, finishedBookMap, finishKey, book);
              return;
            }
            
            console.log(`  📅 Adding to date range: ${startKey} to ${finishKey} (${dayCount} days)`);
            
            // Special debugging for "Love, Mom"
            if (book.title?.toLowerCase().includes('love') && book.title?.toLowerCase().includes('mom')) {
              console.log(`🔍 LOVE MOM DEBUG - DATE RANGE:`, {
                startKey,
                finishKey,
                startDate: startDate.toISOString(),
                finishDate: finishDate.toISOString(),
                dayCount,
              });
            }
            
            // Add book to each day in the range
            const currentDate = new Date(startDate);
            let addedDays = 0;
            while (currentDate <= finishDate && addedDays < 100) { // Safety limit
              const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
              
              if (!dateMap[dateKey]) {
                dateMap[dateKey] = new Set();
                bookMap[dateKey] = [];
              }
              
              // Only add if not already present
              if (!dateMap[dateKey].has(book.id)) {
                dateMap[dateKey].add(book.id);
                bookMap[dateKey].push(book);
              }

              addBookToDate(finishedDateMap, finishedBookMap, dateKey, book);
              
              currentDate.setDate(currentDate.getDate() + 1);
              addedDays++;
            }
            
            if (addedDays >= 100) {
              console.error(`  ⚠️ Safety limit reached for "${book.title}" - check dates!`);
            }
          } else {
            // No valid start date, just add to finish date
            console.log(`  📅 No valid start date, adding only to finish date: ${finishKey}`);
            addBookToDate(dateMap, bookMap, finishKey, book);
            addBookToDate(finishedDateMap, finishedBookMap, finishKey, book);
          }
        } else {
          // No start date, just add to finish date
          console.log(`  📅 No start date, adding only to finish date: ${finishKey}`);
          addBookToDate(dateMap, bookMap, finishKey, book);
          addBookToDate(finishedDateMap, finishedBookMap, finishKey, book);
        }
      });

    // Add currently reading books on days where reading sessions exist
    readingSessions.forEach((session: any) => {
      const dateKey = parseDate(session?.date);
      if (!dateKey) return;

      const sessionBook = books.find(
        (book: any) =>
          book.id === session.bookId &&
          (book.status === 'reading' || book.status === 'on-hold'),
      );
      if (!sessionBook) return;
      addBookToDate(dateMap, bookMap, dateKey, sessionBook);
    });

    // Ensure currently reading books are reflected across their active reading range.
    // This covers cases where progress was updated but no explicit reading_session row exists yet.
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    books
      .filter((b: any) => b.status === 'reading' || b.status === 'on-hold')
      .forEach((book: any) => {
        const startKey = parseDate(book.startDate);
        const fallbackStart = parseDate(book.dateRead || book.finishDate || '');
        const effectiveStartKey = startKey || fallbackStart;
        if (!effectiveStartKey) return;

        let startDate = new Date(`${effectiveStartKey}T00:00:00`);
        if (isNaN(startDate.getTime())) return;
        if (startDate > today) return;

        // Safety cap to avoid runaway loops on bad data.
        const maxDays = 366;
        let steps = 0;
        const cursor = new Date(startDate);
        while (cursor <= today && steps < maxDays) {
          const dateKey = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`;
          addBookToDate(dateMap, bookMap, dateKey, book);
          cursor.setDate(cursor.getDate() + 1);
          steps += 1;
        }
      });

    console.log('📅 Final date map:', Object.keys(bookMap).sort());
    console.log('📅 Total dates with books:', Object.keys(bookMap).length);
    
    return { booksByDate: bookMap, finishedBooksByDate: finishedBookMap };
  }, [books, readingSessions]);

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    const today = new Date();
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
    
    // Allow going to future months
    setCurrentMonth(nextMonth);
  };

  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  };

  const isFutureDate = (day: number) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(year, month, day);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate > today;
  };

  const isCurrentMonth = () => {
    const today = new Date();
    return today.getFullYear() === year && today.getMonth() === month;
  };

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const textColor = currentTheme.textColor === 'light' ? '#ffffff' : '#111827';
  const mutedColor = currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280';

  const getBackgroundStyle = () => {
    if (customBackground && customBackground.value) {
      return { background: customBackground.value };
    }
    return { backgroundColor: currentTheme.cardColor };
  };

  const getDayCellStyle = (isTodayDate: boolean, isFuture: boolean, hasBooks: boolean) => {
    // If custom background is set, make day cells semi-transparent to show the background
    if (customBackground && customBackground.value) {
      return {
        backgroundColor: hasBooks 
          ? 'rgba(255, 255, 255, 0.25)' // Light semi-transparent for days with books
          : 'rgba(255, 255, 255, 0.1)',  // Very light for empty days
        border: isTodayDate ? `2px solid ${currentTheme.primary}` : '1px solid rgba(255, 255, 255, 0.3)',
        opacity: isFuture ? 0.4 : 1,
        backdropFilter: 'blur(8px)', // Add subtle blur for glass effect
      };
    }
    // Default theme styling
    return {
      backgroundColor: currentTheme.cardColor,
      border: isTodayDate ? `2px solid ${currentTheme.primary}` : `1px solid ${currentTheme.borderColor}`,
      opacity: isFuture ? 0.4 : 1,
    };
  };

  // Create array of day cells
  const dayCells = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    dayCells.push(
      <div 
        key={`empty-${i}`} 
        className="h-32 rounded"
        style={{ backgroundColor: currentTheme.backgroundColor }}
      />
    );
  }
  
  // Add actual day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = formatDateKey(year, month, day);
    const booksForDay = booksByDate[dateKey] || [];
    const isTodayDate = isToday(day);
    const isFuture = isFutureDate(day);
    
    const cellIndex = startingDayOfWeek + day - 1;
    const gridRow = Math.floor(cellIndex / 7) + 1;
    const gridCol = (cellIndex % 7) + 1;
    
    dayCells.push(
      <div
        key={day}
        className={`h-32 rounded p-1 relative overflow-hidden ${
          booksForDay.length > 0 ? 'cursor-pointer' : ''
        }`}
        style={getDayCellStyle(isTodayDate, isFuture, booksForDay.length > 0)}
      >
        {/* Day Number with Debug Info */}
        <div 
          className="text-[10px] font-semibold mb-0.5 flex items-center justify-between"
          style={{ 
            color: customBackground && customBackground.value
              ? '#ffffff' // White text on custom backgrounds for visibility
              : isTodayDate 
                ? currentTheme.primary 
                : currentTheme.textColor === 'light' ? '#d1d5db' : '#4b5563'
          }}
        >
          <span>{day}</span>
        </div>

        {/* Books for this day - Small stacked covers */}
        {booksForDay.length > 0 && (
          <div className={`flex ${booksForDay.length === 1 ? 'justify-center items-center h-full' : 'flex-row gap-0.5 justify-center flex-wrap'}`}>
            {booksForDay.slice(0, 4).map((book, idx) => {
              // Check if this book was finished on this exact date
              const bookFinishDate = book.finishDate || book.dateRead;
              const isFinishedOnThisDay = bookFinishDate === dateKey;
              
              return (
                <div 
                  key={`${book.id}-${idx}`} 
                  className="group relative cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onBookSelect?.(book);
                  }}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    {/* Small Book Cover Thumbnail */}
                    <div 
                      className={`rounded-[2px] overflow-hidden shadow-sm transition-transform hover:scale-110 ${
                        isFinishedOnThisDay ? 'w-8 h-11' : 'w-9 h-12'
                      }`}
                      style={{ 
                        backgroundColor: currentTheme.backgroundColor,
                      }}
                    >
                      {book.cover ? (
                        <img 
                          src={book.cover} 
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-0.5">
                          <span 
                            className="text-[6px] font-bold text-center leading-tight"
                            style={{ color: currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af' }}
                          >
                            {book.title.slice(0, 12)}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Show rating if finished on this day */}
                    {isFinishedOnThisDay && book.rating && (
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-2 h-2"
                            fill={i < book.rating! ? '#fbbf24' : 'none'}
                            style={{ 
                              color: i < book.rating! ? '#fbbf24' : currentTheme.borderColor,
                              strokeWidth: 2
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Show reading badge for currently reading/on-hold books */}
                    {!isFinishedOnThisDay && (book.status === 'reading' || book.status === 'on-hold') && (
                      <div
                        className="text-[7px] font-bold px-1 py-0.5 rounded"
                        style={{
                          backgroundColor: '#10b981',
                          color: '#ffffff',
                        }}
                      >
                        Reading
                      </div>
                    )}
                  </div>
                  
                  {/* Tooltip on hover */}
                  <div className="absolute left-full ml-1 top-0 hidden group-hover:block z-30 pointer-events-none whitespace-nowrap">
                    <div 
                      className="text-[9px] font-semibold px-2 py-1 rounded shadow-xl"
                      style={{ 
                        backgroundColor: currentTheme.cardColor,
                        color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827',
                        border: `1px solid ${currentTheme.borderColor}`,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                      }}
                    >
                      <div className="font-bold">{book.title}</div>
                      {book.author && (
                        <div className="text-[8px] opacity-70 mt-0.5">
                          by {book.author}
                        </div>
                      )}
                      {book.rating && (
                        <div className="flex gap-0.5 mt-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-2 h-2"
                              fill={i < book.rating ? '#fbbf24' : 'none'}
                              style={{ 
                                color: i < book.rating ? '#fbbf24' : currentTheme.borderColor,
                                strokeWidth: 2
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Show "+N" if more than 4 books */}
            {booksForDay.length > 4 && (
              <div 
                className="text-[8px] font-bold text-center mt-0.5"
                style={{ color: currentTheme.accentColor }}
              >
                +{booksForDay.length - 4}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Customizer Toolbar */}
      <CalendarCustomizer
        calendarRef={calendarRef}
        onBackgroundChange={setCustomBackground}
        currentBackground={customBackground}
        calendarName={`${monthNames[month]}-${year}`}
      />

      <div className="space-y-3" ref={calendarRef}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 
            className="text-xl font-bold"
            style={{ color: textColor }}
          >
            {monthNames[month]} {year}
          </h2>
          
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousMonth}
              className="p-1.5 rounded-lg transition-all hover:scale-110"
              style={{
                backgroundColor: `${currentTheme.accentColor}20`,
                color: currentTheme.accentColor,
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {!isCurrentMonth() && (
              <button
                onClick={goToCurrentMonth}
                className="text-[10px] font-semibold hover:underline px-2"
                style={{ color: currentTheme.accentColor }}
              >
                Today
              </button>
            )}
            
            <button
              onClick={goToNextMonth}
              className="p-1.5 rounded-lg transition-all hover:scale-110"
              style={{
                backgroundColor: `${currentTheme.accentColor}20`,
                color: currentTheme.accentColor,
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Calendar Card */}
        <div 
          className="rounded-xl p-3"
          style={getBackgroundStyle()}
        >
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, idx) => (
              <div 
                key={day} 
                className="text-center text-[9px] font-semibold py-0.5"
                style={{ 
                  color: customBackground && customBackground.value
                    ? (idx === 0 ? '#ff6b6b' : '#ffffff') // Red Sunday, white others on custom backgrounds
                    : (idx === 0 ? '#ef4444' : mutedColor)  // Default colors
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="overflow-auto max-h-[60vh]">
            <div className="grid grid-cols-7 gap-1">
              {dayCells}
            </div>
          </div>
        </div>

        {/* Stats for current view */}
        <div className="grid grid-cols-2 gap-3">
          <div 
            className="rounded-xl p-4"
            style={{ backgroundColor: currentTheme.cardColor }}
          >
            <div 
              className="text-2xl font-bold mb-1"
              style={{ color: textColor }}
            >
              {Object.keys(booksByDate)
                .filter(key => {
                  const [y, m] = key.split('-').map(Number);
                  return y === year && m === month + 1;
                })
                .reduce((sum, key) => sum + (finishedBooksByDate[key]?.length || 0), 0)}
            </div>
            <div 
              className="text-xs"
              style={{ color: mutedColor }}
            >
              Books finished
            </div>
          </div>
          
          <div 
            className="rounded-xl p-4"
            style={{ backgroundColor: currentTheme.cardColor }}
          >
            <div 
              className="text-2xl font-bold mb-1"
              style={{ color: textColor }}
            >
              {Object.keys(booksByDate)
                .filter(key => {
                  const [y, m] = key.split('-').map(Number);
                  return y === year && m === month + 1 && booksByDate[key].length > 0;
                })
                .length}
            </div>
            <div 
              className="text-xs"
              style={{ color: mutedColor }}
            >
              Reading days
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
