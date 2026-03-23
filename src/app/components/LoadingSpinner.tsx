import { useTheme } from '../contexts/ThemeContext';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const { currentTheme } = useTheme();
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <Loader2 
        className={`${sizeClasses[size]} animate-spin`}
        style={{ color: currentTheme.accentColor }}
      />
      {text && (
        <p 
          className="text-sm font-medium"
          style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
        >
          {text}
        </p>
      )}
    </div>
  );
}
