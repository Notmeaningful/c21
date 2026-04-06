'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/lib/contexts/AdminAuthContext';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAdminAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading('Authenticating...');

    try {
      await login(username, password);
      toast.success('Welcome back', { id: toastId });
      // Use window.location for a full page navigation so the middleware sees the auth cookie
      window.location.href = '/admin/questionnaires';
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-4 sm:px-6 relative overflow-hidden">
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: '#fff', color: '#1a1a1a', border: '1px solid #e5e5e5', borderRadius: '12px' },
        }}
      />

      <div className="w-full max-w-[420px] relative z-10 animate-fadeInUp">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-c21-gold/10 mb-6">
            <span className="text-c21-gold font-bold text-lg tracking-tight">C21</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100 tracking-tight">Admin Portal</h1>
          <p className="text-gray-400 text-sm mt-2 tracking-wide">Century 21 Vasco Group</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="form-input"
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full mt-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Authenticating...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link href="/admin/forgot-password" className="text-xs text-gray-400 hover:text-c21-gold transition-colors">
              Forgot password?
            </Link>
          </div>

          <div className="divider-gold mt-6 mb-4" />
          <p className="text-center text-xs text-gray-400">
            Authorized administrators only
          </p>
        </div>
      </div>
    </div>
  );
}
