'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [username, setUsername] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      toast.success('If the account exists, a reset link has been generated.');
      if (data.resetToken) {
        setResetToken(data.resetToken);
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-4">
      <Toaster position="top-center" toastOptions={{ style: { background: '#fff', color: '#1a1a1a', border: '1px solid #e5e5e5', borderRadius: '12px' } }} />

      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-c21-gold/10 mb-6">
            <span className="text-c21-gold font-bold text-lg tracking-tight">C21</span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 tracking-tight">Forgot Password</h1>
          <p className="text-gray-400 text-sm mt-2">Enter your username to receive a reset link</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-xs font-medium text-gray-500 mb-2 uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="form-input"
                placeholder="Enter your username"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-c21-gold text-white font-semibold rounded-xl hover:bg-c21-gold/90 transition-all disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          {resetToken && (
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <p className="text-xs text-amber-600 font-medium mb-2">Development Mode — Reset Link:</p>
              <Link
                href={`/admin/reset-password?token=${resetToken}`}
                className="text-sm text-c21-gold hover:underline break-all"
              >
                Click here to reset password
              </Link>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/admin/login" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
