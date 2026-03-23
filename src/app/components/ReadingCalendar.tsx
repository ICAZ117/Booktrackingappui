import { useMemo, useState, useEffect, useRef } from 'react';
import { useBooks } from '../contexts/BooksContext';
import { useTheme } from '../contexts/ThemeContext';
import { Calendar as CalendarIcon, Download, Share2, Star, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

// Background options for Stats View
const backgroundOptions = [
  { id: 'white', name: 'Clean White', type: 'solid', value: '#ffffff' },
  { id: 'pink', name: 'Pink Dreams', type: 'gradient', value: 'linear-gradient(135deg, #ffc6d9 0%, #ffa8c5 100%)' },
  { id: 'lavender', name: 'Lavender Fields', type: 'gradient', value: 'linear-gradient(135deg, #dcd6f7 0%, #c9b8ff 100%)' },
  { id: 'mint', name: 'Mint Fresh', type: 'gradient', value: 'linear-gradient(135deg, #b8f4d5 0%, #8ee7b8 100%)' },
  { id: 'peach', name: 'Peachy Keen', type: 'gradient', value: 'linear-gradient(135deg, #ffd4b8 0%, #ffb88c 100%)' },
  { id: 'blue', name: 'Ocean Breeze', type: 'gradient', value: 'linear-gradient(135deg, #b8e7ff 0%, #8dd4ff 100%)' },
  { id: 'sunset', name: 'Sunset Glow', type: 'gradient', value: 'linear-gradient(135deg, #ffd6a5 0%, #ffb871 100%)' },
  { id: 'midnight', name: 'Midnight Sky', type: 'gradient', value: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)' },
  { id: 'cherry', name: 'Cherry Blossom', type: 'gradient', value: 'linear-gradient(135deg, #ffeef8 0%, #ffcce3 50%, #ffa6d5 100%)' },
  { id: 'emerald', name: 'Emerald Dream', type: 'gradient', value: 'linear-gradient(135deg, #a8edea 0%, #6dd5b9 50%, #209f84 100%)' },
  { id: 'cosmic', name: 'Cosmic Purple', type: 'gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' },
  { id: 'autumn', name: 'Autumn Leaves', type: 'gradient', value: 'linear-gradient(135deg, #ff9a56 0%, #ff6f47 50%, #d84a39 100%)' },
];

// Utility function to extract dominant color from an image
const extractDominantColor = (imgSrc: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imgSrc;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve('#1f2937'); // Fallback color
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      try {
        // Sample pixels from the image
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Calculate average color (simple approach)
        let r = 0, g = 0, b = 0;
        const sampleSize = 10; // Sample every 10th pixel for performance
        let count = 0;
        
        for (let i = 0; i < data.length; i += 4 * sampleSize) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        
        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);
        
        // Darken the color a bit for better contrast
        r = Math.floor(r * 0.7);
        g = Math.floor(g * 0.7);
        b = Math.floor(b * 0.7);
        
        resolve(`rgb(${r}, ${g}, ${b})`);
      } catch (e) {
        // If we get a CORS error, use a fallback
        resolve('#1f2937');
      }
    };
    
    img.onerror = () => {
      resolve('#1f2937'); // Fallback color
    };
  });
};

// Generate vibrant color from book data (hash-based)
const generateBookColor = (book: any): string => {
  const str = `${book.title}${book.author}${book.id}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Generate vibrant colors with good saturation and lightness
  const hue = Math.abs(hash % 360);
  const saturation = 65 + (Math.abs(hash) % 20); // 65-85%
  const lightness = 45 + (Math.abs(hash >> 8) % 15); // 45-60%
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// Component for book with color-matched rating
function BookWithRating({ book, onClick }: { book: any; onClick?: () => void }) {
  const [bgColor, setBgColor] = useState('#6b7280'); // Default gray
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchColor = async () => {
      if (!book.cover) {
        setBgColor('#6b7280');
        setIsLoading(false);
        return;
      }
      
      console.log(`🎨 [Frontend] Requesting color for: ${book.title}`);
      
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
          console.log(`✅ [Frontend] Got color for "${book.title}": ${data.color} (source: ${data.source || 'extracted'})`);
          setBgColor(data.color);
        } else {
          const errorText = await response.text();
          console.error(`❌ [Frontend] Server error for "${book.title}":`, response.status, errorText);
          // Fallback to hash-based color if server fails
          setBgColor(generateBookColor(book));
        }
      } catch (error) {
        console.error(`❌ [Frontend] Network error for "${book.title}":`, error);
        setBgColor(generateBookColor(book));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchColor();
  }, [book.cover, book.id]);
  
  return (
    <div className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity" onClick={onClick}>
      {/* Book Cover - Square edges */}
      <div 
        className="w-full overflow-hidden shadow-md mb-1.5 border border-gray-200"
        style={{ aspectRatio: '2/3' }}
      >
        {book.cover ? (
          <img 
            src={book.cover} 
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center p-2">
            <span className="text-xs text-gray-700 font-bold text-center leading-tight">
              {book.title.slice(0, 20)}
            </span>
          </div>
        )}
      </div>
      
      {/* Numeric Rating in colored rectangle */}
      {book.rating && (
        <div 
          className="w-full px-1 py-0.5 flex items-center justify-center gap-0.5 transition-colors duration-300"
          style={{ backgroundColor: isLoading ? '#e5e7eb' : bgColor }}
        >
          <span className="text-white font-bold text-[8px]">
            {book.rating.toFixed(2)}
          </span>
          <svg 
            className="w-1.5 h-1.5 flex-shrink-0" 
            viewBox="0 0 24 24" 
            fill="#fbbf24"
            stroke="none"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>
      )}
    </div>
  );
}

export function ReadingCalendar({ onBookSelect }: { onBookSelect?: (book: any) => void }) {
  const { books, readingSessions } = useBooks();
  const { currentTheme } = useTheme();
  const calendarRef = useRef<HTMLDivElement>(null);
  const [customBackground, setCustomBackground] = useState<any>(backgroundOptions[0]); // Default to white
  const [showBackgroundPicker, setShowBackgroundPicker] = useState(false);

  // Current year and selected month (user can click to change)
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentRealMonth = now.getMonth() + 1; // 1-indexed - today's actual month
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1); // Start with current month
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Get books finished in each month
  const monthlyActivity = useMemo(() => {
    const finishedBooks = books.filter((b: any) => b.status === 'finished');
    const activity: { [key: number]: number } = {};
    
    finishedBooks.forEach((book: any) => {
      if (book.finishDate || book.dateRead) {
        const date = new Date(book.finishDate || book.dateRead);
        if (date.getFullYear() === currentYear) {
          const month = date.getMonth();
          activity[month] = (activity[month] || 0) + 1;
        }
      }
    });
    
    return activity;
  }, [books]);

  // Generate calendar for selected month showing book covers
  const calendarDays = useMemo(() => {
    const finishedBooks = books.filter((b: any) => b.status === 'finished');
    const daysInMonth = new Date(currentYear, selectedMonth, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, selectedMonth - 1, 1).getDay();
    
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ type: 'empty', day: null, books: [] });
    }
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Find books finished on this day
      const finishedOnDay = finishedBooks.filter((book: any) => {
        if (!book.finishDate && !book.dateRead) return false;
        const finishDate = new Date(book.finishDate || book.dateRead);
        const bookDateStr = `${finishDate.getFullYear()}-${String(finishDate.getMonth() + 1).padStart(2, '0')}-${String(finishDate.getDate()).padStart(2, '0')}`;
        return bookDateStr === dateStr;
      });
      
      // Check if there was reading activity via reading sessions
      const hadReadingSession = readingSessions.some((session: any) => {
        const sessionDate = session.date.split('T')[0]; // Get just the date part
        return sessionDate === dateStr;
      });
      
      let booksToShow = [...finishedOnDay];
      
      // If no finished books but there was reading activity, show currently reading books with covers
      if (booksToShow.length === 0 && hadReadingSession) {
        // Get currently reading books (with covers)
        const currentlyReading = books.filter((b: any) => 
          b.status === 'reading' && b.cover
        );
        
        // If there are currently reading books, show up to 2 of them
        if (currentlyReading.length > 0) {
          booksToShow = currentlyReading.slice(0, 2);
        }
      }
      
      days.push({
        type: 'day',
        day,
        books: booksToShow,
        hadActivity: hadReadingSession || finishedOnDay.length > 0,
      });
    }
    
    return days;
  }, [books, readingSessions, currentYear, selectedMonth]);

  // Calculate streak and stats
  const stats = useMemo(() => {
    // Get all dates in selected month where reading happened via reading sessions
    const daysInMonth = new Date(currentYear, selectedMonth, 0).getDate();
    const readingDatesInMonth: string[] = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(selectedMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Check if there was a reading session on this day
      const hadReadingSession = readingSessions.some((session: any) => {
        const sessionDate = session.date.split('T')[0];
        return sessionDate === dateStr;
      });
      
      // Check if a book was finished
      const hadBookFinish = books.some((b: any) => {
        if (b.status !== 'finished' || (!b.finishDate && !b.dateRead)) return false;
        const finishDate = new Date(b.finishDate || b.dateRead);
        const bookDateStr = `${finishDate.getFullYear()}-${String(finishDate.getMonth() + 1).padStart(2, '0')}-${String(finishDate.getDate()).padStart(2, '0')}`;
        return bookDateStr === dateStr;
      });
      
      if (hadReadingSession || hadBookFinish) {
        readingDatesInMonth.push(dateStr);
      }
    }
    
    // Calculate best streak within this month
    const sortedDates = readingDatesInMonth.sort();
    let bestStreak = 0;
    let currentStreak = 0;
    
    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0 || isConsecutiveDay(sortedDates[i - 1], sortedDates[i])) {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    
    // Calculate total pages and books read this month
    const finishedBooksInMonth = books.filter((b: any) => {
      if (b.status !== 'finished' || (!b.finishDate && !b.dateRead)) return false;
      const finishDate = new Date(b.finishDate || b.dateRead);
      return finishDate.getFullYear() === currentYear && 
             finishDate.getMonth() === selectedMonth - 1;
    });
    
    const totalPages = finishedBooksInMonth.reduce((sum: number, book: any) => {
      return sum + (book.pages || 0);
    }, 0);
    
    return {
      bestStreak,
      daysRead: readingDatesInMonth.length,
      totalBooks: finishedBooksInMonth.length,
      totalPages,
      finishedBooks: finishedBooksInMonth,
    };
  }, [books, readingSessions, currentYear, selectedMonth]);

  function isConsecutiveDay(date1: string, date2: string): boolean {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays === 1;
  }

  const handleDownload = async () => {
    if (!calendarRef.current) return;

    try {
      // Use html2canvas with allowTaint to handle Google Books CORS images
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(calendarRef.current, {
        backgroundColor: null, // Preserve background
        scale: 2, // Higher quality
        allowTaint: true, // Allow cross-origin images
        useCORS: false, // Don't try CORS (Google Books doesn't support it)
        logging: false, // Suppress console logs
      });
      
      // Download as image
      const link = document.createElement('a');
      link.download = `ReadTrack-Stats-${monthNames[selectedMonth - 1]}-${currentYear}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Error downloading calendar:', error);
      alert('Unable to download calendar. Please try again.');
    }
  };

  const handleShare = async () => {
    if (!calendarRef.current) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(calendarRef.current, {
        backgroundColor: null,
        scale: 2,
        allowTaint: true,
        useCORS: false,
        logging: false,
      });
      
      // Convert to blob
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        const file = new File([blob], `ReadTrack-Stats-${monthNames[selectedMonth - 1]}-${currentYear}.png`, { type: 'image/png' });
        
        // Try to use Web Share API
        if (navigator.share && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `My ${monthNames[selectedMonth - 1]} Reading Calendar`,
            text: `I read ${stats.totalBooks} books and ${stats.totalPages.toLocaleString()} pages in ${monthNames[selectedMonth - 1]}! 📚`,
          });
        } else {
          // Fallback: just download
          handleDownload();
        }
      });
    } catch (error) {
      console.error('Error sharing calendar:', error);
      // Fallback to download
      handleDownload();
    }
  };

  const getBackgroundStyle = () => {
    if (customBackground && customBackground.value) {
      return { background: customBackground.value };
    }
    return { backgroundColor: '#ffffff' };
  };

  return (
    <div className="space-y-4">
      {/* Simple Toolbar - No CalendarCustomizer */}
      <div className="flex items-center justify-end gap-2">
        {/* Background Picker Button */}
        <button
          onClick={() => setShowBackgroundPicker(!showBackgroundPicker)}
          className="p-2.5 rounded-xl bg-white border border-gray-200 hover:scale-105 transition-all"
          title="Customize background"
        >
          <Palette className="w-4 h-4 text-gray-700" />
        </button>
      </div>

      {/* Background Picker Modal */}
      <AnimatePresence>
        {showBackgroundPicker && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setShowBackgroundPicker(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-2xl p-6 z-50 max-w-md w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Choose Background</h3>
                <button
                  onClick={() => setShowBackgroundPicker(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <span className="text-gray-500 text-xl">×</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {backgroundOptions.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => {
                      setCustomBackground(bg);
                      setShowBackgroundPicker(false);
                    }}
                    className="relative rounded-xl p-4 text-left transition-all hover:scale-105 border-2"
                    style={{
                      background: bg.value,
                      borderColor: customBackground?.id === bg.id ? '#3b82f6' : 'transparent',
                      boxShadow: customBackground?.id === bg.id 
                        ? '0 0 0 2px #3b82f6' 
                        : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div className="text-gray-900 font-semibold text-sm">
                      {bg.name}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="rounded-2xl px-1 py-5 border border-gray-100 shadow-sm" ref={calendarRef} style={getBackgroundStyle()}>
        <div className="flex items-center justify-between mb-4 px-3">
          <h3 className="text-sm font-bold text-gray-900">📅 Reading Streaks</h3>
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 hover:from-pink-100 hover:to-rose-100 transition-all group"
              title="Share calendar"
            >
              <Share2 className="w-4 h-4 text-pink-600 group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 hover:from-blue-100 hover:to-indigo-100 transition-all group"
              title="Download calendar"
            >
              <Download className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        <div id="reading-calendar-content">
          {/* Books & Pages Read Card */}
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-4 mb-4 border border-pink-100 mx-3">
            <div className="text-xs font-bold text-gray-700 mb-3">{monthNames[selectedMonth - 1]} Reading Stats</div>
            <div className="flex justify-around">
              <div className="text-center">
                <div 
                  className="text-3xl font-bold mb-1"
                  style={{ 
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {stats.totalBooks}
                </div>
                <div className="text-xs text-gray-600">Books read</div>
              </div>
              <div className="text-center">
                <div 
                  className="text-3xl font-bold mb-1"
                  style={{ 
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {stats.totalPages.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Pages read</div>
              </div>
            </div>
          </div>

          {/* Scrollable Month Pills - All 12 months, color-coded for past/current/future */}
          <div className="mb-4 overflow-x-auto pb-2 px-3" style={{ scrollbarWidth: 'thin' }}>
            <div className="flex gap-2" style={{ minWidth: 'min-content' }}>
              {monthNames.map((month, index) => {
                const monthNum = index + 1;
                const isPast = monthNum < currentRealMonth;
                const isCurrent = monthNum === currentRealMonth;
                const isFuture = monthNum > currentRealMonth;
                const hasActivity = monthlyActivity[index] !== undefined;
                const isSelected = selectedMonth === monthNum;
                
                // Color coding
                let bgStyle: any;
                if (isSelected) {
                  bgStyle = { background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)' };
                } else if (isPast) {
                  bgStyle = { background: hasActivity ? 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)' : '#f3f4f6' };
                } else if (isCurrent) {
                  bgStyle = { background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' };
                } else {
                  bgStyle = { background: '#e5e7eb' };
                }
                
                return (
                  <button
                    key={month}
                    onClick={() => setSelectedMonth(monthNum)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all hover:scale-105 flex-shrink-0"
                    style={{ 
                      ...bgStyle,
                      color: (isFuture && !isSelected) ? '#6b7280' : 'white',
                      opacity: isSelected ? 1 : (isFuture ? 0.6 : 0.9),
                    }}
                  >
                    {month.substring(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="mb-4 px-1">
            <h4 className="text-xs font-bold text-gray-700 mb-3 px-2">{monthNames[selectedMonth - 1]} {currentYear}</h4>
            
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={i} className="text-center text-[10px] font-semibold text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-0.5">
              {calendarDays.map((dayData, i) => {
                if (dayData.type === 'empty') {
                  return <div key={`empty-${i}`} style={{ paddingBottom: '140%' }} />; 
                }

                const hasBooks = dayData.books && dayData.books.length > 0;
                const firstBook = hasBooks ? dayData.books[0] : null;
                const bookCover = firstBook?.cover || null;
                const hadActivity = dayData.hadActivity;

                return (
                  <div
                    key={i}
                    className="rounded-md flex items-center justify-center text-[9px] font-semibold relative overflow-hidden border border-gray-200"
                    style={{
                      paddingBottom: '140%',
                      backgroundColor: dayData.day 
                        ? hadActivity
                          ? bookCover 
                            ? '#ffffff' // Pure white for days with book covers
                            : '#f0fdf4' // Very subtle green tint for reading days
                          : '#ffffff' // White for days without reading
                        : 'transparent',
                    }}
                  >
                    {dayData.day && bookCover ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className="absolute inset-0"
                      >
                        <img 
                          src={bookCover} 
                          alt={`Book ${dayData.day}`} 
                          className="w-full h-full object-cover rounded-md"
                        />
                        <div className="absolute top-0 left-0 bg-black/70 text-white text-[7px] font-bold px-1 py-0.5 rounded-br">
                          {dayData.day}
                        </div>
                      </motion.div>
                    ) : (
                      dayData.day && (
                        <span className={hadActivity ? 'text-gray-700' : 'text-gray-400'}>
                          {dayData.day}
                        </span>
                      )
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 mt-3 text-[10px]">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#f0fdf4', border: '1px solid #e5e7eb' }}></div>
                <span className="text-gray-600">Days read</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}></div>
                <span className="text-gray-600">No reading</span>
              </div>
            </div>
          </div>

          {/* Reader insight */}
          <div className="mt-4 pt-4 border-t border-gray-100 px-3">
            <h4 className="text-xs font-bold text-gray-700 mb-3">Books Finished This Month</h4>
            {stats.finishedBooks.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">No books finished this month yet.</p>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                {stats.finishedBooks.map((book: any) => (
                  <BookWithRating key={book.id} book={book} onClick={() => {
                    if (onBookSelect) {
                      onBookSelect(book);
                    }
                  }} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}