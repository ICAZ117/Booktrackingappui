import { User, CheckCircle2, TrendingUp, BookOpen, ChevronDown, ChevronUp, Circle, Search, RefreshCw, Sparkles, ArrowRight, Book, Key, ExternalLink, AlertCircle } from 'lucide-react';
import { useState, useMemo, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useBooks } from '../contexts/BooksContext';
import { useAuthors } from '../contexts/AuthorContext';
import { AuthorDetailView } from './AuthorDetailView';
import { motion, AnimatePresence } from 'motion/react';
import { hasApiKey, setGoogleBooksApiKey, getGoogleBooksApiKey, clearGoogleBooksApiKey } from '../utils/authorDatabase';

export function AuthorTracker() {
  const { currentTheme } = useTheme();
  const { books } = useBooks();
  const { authors, isLoading, isSyncing, syncProgress, refreshAllAuthors, loadNewAuthors, getAllSeries } = useAuthors();
  const [view, setView] = useState<'authors' | 'series'>('authors');
  const [expandedAuthors, setExpandedAuthors] = useState<string[]>([]);
  const [expandedSeries, setExpandedSeries] = useState<string[]>([]);
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'books-read' | 'total-books' | 'name'>('books-read');
  
  // API Key state management - safe initialization
  const [showApiKeySetup, setShowApiKeySetup] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiKeyError, setApiKeyError] = useState('');
  
  // Initialize API key state after mount
  useEffect(() => {
    const hasKey = hasApiKey();
    setShowApiKeySetup(!hasKey);
    setApiKeyInput(getGoogleBooksApiKey() || '');
  }, []);

  const handleSaveApiKey = () => {
    if (!apiKeyInput.trim()) {
      setApiKeyError('Please enter an API key');
      return;
    }
    
    if (apiKeyInput.length < 20) {
      setApiKeyError('API key seems too short. Please check it.');
      return;
    }
    
    setGoogleBooksApiKey(apiKeyInput.trim());
    setShowApiKeySetup(false);
    setApiKeyError('');
  };

  const handleSkipApiKey = () => {
    // Set a dummy value to indicate user chose to skip
    setGoogleBooksApiKey('SKIP');
    setShowApiKeySetup(false);
  };

  const handleClearApiKey = () => {
    clearGoogleBooksApiKey();
    setApiKeyInput('');
    setShowApiKeySetup(true);
  };

  // Extract basic author stats from books in library (fallback when no author data loaded)
  const basicAuthorStats = useMemo(() => {
    if (authors.length > 0) return null; // Use full author data if available
    
    const authorMap = new Map<string, { name: string; booksRead: number; totalInLibrary: number }>();
    
    books.forEach(book => {
      if (!book.author) return;
      
      const authorName = book.author.trim();
      if (!authorMap.has(authorName)) {
        authorMap.set(authorName, {
          name: authorName,
          booksRead: 0,
          totalInLibrary: 0
        });
      }
      
      const stats = authorMap.get(authorName)!;
      stats.totalInLibrary++;
      if (book.status === 'finished') {
        stats.booksRead++;
      }
    });
    
    return Array.from(authorMap.values()).sort((a, b) => b.booksRead - a.booksRead);
  }, [books, authors.length]);

  // Get all series from authors
  const allSeries = useMemo(() => getAllSeries(), [getAllSeries]);

  // Filter and sort authors
  const filteredAuthors = useMemo(() => {
    let filtered = [...authors];
    
    console.log('🔍 AUTHOR FILTER DEBUG:');
    console.log('- Total authors:', authors.length);
    console.log('- Search query:', searchQuery);
    console.log('- Sort by:', sortBy);

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(author =>
        author.name.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'books-read':
          return b.booksRead - a.booksRead;
        case 'total-books':
          return b.totalBooks - a.totalBooks;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    console.log('- Filtered result:', filtered.length, 'authors');
    console.log('- Sample authors:', filtered.slice(0, 3).map(a => ({ name: a.name, read: a.booksRead, total: a.totalBooks })));

    return filtered;
  }, [authors, searchQuery, sortBy]);

  // Filter and sort series
  const filteredSeries = useMemo(() => {
    let filtered = [...allSeries];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(series =>
        series.name.toLowerCase().includes(query) ||
        series.author.toLowerCase().includes(query)
      );
    }

    // Sort by books read
    filtered.sort((a, b) => b.booksRead - a.booksRead);

    return filtered;
  }, [allSeries, searchQuery]);

  function getAuthorAvatar(name: string): string {
    // Return emoji avatars based on author name
    const firstChar = name.charAt(0).toLowerCase();
    const avatars = ['👩', '👨', '👩‍🦰', '👨‍🦱', '👩‍🦱', '👱‍♀️', '👱‍♂️', '👩‍🦳', '👨‍🦳'];
    const index = firstChar.charCodeAt(0) % avatars.length;
    return avatars[index];
  }

  const getGradientBg = () => {
    if (!currentTheme.isGradient) {
      return currentTheme.primary;
    }
    
    // Support 3-color gradients (Red → Purple → Blue)
    if (currentTheme.tertiary) {
      return `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.tertiary} 50%, ${currentTheme.secondary} 100%)`;
    }
    
    // Standard 2-color gradient
    return `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`;
  };

  const completedAuthors = authors.filter(a => a.booksRead === a.totalBooks && a.totalBooks > 0).length;
  const completedSeries = allSeries.filter(s => s.booksRead === s.totalBooks && s.totalBooks > 0).length;

  // Show loading state with author being processed
  if (isLoading) {
    const theme = { colors: { primary: currentTheme.primary, secondary: currentTheme.secondary } };
    const progress = syncProgress;
    const error = null;

    return (
      <div 
        className="p-6 rounded-2xl"
        style={{ 
          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Book className="w-6 h-6" />
            Author Tracker
          </h2>
        </div>

        {/* CACHE WARNING - ULTRA PROMINENT */}
        <div className="mb-6 p-6 bg-gradient-to-r from-red-600 to-red-500 border-4 border-red-400 rounded-2xl shadow-2xl animate-pulse">
          <div className="text-white font-black text-2xl mb-3 flex items-center gap-3">
            <AlertCircle className="w-8 h-8" />
            🚨 OLD CACHED CODE RUNNING!
          </div>
          <div className="text-white text-base mb-4 leading-relaxed">
            Your browser is running <span className="font-bold bg-black/30 px-2 py-1 rounded">OLD VERSION</span> of the code!
            <br />
            <span className="text-yellow-300 font-bold">Look at your console:</span> If you DON'T see a giant green banner saying "VERSION 4.0.1-CACHE-BUST", you're on the old code.
          </div>
          <div className="bg-black/30 p-4 rounded-lg mb-4 text-white/90 text-sm font-mono">
            ❌ OLD CODE: "Retrying in 4000ms... attempt 1/3"
            <br />
            ✅ NEW CODE: "Retrying in 60000ms... attempt 1/6" + "[VERSION 4.0]"
          </div>
          <button
            onClick={() => {
              if (confirm('🔥 NUCLEAR CACHE CLEAR\n\nThis will:\n1. Clear ALL browser storage\n2. Unregister service workers\n3. Force hard reload\n\nYour books/themes will be preserved!\n\nContinue?')) {
                // Save critical data
                const booksData = localStorage.getItem('readtrack_books');
                const themesData = localStorage.getItem('readtrack_themes');
                const currentTheme = localStorage.getItem('readtrack_current_theme');
                
                // Nuclear clear
                localStorage.clear();
                sessionStorage.clear();
                
                // Restore critical data
                if (booksData) localStorage.setItem('readtrack_books', booksData);
                if (themesData) localStorage.setItem('readtrack_themes', themesData);
                if (currentTheme) localStorage.setItem('readtrack_current_theme', currentTheme);
                
                // Clear service workers
                navigator.serviceWorker?.getRegistrations().then(registrations => {
                  registrations.forEach(reg => reg.unregister());
                });
                
                // Hard reload
                window.location.href = window.location.href + '?cachebust=' + Date.now();
              }
            }}
            className="w-full px-6 py-4 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xl rounded-xl shadow-lg transform hover:scale-105 transition-all"
          >
            🔥 NUCLEAR CACHE CLEAR + RELOAD 🔥
          </button>
          <div className="text-white/90 text-sm mt-4 bg-black/20 p-3 rounded">
            <span className="font-bold">Alternative:</span> Press <kbd className="bg-black/40 px-2 py-1 rounded font-mono">Ctrl+Shift+R</kbd> (Windows) or <kbd className="bg-black/40 px-2 py-1 rounded font-mono">Cmd+Shift+R</kbd> (Mac) to hard refresh
          </div>
        </div>

        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/30 border-t-white mx-auto mb-4"></div>
          <div className="text-white/90 text-lg">
            {progress ? `Loading author ${progress.current}/${progress.total}...` : 'Initializing...'}
          </div>
          {progress && (
            <div className="text-white/70 mt-2">
              Currently processing: <span className="font-semibold">{progress.authorName}</span>
            </div>
          )}
          {progress && (
            <div className="mt-4">
              <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-white h-full transition-all duration-500"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                ></div>
              </div>
              <div className="text-white/60 text-sm mt-2">
                {progress.current} of {progress.total} authors processed
              </div>
            </div>
          )}
          {error && (
            <div className="mt-4 text-red-200 text-sm">
              {error}
            </div>
          )}
            <div className="mt-2 text-xs text-white/70">
              ⏱️ Smart rate limiting: ~15 seconds per author (~7 minutes total)
            </div>
        </div>
      </div>
    );
  }

  // Show author detail view if selected
  if (selectedAuthor) {
    return (
      <AuthorDetailView
        authorName={selectedAuthor}
        onClose={() => setSelectedAuthor(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* API Key Setup Banner - Show at top if not configured */}
      <AnimatePresence>
        {showApiKeySetup && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 rounded-xl border-2"
            style={{
              backgroundColor: currentTheme.cardColor,
              borderColor: currentTheme.accentColor,
            }}
          >
            <div className="text-center max-w-md mx-auto">
              <h3 className="text-lg font-bold mb-2" style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}>
                🚀 Boost Author Data Loading
              </h3>
              <p className="text-sm mb-4 leading-relaxed" style={{ color: currentTheme.textColor === 'light' ? '#d1d5db' : '#4b5563' }}>
                Add your <strong style={{ color: currentTheme.accentColor }}>free</strong> Google Books API key to eliminate rate limits and load author data <strong>instantly</strong>. Without it, loading may take 1-2 hours due to strict rate limiting.
              </p>
              
              <div className="space-y-3">
                {/* Input Field - Full Width */}
                <input
                  type="text"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Paste your API key here..."
                  className="w-full px-4 py-3 rounded-xl border-2 text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{
                    backgroundColor: currentTheme.textColor === 'light' ? '#1f2937' : '#ffffff',
                    borderColor: currentTheme.borderColor,
                    color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = currentTheme.accentColor;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = currentTheme.borderColor;
                  }}
                />
                
                {/* Save Button - Full Width */}
                <button
                  onClick={handleSaveApiKey}
                  className="w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg hover:shadow-xl transition-all active:scale-95"
                  style={{ background: getGradientBg() }}
                >
                  Save Key
                </button>
                
                {/* Error Message */}
                {apiKeyError && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="text-xs text-red-500">{apiKeyError}</span>
                  </div>
                )}
                
                {/* Action Buttons - Stacked on Mobile */}
                <div className="grid grid-cols-1 gap-2">
                  <a
                    href="https://console.cloud.google.com/apis/credentials"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95"
                    style={{ 
                      backgroundColor: `${currentTheme.accentColor}20`,
                      color: currentTheme.accentColor,
                    }}
                  >
                    <ExternalLink className="w-4 h-4 flex-shrink-0" />
                    <span>Get Free API Key (2 min setup)</span>
                  </a>
                  <button
                    onClick={handleSkipApiKey}
                    className="flex items-center justify-center px-4 py-3 rounded-xl font-medium text-sm transition-all active:scale-95"
                    style={{ 
                      backgroundColor: currentTheme.textColor === 'light' ? '#374151' : '#e5e7eb',
                      color: currentTheme.textColor === 'light' ? '#d1d5db' : '#6b7280',
                    }}
                  >
                    Skip (use slow mode)
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sync Progress Banner */}
      <AnimatePresence>
        {isSyncing && syncProgress && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="rounded-xl p-4"
            style={{
              background: getGradientBg(),
            }}
          >
            <div className="flex items-center justify-between text-white mb-2">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.div>
                <span className="font-semibold text-sm">Syncing Author Data...</span>
              </div>
              <span className="text-xs text-white/80">
                {syncProgress.current} / {syncProgress.total}
              </span>
            </div>
            <div className="text-xs text-white/80 mb-2">
              Fetching: {syncProgress.authorName}
            </div>
            <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${(syncProgress.current / syncProgress.total) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <div className="mt-2 text-xs text-white/70">
              ⏱️ Smart rate limiting: ~15 seconds per author (~7 minutes total)
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-3">
        <div 
          className="rounded-xl p-4 text-white"
          style={{
            background: getGradientBg(),
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold mb-0.5">
            {authors.length > 0 ? authors.length : (basicAuthorStats?.length || 0)}
          </div>
          <div className="text-white/80 text-[10px]">Authors</div>
        </div>

        <div 
          className="rounded-xl p-4"
          style={{
            backgroundColor: currentTheme.cardColor,
            borderColor: currentTheme.borderColor,
            borderWidth: '1px',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4" style={{ color: currentTheme.accentColor }} />
          </div>
          <div 
            className="text-2xl font-bold mb-0.5"
            style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
          >
            {authors.length > 0 
              ? authors.reduce((sum, a) => sum + a.booksRead, 0)
              : (basicAuthorStats?.reduce((sum, a) => sum + a.booksRead, 0) || 0)
            }
          </div>
          <div 
            className="text-[10px]"
            style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
          >
            Books Read
          </div>
        </div>

        <div 
          className="rounded-xl p-4"
          style={{
            backgroundColor: currentTheme.cardColor,
            borderColor: currentTheme.borderColor,
            borderWidth: '1px',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div 
            className="text-2xl font-bold mb-0.5"
            style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
          >
            {view === 'authors' ? completedAuthors : completedSeries}
          </div>
          <div 
            className="text-[10px]"
            style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
          >
            Complete
          </div>
        </div>
      </div>

      {/* Search and Refresh */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
              style={{ color: currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af' }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={view === 'authors' ? 'Search authors...' : 'Search series...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm"
              style={{
                backgroundColor: currentTheme.cardColor,
                borderColor: currentTheme.borderColor,
                color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827',
              }}
            />
          </div>
          {hasApiKey() && getGoogleBooksApiKey() !== 'SKIP' && (
            <button
              onClick={() => setShowApiKeySetup(true)}
              className="p-2.5 rounded-xl border transition-all"
              style={{
                backgroundColor: currentTheme.cardColor,
                borderColor: currentTheme.borderColor,
              }}
              title="API Key Settings"
            >
              <Key className="w-5 h-5" style={{ color: currentTheme.accentColor }} />
            </button>
          )}
          <button
            onClick={refreshAllAuthors}
            disabled={isSyncing}
            className="p-2.5 rounded-xl border transition-all"
            style={{
              backgroundColor: currentTheme.cardColor,
              borderColor: currentTheme.borderColor,
              opacity: isSyncing ? 0.5 : 1,
            }}
          >
            <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} style={{ color: currentTheme.accentColor }} />
          </button>
        </div>

        {/* Sort Options */}
        {view === 'authors' && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              { value: 'books-read', label: 'Most Read' },
              { value: 'total-books', label: 'Most Books' },
              { value: 'name', label: 'A-Z' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value as any)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all"
                style={{
                  background: sortBy === option.value ? getGradientBg() : currentTheme.cardColor,
                  color: sortBy === option.value ? '#ffffff' : (currentTheme.textColor === 'light' ? '#d1d5db' : '#374151'),
                  borderWidth: sortBy === option.value ? '0' : '1px',
                  borderColor: currentTheme.borderColor,
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setView('authors')}
          className="flex-1 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
          style={{
            background: view === 'authors' ? getGradientBg() : currentTheme.cardColor,
            borderColor: view === 'authors' ? 'transparent' : currentTheme.borderColor,
            borderWidth: view === 'authors' ? '0' : '1px',
            color: view === 'authors' ? '#ffffff' : (currentTheme.textColor === 'light' ? '#d1d5db' : '#374151'),
            boxShadow: view === 'authors' ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
          }}
        >
          Authors ({filteredAuthors.length})
        </button>
        <button
          onClick={() => setView('series')}
          className="flex-1 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
          style={{
            background: view === 'series' ? getGradientBg() : currentTheme.cardColor,
            borderColor: view === 'series' ? 'transparent' : currentTheme.borderColor,
            borderWidth: view === 'series' ? '0' : '1px',
            color: view === 'series' ? '#ffffff' : (currentTheme.textColor === 'light' ? '#d1d5db' : '#374151'),
            boxShadow: view === 'series' ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
          }}
        >
          Series ({filteredSeries.length})
        </button>
      </div>

      {/* Authors View */}
      {view === 'authors' && (
        <div className="space-y-3">
          {filteredAuthors.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }} />
              <p className="font-semibold mb-2" style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}>
                {searchQuery ? 'No authors found' : 'No authors yet'}
              </p>
              {!searchQuery && (
                <div className="space-y-2">
                  <p className="text-sm" style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}>
                    {books.length === 0 
                      ? 'Add books to your library to start tracking authors!' 
                      : 'Load author data from your books (very slow to avoid rate limits)'}
                  </p>
                  {books.length > 0 && (
                    <button
                      onClick={loadNewAuthors}
                      disabled={isSyncing}
                      className="mt-4 px-6 py-2.5 rounded-xl font-semibold text-sm text-white transition-all"
                      style={{
                        background: getGradientBg(),
                        opacity: isSyncing ? 0.5 : 1,
                      }}
                    >
                      {isSyncing ? 'Loading...' : 'Load Authors (15s per author)'}
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            filteredAuthors.map((author, index) => {
              const progress = (author.booksRead / author.totalBooks) * 100;
              const isComplete = author.booksRead === author.totalBooks && author.totalBooks > 0;

              return (
                <motion.button
                  key={author.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedAuthor(author.name)}
                  className="w-full text-left rounded-xl p-4 border shadow-sm transition-all hover:shadow-md"
                  style={{
                    backgroundColor: currentTheme.cardColor,
                    borderColor: currentTheme.borderColor,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{getAuthorAvatar(author.name)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <h3
                            className="font-bold text-sm truncate"
                            style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
                          >
                            {author.name}
                          </h3>
                          {isComplete && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 flex-shrink-0" style={{ color: currentTheme.accentColor }} />
                      </div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}>
                          {author.booksRead} / {author.totalBooks} books
                        </span>
                        <span className="font-semibold" style={{ color: currentTheme.accentColor }}>
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <div 
                        className="h-2 rounded-full overflow-hidden"
                        style={{ backgroundColor: currentTheme.textColor === 'light' ? '#374151' : '#e5e7eb' }}
                      >
                        <div
                          className={`h-full transition-all ${
                            isComplete
                              ? 'bg-emerald-500'
                              : ''
                          }`}
                          style={{ 
                            width: `${progress}%`,
                            background: isComplete ? undefined : getGradientBg(),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })
          )}
        </div>
      )}

      {/* Series View */}
      {view === 'series' && (
        <div className="space-y-4">
          {filteredSeries.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }} />
              <p style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}>
                {searchQuery ? 'No series found' : 'No series detected yet'}
              </p>
            </div>
          ) : (
            filteredSeries.map((s, index) => {
              const progress = (s.booksRead / s.totalBooks) * 100;
              const isComplete = s.booksRead === s.totalBooks && s.totalBooks > 0;
              const isExpanded = expandedSeries.includes(s.name);

              return (
                <motion.div
                  key={`${s.name}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-xl p-4 border shadow-sm"
                  style={{
                    backgroundColor: currentTheme.cardColor,
                    borderColor: currentTheme.borderColor,
                  }}
                >
                  <button
                    onClick={() => {
                      if (isExpanded) {
                        setExpandedSeries(expandedSeries.filter(name => name !== s.name));
                      } else {
                        setExpandedSeries([...expandedSeries, s.name]);
                      }
                    }}
                    className="w-full"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <h3
                            className="font-bold text-sm"
                            style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
                          >
                            {s.name}
                          </h3>
                          {isComplete && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          )}
                        </div>
                        <p
                          className="text-xs"
                          style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                        >
                          by {s.author}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div
                            className="text-xl font-bold"
                            style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
                          >
                            {s.booksRead}/{s.totalBooks}
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" style={{ color: currentTheme.accentColor }} />
                        ) : (
                          <ChevronDown className="w-5 h-5" style={{ color: currentTheme.accentColor }} />
                        )}
                      </div>
                    </div>

                    <div 
                      className="h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: currentTheme.textColor === 'light' ? '#374151' : '#e5e7eb' }}
                    >
                      <div
                        className={`h-full transition-all ${
                          isComplete
                            ? 'bg-emerald-500'
                            : ''
                        }`}
                        style={{ 
                          width: `${progress}%`,
                          background: isComplete ? undefined : getGradientBg(),
                        }}
                      />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-3 space-y-2 overflow-hidden"
                      >
                        {s.books.map((book, bookIndex) => (
                          <div
                            key={bookIndex}
                            className="flex items-center gap-2 text-xs"
                          >
                            {book.status === 'finished' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            ) : book.inUserLibrary ? (
                              <BookOpen className="w-4 h-4 flex-shrink-0" style={{ color: currentTheme.accentColor }} />
                            ) : (
                              <Circle className="w-4 h-4 flex-shrink-0" style={{ color: currentTheme.textColor === 'light' ? '#4b5563' : '#d1d5db' }} />
                            )}
                            <span
                              className={
                                book.status === 'finished' ? 'line-through' : ''
                              }
                              style={{
                                color: book.status === 'finished'
                                  ? (currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af')
                                  : (currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827')
                              }}
                            >
                              {book.title}
                            </span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}