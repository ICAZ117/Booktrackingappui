import { X, Palette, Save, Eye, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { ThemePalette } from '../contexts/ThemeContext';
import { ColorPicker } from './ColorPicker';

interface CustomThemeBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  editingTheme?: ThemePalette | null;
}

export function CustomThemeBuilder({ isOpen, onClose, editingTheme = null }: CustomThemeBuilderProps) {
  const { currentTheme, addCustomTheme, updateCustomTheme, deleteCustomTheme } = useTheme();
  const [themeName, setThemeName] = useState('My Custom Theme');
  const [primary, setPrimary] = useState('#3298ff');
  const [secondary, setSecondary] = useState('#f83aef');
  const [backgroundColor, setBackgroundColor] = useState('#111827');
  const [cardColor, setCardColor] = useState('#1f2937');
  const [borderColor, setBorderColor] = useState('#374151');
  const [successColor, setSuccessColor] = useState('#10b981');
  const [accentColor, setAccentColor] = useState('#3298ff');
  const [isGradient, setIsGradient] = useState(true);
  const [textColor, setTextColor] = useState<'light' | 'dark'>('light');

  // Load editing theme data when modal opens
  useEffect(() => {
    if (editingTheme) {
      setThemeName(editingTheme.name);
      setPrimary(editingTheme.primary);
      setSecondary(editingTheme.secondary);
      setBackgroundColor(editingTheme.backgroundColor);
      setCardColor(editingTheme.cardColor);
      setBorderColor(editingTheme.borderColor);
      setSuccessColor(editingTheme.successColor);
      setAccentColor(editingTheme.accentColor);
      setIsGradient(editingTheme.isGradient);
      setTextColor(editingTheme.textColor);
    } else {
      // Reset to defaults for new theme
      setThemeName('My Custom Theme');
      setPrimary('#3298ff');
      setSecondary('#f83aef');
      setBackgroundColor('#111827');
      setCardColor('#1f2937');
      setBorderColor('#374151');
      setSuccessColor('#10b981');
      setAccentColor('#3298ff');
      setIsGradient(true);
      setTextColor('light');
    }
  }, [editingTheme, isOpen]);

  // Function to calculate luminance and determine if text should be light or dark
  const calculateTextColor = (hexColor: string): 'light' | 'dark' => {
    // Remove # if present
    const hex = hexColor.replace('#', '');
    
    // Convert to RGB
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Calculate relative luminance (WCAG formula)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // If luminance is high (bright background), use dark text. Otherwise, use light text.
    return luminance > 0.5 ? 'dark' : 'light';
  };

  // Auto-calculate text color whenever background changes
  useEffect(() => {
    const calculatedTextColor = calculateTextColor(backgroundColor);
    setTextColor(calculatedTextColor);
    console.log(`🎨 Auto-calculated text color for background ${backgroundColor}: ${calculatedTextColor}`);
  }, [backgroundColor]);

  const handleSave = () => {
    const customTheme = {
      id: editingTheme ? editingTheme.id : `custom-${Date.now()}`,
      name: themeName,
      primary,
      secondary,
      backgroundColor,
      cardColor,
      borderColor,
      successColor,
      accentColor,
      isGradient,
      textColor,
    };
    
    if (editingTheme) {
      updateCustomTheme(customTheme);
    } else {
      addCustomTheme(customTheme);
    }
    
    // Show success feedback with a slight delay so user sees the modal close
    setTimeout(() => {
      onClose();
    }, 100);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 z-50 flex items-center justify-center"
          >
            <div className="bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Palette className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{editingTheme ? 'Edit Theme' : 'Create Theme'}</h2>
                    <p className="text-white/80 text-xs">{editingTheme ? 'Update your theme' : 'Design your perfect look'}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Theme Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Theme Name
                  </label>
                  <input
                    type="text"
                    value={themeName}
                    onChange={(e) => setThemeName(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter theme name..."
                  />
                </div>

                {/* Gradient Toggle */}
                <div className="flex items-center justify-between bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <div>
                    <div className="font-semibold text-gray-200 text-sm">Gradient Style</div>
                    <div className="text-xs text-gray-400">
                      {isGradient ? 'Two colors blending together' : 'Single solid color'}
                    </div>
                  </div>
                  <button
                    onClick={() => setIsGradient(!isGradient)}
                    className={`w-14 h-8 rounded-full transition-all relative ${
                      isGradient ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-700'
                    }`}
                  >
                    <motion.div
                      animate={{ x: isGradient ? 24 : 2 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                    />
                  </button>
                </div>

                {/* Text Color Toggle */}
                <div className="flex items-center justify-between bg-gray-800 rounded-xl p-4 border border-gray-700">
                  <div>
                    <div className="font-semibold text-gray-200 text-sm">Text Color</div>
                    <div className="text-xs text-emerald-400">✓ Auto-calculated based on background</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTextColor('light')}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                        textColor === 'light'
                          ? 'bg-white text-gray-900'
                          : 'bg-gray-700 text-gray-400'
                      }`}
                    >
                      Light
                    </button>
                    <button
                      onClick={() => setTextColor('dark')}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                        textColor === 'dark'
                          ? 'bg-gray-900 text-white border border-gray-600'
                          : 'bg-gray-700 text-gray-400'
                      }`}
                    >
                      Dark
                    </button>
                  </div>
                </div>

                {/* Color Pickers */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Color Palette
                  </h3>

                  {/* Primary Color */}
                  <ColorPicker
                    label="Primary Color"
                    description="Main brand color"
                    value={primary}
                    onChange={setPrimary}
                  />

                  {/* Secondary Color */}
                  {isGradient && (
                    <ColorPicker
                      label="Secondary Color"
                      description="Gradient end color"
                      value={secondary}
                      onChange={setSecondary}
                    />
                  )}

                  {/* Background Color */}
                  <ColorPicker
                    label="Background"
                    description="App background"
                    value={backgroundColor}
                    onChange={setBackgroundColor}
                  />

                  {/* Card Color */}
                  <ColorPicker
                    label="Cards"
                    description="Card backgrounds"
                    value={cardColor}
                    onChange={setCardColor}
                  />

                  {/* Success Color */}
                  <ColorPicker
                    label="Success"
                    description="Checkmarks & completed"
                    value={successColor}
                    onChange={setSuccessColor}
                  />

                  {/* Accent Color */}
                  <ColorPicker
                    label="Accent"
                    description="Active states & links"
                    value={accentColor}
                    onChange={setAccentColor}
                  />
                </div>

                {/* Preview Card */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-bold text-gray-300">Preview</h3>
                  </div>
                  
                  {/* Background Preview - shows actual text on background */}
                  <div
                    className="rounded-xl p-4 mb-3 border-2"
                    style={{
                      backgroundColor: backgroundColor,
                      borderColor: textColor === 'dark' ? '#10b981' : '#3b82f6',
                    }}
                  >
                    <div
                      className="font-bold text-lg mb-1"
                      style={{ color: textColor === 'light' ? '#ffffff' : '#111827' }}
                    >
                      Currently Reading
                    </div>
                    <div
                      className="text-sm mb-2"
                      style={{ color: textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                    >
                      This is how section titles and text will appear
                    </div>
                    <div className="flex items-center gap-2 text-xs" style={{ color: textColor === 'light' ? '#10b981' : '#059669' }}>
                      <span className={textColor === 'dark' ? 'text-emerald-600' : 'text-emerald-400'}>✓</span>
                      <span style={{ color: textColor === 'light' ? '#9ca3af' : '#6b7280' }}>
                        Text color: <span className="font-bold">{textColor === 'light' ? 'Light (for dark backgrounds)' : 'Dark (for light backgrounds)'}</span>
                      </span>
                    </div>
                  </div>
                  
                  {/* Card Preview */}
                  <div
                    className="rounded-xl p-4 border"
                    style={{
                      backgroundColor: cardColor,
                      borderColor: borderColor,
                    }}
                  >
                    <div
                      className="rounded-lg p-3 mb-3"
                      style={{
                        background: isGradient
                          ? `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`
                          : primary,
                      }}
                    >
                      <div
                        className="font-bold text-sm mb-1"
                        style={{ color: '#ffffff' }}
                      >
                        Welcome to {themeName}!
                      </div>
                      <div
                        className="text-xs"
                        style={{
                          color: 'rgba(255,255,255,0.8)',
                        }}
                      >
                        This is how gradient buttons will look
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div
                        className="flex-1 rounded-lg py-2 px-3 text-xs font-semibold text-white text-center"
                        style={{ backgroundColor: accentColor }}
                      >
                        Accent
                      </div>
                      <div
                        className="flex-1 rounded-lg py-2 px-3 text-xs font-semibold text-white text-center"
                        style={{ backgroundColor: successColor }}
                      >
                        Success
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 bg-gray-800/50 border-t border-gray-700">
                {/* Delete Button (only in edit mode) */}
                {editingTheme && (
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${themeName}"? This action cannot be undone.`)) {
                        deleteCustomTheme(editingTheme.id);
                        onClose();
                      }
                    }}
                    className="w-full mb-3 py-3 px-4 bg-red-500/10 text-red-500 border border-red-500/30 font-semibold rounded-xl hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Delete Theme
                  </button>
                )}
                
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 px-4 bg-gray-700 text-gray-300 font-semibold rounded-xl hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Theme
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}