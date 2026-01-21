import React from 'react';
import ImageAnalysis from '../components/ImageAnalysis.tsx';
import { Language, translations } from '../translations.ts';

interface AiAnalysisPageProps {
  lang: Language;
}

const AiAnalysisPage: React.FC<AiAnalysisPageProps> = ({ lang }) => {
  const t = translations[lang].imageAnalysis;

  return (
    <div className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-[0.25em]">
            AI Suite
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 font-serif italic">{t.title}</h1>
          <p className="text-lg text-slate-600 mt-3 max-w-3xl leading-relaxed">{t.description}</p>
        </div>
        <ImageAnalysis lang={lang} />
      </div>
    </div>
  );
};

export default AiAnalysisPage;
