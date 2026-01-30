import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const ClientsDirectoryPage: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('client_name', { ascending: true });

      if (!error && data) {
        setClients(data);
      }
    } catch (err) {
      console.error('Error loading clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter((client) =>
    client.client_name.toLowerCase().includes(search.toLowerCase()) ||
    client.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Client Directory</h1>
          <p className="text-lg text-slate-600">Access our network of professional service providers</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent"
          />
        </div>

        {/* Results count */}
        <div className="mb-6 text-slate-600">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <p>{filteredClients.length} of {clients.length} clients</p>
          )}
        </div>

        {/* Clients Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-2">{client.client_name}</h3>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-slate-500 font-semibold">Email</p>
                    <p className="text-slate-700">{client.email}</p>
                  </div>

                  {client.phone && (
                    <div>
                      <p className="text-slate-500 font-semibold">Phone</p>
                      <p className="text-slate-700">{client.phone}</p>
                    </div>
                  )}

                  {client.address && (
                    <div>
                      <p className="text-slate-500 font-semibold">Address</p>
                      <p className="text-slate-700">
                        {client.address}
                        {client.city && `, ${client.city}`}
                        {client.postal_code && ` ${client.postal_code}`}
                      </p>
                    </div>
                  )}

                  <div className="pt-3 border-t border-slate-200">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        client.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : client.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {client.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredClients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">No clients found matching "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientsDirectoryPage;
