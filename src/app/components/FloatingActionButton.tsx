import { motion } from 'motion/react';
import { Plus, BookOpen } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  const { currentTheme } = useTheme();
  
  const getGradientBg = () => {
    return currentTheme.isGradient
      ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
      : currentTheme.primary;
  };

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-24 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center z-40"
      style={{
        background: getGradientBg(),
      }}
    >
      <Plus className="w-6 h-6 text-white" />
    </motion.button>
  );
}