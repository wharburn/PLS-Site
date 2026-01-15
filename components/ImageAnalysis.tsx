
import React, { useState, useRef } from 'react';
import { analyzeImage } from '../services/gemini.ts';
import { Language, translations } from '../translations.ts';

interface ImageAnalysisProps {
  lang: Language;
}

const ImageAnalysis: React.FC<ImageAnalysisProps> = ({ lang }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[lang].imageAnalysis;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setAnalysis(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selected);
    }
  };

  const handleAnalyze = async () => {
    if (!preview) return;
    setLoading(true);
    setAnalysis(null);

    const base64Image = preview.split(',')[1];

    try {
      const result = await analyzeImage(base64Image, prompt);
      setAnalysis(result || 'Analysis failed.');
    } catch (error) {
      console.error(error);
      setAnalysis('An error occurred during image analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        <div className="lg:w-2/5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full mb-4 text-xs font-bold uppercase tracking-widest">
            {t.badge}
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-6">{t.title}</h2>
          <p className="text-slate-600 text-lg mb-8">
            {t.description}
          </p>

          <div className="space-y-6">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="group cursor-pointer bg-white border-2 border-dashed border-slate-200 p-8 rounded-2xl flex flex-col items-center justify-center text-center hover:border-indigo-500 hover:bg-indigo-50/30 transition-all relative overflow-hidden h-64"
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
              />
              
              {preview ? (
                <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-20" />
              ) : null}

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-400 mb-4 group-hover:scale-110 group-hover:text-indigo-500 transition-all shadow-sm">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="font-bold text-slate-700 text-sm mb-1">{file ? file.name : t.uploadLabel}</p>
                <p className="text-xs text-slate-400">{t.uploadSub}</p>
              </div>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t.promptPlaceholder}
              className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all h-24 resize-none text-sm text-slate-800"
            />

            <button
              onClick={handleAnalyze}
              disabled={loading || !file}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{t.analyzeBtn}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="lg:w-3/5 w-full">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 min-h-[500px] flex flex-col relative overflow-hidden">
             <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <span className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center text-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  {t.analysisResult}
                </h3>
             </div>

             <div className="flex-grow bg-slate-50 p-6 rounded-2xl border border-slate-100 overflow-y-auto max-h-[400px] scrollbar-hide">
                {analysis ? (
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-800 leading-relaxed whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-2">
                      {analysis}
                    </p>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50 py-20">
                     <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                     </svg>
                     <p className="text-sm font-medium italic">{t.waiting}</p>
                  </div>
                )}
             </div>

             <div className="mt-8 text-xs text-slate-400 italic">
               {t.disclaimer}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageAnalysis;
