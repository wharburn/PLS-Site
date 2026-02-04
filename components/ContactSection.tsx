
import React from 'react';
import { Language, translations } from '../translations.ts';

interface ContactSectionProps {
  lang: Language;
}

const ContactSection: React.FC<ContactSectionProps> = ({ lang }) => {
  const t = translations[lang].contact;
  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col lg:flex-row gap-16">
        <div className="lg:w-1/2">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">{t.title}</h2>

          <div className="space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-amber-500 flex items-center justify-center rounded-2xl text-white flex-shrink-0 shadow-lg shadow-amber-500/20">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div style={{ width: '100%' }}>
                <h4 className="text-lg font-bold text-slate-900">{lang === 'en' ? 'London Office' : 'Escritório em Londres'}</h4>
                <p className="text-slate-500">38 Wilcox Road, Vauxhall, London SW8 2UX</p>

                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 shadow-lg" style={{ width: '100%', height: 260 }}>
                  <iframe
                    title="PLS Consultants — 38 Wilcox Road"
                    width="100%"
                    height="260"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps?q=38%20Wilcox%20Road,%20Vauxhall,%20London%20SW8%202UX&z=12&output=embed"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <a
                href="tel:+442076222299"
                className="w-12 h-12 bg-indigo-600 flex items-center justify-center rounded-2xl text-white flex-shrink-0 shadow-lg shadow-indigo-600/20 hover:opacity-90 transition-opacity"
                aria-label={lang === 'en' ? 'Call PLS Consultants' : 'Ligar para a PLS Consultants'}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
              <div>
                <h4 className="text-lg font-bold text-slate-900">{lang === 'en' ? 'Telephone' : 'Telefone'}</h4>
                <a className="text-slate-500 hover:text-amber-600 font-bold" href="tel:+442076222299">020 7622 2299</a>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-slate-900 flex items-center justify-center rounded-2xl text-white flex-shrink-0 shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">{lang === 'en' ? 'Email Address' : 'E-mail'}</h4>
                <p className="text-slate-500 underline">info@plsconsultants.co.uk</p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="w-12 h-12 bg-green-500 flex items-center justify-center rounded-2xl text-white flex-shrink-0 shadow-lg shadow-green-500/20">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 448 512">
                   <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.6-2.8-23.6-8.7-45-27.7-16.6-14.8-27.8-33.1-31.1-38.6-3.2-5.6-.3-8.6 2.5-11.4 2.5-2.5 5.6-6.5 8.3-9.7 2.8-3.3 3.7-5.5 5.6-9.2 1.9-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.5 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                </svg>
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">{lang === 'en' ? 'Direct WhatsApp' : 'WhatsApp Direto'}</h4>
                <p className="text-slate-500">{lang === 'en' ? 'Available in English & Portuguese' : 'Disponível em Inglês e Português'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:w-1/2">
          <div className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100">
            <div className="text-slate-600 text-lg font-medium mb-6">
              {t.desc}
            </div>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">{lang === 'en' ? 'Full Name' : 'Nome Completo'}</label>
                  <input type="text" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-0 transition-all" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">{lang === 'en' ? 'Email Address' : 'Endereço de E-mail'}</label>
                  <input type="email" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-0 transition-all" placeholder="john@example.com" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">{lang === 'en' ? 'Service Required' : 'Serviço Pretendido'}</label>
                <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-0 transition-all">
                  <option>{lang === 'en' ? 'Legal Services' : 'Serviços Jurídicos'}</option>
                  <option>{lang === 'en' ? 'Accountancy & Tax' : 'Contabilidade e Fiscalidade'}</option>
                  <option>{lang === 'en' ? 'Translation Services' : 'Serviços de Tradução'}</option>
                  <option>{lang === 'en' ? 'Business Setup' : 'Constituição de Empresas'}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">{lang === 'en' ? 'Your Message' : 'A Sua Mensagem'}</label>
                <textarea className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-amber-500 focus:ring-0 transition-all h-32 resize-none" placeholder={lang === 'en' ? 'How can we help you today?' : 'Como podemos ajudar hoje?'}></textarea>
              </div>

              <div className="flex items-center gap-3">
                 <input type="checkbox" className="rounded text-amber-500 focus:ring-amber-500" />
                 <span className="text-xs text-slate-500">{lang === 'en' ? 'I agree to the processing of my data in accordance with the Privacy Policy.' : 'Concordo com o tratamento dos meus dados de acordo com a Política de Privacidade.'}</span>
              </div>

              <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-all shadow-xl flex items-center justify-center gap-2">
                {lang === 'en' ? 'Send Consultation Request' : 'Enviar Pedido de Consulta'}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
