import React, { useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
};

type ClientRecord = {
  profile: { name: string; email: string; address: string; phone: string };
  docs: UploadedDoc[];
  audit: { id: string; summary: string; timestamp: string }[];
  updatedAt: string;
};

const ClientDocumentsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [identityKind, setIdentityKind] = useState<UploadedDoc['docKind']>('passport');
  const [accountingKind, setAccountingKind] = useState<UploadedDoc['docKind']>('bank_statement');
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [audit, setAudit] = useState<{ id: string; summary: string; timestamp: string }[]>([]);
  const [profile, setProfile] = useState<ClientRecord['profile'] | null>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const objectUrlsRef = useRef<string[]>([]);
  const [replaceTarget, setReplaceTarget] = useState<UploadedDoc | null>(null);

  const portalEmail = useMemo(() => {
    try {
      return localStorage.getItem('pls_portal_email') || (location.state as any)?.email || '';
    } catch {
      return '';
    }
  }, [location.state]);

  useMemo(() => {
    if (!portalEmail) return;
    try {
      const raw = localStorage.getItem('pls_clients');
      const parsed = raw ? JSON.parse(raw) : {};
      const rec: ClientRecord | undefined = parsed[portalEmail];
      if (rec) {
        setDocs(rec.docs || []);
        setAudit(rec.audit || []);
        setProfile(rec.profile || null);
      }
    } catch (err) {
      console.error('Load client documents failed', err);
    }
  }, [portalEmail]);

  const persist = (nextDocs: UploadedDoc[], nextAudit = audit) => {
    if (!portalEmail) return;
    try {
      const key = 'pls_clients';
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : {};
      const record: ClientRecord = {
        profile: profile || { name: '', email: portalEmail, address: '', phone: '' },
        docs: nextDocs,
        audit: nextAudit,
        updatedAt: new Date().toISOString(),
      };
      parsed[portalEmail] = record;
      localStorage.setItem(key, JSON.stringify(parsed));
    } catch (err) {
      console.error('Persist failed', err);
    }
  };

  const logChange = (summary: string) => {
    setAudit((prev) => {
      const next = [{ id: crypto.randomUUID(), summary, timestamp: new Date().toISOString() }, ...prev];
      persist(docs, next);
      return next;
    });
  };

  const formatSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
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
      persist(next, audit);
      logChange(`Uploaded ${newEntries.length} file(s) to ${category} (${docKind})`);
      return next;
    });
  };

  const updateNote = (id: string, value: string) => {
    setDocs((prev) => {
      const next = prev.map((d) => (d.id === id ? { ...d, note: value } : d));
      persist(next, audit);
      return next;
    });
  };

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
      persist(next, audit);
      logChange(`Replaced ${replaceTarget.name} with ${file.name}`);
      return next;
    });
    setReplaceTarget(null);
    e.target.value = '';
  };

  React.useEffect(() => {
    return () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const identityDocs = docs.filter((d) => d.category === 'identity');
  const accountingDocs = docs.filter((d) => d.category === 'accounting');

  if (!portalEmail) {
    return (
      <div className="bg-slate-50 py-14">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-4">
          <h1 className="text-3xl font-bold text-slate-900">Portal access required</h1>
          <p className="text-slate-600">Please sign in to manage documents.</p>
          <button
            className="px-6 py-3 bg-slate-900 text-amber-500 font-bold rounded-xl shadow hover:bg-slate-800"
            onClick={() => navigate('/')}
          >
            Go to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 py-14">
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        <input type="file" ref={replaceInputRef} className="hidden" onChange={handleReplace} />

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.25em] text-amber-600">Client documents</div>
            <h1 className="text-3xl font-bold text-slate-900 mt-2">{profile?.name || portalEmail}</h1>
            <div className="text-slate-600 text-sm">{portalEmail}</div>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
          >
            <span className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center">←</span>
            Back
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-600">Identity vault</div>
                <div className="text-sm text-slate-500">Upload passport or driver licence.</div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  className="px-3 py-2 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 text-sm font-semibold"
                  value={identityKind}
                  onChange={(e) => setIdentityKind(e.target.value as UploadedDoc['docKind'])}
                >
                  <option value="passport">Passport</option>
                  <option value="driver_license">Driver Licence</option>
                </select>
                <label className="px-3 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-semibold cursor-pointer border border-amber-100">
                  Upload
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    accept="image/*,.pdf"
                    onChange={(e) => handleUpload('identity', e.target.files, identityKind)}
                  />
                </label>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {identityDocs.length === 0 && <div className="text-sm text-slate-400">No identity documents uploaded.</div>}
              {identityDocs.map((doc) => (
                <div key={doc.id} className="p-3 border border-slate-100 rounded-xl bg-slate-50 flex flex-col gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 overflow-hidden flex items-center justify-center">
                      {doc.isImage ? (
                        <img src={doc.url} alt={doc.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-[10px] font-bold text-slate-400 uppercase">File</div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-800 truncate">{doc.name}</div>
                      <div className="text-[11px] text-amber-700 uppercase tracking-[0.2em]">{doc.docKind}</div>
                      <div className="text-[11px] text-slate-400 truncate">{formatSize(doc.size)} • {new Date(doc.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={doc.note}
                    onChange={(e) => updateNote(doc.id, e.target.value)}
                    placeholder="Add a note"
                    className="w-full text-[11px] text-slate-700 border border-slate-200 rounded px-2 py-1"
                  />
                  <div className="flex items-center justify-between text-[11px] text-amber-600 font-bold uppercase tracking-[0.2em]">
                    ID
                    <button
                      type="button"
                      onClick={() => triggerReplace(doc)}
                      className="text-amber-700 hover:text-amber-800 underline"
                    >
                      Replace
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
              <div>
                <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-700">Accounting folder</div>
                <div className="text-sm text-slate-500">Upload statements, compliance docs, expenses.</div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <select
                  className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold"
                  value={accountingKind}
                  onChange={(e) => setAccountingKind(e.target.value as UploadedDoc['docKind'])}
                >
                  <option value="bank_statement">Bank statement</option>
                  <option value="compliance">Compliance documents</option>
                  <option value="expenses">Expenses</option>
                  <option value="other">Other</option>
                </select>
                <label className="px-3 py-2 bg-slate-900 text-amber-500 rounded-lg text-sm font-semibold cursor-pointer border border-slate-800">
                  Upload
                  <input
                    type="file"
                    className="hidden"
                    multiple
                    onChange={(e) => handleUpload('accounting', e.target.files, accountingKind)}
                  />
                </label>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {accountingDocs.length === 0 && <div className="text-sm text-slate-400">No accounting documents uploaded.</div>}
              {accountingDocs.map((doc) => (
                <div key={doc.id} className="p-3 border border-slate-100 rounded-xl bg-slate-50 flex flex-col gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 overflow-hidden flex items-center justify-center">
                      {doc.isImage ? (
                        <img src={doc.url} alt={doc.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-[10px] font-bold text-slate-400 uppercase">File</div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-800 truncate">{doc.name}</div>
                      <div className="text-[11px] text-slate-700 uppercase tracking-[0.2em]">{doc.docKind}</div>
                      <div className="text-[11px] text-slate-400 truncate">{formatSize(doc.size)} • {new Date(doc.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={doc.note}
                    onChange={(e) => updateNote(doc.id, e.target.value)}
                    placeholder="Add a note"
                    className="w-full text-[11px] text-slate-700 border border-slate-200 rounded px-2 py-1"
                  />
                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-slate-700">
                    Folder
                    <button
                      type="button"
                      onClick={() => triggerReplace(doc)}
                      className="text-slate-800 hover:text-slate-900 underline"
                    >
                      Replace
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-3">Audit history</h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {audit.length === 0 && <div className="text-sm text-slate-400">No changes recorded.</div>}
            {audit.map((entry) => (
              <div key={entry.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50">
                <div className="text-xs font-bold text-slate-700">{entry.summary}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-[0.2em] mt-1">{new Date(entry.timestamp).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDocumentsPage;
