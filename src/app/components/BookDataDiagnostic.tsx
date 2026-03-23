import { useState } from 'react';
import { useBooks } from '../contexts/BooksContext';
import { useTheme } from '../contexts/ThemeContext';
import { Book, AlertCircle, CheckCircle, XCircle, Download } from 'lucide-react';

export function BookDataDiagnostic() {
  const { books } = useBooks();
  const { currentTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const analyzeBooks = () => {
    const analysis = {
      total: books.length,
      withCovers: books.filter(b => b.cover && b.cover.startsWith('http') && !b.cover.includes('unsplash')).length,
      missingCovers: books.filter(b => !b.cover || !b.cover.startsWith('http')).length,
      unsplashCovers: books.filter(b => b.cover && b.cover.includes('unsplash')).length,
      withISBN: books.filter(b => b.isbn).length,
      withPages: books.filter(b => b.pages && b.pages > 0).length,
      withAuthor: books.filter(b => b.author && b.author !== 'Unknown').length,
    };

    return analysis;
  };

  const exportRawData = () => {
    const data = books.map(b => ({
      title: b.title,
      author: b.author,
      isbn: b.isbn || 'MISSING',
      cover: b.cover || 'MISSING',
      pages: b.pages || 'MISSING',
      coverSource: b.cover ? (
        b.cover.includes('openlibrary') ? 'OpenLibrary' :
        b.cover.includes('googleapis') ? 'Google Books' :
        b.cover.includes('unsplash') ? 'PLACEHOLDER' :
        'Unknown'
      ) : 'MISSING'
    }));

    const csv = [
      'Title,Author,ISBN,Pages,Cover URL,Cover Source',
      ...data.map(b => `"${b.title}","${b.author}","${b.isbn}",${b.pages},"${b.cover}","${b.coverSource}"`)
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `readtrack-diagnostic-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const analysis = analyzeBooks();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-50 p-3 rounded-full shadow-lg"
        style={{ backgroundColor: '#ef4444' }}
      >
        <AlertCircle className="w-6 h-6 text-white" />
      </button>
    );
  }

  return (
    <div 
      className="fixed bottom-24 right-4 z-50 p-6 rounded-2xl shadow-2xl max-w-md"
      style={{ 
        backgroundColor: currentTheme.cardColor,
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: '#ef4444'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <h3 
            className="font-bold"
            style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
          >
            Book Data Diagnostic
          </h3>
        </div>
        <button onClick={() => setIsOpen(false)}>
          <XCircle className="w-5 h-5" style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }} />
        </button>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}>
            Total Books
          </span>
          <span 
            className="font-bold"
            style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
          >
            {analysis.total}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}>
            ✅ Valid Covers
          </span>
          <span className="font-bold text-green-500">
            {analysis.withCovers} ({Math.round(analysis.withCovers / analysis.total * 100)}%)
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}>
            ❌ Missing Covers
          </span>
          <span className="font-bold text-red-500">
            {analysis.missingCovers} ({Math.round(analysis.missingCovers / analysis.total * 100)}%)
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}>
            🖼️ Placeholder Covers
          </span>
          <span className="font-bold text-yellow-500">
            {analysis.unsplashCovers} ({Math.round(analysis.unsplashCovers / analysis.total * 100)}%)
          </span>
        </div>

        <hr style={{ borderColor: currentTheme.borderColor }} />

        <div className="flex items-center justify-between">
          <span style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}>
            With ISBN
          </span>
          <span 
            className="font-bold"
            style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
          >
            {analysis.withISBN} ({Math.round(analysis.withISBN / analysis.total * 100)}%)
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}>
            With Pages
          </span>
          <span 
            className="font-bold"
            style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
          >
            {analysis.withPages} ({Math.round(analysis.withPages / analysis.total * 100)}%)
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}>
            With Author
          </span>
          <span 
            className="font-bold"
            style={{ color: currentTheme.textColor === 'light' ? '#ffffff' : '#111827' }}
          >
            {analysis.withAuthor} ({Math.round(analysis.withAuthor / analysis.total * 100)}%)
          </span>
        </div>
      </div>

      <button
        onClick={exportRawData}
        className="w-full py-3 rounded-xl flex items-center justify-center gap-2 font-semibold transition-transform hover:scale-[1.02]"
        style={{ backgroundColor: currentTheme.accentColor, color: '#ffffff' }}
      >
        <Download className="w-4 h-4" />
        Export Full Data (CSV)
      </button>

      <div 
        className="mt-3 text-xs text-center"
        style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
      >
        This shows what's actually in your data
      </div>
    </div>
  );
}
