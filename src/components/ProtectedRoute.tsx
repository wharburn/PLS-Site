/**
 * Protected Route Component
 * Redirects unauthenticated users to the correct login page
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 text-sm">Synchronizing access...</p>
        </div>
      </div>
    );
  }

  // ✅ SUDO ADMIN BYPASS (test-mode): allow admin routes without Supabase user
  // This is used to avoid Supabase "verification required" blocking the accountant.
  const sudoAdminActive =
    requireAdmin &&
    typeof window !== 'undefined' &&
    window.localStorage?.getItem('pls_admin_session') === 'active' &&
    window.localStorage?.getItem('isAdmin') === 'true';

  if (!user && !sudoAdminActive) {
    // 🛡️ DYNAMIC REDIRECT:
    // If it's an admin path, go to the Admin Login
    // Otherwise, go to the standard Client Login
    const loginPath = location.pathname.startsWith('/admin') ? '/admin' : '/#client-portal';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (requireAdmin && !sudoAdminActive && !isAdmin) {
    // Redirect non-admins trying to access admin pages
    return <Navigate to="/client" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
