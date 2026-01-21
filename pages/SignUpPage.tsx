import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SignUpData {
  name: string;
  email: string;
  address: string;
  phone: string;
}

const SignUpPage: React.FC = () => {
  const [form, setForm] = useState<SignUpData>({ name: '', email: '', address: '', phone: '' });
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field: keyof SignUpData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    localStorage.setItem('pls_signup_profile', JSON.stringify(form));
    localStorage.setItem('pls_portal_email', form.email);
    setTimeout(() => navigate('/client'), 600);
  };

  return (
    <div className="bg-white py-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-[0.25em]">
            Client Onboarding
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-4 font-serif italic">Create your account</h1>
          <p className="text-lg text-slate-600 mt-3 max-w-3xl leading-relaxed">
            Enter your details to provision a secure portal. We keep a full audit trail of profile updates and document uploads.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="Jane Client"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="you@company.com"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Address</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="123 Client Road, London"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Telephone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                placeholder="+44 7700 900000"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-amber-500 font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg"
          >
            Create account
          </button>

          {submitted && (
            <div className="text-green-700 bg-green-50 border border-green-100 px-4 py-3 rounded-xl text-sm">
              Account details captured. Redirecting to your portal...
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
