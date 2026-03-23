import { Award, Flame, TrendingUp, Sparkles, Target, BookOpen, Clock, Zap, Star, Trophy, Heart, CheckCircle2, Moon, Coffee, Sunrise, Crown, Gem, Lock, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useBadges } from '../contexts/BadgesContext';
import { useBooks } from '../contexts/BooksContext';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: any;
  earned: boolean;
  progress: number;
  total: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
  earnedDate?: string;
}

const baseBadges: Badge[] = [
  // Reading Streaks - Common/Rare
  { id: '1', name: '7-Day Streak', description: 'Read for 7 days in a row', icon: Flame, earned: true, progress: 7, total: 7, rarity: 'common', category: 'Consistency', earnedDate: 'Feb 12, 2026' },
  { id: '2', name: '30-Day Streak', description: 'Read for 30 days straight', icon: Flame, earned: true, progress: 30, total: 30, rarity: 'rare', category: 'Consistency', earnedDate: 'Feb 15, 2026' },
  { id: '3', name: '100-Day Streak', description: 'Read for 100 days in a row', icon: Flame, earned: false, progress: 30, total: 100, rarity: 'epic', category: 'Consistency' },
  { id: '4', name: 'Year-Long Reader', description: 'Read every day for a year', icon: Crown, earned: false, progress: 30, total: 365, rarity: 'legendary', category: 'Consistency' },
  
  // Quantity Milestones
  { id: '5', name: '10 Books', description: 'Complete 10 books', icon: BookOpen, earned: true, progress: 10, total: 10, rarity: 'common', category: 'Milestones', earnedDate: 'Jan 20, 2026' },
  { id: '6', name: '25 Books', description: 'Complete 25 books', icon: BookOpen, earned: true, progress: 25, total: 25, rarity: 'common', category: 'Milestones', earnedDate: 'Feb 10, 2026' },
  { id: '7', name: '50 Books', description: 'Complete 50 books', icon: Trophy, earned: false, progress: 42, total: 50, rarity: 'rare', category: 'Milestones' },
  { id: '8', name: '100 Books', description: 'Complete 100 books', icon: Trophy, earned: false, progress: 42, total: 100, rarity: 'epic', category: 'Milestones' },
  
  // Pages Read
  { id: '9', name: '5K Pages', description: 'Read 5,000 pages', icon: Target, earned: true, progress: 5000, total: 5000, rarity: 'common', category: 'Milestones', earnedDate: 'Jan 28, 2026' },
  { id: '10', name: '10K Pages', description: 'Read 10,000 pages', icon: Target, earned: true, progress: 10000, total: 10000, rarity: 'rare', category: 'Milestones', earnedDate: 'Feb 14, 2026' },
  { id: '11', name: '25K Pages', description: 'Read 25,000 pages', icon: Zap, earned: false, progress: 12400, total: 25000, rarity: 'epic', category: 'Milestones' },
  
  // Genre Explorer
  { id: '12', name: 'Genre Explorer', description: 'Read 5 different genres', icon: Sparkles, earned: true, progress: 5, total: 5, rarity: 'common', category: 'Exploration', earnedDate: 'Feb 8, 2026' },
  { id: '13', name: 'Genre Connoisseur', description: 'Read 10 different genres', icon: Star, earned: false, progress: 5, total: 10, rarity: 'rare', category: 'Exploration' },
  { id: '14', name: 'Genre Master', description: 'Read 20 books in one genre', icon: Crown, earned: false, progress: 12, total: 20, rarity: 'epic', category: 'Exploration' },
  
  // Speed Reading
  { id: '15', name: 'Speed Reader', description: 'Finish 3 books in a week', icon: Zap, earned: true, progress: 3, total: 3, rarity: 'rare', category: 'Speed', earnedDate: 'Feb 5, 2026' },
  { id: '16', name: 'Lightning Fast', description: 'Finish a 500+ page book in 3 days', icon: Zap, earned: false, progress: 0, total: 1, rarity: 'epic', category: 'Speed' },
  
  // Time-based
  { id: '17', name: 'Night Owl', description: 'Read after midnight 10 times', icon: Moon, earned: false, progress: 6, total: 10, rarity: 'common', category: 'Habits' },
  { id: '18', name: 'Early Bird', description: 'Read before 7am 10 times', icon: Sunrise, earned: false, progress: 3, total: 10, rarity: 'common', category: 'Habits' },
  { id: '19', name: 'Weekend Warrior', description: 'Read 4 weekends in a row', icon: Coffee, earned: false, progress: 2, total: 4, rarity: 'common', category: 'Habits' },
  
  // Special
  { id: '20', name: 'Six-Star Hunter', description: 'Give 10 six-star ratings', icon: Gem, earned: false, progress: 4, total: 10, rarity: 'rare', category: 'Special' },
  { id: '21', name: 'Critic', description: 'Rate 100 books', icon: Star, earned: false, progress: 42, total: 100, rarity: 'rare', category: 'Special' },
  { id: '22', name: 'Series Completionist', description: 'Complete 5 book series', icon: CheckCircle2, earned: false, progress: 1, total: 5, rarity: 'epic', category: 'Special' },
  { id: '23', name: 'Bookworm Supreme', description: 'Read 200 books total', icon: Crown, earned: false, progress: 42, total: 200, rarity: 'legendary', category: 'Milestones' },
];

const rarityColors = {
  common: { gradient: 'from-gray-400 to-gray-500', ring: 'ring-gray-400', text: 'text-gray-400', bg: 'bg-gray-500' },
  rare: { gradient: 'from-blue-400 to-blue-600', ring: 'ring-blue-400', text: 'text-blue-400', bg: 'bg-blue-500' },
  epic: { gradient: 'from-purple-400 to-purple-600', ring: 'ring-purple-400', text: 'text-purple-400', bg: 'bg-purple-500' },
  legendary: { gradient: 'from-amber-400 to-orange-500', ring: 'ring-amber-400', text: 'text-amber-400', bg: 'bg-amber-500' }
};

export function BadgesPage({ onBack }: { onBack?: () => void }) {
  const { currentTheme } = useTheme();
  const { earnedBadges, allBadges } = useBadges();
  const { books, readingSessions } = useBooks();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Calculate real progress for each badge based on actual data
  const badges = useMemo(() => {
    const finishedBooks = books.filter(b => b.status === 'finished');
    const currentlyReading = books.filter(b => b.status === 'reading');
    
    // Calculate total pages including progress from currently reading books
    const totalPagesFromFinished = finishedBooks.reduce((sum, book) => sum + (book.pages || 0), 0);
    const totalPagesFromReading = currentlyReading.reduce((sum, book) => sum + (book.currentPage || 0), 0);
    const totalPages = totalPagesFromFinished + totalPagesFromReading;
    
    // Count genres
    const genreCounts: { [genre: string]: number } = {};
    finishedBooks.forEach(book => {
      if (book.genre) {
        genreCounts[book.genre] = (genreCounts[book.genre] || 0) + 1;
      }
    });
    const uniqueGenres = Object.keys(genreCounts).length;
    
    // Calculate streak
    const uniqueDates = new Set(
      readingSessions.map(s => new Date(s.date).toDateString())
    );
    const sortedDates = Array.from(uniqueDates).sort((a, b) => 
      new Date(b).getTime() - new Date(a).getTime()
    );
    let currentStreak = 0;
    const today = new Date();
    let checkDate = new Date(today);
    for (let i = 0; i < sortedDates.length; i++) {
      const currentDate = checkDate.toDateString();
      if (sortedDates.includes(currentDate)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    // Map BadgesContext badges to BadgesPage format with real progress
    return allBadges.map(badge => {
      let progress = 0;
      let total = badge.requirement;
      
      // Calculate progress based on badge type
      if (badge.id === 'first-book' || badge.id === '10-books' || badge.id === '50-books' || badge.id === '100-books') {
        progress = finishedBooks.length;
      } else if (badge.id.includes('streak')) {
        progress = currentStreak;
      } else if (badge.id === 'genre-explorer') {
        progress = uniqueGenres;
      } else if (badge.id === 'fantasy-fan') {
        progress = genreCounts['Fantasy'] || 0;
      } else if (badge.id === 'mystery-solver') {
        progress = genreCounts['Mystery'] || 0;
      } else if (badge.id === 'romance-reader') {
        progress = genreCounts['Romance'] || 0;
      } else if (badge.id === 'scifi-scholar') {
        progress = genreCounts['Sci-Fi'] || 0;
      } else if (badge.id === 'reviewer') {
        progress = books.filter(b => b.rating && b.rating > 0).length;
      } else if (badge.id === '5-star-fan') {
        progress = books.filter(b => b.rating === 5).length;
      } else if (badge.id === 'page-turner') {
        progress = totalPages;
        total = 10000;
      }
      
      // Determine rarity based on category and requirement
      let rarity: 'common' | 'rare' | 'epic' | 'legendary' = 'common';
      if (badge.category === 'milestone') {
        if (badge.requirement >= 100) rarity = 'epic';
        else if (badge.requirement >= 50) rarity = 'rare';
      } else if (badge.category === 'streak') {
        if (badge.requirement >= 365) rarity = 'legendary';
        else if (badge.requirement >= 100) rarity = 'epic';
        else if (badge.requirement >= 30) rarity = 'rare';
      } else if (badge.category === 'genre') {
        if (badge.requirement >= 10) rarity = 'rare';
      } else if (badge.category === 'special') {
        if (badge.requirement >= 10000) rarity = 'epic';
        else rarity = 'rare';
      }
      
      return {
        id: badge.id,
        name: badge.name,
        description: badge.description,
        icon: getIconComponent(badge.icon),
        earned: earnedBadges.includes(badge.id),
        progress,
        total,
        rarity,
        category: badge.category.charAt(0).toUpperCase() + badge.category.slice(1),
        earnedDate: earnedBadges.includes(badge.id) ? 'Recently' : undefined
      };
    });
  }, [allBadges, earnedBadges, books, readingSessions]);
  
  // Helper to convert emoji to icon component
  const getIconComponent = (emoji: string) => {
    const emojiMap: { [key: string]: any } = {
      '📖': BookOpen, '📚': BookOpen, '💯': Trophy, '🔥': Flame,
      '⚡': Zap, '👑': Crown, '🌍': Sparkles, '🐉': Sparkles,
      '🔍': Target, '💕': Heart, '🚀': TrendingUp, '🍽️': Zap,
      '🏃': Zap, '🦉': Moon, '⭐': Star, '✍️': Star,
      '📄': Target, '🌅': Sunrise
    };
    return emojiMap[emoji] || Award;
  };
  
  const categories = ['All', 'Consistency', 'Milestones', 'Exploration', 'Speed', 'Habits', 'Special'];
  
  const filteredBadges = selectedCategory === 'All' 
    ? badges 
    : badges.filter(b => b.category === selectedCategory);
  
  const earnedCount = badges.filter(b => b.earned).length;
  const totalCount = badges.length;
  const earnedPercentage = Math.round((earnedCount / totalCount) * 100);

  return (
    <div className="min-h-screen bg-gray-900 p-6 space-y-6 pb-8">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-100 transition-colors pt-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-semibold">Back to Insights</span>
        </button>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden p-6 text-white shadow-lg"
        style={{
          background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
        }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-sm">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Badge Collection</h1>
              <p className="text-white/90 text-sm">Track your reading achievements</p>
            </div>
          </div>
          
          {/* Overall Progress */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Collection Progress</span>
              <span className="text-sm">{earnedCount} / {totalCount}</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${earnedPercentage}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full bg-white rounded-full"
              />
            </div>
            <p className="text-white/80 text-xs">{earnedPercentage}% Complete · Keep collecting! 🏆</p>
          </div>
        </div>
        <div className="absolute right-4 bottom-4 opacity-10">
          <Award className="w-24 h-24" />
        </div>
      </motion.div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {categories.map((category, index) => (
          <motion.button
            key={category}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedCategory(category)}
            className="px-4 py-2 rounded-xl font-semibold text-sm whitespace-nowrap transition-all"
            style={
              selectedCategory === category
                ? {
                    background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`,
                    color: '#ffffff',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }
                : {
                    background: '#1f2937',
                    color: '#9ca3af'
                  }
            }
          >
            {category}
          </motion.button>
        ))}
      </div>

      {/* Rarity Legend */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <h3 className="text-sm font-semibold text-gray-100 mb-3">Rarity Levels</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(rarityColors).map(([rarity, colors]) => (
            <div key={rarity} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colors.gradient}`} />
              <span className="text-xs text-gray-400 capitalize">{rarity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredBadges.map((badge, index) => {
          const Icon = badge.icon;
          const colors = rarityColors[badge.rarity];
          const progressPercent = (badge.progress / badge.total) * 100;
          
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: badge.earned ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`rounded-xl p-4 relative overflow-hidden ${
                badge.earned 
                  ? `bg-gradient-to-br ${colors.gradient} text-white shadow-lg`
                  : 'bg-gray-800 border border-gray-700'
              }`}
            >
              {/* Rarity Indicator */}
              {badge.earned && (
                <div className="absolute top-2 right-2">
                  <div className={`w-2 h-2 rounded-full ${colors.bg} ring-2 ${colors.ring} ring-opacity-50`} />
                </div>
              )}
              
              {/* Locked Overlay */}
              {!badge.earned && (
                <div className="absolute top-2 right-2 opacity-50">
                  <Lock className="w-4 h-4 text-gray-500" />
                </div>
              )}
              
              {/* Badge Content */}
              <Icon className={`w-7 h-7 mb-3 ${badge.earned ? '' : 'text-gray-600'}`} />
              <h3 className={`font-bold text-sm mb-1 ${badge.earned ? '' : 'text-gray-400'}`}>
                {badge.name}
              </h3>
              <p className={`text-xs mb-3 ${badge.earned ? 'text-white/80' : 'text-gray-500'}`}>
                {badge.description}
              </p>
              
              {/* Progress Bar for Unearned */}
              {!badge.earned && (
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{badge.progress}</span>
                    <span>{badge.total}</span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className={`h-full bg-gradient-to-r ${colors.gradient}`}
                    />
                  </div>
                </div>
              )}
              
              {/* Earned Date */}
              {badge.earned && badge.earnedDate && (
                <div className="text-xs text-white/70 mt-2">
                  Earned {badge.earnedDate}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredBadges.length === 0 && (
        <div className="text-center py-12">
          <Award className="w-16 h-16 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">No badges in this category yet</p>
        </div>
      )}
    </div>
  );
}