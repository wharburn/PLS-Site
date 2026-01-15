import React, { useState, useEffect } from 'react';
import { getLegalAdvice } from '../services/gemini.ts';

interface SavedConsultation {
  id: string;
  query: string;
  category: string;
  response: string;
  sources?: { title: string; uri: string }[];
  timestamp: string;
}

interface AILegalAdviceProps {
  lang?: 'en' | 'pt';
}

const AILegalAdvice: React.FC<AILegalAdviceProps> = ({ lang = 'en' }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Property Law');
  const [response, setResponse] = useState<string | null>(null);
  const [sources, setSources] = useState<{ title: string; uri: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const [savedConsultations, setSavedConsultations] = useState<SavedConsultation[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('pls_saved_consultations') || '[]');
      setSavedConsultations(saved);
    } catch (e) {
      console.error("Local storage access failed", e);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setFeedbackGiven(false);
    setCopied(false);
    setSaveSuccess(false);
    setSources([]);
    
    try {
      const fullResponse = await getLegalAdvice(query, category, lang);
      setResponse(fullResponse.text || 'Unable to generate advice at this time.');
      
      const groundingChunks = fullResponse.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (groundingChunks) {
        const extractedSources = groundingChunks
          .map((chunk: any) => chunk.web ? { title: chunk.web.title, uri: chunk.web.uri } : null)
          .filter((s: any) => s !== null);
        setSources(extractedSources);
      }
    } catch (error) {
      setResponse('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleSave = () => {
    if (!response || !query) return;
    
    const newSave: SavedConsultation = {
      id: Math.random().toString(36).substr(2, 9),
      query,
      category,
      response,
      sources,
      timestamp: new Date().toISOString()
    };

    const updated = [newSave, ...savedConsultations];
    localStorage.setItem('pls_saved_consultations', JSON.stringify(updated));
    setSavedConsultations(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const deleteSaved = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedConsultations.filter(s => s.id !== id);
    localStorage.setItem('pls_saved_consultations', JSON.stringify(updated));
    setSavedConsultations(updated);
    if (expandedId === id) setExpandedId(null);
  };

  const categories = [
    { id: 'Property Law', icon: '🏠', bg: 'bg-amber-50' },
    { id: 'Immigration Law', icon: '🛂', bg: 'bg-blue-50' },
    { id: 'Family Law', icon: '👨‍👩‍👧', bg: 'bg-rose-50' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        <div className="lg:w-1/2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full mb-4 text-xs font-bold uppercase tracking-widest">
            Intelligence Engine
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-6 font-serif">AI Legal Guidance</h2>
          <p className="text-slate-600 text-lg mb-8 leading-relaxed">
            Harnessing the power of <strong>Gemini 3 Pro</strong> and real-time <strong>Google Search Grounding</strong> to provide up-to-the-minute regulatory context for your legal inquiries across the UK and Portugal.
          </p>

          <div className="space-y-4 mb-10">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                  category === cat.id ? 'border-amber-500 bg-amber-50/50 shadow-lg' : 'border-slate-100 bg-white hover:border-amber-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-12 h-12 flex items-center justify-center rounded-lg text-2xl ${cat.bg}`}>
                    {cat.icon}
                  </span>
                  <span className="font-bold text-slate-800">{cat.id}</span>
                </div>
                {category === cat.id && (
                  <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-white text-[10px]">
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>
          
          <div className="p-6 bg-[#0f172a] rounded-2xl text-slate-400 text-xs italic border-l-4 border-amber-500 mb-12 shadow-xl">
            Disclaimer: This tool provides preliminary context using real-time search technology. It does not replace formal legal advice from our registered solicitors.
          </div>

          {/* Saved History */}
          {savedConsultations.length > 0 && (
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 w-full animate-in fade-in slide-in-from-left-4">
              <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
                Consultation History
              </h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                {savedConsultations.map(save => (
                  <div key={save.id} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => setExpandedId(expandedId === save.id ? null : save.id)}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[9px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded">{save.category}</span>
                      <button onClick={(e) => deleteSaved(save.id, e)} className="text-slate-300 hover:text-red-500 p-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">"{save.query}"</p>
                    {expandedId === save.id && (
                      <div className="mt-4 pt-4 border-t border-slate-50 animate-in fade-in">
                        <p className="text-[11px] text-slate-600 leading-relaxed mb-4 italic">"{save.response}"</p>
                        {save.sources && save.sources.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {save.sources.slice(0, 3).map((s, i) => (
                              <div key={i} className="text-[9px] text-indigo-500 bg-indigo-50 px-2 py-1 rounded truncate max-w-[150px]">{s.title}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:w-1/2 w-full">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-100 min-h-[600px] flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
               {loading && <div className="h-full bg-amber-500 animate-[loading-bar_2s_infinite]"></div>}
            </div>

            <form onSubmit={handleSubmit} className="mb-10">
              <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-[0.2em]">Inquiry Analysis Input</label>
              <div className="relative group">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Detail your question about ${category} here...`}
                  className="w-full p-6 rounded-2xl border-2 border-slate-50 focus:border-amber-500 focus:ring-0 h-40 transition-all resize-none bg-slate-50 text-slate-800 font-medium placeholder:text-slate-300"
                ></textarea>
                <button
                  type="submit"
                  disabled={loading || !query}
                  className="absolute bottom-4 right-4 bg-slate-900 text-amber-500 p-3 rounded-xl hover:bg-slate-800 disabled:opacity-30 transition-all shadow-xl"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  )}
                </button>
              </div>
            </form>

            <div className="flex-grow flex flex-col">
              <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-50">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grounding Analysis Output</span>
                {response && (
                  <div className="flex gap-4">
                    <button onClick={handleSave} className="text-[10px] font-bold text-slate-400 hover:text-amber-500 transition-colors uppercase tracking-widest">{saveSuccess ? 'Saved to Vault' : 'Save Session'}</button>
                    <button onClick={() => handleCopy(response)} className="text-[10px] font-bold text-slate-400 hover:text-indigo-500 transition-colors uppercase tracking-widest">{copied ? 'Copied' : 'Copy Text'}</button>
                  </div>
                )}
              </div>
              
              <div className="flex-grow overflow-y-auto max-h-[400px] pr-2 scrollbar-hide">
                {response ? (
                  <div className="animate-in fade-in slide-in-from-bottom-2">
                    <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm whitespace-pre-wrap mb-10">
                      {response}
                    </div>

                    {sources.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-slate-100">
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-4 block">Verified Legal Footnotes</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {sources.map((s, idx) => (
                            <a 
                              key={idx} 
                              href={s.uri} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="group p-3 bg-slate-50 border border-slate-100 rounded-lg hover:border-amber-200 hover:bg-amber-50/30 transition-all flex items-start gap-3"
                            >
                              <div className="w-6 h-6 bg-white border border-slate-100 rounded flex items-center justify-center text-[10px] font-bold text-slate-400 group-hover:text-amber-600 group-hover:border-amber-200 transition-colors">
                                {idx + 1}
                              </div>
                              <div className="flex-grow min-w-0">
                                <div className="text-[10px] font-bold text-slate-800 truncate group-hover:text-amber-900 transition-colors">{s.title || 'Official Document'}</div>
                                <div className="text-[9px] text-slate-400 truncate opacity-60">Verified Authority Source</div>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-300 py-12">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    </div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-50">Awaiting Inquiry Session</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default AILegalAdvice;