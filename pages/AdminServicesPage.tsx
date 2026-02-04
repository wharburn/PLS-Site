import React, { useEffect, useMemo, useState } from 'react';
import supabase from '../src/lib/supabase';
import { AdminShell } from './AdminShell';

type ServiceRow = Record<string, any>;

const AdminServicesPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<ServiceRow[]>([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        if (!alive) return;
        setRows((data || []) as any);
      } catch (e: any) {
        console.error(e);
        if (!alive) return;
        setError(e?.message || 'Failed to load services.');
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
    <AdminShell title="Services" subtitle="From Supabase table: services (we'll map AI feature flags here once you confirm the columns)">
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search services"
          style={{ flex: '1 1 420px', background: '#fff', border: '1px solid #e2e8f0', padding: '10px 12px', borderRadius: 12, fontWeight: 800 }}
        />
        <div style={{ fontSize: 12, color: '#64748b', fontWeight: 900 }}>{loading ? 'Loading…' : `${filtered.length} services`}</div>
      </div>

      {error && (
        <div style={{ marginTop: 16, background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', padding: 12, borderRadius: 12, fontWeight: 900 }}>{error}</div>
      )}

      <div style={{ marginTop: 16, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, overflow: 'auto' }}>
        <pre style={{ margin: 0, padding: 14, fontSize: 12, lineHeight: 1.4, color: '#0f172a' }}>{JSON.stringify(filtered.slice(0, 200), null, 2)}</pre>
      </div>

      <div style={{ marginTop: 12, color: '#64748b', fontWeight: 800, fontSize: 12 }}>
        Next step: confirm what fields the <span style={{ fontFamily: 'monospace' }}>services</span> table has (e.g. <span style={{ fontFamily: 'monospace' }}>client_id</span>, <span style={{ fontFamily: 'monospace' }}>service_key</span>, <span style={{ fontFamily: 'monospace' }}>enabled</span>). Then I’ll turn this into a proper per-client toggle UI.
      </div>
    </AdminShell>
  );
};

export default AdminServicesPage;
