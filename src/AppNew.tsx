/**
 * App Component - Supabase Version
 * Main application with authentication
 */

import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layout components
import Header from '../components/Header';
import Footer from '../components/Footer';
import AdminDashboard from '../components/AdminDashboard';

// Public pages
import HomePage from '../pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPageNew from './pages/SignUpPageNew';
import AdminLoginPage from './pages/AdminLoginPage';
import ClientsDirectoryPage from './pages/ClientsDirectoryPage';
import ClientPortalPage from './pages/ClientPortalPage';

// AI pages (public but enhanced when logged in)
import AiLegalPage from '../pages/AiLegalPage';
import AiTranslationPage from '../pages/AiTranslationPage';
import AiAnalysisPage from '../pages/AiAnalysisPage';
import AiChatPage from '../pages/AiChatPage';

// Protected client pages
import ClientDashboardPage from '../pages/ClientDashboardPage';
import ClientDocumentsPage from '../pages/ClientDocumentsPage';

// Protected admin pages
import AdminClientsPage from '../pages/AdminClientsPage';
import AdminClientDetailPage from '../pages/AdminClientDetailPage';

import { Language } from '../translations';

// Scroll handler component
const ScrollToHash: React.FC = () => {
  const location = useLocation();

  React.useEffect(() => {
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1));
      const el = document.getElementById(id);
      if (el) {
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  return null;
};

const AppContent: React.FC = () => {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [lang, setLang] = useState<Language>('en');

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfcfb]">
      <Header onAdminClick={() => setIsAdminOpen(true)} lang={lang} setLang={setLang} />
      <ScrollToHash />

      <main className="flex-grow">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage lang={lang} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPageNew />} />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route path="/directory" element={<ClientsDirectoryPage />} />
          <Route path="/portal" element={<ClientPortalPage />} />
          
          {/* AI routes (public) */}
          <Route path="/ai/legal" element={<AiLegalPage lang={lang} />} />
          <Route path="/ai/translation" element={<AiTranslationPage lang={lang} />} />
          <Route path="/ai/analysis" element={<AiAnalysisPage lang={lang} />} />
          <Route path="/ai/chat" element={<AiChatPage lang={lang} />} />

          {/* Protected client routes */}
          <Route
            path="/client"
            element={
              <ProtectedRoute>
                <ClientDashboardPage lang={lang} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/client/documents"
            element={
              <ProtectedRoute>
                <ClientDocumentsPage />
              </ProtectedRoute>
            }
          />

          {/* Protected admin routes */}
          <Route
            path="/admin/clients"
            element={
              <ProtectedRoute requireAdmin>
                <AdminClientsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/clients/:email"
            element={
              <ProtectedRoute requireAdmin>
                <AdminClientDetailPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer />

      {isAdminOpen && <AdminDashboard onClose={() => setIsAdminOpen(false)} />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
