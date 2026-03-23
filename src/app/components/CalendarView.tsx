import { useState } from 'react';
import { MonthlyCalendar } from './MonthlyCalendar';
import { ReadingCalendar } from './ReadingCalendar';
import { WrapUpCalendar } from './WrapUpCalendar';
import { TimelineCalendar } from './TimelineCalendar';
import { useTheme } from '../contexts/ThemeContext';
import { LayoutGrid, Calendar, BarChart3, Sparkles, GitBranch } from 'lucide-react';

interface CalendarViewProps {
  onBookSelect?: (book: any) => void;
}

type CalendarStyle = 'monthly' | 'reading-stats' | 'wrap-up' | 'timeline';

export function CalendarView({ onBookSelect }: CalendarViewProps) {
  const { currentTheme } = useTheme();
  const [selectedStyle, setSelectedStyle] = useState<CalendarStyle>('monthly');

  const getGradientBg = () => {
    return currentTheme.isGradient
      ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
      : currentTheme.primary;
  };

  const calendarStyles: { id: CalendarStyle; name: string; icon: typeof LayoutGrid; description: string }[] = [
    { 
      id: 'monthly', 
      name: 'Classic', 
      icon: Calendar,
      description: 'Clean monthly view with book covers'
    },
    { 
      id: 'reading-stats', 
      name: 'Stats View', 
      icon: BarChart3,
      description: 'Detailed stats with heatmap & charts'
    },
    { 
      id: 'wrap-up', 
      name: 'Wrap-Up', 
      icon: Sparkles,
      description: 'Gradient view with page graph'
    },
    { 
      id: 'timeline', 
      name: 'Timeline', 
      icon: GitBranch,
      description: 'Chronological timeline of your reading'
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header with title */}
      <div>
        <h1 
          className="text-2xl font-bold mb-1"
          style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
        >
          Calendar
        </h1>
        <p 
          className="text-sm"
          style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
        >
          Pick your favorite view
        </p>
      </div>

      {/* Calendar Style Picker */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <h3 className="text-xs font-bold text-gray-700 mb-3">📅 Calendar Style</h3>
        <div className="grid grid-cols-4 gap-2">
          {calendarStyles.map((style) => {
            const Icon = style.icon;
            const isSelected = selectedStyle === style.id;
            
            return (
              <button
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className="relative rounded-lg p-2 text-center transition-all hover:scale-[1.02] border-2"
                style={{
                  background: isSelected ? getGradientBg() : '#ffffff',
                  borderColor: isSelected 
                    ? 'transparent' 
                    : '#e5e7eb',
                  boxShadow: isSelected 
                    ? '0 10px 25px -5px rgba(0, 0, 0, 0.1)' 
                    : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                }}
              >
                {/* Selected indicator */}
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-white"></div>
                  </div>
                )}

                {/* Icon */}
                <div 
                  className="w-7 h-7 rounded-lg flex items-center justify-center mb-1.5 mx-auto"
                  style={{
                    background: isSelected 
                      ? 'rgba(255, 255, 255, 0.2)' 
                      : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                  }}
                >
                  <Icon 
                    className="w-3.5 h-3.5"
                    style={{ color: isSelected ? '#ffffff' : '#6b7280' }}
                  />
                </div>

                {/* Text */}
                <div 
                  className="font-bold text-[10px]"
                  style={{ color: isSelected ? '#ffffff' : '#111827' }}
                >
                  {style.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Render Selected Calendar */}
      <div>
        {selectedStyle === 'monthly' && (
          <MonthlyCalendar onBookSelect={onBookSelect} />
        )}
        {selectedStyle === 'reading-stats' && (
          <ReadingCalendar onBookSelect={onBookSelect} />
        )}
        {selectedStyle === 'wrap-up' && (
          <WrapUpCalendar onBookSelect={onBookSelect} />
        )}
        {selectedStyle === 'timeline' && (
          <TimelineCalendar onBookSelect={onBookSelect} />
        )}
      </div>
    </div>
  );
}