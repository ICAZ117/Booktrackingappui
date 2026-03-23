import { ArrowLeft, Target, BookOpen, Calendar, Clock, TrendingUp, Award, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useBooks } from '../contexts/BooksContext';

interface GoalsPageProps {
  onBack: () => void;
}

export function GoalsPage({ onBack }: GoalsPageProps) {
  const { currentTheme } = useTheme();
  const { books, readingSessions } = useBooks();

  const getGradientBg = () => {
    return currentTheme.isGradient
      ? `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
      : currentTheme.primary;
  };

  // Calculate real stats from books
  const finishedBooks = books.filter(b => b.status === 'finished');
  
  // Calculate total pages: finished books (all pages) + currently reading books (current page)
  const totalPagesFromFinished = finishedBooks.reduce((sum, book) => sum + (book.pages || 0), 0);
  const currentlyReading = books.filter(b => b.status === 'reading');
  const totalPagesFromReading = currentlyReading.reduce((sum, book) => sum + (book.currentPage || 0), 0);
  const totalPages = totalPagesFromFinished + totalPagesFromReading;
  
  console.log('📊 [GoalsPage] Pages calculation:', {
    finishedBooks: finishedBooks.length,
    pagesFromFinished: totalPagesFromFinished,
    currentlyReading: currentlyReading.length,
    pagesFromReading: totalPagesFromReading,
    totalPages
  });
  
  // Calculate total hours read (from audiobooks)
  const audiobooks = books.filter(b => b.format === 'audiobook' && b.status === 'finished');
  const totalMinutes = audiobooks.reduce((sum, book) => sum + (book.audioDuration || 0), 0);
  const totalHours = Math.round(totalMinutes / 60);
  
  // Calculate current month stats
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const booksThisMonth = finishedBooks.filter(b => {
    if (!b.finishDate) return false;
    const finishDate = new Date(b.finishDate);
    return finishDate.getMonth() === currentMonth && finishDate.getFullYear() === currentYear;
  }).length;
  
  // Calculate reading streak
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const readingHistory = JSON.parse(localStorage.getItem('readingHistory') || '{}');
  let streakDaysThisMonth = 0;
  for (let day = 1; day <= now.getDate(); day++) {
    const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (readingHistory[dateKey]) streakDaysThisMonth++;
  }

  const yearlyGoals = [
    { id: 1, title: 'Read 52 Books', current: finishedBooks.length, target: 52, unit: 'books', icon: BookOpen },
    { id: 2, title: 'Read 15,000 Pages', current: totalPages, target: 15000, unit: 'pages', icon: Target },
    { id: 3, title: 'Read 100 Hours', current: totalHours, target: 100, unit: 'hours', icon: Clock },
  ];

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthlyGoals = [
    { id: 1, title: `${monthNames[currentMonth]} Goal`, current: booksThisMonth, target: 5, unit: 'books', icon: Calendar },
    { id: 2, title: 'Read Every Day', current: streakDaysThisMonth, target: daysInMonth, unit: 'days', icon: TrendingUp },
  ];

  // Calculate achievements based on real data
  const achievements = [
    { 
      id: 1, 
      title: '10 Books Milestone', 
      completed: finishedBooks.length >= 10, 
      date: finishedBooks.length >= 10 ? (finishedBooks[9]?.finishDate || 'Recently') : undefined,
      progress: finishedBooks.length < 10 ? `${finishedBooks.length}/10 books` : undefined
    },
    { 
      id: 2, 
      title: '3,000 Pages Milestone', 
      completed: totalPages >= 3000, 
      date: totalPages >= 3000 ? 'Achieved!' : undefined,
      progress: totalPages < 3000 ? `${totalPages}/3,000 pages` : undefined
    },
    { 
      id: 3, 
      title: '20 Day Streak', 
      completed: streakDaysThisMonth >= 20, 
      date: streakDaysThisMonth >= 20 ? 'This month!' : undefined,
      progress: streakDaysThisMonth < 20 ? `${streakDaysThisMonth}/20 days` : undefined
    },
    { 
      id: 4, 
      title: '50 Hours Read', 
      completed: totalHours >= 50, 
      date: totalHours >= 50 ? 'Achieved!' : undefined,
      progress: totalHours < 50 ? `${totalHours}/50 hours` : undefined
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-4 p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
        >
          <ArrowLeft 
            className="w-5 h-5"
            style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
          />
          <span 
            className="text-sm font-semibold"
            style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
          >
            Back
          </span>
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ background: getGradientBg() }}
          >
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 
              className="text-2xl font-bold"
              style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
            >
              Reading Goals
            </h1>
            <p 
              className="text-sm"
              style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
            >
              Track your progress
            </p>
          </div>
        </div>
      </div>

      {/* Yearly Goals */}
      <div>
        <h2 
          className="text-lg font-bold mb-3"
          style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
        >
          2026 Goals
        </h2>
        <div className="space-y-3">
          {yearlyGoals.map((goal) => {
            const percentage = Math.round((goal.current / goal.target) * 100);
            const IconComponent = goal.icon;
            
            return (
              <div
                key={goal.id}
                className="rounded-2xl p-4 shadow-sm"
                style={{
                  backgroundColor: currentTheme.cardColor,
                  borderColor: currentTheme.borderColor,
                  borderWidth: '1px',
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${currentTheme.accentColor}20` }}
                    >
                      <IconComponent 
                        className="w-5 h-5"
                        style={{ color: currentTheme.accentColor }}
                      />
                    </div>
                    <div>
                      <h3 
                        className="font-bold"
                        style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
                      >
                        {goal.title}
                      </h3>
                      <p 
                        className="text-sm"
                        style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                      >
                        {goal.current.toLocaleString()} / {goal.target.toLocaleString()} {goal.unit}
                      </p>
                    </div>
                  </div>
                  <div 
                    className="text-2xl font-bold"
                    style={{ color: currentTheme.accentColor }}
                  >
                    {percentage}%
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${percentage}%`,
                      background: getGradientBg(),
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Goals */}
      <div>
        <h2 
          className="text-lg font-bold mb-3"
          style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
        >
          This Month
        </h2>
        <div className="space-y-3">
          {monthlyGoals.map((goal) => {
            const percentage = Math.round((goal.current / goal.target) * 100);
            const IconComponent = goal.icon;
            
            return (
              <div
                key={goal.id}
                className="rounded-2xl p-4 shadow-sm"
                style={{
                  backgroundColor: currentTheme.cardColor,
                  borderColor: currentTheme.borderColor,
                  borderWidth: '1px',
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${currentTheme.successColor}20` }}
                    >
                      <IconComponent 
                        className="w-5 h-5"
                        style={{ color: currentTheme.successColor }}
                      />
                    </div>
                    <div>
                      <h3 
                        className="font-bold"
                        style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
                      >
                        {goal.title}
                      </h3>
                      <p 
                        className="text-sm"
                        style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                      >
                        {goal.current} / {goal.target} {goal.unit}
                      </p>
                    </div>
                  </div>
                  <div 
                    className="text-2xl font-bold"
                    style={{ color: currentTheme.successColor }}
                  >
                    {percentage}%
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: currentTheme.successColor,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Achievements */}
      <div>
        <h2 
          className="text-lg font-bold mb-3"
          style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
        >
          Achievements
        </h2>
        <div className="space-y-2">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="rounded-xl p-4 flex items-center justify-between"
              style={{
                backgroundColor: currentTheme.cardColor,
                borderColor: currentTheme.borderColor,
                borderWidth: '1px',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: achievement.completed 
                      ? `${currentTheme.successColor}20` 
                      : `${currentTheme.textColor === 'light' ? '#374151' : '#e5e7eb'}`,
                  }}
                >
                  {achievement.completed ? (
                    <Check 
                      className="w-5 h-5"
                      style={{ color: currentTheme.successColor }}
                    />
                  ) : (
                    <Award 
                      className="w-5 h-5"
                      style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                    />
                  )}
                </div>
                <div>
                  <h3 
                    className="font-semibold text-sm"
                    style={{ color: currentTheme.textColor === 'light' ? '#f3f4f6' : '#111827' }}
                  >
                    {achievement.title}
                  </h3>
                  <p 
                    className="text-xs"
                    style={{ color: currentTheme.textColor === 'light' ? '#9ca3af' : '#6b7280' }}
                  >
                    {achievement.completed ? achievement.date : achievement.progress}
                  </p>
                </div>
              </div>
              {achievement.completed && (
                <div 
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ 
                    backgroundColor: `${currentTheme.successColor}20`,
                    color: currentTheme.successColor,
                  }}
                >
                  Completed
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}