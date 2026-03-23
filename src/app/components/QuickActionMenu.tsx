import { BookOpen, Plus, Target, X, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';

interface QuickActionMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogProgress: () => void;
  onAddBook: () => void;
  onViewGoals: () => void;
  onOpenSettings: () => void;
}

export function QuickActionMenu({ 
  isOpen, 
  onClose, 
  onLogProgress, 
  onAddBook, 
  onViewGoals,
  onOpenSettings
}: QuickActionMenuProps) {
  const { currentTheme } = useTheme();

  const menuItems = [
    {
      icon: BookOpen,
      label: 'Log Book Progress',
      sublabel: 'Track pages & percentage',
      onClick: () => {
        onLogProgress();
        onClose();
      },
      color: currentTheme.accentColor,
    },
    {
      icon: Plus,
      label: 'Add Book',
      sublabel: 'Start reading something new',
      onClick: () => {
        onAddBook();
        onClose();
      },
      color: currentTheme.successColor,
    },
    {
      icon: Target,
      label: 'View Goals',
      sublabel: 'Check your progress',
      onClick: () => {
        onViewGoals();
        onClose();
      },
      color: '#f59e0b',
    },
    {
      icon: Settings,
      label: 'Settings',
      sublabel: 'Manage data & preferences',
      onClick: () => {
        onOpenSettings();
        onClose();
      },
      color: '#8b5cf6',
    },
  ];

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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 z-50 rounded-2xl shadow-2xl overflow-hidden"
            style={{
              backgroundColor: currentTheme.cardColor,
              borderColor: currentTheme.borderColor,
              borderWidth: '1px',
              width: '280px',
            }}
          >
            {/* Header */}
            <div 
              className="flex items-center justify-between p-4 border-b"
              style={{ borderColor: currentTheme.borderColor }}
            >
              <h3 
                className="font-bold text-lg"
                style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
              >
                Quick Actions
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
              >
                <X 
                  className="w-5 h-5"
                  style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                />
              </button>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  style={{
                    backgroundColor: currentTheme.textColor === 'light' ? 'rgba(255,255,255,0.05)' : 'transparent',
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <item.icon 
                      className="w-6 h-6"
                      style={{ color: item.color }}
                    />
                  </div>
                  <div className="text-left flex-1">
                    <div 
                      className="font-semibold text-sm mb-0.5"
                      style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
                    >
                      {item.label}
                    </div>
                    <div 
                      className="text-xs"
                      style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                    >
                      {item.sublabel}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}