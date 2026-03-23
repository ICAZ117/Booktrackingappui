import { X, Target, BookOpen, Clock, CheckCircle2, Calendar, TrendingUp, Book } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface GoalSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goals: AllGoals) => void;
  currentGoals: AllGoals;
}

export interface AllGoals {
  daily: {
    pages: { value: number; enabled: boolean };
    minutes: { value: number; enabled: boolean };
  };
  monthly: {
    books: { value: number; enabled: boolean };
    pages: { value: number; enabled: boolean };
  };
  yearly: {
    books: { value: number; enabled: boolean };
    pages: { value: number; enabled: boolean };
  };
}

type GoalType = 'daily' | 'monthly' | 'yearly';

export function GoalSettingsModal({ isOpen, onClose, onSave, currentGoals }: GoalSettingsModalProps) {
  const { currentTheme } = useTheme();
  const [goalType, setGoalType] = useState<GoalType>('daily');
  
  // Generate a unique ID for this modal instance based on theme colors
  const modalId = `goal-modal-${currentTheme.primary.replace('#', '')}-${currentTheme.secondary.replace('#', '')}`;
  
  // Daily goals
  const [dailyPages, setDailyPages] = useState(currentGoals.daily.pages.value);
  const [dailyPagesEnabled, setDailyPagesEnabled] = useState(currentGoals.daily.pages.enabled);
  const [dailyMinutes, setDailyMinutes] = useState(currentGoals.daily.minutes.value);
  const [dailyMinutesEnabled, setDailyMinutesEnabled] = useState(currentGoals.daily.minutes.enabled);
  
  // Monthly goals
  const [monthlyBooks, setMonthlyBooks] = useState(currentGoals.monthly.books.value);
  const [monthlyBooksEnabled, setMonthlyBooksEnabled] = useState(currentGoals.monthly.books.enabled);
  const [monthlyPages, setMonthlyPages] = useState(currentGoals.monthly.pages.value);
  const [monthlyPagesEnabled, setMonthlyPagesEnabled] = useState(currentGoals.monthly.pages.enabled);
  
  // Yearly goals
  const [yearlyBooks, setYearlyBooks] = useState(currentGoals.yearly.books.value);
  const [yearlyBooksEnabled, setYearlyBooksEnabled] = useState(currentGoals.yearly.books.enabled);
  const [yearlyPages, setYearlyPages] = useState(currentGoals.yearly.pages.value);
  const [yearlyPagesEnabled, setYearlyPagesEnabled] = useState(currentGoals.yearly.pages.enabled);

  const handleSave = () => {
    const newGoals = {
      daily: { 
        pages: { value: dailyPages, enabled: dailyPagesEnabled },
        minutes: { value: dailyMinutes, enabled: dailyMinutesEnabled }
      },
      monthly: { 
        books: { value: monthlyBooks, enabled: monthlyBooksEnabled },
        pages: { value: monthlyPages, enabled: monthlyPagesEnabled }
      },
      yearly: { 
        books: { value: yearlyBooks, enabled: yearlyBooksEnabled },
        pages: { value: yearlyPages, enabled: yearlyPagesEnabled }
      }
    };
    console.log('🎯 GoalSettingsModal - handleSave called with:', newGoals);
    onSave(newGoals);
    onClose();
  };

  const dailyPresets = [
    { label: 'Light', pages: 25, minutes: 30, icon: '📖' },
    { label: 'Moderate', pages: 50, minutes: 60, icon: '📚' },
    { label: 'Ambitious', pages: 75, minutes: 90, icon: '🔥' },
    { label: 'Bookworm', pages: 100, minutes: 120, icon: '⚡' },
  ];

  const monthlyPresets = [
    { label: 'Casual', books: 2, pages: 600, icon: '📖' },
    { label: 'Regular', books: 4, pages: 1200, icon: '📚' },
    { label: 'Dedicated', books: 6, pages: 2000, icon: '🔥' },
    { label: 'Voracious', books: 10, pages: 3500, icon: '⚡' },
  ];

  const yearlyPresets = [
    { label: 'Starter', books: 12, pages: 5000, icon: '📖' },
    { label: 'Avid', books: 24, pages: 10000, icon: '📚' },
    { label: 'Challenge', books: 52, pages: 20000, icon: '🔥' },
    { label: 'Epic', books: 100, pages: 40000, icon: '⚡' },
  ];

  const goalTabs = [
    { id: 'daily' as GoalType, label: 'Daily', icon: Calendar },
    { id: 'monthly' as GoalType, label: 'Monthly', icon: BookOpen },
    { id: 'yearly' as GoalType, label: 'Yearly', icon: TrendingUp },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto"
          >
            <style dangerouslySetInnerHTML={{ __html: `
              #${modalId} input[type="range"]::-webkit-slider-thumb {
                background: ${currentTheme.primary} !important;
              }
              #${modalId} input[type="range"]::-moz-range-thumb {
                background: ${currentTheme.primary} !important;
              }
            `}} />
            <div 
              id={modalId} 
              className="rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col" 
              style={{ 
                background: `linear-gradient(145deg, ${currentTheme.primary}25 0%, ${currentTheme.secondary}20 100%)`,
                backdropFilter: 'blur(20px)'
              }}
            >
              {/* Header */}
              <div 
                className="sticky top-0 px-6 py-5 rounded-t-2xl z-10"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Reading Goals</h2>
                      <p className="text-xs text-white/80">Customize your targets</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Goal Type Tabs */}
                <div className="flex gap-2">
                  {goalTabs.map(tab => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setGoalType(tab.id)}
                        className={`flex-1 py-2.5 px-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                          goalType === tab.id
                            ? 'bg-white shadow-lg'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                        style={goalType === tab.id ? {
                          color: currentTheme.primary
                        } : undefined}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Quick Presets */}
                <div>
                  <h3 className="font-semibold text-gray-100 mb-3 text-sm">Quick Presets</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {(goalType === 'daily' ? dailyPresets : goalType === 'monthly' ? monthlyPresets : yearlyPresets).map((preset, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (goalType === 'daily') {
                            setDailyPages(preset.pages);
                            setDailyMinutes(preset.minutes!);
                            setDailyPagesEnabled(true);
                            setDailyMinutesEnabled(true);
                          } else if (goalType === 'monthly') {
                            setMonthlyBooks(preset.books!);
                            setMonthlyPages(preset.pages);
                            setMonthlyBooksEnabled(true);
                            setMonthlyPagesEnabled(true);
                          } else {
                            setYearlyBooks(preset.books!);
                            setYearlyPages(preset.pages);
                            setYearlyBooksEnabled(true);
                            setYearlyPagesEnabled(true);
                          }
                        }}
                        className={`rounded-xl p-4 text-left transition-all border-2 ${
                          (goalType === 'daily' && dailyPages === preset.pages && dailyMinutes === preset.minutes) ||
                          (goalType === 'monthly' && monthlyBooks === preset.books && monthlyPages === preset.pages) ||
                          (goalType === 'yearly' && yearlyBooks === preset.books && yearlyPages === preset.pages)
                            ? ''
                            : 'border-transparent'
                        }`}
                        style={{
                          background: (goalType === 'daily' && dailyPages === preset.pages && dailyMinutes === preset.minutes) ||
                            (goalType === 'monthly' && monthlyBooks === preset.books && monthlyPages === preset.pages) ||
                            (goalType === 'yearly' && yearlyBooks === preset.books && yearlyPages === preset.pages)
                              ? `linear-gradient(135deg, ${currentTheme.primary}40 0%, ${currentTheme.secondary}35 100%)`
                              : 'rgba(0, 0, 0, 0.3)',
                          borderColor: (goalType === 'daily' && dailyPages === preset.pages && dailyMinutes === preset.minutes) ||
                            (goalType === 'monthly' && monthlyBooks === preset.books && monthlyPages === preset.pages) ||
                            (goalType === 'yearly' && yearlyBooks === preset.books && yearlyPages === preset.pages)
                              ? currentTheme.primary
                              : 'transparent',
                          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
                        }}
                      >
                        <div className="text-2xl mb-2">{preset.icon}</div>
                        <p className="font-bold text-gray-100 text-sm mb-1">{preset.label}</p>
                        {goalType === 'daily' ? (
                          <>
                            <p className="text-xs text-gray-400">{preset.pages} pages</p>
                            <p className="text-xs text-gray-400">{preset.minutes} min</p>
                          </>
                        ) : (
                          <>
                            <p className="text-xs text-gray-400">{preset.books} books</p>
                            <p className="text-xs text-gray-400">{preset.pages.toLocaleString()} pages</p>
                          </>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Custom Goals */}
                <div>
                  <h3 className="font-semibold text-gray-100 mb-3 text-sm">Custom Goals</h3>
                  
                  {/* Books Goal (Monthly/Yearly only) */}
                  {goalType !== 'daily' && (
                    <div 
                      className="rounded-xl p-4 mb-3 transition-all"
                      style={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Book 
                            className={`w-4 h-4 ${
                              (goalType === 'monthly' ? monthlyBooksEnabled : yearlyBooksEnabled)
                                ? ''
                                : 'text-gray-500'
                            }`}
                            style={(goalType === 'monthly' ? monthlyBooksEnabled : yearlyBooksEnabled) ? {
                              color: currentTheme.primary
                            } : undefined}
                          />
                          <span className={`font-semibold text-sm ${
                            (goalType === 'monthly' ? monthlyBooksEnabled : yearlyBooksEnabled)
                              ? 'text-gray-100'
                              : 'text-gray-500'
                          }`}>Books per {goalType === 'monthly' ? 'Month' : 'Year'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-2xl font-bold ${
                            (goalType === 'monthly' ? monthlyBooksEnabled : yearlyBooksEnabled)
                              ? 'text-white'
                              : 'text-gray-600'
                          }`}>
                            {goalType === 'monthly' ? monthlyBooks : yearlyBooks}
                          </span>
                          <button
                            onClick={() => {
                              if (goalType === 'monthly') setMonthlyBooksEnabled(!monthlyBooksEnabled);
                              else setYearlyBooksEnabled(!yearlyBooksEnabled);
                            }}
                            className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
                              (goalType === 'monthly' ? monthlyBooksEnabled : yearlyBooksEnabled)
                                ? 'bg-emerald-500'
                                : 'bg-gray-600'
                            }`}
                          >
                            <motion.div
                              animate={{ 
                                x: (goalType === 'monthly' ? monthlyBooksEnabled : yearlyBooksEnabled) ? 20 : 2 
                              }}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                              className="absolute top-0.5 w-4 h-4 bg-white rounded-full"
                            />
                          </button>
                        </div>
                      </div>
                      <input
                        type="range"
                        disabled={!(goalType === 'monthly' ? monthlyBooksEnabled : yearlyBooksEnabled)}
                        min={goalType === 'monthly' ? 1 : 5}
                        max={goalType === 'monthly' ? 15 : 150}
                        step="1"
                        value={goalType === 'monthly' ? monthlyBooks : yearlyBooks}
                        onChange={(e) => {
                          if (goalType === 'monthly') setMonthlyBooks(Number(e.target.value));
                          else setYearlyBooks(Number(e.target.value));
                        }}
                        className={`w-full h-2 rounded-full appearance-none cursor-pointer transition-opacity ${
                          (goalType === 'monthly' ? monthlyBooksEnabled : yearlyBooksEnabled)
                            ? 'opacity-100 bg-gray-600'
                            : 'opacity-40 bg-gray-700 cursor-not-allowed'
                        } [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer goal-slider-${currentTheme.primary.replace('#', '')}`}
                        style={{
                          // @ts-ignore - CSS variables for slider thumb gradient
                          '--thumb-gradient-start': currentTheme.primary,
                          '--thumb-gradient-end': currentTheme.secondary,
                        } as React.CSSProperties}
                      />
                      <div className={`flex justify-between text-xs mt-1 ${
                        (goalType === 'monthly' ? monthlyBooksEnabled : yearlyBooksEnabled)
                          ? 'text-gray-500'
                          : 'text-gray-600'
                      }`}>
                        <span>{goalType === 'monthly' ? 1 : 5}</span>
                        <span>{goalType === 'monthly' ? 15 : 150}</span>
                      </div>
                    </div>
                  )}

                  {/* Pages Goal */}
                  <div 
                    className="rounded-xl p-4 mb-3 transition-all"
                    style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <BookOpen 
                          className={`w-4 h-4 ${
                            (goalType === 'daily' ? dailyPagesEnabled : goalType === 'monthly' ? monthlyPagesEnabled : yearlyPagesEnabled)
                              ? ''
                              : 'text-gray-500'
                          }`}
                          style={(goalType === 'daily' ? dailyPagesEnabled : goalType === 'monthly' ? monthlyPagesEnabled : yearlyPagesEnabled) ? {
                            color: currentTheme.secondary
                          } : undefined}
                        />
                        <span className={`font-semibold text-sm ${
                          (goalType === 'daily' ? dailyPagesEnabled : goalType === 'monthly' ? monthlyPagesEnabled : yearlyPagesEnabled)
                            ? 'text-gray-100'
                            : 'text-gray-500'
                        }`}>
                          Pages per {goalType === 'daily' ? 'Day' : goalType === 'monthly' ? 'Month' : 'Year'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-2xl font-bold ${
                          (goalType === 'daily' ? dailyPagesEnabled : goalType === 'monthly' ? monthlyPagesEnabled : yearlyPagesEnabled)
                            ? 'text-white'
                            : 'text-gray-600'
                        }`}>
                          {(goalType === 'daily' ? dailyPages : goalType === 'monthly' ? monthlyPages : yearlyPages).toLocaleString()}
                        </span>
                        <button
                          onClick={() => {
                            if (goalType === 'daily') setDailyPagesEnabled(!dailyPagesEnabled);
                            else if (goalType === 'monthly') setMonthlyPagesEnabled(!monthlyPagesEnabled);
                            else setYearlyPagesEnabled(!yearlyPagesEnabled);
                          }}
                          className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
                            (goalType === 'daily' ? dailyPagesEnabled : goalType === 'monthly' ? monthlyPagesEnabled : yearlyPagesEnabled)
                              ? 'bg-emerald-500'
                              : 'bg-gray-600'
                          }`}
                        >
                          <motion.div
                            animate={{ 
                              x: (goalType === 'daily' ? dailyPagesEnabled : goalType === 'monthly' ? monthlyPagesEnabled : yearlyPagesEnabled) ? 20 : 2 
                            }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="absolute top-0.5 w-4 h-4 bg-white rounded-full"
                          />
                        </button>
                      </div>
                    </div>
                    <input
                      type="range"
                      disabled={!(goalType === 'daily' ? dailyPagesEnabled : goalType === 'monthly' ? monthlyPagesEnabled : yearlyPagesEnabled)}
                      min={goalType === 'daily' ? 10 : goalType === 'monthly' ? 100 : 1000}
                      max={goalType === 'daily' ? 200 : goalType === 'monthly' ? 5000 : 50000}
                      step={goalType === 'daily' ? 5 : goalType === 'monthly' ? 100 : 1000}
                      value={goalType === 'daily' ? dailyPages : goalType === 'monthly' ? monthlyPages : yearlyPages}
                      onChange={(e) => {
                        if (goalType === 'daily') setDailyPages(Number(e.target.value));
                        else if (goalType === 'monthly') setMonthlyPages(Number(e.target.value));
                        else setYearlyPages(Number(e.target.value));
                      }}
                      className={`w-full h-2 rounded-full appearance-none cursor-pointer transition-opacity ${
                        (goalType === 'daily' ? dailyPagesEnabled : goalType === 'monthly' ? monthlyPagesEnabled : yearlyPagesEnabled)
                          ? 'opacity-100 bg-gray-600'
                          : 'opacity-40 bg-gray-700 cursor-not-allowed'
                      } [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer goal-slider-${currentTheme.primary.replace('#', '')}`}
                      style={{
                        // @ts-ignore - CSS variables for slider thumb gradient
                        '--thumb-gradient-start': currentTheme.primary,
                        '--thumb-gradient-end': currentTheme.secondary,
                      } as React.CSSProperties}
                    />
                    <div className={`flex justify-between text-xs mt-1 ${
                      (goalType === 'daily' ? dailyPagesEnabled : goalType === 'monthly' ? monthlyPagesEnabled : yearlyPagesEnabled)
                        ? 'text-gray-500'
                        : 'text-gray-600'
                    }`}>
                      <span>{goalType === 'daily' ? 10 : goalType === 'monthly' ? 100 : '1K'}</span>
                      <span>{goalType === 'daily' ? 200 : goalType === 'monthly' ? '5K' : '50K'}</span>
                    </div>
                  </div>

                  {/* Minutes Goal (Daily only) */}
                  {goalType === 'daily' && (
                    <div 
                      className="rounded-xl p-4 transition-all"
                      style={{
                        background: 'rgba(0, 0, 0, 0.3)',
                        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Clock className={`w-4 h-4 ${
                            dailyMinutesEnabled ? '' : 'text-gray-500'
                          }`} style={dailyMinutesEnabled ? { color: currentTheme.primary } : undefined} />
                          <span className={`font-semibold text-sm ${
                            dailyMinutesEnabled ? 'text-gray-100' : 'text-gray-500'
                          }`}>Minutes per Day</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-2xl font-bold ${
                            dailyMinutesEnabled ? 'text-white' : 'text-gray-600'
                          }`}>{dailyMinutes}</span>
                          <button
                            onClick={() => setDailyMinutesEnabled(!dailyMinutesEnabled)}
                            className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${
                              dailyMinutesEnabled ? 'bg-emerald-500' : 'bg-gray-600'
                            }`}
                          >
                            <motion.div
                              animate={{ x: dailyMinutesEnabled ? 20 : 2 }}
                              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                              className="absolute top-0.5 w-4 h-4 bg-white rounded-full"
                            />
                          </button>
                        </div>
                      </div>
                      <input
                        type="range"
                        disabled={!dailyMinutesEnabled}
                        min="15"
                        max="240"
                        step="15"
                        value={dailyMinutes}
                        onChange={(e) => setDailyMinutes(Number(e.target.value))}
                        className={`w-full h-2 rounded-full appearance-none cursor-pointer transition-opacity ${
                          dailyMinutesEnabled
                            ? 'opacity-100 bg-gray-600'
                            : 'opacity-40 bg-gray-700 cursor-not-allowed'
                        } [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer goal-slider-${currentTheme.primary.replace('#', '')}`}
                        style={{
                          // @ts-ignore - CSS variables for slider thumb gradient
                          '--thumb-gradient-start': currentTheme.primary,
                          '--thumb-gradient-end': currentTheme.secondary,
                        } as React.CSSProperties}
                      />
                      <div className={`flex justify-between text-xs mt-1 ${
                        dailyMinutesEnabled ? 'text-gray-500' : 'text-gray-600'
                      }`}>
                        <span>15</span>
                        <span>240</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Goal Preview */}
                <div 
                  className="rounded-xl p-4 border"
                  style={{
                    background: `linear-gradient(135deg, ${currentTheme.primary}20 0%, ${currentTheme.secondary}20 100%)`,
                    borderColor: `${currentTheme.primary}50`
                  }}
                >
                  <p className="text-sm text-gray-200 mb-2">
                    <span className="font-bold">Active {goalType.charAt(0).toUpperCase() + goalType.slice(1)} Goals:</span>
                  </p>
                  <ul className="space-y-1 text-sm text-gray-300">
                    {goalType === 'daily' ? (
                      <>
                        {dailyPagesEnabled && (
                          <li>📖 Read <span className="font-bold text-white">{dailyPages} pages</span> per day</li>
                        )}
                        {dailyMinutesEnabled && (
                          <li>⏱️ Spend <span className="font-bold text-white">{dailyMinutes} minutes</span> reading</li>
                        )}
                        {!dailyPagesEnabled && !dailyMinutesEnabled && (
                          <li className="text-gray-400 italic">No active daily goals</li>
                        )}
                      </>
                    ) : goalType === 'monthly' ? (
                      <>
                        {monthlyBooksEnabled && (
                          <li>📚 Complete <span className="font-bold text-white">{monthlyBooks} books</span></li>
                        )}
                        {monthlyPagesEnabled && (
                          <li>📖 Read <span className="font-bold text-white">{monthlyPages.toLocaleString()} pages</span></li>
                        )}
                        {!monthlyBooksEnabled && !monthlyPagesEnabled && (
                          <li className="text-gray-400 italic">No active monthly goals</li>
                        )}
                      </>
                    ) : (
                      <>
                        {yearlyBooksEnabled && (
                          <li>📚 Complete <span className="font-bold text-white">{yearlyBooks} books</span></li>
                        )}
                        {yearlyPagesEnabled && (
                          <li>📖 Read <span className="font-bold text-white">{yearlyPages.toLocaleString()} pages</span></li>
                        )}
                        {!yearlyBooksEnabled && !yearlyPagesEnabled && (
                          <li className="text-gray-400 italic">No active yearly goals</li>
                        )}
                      </>
                    )}
                  </ul>
                  {((goalType === 'daily' && (dailyPagesEnabled || dailyMinutesEnabled)) ||
                    (goalType === 'monthly' && (monthlyBooksEnabled || monthlyPagesEnabled)) ||
                    (goalType === 'yearly' && (yearlyBooksEnabled || yearlyPagesEnabled))) && (
                    <p className="text-xs text-gray-400 mt-3">
                      {goalType === 'daily' && dailyPagesEnabled && dailyPages > 75 ? '🔥 Ambitious goal! You got this!' :
                       goalType === 'daily' && dailyPagesEnabled && dailyPages > 40 ? '✨ Great daily target!' :
                       goalType === 'monthly' && monthlyBooksEnabled && monthlyBooks >= 6 ? '🔥 Voracious reader!' :
                       goalType === 'yearly' && yearlyBooksEnabled && yearlyBooks >= 52 ? '⚡ Book a week! Incredible!' :
                       '📚 Perfect for steady progress!'}
                    </p>
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="sticky bottom-0 px-6 py-4 rounded-b-2xl flex gap-3" style={{ background: 'rgba(0, 0, 0, 0.2)' }}>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 text-gray-100 font-semibold rounded-xl transition-all"
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3 px-4 text-white font-bold rounded-xl hover:shadow-lg transition-all"
                  style={{
                    background: `linear-gradient(135deg, ${currentTheme.primary} 0%, ${currentTheme.secondary} 100%)`
                  }}
                >
                  Save Goals
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}