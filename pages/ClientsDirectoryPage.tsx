import React, { useState, useEffect } from 'react';

export const ClientsDirectoryPage: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const response = await fetch('/api/clients');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      console.log(`Loaded ${data.length} clients from local API`);
      setClients(data);
    } catch (err) {
      console.error('Error loading clients:', err);
      setError(`Failed to load clients: ${String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter((client) =>
    (client.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (client.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-32" style={{ backgroundColor: '#fdfcfb' }}>
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-12">
          <h1 
            className="text-5xl font-bold mb-4" 
            style={{ fontFamily: "Arial, sans-serif", color: '#0f172a', letterSpacing: '-0.01em' }}
          >
            Client Directory
          </h1>
          <p className="text-lg" style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif", color: '#64748b' }}>
            Professional service providers in our trusted network
          </p>
        </div>

        {/* Search */}
        <div className="mb-10">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-4 border rounded-xl transition-all"
            style={{
              borderColor: '#e2e8f0',
              backgroundColor: '#f8fafc',
              color: '#0f172a',
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
              fontSize: '15px'
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(197, 160, 89, 0.15)';
              e.currentTarget.style.borderColor = '#c5a059';
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.backgroundColor = '#f8fafc';
            }}
          />
        </div>

        {/* Results count */}
        <div className="mb-6">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{
                display: 'inline-block',
                width: '40px',
                height: '40px',
                border: '3px solid rgba(197, 160, 89, 0.2)',
                borderTop: '3px solid #c5a059',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }}></div>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
              <p style={{ color: '#64748b', marginTop: '12px' }}>Loading clients...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded" style={{
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              borderLeft: '4px solid #dc2626',
              color: '#7f1d1d'
            }}>
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          ) : (
            <p style={{ color: '#64748b' }}>
              <span style={{ color: '#c5a059', fontWeight: 'bold' }}>{filteredClients.length}</span> of <span style={{ color: '#c5a059', fontWeight: 'bold' }}>{clients.length}</span> clients
            </p>
          )}
        </div>

        {/* Clients Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="rounded-2xl transition-all hover:shadow-xl hover:-translate-y-1"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  padding: '32px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#c5a059', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.05em' }}>
                  PROFESSIONAL PARTNER
                </div>
                <h3 
                  className="mb-4 text-2xl font-bold"
                  style={{ 
                    fontFamily: "Arial, sans-serif",
                    color: '#0f172a'
                  }}
                >
                  {client.name}
                </h3>
                
                <div className="space-y-4 text-sm" style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
                  <div className="flex items-start gap-3">
                    <span className="text-slate-400 mt-1">📧</span>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Email</p>
                      <p style={{ color: '#475569', fontWeight: '500' }}>{client.email}</p>
                    </div>
                  </div>

                  {client.phone && (
                    <div className="flex items-start gap-3">
                      <span className="text-slate-400 mt-1">📞</span>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Phone</p>
                        <p style={{ color: '#475569', fontWeight: '500' }}>{client.phone}</p>
                      </div>
                    </div>
                  )}

                  {client.address && (
                    <div className="flex items-start gap-3">
                      <span className="text-slate-400 mt-1">📍</span>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#94a3b8' }}>Address</p>
                        <p style={{ color: '#475569', lineHeight: '1.5', fontWeight: '500' }}>
                          {client.address}
                          {client.city && `, ${client.city}`}
                          {client.postal_code && ` ${client.postal_code}`}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="pt-5 mt-2" style={{ borderTop: '1px solid #f1f5f9' }}>
                    <div className="flex items-center justify-between">
                      <span
                        className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                        style={{
                          backgroundColor: client.status === 'active' ? 'rgba(197, 160, 89, 0.1)' : '#f1f5f9',
                          color: client.status === 'active' ? '#c5a059' : '#64748b'
                        }}
                      >
                        {client.status || 'Verified'}
                      </span>
                      <button 
                        style={{ color: '#c5a059', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}
                        onClick={() => navigate(`/admin/clients/${client.email}`)}
                      >
                        View Profile →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredClients.length === 0 && (
          <div className="text-center py-12">
            <p style={{ color: '#64748b' }} className="text-lg">No clients found matching "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsDirectoryPage;
