import React from 'react';
import { useNavigate } from 'react-router-dom';
import DocumentTranslation from '../components/DocumentTranslation.tsx';
import { Language } from '../translations.ts';

interface AiTranslationPageProps {
  lang: Language;
}

const AiTranslationPage: React.FC<AiTranslationPageProps> = ({ lang }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white py-12 pt-24">
      <div className="max-w-6xl mx-auto px-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
        >
          <span className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center">←</span>
          Back
        </button>
        <DocumentTranslation lang={lang} />
      </div>
    </div>
  );
};

export default AiTranslationPage;
