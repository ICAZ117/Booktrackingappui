import { useState } from 'react';
import { Palette, Share2, Download, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import * as domtoimage from 'dom-to-image-more';

interface CalendarCustomizerProps {
  calendarRef: React.RefObject<HTMLDivElement>;
  onBackgroundChange?: (background: any) => void;
  currentBackground?: any;
  calendarName: string;
}

const backgroundOptions = [
  { id: 'theme', name: 'Your Theme', type: 'gradient', value: null },
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

export function CalendarCustomizer({ calendarRef, onBackgroundChange, currentBackground, calendarName }: CalendarCustomizerProps) {
  const { currentTheme } = useTheme();
  const [showBackgroundPicker, setShowBackgroundPicker] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const getGradientBg = () => {
    return currentTheme.isGradient
      ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
      : currentTheme.primary;
  };

  const handleShare = async () => {
    if (!calendarRef.current) return;

    try {
      const dataUrl = await domtoimage.toPng(calendarRef.current, {
        quality: 1,
        bgcolor: '#ffffff',
        width: calendarRef.current.offsetWidth * 2,
        height: calendarRef.current.offsetHeight * 2,
        style: {
          transform: 'scale(2)',
          transformOrigin: 'top left',
          width: `${calendarRef.current.offsetWidth}px`,
          height: `${calendarRef.current.offsetHeight}px`,
        }
      });

      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${calendarName}-calendar.png`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to capture calendar:', error);
    }
  };

  const handleDownload = async () => {
    if (!calendarRef.current) return;

    try {
      const dataUrl = await domtoimage.toPng(calendarRef.current, {
        quality: 1,
        bgcolor: '#ffffff',
        width: calendarRef.current.offsetWidth * 2,
        height: calendarRef.current.offsetHeight * 2,
        style: {
          transform: 'scale(2)',
          transformOrigin: 'top left',
          width: `${calendarRef.current.offsetWidth}px`,
          height: `${calendarRef.current.offsetHeight}px`,
        }
      });

      // Convert data URL to blob
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `readtrack-${calendarName}.png`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download calendar:', error);
    }
  };

  return (
    <div className="relative">
      {/* Toolbar */}
      <div className="flex items-center justify-end gap-2 mb-4">
        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="p-2.5 rounded-xl transition-all hover:scale-105 border border-gray-200"
          style={{
            background: isFavorite ? getGradientBg() : '#ffffff',
          }}
          title="Favorite this view"
        >
          <Heart 
            className="w-4 h-4"
            style={{ 
              color: isFavorite ? '#ffffff' : '#6b7280',
              fill: isFavorite ? '#ffffff' : 'transparent',
            }}
          />
        </button>

        {/* Background Picker */}
        <button
          onClick={() => setShowBackgroundPicker(!showBackgroundPicker)}
          className="p-2.5 rounded-xl bg-white border border-gray-200 hover:scale-105 transition-all"
          title="Customize colors"
        >
          <Palette className="w-4 h-4 text-gray-700" />
        </button>

        {/* Share/Download */}
        <button
          onClick={handleDownload}
          className="p-2.5 rounded-xl bg-white border border-gray-200 hover:scale-105 transition-all"
          title="Download calendar"
        >
          <Download className="w-4 h-4 text-gray-700" />
        </button>

        <button
          onClick={handleShare}
          className="px-4 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 border border-gray-200 shadow-sm"
          style={{
            background: getGradientBg(),
            color: '#ffffff',
          }}
          title="Share calendar"
        >
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </div>
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
                      if (onBackgroundChange) {
                        onBackgroundChange(bg);
                      }
                      setShowBackgroundPicker(false);
                    }}
                    className="relative rounded-xl p-4 text-left transition-all hover:scale-105 border-2"
                    style={{
                      background: bg.value || getGradientBg(),
                      borderColor: currentBackground?.id === bg.id ? '#ffffff' : 'transparent',
                      boxShadow: currentBackground?.id === bg.id 
                        ? '0 0 0 2px #3b82f6' 
                        : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div className="text-white font-semibold text-sm drop-shadow-lg">
                      {bg.name}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Background changes will apply to this calendar view
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}