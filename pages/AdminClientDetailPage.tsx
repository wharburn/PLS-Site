import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../src/lib/supabase';
import type { Client, Document } from '../src/lib/database.types';

type FeatureKey = 'ai_chat' | 'ai_legal' | 'ai_translation' | 'ai_analysis';

const defaultFeatures: Record<FeatureKey, boolean> = {
  ai_chat: true,
  ai_legal: true,
  ai_translation: true,
  ai_analysis: true,
};

const getFeatureStorageKey = (clientId: string) => `pls_client_features_${clientId}`;

const AdminClientDetailPage: React.FC = () => {
  const { email } = useParams<{ email: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [savingAI, setSavingAI] = useState(false);

  // Per-service toggles (TEMP STORAGE): localStorage until we add DB columns/table
  const [features, setFeatures] = useState<Record<FeatureKey, boolean>>(defaultFeatures);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        if (!email) throw new Error('Missing client email in URL.');

        const { data: c, error: cErr } = await supabase
          .from('clients')
          .select('*')
          .eq('email', email)
          .maybeSingle();

        if (cErr) throw cErr;
        if (!c) throw new Error('Client not found.');

        const { data: docs, error: dErr } = await supabase
          .from('documents')
          .select('*')
          .eq('client_id', c.id)
          .order('uploaded_at', { ascending: false });

        if (dErr) throw dErr;

        if (!alive) return;

        setClient(c as Client);
        setDocuments((docs || []) as Document[]);

        // hydrate feature flags from localStorage
        try {
          const raw = localStorage.getItem(getFeatureStorageKey(c.id));
          if (raw) {
            const parsed = JSON.parse(raw);
            setFeatures({ ...defaultFeatures, ...(parsed || {}) });
          }
        } catch {
          // ignore
        }
      } catch (e: any) {
        console.error(e);
        if (!alive) return;
        setError(e?.message || 'Failed to load client detail.');
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [email]);

  const missingDocs = useMemo(() => {
    // Simple v1 checklist; we can make this table-driven later
    const requiredKinds = ['passport', 'proof_of_address'];
    const present = new Set(documents.map((d) => d.doc_kind));
    return requiredKinds.filter((k) => !present.has(k));
  }, [documents]);

  const toggleFeature = (k: FeatureKey) => {
    if (!client) return;
    const next = { ...features, [k]: !features[k] };
    setFeatures(next);
    localStorage.setItem(getFeatureStorageKey(client.id), JSON.stringify(next));
  };

  const setAiAccess = async (nextValue: boolean) => {
    if (!client) return;
    try {
      setSavingAI(true);
      const { error } = await supabase.from('clients').update({ ai_access: nextValue }).eq('id', client.id);
      if (error) throw error;
      setClient({ ...client, ai_access: nextValue });
    } catch (e: any) {
      console.error(e);
      alert(e?.message || 'Failed to update AI access.');
    } finally {
      setSavingAI(false);
    }
  };

  if (loading) return null;
  if (error) return <div style={{ padding: 100, textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>{error}</div>;
  if (!client) return <div style={{ padding: 100, textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>Client not found.</div>;

  const labelStyle = { display: 'block', fontSize: '9px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' as const, marginBottom: '6px', letterSpacing: '0.1em' };
  const box = { width: '100%', padding: '14px 16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '14px', color: '#0f172a', fontWeight: 800 };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '120px 24px 32px', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 30, fontWeight: 900, color: '#0f172a', margin: 0 }}>
              Case Review: <span style={{ color: '#c5a059' }}>{client.name}</span>
            </h1>
            <div style={{ marginTop: 8, color: '#64748b', fontSize: 13, fontWeight: 800 }}>{client.email}</div>
          </div>
          <button onClick={() => navigate('/admin/clients')} style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '10px 16px', borderRadius: 10, border: 'none', fontWeight: 900, cursor: 'pointer', height: 40 }}>
            Back to Directory
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.9fr', gap: 24, marginTop: 28 }}>
          {/* LEFT */}
          <div style={{ backgroundColor: '#ffffff', padding: 24, borderRadius: 18, border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: 16, fontWeight: 900, margin: 0, color: '#0f172a' }}>Client</h2>

            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Name</label>
                <div style={box}>{client.name || '—'}</div>
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <div style={box}>{client.email || '—'}</div>
              </div>
              <div>
                <label style={labelStyle}>Phone / Mobile</label>
                <div style={box}>{client.phone || '—'}</div>
              </div>
              <div>
                <label style={labelStyle}>Address</label>
                <div style={box}>{client.address || '—'}</div>
              </div>

              <div>
                <label style={labelStyle}>Status</label>
                <div style={box}>{client.status}</div>
              </div>
              <div>
                <label style={labelStyle}>Onboarding</label>
                <div style={box}>{client.onboarding_completed ? 'Completed' : 'Incomplete'}</div>
              </div>
              <div>
                <label style={labelStyle}>AI Access (master switch)</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <button
                    disabled={savingAI}
                    onClick={() => setAiAccess(!client.ai_access)}
                    style={{
                      background: client.ai_access ? '#22c55e' : '#ef4444',
                      color: '#fff',
                      padding: '10px 12px',
                      borderRadius: 12,
                      border: 0,
                      fontWeight: 900,
                      cursor: 'pointer',
                      opacity: savingAI ? 0.7 : 1,
                    }}
                  >
                    {client.ai_access ? 'AI ENABLED' : 'AI DISABLED'}
                  </button>
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 800 }}>Writes to Supabase: clients.ai_access</div>
                </div>
              </div>

              <div>
                <label style={labelStyle}>AI Services (per-service toggles)</label>
                <div style={{ fontSize: 12, color: '#64748b', fontWeight: 800, marginBottom: 8 }}>
                  Currently stored locally (per device). If you want these durable across devices, we’ll add DB columns/table.
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {(['ai_chat', 'ai_legal', 'ai_translation', 'ai_analysis'] as FeatureKey[]).map((k) => (
                    <button
                      key={k}
                      onClick={() => toggleFeature(k)}
                      style={{
                        background: features[k] ? '#0f172a' : '#fff',
                        color: features[k] ? '#fff' : '#0f172a',
                        border: '1px solid #e2e8f0',
                        padding: '10px 12px',
                        borderRadius: 12,
                        fontWeight: 900,
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        fontSize: 11,
                        letterSpacing: '0.08em',
                      }}
                    >
                      {k.replace('ai_', 'AI ')}: {features[k] ? 'ON' : 'OFF'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Compliance (v1)</label>
                <div style={box}>
                  {missingDocs.length === 0 ? 'All required docs present' : `Missing: ${missingDocs.join(', ')}`}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ backgroundColor: '#ffffff', padding: 24, borderRadius: 18, border: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: 16, fontWeight: 900, margin: 0, color: '#0f172a' }}>Document Vault</h2>
              <div style={{ marginTop: 12, color: '#64748b', fontSize: 12, fontWeight: 800 }}>From Supabase table: documents (by client_id)</div>

              {documents.length === 0 ? (
                <div style={{ marginTop: 14, color: '#94a3b8', fontWeight: 900 }}>No documents found for this client.</div>
              ) : (
                <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                  {documents.map((d) => (
                    <div key={d.id} style={{ border: '1px solid #f1f5f9', borderRadius: 14, padding: 12, background: '#fff' }}>
                      <div style={{ fontWeight: 900, color: '#0f172a', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</div>
                      <div style={{ marginTop: 6, fontSize: 11, fontWeight: 900, color: '#64748b' }}>{d.category} • {d.doc_kind}</div>
                      <div style={{ marginTop: 6, fontSize: 11, color: '#64748b', fontWeight: 800 }}>Path: <span style={{ fontFamily: 'monospace' }}>{d.file_path}</span></div>
                      {d.ai_summary && (
                        <div style={{ marginTop: 8, fontSize: 12, color: '#0f172a', fontWeight: 800, background: '#f8fafc', border: '1px solid #e2e8f0', padding: 10, borderRadius: 12 }}>
                          <div style={{ fontSize: 9, fontWeight: 900, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>AI Summary</div>
                          <div style={{ marginTop: 6 }}>{d.ai_summary}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <button style={{ backgroundColor: '#22c55e', color: 'white', padding: 14, borderRadius: 14, border: 'none', fontWeight: 900, cursor: 'pointer' }}>APPROVE CASE</button>
              <button style={{ backgroundColor: '#ef4444', color: 'white', padding: 14, borderRadius: 14, border: 'none', fontWeight: 900, cursor: 'pointer' }}>FLAG / REQUEST INFO</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminClientDetailPage;
