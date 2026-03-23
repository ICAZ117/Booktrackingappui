import { useState } from 'react';
import { useBooks } from '../contexts/BooksContext';
import { useTheme } from '../contexts/ThemeContext';
import { Eye, EyeOff, X } from 'lucide-react';

export function ImageDebugger() {
  const { books } = useBooks();
  const { currentTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [testResults, setTestResults] = useState<{ [key: string]: { status: 'loading' | 'success' | 'error'; width?: number; height?: number } }>({});

  const testImage = (url: string, bookTitle: string) => {
    setTestResults(prev => ({ ...prev, [bookTitle]: { status: 'loading' } }));
    
    const img = new Image();
    img.onload = () => {
      // Check if it's a placeholder (too small or 1x1 pixel)
      const isPlaceholder = img.naturalWidth < 50 || img.naturalHeight < 50 || 
                           (img.naturalWidth === 1 && img.naturalHeight === 1);
      
      if (isPlaceholder) {
        console.log(`⚠️ ${bookTitle}: Placeholder detected (${img.naturalWidth}x${img.naturalHeight})`);
        setTestResults(prev => ({ 
          ...prev, 
          [bookTitle]: { 
            status: 'error', 
            width: img.naturalWidth, 
            height: img.naturalHeight 
          } 
        }));
      } else {
        setTestResults(prev => ({ 
          ...prev, 
          [bookTitle]: { 
            status: 'success', 
            width: img.naturalWidth, 
            height: img.naturalHeight 
          } 
        }));
      }
    };
    img.onerror = () => {
      setTestResults(prev => ({ ...prev, [bookTitle]: { status: 'error' } }));
    };
    img.src = url;
  };

  const testAllImages = () => {
    books.forEach(book => {
      if (book.cover && book.cover.startsWith('http')) {
        testImage(book.cover, book.title);
      }
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-48 right-4 z-50 p-3 rounded-full shadow-lg"
        style={{ backgroundColor: '#3b82f6' }}
      >
        <Eye className="w-6 h-6 text-white" />
      </button>
    );
  }

  return (
    <div 
      className="fixed bottom-24 right-4 z-50 p-6 rounded-2xl shadow-2xl max-w-md max-h-[600px] overflow-y-auto"
      style={{ 
        backgroundColor: currentTheme.cardColor,
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: '#3b82f6'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-500" />
          <h3 
            className="font-bold"
            style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
          >
            Image Load Tester
          </h3>
        </div>
        <button onClick={() => setIsOpen(false)}>
          <X className="w-5 h-5" style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }} />
        </button>
      </div>

      <button
        onClick={testAllImages}
        className="w-full py-3 rounded-xl mb-4 font-semibold"
        style={{ backgroundColor: currentTheme.accentColor, color: '#ffffff' }}
      >
        Test All Images
      </button>

      <div className="space-y-2">
        {books.slice(0, 10).map(book => (
          <div 
            key={book.id}
            className="p-3 rounded-lg"
            style={{ backgroundColor: currentTheme.backgroundColor }}
          >
            <div className="flex items-start gap-3">
              <img
                src={book.cover}
                alt={book.title}
                className="w-12 h-16 object-cover rounded"
                onLoad={() => setTestResults(prev => ({ ...prev, [book.title]: 'success' }))}
                onError={() => setTestResults(prev => ({ ...prev, [book.title]: 'error' }))}
              />
              <div className="flex-1 min-w-0">
                <div 
                  className="font-semibold text-sm truncate"
                  style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
                >
                  {book.title}
                </div>
                <div 
                  className="text-xs truncate"
                  style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                >
                  {book.cover?.substring(0, 40)}...
                </div>
                <div className="mt-1">
                  {testResults[book.title]?.status === 'loading' && (
                    <span className="text-xs text-yellow-500">⏳ Loading...</span>
                  )}
                  {testResults[book.title]?.status === 'success' && (
                    <span className="text-xs text-green-500">
                      ✅ Success {testResults[book.title]?.width && `(${testResults[book.title]?.width}×${testResults[book.title]?.height})`}
                    </span>
                  )}
                  {testResults[book.title]?.status === 'error' && (
                    <span className="text-xs text-red-500">
                      ❌ {testResults[book.title]?.width ? `Placeholder (${testResults[book.title]?.width}×${testResults[book.title]?.height})` : 'Failed'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div 
        className="mt-4 text-xs text-center"
        style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
      >
        Showing first 10 books • Showing actual images
      </div>
    </div>
  );
}
