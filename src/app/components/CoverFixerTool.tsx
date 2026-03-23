import { useState } from 'react';
import { useBooks } from '../contexts/BooksContext';
import { useTheme } from '../contexts/ThemeContext';
import { RefreshCw, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { refreshBrokenCovers } from '../utils/smartCoverRefresh';

export function CoverFixerTool() {
  const { books, updateBook } = useBooks();
  const { currentTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isFixing, setIsFixing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, fixed: 0, failed: 0 });
  const [fixedBooks, setFixedBooks] = useState<string[]>([]);

  const fixAllCovers = async () => {
    setIsFixing(true);
    setFixedBooks([]);
    
    const booksWithGoogleCovers = books.filter(b => b.cover && b.cover.includes('books.google.com'));
    setProgress({ current: 0, total: booksWithGoogleCovers.length, fixed: 0, failed: 0 });

    const results = await refreshBrokenCovers(
      booksWithGoogleCovers,
      (current, total, result) => {
        setProgress(prev => ({
          current,
          total,
          fixed: prev.fixed + (result.success && result.newCover ? 1 : 0),
          failed: prev.failed + (!result.success && result.oldCover ? 1 : 0)
        }));

        if (result.success && result.newCover) {
          // Update the book with new cover
          updateBook(result.bookId, { cover: result.newCover });
          setFixedBooks(prev => [...prev, result.title]);
        }
      }
    );

    setIsFixing(false);
    
    const fixed = results.filter(r => r.success && r.newCover).length;
    const tested = results.filter(r => r.oldCover?.includes('books.google.com')).length;
    
    alert(
      `✅ Cover Refresh Complete!\n\n` +
      `📚 Tested: ${tested} Google Books covers\n` +
      `✅ Fixed: ${fixed} broken covers\n` +
      `💡 ${tested - fixed} were already working\n\n` +
      `Refresh the page to see changes!`
    );
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-72 right-4 z-50 p-3 rounded-full shadow-lg animate-pulse"
        style={{ backgroundColor: '#10b981' }}
        title="Fix All Covers"
      >
        <RefreshCw className="w-6 h-6 text-white" />
      </button>
    );
  }

  const booksNeedingCheck = books.filter(b => b.cover && b.cover.includes('books.google.com'));

  return (
    <div 
      className="fixed bottom-24 right-4 z-50 p-6 rounded-2xl shadow-2xl max-w-md"
      style={{ 
        backgroundColor: currentTheme.cardColor,
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: '#10b981'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-green-500" />
          <h3 
            className="font-bold"
            style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
          >
            Cover Fixer
          </h3>
        </div>
        <button onClick={() => setIsOpen(false)}>
          <XCircle className="w-5 h-5" style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }} />
        </button>
      </div>

      <div 
        className="mb-4 p-4 rounded-lg"
        style={{ backgroundColor: currentTheme.backgroundColor }}
      >
        <div 
          className="text-sm mb-2"
          style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
        >
          Found {booksNeedingCheck.length} books with Google Books covers to check
        </div>
        
        {isFixing && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              <span 
                className="text-sm font-semibold"
                style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
              >
                Fixing... {progress.current}/{progress.total}
              </span>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${(progress.current / progress.total) * 100}%`,
                  backgroundColor: currentTheme.accentColor
                }}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-green-500">✅ Fixed: {progress.fixed}</span>
              <span className="text-red-500">❌ Failed: {progress.failed}</span>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={fixAllCovers}
        disabled={isFixing || booksNeedingCheck.length === 0}
        className="w-full py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ backgroundColor: currentTheme.accentColor, color: '#ffffff' }}
      >
        {isFixing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Testing & Fixing... {progress.current}/{progress.total}
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4" />
            {booksNeedingCheck.length === 0 ? 'No Google Books Covers' : 'Check & Fix Covers'}
          </>
        )}
      </button>

      {fixedBooks.length > 0 && (
        <div 
          className="mt-4 p-3 rounded-lg max-h-40 overflow-y-auto"
          style={{ backgroundColor: currentTheme.backgroundColor }}
        >
          <div 
            className="text-xs font-semibold mb-2"
            style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
          >
            Recently Fixed:
          </div>
          {fixedBooks.map((title, idx) => (
            <div 
              key={idx}
              className="flex items-center gap-2 text-xs mb-1"
            >
              <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
              <span 
                className="truncate"
                style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
              >
                {title}
              </span>
            </div>
          ))}
        </div>
      )}

      <div 
        className="mt-3 text-xs text-center"
        style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
      >
        Uses Google Books API → Hardcover → Open Library
      </div>
    </div>
  );
}
