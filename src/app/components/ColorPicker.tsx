import { useState } from 'react';
import { motion } from 'motion/react';
import { CustomColorPicker } from './CustomColorPicker';

interface ColorPickerProps {
  label: string;
  description: string;
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ label, description, value, onChange }: ColorPickerProps) {
  const [showCustomPicker, setShowCustomPicker] = useState(false);

  // Universal popular colors - hits all main color families
  const popularColors = [
    '#3298ff', // Blue
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#f43f5e', // Rose
    '#ef4444', // Red
    '#f59e0b', // Orange
    '#fbbf24', // Yellow
    '#10b981', // Green
    '#06b6d4', // Cyan
    '#6366f1', // Indigo
  ];

  return (
    <>
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        {/* Header with label */}
        <div className="p-4 pb-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              <div className="font-semibold text-gray-200 text-sm mb-1">{label}</div>
              <div className="text-xs text-gray-400">{description}</div>
            </div>
            {/* Current color preview */}
            <div 
              className="w-12 h-12 rounded-lg border-2 border-gray-600 shadow-inner"
              style={{ backgroundColor: value }}
            />
          </div>

          {/* Color Swatches Grid */}
          <div className="text-xs font-semibold text-gray-400 mb-2">Quick Colors</div>
          <div className="grid grid-cols-5 gap-2 mb-3">
            {popularColors.map((color, i) => (
              <motion.button
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.02 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onChange(color)}
                className={`h-11 rounded-lg border-2 transition-all ${ 
                  value.toLowerCase() === color.toLowerCase() 
                    ? 'border-white shadow-lg ring-2 ring-purple-500' 
                    : 'border-gray-600'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          {/* Custom Button & Hex Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value.toUpperCase())}
              className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2.5 text-xs text-gray-300 font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="#000000"
            />
            <button
              onClick={() => setShowCustomPicker(true)}
              className="h-10 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xs font-semibold flex items-center justify-center transition-all whitespace-nowrap shadow-lg"
            >
              Custom
            </button>
          </div>
        </div>
      </div>

      {/* Custom Color Picker Modal */}
      <CustomColorPicker
        isOpen={showCustomPicker}
        onClose={() => setShowCustomPicker(false)}
        initialColor={value}
        onColorSelect={onChange}
        label={label}
      />
    </>
  );
}