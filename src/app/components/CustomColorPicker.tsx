import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface CustomColorPickerProps {
  isOpen: boolean;
  onClose: () => void;
  initialColor: string;
  onColorSelect: (color: string) => void;
  label: string;
}

export function CustomColorPicker({ isOpen, onClose, initialColor, onColorSelect, label }: CustomColorPickerProps) {
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [hexValue, setHexValue] = useState(initialColor);

  const saturationRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);

  // Convert hex to HSV when initial color changes
  useEffect(() => {
    if (initialColor) {
      const hsv = hexToHsv(initialColor);
      setHue(hsv.h);
      setSaturation(hsv.s);
      setBrightness(hsv.v);
      setHexValue(initialColor);
    }
  }, [initialColor]);

  // Update hex when HSV changes
  useEffect(() => {
    const hex = hsvToHex(hue, saturation, brightness);
    setHexValue(hex);
  }, [hue, saturation, brightness]);

  const handleSaturationBrightnessChange = (e: React.MouseEvent | React.TouchEvent) => {
    if (!saturationRef.current) return;
    
    const rect = saturationRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(clientY - rect.top, rect.height));
    
    const newSaturation = (x / rect.width) * 100;
    const newBrightness = 100 - (y / rect.height) * 100;
    
    setSaturation(newSaturation);
    setBrightness(newBrightness);
  };

  const handleHueChange = (e: React.MouseEvent | React.TouchEvent) => {
    if (!hueRef.current) return;
    
    const rect = hueRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const newHue = (x / rect.width) * 360;
    
    setHue(newHue);
  };

  const handleHexChange = (value: string) => {
    setHexValue(value);
    
    // Validate hex and update HSV
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      const hsv = hexToHsv(value);
      setHue(hsv.h);
      setSaturation(hsv.s);
      setBrightness(hsv.v);
    }
  };

  const handleConfirm = () => {
    onColorSelect(hexValue);
    onClose();
  };

  const currentColor = hsvToHex(hue, saturation, brightness);
  const hueColor = hsvToHex(hue, 100, 100);

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

          {/* Color Picker Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 z-50 flex items-center justify-center"
          >
            <div className="bg-gray-900 rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Pick Color</h3>
                  <p className="text-white/80 text-xs">{label}</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Color Picker Content */}
              <div className="p-6 space-y-4">
                {/* Saturation/Brightness Picker */}
                <div
                  ref={saturationRef}
                  className="relative w-full aspect-square rounded-2xl overflow-hidden cursor-crosshair shadow-lg"
                  style={{
                    background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${hueColor})`,
                  }}
                  onMouseDown={(e) => {
                    handleSaturationBrightnessChange(e);
                    const handleMove = (moveEvent: MouseEvent) => {
                      handleSaturationBrightnessChange(moveEvent as any);
                    };
                    const handleUp = () => {
                      document.removeEventListener('mousemove', handleMove);
                      document.removeEventListener('mouseup', handleUp);
                    };
                    document.addEventListener('mousemove', handleMove);
                    document.addEventListener('mouseup', handleUp);
                  }}
                  onTouchStart={(e) => {
                    handleSaturationBrightnessChange(e);
                  }}
                  onTouchMove={(e) => {
                    e.preventDefault();
                    handleSaturationBrightnessChange(e);
                  }}
                >
                  {/* Color Picker Handle */}
                  <div
                    className="absolute w-6 h-6 border-4 border-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    style={{
                      left: `${saturation}%`,
                      top: `${100 - brightness}%`,
                      backgroundColor: currentColor,
                    }}
                  />
                </div>

                {/* Hue Slider */}
                <div className="space-y-2">
                  <div
                    ref={hueRef}
                    className="relative w-full h-12 rounded-xl overflow-hidden cursor-pointer shadow-lg"
                    style={{
                      background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
                    }}
                    onMouseDown={(e) => {
                      handleHueChange(e);
                      const handleMove = (moveEvent: MouseEvent) => {
                        handleHueChange(moveEvent as any);
                      };
                      const handleUp = () => {
                        document.removeEventListener('mousemove', handleMove);
                        document.removeEventListener('mouseup', handleUp);
                      };
                      document.addEventListener('mousemove', handleMove);
                      document.addEventListener('mouseup', handleUp);
                    }}
                    onTouchStart={handleHueChange}
                    onTouchMove={(e) => {
                      e.preventDefault();
                      handleHueChange(e);
                    }}
                  >
                    {/* Hue Handle */}
                    <div
                      className="absolute top-1/2 w-5 h-5 border-4 border-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                      style={{
                        left: `${(hue / 360) * 100}%`,
                        backgroundColor: hueColor,
                      }}
                    />
                  </div>
                </div>

                {/* Color Preview & Hex Input */}
                <div className="flex gap-3 items-center">
                  {/* Color Preview */}
                  <div
                    className="w-16 h-16 rounded-xl border-2 border-gray-600 shadow-lg flex-shrink-0"
                    style={{ backgroundColor: currentColor }}
                  />

                  {/* Hex Input */}
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-400 mb-1">
                      Hex Code
                    </label>
                    <input
                      type="text"
                      value={hexValue}
                      onChange={(e) => handleHexChange(e.target.value.toUpperCase())}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-3 text-sm text-gray-300 font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 px-4 bg-gray-700 text-gray-300 font-semibold rounded-xl hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                  >
                    Select
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

// Color conversion utilities
function hexToHsv(hex: string): { h: number; s: number; v: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, v: 0 };

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  let s = max === 0 ? 0 : (diff / max) * 100;
  let v = max * 100;

  if (diff !== 0) {
    if (max === r) {
      h = 60 * (((g - b) / diff) % 6);
    } else if (max === g) {
      h = 60 * ((b - r) / diff + 2);
    } else {
      h = 60 * ((r - g) / diff + 4);
    }
  }

  if (h < 0) h += 360;

  return { h, s, v };
}

function hsvToHex(h: number, s: number, v: number): string {
  s = s / 100;
  v = v / 100;

  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}
