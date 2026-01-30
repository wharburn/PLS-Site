import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Language } from '../translations.ts';

interface ClientDashboardPageProps {
  lang: Language;
}

type Profile = {
  name: string;
  email: string;
  workEmail: string;
  address: string;
  address2: string;
  city: string;
  postcode: string;
  phone: string;
  mobile: string;
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
  url: string;
  isImage: boolean;
  docKind: 'passport' | 'driver_license' | 'bank_statement' | 'compliance' | 'expenses' | 'other';
  note: string;
  data?: string;
  mime?: string;
};

const seedEmail = 'andrew.person@example.com';
const seedProfile: Profile = {
  name: 'Andrew Person',
  email: seedEmail,
  workEmail: 'andrew.person@work.com',
  address: '30 Harrington Gardens',
  address2: 'London',
  city: 'London',
  postcode: 'SW7 4TL',
  phone: '+44 0207 555 1234',
  mobile: '+44 7304 021 303',
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
      return (
        localStorage.getItem('pls_portal_email') || (location.state as any)?.email || seedEmail
      );
    } catch {
      return seedEmail;
    }
  }, [location.state]);

  const [profile, setProfile] = useState<Profile>(seedProfile);
  const [draft, setDraft] = useState<Profile>(seedProfile);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [saving, setSaving] = useState(false);
  const [identityKind, setIdentityKind] = useState<UploadedDoc['docKind']>('passport');
  const [accountingKind, setAccountingKind] = useState<UploadedDoc['docKind']>('bank_statement');
  const objectUrlsRef = useRef<string[]>([]);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replaceTarget, setReplaceTarget] = useState<UploadedDoc | null>(null);
  const [aiAccess, setAiAccess] = useState(true);

  useEffect(() => {
    try {
      const key = 'pls_clients';
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : {};
      let rec = parsed[portalEmail];
      if (!rec) {
        rec = {
          profile: onboardingProfile || seedProfile,
          docs: [],
          audit: [],
          updatedAt: new Date().toISOString(),
          aiAccess: true,
        };
        parsed[portalEmail] = rec;
        localStorage.setItem(key, JSON.stringify(parsed));
      }
      setProfile(rec.profile || seedProfile);
      setDraft(rec.profile || seedProfile);
      setDocs(rec.docs || []);
      setAudit(rec.audit || []);
      setAiAccess(rec.aiAccess !== false);
    } catch (err) {
      console.error('Failed to load client data', err);
      setProfile(seedProfile);
      setDraft(seedProfile);
    }
  }, [portalEmail, onboardingProfile]);

  const logChange = (summary: string, type: AuditEntry['type']) => {
    setAudit((prev) => [
      { id: crypto.randomUUID(), summary, type, timestamp: new Date().toISOString() },
      ...prev,
    ]);
  };

  const persistClient = (nextDocs: UploadedDoc[], nextAudit: AuditEntry[]) => {
    try {
      const key = 'pls_clients';
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : {};
      const record = {
        profile,
        docs: nextDocs,
        audit: nextAudit,
        updatedAt: new Date().toISOString(),
        aiAccess,
      };
      parsed[portalEmail] = record;
      localStorage.setItem(key, JSON.stringify(parsed));
    } catch (err) {
      console.error('Persist client failed', err);
    }
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
    persistClient(docs, audit);
    setSaving(true);
    setTimeout(() => setSaving(false), 700);
  };

  const handleUpload = (
    category: UploadedDoc['category'],
    fileList: FileList | null,
    docKind: UploadedDoc['docKind']
  ) => {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);
    const newEntries: UploadedDoc[] = files.map((file) => {
      const url = URL.createObjectURL(file);
      objectUrlsRef.current.push(url);
      return {
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        category,
        timestamp: new Date().toISOString(),
        url,
        isImage: file.type.startsWith('image/'),
        docKind,
        note: '',
      };
    });

    setDocs((prev) => {
      let next = [...prev];
      if (category === 'identity') {
        next = next.filter((d) => !(d.category === 'identity' && d.docKind === docKind));
      }
      next = [...newEntries, ...next];
      const desc = category === 'identity' ? 'Identity Vault' : 'Accounting Folder';
      logChange(`Uploaded ${newEntries.length} file(s) to ${desc} (${docKind})`, 'upload');
      persistClient(next, audit);
      return next;
    });
  };

  const formatSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const identityDocs = docs.filter((d) => d.category === 'identity');
  const accountingDocs = docs.filter((d) => d.category === 'accounting');

  React.useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const triggerReplace = (doc: UploadedDoc) => {
    setReplaceTarget(doc);
    replaceInputRef.current?.click();
  };

  const handleReplace = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !replaceTarget) return;
    const file = files[0];
    const url = URL.createObjectURL(file);
    objectUrlsRef.current.push(url);
    const updated: UploadedDoc = {
      ...replaceTarget,
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      timestamp: new Date().toISOString(),
      url,
      isImage: file.type.startsWith('image/'),
    };
    setDocs((prev) => {
      const next = prev.map((d) => (d.id === replaceTarget.id ? updated : d));
      logChange(`Replaced ${replaceTarget.name} with ${file.name}`, 'upload');
      persistClient(next, audit);
      return next;
    });
    setReplaceTarget(null);
    e.target.value = '';
  };

  const updateNote = (id: string, value: string) => {
    setDocs((prev) => {
      const next = prev.map((d) => (d.id === id ? { ...d, note: value } : d));
      persistClient(next, audit);
      return next;
    });
  };

  if (!portalEmail) {
    return (
      <div className="bg-slate-50 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-4">
          <h1 className="text-3xl font-bold text-slate-900">Portal access required</h1>
          <p className="text-slate-600">
            Please sign in or create an account to view your client workspace.
          </p>
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
    <div className="bg-slate-50 py-8 pt-12">
      <div className="max-w-6xl mx-auto px-6 space-y-4">
        <input type="file" ref={replaceInputRef} className="hidden" onChange={handleReplace} />
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ paddingTop: '30px' }}>
              <span className="text-amber-600">Client Portal</span>
              <span style={{ marginLeft: '30px' }} className="text-slate-900">
                Your secure workspace
              </span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your profile, upload identity and accounting documents, and view a full audit
              trail of changes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            <span className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center">
              🏠
            </span>
            Back to website
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Profile details</h2>
                  <div className="text-xs text-slate-500 mt-1">
                    Signed in as <span className="font-semibold text-slate-900">{portalEmail}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={saveProfile}
                    className="px-6 py-3 bg-slate-900 text-amber-500 font-bold rounded-xl shadow hover:bg-slate-800 transition-all"
                  >
                    Save changes
                  </button>
                  <Link
                    to="/client/documents"
                    className="px-6 py-3 bg-slate-900 text-amber-500 font-bold rounded-xl shadow hover:bg-slate-800 transition-all"
                  >
                    Manage documents
                  </Link>
                </div>
              </div>
              <form className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={draft.name}
                      onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                      Personal Email
                    </label>
                    <input
                      type="email"
                      value={draft.email}
                      onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      value={draft.address}
                      onChange={(e) => setDraft({ ...draft, address: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                      Work Email
                    </label>
                    <input
                      type="email"
                      value={draft.workEmail}
                      onChange={(e) => setDraft({ ...draft, workEmail: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={draft.address2}
                      onChange={(e) => setDraft({ ...draft, address2: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                      Mobile
                    </label>
                    <input
                      type="tel"
                      value={draft.mobile}
                      onChange={(e) => setDraft({ ...draft, mobile: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={draft.city}
                        onChange={(e) => setDraft({ ...draft, city: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                        Postcode
                      </label>
                      <input
                        type="text"
                        value={draft.postcode}
                        onChange={(e) => setDraft({ ...draft, postcode: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                      Telephone
                    </label>
                    <input
                      type="tel"
                      value={draft.phone}
                      onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-600">
                    Documents
                  </div>
                  <div className="text-sm text-slate-500">Summary of your uploads.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600">
                Identity
              </div>
              <div className="text-2xl font-bold text-slate-900">{identityDocs.length}</div>
              <div className="text-xs text-slate-500">Passport / Driver Licence</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-700">
                Accounting
              </div>
              <div className="text-2xl font-bold text-slate-900">{accountingDocs.length}</div>
              <div className="text-xs text-slate-500">Bank, compliance, expenses, other</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-700">
                Latest upload
              </div>
              <div className="text-sm text-slate-900 font-bold truncate">
                {docs[0]?.name || '—'}
              </div>
              <div className="text-[11px] text-slate-500">
                {docs[0] ? new Date(docs[0].timestamp).toLocaleString() : 'No documents yet'}
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-700">
                Audit entries
              </div>
              <div className="text-2xl font-bold text-slate-900">{audit.length}</div>
              <div className="text-xs text-slate-500">Recent actions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboardPage;
