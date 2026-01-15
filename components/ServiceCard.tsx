
import React, { useState } from 'react';
import { Service } from '../types.ts';
import { Language, translations } from '../translations.ts';

interface ServiceCardProps {
  service: Service;
  lang: Language;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, lang }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = translations[lang].services;

  return (
    <div 
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col cursor-pointer ${
        isExpanded ? 'ring-2 ring-amber-500 shadow-2xl' : 'hover:-translate-y-2'
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={service.image}
          alt={service.title}
          className={`w-full h-full object-cover transition-transform duration-1000 ${isExpanded ? 'scale-110 blur-[2px]' : 'group-hover:scale-110'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
        
        <div className="absolute top-4 left-4 w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center text-2xl z-10 transition-transform group-hover:scale-110">
          {service.icon}
        </div>

        <div className={`absolute top-4 right-4 bg-amber-500 text-white text-[9px] font-black uppercase px-2 py-1 rounded transition-all duration-300 ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
          Full Details
        </div>
      </div>
      
      <div className="p-8 flex-grow flex flex-col relative bg-white z-10">
        <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors">
          {service.title}
        </h3>
        
        <div className="relative min-h-[48px] overflow-hidden transition-all duration-500 ease-in-out">
          <p className={`text-slate-600 leading-relaxed transition-all duration-500 ${isExpanded ? 'opacity-0 -translate-y-4 absolute' : 'opacity-100 translate-y-0 line-clamp-2'}`}>
            {service.description}
          </p>
          
          <div className={`transition-all duration-700 ease-out ${isExpanded ? 'opacity-100 translate-y-0 relative' : 'opacity-0 translate-y-8 absolute pointer-events-none'}`}>
            <p className="text-slate-700 leading-relaxed text-sm">
              {service.longDescription}
            </p>
          </div>
        </div>

        <div className="mt-auto pt-6 flex items-center justify-between">
          <button className="flex items-center gap-2 text-amber-600 font-bold text-[11px] uppercase tracking-[0.2em] transition-all">
            {isExpanded ? t.close : t.learnMore}
            <svg 
              className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : 'group-hover:translate-x-1'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isExpanded ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              )}
            </svg>
          </button>
          
          <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {isExpanded ? 'Press to exit' : 'Click for more'}
          </span>
        </div>
      </div>

      {!isExpanded && (
        <div className="absolute inset-x-0 bottom-1 overflow-hidden h-0 group-hover:h-20 bg-gradient-to-t from-slate-50 to-transparent transition-all duration-500 ease-in-out border-t border-slate-50">
          <div className="px-8 py-3 opacity-0 group-hover:opacity-100 transition-opacity delay-200">
             <span className="text-[9px] font-black text-amber-600 uppercase tracking-widest block mb-1">{t.peek}</span>
             <p className="text-[11px] text-slate-400 line-clamp-2 italic leading-tight">
               {service.longDescription}
             </p>
          </div>
        </div>
      )}

      <div 
        className={`absolute bottom-0 left-0 h-1 bg-amber-500 transition-all duration-700 ease-in-out ${isExpanded ? 'w-full' : 'group-hover:w-full'}`}
        style={{ width: isExpanded ? '100%' : '0%' }}
      ></div>
    </div>
  );
};

export default ServiceCard;
