import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../src/lib/supabase';
import { AdminShell } from './AdminShell';

type DocRow = Record<string, any>;

const AdminDocumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<DocRow[]>([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase.from('documents').select('*').order('uploaded_at', { ascending: false });
        if (error) throw error;
        if (!alive) return;
        setRows((data || []) as any);
      } catch (e: any) {
        console.error(e);
        if (!alive) return;
        setError(e?.message || 'Failed to load documents.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return rows;
    return rows.filter((r) => JSON.stringify(r).toLowerCase().includes(qq));
  }, [rows, q]);

  return (
    <AdminShell title="Documents" subtitle="Global document browser (documents table)">
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search documents (name, doc_kind, client_id, notes…)"
          style={{ flex: '1 1 420px', background: '#fff', border: '1px solid #e2e8f0', padding: '10px 12px', borderRadius: 12, fontWeight: 800 }}
        />
        <div style={{ fontSize: 12, color: '#64748b', fontWeight: 900 }}>{loading ? 'Loading…' : `${filtered.length} documents`}</div>
      </div>

      {error && (
        <div style={{ marginTop: 16, background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', padding: 12, borderRadius: 12, fontWeight: 900 }}>{error}</div>
      )}

      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {filtered.map((d, idx) => (
          <div key={d.id || idx} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 14 }}>
            <div style={{ fontWeight: 900, color: '#0f172a', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name || '(unnamed)'}</div>
            <div style={{ marginTop: 6, fontSize: 11, fontWeight: 900, color: '#64748b' }}>{d.category || '—'} • {d.doc_kind || '—'}</div>
            <div style={{ marginTop: 6, fontSize: 11, fontWeight: 800, color: '#64748b' }}>Client: <span style={{ fontFamily: 'monospace' }}>{d.client_id}</span></div>
            {d.ai_summary && (
              <div style={{ marginTop: 10, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 10 }}>
                <div style={{ fontSize: 9, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em' }}>AI Summary</div>
                <div style={{ marginTop: 6, fontSize: 12, fontWeight: 800, color: '#0f172a' }}>{d.ai_summary}</div>
              </div>
            )}
            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', gap: 10 }}>
              <button
                onClick={() => navigate(`/admin/clients/${encodeURIComponent(d.client_email || '')}`)}
                style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '8px 10px', borderRadius: 10, fontSize: 12, fontWeight: 900, cursor: 'pointer' }}
              >
                Open Client
              </button>
              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 900, fontFamily: 'monospace' }}>{String(d.file_path || '')}</span>
            </div>
          </div>
        ))}
        {!loading && filtered.length === 0 && <div style={{ color: '#64748b', fontWeight: 900 }}>No documents found.</div>}
      </div>
    </AdminShell>
  );
};

export default AdminDocumentsPage;
