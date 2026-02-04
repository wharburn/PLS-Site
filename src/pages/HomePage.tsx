import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from '../src/lib/supabase'; // Corrected path
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

const ClientPortalSection: React.FC<{ lang: Language }> = ({ lang }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signIn(email, password);
      localStorage.setItem('pls_portal_email', email);
      navigate('/client', { state: { email } });
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="client-portal" className="py-32 bg-[#0f172a] text-white relative overflow-hidden font-sans">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/fabric-of-squares.png')]"></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#c5a059] text-[#0f172a] rounded-full text-xs font-bold uppercase tracking-[0.2em] font-sans">
            Client Portal
          </div>
          <h2 className="text-4xl md:text-6xl font-bold leading-tight font-sans italic text-white" style={{ fontFamily: "Arial, Helvetica, sans-serif !important" }}>
            Secure workspace for your engagements
          </h2>
          <p className="text-lg text-[#94a3b8] leading-relaxed font-sans font-bold">
            Access statements, upload identity documents, and collaborate on filings through a dedicated portal.
            Sign in with your email and password, or create an account to get started.
          </p>
          <div className="grid sm:grid-cols-2 gap-6 pt-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="text-[#c5a059] text-sm font-bold font-sans">Identity vault</div>
              <p className="text-[#94a3b8] text-sm mt-2 font-sans font-bold">Store passports and driver licences in an encrypted vault.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="text-[#c5a059] text-sm font-bold font-sans">Audit history</div>
              <p className="text-[#94a3b8] text-sm mt-2 font-sans font-bold">Every profile change and upload is versioned for compliance.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="text-[#c5a059] text-sm font-bold font-sans">Folder discipline</div>
              <p className="text-[#94a3b8] text-sm mt-2 font-sans font-bold">Organise working papers, tax packs, and evidence cleanly.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="text-[#c5a059] text-sm font-bold font-sans">Direct AI access</div>
              <p className="text-[#94a3b8] text-sm mt-2 font-sans font-bold">Jump to translation, analysis, or legal guidance tools.</p>
            </div>
          </div>
        </div>

        <div className="bg-white text-slate-900 rounded-[24px] shadow-2xl p-12 border border-amber-100/20">
          <div className="flex items-center gap-4 mb-10">
            <img src={BRAND_LOGOS.PLS_MAIN} alt="PLS" className="w-12 h-12" />
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.25em] text-[#c5a059] font-sans">Portal Access</div>
              <div className="text-2xl font-bold text-[#0f172a] font-sans">Sign in to continue</div>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}>
                {error}
              </div>
            )}
            <div>
              <label className="block text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest mb-2 font-sans">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-4 rounded-lg border border-slate-200 bg-white font-sans font-bold text-[#0f172a]"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#94a3b8] uppercase tracking-widest mb-2 font-sans">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-4 rounded-lg border border-slate-200 bg-white font-sans font-bold text-[#0f172a]"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0f172a] text-[#c5a059] font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg font-sans text-base mt-8"
              style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Authenticating...' : 'Access client portal'}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-between text-[13px] text-slate-500 font-sans font-bold">
            <span>New here?</span>
            <Link to="/signup" className="text-[#c5a059] font-bold hover:text-amber-700 decoration-none">
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

  return (
    <>
      <section id="home">
        <Hero lang={lang} />
      </section>

      <div className="bg-slate-900 py-4 border-y border-amber-500/20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center md:justify-between items-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
          <span className="text-[10px] text-white font-bold tracking-[0.2em] uppercase">HMRC Agent</span>
          <span className="text-[10px] text-white font-bold tracking-[0.2em] uppercase">ICO Registered</span>
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

      <ClientPortalSection lang={lang} />

      <section id="contact" className="py-24 bg-slate-900 text-white border-t-4 border-amber-500/80">
        <ContactSection lang={lang} />
      </section>
    </>
  );
};

export default HomePage;
