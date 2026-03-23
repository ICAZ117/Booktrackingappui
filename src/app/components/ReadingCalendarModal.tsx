import { X, Calendar, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ReadingCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  readingHistory: { [date: string]: boolean }; // Format: "2026-03-01" -> true/false
  onSave: (history: { [date: string]: boolean }) => void;
}

export function ReadingCalendarModal({ isOpen, onClose, readingHistory, onSave }: ReadingCalendarModalProps) {
  const { currentTheme } = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDays, setSelectedDays] = useState<{ [date: string]: boolean }>(readingHistory);

  const getGradientBg = () => {
    return currentTheme.isGradient
      ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
      : currentTheme.primary;
  };

  // Get days in month
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

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const toggleDay = (day: number) => {
    const dateKey = formatDateKey(year, month, day);
    const today = new Date();
    const selectedDate = new Date(year, month, day);
    
    // Don't allow selecting future dates
    if (selectedDate > today) return;

    setSelectedDays(prev => ({
      ...prev,
      [dateKey]: !prev[dateKey]
    }));
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    const today = new Date();
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
    
    // Don't allow going beyond current month
    if (nextMonth.getFullYear() > today.getFullYear() || 
        (nextMonth.getFullYear() === today.getFullYear() && nextMonth.getMonth() > today.getMonth())) {
      return;
    }
    
    setCurrentMonth(nextMonth);
  };

  const handleSave = () => {
    onSave(selectedDays);
    onClose();
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  };

  const isFutureDate = (day: number) => {
    const today = new Date();
    const checkDate = new Date(year, month, day);
    return checkDate > today;
  };

  const canGoNext = () => {
    const today = new Date();
    return currentMonth.getFullYear() < today.getFullYear() || 
           (currentMonth.getFullYear() === today.getFullYear() && currentMonth.getMonth() < today.getMonth());
  };

  // Create array of day cells (including empty cells for alignment)
  const dayCells = [];
  
  // Add empty cells for days before month starts (0 = Sunday, so no offset needed)
  for (let i = 0; i < startingDayOfWeek; i++) {
    dayCells.push(<div key={`empty-${i}`} className="h-12" />);
  }
  
  // Add actual day cells
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = formatDateKey(year, month, day);
    const isSelected = selectedDays[dateKey];
    const isTodayDate = isToday(day);
    const isFuture = isFutureDate(day);
    
    dayCells.push(
      <motion.button
        key={day}
        whileHover={!isFuture ? { scale: 1.05 } : {}}
        whileTap={!isFuture ? { scale: 0.95 } : {}}
        onClick={() => !isFuture && toggleDay(day)}
        disabled={isFuture}
        className={`h-12 rounded-lg flex flex-col items-center justify-center relative transition-all ${
          isFuture ? 'cursor-not-allowed opacity-30' : 'cursor-pointer'
        }`}
        style={{
          backgroundColor: isSelected 
            ? currentTheme.successColor 
            : isTodayDate 
            ? `${currentTheme.accentColor}20` 
            : (currentTheme.textColor === 'light' ? '#374151' : '#f3f4f6'),
          ...(isTodayDate && !isSelected && { 
            borderWidth: '2px', 
            borderColor: currentTheme.accentColor, 
            borderStyle: 'solid' 
          }),
        }}
      >
        <span 
          className="text-sm font-semibold"
          style={{ 
            color: isSelected 
              ? '#ffffff' 
              : isTodayDate 
              ? currentTheme.accentColor 
              : (currentTheme.textColor === 'light' ? '#d1d5db' : '#4b5563')
          }}
        >
          {day}
        </span>
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Check className="w-5 h-5 text-white" />
          </motion.div>
        )}
        {isTodayDate && (
          <span 
            className="text-[8px] font-bold"
            style={{ color: isSelected ? '#ffffff' : currentTheme.accentColor }}
          >
            Today
          </span>
        )}
      </motion.button>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
              style={{
                backgroundColor: currentTheme.cardColor,
                borderColor: currentTheme.borderColor,
                borderWidth: '1px',
              }}
            >
              {/* Header */}
              <div 
                className="p-6 text-white relative"
                style={{
                  background: getGradientBg(),
                }}
              >
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-6 h-6" />
                  <h2 className="text-xl font-bold">Edit Reading History</h2>
                </div>
                <p className="text-sm text-white/80">
                  Mark the days you read to keep your streak accurate
                </p>
              </div>

              {/* Calendar Body */}
              <div className="p-6">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={goToPreviousMonth}
                    className="p-2 rounded-lg hover:bg-opacity-80 transition-all"
                    style={{
                      backgroundColor: `${currentTheme.accentColor}20`,
                      color: currentTheme.accentColor,
                    }}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <h3 
                    className="text-lg font-bold"
                    style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
                  >
                    {monthNames[month]} {year}
                  </h3>
                  
                  <button
                    onClick={goToNextMonth}
                    disabled={!canGoNext()}
                    className="p-2 rounded-lg hover:bg-opacity-80 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: `${currentTheme.accentColor}20`,
                      color: currentTheme.accentColor,
                    }}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div 
                      key={day} 
                      className="text-center text-xs font-semibold"
                      style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2 mb-6">
                  {dayCells}
                </div>

                {/* Stats */}
                <div 
                  className="rounded-xl p-4 mb-4"
                  style={{
                    backgroundColor: `${currentTheme.accentColor}10`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span 
                      className="text-sm font-semibold"
                      style={{ color: currentTheme.textColor === 'light' ? '#d1d5db' : '#4b5563' }}
                    >
                      Days marked this month:
                    </span>
                    <span 
                      className="text-lg font-bold"
                      style={{ color: currentTheme.accentColor }}
                    >
                      {Object.keys(selectedDays).filter(key => {
                        const [y, m] = key.split('-').map(Number);
                        return y === year && m === month + 1 && selectedDays[key];
                      }).length}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 px-4 rounded-xl font-semibold transition-all"
                    style={{
                      backgroundColor: currentTheme.textColor === 'light' ? '#374151' : '#e5e7eb',
                      color: currentTheme.textColor === 'light' ? '#d1d5db' : '#4b5563',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 py-3 px-4 rounded-xl font-semibold text-white transition-all hover:shadow-lg"
                    style={{
                      background: getGradientBg(),
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
