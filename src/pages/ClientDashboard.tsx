import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const ClientDashboard: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: clientData } = await supabase
        .from('clients')
        .select('*')
        .limit(50);

      setClients(clientData || []);

      const { data: docData } = await supabase
        .from('documents')
        .select('*')
        .limit(100);

      setDocuments(docData || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocs = selectedClient
    ? documents.filter((d) => d.client_id === selectedClient)
    : documents;

  return (
    <div className="dashboard">
      <h1>📊 Dashboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="stats">
            <div className="stat-box">
              <h3>Clients: {clients.length}</h3>
            </div>
            <div className="stat-box">
              <h3>Documents: {documents.length}</h3>
            </div>
          </div>

          {clients.length > 0 && (
            <div className="section">
              <h2>Filter by Client</h2>
              <select
                value={selectedClient}
                onChange={(e) => setSelectedClient(e.target.value)}
              >
                <option value="">All Clients</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.client_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {filteredDocs.length > 0 && (
            <div className="section">
              <h2>Documents ({filteredDocs.length})</h2>
              <table>
                <thead>
                  <tr>
                    <th>Filename</th>
                    <th>Size</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id}>
                      <td>{doc.filename}</td>
                      <td>{(doc.file_size / 1024).toFixed(1)} KB</td>
                      <td>{new Date(doc.uploaded_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {documents.length === 0 && !loading && (
            <p>No documents found</p>
          )}
        </>
      )}

      <style>{`
        .dashboard {
          padding: 40px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin: 30px 0;
        }

        .stat-box {
          background: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
        }

        .section {
          margin: 40px 0;
        }

        select {
          padding: 10px;
          width: 100%;
          max-width: 400px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        th, td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        th {
          background: #f5f5f5;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default ClientDashboard;
