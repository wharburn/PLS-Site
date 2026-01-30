import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, supabase } from '../lib/supabase';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/client');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const data = await signIn(email, password);
      setSuccessMessage('Login successful! Redirecting...');
      
      // Store user info
      localStorage.setItem('pls_portal_email', email);
      
      // Redirect to client dashboard
      setTimeout(() => navigate('/client'), 500);
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check your credentials.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfcfb]">
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 font-serif italic">Client Login</h1>
          <p className="text-slate-600 mt-2">PLS Consultants Professional Legal Services</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent disabled:opacity-50"
              placeholder="you@company.com"
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
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-amber-500 font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          <p>Don't have an account? <a href="/signup" className="text-slate-900 font-bold hover:underline">Sign up</a></p>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            Test Credentials:
            <br />
            Email: jp.couto@hotmail.com
            <br />
            Password: k7XIejXiTlcG
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
