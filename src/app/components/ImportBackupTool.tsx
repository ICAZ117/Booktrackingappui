import { useState } from 'react';
import { Upload, CheckCircle, XCircle } from 'lucide-react';

export function ImportBackupTool() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState<any>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const backup = JSON.parse(text);

      console.log('📦 Backup file loaded:', Object.keys(backup));

      // Restore each key from backup
      let restoredKeys = 0;
      const stats: any = {};

      Object.entries(backup).forEach(([key, value]) => {
        if (key.startsWith('readtrack_')) {
          localStorage.setItem(key, value as string);
          restoredKeys++;
          
          // Parse and count items
          try {
            const parsed = JSON.parse(value as string);
            if (Array.isArray(parsed)) {
              stats[key] = parsed.length;
            }
          } catch (e) {
            // Not JSON, just count as 1 item
            stats[key] = 1;
          }
        }
      });

      console.log('✅ Restored keys:', stats);
      
      setStats(stats);
      setStatus('success');
      setMessage(`Successfully restored ${restoredKeys} data keys!`);
      
      // Auto-reload after 2 seconds
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (error) {
      console.error('❌ Import error:', error);
      setStatus('error');
      setMessage('Failed to import backup. Please check the file format.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Upload className="w-6 h-6" />
        Import Backup
      </h2>

      <p className="text-gray-600 mb-6">
        Upload your backup JSON file to restore all your data with correct dates.
      </p>

      <label className="block">
        <input
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-3 file:px-6
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-gradient-to-r file:from-blue-600 file:to-purple-600
            file:text-white
            hover:file:from-blue-700 hover:file:to-purple-700
            file:cursor-pointer
            cursor-pointer"
        />
      </label>

      {status === 'success' && (
        <div className="mt-6 p-4 bg-green-100 border-2 border-green-500 rounded-lg">
          <div className="flex items-center gap-2 text-green-800 font-bold mb-2">
            <CheckCircle className="w-5 h-5" />
            {message}
          </div>
          {stats && (
            <div className="text-sm text-green-700 space-y-1">
              {Object.entries(stats).map(([key, count]) => (
                <div key={key}>
                  ✓ {key}: {count} items
                </div>
              ))}
              <div className="mt-4 text-green-800 font-semibold animate-pulse">
                🔄 Reloading app in 2 seconds...
              </div>
            </div>
          )}
        </div>
      )}

      {status === 'error' && (
        <div className="mt-6 p-4 bg-red-100 border-2 border-red-500 rounded-lg">
          <div className="flex items-center gap-2 text-red-800 font-bold">
            <XCircle className="w-5 h-5" />
            {message}
          </div>
        </div>
      )}
    </div>
  );
}
