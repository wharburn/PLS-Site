import React, { useEffect, useMemo, useState } from 'react';
import supabase from '../src/lib/supabase';
import { AdminShell } from './AdminShell';

type ClientRow = {
  id: string;
  email: string;
  name: string;
  status?: string | null;
  phone?: string | null;
  created_at?: string | null;
};

const LS_KEY = 'pls_admin_selected_client_ids_v1';

const AdminClientSelectPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<ClientRow[]>([]);
  const [q, setQ] = useState('');

  const [selected, setSelected] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const parsed = raw ? (JSON.parse(raw) as string[]) : [];
      return new Set(parsed.filter(Boolean));
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from('clients')
          .select('id, email, name, status, phone, created_at')
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (!alive) return;
        setRows((data || []) as any);
      } catch (e: any) {
        console.error(e);
        if (!alive) return;
        setError(e?.message || 'Failed to load clients.');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Persist selection
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(Array.from(selected)));
    } catch {
      // ignore
    }
  }, [selected]);

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return rows;
    return rows.filter((r) => {
      const hay = `${r.id} ${r.email} ${r.name} ${r.status ?? ''} ${r.phone ?? ''}`.toLowerCase();
      return hay.includes(qq);
    });
  }, [rows, q]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllFiltered = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const r of filtered) next.add(r.id);
      return next;
    });
  };

  const clearAll = () => setSelected(new Set());

  return (
    <AdminShell
      title="Select Clients"
      subtitle="Multi-select clients (stored in browser). This page only selects — it does not upload documents."
    >
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search clients (name, email, id, status…)"
          style={{ flex: '1 1 420px', background: '#fff', border: '1px solid #e2e8f0', padding: '10px 12px', borderRadius: 12, fontWeight: 800 }}
        />
        <button
          onClick={selectAllFiltered}
          style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '10px 12px', borderRadius: 12, fontWeight: 900, cursor: 'pointer' }}
        >
          Select all (filtered)
        </button>
        <button
          onClick={clearAll}
          style={{ background: '#fff', color: '#ef4444', border: '1px solid #e2e8f0', padding: '10px 12px', borderRadius: 12, fontWeight: 900, cursor: 'pointer' }}
        >
          Clear selection
        </button>
        <div style={{ fontSize: 12, color: '#64748b', fontWeight: 900 }}>
          {loading ? 'Loading…' : `${selected.size} selected`}
        </div>
      </div>

      {error && (
        <div style={{ marginTop: 16, background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', padding: 12, borderRadius: 12, fontWeight: 900 }}>
          {error}
        </div>
      )}

      <div style={{ marginTop: 16, overflowX: 'auto', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ textAlign: 'left', padding: 12, fontSize: 11, fontWeight: 900, color: '#64748b' }}>Select</th>
              <th style={{ textAlign: 'left', padding: 12, fontSize: 11, fontWeight: 900, color: '#64748b' }}>Name</th>
              <th style={{ textAlign: 'left', padding: 12, fontSize: 11, fontWeight: 900, color: '#64748b' }}>Email</th>
              <th style={{ textAlign: 'left', padding: 12, fontSize: 11, fontWeight: 900, color: '#64748b' }}>Status</th>
              <th style={{ textAlign: 'left', padding: 12, fontSize: 11, fontWeight: 900, color: '#64748b' }}>Client ID</th>
              <th style={{ textAlign: 'left', padding: 12, fontSize: 11, fontWeight: 900, color: '#64748b' }}>Created</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const checked = selected.has(c.id);
              return (
                <tr key={c.id} style={{ borderTop: '1px solid #eef2f7' }}>
                  <td style={{ padding: 12 }}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(c.id)}
                      style={{ width: 18, height: 18 }}
                    />
                  </td>
                  <td style={{ padding: 12, fontWeight: 900, color: '#0f172a' }}>{c.name || '—'}</td>
                  <td style={{ padding: 12, fontWeight: 800, color: '#334155' }}>{c.email || '—'}</td>
                  <td style={{ padding: 12, fontWeight: 900, color: '#64748b' }}>{c.status || '—'}</td>
                  <td style={{ padding: 12, fontFamily: 'monospace', fontSize: 12, color: '#64748b' }}>{c.id}</td>
                  <td style={{ padding: 12, fontWeight: 800, color: '#64748b' }}>{c.created_at ? new Date(c.created_at).toLocaleString() : '—'}</td>
                </tr>
              );
            })}

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 16, color: '#64748b', fontWeight: 900 }}>
                  No clients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: 16, fontSize: 12, color: '#64748b', fontWeight: 800 }}>
        Selection is saved locally in your browser: <span style={{ fontFamily: 'monospace' }}>{LS_KEY}</span>
      </div>
    </AdminShell>
  );
};

export default AdminClientSelectPage;
