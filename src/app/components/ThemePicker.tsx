import { Palette, Check, Plus, Trash2, Edit2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { useState } from 'react';
import { CustomThemeBuilder } from './CustomThemeBuilder';
import { ThemePalette } from '../contexts/ThemeContext';

export function ThemePicker() {
  const { currentTheme, setTheme, allThemes, deleteCustomTheme } = useTheme();
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingTheme, setEditingTheme] = useState<ThemePalette | null>(null);

  const isCustomTheme = (themeId: string) => themeId.startsWith('custom-');

  const handleEdit = (theme: ThemePalette) => {
    setEditingTheme(theme);
    setShowBuilder(true);
  };

  const handleCloseBuilder = () => {
    setShowBuilder(false);
    setEditingTheme(null);
  };

  return (
    <>
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <Palette 
            className="w-4 h-4"
            style={{ color: currentTheme.accentColor }}
          />
          <h3 
            className="text-sm font-semibold"
            style={{ color: currentTheme.textColor === 'light' ? '#d1d5db' : '#4b5563' }}
          >
            Choose Your Theme
          </h3>
        </div>
        
        {/* Horizontal scrollable theme picker */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {/* Create Custom Button */}
          <div className="flex-shrink-0 relative flex flex-col items-center">
            <motion.button
              onClick={() => setShowBuilder(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <div
                className="w-14 h-14 rounded-full shadow-lg relative overflow-hidden border-2 border-dashed flex items-center justify-center"
                style={{
                  borderColor: currentTheme.accentColor,
                  backgroundColor: currentTheme.cardColor,
                }}
              >
                <Plus 
                  className="w-6 h-6"
                  style={{ color: currentTheme.accentColor }}
                />
              </div>
              <p 
                className="text-[10px] text-center mt-2 font-medium w-14 truncate"
                style={{ color: currentTheme.accentColor }}
              >
                Create
              </p>
            </motion.button>
          </div>

          {allThemes.map((theme) => (
            <div key={theme.id} className="flex-shrink-0 relative group flex flex-col items-center">
              <motion.button
                onClick={() => setTheme(theme.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                {/* Color Preview Circle */}
                <div
                  className={`w-14 h-14 rounded-full shadow-lg relative overflow-hidden ${
                    currentTheme.id === theme.id ? 'ring-3 ring-offset-2' : ''
                  }`}
                  style={{
                    background: theme.isGradient
                      ? `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`
                      : theme.primary,
                    ringColor: currentTheme.id === theme.id ? theme.accentColor : 'transparent',
                    ringOffsetColor: currentTheme.backgroundColor,
                  }}
                >
                  {currentTheme.id === theme.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                      style={{
                        backgroundColor: theme.textColor === 'light' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)',
                      }}
                    >
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: theme.textColor === 'light' ? '#ffffff' : '#000000',
                        }}
                      >
                        <Check 
                          className="w-4 h-4"
                          style={{ color: theme.textColor === 'light' ? '#000000' : '#ffffff' }}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
                
                {/* Theme Name */}
                <p 
                  className="text-[10px] text-center mt-2 font-medium w-14 truncate"
                  style={{
                    color: currentTheme.id === theme.id 
                      ? currentTheme.accentColor 
                      : (currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280')
                  }}
                >
                  {theme.name}
                </p>
              </motion.button>

              {/* Delete button for custom themes (hover only) */}
              {isCustomTheme(theme.id) && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete "${theme.name}"?`)) {
                      deleteCustomTheme(theme.id);
                    }
                  }}
                >
                  <Trash2 className="w-3 h-3 text-white" />
                </motion.button>
              )}

              {/* Edit button below custom themes (always visible on mobile) */}
              {isCustomTheme(theme.id) && (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="mt-1 px-2 py-1 rounded-md flex items-center gap-1 text-[9px] font-medium"
                  style={{
                    backgroundColor: currentTheme.cardColor,
                    color: currentTheme.accentColor,
                    border: `1px solid ${currentTheme.borderColor}`,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(theme);
                  }}
                >
                  <Edit2 className="w-3 h-3" />
                  Edit
                </motion.button>
              )}
            </div>
          ))}
        </div>

        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>

      {/* Custom Theme Builder Modal */}
      <CustomThemeBuilder
        isOpen={showBuilder}
        onClose={handleCloseBuilder}
        editingTheme={editingTheme}
      />
    </>
  );
}