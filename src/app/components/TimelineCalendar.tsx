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

  const fallbackColorForBook = (book: any) => {
    const source = `${book?.id || ''}|${book?.title || ''}|${book?.author || ''}`;
    let hash = 0;
    for (let i = 0; i < source.length; i += 1) {
      hash = source.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 62%, 46%)`;
  };

  const extractCoverColorInBrowser = async (imageUrl: string): Promise<string | null> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.referrerPolicy = 'no-referrer';

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const size = 28;
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (!ctx) {
            resolve(null);
            return;
          }

          ctx.drawImage(img, 0, 0, size, size);
          const { data } = ctx.getImageData(0, 0, size, size);

          // Bucket by hue to find the strongest vivid family.
          const bucketCount = 24;
          const buckets = new Array(bucketCount).fill(0).map(() => ({
            weight: 0,
            sat: 0,
            light: 0,
            count: 0,
          }));

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i] / 255;
            const g = data[i + 1] / 255;
            const b = data[i + 2] / 255;
            const a = data[i + 3] / 255;
            if (a < 0.4) continue;

            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const delta = max - min;
            const light = (max + min) / 2;

            // Skip near-neutral pixels (white/black/gray backgrounds).
            if (delta < 0.08 || light > 0.92 || light < 0.08) continue;

            let hue = 0;
            if (delta !== 0) {
              if (max === r) hue = ((g - b) / delta) % 6;
              else if (max === g) hue = (b - r) / delta + 2;
              else hue = (r - g) / delta + 4;
              hue *= 60;
              if (hue < 0) hue += 360;
            }

            const sat = delta / (1 - Math.abs(2 * light - 1) || 1);
            const bucketIndex = Math.max(0, Math.min(bucketCount - 1, Math.floor((hue / 360) * bucketCount)));
            const vividWeight = 0.35 + sat * 0.8 + (1 - Math.abs(light - 0.5)) * 0.25;

            buckets[bucketIndex].weight += vividWeight;
            buckets[bucketIndex].sat += sat;
            buckets[bucketIndex].light += light;
            buckets[bucketIndex].count += 1;
          }

          const best = buckets
            .map((bucket, index) => ({ bucket, index }))
            .filter(({ bucket }) => bucket.count > 0)
            .sort((a, b) => b.bucket.weight - a.bucket.weight)[0];

          if (!best) {
            resolve(null);
            return;
          }

          const avgSat = best.bucket.sat / best.bucket.count;
          const avgLight = best.bucket.light / best.bucket.count;
          const hueMid = ((best.index + 0.5) / bucketCount) * 360;
          const satPct = Math.round(Math.max(55, Math.min(88, avgSat * 100)));
          const lightPct = Math.round(Math.max(34, Math.min(56, avgLight * 100)));

          resolve(`hsl(${Math.round(hueMid)}, ${satPct}%, ${lightPct}%)`);
        } catch {
          resolve(null);
        }
      };

      img.onerror = () => resolve(null);
      img.src = imageUrl;
    });
  };

  const toDateOrNull = (raw?: string) => {
    if (!raw) return null;
    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  // Calculate timeline data for the selected month
  const timelineData = useMemo(() => {
    const daysInMonth = new Date(currentYear, selectedMonth, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, selectedMonth - 1, 1).getDay();
    const monthStart = new Date(currentYear, selectedMonth - 1, 1);
    const monthEnd = new Date(currentYear, selectedMonth - 1, daysInMonth, 23, 59, 59, 999);
    // Adjust for Monday start (0 = Sunday, need to make Monday = 0)
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    
    // Keep timeline readable: only show books finished in selected month
    const finishedBooksInMonth = books.filter((b: any) => {
      if (b.status !== 'finished') return false;
      const finish = toDateOrNull(b.finishDate || b.dateRead);
      if (!finish) return false;
      return finish >= monthStart && finish <= monthEnd;
    });

    // Bottom strip: also include currently-reading books relevant to this month.
    const currentlyReadingInMonth = books.filter((b: any) => {
      if (b.status !== 'reading' && b.status !== 'on-hold') return false;
      const start = toDateOrNull(b.startDate);
      if (!start) return false;
      return start <= monthEnd;
    });

    const booksForBottomStrip = Array.from(
      new Map(
        [...finishedBooksInMonth, ...currentlyReadingInMonth].map((book: any) => [book.id, book]),
      ).values(),
    );

    // Calculate pages read per day and book timelines
    const dailyPages: { [key: number]: number } = {};
    const bookTimelines: any[] = [];

    finishedBooksInMonth.forEach((book: any) => {
      const startDateRaw = toDateOrNull(book.startDate);
      const finishDateRaw = toDateOrNull(book.finishDate || book.dateRead);
      const hasFinishDate = true;
      if (!finishDateRaw) return;
      
      // Clamp timeline range to month boundaries.
      const clampedStart = startDateRaw && startDateRaw > monthStart ? startDateRaw : monthStart;
      const clampedEnd = finishDateRaw < monthEnd ? finishDateRaw : monthEnd;
      
      if (clampedEnd < monthStart || clampedStart > monthEnd) return;

      const startDay = Math.max(1, Math.min(daysInMonth, clampedStart.getDate()));
      const endDay = Math.max(startDay, Math.min(daysInMonth, clampedEnd.getDate()));
      
      // Calculate pages per day
      const totalPages = book.pages || 0;
      const daysRead = Math.max(1, endDay - startDay + 1);
      const pagesPerDay = Math.floor(totalPages / daysRead);
      
      for (let day = startDay; day <= endDay; day++) {
        dailyPages[day] = (dailyPages[day] || 0) + pagesPerDay;
      }
      
      bookTimelines.push({
        book,
        startDay,
        endDay,
        totalPages,
        hasFinishDate,
        startsInMonth: Boolean(
          startDateRaw &&
            startDateRaw.getFullYear() === currentYear &&
            startDateRaw.getMonth() === selectedMonth - 1,
        ),
        finishesInMonth: true,
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
      booksForBottomStrip,
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
            colors[book.id] = fallbackColorForBook(book);
            return;
          }
          
          try {
            // 1) Try browser-side extraction first (best visual match to the actual displayed cover).
            const browserColor = await extractCoverColorInBrowser(book.cover);
            if (browserColor) {
              colors[book.id] = browserColor;
              return;
            }

            // 2) Fallback to edge function extraction.
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
              colors[book.id] = data?.color || fallbackColorForBook(book);
              console.log(`✅ [Timeline] Got color for "${book.title}": ${data.color}`);
            } else {
              colors[book.id] = fallbackColorForBook(book);
            }
          } catch (error) {
            console.error(`❌ [Timeline] Error fetching color for "${book.title}":`, error);
            colors[book.id] = fallbackColorForBook(book);
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
              {(() => {
                const weekStartDay = weekIdx * 7 - timelineData.adjustedFirstDay + 1;
                const weekEndDay = weekStartDay + 6;
                const weekTimelines = timelineData.bookTimelines.filter((timeline: any) => {
                  return !(timeline.endDay < weekStartDay || timeline.startDay > weekEndDay);
                });
                const laneTopMin = 34;
                const laneTopMax = 66; // keep bars safely above page-count labels at the bottom

                return (
                  <>
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
              {weekTimelines.map((timeline: any, timelineIdx: number) => {
                // Calculate which columns this book spans in this week
                const startCol = Math.max(0, timeline.startDay - weekStartDay);
                const endCol = Math.min(6, timeline.endDay - weekStartDay);
                
                // Only render if within bounds
                if (startCol > 6 || endCol < 0) return null;

                const showCover = timeline.endDay >= weekStartDay && timeline.endDay <= weekEndDay;
                const coverCol = timeline.endDay - weekStartDay;
                const showStartMarker = timeline.startsInMonth && timeline.startDay >= weekStartDay && timeline.startDay <= weekEndDay;
                const startColMarker = timeline.startDay - weekStartDay;
                const showFinishMarker = timeline.finishesInMonth && timeline.endDay >= weekStartDay && timeline.endDay <= weekEndDay;
                const segmentStartsThisWeek = timeline.startDay >= weekStartDay && timeline.startDay <= weekEndDay;
                const segmentEndsThisWeek = timeline.endDay >= weekStartDay && timeline.endDay <= weekEndDay;

                const barColor = bookColors[timeline.book.id] || fallbackColorForBook(timeline.book);
                const laneSpan = laneTopMax - laneTopMin;
                const barTop =
                  weekTimelines.length <= 1
                    ? laneTopMin + laneSpan / 2
                    : laneTopMin + (timelineIdx * laneSpan) / (weekTimelines.length - 1);
                // If a segment continues from a prior week, start at the left edge of this week.
                // If it continues into next week, end at the right edge of this week.
                // True start/finish days still anchor to the center of their day cell.
                const startAnchor = segmentStartsThisWeek ? startCol + 0.5 : startCol;
                const endAnchor = segmentEndsThisWeek ? endCol + 0.5 : endCol + 1;
                const barLeftPercent = (startAnchor / 7) * 100;
                const barWidthPercent = Math.max(((endAnchor - startAnchor) / 7) * 100, 1.2);

                return (
                  <div key={`timeline-${timeline.book.id}-${weekIdx}`}>
                    {/* Reading bar */}
                    <div
                      className="absolute pointer-events-none"
                      style={{
                        left: `${barLeftPercent}%`,
                        width: `${barWidthPercent}%`,
                        top: `${barTop}px`,
                        height: '8px',
                        backgroundColor: barColor,
                        opacity: 0.9,
                        borderRadius: '999px',
                        zIndex: 1,
                      }}
                    />

                    {/* Start marker */}
                    {showStartMarker && (
                      <div
                        className="absolute pointer-events-none"
                        style={{
                          left: `${((startColMarker + 0.5) / 7) * 100}%`,
                          top: `${barTop - 2}px`,
                          width: '11px',
                          height: '11px',
                          borderRadius: '999px',
                          backgroundColor: '#ffffff',
                          border: `2px solid ${barColor}`,
                          transform: 'translateX(-50%)',
                          zIndex: 4,
                        }}
                      />
                    )}

                    {/* Finish marker */}
                    {showFinishMarker && (
                      <div
                        className="absolute pointer-events-none"
                        style={{
                          left: `${((coverCol + 0.5) / 7) * 100}%`,
                          top: `${barTop - 4}px`,
                          width: '9px',
                          height: '9px',
                          backgroundColor: barColor,
                          border: '1px solid #ffffff',
                          transform: 'translateX(-50%) rotate(45deg)',
                          zIndex: 4,
                        }}
                      />
                    )}

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
                  </>
                );
              })()}
            </div>
          ))}
        </div>

        {/* Books in this timeline month */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex flex-wrap gap-3 justify-center">
            {timelineData.booksForBottomStrip.map((book: any) => {
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
                    
                    {(book.status === 'reading' || book.status === 'on-hold') && (
                      <div 
                        className="text-[9px] font-bold text-center px-2 py-1 rounded-sm text-white mt-1 border"
                        style={{ 
                          backgroundColor: bookColor,
                          borderColor: '#ffffff80',
                        }}
                      >
                        Currently Reading
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
          <div className="flex items-center gap-1.5">
            <span>◯</span>
            <span>Started</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>◆</span>
            <span>Finished</span>
          </div>
        </div>
      </div>
    </div>
  );
}
