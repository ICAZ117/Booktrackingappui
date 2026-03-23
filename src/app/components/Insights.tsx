import { useState } from 'react';
import { BarChart3, Users, Award, ChevronRight } from 'lucide-react';
import { Statistics } from './Statistics';
import { AuthorTracker } from './AuthorTracker';
import { useTheme } from '../contexts/ThemeContext';
import { useBadges } from '../contexts/BadgesContext';

export function Insights({ onNavigateToBadges, onBookSelect }: { onNavigateToBadges?: () => void; onBookSelect?: (book: any) => void }) {
  const { currentTheme } = useTheme();
  const { earnedBadges, allBadges } = useBadges();
  const [activeTab, setActiveTab] = useState<'stats' | 'authors'>('stats');

  const getGradientBg = () => {
    return currentTheme.isGradient
      ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
      : currentTheme.primary;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 
          className="text-2xl font-bold mb-1"
          style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
        >
          Insights
        </h1>
        <p 
          className="text-sm"
          style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
        >
          Your reading analytics
        </p>
      </div>

      {/* Badges Link Card */}
      {onNavigateToBadges && (
        <button
          onClick={onNavigateToBadges}
          className="w-full rounded-2xl p-5 hover:shadow-xl transition-all group relative overflow-hidden"
          style={{
            background: getGradientBg(),
          }}
        >
          {/* Animated background glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(255,255,255,0.1)' }} />
          
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white text-base mb-0.5">Badge Collection</h3>
                <p className="text-xs text-white/80 font-medium">{earnedBadges.length} / {allBadges.length} achievements unlocked</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-white/80 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      )}

      {/* Tab Switcher */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('stats')}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all"
          style={{
            background: activeTab === 'stats' ? getGradientBg() : currentTheme.cardColor,
            borderColor: activeTab === 'stats' ? 'transparent' : currentTheme.borderColor,
            borderWidth: activeTab === 'stats' ? '0' : '1px',
            color: activeTab === 'stats' ? '#ffffff' : (currentTheme.textColor === 'light' ? '#d1d5db' : '#374151'),
            boxShadow: activeTab === 'stats' ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
          }}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Statistics</span>
        </button>
        <button
          onClick={() => setActiveTab('authors')}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all"
          style={{
            background: activeTab === 'authors' ? getGradientBg() : currentTheme.cardColor,
            borderColor: activeTab === 'authors' ? 'transparent' : currentTheme.borderColor,
            borderWidth: activeTab === 'authors' ? '0' : '1px',
            color: activeTab === 'authors' ? '#ffffff' : (currentTheme.textColor === 'light' ? '#d1d5db' : '#374151'),
            boxShadow: activeTab === 'authors' ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none',
          }}
        >
          <Users className="w-4 h-4" />
          <span>Authors</span>
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'stats' ? <Statistics onBookSelect={onBookSelect} /> : <AuthorTracker />}
      </div>
    </div>
  );
}