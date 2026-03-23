import { useTheme } from '../contexts/ThemeContext';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message = 'Something went wrong', onRetry }: ErrorMessageProps) {
  const { currentTheme } = useTheme();

  return (
    <div 
      className="rounded-xl p-6 text-center"
      style={{
        backgroundColor: currentTheme.cardColor,
        borderColor: currentTheme.borderColor,
        borderWidth: '1px',
      }}
    >
      <div className="flex flex-col items-center gap-3">
        <div 
          className="p-3 rounded-full"
          style={{ backgroundColor: '#fee2e2' }}
        >
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>
        
        <div>
          <h3 
            className="font-bold mb-1"
            style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
          >
            Oops!
          </h3>
          <p 
            className="text-sm"
            style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
          >
            {message}
          </p>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all"
            style={{
              backgroundColor: `${currentTheme.accentColor}20`,
              color: currentTheme.accentColor,
            }}
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
