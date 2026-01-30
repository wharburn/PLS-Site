/**
 * Admin Settings Page
 * Manage admin users and reset passwords
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../lib/supabase';

const AdminSettingsPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    if (password.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      setMessage({
        type: 'success',
        text: `User ${email} created successfully! They can now login.`,
      });
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to create user' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setMessage({
        type: 'success',
        text: `Password reset email sent to ${email}`,
      });
      setEmail('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to send reset email' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-14">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/clients')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 mb-4"
          >
            ← Back to Admin Dashboard
          </button>
          <h1 className="text-4xl font-bold text-slate-900 font-serif italic">Admin Settings</h1>
          <p className="text-slate-600 mt-2">Manage admin users and passwords</p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-xl ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Create New User */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Create New Admin User</h2>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="admin@plsconsultants.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="Min 8 characters"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="Re-enter password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-amber-500 font-bold py-3 rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create User'}
              </button>
            </form>
          </div>

          {/* Reset Password */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Reset User Password</h2>
            <p className="text-sm text-slate-600 mb-4">
              Send a password reset email to an existing user.
            </p>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  User Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  placeholder="user@example.com"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 text-slate-900 font-bold py-3 rounded-xl hover:bg-amber-600 transition-all disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Email'}
              </button>
            </form>
          </div>
        </div>

        {/* Quick Admin Emails Reference */}
        <div className="mt-8 bg-slate-100 p-6 rounded-3xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-3">Recognized Admin Emails</h3>
          <p className="text-sm text-slate-600 mb-3">
            These emails are automatically granted admin access when they login:
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              <code className="bg-white px-2 py-1 rounded">admin@plsconsultants.com</code>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              <code className="bg-white px-2 py-1 rounded">wayne@novocom.ai</code>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              <code className="bg-white px-2 py-1 rounded">pedro@plsconsultants.com</code>
            </li>
            <li className="flex items-center gap-2 text-sm">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              <code className="bg-white px-2 py-1 rounded">admin@pls.com</code>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
