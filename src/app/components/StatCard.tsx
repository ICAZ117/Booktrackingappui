import { LucideIcon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtext?: string;
  gradient?: boolean;
}

export function StatCard({ icon: Icon, label, value, subtext, gradient = false }: StatCardProps) {
  const { currentTheme } = useTheme();
  
  const getGradientBg = () => {
    return currentTheme.isGradient
      ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
      : currentTheme.primary;
  };
  
  return (
    <div 
      className="rounded-xl p-4 shadow-sm"
      style={{
        background: gradient ? getGradientBg() : currentTheme.cardColor,
        borderColor: gradient ? 'transparent' : currentTheme.borderColor,
        borderWidth: gradient ? '0' : '1px',
        color: gradient ? '#ffffff' : (currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827'),
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div 
          className="p-2 rounded-lg"
          style={{
            backgroundColor: gradient ? 'rgba(255,255,255,0.2)' : `${currentTheme.accentColor}20`,
          }}
        >
          <Icon 
            className="w-4 h-4" 
            style={{ 
              color: gradient ? '#ffffff' : currentTheme.accentColor 
            }} 
          />
        </div>
      </div>
      <div 
        className="text-2xl font-bold mb-0.5"
        style={{ 
          color: gradient ? '#ffffff' : (currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827') 
        }}
      >
        {value}
      </div>
      <div 
        className="text-xs"
        style={{ 
          color: gradient ? 'rgba(255,255,255,0.8)' : (currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280') 
        }}
      >
        {label}
      </div>
      {subtext && (
        <div 
          className="text-[10px] mt-1"
          style={{ 
            color: gradient ? 'rgba(255,255,255,0.6)' : (currentTheme.textColor === 'light' ? '#6b7280' : '#9ca3af') 
          }}
        >
          {subtext}
        </div>
      )}
    </div>
  );
}
