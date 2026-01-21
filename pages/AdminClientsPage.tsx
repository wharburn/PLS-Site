import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type ClientRecord = {
  profile: { name: string; email: string; address: string; phone: string };
  updatedAt: string;
  docs?: { category: string }[];
  aiAccess?: boolean;
};

const AdminClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Record<string, ClientRecord>>({});
  const [aiMessage, setAiMessage] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = localStorage.getItem('pls_clients');
      const parsed = raw ? JSON.parse(raw) : {};
      const seedEmail = 'andrew.person@example.com';
      const existing = parsed[seedEmail] || {};
      parsed[seedEmail] = {
        profile: {
          name: 'Andrew Person',
          email: seedEmail,
          address: '30 Harrington Gardens, London SW7 4TL',
          phone: '+44 7304 021 303 / 0207 555 1234',
        },
        docs: existing.docs || [],
        audit: existing.audit || [],
        updatedAt: existing.updatedAt || new Date().toISOString(),
        password: existing.password || 'PLSwebsite',
        aiAccess: existing.aiAccess !== undefined ? existing.aiAccess : true,
      };
      localStorage.setItem('pls_clients', JSON.stringify(parsed));
      setClients(parsed);
    } catch (err) {
      console.error('Failed to load clients', err);
    }
  }, []);

  const entries = Object.entries(clients) as [string, ClientRecord][];

  const setAiAccess = (email: string, value: boolean) => {
    setClients((prev) => {
      const next = { ...prev };
      if (!next[email]) return prev;
      next[email] = { ...next[email], aiAccess: value };
      try {
        const key = 'pls_clients';
        const raw = localStorage.getItem(key);
        const parsed = raw ? JSON.parse(raw) : {};
        if (parsed[email]) parsed[email].aiAccess = value;
        localStorage.setItem(key, JSON.stringify(parsed));
      } catch (err) {
        console.error('Failed to persist aiAccess', err);
      }
      return next;
    });
  };

  return (
    <div className="bg-slate-50 py-14">
      <div className="max-w-6xl mx-auto px-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-[0.25em]">
              Admin
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">Client directory</h1>
            <p className="text-slate-600 text-sm mt-1">Select a client to view profile and documents.</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-600">AI assistant (accountant)</div>
            {aiMessage && <div className="text-xs text-amber-700">{aiMessage}</div>}
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-slate-600">
            {['Check missing docs','Draft reminder email','Summarize latest uploads','Prep doc requests','List clients missing ID'].map((s) => (
              <button
                key={s}
                className="px-3 py-1.5 rounded-full border border-slate-200 hover:border-amber-300 hover:text-amber-700"
                onClick={() => setAiPrompt(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="w-full border border-slate-200 rounded-2xl p-3 text-sm text-slate-800 bg-slate-50 focus:border-amber-500 focus:ring-amber-500 min-h-[110px]"
            placeholder="Ask the AI to review clients, check missing documents, or draft reminders..."
          />
          <button
            className="w-full sm:w-auto px-4 py-2 bg-slate-900 text-amber-500 rounded-xl font-bold text-sm hover:bg-slate-800"
            onClick={() => setAiMessage('Request sent to AI')}
          >
            Send
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-3">
          <div className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-600">Quick AI suggestions</div>
          <div className="flex flex-wrap gap-2 text-xs text-slate-600">
            {['Identify clients missing ID','List clients missing bank statements','Draft doc request for all','Prepare compliance reminder'].map((s) => (
              <button
                key={s}
                className="px-3 py-1.5 rounded-full border border-slate-200 hover:border-amber-300 hover:text-amber-700"
                onClick={() => setAiPrompt(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {entries.length === 0 && <div className="text-slate-500">No clients captured yet.</div>}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map(([email, record]) => (
            <div
              key={email}
              className="p-4 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-amber-200 hover:bg-amber-50/40 transition-colors cursor-pointer"
              onClick={() => navigate(`/admin/clients/${encodeURIComponent(email)}`)}
            >
              <div className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">{email}</div>
              <div className="text-lg font-bold text-slate-900 mt-1">{record.profile.name || 'Unnamed client'}</div>
              <div className="text-sm text-slate-500 mt-1 whitespace-pre-line">
                {record.profile.address.replace(/,\s*/g, ',\n')}
              </div>
              <div className="text-[11px] text-slate-400 mt-2">Updated {new Date(record.updatedAt).toLocaleString()}</div>
              <label
                className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-600"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={record.aiAccess !== false}
                  onChange={(e) => setAiAccess(email, e.target.checked)}
                />
                AI access
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminClientsPage;
