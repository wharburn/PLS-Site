import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../src/lib/supabase';
import type { Client } from '../src/lib/database.types';
import AdminHelpChat from '../components/AdminHelpChat';

const pill = (bg: string, fg: string) => ({
  background: bg,
  color: fg,
  padding: '6px 10px',
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 900 as const,
  display: 'inline-block',
});

const LS_KEY = 'pls_admin_selected_client_ids_v1'; // kept for backwards compatibility

const AdminClientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<Set<string>>(() => {
    // initial from localStorage (fast), then hydrated from server for cross-browser persistence
    try {
      const raw = localStorage.getItem(LS_KEY);
      const parsed = raw ? (JSON.parse(raw) as string[]) : [];
      return new Set(parsed.filter(Boolean));
    } catch {
      return new Set();
    }
  });
  const [status, setStatus] = useState<'all' | Client['status']>('all');
  const [basicsOnly, setBasicsOnly] = useState<'all' | 'missing'>('all');

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const query = supabase
          .from('clients')
          .select('*')
          .order('name', { ascending: true })
          .order('created_at', { ascending: false });

        const { data, error: qErr } = await query;
        if (qErr) throw qErr;
        if (!alive) return;

        setClients((data || []) as Client[]);
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

  // Hydrate from server (cross-browser persistence)
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch('/api/admin/selected-clients');
        if (!r.ok) return;
        const j = await r.json();
        const ids = Array.isArray(j?.clientIds) ? j.clientIds : [];
        if (!alive) return;
        setSelected(new Set(ids.map(String)));
        // keep localStorage in sync too
        try { localStorage.setItem(LS_KEY, JSON.stringify(ids)); } catch {}
      } catch {
        // ignore
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Persist selection (local + server)
  useEffect(() => {
    const ids = Array.from(selected);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(ids));
    } catch {
      // ignore
    }

    // Debounced server save
    const t = window.setTimeout(() => {
      fetch('/api/admin/selected-clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientIds: ids }),
      }).catch(() => {});
    }, 300);

    return () => window.clearTimeout(t);
  }, [selected]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return clients.filter((c) => {
      const nm = String(c.name ?? '').toLowerCase();
      const em = String(c.email ?? '').toLowerCase();
      const matchQ = !qq || nm.includes(qq) || em.includes(qq);
      const matchStatus = status === 'all' || c.status === status;

      const missing: string[] = [];
      if (!c.name || !String(c.name).trim()) missing.push('name');
      if (!c.email || !String(c.email).trim()) missing.push('email');
      if (!c.phone || !String(c.phone).trim()) missing.push('phone');
      const basicsOk = missing.length === 0;
      const matchBasics = basicsOnly === 'all' || (basicsOnly === 'missing' && !basicsOk);

      return matchQ && matchStatus && matchBasics;
    });
  }, [clients, q, status, basicsOnly]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '110px 24px 32px' }}>
        {/* Admin AI assistant should be first thing on the page */}
        <AdminHelpChat lang="en" />

        <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 900, color: '#94a3b8', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Admin</div>
            <h1 style={{ fontSize: 30, margin: '8px 0 0', color: '#0f172a' }}>Client Directory</h1>
            <div style={{ marginTop: 8, color: '#64748b', fontSize: 13, fontWeight: 700 }}>
              Real-time list from Supabase table: <span style={{ fontFamily: 'monospace' }}>clients</span>
            </div>
          </div>
          <button
            onClick={() => (window.location.href = '/')}
            style={{ background: '#0f172a', color: '#fff', padding: '10px 16px', borderRadius: 10, border: 0, fontWeight: 900, cursor: 'pointer' }}
          >
            Exit Admin
          </button>
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or email"
            style={{ flex: '1 1 320px', background: '#fff', border: '1px solid #e2e8f0', padding: '10px 12px', borderRadius: 12, fontWeight: 800 }}
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '10px 12px', borderRadius: 12, fontWeight: 900 }}
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={basicsOnly}
            onChange={(e) => setBasicsOnly(e.target.value as any)}
            style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '10px 12px', borderRadius: 12, fontWeight: 900 }}
          >
            <option value="all">All basics</option>
            <option value="missing">Basics missing only</option>
          </select>
        </div>

        {error && (
          <div style={{ marginTop: 16, background: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca', padding: 12, borderRadius: 12, fontWeight: 900 }}>
            {error}
          </div>
        )}

        <div style={{ marginTop: 20, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, overflow: 'hidden' }}>
          <div style={{ padding: 16, borderBottom: '1px solid #f1f5f9', fontWeight: 900, color: '#0f172a', display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <span>Clients</span>
            <span style={{ fontSize: 12, color: '#64748b', fontWeight: 900 }}>
              {loading ? 'Loading…' : `${filtered.length} shown • ${selected.size} selected`}
            </span>
          </div>

          {filtered.map((c) => {
            const anyC: any = c as any;
            const displayName = (c.name ?? '').toString();
            const displayEmail = (c.email ?? '').toString();
            const displayPhone = (anyC.mobile ?? c.phone ?? '').toString();

            const missing: string[] = [];
            if (!displayName.trim()) missing.push('name');
            if (!displayEmail.trim()) missing.push('email');
            if (!displayPhone.trim()) missing.push('phone');
            const basicsOk = missing.length === 0;

            return (
              <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '48px 2.2fr 1.2fr 2fr 1fr 1fr 1fr 1.2fr auto', gap: 12, alignItems: 'center', padding: 16, borderTop: '1px solid #f8fafc' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <input
                    type="checkbox"
                    checked={selected.has(String(c.id))}
                    onChange={() => toggle(String(c.id))}
                    style={{ width: 18, height: 18 }}
                    aria-label={`Select ${displayName || displayEmail || c.id}`}
                  />
                </div>

                <div style={{ fontWeight: 900, color: '#0f172a' }}>{displayName || '—'}</div>

                <div style={{ fontSize: 12, color: '#0f172a', fontWeight: 900 }}>{displayPhone || '—'}</div>

                <div style={{ fontSize: 12, color: '#64748b', fontWeight: 800 }}>{displayEmail || '—'}</div>

                <div style={{ fontSize: 12, fontWeight: 900 }}>
                  {c.status === 'active' && <span style={pill('#dcfce7', '#166534')}>ACTIVE</span>}
                  {c.status === 'inactive' && <span style={pill('#fef9c3', '#854d0e')}>INACTIVE</span>}
                  {c.status === 'archived' && <span style={pill('#e2e8f0', '#0f172a')}>ARCHIVED</span>}
                </div>

                <div style={{ fontSize: 12, fontWeight: 900, color: c.onboarding_completed ? '#166534' : '#0f172a' }}>
                  {c.onboarding_completed ? 'Onboarded' : 'Onboarding'}
                </div>

                <div style={{ fontSize: 12, fontWeight: 900, color: c.ai_access ? '#166534' : '#991b1b' }}>{c.ai_access ? 'AI ON' : 'AI OFF'}</div>

                <div style={{ fontSize: 12, fontWeight: 900 }}>
                  {basicsOk ? (
                    <span style={pill('#dcfce7', '#166534')}>BASICS OK</span>
                  ) : (
                    <span title={`Missing: ${missing.join(', ')}`} style={pill('#fef9c3', '#854d0e')}>BASICS MISSING</span>
                  )}
                </div>

                <button
                  onClick={() => navigate(`/admin/clients/${encodeURIComponent(displayEmail || c.email)}`)}
                  style={{ background: '#fff', border: '1px solid #e2e8f0', padding: '8px 12px', borderRadius: 10, fontSize: 12, fontWeight: 900, cursor: 'pointer' }}
                >
                  Open
                </button>
              </div>
            );
          })}

          {!loading && filtered.length === 0 && (
            <div style={{ padding: 16, color: '#64748b', fontWeight: 800 }}>No clients matched your search.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminClientsPage;
