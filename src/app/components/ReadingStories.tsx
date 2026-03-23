import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Book, Headphones, BookOpen, Target, Calendar, X, ChevronLeft, ChevronRight, Star, TrendingUp, Users, Clock, Award, PieChart, Zap, FileText, Sparkles, Heart, Share2, Download } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { BookCover } from './BookCover';

interface Story {
  id: string;
  icon: any;
  label: string;
  component: React.ReactNode;
}

interface ReadingStoriesProps {
  stories: Story[];
}

export function ReadingStories({ stories }: ReadingStoriesProps) {
  const { currentTheme } = useTheme();
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  const openStory = (index: number) => {
    setActiveStoryIndex(index);
    setProgress(0);
  };

  const closeStory = () => {
    setActiveStoryIndex(null);
    setProgress(0);
  };

  const nextStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
      setProgress(0);
    } else {
      closeStory();
    }
  };

  const prevStory = () => {
    if (activeStoryIndex !== null && activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
      setProgress(0);
    }
  };

  const getGradientBorder = () => {
    return currentTheme.isGradient
      ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
      : currentTheme.primary;
  };

  return (
    <>
      {/* Story Circles */}
      <div className="flex gap-4 overflow-x-auto pb-2 px-1 -mx-1">
        {stories.map((story, index) => {
          const Icon = story.icon;
          return (
            <button
              key={story.id}
              onClick={() => openStory(index)}
              className="flex flex-col items-center gap-2 flex-shrink-0 group"
            >
              {/* Circle with gradient border */}
              <div
                className="relative w-16 h-16 rounded-full p-0.5"
                style={{ background: getGradientBorder() }}
              >
                <div
                  className="w-full h-full rounded-full flex items-center justify-center"
                  style={{ backgroundColor: currentTheme.cardColor }}
                >
                  <Icon 
                    className="w-7 h-7" 
                    style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
                  />
                </div>
              </div>
              
              {/* Label */}
              <div 
                className="text-xs font-medium max-w-[64px] text-center line-clamp-2"
                style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
              >
                {story.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Story Viewer */}
      <AnimatePresence>
        {activeStoryIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            onClick={(e) => {
              // Close if clicking the background
              if (e.target === e.currentTarget) {
                closeStory();
              }
            }}
          >
            {/* Progress bars */}
            <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
              {stories.map((_, index) => (
                <div
                  key={index}
                  className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
                >
                  {index < activeStoryIndex! ? (
                    <div className="w-full h-full bg-white" />
                  ) : index === activeStoryIndex ? (
                    <motion.div
                      className="h-full bg-white"
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 5, ease: 'linear' }}
                      onAnimationComplete={nextStory}
                    />
                  ) : null}
                </div>
              ))}
            </div>

            {/* Close button */}
            <button
              onClick={closeStory}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Navigation areas */}
            <button
              onClick={prevStory}
              className="absolute left-0 top-0 bottom-0 w-1/3 z-10"
              style={{ background: 'transparent' }}
            />
            <button
              onClick={nextStory}
              className="absolute right-0 top-0 bottom-0 w-1/3 z-10"
              style={{ background: 'transparent' }}
            />

            {/* Story content */}
            <motion.div
              key={activeStoryIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-[430px] h-full flex items-center justify-center p-4"
            >
              {stories[activeStoryIndex].component}
            </motion.div>

            {/* Navigation hints */}
            {activeStoryIndex > 0 && (
              <button
                onClick={prevStory}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
            )}
            {activeStoryIndex < stories.length - 1 && (
              <button
                onClick={nextStory}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Individual story components
export function StreakStory({ streak, cardColor }: { streak: number; cardColor: string }) {
  const { currentTheme } = useTheme();
  
  return (
    <div
      className="w-full rounded-3xl p-8 shadow-2xl flex items-center justify-center"
      style={{
        background: currentTheme.isGradient
          ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
          : currentTheme.primary,
        minHeight: '500px',
      }}
    >
      <div className="flex flex-col items-center justify-center text-white">
        <Flame className="w-24 h-24 mb-4" />
        <div className="text-7xl font-bold mb-2">{streak}</div>
        <div className="text-2xl font-semibold mb-1">
          {streak === 1 ? 'Day Streak' : 'Days Streak'}
        </div>
        <div className="text-lg opacity-80">🔥 Keep it going!</div>
        <div className="text-xs opacity-60 mt-2">2026</div>
        {streak > 0 && (
          <div className="mt-8 text-center">
            <div className="text-sm opacity-80">
              {streak >= 30 ? "You're a reading champion! 🏆" : 
               streak >= 14 ? "Two weeks strong! 💪" :
               streak >= 7 ? "One week down! 🎉" :
               "Great start! Keep reading! 📚"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function BooksStory({ booksCount, booksThisMonth, cardColor }: { booksCount: number; booksThisMonth: number; cardColor: string }) {
  const { currentTheme } = useTheme();
  
  return (
    <div
      className="w-full rounded-3xl p-8 shadow-2xl flex items-center justify-center"
      style={{
        background: currentTheme.isGradient
          ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
          : currentTheme.primary,
        minHeight: '500px',
      }}
    >
      <div className="flex flex-col items-center justify-center text-white">
        <Book className="w-24 h-24 mb-4" />
        <div className="text-7xl font-bold mb-2">{booksCount}</div>
        <div className="text-2xl font-semibold mb-1">Books in 2026</div>
        {booksThisMonth > 0 && (
          <div className="text-lg opacity-80">+{booksThisMonth} this month 📖</div>
        )}
        {booksCount >= 52 && (
          <div className="mt-8 text-center">
            <div className="text-xl font-semibold mb-2">🎯 Goal Achieved!</div>
            <div className="text-sm opacity-80">You've hit the classic book-a-week goal!</div>
          </div>
        )}
      </div>
    </div>
  );
}

export function AudiobooksStory({ hours, audiobookCount, cardColor }: { hours: number; audiobookCount: number; cardColor: string }) {
  const { currentTheme } = useTheme();
  
  return (
    <div
      className="w-full rounded-3xl p-8 shadow-2xl flex items-center justify-center"
      style={{
        background: currentTheme.isGradient
          ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
          : currentTheme.primary,
        minHeight: '500px',
      }}
    >
      <div className="flex flex-col items-center justify-center text-white">
        <Headphones className="w-24 h-24 mb-4" />
        <div className="text-7xl font-bold mb-2">{hours}h</div>
        <div className="text-2xl font-semibold mb-1">Listening Time in 2026</div>
        {audiobookCount > 0 ? (
          <div className="text-lg opacity-80">{audiobookCount} audiobooks 🎧</div>
        ) : (
          <div className="text-lg opacity-80">Start an audiobook! 🎧</div>
        )}
        {hours >= 50 && (
          <div className="mt-8 text-center">
            <div className="text-sm opacity-80">
              That's {Math.round(hours / 24)} days of pure listening! 🎵
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function PagesStory({ pages, avgPerDay, cardColor }: { pages: number; avgPerDay: number; cardColor: string }) {
  const { currentTheme } = useTheme();
  const pagesFormatted = pages >= 1000 ? `${(pages / 1000).toFixed(1)}k` : pages.toString();
  
  return (
    <div
      className="w-full rounded-3xl p-8 shadow-2xl flex items-center justify-center"
      style={{
        background: currentTheme.isGradient
          ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
          : currentTheme.primary,
        minHeight: '500px',
      }}
    >
      <div className="flex flex-col items-center justify-center text-white">
        <BookOpen className="w-24 h-24 mb-4" />
        <div className="text-7xl font-bold mb-2">{pagesFormatted}</div>
        <div className="text-2xl font-semibold mb-1">Pages Read in 2026</div>
        {avgPerDay > 0 && (
          <div className="text-lg opacity-80">Avg. {avgPerDay}/day 📄</div>
        )}
        {pages >= 10000 && (
          <div className="mt-8 text-center">
            <div className="text-xl font-semibold mb-2">🌟 Amazing!</div>
            <div className="text-sm opacity-80">
              That's like reading {Math.round(pages / 300)} average novels!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function ThisWeekStory({ 
  readingDays, 
  onDayToggle, 
  cardColor 
}: { 
  readingDays: boolean[]; 
  onDayToggle: (index: number) => void; 
  cardColor: string;
}) {
  const { currentTheme } = useTheme();
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const completedDays = readingDays.filter(Boolean).length;
  
  return (
    <div
      className="w-full rounded-3xl p-8 shadow-2xl flex items-center justify-center"
      style={{
        background: currentTheme.isGradient
          ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
          : currentTheme.primary,
        minHeight: '500px',
      }}
    >
      <div className="flex flex-col items-center justify-center text-white w-full max-w-md">
        <Calendar className="w-24 h-24 mb-6" />
        <div className="text-2xl font-semibold mb-8">This Week's Reading</div>
        
        <div className="flex gap-2.5 mb-8 justify-center w-full px-2">
          {daysOfWeek.map((day, index) => {
            const isCompleted = readingDays[index];
            return (
              <button
                key={index}
                onClick={() => onDayToggle(index)}
                className="flex flex-col items-center gap-2 transition-all"
              >
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center relative transition-all text-lg font-bold"
                  style={{
                    backgroundColor: isCompleted ? 'white' : 'rgba(255, 255, 255, 0.2)',
                    color: isCompleted ? currentTheme.primary : 'white',
                  }}
                >
                  {isCompleted && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      ✓
                    </motion.div>
                  )}
                </div>
                <div className="text-xs font-semibold opacity-80">{day}</div>
              </button>
            );
          })}
        </div>

        <div className="text-center">
          <div className="text-5xl font-bold mb-2">{completedDays}/7</div>
          <div className="text-lg opacity-80">
            {completedDays === 7 ? "Perfect week! 🎉" :
             completedDays >= 5 ? "Almost there! 💪" :
             completedDays >= 3 ? "Good progress! 📚" :
             "Keep going! 🌟"}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReadingGoalsStory({ 
  goals, 
  progress 
}: { 
  goals: any;
  progress: any;
}) {
  const { currentTheme } = useTheme();
  
  return (
    <div
      className="w-full rounded-3xl p-6 shadow-2xl overflow-y-auto"
      style={{
        background: currentTheme.isGradient
          ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
          : currentTheme.primary,
        minHeight: '500px',
        maxHeight: '85vh',
      }}
    >
      <div className="text-white">
        <div className="flex items-center gap-3 mb-2">
          <Target className="w-10 h-10" />
          <h2 className="text-3xl font-bold">Reading Goals</h2>
        </div>
        <p className="text-sm opacity-80 mb-6">2026 Progress</p>

        {/* Today */}
        {(goals.daily.pages.enabled || goals.daily.minutes.enabled) && (
          <div className="mb-6">
            <div className="text-sm font-semibold mb-3 opacity-80">TODAY</div>
            {goals.daily.pages.enabled && (
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span>Pages</span>
                  <span className="font-bold">{progress.daily.pages} / {goals.daily.pages.value}</span>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${Math.min(100, (progress.daily.pages / goals.daily.pages.value) * 100)}%` }}
                  />
                </div>
              </div>
            )}
            {goals.daily.minutes.enabled && (
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span>Minutes</span>
                  <span className="font-bold">{progress.daily.minutes} / {goals.daily.minutes.value}</span>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${Math.min(100, (progress.daily.minutes / goals.daily.minutes.value) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* This Month */}
        {(goals.monthly.books.enabled || goals.monthly.pages.enabled) && (
          <div className="mb-6">
            <div className="text-sm font-semibold mb-3 opacity-80">THIS MONTH</div>
            {goals.monthly.books.enabled && (
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span>Books</span>
                  <span className="font-bold">{progress.monthly.books} / {goals.monthly.books.value}</span>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${Math.min(100, (progress.monthly.books / goals.monthly.books.value) * 100)}%` }}
                  />
                </div>
              </div>
            )}
            {goals.monthly.pages.enabled && (
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span>Pages</span>
                  <span className="font-bold">{progress.monthly.pages} / {goals.monthly.pages.value}</span>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${Math.min(100, (progress.monthly.pages / goals.monthly.pages.value) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* This Year */}
        {(goals.yearly.books.enabled || goals.yearly.pages.enabled) && (
          <div>
            <div className="text-sm font-semibold mb-3 opacity-80">THIS YEAR (2026)</div>
            {goals.yearly.books.enabled && (
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span>Books</span>
                  <span className="font-bold">{progress.yearly.books} / {goals.yearly.books.value}</span>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${Math.min(100, (progress.yearly.books / goals.yearly.books.value) * 100)}%` }}
                  />
                </div>
              </div>
            )}
            {goals.yearly.pages.enabled && (
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span>Pages</span>
                  <span className="font-bold">{progress.yearly.pages >= 1000 ? `${(progress.yearly.pages/1000).toFixed(1)}k` : progress.yearly.pages} / {goals.yearly.pages.value >= 1000 ? `${(goals.yearly.pages.value/1000).toFixed(0)}k` : goals.yearly.pages.value}</span>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${Math.min(100, (progress.yearly.pages / goals.yearly.pages.value) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function DetailedStatsStory({ stats }: { stats: any }) {
  const { currentTheme } = useTheme();
  
  const statCards = [
    { icon: Clock, label: 'Daily Avg Time', value: `${stats.avgTimeMinutes}m`, color: '#dbeafe' },
    { icon: TrendingUp, label: 'Total Pages', value: stats.totalPages, color: '#e0e7ff' },
    { icon: Star, label: '5-Star Books', value: stats.fiveStarBooks, color: '#fce7f3' },
    { icon: Users, label: 'Authors', value: stats.uniqueAuthors, color: '#ede9fe' },
    { icon: Award, label: 'Badges Earned', value: `${stats.badgesEarned} / ${stats.totalBadges}`, color: '#dcfce7' },
    { icon: FileText, label: 'Reading Days', value: stats.readingDays, color: '#fef3c7' },
  ];
  
  return (
    <div
      className="w-full rounded-3xl p-6 shadow-2xl overflow-y-auto"
      style={{
        background: currentTheme.isGradient
          ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
          : currentTheme.primary,
        minHeight: '500px',
        maxHeight: '85vh',
      }}
    >
      <div className="text-white">
        <h2 className="text-3xl font-bold mb-2">Detailed Stats</h2>
        <p className="text-sm opacity-80 mb-6">2026 Overview</p>
        
        <div className="grid grid-cols-2 gap-3">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-2xl p-4"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
              >
                <Icon className="w-6 h-6 mb-2" />
                <div className="text-xs opacity-80 mb-1">{stat.label}</div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function MonthlyRecapStory({ 
  month, 
  year, 
  books, 
  stats 
}: { 
  month: string;
  year: number;
  books: any[];
  stats: any;
}) {
  const { currentTheme } = useTheme();
  
  return (
    <div
      className="w-full rounded-3xl p-6 shadow-2xl overflow-y-auto"
      style={{
        background: currentTheme.isGradient
          ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
          : currentTheme.primary,
        minHeight: '500px',
        maxHeight: '85vh',
      }}
    >
      <div className="text-white">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-8 h-8" />
          <h2 className="text-3xl font-bold">{month} {year}</h2>
        </div>
        <p className="text-sm opacity-80 mb-6">Reading Recap</p>

        {/* Stats Cards */}
        <div className="space-y-3 mb-6">
          <div className="rounded-2xl p-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Book className="w-5 h-5" />
                <span>Books Finished</span>
              </div>
              <span className="text-3xl font-bold">{stats.booksFinished}</span>
            </div>
          </div>
          
          <div className="rounded-2xl p-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>Pages Read</span>
              </div>
              <span className="text-3xl font-bold">{stats.pagesRead.toLocaleString()}</span>
            </div>
          </div>

          <div className="rounded-2xl p-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5" />
                <span>Reading Days</span>
              </div>
              <span className="text-3xl font-bold">{stats.readingDays}</span>
            </div>
          </div>

          {stats.favoriteGenre && (
            <div className="rounded-2xl p-4 text-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
              <div className="text-sm opacity-80 mb-1">Favorite Genre</div>
              <div className="text-xl font-bold">{stats.favoriteGenre}</div>
            </div>
          )}
        </div>

        {/* Book Covers */}
        {books.length > 0 && (
          <div>
            <div className="text-sm font-semibold mb-3 opacity-80">{books.length} BOOKS READ</div>
            <div className="grid grid-cols-4 gap-2">
              {books.slice(0, 8).map((book, index) => (
                <div key={index} className="aspect-[2/3] rounded-lg overflow-hidden shadow-md">
                  <BookCover 
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function YearInReviewStory({ 
  year, 
  stats 
}: { 
  year: number;
  stats: any;
}) {
  const { currentTheme } = useTheme();
  
  return (
    <div
      className="w-full rounded-3xl p-8 shadow-2xl"
      style={{
        background: currentTheme.isGradient
          ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
          : currentTheme.primary,
        minHeight: '500px',
      }}
    >
      <div className="flex flex-col items-center justify-center h-full text-white">
        <Sparkles className="w-16 h-16 mb-4" />
        <div className="text-5xl font-bold mb-2">{year}</div>
        <div className="text-xl font-semibold mb-8 opacity-90">Year in Books</div>

        {/* Big stat */}
        <div className="w-full rounded-2xl p-6 mb-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
          <div className="text-6xl font-bold mb-2">{stats.booksRead}</div>
          <div className="text-lg opacity-90">Books Read</div>
        </div>

        {/* Grid stats */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <div className="rounded-2xl p-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
            <div className="text-3xl font-bold mb-1">{stats.pagesFormatted}</div>
            <div className="text-sm opacity-90">Pages</div>
          </div>
          <div className="rounded-2xl p-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
            <div className="text-3xl font-bold mb-1">{stats.avgRating}⭐</div>
            <div className="text-sm opacity-90">Avg Rating</div>
          </div>
        </div>

        <div className="w-full rounded-2xl p-4 mt-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
          <div className="text-3xl font-bold mb-1">{stats.timeReading}</div>
          <div className="text-sm opacity-90">Time Reading</div>
        </div>
      </div>
    </div>
  );
}

export function TopBooksStory({ 
  month, 
  year,
  books 
}: { 
  month: string;
  year: number;
  books: any[];
}) {
  const { currentTheme } = useTheme();
  const [showShareButtons, setShowShareButtons] = useState(false);
  
  const handleShare = async () => {
    // Create a shareable text
    const text = `My Top 3 Books of ${month} ${year}:\\n\\n${books.slice(0, 3).map((b, i) => `${i + 1}. ${b.title} by ${b.author} ${'⭐'.repeat(b.rating)}`).join('\\n')}\\n\\n📚 ReadTrack`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Top 3 Books - ${month} ${year}`,
          text: text,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    }
  };
  
  const handleDownload = () => {
    // TODO: Implement canvas-based image download
    alert('Download feature coming soon!');
  };
  
  return (
    <div
      className="w-full rounded-3xl p-6 shadow-2xl overflow-y-auto relative"
      style={{
        background: currentTheme.isGradient
          ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
          : currentTheme.primary,
        minHeight: '500px',
        maxHeight: '85vh',
      }}
    >
      <div className="text-white">
        {/* Header with action buttons */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8" />
            <div>
              <h2 className="text-3xl font-bold">Top 3 Books</h2>
              <p className="text-sm opacity-80">Best of {month} {year}</p>
            </div>
          </div>
          
          {/* Share and Download buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="space-y-3 mt-6">
          {books.slice(0, 3).map((book, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              className="rounded-2xl p-4 flex items-center gap-4"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                {index + 1}
              </div>
              
              <div className="aspect-[2/3] w-20 rounded-lg overflow-hidden shadow-md flex-shrink-0">
                <BookCover 
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-bold text-lg mb-1 truncate">{book.title}</div>
                <div className="text-sm opacity-80 mb-2 truncate">{book.author}</div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-4 h-4" 
                      fill={i < book.rating ? 'currentColor' : 'none'}
                      strokeWidth={i < book.rating ? 0 : 2}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Watermark at bottom */}
        <div className="text-center mt-8 opacity-60 text-sm">
          @readtrack_user · ReadTrack
        </div>
      </div>
    </div>
  );
}

export function StreakDetailsStory({ 
  currentStreak,
  longestStreak,
  yearPercentage 
}: { 
  currentStreak: number;
  longestStreak: number;
  yearPercentage: number;
}) {
  const { currentTheme } = useTheme();
  
  return (
    <div
      className="w-full rounded-3xl p-8 shadow-2xl"
      style={{
        background: currentTheme.isGradient
          ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
          : currentTheme.primary,
        minHeight: '500px',
      }}
    >
      <div className="flex flex-col items-center justify-center h-full text-white">
        <Flame className="w-12 h-12 mb-4" />
        <h2 className="text-3xl font-bold mb-2">Reading Streak</h2>
        <p className="text-sm opacity-80 mb-8">2026 Stats • Keep it going!</p>

        {/* Big number */}
        <div className="text-[120px] leading-none font-bold mb-2">{currentStreak}</div>
        <div className="text-2xl font-semibold mb-8">Day Streak 🔥</div>

        {/* Stats grid */}
        <div className="w-full space-y-3">
          <div className="rounded-2xl p-6 text-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
            <div className="text-5xl font-bold mb-2">{currentStreak}</div>
            <div className="text-base opacity-90">Current Streak</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl p-4 text-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
              <div className="text-4xl font-bold mb-2">{longestStreak}</div>
              <div className="text-sm opacity-90">Longest</div>
            </div>
            <div className="rounded-2xl p-4 text-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
              <div className="text-4xl font-bold mb-2">{yearPercentage}%</div>
              <div className="text-sm opacity-90">This Year</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function GenreBreakdownStory({ 
  month,
  year,
  genres 
}: { 
  month: string;
  year: number;
  genres: { name: string; count: number; }[];
}) {
  const { currentTheme } = useTheme();
  const maxCount = Math.max(...genres.map(g => g.count));
  
  const handleShare = async () => {
    const text = `Genre Breakdown - ${month} ${year}\n\n${genres.slice(0, 8).map((g, i) => `${i + 1}. ${g.name}: ${g.count} ${g.count === 1 ? 'book' : 'books'}`).join('\n')}\n\n📚 ReadTrack`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Genre Breakdown - ${month} ${year}`,
          text: text,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    }
  };
  
  const handleDownload = () => {
    alert('Download feature coming soon!');
  };
  
  return (
    <div
      className="w-full rounded-3xl p-6 shadow-2xl overflow-y-auto relative"
      style={{
        background: currentTheme.isGradient
          ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
          : currentTheme.primary,
        minHeight: '500px',
        maxHeight: '85vh',
      }}
    >
      <div className="text-white">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <PieChart className="w-8 h-8" />
            <div>
              <h2 className="text-3xl font-bold">Genre Breakdown</h2>
              <p className="text-sm opacity-80">{month} {year}</p>
            </div>
          </div>
          
          {/* Share and Download buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="mt-6"></div>

        <div className="space-y-3">
          {genres.slice(0, 8).map((genre, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl p-4"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{genre.name}</span>
                <span className="text-2xl font-bold">{genre.count}</span>
              </div>
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(genre.count / maxCount) * 100}%` }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ReadingSpeedStory({ 
  month,
  year,
  stats 
}: { 
  month: string;
  year: number;
  stats: {
    pagesPerDay: number;
    minutesPerDay: number;
    daysPerBook: number;
    fastestRead: { title: string; time: string } | null;
  };
}) {
  const { currentTheme } = useTheme();
  
  return (
    <div
      className="w-full rounded-3xl p-8 shadow-2xl"
      style={{
        background: currentTheme.isGradient
          ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
          : currentTheme.primary,
        minHeight: '500px',
      }}
    >
      <div className="flex flex-col items-center justify-center h-full text-white">
        <Zap className="w-12 h-12 mb-4" />
        <h2 className="text-3xl font-bold mb-2">Reading Speed</h2>
        <p className="text-sm opacity-80 mb-8">{month} {year}</p>

        {/* Big stat */}
        <div className="w-full rounded-2xl p-6 mb-4 text-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
          <div className="text-6xl font-bold mb-2">{stats.pagesPerDay}</div>
          <div className="text-base opacity-90">Pages Per Day</div>
        </div>

        {/* Grid stats */}
        <div className="grid grid-cols-2 gap-3 w-full mb-4">
          <div className="rounded-2xl p-4 text-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
            <Clock className="w-8 h-8 mb-2 mx-auto" />
            <div className="text-3xl font-bold mb-1">{stats.minutesPerDay}</div>
            <div className="text-xs opacity-90">Minutes/Day</div>
          </div>
          <div className="rounded-2xl p-4 text-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
            <Book className="w-8 h-8 mb-2 mx-auto" />
            <div className="text-3xl font-bold mb-1">{stats.daysPerBook}</div>
            <div className="text-xs opacity-90">Days/Book</div>
          </div>
        </div>

        {/* Fastest read */}
        {stats.fastestRead && (
          <div className="w-full rounded-2xl p-4 text-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
            <div className="text-xs opacity-80 mb-2">Fastest Read</div>
            <div className="text-lg font-bold mb-1">{stats.fastestRead.title}</div>
            <div className="text-sm opacity-90">{stats.fastestRead.time}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export function RatingBreakdownStory({ 
  month,
  year,
  avgRating,
  distribution 
}: { 
  month: string;
  year: number;
  avgRating: number;
  distribution: { rating: number; count: number; }[];
}) {
  const { currentTheme } = useTheme();
  const maxCount = Math.max(...distribution.map(d => d.count));
  
  return (
    <div
      className="w-full rounded-3xl p-6 shadow-2xl overflow-y-auto"
      style={{
        background: currentTheme.isGradient
          ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
          : currentTheme.primary,
        minHeight: '500px',
        maxHeight: '85vh',
      }}
    >
      <div className="text-white">
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-8 h-8" />
          <h2 className="text-3xl font-bold">Rating Breakdown</h2>
        </div>
        <p className="text-sm opacity-80 mb-6">{month} {year}</p>

        {/* Average rating */}
        <div className="rounded-2xl p-6 mb-6 text-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
          <div className="text-7xl font-bold mb-3">{avgRating.toFixed(1)}</div>
          <div className="flex justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className="w-6 h-6" 
                fill={i < Math.round(avgRating) ? 'currentColor' : 'none'}
                strokeWidth={i < Math.round(avgRating) ? 0 : 2}
              />
            ))}
          </div>
          <div className="text-base opacity-90">Average Rating</div>
        </div>

        {/* Distribution bars */}
        <div className="space-y-3">
          {distribution.sort((a, b) => b.rating - a.rating).map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="flex items-center gap-1 w-12">
                <Star className="w-4 h-4" fill="currentColor" strokeWidth={0} />
                <span className="font-semibold">{item.rating}</span>
              </div>
              
              <div className="flex-1 relative">
                <div className="w-full h-10 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}>
                  <motion.div
                    className="h-full rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}
                    initial={{ width: 0 }}
                    animate={{ width: maxCount > 0 ? `${(item.count / maxCount) * 100}%` : '0%' }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                  >
                    {item.count > 0 && (
                      <span className="text-sm font-bold px-3">{item.count}</span>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ReadingCalendarStory({ 
  month,
  year,
  pagesRead,
  booksRead,
  calendarData,
  pagesPerDay,
  readingSessions,
  books
}: { 
  month: string;
  year: number;
  pagesRead: number;
  booksRead: number;
  calendarData: { day: number; books: any[] }[];
  pagesPerDay: { day: number; pages: number }[];
  readingSessions: any[];
  books: any[];
}) {
  const { currentTheme } = useTheme();
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  // Get first day of month and number of days
  const firstDay = new Date(year, getMonthIndex(month), 1).getDay();
  const daysInMonth = new Date(year, getMonthIndex(month) + 1, 0).getDate();
  
  // Build a map of day -> book covers from reading sessions
  const booksByDay: { [key: number]: any } = {};
  
  // Method 1: Use reading sessions to show books on every day they were read
  if (readingSessions && books) {
    readingSessions.forEach((session: any) => {
      // Parse the date to get the day number
      const sessionDate = new Date(session.date + 'T00:00:00');
      const sessionMonth = sessionDate.getMonth();
      const sessionYear = sessionDate.getFullYear();
      
      // Check if this session is in the current calendar month
      if (sessionYear === year && sessionMonth === getMonthIndex(month)) {
        const dayNum = sessionDate.getDate();
        
        // Find the book for this session
        const book = books.find((b: any) => b.id === session.bookId);
        
        // If we don't have a book for this day yet, or this is a more recent session, use this book
        if (book && !booksByDay[dayNum]) {
          booksByDay[dayNum] = book;
        }
      }
    });
  }
  
  // Method 2 (Fallback): Use calendarData for books that were finished
  if (calendarData) {
    calendarData.forEach((dayData) => {
      if (dayData.books && dayData.books.length > 0 && !booksByDay[dayData.day]) {
        booksByDay[dayData.day] = dayData.books[0];
      }
    });
  }
  
  // Method 3: Show books on ALL days between startDate and finishDate
  if (books) {
    books.forEach((book: any) => {
      // Check if book has both start and finish dates
      const startDate = book.startDate ? new Date(book.startDate + 'T00:00:00') : null;
      const finishDate = book.finishDate ? new Date(book.finishDate + 'T00:00:00') : 
                         book.dateRead ? new Date(book.dateRead + 'T00:00:00') : null;
      
      if (startDate && finishDate) {
        // Iterate through each day between start and finish
        const currentDate = new Date(startDate);
        
        while (currentDate <= finishDate) {
          const dateMonth = currentDate.getMonth();
          const dateYear = currentDate.getFullYear();
          
          // Check if this date is in the current calendar month
          if (dateYear === year && dateMonth === getMonthIndex(month)) {
            const dayNum = currentDate.getDate();
            
            // Only add if we don't already have a book for this day
            if (!booksByDay[dayNum]) {
              booksByDay[dayNum] = book;
            }
          }
          
          // Move to next day
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    });
  }
  
  // Create calendar grid (35 cells for 5 weeks)
  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const dayNumber = i - firstDay + 1;
    if (dayNumber > 0 && dayNumber <= daysInMonth) {
      const book = booksByDay[dayNumber];
      const bookCover = book?.cover;
      const pagesOnDay = pagesPerDay[dayNumber - 1]?.pages || 0;
      const intensity = pagesOnDay > 0 ? Math.min(Math.floor(pagesOnDay / 50), 4) : 0;
      return { day: dayNumber, intensity, bookCover, book };
    }
    return null;
  });
  
  const pageData = pagesPerDay.map(d => d.pages);
  const maxPages = Math.max(...pageData, 1);
  
  // Calculate Y-axis in increments of 100
  const maxYAxis = Math.ceil(maxPages / 100) * 100;
  const yAxisLabels = [];
  for (let i = maxYAxis; i >= 0; i -= 100) {
    yAxisLabels.push(i);
  }
  
  return (
    <div
      className="w-full rounded-3xl p-6 shadow-2xl overflow-y-auto flex items-center justify-center"
      style={{
        background: currentTheme.isGradient
          ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
          : currentTheme.primary,
        minHeight: '500px',
        maxHeight: '85vh',
      }}
    >
      <div className="text-white w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8" />
            <div>
              <h2 className="text-2xl font-bold">{month} {year}</h2>
              <p className="text-sm opacity-80">Reading Calendar</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold leading-none mb-1">{pagesRead.toLocaleString()}</div>
            <div className="text-sm opacity-80 mb-3">Pages Read</div>
            <div className="text-3xl font-bold leading-none mb-1">{booksRead}</div>
            <div className="text-sm opacity-80">Books Read</div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div>
          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {daysOfWeek.map((day, i) => (
              <div key={i} className="text-center text-sm font-bold opacity-70">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, i) => (
              <div
                key={i}
                className="rounded-lg flex items-center justify-center text-lg font-bold relative overflow-hidden"
                style={{
                  backgroundColor: day 
                    ? day.intensity === 0 
                      ? 'rgba(255, 255, 255, 0.15)' 
                      : `rgba(255, 255, 255, ${0.2 + day.intensity * 0.15})`
                    : 'transparent',
                  aspectRatio: '1 / 1.4', // 40% taller to better fit book covers
                }}
              >
                {day && day.bookCover ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="absolute inset-0"
                  >
                    <BookCover 
                      src={day.bookCover} 
                      alt={`Book ${day.day}`} 
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute top-1 left-1 bg-black/70 text-white text-sm font-bold px-1.5 py-0.5 rounded">
                      {day.day}
                    </div>
                  </motion.div>
                ) : (
                  day && day.day
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MonthlyBooksGridStory({ 
  month, 
  year,
  books 
}: { 
  month: string;
  year: number;
  books: any[];
}) {
  const { currentTheme } = useTheme();
  
  const handleShare = async () => {
    const text = `${month} Reads\n${books.length} amazing ${books.length === 1 ? 'book' : 'books'} completed 📚\n\n${books.map((b, i) => `${i + 1}. ${b.title} by ${b.author} ${'⭐'.repeat(b.rating || 0)}`).join('\n')}\n\n📚 ReadTrack`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${month} Reads`,
          text: text,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    }
  };
  
  const handleDownload = () => {
    alert('Download feature coming soon!');
  };
  
  // Determine grid layout based on number of books
  // Fewer books = larger covers
  let gridCols = 'grid-cols-2';
  let gap = 'gap-3';
  let starSize = 'w-3.5 h-3.5';
  let maxWidth = 'none';
  
  if (books.length === 1) {
    gridCols = 'grid-cols-1';
    gap = 'gap-0';
    starSize = 'w-5 h-5';
    maxWidth = '280px';
  } else if (books.length === 2) {
    gridCols = 'grid-cols-2';
    gap = 'gap-4';
    starSize = 'w-4 h-4';
    maxWidth = '180px';
  } else if (books.length <= 4) {
    gridCols = 'grid-cols-2';
    gap = 'gap-3';
    starSize = 'w-3.5 h-3.5';
  } else if (books.length <= 6) {
    gridCols = 'grid-cols-2';
    gap = 'gap-2.5';
    starSize = 'w-3 h-3';
  } else if (books.length === 7 || books.length === 8) {
    // Use 2 columns for 7-8 books to avoid single book in last row
    gridCols = 'grid-cols-2';
    gap = 'gap-2';
    starSize = 'w-3 h-3';
  } else if (books.length <= 9) {
    gridCols = 'grid-cols-3';
    gap = 'gap-2.5';
    starSize = 'w-3 h-3';
  } else {
    gridCols = 'grid-cols-4';
    gap = 'gap-2';
    starSize = 'w-2.5 h-2.5';
  }
  
  return (
    <div
      className="w-full h-full rounded-3xl p-5 shadow-2xl flex flex-col relative"
      style={{
        background: currentTheme.isGradient
          ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
          : currentTheme.primary,
        maxHeight: '85vh',
      }}
    >
      <div className="text-white flex flex-col h-full">
        {/* Header with action buttons */}
        <div className="flex items-start justify-between mb-4 flex-shrink-0">
          <div>
            <h2 className="text-3xl font-bold leading-tight mb-0.5">{month} {year}</h2>
            <p className="text-sm opacity-90">
              {books.length} amazing {books.length === 1 ? 'book' : 'books'} completed 📚
            </p>
          </div>
          
          {/* Share and Download buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Books Grid - fills available space with dynamic sizing */}
        <div className={`grid ${gridCols} ${gap} flex-1 content-start justify-items-center overflow-y-auto`}>
          {books.map((book, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="flex flex-col items-center w-full"
              style={{ maxWidth }}
            >
              <div className="aspect-[2/3] w-full rounded-lg overflow-hidden shadow-lg mb-1.5">
                <BookCover 
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Star rating */}
              {book.rating && (
                <div className="flex justify-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={starSize}
                      fill={i < book.rating ? 'currentColor' : 'none'}
                      strokeWidth={i < book.rating ? 0 : 2}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getMonthIndex(monthName: string): number {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return months.indexOf(monthName);
}

export function MonthlyStatsGridStory({ 
  month, 
  year,
  stats 
}: { 
  month: string;
  year: number;
  stats: {
    pagesThisMonth: number;
    pagesThisYear: number;
    yearGoal: number;
    longestDay: number;
    streak: number;
    authorsRead: number;
    avgRating: number | string;
  };
}) {
  const { currentTheme } = useTheme();
  const progressPercent = stats.yearGoal > 0 ? Math.min(100, (stats.pagesThisYear / stats.yearGoal) * 100) : 0;
  
  // Safely handle avgRating which might be a string or number
  const avgRatingValue = typeof stats.avgRating === 'string' 
    ? parseFloat(stats.avgRating) 
    : (stats.avgRating || 0);
  
  // Safely handle longestDay which might be NaN
  const longestDayValue = isNaN(stats.longestDay) || stats.longestDay < 0 ? 0 : stats.longestDay;
  
  return (
    <div
      className="w-full rounded-3xl p-6 shadow-2xl overflow-y-auto"
      style={{
        background: currentTheme.isGradient
          ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
          : currentTheme.primary,
        minHeight: '500px',
        maxHeight: '85vh',
      }}
    >
      <div className="text-white space-y-4">
        {/* Header with time period */}
        <div className="text-center mb-2">
          <h2 className="text-2xl font-bold">{month} {year}</h2>
          <p className="text-sm opacity-90">Monthly Statistics</p>
        </div>
        
        {/* Top Card - Pages This Month */}
        <div 
          className="rounded-2xl p-6"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', color: '#111827' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-6 h-6" style={{ color: '#6b7280' }} />
            <h3 className="text-xl font-bold">Pages I've Read</h3>
          </div>
          
          <div className="text-sm mb-4" style={{ color: '#6b7280' }}>
            📚 {month} reading journey!
          </div>
          
          <div className="text-6xl font-bold mb-2 leading-none">
            {stats.pagesThisMonth.toLocaleString()}
          </div>
          
          <div className="text-base mb-4" style={{ color: '#6b7280' }}>
            pages this month
          </div>
          
          {/* Progress bar for yearly goal */}
          <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#e5e7eb' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${progressPercent}%`,
                background: currentTheme.isGradient
                  ? `linear-gradient(90deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
                  : currentTheme.primary,
              }}
            />
          </div>
        </div>
        
        {/* Bottom Grid - 2x2 */}
        <div className="grid grid-cols-2 gap-4">
          {/* Longest Day */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl p-5"
            style={{ 
              background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)'
            }}
          >
            <div className="text-base font-semibold mb-2 opacity-90">Longest day</div>
            <div className="text-6xl font-bold mb-2 leading-none">
              {longestDayValue}
            </div>
            <div className="text-base opacity-90">pages in one day</div>
          </motion.div>
          
          {/* Reading Streak */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl p-5"
            style={{ 
              background: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)'
            }}
          >
            <div className="text-base font-semibold mb-2 opacity-90">Reading streak</div>
            <div className="text-6xl font-bold mb-2 leading-none">
              {stats.streak}
            </div>
            <div className="text-base opacity-90">days in a row 🔥</div>
          </motion.div>
          
          {/* Authors Read */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl p-5"
            style={{ 
              background: 'linear-gradient(135deg, #a855f7 0%, #c084fc 100%)'
            }}
          >
            <div className="text-base font-semibold mb-2 opacity-90">Authors read</div>
            <div className="text-6xl font-bold mb-2 leading-none">
              {stats.authorsRead}
            </div>
            <div className="text-base opacity-90">different authors</div>
          </motion.div>
          
          {/* Average Rating */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl p-5"
            style={{ 
              background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
            }}
          >
            <div className="text-base font-semibold mb-2 opacity-90">Average rating</div>
            <div className="text-5xl font-bold mb-2 leading-none flex items-center gap-2">
              {avgRatingValue.toFixed(2)} ⭐
            </div>
            <div className="text-base opacity-90">out of 5 stars</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Pages per Day Chart Story
export function PagesPerDayChartStory({ 
  month, 
  year,
  pagesPerDay 
}: { 
  month: string;
  year: number;
  pagesPerDay: { day: number; pages: number }[];
}) {
  const { currentTheme } = useTheme();
  
  // Calculate max pages for scaling
  const maxPages = Math.max(...pagesPerDay.map(d => d.pages), 1);
  const yAxisMax = Math.ceil(maxPages / 100) * 100; // Round up to nearest 100
  
  // Generate Y-axis labels (4 labels)
  const yAxisLabels = [];
  const step = Math.ceil(yAxisMax / 4);
  for (let i = 0; i <= 4; i++) {
    yAxisLabels.push(step * i);
  }
  yAxisLabels.reverse();
  
  // Create path for the line chart
  const chartWidth = 100; // percentage
  const chartHeight = 300; // pixels
  const dataPoints = pagesPerDay.map((d, i) => {
    const x = (i / (pagesPerDay.length - 1)) * chartWidth;
    const y = chartHeight - (d.pages / yAxisMax) * chartHeight;
    return { x, y, pages: d.pages };
  });
  
  // Create SVG path
  const pathD = dataPoints.map((point, i) => 
    `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');
  
  return (
    <div
      className="w-full rounded-3xl p-6 shadow-2xl overflow-y-auto"
      style={{
        background: 'white',
        minHeight: '500px',
        maxHeight: '85vh',
      }}
    >
      <div style={{ color: '#111827' }}>
        <h2 className="text-3xl font-bold mb-2">Pages per Day</h2>
        <p className="text-sm opacity-60 mb-6">{month} {year}</p>
        
        {/* Chart Container */}
        <div className="relative" style={{ height: `${chartHeight}px` }}>
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between pr-4" style={{ width: '60px' }}>
            {yAxisLabels.map((label, i) => (
              <div key={i} className="text-sm opacity-60 text-right">{label}</div>
            ))}
          </div>
          
          {/* Y-axis label */}
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 text-xs opacity-60 font-semibold"
            style={{ 
              writingMode: 'vertical-rl', 
              transform: 'rotate(180deg) translateX(50%)',
              left: '8px'
            }}
          >
            Pages
          </div>
          
          {/* Chart area */}
          <div className="absolute" style={{ left: '60px', right: '0', top: '0', bottom: '0' }}>
            {/* Grid lines */}
            <svg className="absolute inset-0 w-full h-full">
              {yAxisLabels.map((_, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={`${(i / (yAxisLabels.length - 1)) * 100}%`}
                  x2="100%"
                  y2={`${(i / (yAxisLabels.length - 1)) * 100}%`}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              ))}
            </svg>
            
            {/* Line chart */}
            <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
              <motion.path
                d={pathD}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </svg>
          </div>
        </div>
        
        {/* X-axis (days) */}
        <div className="flex justify-between mt-4 px-14 text-sm opacity-60">
          {[2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30].map(day => (
            <span key={day}>{day}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Average Stats Story (Time to Finish & Book Length)
export function AverageStatsStory({ 
  month, 
  year,
  avgDaysToFinish,
  avgBookLength 
}: { 
  month: string;
  year: number;
  avgDaysToFinish: number;
  avgBookLength: number;
}) {
  const { currentTheme } = useTheme();
  
  return (
    <div
      className="w-full rounded-3xl p-6 shadow-2xl"
      style={{
        background: currentTheme.isGradient
          ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
          : currentTheme.primary,
        minHeight: '500px',
      }}
    >
      <div className="text-white h-full flex flex-col">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Reading Averages</h2>
          <p className="text-sm opacity-80">{month} {year}</p>
        </div>
        
        <div className="flex-1 flex flex-col justify-center gap-4">
          {/* Avg Time to Finish */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl p-6"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-8 h-8" style={{ color: '#60a5fa' }} />
              <span className="text-lg opacity-90">Avg. Time to Finish</span>
            </div>
            <div className="text-6xl font-bold">{avgDaysToFinish}d</div>
          </motion.div>
          
          {/* Avg Book Length */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl p-6"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Book className="w-8 h-8" style={{ color: '#c084fc' }} />
              <span className="text-lg opacity-90">Avg. Book Length</span>
            </div>
            <div className="text-6xl font-bold">{avgBookLength}p</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}