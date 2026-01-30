import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard.tsx';
import Footer from './components/Footer.tsx';
import Header from './components/Header.tsx';
import HomePage from './pages/HomePage.tsx';
import AiLegalPage from './pages/AiLegalPage.tsx';
import AiTranslationPage from './pages/AiTranslationPage.tsx';
import AiAnalysisPage from './pages/AiAnalysisPage.tsx';
import AiChatPage from './pages/AiChatPage.tsx';
import SignUpPage from './pages/SignUpPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import ClientDashboardPage from './pages/ClientDashboardPage.tsx';
import AdminClientsPage from './pages/AdminClientsPage.tsx';
import AdminClientDetailPage from './pages/AdminClientDetailPage.tsx';
import ClientDocumentsPage from './pages/ClientDocumentsPage.tsx';
import { Language } from './translations.ts';

const App: React.FC = () => {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    console.log('PLS App Initialized');
  }, []);

  const ScrollToHash: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
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

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#fdfcfb]">
        <Header onAdminClick={() => setIsAdminOpen(true)} lang={lang} setLang={setLang} />

        <ScrollToHash />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage lang={lang} />} />
            <Route path="/ai/legal" element={<AiLegalPage lang={lang} />} />
            <Route path="/ai/translation" element={<AiTranslationPage lang={lang} />} />
            <Route path="/ai/analysis" element={<AiAnalysisPage lang={lang} />} />
            <Route path="/ai/chat" element={<AiChatPage lang={lang} />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/client" element={<ClientDashboardPage lang={lang} />} />
            <Route path="/client/documents" element={<ClientDocumentsPage />} />
            <Route path="/admin/clients" element={<AdminClientsPage />} />
            <Route path="/admin/clients/:email" element={<AdminClientDetailPage />} />
          </Routes>
        </main>

        <Footer />

        {isAdminOpen && <AdminDashboard onClose={() => setIsAdminOpen(false)} />}
      </div>
    </BrowserRouter>
  );
};

export default App;
