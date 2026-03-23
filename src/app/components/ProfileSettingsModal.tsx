import { X, User, Camera, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const avatarOptions = [
  '📚', '🎨', '✨', '🌟', '💫', '🔥', '🎯', '🎪', '🌈', '🦄',
  '🐉', '🦋', '🌺', '🌸', '🍄', '🌙', '⭐', '🎭', '🎨', '📖'
];

export function ProfileSettingsModal({ isOpen, onClose }: ProfileSettingsModalProps) {
  const { currentTheme } = useTheme();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('📚');
  const [hasChanges, setHasChanges] = useState(false);

  // Load saved profile data
  useEffect(() => {
    if (isOpen) {
      const savedUsername = localStorage.getItem('readtrack_username') || 'bookworm2026';
      const savedBio = localStorage.getItem('readtrack_bio') || 'Reading enthusiast 📚';
      const savedAvatar = localStorage.getItem('readtrack_avatar') || '📚';
      
      setUsername(savedUsername);
      setBio(savedBio);
      setAvatar(savedAvatar);
      setHasChanges(false);
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem('readtrack_username', username);
    localStorage.setItem('readtrack_bio', bio);
    localStorage.setItem('readtrack_avatar', avatar);
    
    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent('profileUpdated'));
    
    onClose();
  };

  const getGradientBg = () => {
    return currentTheme.isGradient
      ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
      : currentTheme.primary;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-[430px] rounded-t-3xl shadow-2xl overflow-hidden"
        style={{
          backgroundColor: currentTheme.backgroundColor,
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Edit Profile</h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 160px)' }}>
          {/* Avatar Selection */}
          <div>
            <label 
              className="block text-sm font-bold mb-3"
              style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
            >
              Choose Avatar
            </label>
            <div className="grid grid-cols-10 gap-2">
              {avatarOptions.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    setAvatar(emoji);
                    setHasChanges(true);
                  }}
                  className="aspect-square rounded-xl flex items-center justify-center text-2xl transition-all hover:scale-110"
                  style={{
                    backgroundColor: avatar === emoji 
                      ? `${currentTheme.accentColor}30` 
                      : currentTheme.cardColor,
                    borderWidth: avatar === emoji ? '2px' : '1px',
                    borderColor: avatar === emoji 
                      ? currentTheme.accentColor 
                      : currentTheme.borderColor,
                  }}
                >
                  {emoji}
                  {avatar === emoji && (
                    <div 
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: currentTheme.accentColor }}
                    >
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Username */}
          <div>
            <label 
              className="block text-sm font-bold mb-2"
              style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
            >
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setHasChanges(true);
              }}
              placeholder="@bookworm2026"
              className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: currentTheme.cardColor,
                borderColor: currentTheme.borderColor,
                borderWidth: '1px',
                color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827',
              }}
            />
          </div>

          {/* Bio */}
          <div>
            <label 
              className="block text-sm font-bold mb-2"
              style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
            >
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => {
                setBio(e.target.value);
                setHasChanges(true);
              }}
              placeholder="Tell us about yourself..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all resize-none"
              style={{
                backgroundColor: currentTheme.cardColor,
                borderColor: currentTheme.borderColor,
                borderWidth: '1px',
                color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827',
              }}
            />
            <p 
              className="text-xs mt-1"
              style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
            >
              {bio.length}/100 characters
            </p>
          </div>
        </div>

        {/* Footer */}
        <div 
          className="p-6 border-t"
          style={{
            backgroundColor: currentTheme.backgroundColor,
            borderTopColor: currentTheme.borderColor,
          }}
        >
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="w-full py-3.5 rounded-xl font-bold text-white transition-all disabled:opacity-50"
            style={{
              background: getGradientBg(),
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
