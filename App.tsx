import React, { useEffect, useState } from 'react';
import AboutPedro from './components/AboutPedro.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import AILegalAdvice from './components/AILegalAdvice.tsx';
import ContactSection from './components/ContactSection.tsx';
import DocumentTranslation from './components/DocumentTranslation.tsx';
import Footer from './components/Footer.tsx';
import Header from './components/Header.tsx';
import Hero from './components/Hero.tsx';
import ImageAnalysis from './components/ImageAnalysis.tsx';
import NoVoChat from './components/NoVoChat.tsx';
import PartnerSection from './components/PartnerSection.tsx';
import ServiceCard from './components/ServiceCard.tsx';
import { BRAND_LOGOS, getTranslatedPartners, getTranslatedServices } from './constants.tsx';
import { Language, translations } from './translations.ts';

const App: React.FC = () => {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [showNoVo, setShowNoVo] = useState(false);
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];
  const services = getTranslatedServices(lang);
  const partners = getTranslatedPartners(lang);

  useEffect(() => {
    console.log('PLS App Initialized');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfcfb]">
      <Header onAdminClick={() => setIsAdminOpen(true)} lang={lang} setLang={setLang} />

      <main className="flex-grow">
        <section id="home">
          <Hero lang={lang} />
        </section>

        {/* Trust Ticker */}
        <div className="bg-slate-900 py-4 border-y border-amber-500/20 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
            <span className="text-[10px] text-white font-bold tracking-[0.2em] uppercase">
              HMRC Agent IWII8EFHKXM8
            </span>
            <span className="text-[10px] text-white font-bold tracking-[0.2em] uppercase">
              SRA Foreign Lawyer 666982
            </span>
            <span className="text-[10px] text-white font-bold tracking-[0.2em] uppercase">
              ICO Registered ZA221652
            </span>
            <span className="text-[10px] text-white font-bold tracking-[0.2em] uppercase">
              ACCA Certified Member
            </span>
          </div>
        </div>

        <section id="services" className="py-24 bg-white relative">
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#fdfcfb] to-white"></div>
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-20">
              <span className="text-amber-600 text-xs font-bold uppercase tracking-[0.3em] mb-4 block">
                Our Expertise
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 font-serif italic">
                Premier Consultancy Services
              </h2>
              <div className="w-16 h-[1px] bg-amber-500 mx-auto"></div>
              <p className="mt-8 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium italic">
                {t.services.desc}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} lang={lang} />
              ))}
            </div>
          </div>
        </section>

        <section id="partners" className="bg-[#0f172a] py-32 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <PartnerSection partners={partners} lang={lang} />
        </section>

        <section id="about" className="py-32 bg-[#fdfcfb]">
          <AboutPedro lang={lang} />
        </section>

        <div className="bg-white">
          <section id="translation" className="py-32 border-t border-slate-100">
            <DocumentTranslation lang={lang} />
          </section>

          <section id="analysis" className="py-32 bg-slate-50 border-y border-slate-100">
            <ImageAnalysis lang={lang} />
          </section>

          <section id="ai-advice" className="py-32 overflow-hidden">
            <AILegalAdvice lang={lang} />
          </section>
        </div>

        <section id="contact" className="py-32 bg-slate-900 text-white">
          <ContactSection lang={lang} />
        </section>
      </main>

      <Footer />

      {/* Overlays */}
      {showNoVo && <NoVoChat onClose={() => setShowNoVo(false)} lang={lang} />}
      {isAdminOpen && <AdminDashboard onClose={() => setIsAdminOpen(false)} />}

      {/* Premium AI Trigger */}
      {!showNoVo && (
        <button
          onClick={() => setShowNoVo(true)}
          className="fixed bottom-8 right-8 z-40 bg-slate-900 text-amber-500 border border-amber-500/30 p-4 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)] hover:scale-105 active:scale-95 transition-all group flex items-center gap-3 overflow-hidden"
        >
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full animate-pulse"></div>
            <img
              src={BRAND_LOGOS.NOVO_AVATAR}
              alt="NoVo AI"
              className="relative z-10 w-full h-full object-cover rounded-full border-2 border-amber-500/30"
            />
          </div>
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap text-[10px] font-black uppercase tracking-[0.2em] pr-2">
            Ask NoVo AI Assistant
          </span>
        </button>
      )}
    </div>
  );
};

export default App;
