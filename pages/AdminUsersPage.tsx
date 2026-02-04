import React, { useEffect, useMemo, useState } from 'react';
import supabase from '../src/lib/supabase';
import { AdminShell } from './AdminShell';

type UserRow = Record<string, any>;

const AdminUsersPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<UserRow[]>([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        if (!alive) return;
        setRows((data || []) as any);
      } catch (e: any) {
        console.error(e);
        if (!alive) return;
        setError(e?.message || 'Failed to load users.');
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

  const columns = useMemo(() => {
    const keys = new Set<string>();
    for (const r of filtered.slice(0, 25)) Object.keys(r || {}).forEach((k) => keys.add(k));
    return Array.from(keys);
  }, [filtered]);

  return (
    <AdminShell title="Users" subtitle="From Supabase table: users">
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search users"
          style={{ flex: '1 1 320px', background: '#fff', border: '1px solid #e2e8f0', padding: '10px 12px', borderRadius: 12, fontWeight: 800 }}
        />
        <div style={{ fontSize: 12, color: '#64748b', fontWeight: 900 }}>{loading ? 'Loading…' : `${filtered.length} users`}</div>
      </div>

      {error && (
        <div style={{ marginTop: 16, background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', padding: 12, borderRadius: 12, fontWeight: 900 }}>{error}</div>
      )}

      <div style={{ marginTop: 16, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              {columns.map((c) => (
                <th key={c} style={{ textAlign: 'left', padding: 12, fontSize: 10, color: '#94a3b8', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, idx) => (
              <tr key={r.id || idx} style={{ borderTop: '1px solid #f8fafc' }}>
                {columns.map((c) => (
                  <td key={c} style={{ padding: 12, fontSize: 12, color: '#0f172a', fontWeight: 800, verticalAlign: 'top' }}>
                    <span style={{ fontFamily: 'monospace' }}>{String(r?.[c] ?? '')}</span>
                  </td>
                ))}
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={Math.max(columns.length, 1)} style={{ padding: 16, color: '#64748b', fontWeight: 800 }}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
};

export default AdminUsersPage;
