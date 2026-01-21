import React from 'react';
import { useNavigate } from 'react-router-dom';
import NoVoChat from '../components/NoVoChat.tsx';
import { Language } from '../translations.ts';

interface AiChatPageProps {
  lang: Language;
}

const AiChatPage: React.FC<AiChatPageProps> = ({ lang }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white py-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-[0.25em]">
            AI Suite
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 font-serif italic">NoVo AI Concierge</h1>
          <p className="text-lg text-slate-600 mt-3 max-w-3xl leading-relaxed">
            Chat directly with NoVo to explore services, coordinate documents, or route to the right AI tool.
          </p>
        </div>

        <div className="relative border border-slate-200 rounded-3xl shadow-2xl overflow-hidden">
          <NoVoChat
            onClose={() => navigate(-1)}
            lang={lang}
            variant="panel"
          />
        </div>
      </div>
    </div>
  );
};

export default AiChatPage;
