import React from 'react';
import { Language, translations } from '../translations.ts';
import { Partner } from '../types.ts';

interface PartnerSectionProps {
  partners: Partner[];
  lang: Language;
}

const PartnerSection: React.FC<PartnerSectionProps> = ({ partners, lang }) => {
  const t = translations[lang].partners;
  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t.title}</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">{t.desc}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
        {partners.map((partner) => (
          <a
            key={partner.name}
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-slate-800/50 border border-slate-700 p-8 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-slate-800 hover:border-amber-500/50 transition-all"
          >
            <div className="h-20 w-full mb-6 flex items-center justify-center relative bg-white/5 rounded-xl p-4 overflow-hidden group-hover:bg-white transition-all duration-500">
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  (
                    e.target as HTMLImageElement
                  ).parentElement!.innerHTML = `<span class="text-white font-bold">${partner.name}</span>`;
                }}
              />
            </div>
            <div className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-2">
              {partner.specialization}
            </div>
            <div className="text-slate-400 text-xs group-hover:text-slate-300 font-medium">
              {partner.description}
            </div>
          </a>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: t.hmrcAgent, detail: '', tag: t.financial },
          { title: t.icoRegistered, detail: '', tag: t.security },
          { title: t.sraRegistered, detail: '', tag: t.legal },
        ].map((cert) => (
          <div
            key={cert.title}
            className="bg-slate-800/30 p-6 rounded-xl border-l-4 border-amber-500 flex items-center justify-between"
          >
            <div>
              <div className="text-xs text-amber-500 font-bold uppercase mb-1">{cert.tag}</div>
              <div className="text-white font-bold">{cert.title}</div>
              {cert.detail && <div className="text-slate-400 text-sm font-mono">{cert.detail}</div>}
            </div>
            <div className="bg-white/5 p-3 rounded-full">
              <svg
                className="w-6 h-6 text-amber-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PartnerSection;
