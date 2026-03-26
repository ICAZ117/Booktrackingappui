import { X, Trash2, Download, Info, Upload, Key, Sparkles, Database, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../contexts/ThemeContext';
import { useBooks } from '../contexts/BooksContext';
import { useBadges } from '../contexts/BadgesContext';
import { useState } from 'react';
import { getGoogleBooksApiKey, setGoogleBooksApiKey, clearGoogleBooksApiKey, hasApiKey } from '../utils/authorDatabase';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenImport: () => void;
}

export function SettingsModal({ isOpen, onClose, onOpenImport }: SettingsModalProps) {
  const { currentTheme } = useTheme();
  const { books, readingSessions, bookshelves } = useBooks();
  const { earnedBadges } = useBadges();
  const { signOut, isConfigured, user } = useAuth();
  const [isClearing, setIsClearing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [apiKey, setApiKey] = useState(hasApiKey() ? getGoogleBooksApiKey() : '');

  const handleExportData = () => {
    setIsExporting(true);
    try {
      const exportData = {
        books,
        readingSessions,
        bookshelves,
        earnedBadges,
        exportDate: new Date().toISOString(),
        appVersion: '1.0.0',
      };

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `readtrack-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('✅ Data exported successfully');
    } catch (error) {
      console.error('❌ Export failed:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleHardReset = async () => {
    const confirmed = window.confirm(
      '⚠️ HARD RESET WARNING\n\n' +
      'This will COMPLETELY erase ALL data including:\n' +
      '• All books and reading history\n' +
      '• All settings and preferences\n' +
      '• All custom themes\n' +
      '• All badges and progress\n\n' +
      'The app will restart as if you\'re a brand new user.\n\n' +
      'Are you absolutely sure?'
    );
    
    if (!confirmed) {
      console.log('🔥 Hard reset cancelled by user');
      return;
    }
    
    try {
      setIsClearing(true);
      console.log('🔥 HARD RESET INITIATED');

      // IMPORTANT: If user is authenticated, clear cloud data first.
      // If localStorage is cleared first, Supabase session tokens are lost and delete requests can fail.
      if (isConfigured && supabase && user?.id) {
        console.log('☁️ Clearing Supabase data for current user...');
        const tableNames = ['reading_sessions', 'bookshelves', 'books'] as const;

        for (const table of tableNames) {
          const { error } = await supabase.from(table).delete().eq('user_id', user.id);
          if (error) {
            throw new Error(`Failed to clear ${table}: ${error.message}`);
          }
        }

        console.log('✅ Supabase data cleared');
      }

      console.log('🧹 Clearing browser storage...');
      localStorage.clear();
      sessionStorage.clear();

      console.log('✅ Reset complete. Reloading page...');
      window.location.reload();
    } catch (error) {
      console.error('❌ Hard reset failed:', error);
      alert('Reset failed: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsClearing(false);
    }
  };

  const getGradientBg = () => {
    return currentTheme.isGradient
      ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
      : currentTheme.primary;
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-4 z-50 flex items-center justify-center"
          >
            <div
              className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
              style={{ backgroundColor: currentTheme.backgroundColor }}
            >
              {/* Header */}
              <div
                className="p-6 text-white relative"
                style={{ background: getGradientBg() }}
              >
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Settings</h2>
                    <p className="text-white/80 text-sm">Manage your data</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
                {/* Stats Overview */}
                <div
                  className="rounded-xl p-4"
                  style={{
                    backgroundColor: currentTheme.cardColor,
                    borderColor: currentTheme.borderColor,
                    borderWidth: '1px',
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4" style={{ color: currentTheme.accentColor }} />
                    <h3
                      className="font-bold text-sm"
                      style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
                    >
                      Your Data
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div
                        className="text-xs"
                        style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                      >
                        Books
                      </div>
                      <div
                        className="text-lg font-bold"
                        style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
                      >
                        {books.length}
                      </div>
                    </div>
                    <div>
                      <div
                        className="text-xs"
                        style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                      >
                        Sessions
                      </div>
                      <div
                        className="text-lg font-bold"
                        style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
                      >
                        {readingSessions.length}
                      </div>
                    </div>
                    <div>
                      <div
                        className="text-xs"
                        style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                      >
                        Shelves
                      </div>
                      <div
                        className="text-lg font-bold"
                        style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
                      >
                        {bookshelves.length}
                      </div>
                    </div>
                    <div>
                      <div
                        className="text-xs"
                        style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                      >
                        Badges
                      </div>
                      <div
                        className="text-lg font-bold"
                        style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
                      >
                        {earnedBadges.length}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Google Books API Key Section */}
                <div
                  className="rounded-xl p-4"
                  style={{
                    backgroundColor: currentTheme.cardColor,
                    borderColor: currentTheme.accentColor,
                    borderWidth: '2px',
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Key className="w-5 h-5" style={{ color: currentTheme.accentColor }} />
                    <h3
                      className="font-bold text-sm"
                      style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
                    >
                      Google Books API Key
                    </h3>
                    {hasApiKey() && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: '#10b98120',
                          color: '#10b981'
                        }}
                      >
                        Active ✓
                      </span>
                    )}
                  </div>

                  <p
                    className="text-xs mb-3"
                    style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                  >
                    <strong>Required for Author Tracker</strong> to avoid rate limits.<br />
                    Get a FREE key (takes 2 minutes):
                  </p>

                  <a
                    href="https://console.cloud.google.com/apis/credentials"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs underline block mb-3"
                    style={{ color: currentTheme.accentColor }}
                  >
                    https://console.cloud.google.com/apis/credentials →
                  </a>

                  <input
                    type="text"
                    placeholder="Paste your API key here..."
                    value={apiKey || ''}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm mb-2"
                    style={{
                      backgroundColor: currentTheme.textColor === 'light' ? '#1f2937' : '#f3f4f6',
                      color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: currentTheme.borderColor,
                    }}
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (apiKey && apiKey.trim()) {
                          setGoogleBooksApiKey(apiKey.trim());
                          alert('✅ API Key Saved! Author Tracker will now work without rate limits.');
                        } else {
                          alert('⚠️ Please enter an API key first.');
                        }
                      }}
                      className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold text-white transition-colors"
                      style={{ backgroundColor: currentTheme.accentColor }}
                    >
                      Save Key
                    </button>

                    {hasApiKey() && (
                      <button
                        onClick={() => {
                          if (confirm('Remove saved API key?')) {
                            clearGoogleBooksApiKey();
                            setApiKey('');
                            alert('🗑️ API Key removed.');
                          }
                        }}
                        className="px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
                        style={{
                          backgroundColor: '#ef444420',
                          color: '#ef4444'
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* Export Data Button */}
                <button
                  onClick={handleExportData}
                  disabled={isExporting}
                  className="w-full rounded-xl p-4 flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    backgroundColor: currentTheme.cardColor,
                    borderColor: currentTheme.accentColor,
                    borderWidth: '2px',
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${currentTheme.accentColor}20` }}
                  >
                    <Download className="w-5 h-5" style={{ color: currentTheme.accentColor }} />
                  </div>
                  <div className="flex-1 text-left">
                    <div
                      className="font-bold text-sm"
                      style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
                    >
                      {isExporting ? 'Exporting...' : 'Export All Data'}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                    >
                      Download a backup as JSON
                    </div>
                  </div>
                </button>

                {/* Import Button */}
                <button
                  onClick={() => {
                    onClose();
                    onOpenImport();
                  }}
                  className="w-full p-4 rounded-xl flex items-center justify-between transition-colors hover:scale-[1.02]"
                  style={{
                    backgroundColor: currentTheme.cardColor,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: currentTheme.borderColor,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${currentTheme.accentColor}20` }}
                    >
                      <Upload
                        className="w-5 h-5"
                        style={{ color: currentTheme.accentColor }}
                      />
                    </div>
                    <div className="text-left">
                      <div
                        className="font-semibold"
                        style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
                      >
                        Import Books
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                      >
                        From Goodreads, StoryGraph
                      </div>
                    </div>
                  </div>
                </button>

                {/* Hard Reset Button */}
                <button
                  onClick={handleHardReset}
                  disabled={isClearing}
                  className="w-full p-4 rounded-xl flex items-center justify-between transition-colors hover:scale-[1.02] border-2 border-red-500/30"
                  style={{ backgroundColor: currentTheme.cardColor }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500/20">
                      <Trash2 className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-bold text-sm text-red-500">
                        {isClearing ? 'Resetting...' : 'Clear All Data'}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                      >
                        Erase everything and start fresh
                      </div>
                    </div>
                  </div>
                </button>

                {isConfigured && (
                  <button
                    onClick={async () => {
                      await signOut();
                      onClose();
                    }}
                    className="w-full p-4 rounded-xl flex items-center justify-between transition-colors hover:scale-[1.02] border border-amber-500/30"
                    style={{ backgroundColor: currentTheme.cardColor }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-amber-500/20">
                        <LogOut className="w-5 h-5 text-amber-500" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-bold text-sm text-amber-500">Sign Out</div>
                        <div
                          className="text-xs"
                          style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                        >
                          Keep your account secure on shared devices
                        </div>
                      </div>
                    </div>
                  </button>
                )}

                {/* Info */}
                <div
                  className="rounded-xl p-3 text-xs"
                  style={{
                    backgroundColor: `${currentTheme.accentColor}10`,
                    color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280',
                  }}
                >
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: currentTheme.accentColor }} />
                    <div>
                      <strong style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}>
                        Pro Tip:
                      </strong>{' '}
                      Export your data regularly to keep a backup. You can import it later if needed.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
