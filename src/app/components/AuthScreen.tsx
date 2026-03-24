import { useState } from 'react';
import { BookOpen, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const isSignUp = mode === 'sign-up';

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        await signUp(email.trim(), password);
        setMessage('Account created. Check your inbox if email confirmation is enabled.');
      } else {
        await signIn(email.trim(), password);
      }
    } catch (submitError: any) {
      setError(submitError?.message || 'Unable to authenticate. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6 py-10 bg-[#0b0f19]">
      <div className="w-full max-w-md rounded-3xl bg-[#121a2b] border border-[#26324f] shadow-2xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#3298ff] to-[#f83aef] flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">ReadTrack</h1>
            <p className="text-xs text-slate-300">Sign in to sync your books everywhere</p>
          </div>
        </div>

        <div className="flex gap-2 mb-5">
          <button
            type="button"
            onClick={() => setMode('sign-in')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${
              !isSignUp ? 'bg-[#3298ff] text-white' : 'bg-[#1a243b] text-slate-300'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('sign-up')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${
              isSignUp ? 'bg-[#3298ff] text-white' : 'bg-[#1a243b] text-slate-300'
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-xl border border-[#32405f] bg-[#0f1524] px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#3298ff]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              className="w-full rounded-xl border border-[#32405f] bg-[#0f1524] px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#3298ff]"
              placeholder="At least 8 characters"
            />
          </div>

          {error && <p className="text-xs text-red-300">{error}</p>}
          {message && <p className="text-xs text-emerald-300">{message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl py-3 text-sm font-semibold bg-gradient-to-r from-[#3298ff] to-[#f83aef] text-white disabled:opacity-60"
          >
            <span className="inline-flex items-center justify-center gap-2">
              {isSignUp ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
              {isSubmitting ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
