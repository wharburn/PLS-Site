
import React, { useState } from 'react';
import { BRAND_LOGOS, CREDENTIAL_DEFS } from '../constants.tsx';
import { Language, translations } from '../translations.ts';

interface AboutPedroProps {
  lang: Language;
}

const AboutPedro: React.FC<AboutPedroProps> = ({ lang }) => {
  const t = translations[lang].about;
  const [hoveredCred, setHoveredCred] = useState<string | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        <div className="lg:w-1/2">
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-32 h-32 border-t-4 border-l-4 border-amber-500/30 rounded-tl-3xl"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-b-4 border-r-4 border-amber-500/30 rounded-br-3xl"></div>
            
            <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-white">
              <img
                src={BRAND_LOGOS.PEDRO_XAVIER}
                alt="Pedro Xavier at his office desk"
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
            </div>
            
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-2xl hidden md:block border border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a7 7 0 00-7 7v1h11v-1a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{t.liaison}</div>
                  <div className="text-xs text-slate-500">{t.liaisonDesc}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2">
          <div className="mb-8">
            <span className="inline-block px-3 py-1 bg-amber-500/10 text-amber-600 font-bold uppercase tracking-[0.2em] text-xs rounded-full border border-amber-500/20">{t.tag}</span>
            <div className="flex items-baseline gap-4 mt-4">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 font-serif">Pedro Xavier</h2>
              {/* Digital Signature Suggestion */}
              <span className="hidden sm:block font-serif italic text-amber-500/60 text-2xl tracking-tighter ml-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                PXavier
              </span>
            </div>
            <p className="text-amber-500 font-medium text-lg italic mt-1 font-serif">{t.credentials}</p>
          </div>

          <p className="text-slate-600 text-lg leading-relaxed mb-8">
            {t.bio}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            {[
              { label: lang === 'en' ? 'Chartered Linguist (UK)' : 'Linguista Certificado (UK)', icon: '🗣️' },
              { label: lang === 'en' ? 'HMRC Registered Agent' : 'Agente Registado HMRC', icon: '🏛️' },
              { label: lang === 'en' ? 'Legal Specialist Liaison' : 'Ligação Jurídica Especializada', icon: '🤝' },
              { label: lang === 'en' ? 'Portuguese Legal Specialist Liaison' : 'Ligação Jurídica Portuguesa', icon: '⚖️' }
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <span className="text-xl">{item.icon}</span>
                <span className="font-bold text-slate-700 text-sm">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-10 relative">
             {Object.keys(CREDENTIAL_DEFS).map(cred => (
               <div 
                key={cred} 
                className="group relative"
                onMouseEnter={() => setHoveredCred(cred)}
                onMouseLeave={() => setHoveredCred(null)}
               >
                 <span className="px-3 py-1.5 bg-slate-900 text-amber-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-800 shadow-lg cursor-help transition-all hover:bg-slate-800">
                   {cred}
                 </span>
                 {/* Tooltip Suggestion */}
                 {hoveredCred === cred && (
                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-800 text-white text-[10px] font-bold rounded shadow-xl whitespace-nowrap z-50 animate-in fade-in zoom-in-95">
                     {CREDENTIAL_DEFS[cred]}
                     <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-800"></div>
                   </div>
                 )}
               </div>
             ))}
          </div>

          <div className="flex items-center gap-6 pt-6 border-t border-slate-100">
            <div className="text-center group">
              <img 
                src="https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg" 
                alt="United Kingdom" 
                className="w-12 h-8 rounded-sm shadow-md group-hover:scale-110 transition-transform cursor-help" 
              />
              <span className="text-[10px] text-slate-400 font-bold mt-1 block uppercase">London</span>
            </div>
            <div className="w-px h-8 bg-slate-200"></div>
            <div className="text-center group">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Flag_of_Portugal.svg" 
                alt="Portugal" 
                className="w-12 h-8 rounded-sm shadow-md group-hover:scale-110 transition-transform cursor-help" 
              />
              <span className="text-[10px] text-slate-400 font-bold mt-1 block uppercase">Portugal</span>
            </div>
            
            <a 
              href="#contact"
              className="ml-auto bg-amber-500 hover:bg-slate-900 text-white px-6 py-3 rounded-full font-bold text-sm transition-all shadow-xl hover:shadow-amber-500/20"
            >
              {t.cta}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPedro;
