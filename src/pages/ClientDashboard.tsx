import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export const ClientDashboard: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: clientData } = await supabase
        .from('clients')
        .select('*')
        .limit(20);

      setClients(clientData || []);

      const { data: docData } = await supabase
        .from('documents')
        .select('*')
        .limit(30);

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
      <h1>📊 Client Dashboard</h1>

      <div className="dashboard-grid">
        <div className="card">
          <h3>📋 Clients Loaded</h3>
          <p className="stat">{clients.length}</p>
        </div>
        <div className="card">
          <h3>📄 Documents Loaded</h3>
          <p className="stat">{documents.length}</p>
        </div>
      </div>

      <div className="section">
        <button onClick={loadData} disabled={loading} className="btn-primary">
          {loading ? '⏳ Loading...' : '🔄 Load Data'}
        </button>
      </div>

      {clients.length > 0 && (
        <div className="section">
          <h2>Select Client</h2>
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="select"
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

      {documents.length > 0 && (
        <div className="section">
          <h2>Documents ({filteredDocs.length})</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Filename</th>
                <th>Size</th>
                <th>Uploaded</th>
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

      <style>{`
        .dashboard {
          padding: 20px;
          max-width: 1200px;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin: 20px 0;
        }

        .card {
          background: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }

        .stat {
          font-size: 32px;
          font-weight: bold;
          color: #0057FF;
          margin: 10px 0;
        }

        .section {
          margin: 30px 0;
        }

        .btn-primary {
          padding: 12px 24px;
          background: #0057FF;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          font-size: 16px;
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .select {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          width: 100%;
          max-width: 400px;
          font-size: 16px;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }

        .data-table th,
        .data-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        .data-table th {
          background: #f5f5f5;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default ClientDashboard;
