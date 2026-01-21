import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Language } from '../translations.ts';

interface ClientDashboardPageProps {
  lang: Language;
}

type Profile = {
  name: string;
  email: string;
  address: string;
  phone: string;
};

type AuditEntry = {
  id: string;
  type: 'profile' | 'upload';
  summary: string;
  timestamp: string;
};

type UploadedDoc = {
  id: string;
  name: string;
  size: number;
  category: 'identity' | 'accounting';
  timestamp: string;
};

const defaultProfile: Profile = {
  name: 'Client Name',
  email: 'client@example.com',
  address: 'Vauxhall, London',
  phone: '+44 0000 000000',
};

const ClientDashboardPage: React.FC<ClientDashboardPageProps> = ({ lang: _lang }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const onboardingProfile = useMemo(() => {
    try {
      const stored = localStorage.getItem('pls_signup_profile');
      return stored ? (JSON.parse(stored) as Profile) : null;
    } catch {
      return null;
    }
  }, []);

  const portalEmail = useMemo(() => {
    try {
      return localStorage.getItem('pls_portal_email') || (location.state as any)?.email || '';
    } catch {
      return '';
    }
  }, [location.state]);

  const initialProfile = onboardingProfile || {
    ...defaultProfile,
    email: portalEmail || defaultProfile.email,
  };

  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [draft, setDraft] = useState<Profile>(initialProfile);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [saving, setSaving] = useState(false);

  const logChange = (summary: string, type: AuditEntry['type']) => {
    setAudit((prev) => [
      { id: crypto.randomUUID(), summary, type, timestamp: new Date().toISOString() },
      ...prev,
    ]);
  };

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const diffs: string[] = [];
    (['name', 'email', 'address', 'phone'] as (keyof Profile)[]).forEach((key) => {
      if (profile[key] !== draft[key]) {
        diffs.push(`${key} changed`);
      }
    });
    setProfile(draft);
    if (diffs.length > 0) {
      logChange(`Profile updated: ${diffs.join(', ')}`, 'profile');
    }
    setSaving(true);
    setTimeout(() => setSaving(false), 700);
  };

  const handleUpload = (category: UploadedDoc['category'], fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    const entry: UploadedDoc = {
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      category,
      timestamp: new Date().toISOString(),
    };
    setDocs((prev) => [entry, ...prev]);
    logChange(`Uploaded ${file.name} to ${category === 'identity' ? 'Identity Vault' : 'Accounting Folder'}`, 'upload');
  };

  const formatSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const identityDocs = docs.filter((d) => d.category === 'identity');
  const accountingDocs = docs.filter((d) => d.category === 'accounting');

  if (!portalEmail) {
    return (
      <div className="bg-slate-50 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-4">
          <h1 className="text-3xl font-bold text-slate-900">Portal access required</h1>
          <p className="text-slate-600">Please sign in or create an account to view your client workspace.</p>
          <div className="flex gap-3 justify-center">
            <button
              className="px-6 py-3 bg-slate-900 text-amber-500 font-bold rounded-xl shadow hover:bg-slate-800"
              onClick={() => navigate('/')}
            >
              Go to sign in
            </button>
            <Link
              to="/signup"
              className="px-6 py-3 bg-amber-500 text-white font-bold rounded-xl shadow hover:bg-amber-600"
            >
              Create account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 py-20">
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-[0.25em]">
              Client Portal
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mt-3 font-serif italic">Your secure workspace</h1>
            <p className="text-slate-600 mt-3 max-w-2xl">
              Manage your profile, upload identity and accounting documents, and view a full audit trail of changes.
            </p>
            <div className="text-sm text-slate-500 mt-2">Signed in as {portalEmail}</div>
          </div>
          <div className="bg-white border border-amber-100 text-amber-700 px-4 py-3 rounded-xl text-sm font-bold">
            Audit logging enabled
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Profile details</h2>
            <form className="space-y-6" onSubmit={saveProfile}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Name</label>
                  <input
                    type="text"
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email</label>
                  <input
                    type="email"
                    value={draft.email}
                    onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Address</label>
                  <input
                    type="text"
                    value={draft.address}
                    onChange={(e) => setDraft({ ...draft, address: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Telephone</label>
                  <input
                    type="tel"
                    value={draft.phone}
                    onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-3 bg-slate-900 text-amber-500 font-bold rounded-xl shadow hover:bg-slate-800 transition-all"
                >
                  Save changes
                </button>
                {saving && <span className="text-slate-500 text-sm self-center">Saved.</span>}
              </div>
            </form>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Audit history</h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {audit.length === 0 && (
                <div className="text-sm text-slate-400">No changes recorded yet.</div>
              )}
              {audit.map((entry) => (
                <div key={entry.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                  <div className="text-xs font-bold text-slate-700">{entry.summary}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-[0.2em] mt-1">{new Date(entry.timestamp).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Identity vault</h3>
              <label className="px-3 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-semibold cursor-pointer border border-amber-100">
                Upload ID
                <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => handleUpload('identity', e.target.files)} />
              </label>
            </div>
            <p className="text-sm text-slate-500 mb-4">Add passport or driver licence files. Stored securely with a change record.</p>
            <div className="space-y-3">
              {identityDocs.length === 0 && <div className="text-sm text-slate-400">No identity documents uploaded.</div>}
              {identityDocs.map((doc) => (
                <div key={doc.id} className="p-3 border border-slate-100 rounded-xl bg-slate-50 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-slate-800">{doc.name}</div>
                    <div className="text-[11px] text-slate-400">{formatSize(doc.size)} • {new Date(doc.timestamp).toLocaleString()}</div>
                  </div>
                  <span className="text-[11px] font-bold text-amber-600 uppercase tracking-[0.2em]">ID</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Accounting folder</h3>
              <label className="px-3 py-2 bg-slate-900 text-amber-500 rounded-lg text-sm font-semibold cursor-pointer border border-slate-800">
                Upload document
                <input type="file" className="hidden" onChange={(e) => handleUpload('accounting', e.target.files)} />
              </label>
            </div>
            <p className="text-sm text-slate-500 mb-4">Store working papers, tax packs, or evidence. Organised and logged.</p>
            <div className="space-y-3">
              {accountingDocs.length === 0 && <div className="text-sm text-slate-400">No accounting documents uploaded.</div>}
              {accountingDocs.map((doc) => (
                <div key={doc.id} className="p-3 border border-slate-100 rounded-xl bg-slate-50 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-slate-800">{doc.name}</div>
                    <div className="text-[11px] text-slate-400">{formatSize(doc.size)} • {new Date(doc.timestamp).toLocaleString()}</div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-[0.2em]">Folder</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboardPage;
