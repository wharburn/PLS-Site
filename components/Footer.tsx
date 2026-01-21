
import React from 'react';
import { LOGO_COMPONENT } from '../constants.tsx';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-20 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              {LOGO_COMPONENT('w-14 h-14')}
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight text-white leading-none">PLS Consultants</span>
                <span className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">London & Portugal</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Multidisciplinary professional services firm providing legal, financial, and translation excellence through strategic partnerships.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#home" className="hover:text-amber-500 transition-colors">Home</a></li>
              <li><a href="#services" className="hover:text-amber-500 transition-colors">Core Services</a></li>
              <li><a href="#partners" className="hover:text-amber-500 transition-colors">Partner Firms</a></li>
              <li><a href="#about" className="hover:text-amber-500 transition-colors">Leadership</a></li>
              <li><a href="#ai-advice" className="hover:text-amber-500 transition-colors">AI Assistant</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Compliance</h4>
            <ul className="space-y-4 text-sm">
              <li>HMRC Agent</li>
              <li>ICO Registered</li>
              <li>Solicitors (Partner Firms)</li>
              <li>ACCA Certified Accountant</li>
              <li>Chartered Linguist</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Vauxhall HQ</h4>
            <p className="text-sm leading-relaxed">
              38 Wilcox Road<br />
              Vauxhall, London<br />
              SW8 2UX, United Kingdom
            </p>
            <div className="mt-6">
              <div className="text-white font-bold text-lg">020 7622 2299</div>
              <div className="text-xs text-slate-500">Mon - Fri: 09:00 - 18:00</div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium">
          <div>
            &copy; {new Date().getFullYear()} PLS Consultants Int. All Rights Reserved.
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">GDPR Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
