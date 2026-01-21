import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AboutPedro from '../components/AboutPedro.tsx';
import ContactSection from '../components/ContactSection.tsx';
import Hero from '../components/Hero.tsx';
import PartnerSection from '../components/PartnerSection.tsx';
import ServiceCard from '../components/ServiceCard.tsx';
import { BRAND_LOGOS, getTranslatedPartners, getTranslatedServices } from '../constants.tsx';
import { Language, translations } from '../translations.ts';

interface HomePageProps {
  lang: Language;
}

interface AiLink {
  label: string;
  to: string;
  desc: string;
}

const ClientPortalSection: React.FC<{ lang: Language; aiLinks: AiLink[] }> = ({ lang, aiLinks }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('pls_portal_email', email);
    navigate('/client', { state: { email } });
  };

  return (
    <section id="client-portal" className="py-32 bg-[#0f172a] text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/fabric-of-squares.png')]"></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold uppercase tracking-[0.2em]">
            Client Portal
          </div>
          <h2 className="text-4xl md:text-5xl font-bold leading-tight font-serif italic">
            Secure workspace for your engagements
          </h2>
          <p className="text-lg text-slate-200 leading-relaxed">
            Access statements, upload identity documents, and collaborate on filings through a dedicated portal.
            Sign in with your email and password, or create an account to get started.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="text-amber-400 text-sm font-bold">Identity vault</div>
              <p className="text-slate-200 text-sm mt-2">Store passports and driver licences in an encrypted vault.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="text-amber-400 text-sm font-bold">Audit history</div>
              <p className="text-slate-200 text-sm mt-2">Every profile change and upload is versioned for compliance.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="text-amber-400 text-sm font-bold">Folder discipline</div>
              <p className="text-slate-200 text-sm mt-2">Organise working papers, tax packs, and evidence cleanly.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="text-amber-400 text-sm font-bold">Direct AI access</div>
              <p className="text-slate-200 text-sm mt-2">Jump to translation, analysis, or legal guidance tools.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-4">
            {aiLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-sm font-semibold transition-all"
              >
                <span>{link.label}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white text-slate-900 rounded-3xl shadow-2xl p-8 border border-amber-100">
          <div className="flex items-center gap-3 mb-6">
            <img src={BRAND_LOGOS.PLS_MAIN} alt="PLS" className="w-12 h-12 rounded-full border border-amber-100" />
            <div>
              <div className="text-xs font-black uppercase tracking-[0.25em] text-amber-600">Portal Access</div>
              <div className="text-xl font-bold">Sign in to continue</div>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Password</label>
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
              className="w-full bg-slate-900 text-amber-500 font-bold py-3 rounded-xl hover:bg-slate-800 transition-all shadow-lg"
            >
              Access client portal
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
            <span>New here?</span>
            <Link to="/signup" className="text-amber-600 font-semibold hover:text-amber-700">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const HomePage: React.FC<HomePageProps> = ({ lang }) => {
  const t = translations[lang];
  const services = getTranslatedServices(lang);
  const partners = getTranslatedPartners(lang);

  const aiLinks: AiLink[] = [
    { label: 'AI Legal Guidance', to: '/ai/legal', desc: t.aiLegal.title },
    { label: 'Document Translation', to: '/ai/translation', desc: t.documentTranslation.title },
    { label: 'Image Analysis', to: '/ai/analysis', desc: t.imageAnalysis.title },
    { label: 'NoVo AI Chat', to: '/ai/chat', desc: 'Talk with the NoVo concierge' },
  ];

  return (
    <>
      <section id="home">
        <Hero lang={lang} />
      </section>

      <div className="bg-slate-900 py-4 border-y border-amber-500/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
          <span className="text-[10px] text-white font-bold tracking-[0.2em] uppercase">HMRC Agent IWII8EFHKXM8</span>
          <span className="text-[10px] text-white font-bold tracking-[0.2em] uppercase">SRA Foreign Lawyer 666982</span>
          <span className="text-[10px] text-white font-bold tracking-[0.2em] uppercase">ICO Registered ZA221652</span>
          <span className="text-[10px] text-white font-bold tracking-[0.2em] uppercase">ACCA Certified Member</span>
        </div>
      </div>

      <section id="services" className="py-24 bg-white relative">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[#fdfcfb] to-white"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <span className="text-amber-600 text-xs font-bold uppercase tracking-[0.3em] mb-4 block">
              {t.services.title}
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

      <ClientPortalSection lang={lang} aiLinks={aiLinks} />

      <section id="contact" className="py-32 bg-slate-900 text-white">
        <ContactSection lang={lang} />
      </section>
    </>
  );
};

export default HomePage;
