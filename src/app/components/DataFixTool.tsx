import { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw, Calendar, CheckCircle } from 'lucide-react';

export function DataFixTool() {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [fixed, setFixed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Auto-open on mount if there are issues
  useEffect(() => {
    const books = JSON.parse(localStorage.getItem('readtrack_books') || '[]');
    const finished = books.filter((b: any) => b.status === 'finished');
    
    if (finished.length > 0) {
      // Check if dates are suspicious (all books in same month)
      const janCount = finished.filter((b: any) => {
        const date = b.finishDate || b.dateRead;
        return date && date.includes('2026') && new Date(date).getMonth() === 0;
      }).length;
      
      const febCount = finished.filter((b: any) => {
        const date = b.finishDate || b.dateRead;
        return date && date.includes('2026') && new Date(date).getMonth() === 1;
      }).length;
      
      const marchCount = finished.filter((b: any) => {
        const date = b.finishDate || b.dateRead;
        return date && date.includes('2026') && new Date(date).getMonth() === 2;
      }).length;
      
      // If all books show up in all three months (impossible), auto-open
      if (janCount === finished.length && febCount === finished.length && marchCount === finished.length) {
        setIsOpen(true);
      }
    }
  }, []);

  const runDiagnostics = () => {
    const books = JSON.parse(localStorage.getItem('readtrack_books') || '[]');
    const finished = books.filter((b: any) => b.status === 'finished');
    
    // Analyze dates
    const dateAnalysis: any = {
      january: [],
      february: [],
      march: [],
      invalid: [],
      missing: []
    };
    
    finished.forEach((book: any) => {
      const dateStr = book.finishDate || book.dateRead;
      
      if (!dateStr) {
        dateAnalysis.missing.push(book.title);
        return;
      }
      
      try {
        const date = new Date(dateStr);
        const month = date.getMonth(); // 0 = Jan, 1 = Feb, 2 = March
        const year = date.getFullYear();
        
        if (year !== 2026) {
          dateAnalysis.invalid.push({ title: book.title, date: dateStr, reason: `Year is ${year}, not 2026` });
        } else if (month === 0) {
          dateAnalysis.january.push({ title: book.title, date: dateStr });
        } else if (month === 1) {
          dateAnalysis.february.push({ title: book.title, date: dateStr });
        } else if (month === 2) {
          dateAnalysis.march.push({ title: book.title, date: dateStr });
        } else {
          dateAnalysis.invalid.push({ title: book.title, date: dateStr, reason: `Month is ${month}` });
        }
      } catch (err) {
        dateAnalysis.invalid.push({ title: book.title, date: dateStr, reason: 'Parse error' });
      }
    });
    
    setDiagnostics({
      totalFinished: finished.length,
      ...dateAnalysis
    });
  };

  const fixDates = () => {
    console.log('🔧 Starting date fix...');
    const books = JSON.parse(localStorage.getItem('readtrack_books') || '[]');
    console.log('📚 Total books in localStorage:', books.length);
    
    const finished = books.filter((b: any) => b.status === 'finished');
    console.log('✅ Finished books:', finished.length);
    
    // Log first 3 books BEFORE fix
    console.log('📅 Sample dates BEFORE fix:', finished.slice(0, 3).map(b => ({
      title: b.title,
      finishDate: b.finishDate,
      dateRead: b.dateRead
    })));
    
    // Redistribute dates evenly from Jan 1 to March 12, 2026
    const startDate = new Date('2026-01-01');
    const endDate = new Date('2026-03-12');
    const daysDiff = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    console.log('📆 Distributing across', daysDiff, 'days');
    
    let finishedIndex = 0;
    const updatedBooks = books.map((book: any) => {
      if (book.status === 'finished') {
        const dayOffset = Math.floor((daysDiff / finished.length) * finishedIndex);
        const newDate = new Date(startDate);
        newDate.setDate(newDate.getDate() + dayOffset);
        
        const formattedDate = newDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        
        console.log(`  [${finishedIndex + 1}/${finished.length}] ${book.title}: ${book.finishDate} → ${formattedDate}`);
        
        finishedIndex++;
        return { ...book, finishDate: formattedDate };
      }
      return book;
    });
    
    console.log('💾 Saving to localStorage...');
    localStorage.setItem('readtrack_books', JSON.stringify(updatedBooks));
    console.log('✅ Saved!');
    
    // Verify it saved
    const verification = JSON.parse(localStorage.getItem('readtrack_books') || '[]');
    console.log('✅ Verification - books in localStorage after save:', verification.length);
    console.log('📅 Sample dates AFTER fix:', verification.filter(b => b.status === 'finished').slice(0, 3).map(b => ({
      title: b.title,
      finishDate: b.finishDate
    })));
    
    setFixed(true);
    
    // Re-run diagnostics to show the fix
    setTimeout(() => {
      runDiagnostics();
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-red-500" />
            Data Fix Tool
          </h2>
          
          <p className="text-gray-600 mb-6">
            This tool will diagnose and fix your book dates that are showing incorrectly.
          </p>

          {!diagnostics && (
            <button
              onClick={runDiagnostics}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Run Diagnostics
            </button>
          )}

          {diagnostics && (
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-2">Diagnosis Results:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Finished Books:</span>
                    <span className="font-bold">{diagnostics.totalFinished}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">January 2026:</span>
                    <span className="font-bold">{diagnostics.january.length} books</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">February 2026:</span>
                    <span className="font-bold">{diagnostics.february.length} books</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">March 2026:</span>
                    <span className="font-bold">{diagnostics.march.length} books</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Missing Dates:</span>
                    <span className="font-bold text-red-600">{diagnostics.missing.length} books</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Invalid Dates:</span>
                    <span className="font-bold text-red-600">{diagnostics.invalid.length} books</span>
                  </div>
                </div>
              </div>

              {fixed && (
                <div className="bg-green-100 border border-green-300 rounded-lg p-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="text-green-800 font-semibold">Dates have been fixed! Refresh the page to see the changes.</span>
                </div>
              )}

              {!fixed && (
                <button
                  onClick={fixDates}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
                >
                  <Calendar className="w-5 h-5" />
                  Fix All Dates (Redistribute Evenly)
                </button>
              )}

              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg"
              >
                Refresh Page
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}