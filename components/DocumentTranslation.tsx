import React, { useEffect, useRef, useState } from 'react';
import { translateDocument } from '../services/gemini.ts';
import { Language, translations } from '../translations.ts';

interface DocumentTranslationProps {
  lang: Language;
}

type TranslationStatus = 'idle' | 'processing' | 'success' | 'error';

const DocumentTranslation: React.FC<DocumentTranslationProps> = ({ lang }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [status, setStatus] = useState<TranslationStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState<'EN-PT' | 'PT-EN'>('EN-PT');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const t = translations[lang].documentTranslation;

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) window.clearInterval(progressIntervalRef.current);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setStatus('idle');
      setTranslatedText(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selected);
    }
  };

  const startProgress = () => {
    setProgress(0);
    if (progressIntervalRef.current) window.clearInterval(progressIntervalRef.current);

    progressIntervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev; // Hold at 90% until finished
        return prev + (prev < 40 ? 5 : 2);
      });
    }, 400);
  };

  const stopProgress = (isSuccess: boolean) => {
    if (progressIntervalRef.current) window.clearInterval(progressIntervalRef.current);
    if (isSuccess) {
      setProgress(100);
    } else {
      setProgress(0);
    }
  };

  const handleTranslate = async () => {
    if (!file && !sourceText) return;
    setStatus('processing');
    setTranslatedText(null);
    startProgress();

    let base64File = null;
    let fileMimeType = null;

    if (preview && file) {
      base64File = preview.split(',')[1];
      if (file.type.startsWith('image/')) {
        fileMimeType = file.type;
      } else if (file.type === 'application/pdf') {
        fileMimeType = 'application/pdf';
      }
    }

    const source = direction === 'EN-PT' ? 'English' : 'Portuguese';
    const target = direction === 'EN-PT' ? 'Portuguese' : 'English';

    try {
      const result = await translateDocument(sourceText, base64File, fileMimeType, source, target);
      if (result) {
        setTranslatedText(result);
        setStatus('success');
        stopProgress(true);
      } else {
        throw new Error('Empty result');
      }
    } catch (error) {
      console.error('Translation error:', error);
      setStatus('error');
      stopProgress(false);
    }
  };

  const downloadTxt = () => {
    if (!translatedText) return;
    const blob = new Blob([translatedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PLS_Translation_${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col lg:flex-row gap-16 items-start">
        <div className="lg:w-2/5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full mb-4 text-xs font-bold uppercase tracking-widest">
            {t.freeService}
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-6">{t.title}</h2>
          <p className="text-slate-600 text-lg mb-8">{t.desc}</p>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <label className="block text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">
                {t.selectDirection}
              </label>
              <div className="flex gap-4">
                <button
                  onClick={() => setDirection('EN-PT')}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-bold text-sm ${
                    direction === 'EN-PT'
                      ? 'border-amber-500 bg-amber-50 text-amber-700'
                      : 'border-slate-100 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  EN → PT
                </button>
                <button
                  onClick={() => setDirection('PT-EN')}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all font-bold text-sm ${
                    direction === 'PT-EN'
                      ? 'border-amber-500 bg-amber-50 text-amber-700'
                      : 'border-slate-100 text-slate-400 hover:border-slate-200'
                  }`}
                >
                  PT → EN
                </button>
              </div>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="group cursor-pointer bg-slate-50 border-2 border-dashed border-slate-200 p-10 rounded-2xl flex flex-col items-center justify-center text-center hover:border-amber-500 hover:bg-amber-50/30 transition-all relative overflow-hidden"
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,.pdf,.txt"
                onChange={handleFileChange}
              />
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-400 mb-4 group-hover:scale-110 group-hover:text-amber-500 transition-all shadow-sm">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <p className="font-bold text-slate-700 text-sm mb-1 line-clamp-1">
                {file ? file.name : t.dropFiles}
              </p>
              <p className="text-xs text-slate-400">{t.fileLimit}</p>

              {file && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setPreview(null);
                  }}
                  className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder={t.textPlaceholder}
              className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all h-32 resize-none text-sm text-slate-800"
            />

            <button
              onClick={handleTranslate}
              disabled={status === 'processing' || (!file && !sourceText)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 group"
            >
              {status === 'processing' ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Translating...</span>
                </div>
              ) : (
                <>
                  <span>{t.translateBtn}</span>
                  <svg
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="lg:w-3/5 w-full">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 min-h-[550px] flex flex-col relative overflow-hidden">
            {/* Status Indicators */}
            <div className="absolute top-0 left-0 right-0">
              {status === 'processing' && (
                <div className="h-1 bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                <span className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center text-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </span>
                {t.translatedContent}
              </h3>

              {status === 'success' && (
                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-bold animate-in fade-in zoom-in-95">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Translation Complete
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold animate-in fade-in zoom-in-95">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Error Occurred
                </div>
              )}
            </div>

            <div className="flex-grow bg-slate-50 p-6 rounded-2xl border border-slate-100 overflow-y-auto max-h-[400px] mb-8 scrollbar-hide relative">
              {status === 'processing' ? (
                <div className="h-full flex flex-col items-center justify-center gap-6 py-20">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-slate-200 border-t-amber-500 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-500">
                      {progress}%
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-slate-900 font-bold mb-1">Analyzing Content...</p>
                    <p className="text-slate-400 text-xs italic">
                      Extracting text and matching linguistic patterns
                    </p>
                  </div>
                </div>
              ) : translatedText ? (
                <p className="text-slate-800 leading-relaxed whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-2">
                  {translatedText}
                </p>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50 py-20">
                  <svg
                    className="w-12 h-12 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-sm font-medium italic">{t.waiting}</p>
                </div>
              )}
            </div>

            <div className="mt-auto flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="text-xs text-slate-400 max-w-sm text-center sm:text-left leading-relaxed">
                {t.disclaimer}
              </div>
              {translatedText && status === 'success' && (
                <button
                  onClick={downloadTxt}
                  className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-3 group animate-in slide-in-from-right-4"
                >
                  <svg
                    className="w-5 h-5 group-hover:translate-y-0.5 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  {t.downloadBtn}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentTranslation;
