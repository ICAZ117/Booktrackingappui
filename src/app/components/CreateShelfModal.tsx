import { X, Sparkles, Heart, Trophy, Bookmark, Library, Star, BookOpen, Flame, Zap, Music, Globe } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';

interface CreateShelfModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateShelf: (shelf: { name: string; icon: string; color: string }) => void;
}

const iconOptions = [
  { name: 'Library', icon: Library, value: 'Library' },
  { name: 'Heart', icon: Heart, value: 'Heart' },
  { name: 'Star', icon: Star, value: 'Star' },
  { name: 'Trophy', icon: Trophy, value: 'Trophy' },
  { name: 'Sparkles', icon: Sparkles, value: 'Sparkles' },
  { name: 'Bookmark', icon: Bookmark, value: 'Bookmark' },
  { name: 'Book', icon: BookOpen, value: 'BookOpen' },
  { name: 'Flame', icon: Flame, value: 'Flame' },
  { name: 'Zap', icon: Zap, value: 'Zap' },
  { name: 'Music', icon: Music, value: 'Music' },
  { name: 'Globe', icon: Globe, value: 'Globe' },
];

const colorOptions = [
  { name: 'Red', value: 'from-red-400 to-pink-600' },
  { name: 'Orange', value: 'from-orange-400 to-red-600' },
  { name: 'Yellow', value: 'from-yellow-400 to-amber-600' },
  { name: 'Green', value: 'from-green-400 to-emerald-600' },
  { name: 'Teal', value: 'from-teal-400 to-cyan-600' },
  { name: 'Blue', value: 'from-blue-400 to-indigo-600' },
  { name: 'Purple', value: 'from-purple-400 to-pink-600' },
  { name: 'Pink', value: 'from-pink-400 to-rose-600' },
  { name: 'Gray', value: 'from-gray-400 to-gray-600' },
];

export function CreateShelfModal({ isOpen, onClose, onCreateShelf }: CreateShelfModalProps) {
  const { currentTheme } = useTheme();
  const [shelfName, setShelfName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Library');
  const [selectedColor, setSelectedColor] = useState('from-blue-400 to-indigo-600');

  const handleCreate = () => {
    if (!shelfName.trim()) return;
    
    onCreateShelf({
      name: shelfName.trim(),
      icon: selectedIcon,
      color: selectedColor,
    });
    
    // Reset form
    setShelfName('');
    setSelectedIcon('Library');
    setSelectedColor('from-blue-400 to-indigo-600');
  };

  const getGradientBg = () => {
    return currentTheme.isGradient
      ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
      : currentTheme.primary;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-t-3xl shadow-2xl overflow-hidden"
            style={{
              backgroundColor: currentTheme.cardColor,
              maxHeight: '90vh',
            }}
          >
            {/* Header */}
            <div
              className="p-6 text-white"
              style={{
                background: getGradientBg(),
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold">Create Custom Shelf</h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-white/80 text-sm">
                Design your own bookshelf with custom name, icon, and color
              </p>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
              {/* Shelf Name */}
              <div className="mb-6">
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{
                    color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827',
                  }}
                >
                  Shelf Name
                </label>
                <input
                  type="text"
                  value={shelfName}
                  onChange={(e) => setShelfName(e.target.value)}
                  placeholder="e.g., Summer Reads, Cozy Mysteries..."
                  className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: currentTheme.backgroundColor,
                    borderColor: currentTheme.borderColor,
                    color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827',
                  }}
                  maxLength={50}
                />
                <p
                  className="text-xs mt-1"
                  style={{
                    color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280',
                  }}
                >
                  {shelfName.length}/50 characters
                </p>
              </div>

              {/* Icon Selection */}
              <div className="mb-6">
                <label
                  className="block text-sm font-semibold mb-3"
                  style={{
                    color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827',
                  }}
                >
                  Choose Icon
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {iconOptions.map((option) => {
                    const IconComponent = option.icon;
                    const isSelected = selectedIcon === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setSelectedIcon(option.value)}
                        className="p-3 rounded-xl border-2 transition-all flex items-center justify-center"
                        style={{
                          backgroundColor: isSelected ? `${currentTheme.accentColor}20` : currentTheme.cardColor,
                          borderColor: isSelected ? currentTheme.accentColor : currentTheme.borderColor,
                        }}
                      >
                        <IconComponent
                          className="w-5 h-5"
                          style={{
                            color: isSelected ? currentTheme.accentColor : (currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280'),
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Color Selection */}
              <div className="mb-6">
                <label
                  className="block text-sm font-semibold mb-3"
                  style={{
                    color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827',
                  }}
                >
                  Choose Color
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {colorOptions.map((option) => {
                    const isSelected = selectedColor === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setSelectedColor(option.value)}
                        className="relative h-12 rounded-xl border-2 transition-all overflow-hidden"
                        style={{
                          borderColor: isSelected ? '#ffffff' : 'transparent',
                          boxShadow: isSelected ? '0 0 0 2px ' + currentTheme.accentColor : 'none',
                        }}
                      >
                        <div className={`w-full h-full bg-gradient-to-br ${option.value}`} />
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-4 h-4 rounded-full bg-white shadow-lg" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preview */}
              <div className="mb-6">
                <label
                  className="block text-sm font-semibold mb-3"
                  style={{
                    color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827',
                  }}
                >
                  Preview
                </label>
                <div
                  className="p-4 rounded-xl border flex items-center gap-3"
                  style={{
                    backgroundColor: currentTheme.cardColor,
                    borderColor: currentTheme.borderColor,
                  }}
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${selectedColor}`}>
                    {(() => {
                      const IconComponent = iconOptions.find(opt => opt.value === selectedIcon)?.icon || Library;
                      return <IconComponent className="w-4 h-4 text-white" />;
                    })()}
                  </div>
                  <span
                    className="font-semibold text-sm"
                    style={{
                      color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827',
                    }}
                  >
                    {shelfName || 'Your Shelf Name'}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="p-6 border-t flex gap-3"
              style={{
                borderColor: currentTheme.borderColor,
              }}
            >
              <button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl font-semibold transition-all"
                style={{
                  backgroundColor: currentTheme.textColor === 'light' ? '#374151' : '#f3f4f6',
                  color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!shelfName.trim()}
                className="flex-1 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: shelfName.trim() ? getGradientBg() : '#9ca3af',
                }}
              >
                Create Shelf
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
