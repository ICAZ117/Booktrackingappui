import { useMemo, useState, useRef, useEffect } from 'react';
import { useBooks } from '../contexts/BooksContext';
import { Download, Share2 } from 'lucide-react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface TimelineCalendarProps {
  onBookSelect?: (book: any) => void;
}

export function TimelineCalendar({ onBookSelect }: TimelineCalendarProps) {
  const { books, readingSessions } = useBooks();
  const calendarRef = useRef<HTMLDivElement>(null);
  const [bookColors, setBookColors] = useState<{ [bookId: string]: string }>({});
  
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [currentYear] = useState(now.getFullYear());
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  // Calculate timeline data for the selected month
  const timelineData = useMemo(() => {
    const daysInMonth = new Date(currentYear, selectedMonth, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, selectedMonth - 1, 1).getDay();
    // Adjust for Monday start (0 = Sunday, need to make Monday = 0)
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    
    // Get finished books in this month
    const finishedBooksInMonth = books.filter((b: any) => {
      if (b.status !== 'finished' || (!b.finishDate && !b.dateRead)) return false;
      const finishDate = new Date(b.finishDate || b.dateRead);
      return finishDate.getFullYear() === currentYear && finishDate.getMonth() === selectedMonth - 1;
    });

    // Calculate pages read per day and book timelines
    const dailyPages: { [key: number]: number } = {};
    const bookTimelines: any[] = [];

    finishedBooksInMonth.forEach((book: any) => {
      const startDate = book.startDate ? new Date(book.startDate) : null;
      const finishDate = new Date(book.finishDate || book.dateRead);
      
      // Calculate which days this book was read
      let startDay = 1;
      let endDay = finishDate.getDate();
      
      if (startDate && startDate.getMonth() === selectedMonth - 1 && startDate.getFullYear() === currentYear) {
        startDay = startDate.getDate();
      }
      
      // Calculate pages per day
      const totalPages = book.pages || 0;
      const daysRead = endDay - startDay + 1;
      const pagesPerDay = Math.floor(totalPages / daysRead);
      
      for (let day = startDay; day <= endDay; day++) {
        dailyPages[day] = (dailyPages[day] || 0) + pagesPerDay;
      }
      
      bookTimelines.push({
        book,
        startDay,
        endDay,
        totalPages,
      });
    });

    // Build calendar grid (weeks)
    const weeks: any[][] = [];
    let currentWeek: any[] = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < adjustedFirstDay; i++) {
      currentWeek.push({ type: 'empty', day: null });
    }
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push({
        type: 'day',
        day,
        pages: dailyPages[day] || 0,
        dayOfWeek: (adjustedFirstDay + day - 1) % 7,
      });
      
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    
    // Fill last week if needed
    while (currentWeek.length > 0 && currentWeek.length < 7) {
      currentWeek.push({ type: 'empty', day: null });
    }
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    // Find max pages and day with most pages
    let maxPages = 0;
    let maxPagesDay = 0;
    Object.entries(dailyPages).forEach(([day, pages]) => {
      if (pages > maxPages) {
        maxPages = pages;
        maxPagesDay = parseInt(day);
      }
    });

    return {
      weeks,
      bookTimelines,
      finishedBooksInMonth,
      maxPages,
      maxPagesDay,
      dailyPages,
      daysInMonth,
      adjustedFirstDay,
    };
  }, [books, selectedMonth, currentYear]);

  useEffect(() => {
    const fetchColors = async () => {
      const colors: { [bookId: string]: string } = {};
      
      // Fetch colors for all books in parallel
      await Promise.all(
        timelineData.finishedBooksInMonth.map(async (book: any) => {
          if (!book.cover) {
            // Fallback for books without covers
            colors[book.id] = '#6b7280';
            return;
          }
          
          try {
            const response = await fetch(
              `https://${projectId}.supabase.co/functions/v1/make-server-14217f91/extract-color`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${publicAnonKey}`,
                },
                body: JSON.stringify({ imageUrl: book.cover }),
              }
            );
            
            if (response.ok) {
              const data = await response.json();
              colors[book.id] = data.color;
              console.log(`✅ [Timeline] Got color for "${book.title}": ${data.color}`);
            } else {
              // Fallback to gray
              colors[book.id] = '#6b7280';
            }
          } catch (error) {
            console.error(`❌ [Timeline] Error fetching color for "${book.title}":`, error);
            colors[book.id] = '#6b7280';
          }
        })
      );
      
      setBookColors(colors);
    };
    
    fetchColors();
  }, [timelineData.finishedBooksInMonth]);

  const handleDownload = async () => {
    if (!calendarRef.current) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(calendarRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        allowTaint: true,
        useCORS: false,
        logging: false,
      });
      
      const link = document.createElement('a');
      link.download = `ReadTrack-Timeline-${monthNames[selectedMonth - 1]}-${currentYear}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error downloading calendar:', error);
    }
  };

  const handleShare = async () => {
    if (!calendarRef.current) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(calendarRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        allowTaint: true,
        useCORS: false,
        logging: false,
      });
      
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        const file = new File([blob], `ReadTrack-Timeline-${monthNames[selectedMonth - 1]}-${currentYear}.png`, { type: 'image/png' });
        
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `My ${monthNames[selectedMonth - 1]} Reading Timeline`,
            text: `I read ${timelineData.finishedBooksInMonth.length} books in ${monthNames[selectedMonth - 1]}! 📚`,
          });
        } else {
          handleDownload();
        }
      });
    } catch (error) {
      console.error('Error sharing calendar:', error);
      handleDownload();
    }
  };

  return (
    <div className="space-y-4">
      {/* Month Pills */}
      <div className="overflow-x-auto pb-2 px-1" style={{ scrollbarWidth: 'thin' }}>
        <div className="flex gap-2" style={{ minWidth: 'min-content' }}>
          {monthNames.map((month, index) => {
            const monthNum = index + 1;
            const isSelected = selectedMonth === monthNum;
            
            return (
              <button
                key={month}
                onClick={() => setSelectedMonth(monthNum)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all hover:scale-105 flex-shrink-0"
                style={{ 
                  background: isSelected 
                    ? 'linear-gradient(135deg, #3298ff 0%, #f83aef 100%)' 
                    : '#e5e7eb',
                  color: isSelected ? 'white' : '#6b7280',
                }}
              >
                {month.substring(0, 3)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Share/Download buttons */}
      <div className="flex justify-end gap-2">
        <button
          onClick={handleShare}
          className="px-3 py-1.5 rounded-lg bg-white hover:bg-gray-50 border border-gray-300 flex items-center gap-1.5 text-xs font-semibold text-gray-700 transition-all shadow-sm"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share
        </button>
        <button
          onClick={handleDownload}
          className="px-3 py-1.5 rounded-lg bg-white hover:bg-gray-50 border border-gray-300 flex items-center gap-1.5 text-xs font-semibold text-gray-700 transition-all shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </button>
      </div>

      {/* Timeline Calendar */}
      <div 
        ref={calendarRef}
        className="bg-white rounded-lg border border-gray-200 overflow-hidden"
      >
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-sm font-bold text-gray-900 py-3 border-r border-gray-200 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid with timeline */}
        <div className="relative">
          {timelineData.weeks.map((week, weekIdx) => (
            <div key={weekIdx} className="grid grid-cols-7 border-b border-gray-200 last:border-b-0 relative" style={{ minHeight: '110px' }}>
              {/* Day cells */}
              {week.map((dayData: any, dayIdx: number) => {
                if (dayData.type === 'empty') {
                  return (
                    <div 
                      key={`empty-${dayIdx}`} 
                      className="border-r border-gray-200 last:border-r-0 bg-gray-50"
                    />
                  );
                }

                const isMostPages = dayData.day === timelineData.maxPagesDay && dayData.pages > 0;

                return (
                  <div
                    key={dayIdx}
                    className="border-r border-gray-200 last:border-r-0 p-2 relative"
                    style={{ minHeight: '110px' }}
                  >
                    {/* Day number - moved to top left and smaller */}
                    <div className="absolute top-1 left-1 text-[10px] font-semibold text-gray-500">
                      {dayData.day}
                    </div>

                    {/* Page count - moved to bottom right and always show */}
                    <div className="absolute bottom-1 right-1">
                      <div className="text-[10px] text-gray-600 flex items-center justify-center gap-0.5">
                        {isMostPages && dayData.pages > 0 ? '🏆' : dayData.pages > 0 ? '📖' : '📖'} {dayData.pages || 0}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Book timeline bars and covers for this week */}
              {timelineData.bookTimelines.map((timeline: any, timelineIdx: number) => {
                const weekStartDay = weekIdx * 7 - timelineData.adjustedFirstDay + 1;
                const weekEndDay = weekStartDay + 6;

                // Check if this book's timeline intersects with this week
                if (timeline.endDay < weekStartDay || timeline.startDay > weekEndDay) {
                  return null;
                }

                // Calculate which columns this book spans in this week
                const startCol = Math.max(0, timeline.startDay - weekStartDay);
                const endCol = Math.min(6, timeline.endDay - weekStartDay);
                
                // Only render if within bounds
                if (startCol > 6 || endCol < 0) return null;

                const showCover = timeline.endDay >= weekStartDay && timeline.endDay <= weekEndDay;
                const coverCol = timeline.endDay - weekStartDay;

                const barColor = bookColors[timeline.book.id];

                return (
                  <div key={`timeline-${timeline.book.id}-${weekIdx}`}>
                    {/* Reading bar */}
                    <div
                      className="absolute pointer-events-none"
                      style={{
                        left: `${(startCol / 7) * 100}%`,
                        width: `${((endCol - startCol + 1) / 7) * 100}%`,
                        top: `${40 + (timelineIdx * 6)}px`,
                        height: '8px',
                        backgroundColor: barColor,
                        zIndex: 1,
                      }}
                    />

                    {/* Book cover at finish date */}
                    {showCover && timeline.book.cover && (
                      <div
                        className="absolute pointer-events-auto cursor-pointer hover:scale-110 transition-transform"
                        style={{
                          left: `${(coverCol / 7) * 100 + (1 / 14) * 100}%`,
                          transform: 'translateX(-50%)',
                          top: '19px',
                          width: '45px',
                          zIndex: 10 + timelineIdx,
                        }}
                        onClick={() => onBookSelect?.(timeline.book)}
                      >
                        <img
                          src={timeline.book.cover}
                          alt={timeline.book.title}
                          className="w-full h-auto shadow-lg border border-gray-300 rounded-sm"
                          style={{ aspectRatio: '2/3' }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Books finished this month */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex flex-wrap gap-3 justify-center">
            {timelineData.finishedBooksInMonth.map((book: any) => {
              const bookColor = bookColors[book.id];
              
              return (
                <div
                  key={book.id}
                  className="cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => onBookSelect?.(book)}
                >
                  <div style={{ width: '70px' }}>
                    {book.cover ? (
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-auto shadow-md border border-gray-300 rounded-sm mb-1"
                        style={{ aspectRatio: '2/3' }}
                      />
                    ) : (
                      <div 
                        className="w-full bg-gray-300 flex items-center justify-center p-2 rounded-sm mb-1"
                        style={{ aspectRatio: '2/3' }}
                      >
                        <span className="text-[8px] text-gray-700 font-bold text-center leading-tight">
                          {book.title.slice(0, 20)}
                        </span>
                      </div>
                    )}
                    
                    {/* Rating with book color */}
                    {book.rating > 0 && (
                      <div 
                        className="text-[10px] font-bold text-center px-2 py-0.5 rounded text-white"
                        style={{ 
                          backgroundColor: bookColor,
                        }}
                      >
                        {book.rating.toFixed(2)} ⭐
                      </div>
                    )}
                    
                    {book.status === 'reading' && (
                      <div 
                        className="text-[9px] font-bold text-center px-2 py-0.5 rounded text-white mt-1"
                        style={{ 
                          backgroundColor: bookColor,
                          opacity: 0.8,
                        }}
                      >
                        Reading
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-center gap-6 text-xs text-gray-600">
          <div className="flex items-center gap-1.5">
            <span>📖</span>
            <span>Pages Read</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>🏆</span>
            <span>Most Pages Read</span>
          </div>
        </div>
      </div>
    </div>
  );
}