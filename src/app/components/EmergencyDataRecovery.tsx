import { useState } from 'react';
import { AlertTriangle, Search, Download, RefreshCw, X } from 'lucide-react';

export function EmergencyDataRecovery() {
  const [diagnosis, setDiagnosis] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const checkAllData = () => {
    console.log('🔍 CHECKING ALL LOCALSTORAGE DATA...');
    
    // Check all possible keys
    const keys = [
      'readtrack_books',
      'books',
      'readtrack_data',
      'backup_books',
      'readtrack_books_backup'
    ];
    
    const results: any = {};
    
    keys.forEach(key => {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const parsed = JSON.parse(data);
          results[key] = {
            exists: true,
            count: Array.isArray(parsed) ? parsed.length : 'Not an array',
            sample: Array.isArray(parsed) ? parsed.slice(0, 2) : parsed,
            finished: Array.isArray(parsed) ? parsed.filter((b: any) => b.status === 'finished').length : 0
          };
          console.log(`✅ Found ${key}:`, results[key]);
        } catch (e) {
          results[key] = { exists: true, error: 'Parse error', raw: data.substring(0, 100) };
          console.log(`⚠️ Found ${key} but can't parse:`, data.substring(0, 100));
        }
      } else {
        results[key] = { exists: false };
        console.log(`❌ ${key} not found`);
      }
    });
    
    // Check ALL localStorage keys
    const allKeys = Object.keys(localStorage);
    console.log('📋 ALL localStorage keys:', allKeys);
    
    results.allKeys = allKeys;
    setDiagnosis(results);
  };

  const downloadBackup = () => {
    const allData: any = {};
    Object.keys(localStorage).forEach(key => {
      allData[key] = localStorage.getItem(key);
    });
    
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `readtrack-backup-${Date.now()}.json`;
    a.click();
  };

  const forceReload = () => {
    console.log('🔄 FORCING APP RELOAD...');
    
    // Verify data exists
    const savedBooks = localStorage.getItem('readtrack_books');
    if (savedBooks) {
      const books = JSON.parse(savedBooks);
      console.log(`✅ Confirmed: ${books.length} books in localStorage`);
      console.log('🔄 Reloading page to restore data...');
      
      // Force a hard refresh
      window.location.reload();
    } else {
      alert('❌ No books found in localStorage! Your data may have been lost.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto relative">
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full p-2 z-10"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-6">
          <h2 className="text-3xl font-bold text-red-600 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-8 h-8" />
            Emergency Data Recovery
          </h2>
          
          <p className="text-gray-700 mb-6 text-lg">
            Don't panic! Let's find your data and restore it.
          </p>

          <div className="flex gap-3 mb-6">
            <button
              onClick={checkAllData}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2"
            >
              <Search className="w-6 h-6" />
              Check All Data
            </button>
            
            <button
              onClick={downloadBackup}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2"
            >
              <Download className="w-6 h-6" />
              Download Backup
            </button>
          </div>

          {diagnosis && diagnosis.readtrack_books && diagnosis.readtrack_books.count > 0 && (
            <div className="mb-6">
              <button
                onClick={forceReload}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-5 px-8 rounded-xl flex items-center justify-center gap-3 text-xl shadow-lg animate-pulse"
              >
                <RefreshCw className="w-8 h-8" />
                Force Reload App ({diagnosis.readtrack_books.count} books found!)
              </button>
              <p className="text-center text-sm text-gray-600 mt-2">
                ✅ Your {diagnosis.readtrack_books.count} books are safe! Click to reload the app and restore them.
              </p>
            </div>
          )}

          {diagnosis && (
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="font-bold text-xl text-gray-900 mb-3">Data Found:</h3>
                
                {Object.entries(diagnosis).map(([key, value]: [string, any]) => {
                  if (key === 'allKeys') {
                    return (
                      <div key={key} className="mt-4 p-3 bg-white rounded border border-gray-300">
                        <div className="font-semibold text-sm text-gray-700 mb-2">
                          All localStorage keys ({value.length}):
                        </div>
                        <div className="text-xs text-gray-600 space-y-1 max-h-40 overflow-auto">
                          {value.map((k: string) => (
                            <div key={k} className="font-mono">{k}</div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  
                  if (value.exists) {
                    return (
                      <div key={key} className="mb-4 p-3 bg-white rounded border-2 border-green-500">
                        <div className="font-bold text-green-700 mb-2 flex items-center justify-between">
                          <span>✅ {key}</span>
                          {value.count !== undefined && (
                            <span className="text-2xl font-bold">{value.count} books</span>
                          )}
                        </div>
                        {value.finished > 0 && (
                          <div className="text-sm text-gray-600 mb-2">
                            📚 {value.finished} finished books
                          </div>
                        )}
                        {value.sample && (
                          <div className="text-xs text-gray-500 font-mono bg-gray-50 p-2 rounded overflow-auto max-h-40">
                            {JSON.stringify(value.sample, null, 2)}
                          </div>
                        )}
                        {value.error && (
                          <div className="text-xs text-red-600 mt-2">
                            Error: {value.error}
                          </div>
                        )}
                      </div>
                    );
                  } else {
                    return (
                      <div key={key} className="mb-2 p-2 bg-gray-200 rounded text-sm text-gray-500">
                        ❌ {key} - not found
                      </div>
                    );
                  }
                })}
              </div>

              <div className="bg-yellow-100 border-2 border-yellow-500 rounded-lg p-4">
                <h3 className="font-bold text-yellow-800 mb-2">Next Steps:</h3>
                <ol className="list-decimal list-inside text-sm text-yellow-900 space-y-1">
                  <li>Check the console (F12) for detailed logs</li>
                  <li>Look for any key with a count greater than 0 above</li>
                  <li>Download backup to save your data</li>
                  <li>Copy the key name that has your books</li>
                  <li>Tell me which key has your data</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}