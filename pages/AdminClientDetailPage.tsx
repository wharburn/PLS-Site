import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

type StoredDoc = {
  id: string;
  name: string;
  size: number;
  category: 'identity' | 'accounting';
  timestamp: string;
  url: string;
  isImage: boolean;
  docKind: string;
  note: string;
  data?: string;
  mime?: string;
};

type StoredClient = {
  profile: { name: string; email: string; address: string; phone: string };
  docs: StoredDoc[];
  audit: { id: string; summary: string; timestamp: string }[];
  updatedAt: string;
};

const AdminClientDetailPage: React.FC = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<StoredClient | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('pls_clients');
      const parsed = raw ? JSON.parse(raw) : {};
      if (email && parsed[email]) {
        setClient(parsed[email]);
      }
    } catch (err) {
      console.error('Failed to load client', err);
    }
  }, [email]);

  if (!client) {
    return (
      <div className="bg-slate-50 py-14">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-2xl font-bold text-slate-900">Client not found</h1>
          <p className="text-slate-600 mt-2">No record available for {email}.</p>
        </div>
      </div>
    );
  }

  const identityDocs = client.docs?.filter((d) => d.category === 'identity') || [];
  const accountingDocs = client.docs?.filter((d) => d.category === 'accounting') || [];

  const requiredIdentity: { key: string; label: string }[] = [
    { key: 'passport', label: 'Passport' },
    { key: 'driver_license', label: 'Driver Licence' },
  ];

  const requiredAccounting: { key: string; label: string }[] = [
    { key: 'bank_statement', label: 'Bank statements' },
    { key: 'compliance', label: 'Compliance documents' },
    { key: 'expenses', label: 'Expenses' },
  ];

  const hasDocKind = (docs: StoredDoc[], kind: string) => docs.some((d) => d.docKind === kind);
  const missingIdentity = requiredIdentity.filter((r) => !hasDocKind(identityDocs, r.key));
  const missingAccounting = requiredAccounting.filter((r) => !hasDocKind(accountingDocs, r.key));

  const suggestions: string[] = [];
  if (missingIdentity.length) suggestions.push(`Request ID: ${missingIdentity.map((m) => m.label).join(', ')}`);
  if (missingAccounting.length) suggestions.push(`Request accounting docs: ${missingAccounting.map((m) => m.label).join(', ')}`);
  if (!missingAccounting.length) suggestions.push('Accounting pack appears complete; proceed with reconciliation.');
  if (accountingDocs.length && !missingAccounting.length) suggestions.push('Run anomaly checks on uploaded statements/expenses.');
  if (!identityDocs.length) suggestions.push('ID missing; obtain before filing or onboarding.');

  return (
    <div className="bg-slate-50 py-14">
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            <span className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center">←</span>
            Back
          </button>

          <div className="text-right ml-auto">
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">Admin view</div>
            <h1 className="text-3xl font-bold text-slate-900 mt-2">{client.profile.name || email}</h1>
            <div className="text-slate-600 text-sm">{client.profile.email}</div>
            <div className="text-slate-500 text-sm">{client.profile.address}</div>
            <div className="text-slate-500 text-sm">{client.profile.phone}</div>
            <div className="text-[11px] text-slate-400 mt-2">Updated {new Date(client.updatedAt).toLocaleString()}</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Documents</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
              {identityDocs.map((doc) => (
                <a key={doc.id} href={doc.url} target="_blank" rel="noopener noreferrer" className="p-3 border border-slate-100 rounded-xl bg-slate-50 flex flex-col gap-2 hover:border-amber-200 hover:bg-amber-50/40">
                  <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-600">{doc.docKind}</div>
                  <div className="text-sm font-bold text-slate-800 truncate">{doc.name}</div>
                  <div className="text-xs text-slate-500 truncate">{doc.note || 'No note'}</div>
                  <div className="text-[11px] text-slate-400">{new Date(doc.timestamp).toLocaleString()}</div>
                </a>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {accountingDocs.map((doc) => (
                <a key={doc.id} href={doc.url} target="_blank" rel="noopener noreferrer" className="p-3 border border-slate-100 rounded-xl bg-slate-50 flex flex-col gap-2 hover:border-slate-300 hover:bg-white">
                  <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-600">{doc.docKind}</div>
                  <div className="text-sm font-bold text-slate-800 truncate">{doc.name}</div>
                  <div className="text-xs text-slate-500 truncate">{doc.note || 'No note'}</div>
                  <div className="text-[11px] text-slate-400">{new Date(doc.timestamp).toLocaleString()}</div>
                </a>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Audit history</h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {client.audit?.length === 0 && <div className="text-sm text-slate-400">No changes recorded.</div>}
              {client.audit?.map((entry) => (
                <div key={entry.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                  <div className="text-xs font-bold text-slate-700">{entry.summary}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-[0.2em] mt-1">{new Date(entry.timestamp).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-slate-900">AI assistant for accountants</h3>
            <button className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-semibold text-slate-700 hover:border-amber-300 hover:bg-amber-50">
              Send reminders for missing docs
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
              <div className="text-[10px] uppercase font-black tracking-[0.25em] text-amber-600">ID docs</div>
              <div className="text-sm text-slate-800">{identityDocs.length} uploaded</div>
              <div className="text-xs text-slate-500">Missing: {missingIdentity.length ? missingIdentity.map((m) => m.label).join(', ') : 'None'}</div>
            </div>
            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
              <div className="text-[10px] uppercase font-black tracking-[0.25em] text-slate-700">Accounting</div>
              <div className="text-sm text-slate-800">{accountingDocs.length} uploaded</div>
              <div className="text-xs text-slate-500">Missing: {missingAccounting.length ? missingAccounting.map((m) => m.label).join(', ') : 'None'}</div>
            </div>
            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
              <div className="text-[10px] uppercase font-black tracking-[0.25em] text-slate-700">Latest</div>
              <div className="text-sm text-slate-800 truncate">{client.docs?.[0]?.name || '—'}</div>
              <div className="text-[11px] text-slate-500">{client.docs?.[0] ? new Date(client.docs[0].timestamp).toLocaleString() : 'No docs yet'}</div>
            </div>
            <div className="p-3 rounded-xl border border-slate-100 bg-slate-50">
              <div className="text-[10px] uppercase font-black tracking-[0.25em] text-slate-700">Audit</div>
              <div className="text-sm text-slate-800">{client.audit?.length || 0} entries</div>
              <div className="text-xs text-slate-500">Latest: {client.audit?.[0] ? new Date(client.audit[0].timestamp).toLocaleString() : '—'}</div>
            </div>
          </div>
          <div className="space-y-2 text-sm text-slate-700">
            <div className="font-bold text-slate-900">Suggested actions</div>
            {suggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-amber-600">•</span>
                <span>{s}</span>
              </div>
            ))}
            {!suggestions.length && <div className="text-slate-500">No actions suggested.</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminClientDetailPage;
