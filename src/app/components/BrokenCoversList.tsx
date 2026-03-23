import { useState, useEffect } from 'react';
import { useBooks } from '../contexts/BooksContext';
import { useTheme } from '../contexts/ThemeContext';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

export function BrokenCoversList() {
  const { books } = useBooks();
  const { currentTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [brokenBooks, setBrokenBooks] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  const testAllImages = async () => {
    setTesting(true);
    const broken: string[] = [];
    
    // Mark ALL books.google.com/books/content URLs as potentially broken
    // These URLs expire and often show "image not available" even when they "load"
    const googleBooksCovers = books.filter(b => b.cover && b.cover.includes('books.google.com'));
    
    console.log(`🔍 Testing ${googleBooksCovers.length} Google Books covers...`);
    
    for (const book of googleBooksCovers) {
      const works = await new Promise<boolean>((resolve) => {
        const img = new Image();
        const timer = setTimeout(() => {
          console.log(`⏱️ ${book.title}: Timeout`);
          resolve(false);
        }, 3000);
        
        img.onload = () => {
          clearTimeout(timer);
          
          // Check if it's a placeholder image
          const isPlaceholder = img.naturalWidth < 50 || img.naturalHeight < 50 || 
                               (img.naturalWidth === 1 && img.naturalHeight === 1);
          
          // ALSO: Mark books.google.com/books/content URLs as suspicious
          // These often show "image not available" even at correct dimensions
          const isSuspiciousUrl = book.cover!.includes('books.google.com/books/content');
          
          if (isPlaceholder) {
            console.log(`⚠️ ${book.title}: Placeholder detected (${img.naturalWidth}×${img.naturalHeight})`);
            resolve(false);
          } else if (isSuspiciousUrl) {
            console.log(`⚠️ ${book.title}: Suspicious Google Books content URL - marking for refresh`);
            resolve(false);
          } else {
            console.log(`✅ ${book.title}: OK (${img.naturalWidth}×${img.naturalHeight})`);
            resolve(true);
          }
        };
        img.onerror = () => {
          clearTimeout(timer);
          console.log(`❌ ${book.title}: Failed to load`);
          resolve(false);
        };
        
        img.src = book.cover!;
      });
      
      if (!works) {
        broken.push(book.title);
      }
    }
    
    console.log(`📊 Results: ${broken.length} broken, ${googleBooksCovers.length - broken.length} working`);
    setBrokenBooks(broken);
    setTesting(false);
  };

  useEffect(() => {
    if (isOpen && brokenBooks.length === 0 && !testing) {
      testAllImages();
    }
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-96 right-4 z-50 p-3 rounded-full shadow-lg"
        style={{ backgroundColor: '#f59e0b' }}
        title="See Broken Covers"
      >
        <AlertTriangle className="w-6 h-6 text-white" />
      </button>
    );
  }

  const googleBooksCount = books.filter(b => b.cover && b.cover.includes('books.google.com')).length;

  return (
    <div 
      className="fixed bottom-24 right-4 z-50 p-6 rounded-2xl shadow-2xl max-w-md max-h-[500px] overflow-y-auto"
      style={{ 
        backgroundColor: currentTheme.cardColor,
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: '#f59e0b'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <h3 
            className="font-bold"
            style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
          >
            Broken Covers
          </h3>
        </div>
        <button onClick={() => setIsOpen(false)}>
          <X className="w-5 h-5" style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }} />
        </button>
      </div>

      {testing ? (
        <div 
          className="p-4 rounded-lg text-center"
          style={{ backgroundColor: currentTheme.backgroundColor }}
        >
          <div className="animate-pulse">
            <div 
              className="text-sm"
              style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
            >
              Testing {googleBooksCount} covers...
            </div>
          </div>
        </div>
      ) : (
        <>
          <div 
            className="p-4 rounded-lg mb-4"
            style={{ backgroundColor: currentTheme.backgroundColor }}
          >
            <div className="flex items-center justify-between mb-2">
              <span 
                className="text-sm"
                style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
              >
                Total Google Books covers:
              </span>
              <span 
                className="font-bold"
                style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
              >
                {googleBooksCount}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span 
                className="text-sm"
                style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
              >
                Broken:
              </span>
              <span className="font-bold text-red-500">
                {brokenBooks.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span 
                className="text-sm"
                style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
              >
                Working:
              </span>
              <span className="font-bold text-green-500">
                {googleBooksCount - brokenBooks.length}
              </span>
            </div>
          </div>

          {brokenBooks.length > 0 ? (
            <>
              <div 
                className="text-xs font-semibold mb-2"
                style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
              >
                Books with broken covers:
              </div>
              <div className="space-y-2">
                {brokenBooks.map((title, idx) => (
                  <div 
                    key={idx}
                    className="p-2 rounded-lg flex items-center gap-2"
                    style={{ backgroundColor: currentTheme.backgroundColor }}
                  >
                    <X className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span 
                      className="text-sm"
                      style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
                    >
                      {title}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div 
              className="p-4 rounded-lg flex items-center justify-center gap-2"
              style={{ backgroundColor: currentTheme.backgroundColor }}
            >
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span 
                className="text-sm font-semibold"
                style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
              >
                All covers working! 🎉
              </span>
            </div>
          )}

          <button
            onClick={testAllImages}
            className="w-full mt-4 py-2 rounded-xl text-sm font-semibold"
            style={{ 
              backgroundColor: currentTheme.backgroundColor,
              color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827'
            }}
          >
            Test Again
          </button>

          {googleBooksCount > 0 && (
            <div 
              className="mt-3 p-3 rounded-lg border-2 border-dashed"
              style={{ 
                backgroundColor: currentTheme.backgroundColor,
                borderColor: currentTheme.accentColor
              }}
            >
              <div 
                className="text-xs font-semibold mb-2"
                style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
              >
                📌 Troubleshooting Tip
              </div>
              <div 
                className="text-xs"
                style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
              >
                If your covers show "image not available", Google Books URLs may have expired. 
                Use the <span className="font-bold text-green-500">🟢 Green Button</span> below to fetch fresh covers!
              </div>
            </div>
          )}
        </>
      )}

      <div 
        className="mt-3 text-xs text-center"
        style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
      >
        Shows which Google Books covers are broken
      </div>
    </div>
  );
}
