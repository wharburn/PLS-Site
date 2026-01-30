import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Id } from '../contexts/AuthContext';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check if admin credentials
      if (email === 'admin@pls.com' && password === 'AdminTest123!') {
        // Store admin token
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminEmail', email);
        navigate('/admin/clients');
      } else {
        setError('Invalid admin credentials');
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-20 min-h-[100vh] flex items-center">
      <div className="max-w-md mx-auto px-6 w-full">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-amber-500 rounded-full text-xs font-bold uppercase tracking-[0.25em]">
            Admin Panel
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mt-4">Admin Access</h1>
          <p className="text-slate-600 mt-3">Restricted to administrators only</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
              Admin Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              placeholder="admin@pls.com"
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
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-amber-500 font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Access Admin Panel'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 mt-6">
          Default credentials: admin@pls.com / AdminTest123!
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
