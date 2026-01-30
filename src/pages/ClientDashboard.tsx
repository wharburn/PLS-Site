import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import FileUpload from '../components/FileUpload';
import DocumentViewer from '../components/DocumentViewer';

export const ClientDashboard: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  useEffect(() => {
    // Don't auto-load - wait for user to interact
    setLoading(false);
  }, []);

  const loadData = async () => {
    try {
      // Timeout after 10 seconds
      const timeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 10000)
      );

      // Load clients
      const clientPromise = Promise.race([
        supabase
          .from('clients')
          .select('*')
          .limit(10),
        timeout
      ]);

      const { data: clientData } = await clientPromise as any;
      setClients(clientData || []);

      // Load documents (limit to 20 for performance)
      const docPromise = Promise.race([
        supabase
          .from('documents')
          .select('id,filename,client_id,file_size,uploaded_at')
          .order('uploaded_at', { ascending: false })
          .limit(20),
        timeout
      ]);

      const { data: docData } = await docPromise as any;
      setDocuments(docData || []);
    } catch (err) {
      console.error('Error loading data:', err);
      setClients([]);
      setDocuments([]);
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
          <h3>📋 Total Clients</h3>
          <p className="stat">{clients.length}</p>
        </div>
        <div className="card">
          <h3>📄 Total Documents</h3>
          <p className="stat">{documents.length}</p>
        </div>
      </div>

      <div className="section">
        <h2>Clients</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <select
              value={selectedClient}
              onChange={(e) => setSelectedClient(e.target.value)}
              className="select"
            >
              <option value="">All Clients</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.client_name} ({c.email})
                </option>
              ))}
            </select>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>City</th>
                </tr>
              </thead>
              <tbody>
                {(selectedClient
                  ? clients.filter((c) => c.id === selectedClient)
                  : clients.slice(0, 20)
                ).map((client) => (
                  <tr key={client.id}>
                    <td>{client.client_name}</td>
                    <td>{client.email}</td>
                    <td>{client.phone || '-'}</td>
                    <td>
                      <span className={`status ${client.status}`}>
                        {client.status}
                      </span>
                    </td>
                    <td>{client.city || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="section">
        <h2>Documents</h2>
        {selectedClient && <FileUpload clientId={selectedClient} onUploadSuccess={loadData} />}

        <table className="data-table">
          <thead>
            <tr>
              <th>Filename</th>
              <th>Client</th>
              <th>Size</th>
              <th>Uploaded</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.filename}</td>
                <td>
                  {clients.find((c) => c.id === doc.client_id)?.client_name || 'Unknown'}
                </td>
                <td>{doc.file_size ? `${(doc.file_size / 1024).toFixed(2)}KB` : '-'}</td>
                <td>{new Date(doc.uploaded_at).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn-view"
                    onClick={() => setSelectedDoc(doc)}
                  >
                    👁️ View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedDoc && (
          <DocumentViewer
            document={selectedDoc}
            onClose={() => setSelectedDoc(null)}
          />
        )}
      </div>

      <style>{`
        .dashboard {
          padding: 20px;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 20px 0;
        }

        .card {
          padding: 20px;
          background: #f9f9f9;
          border-radius: 8px;
          border: 1px solid #ddd;
        }

        .stat {
          font-size: 32px;
          font-weight: 700;
          color: #0057FF;
          margin: 10px 0 0 0;
        }

        .section {
          margin: 30px 0;
        }

        .select {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-bottom: 20px;
          width: 100%;
          max-width: 500px;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        .data-table th, .data-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        .data-table th {
          background: #f5f5f5;
          font-weight: 600;
        }

        .status {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }

        .status.active {
          background: #d1fae5;
          color: #065f46;
        }

        .status.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .btn-view {
          padding: 6px 12px;
          background: #0057FF;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .btn-view:hover {
          background: #0045cc;
        }
      `}</style>
    </div>
  );
};

export default ClientDashboard;
