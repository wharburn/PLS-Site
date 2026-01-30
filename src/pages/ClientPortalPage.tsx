import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const ClientPortalPage: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  // Sample PDFs available
  const samplePDFs = [
    { name: 'Invoice_2026_01.pdf', type: '📄 Invoice', size: '1.5 KB' },
    { name: 'Invoice_2026_02.pdf', type: '📄 Invoice', size: '1.5 KB' },
    { name: 'Contract.pdf', type: '📋 Contract', size: '1.5 KB' },
    { name: 'Bank_Statement.pdf', type: '🏦 Statement', size: '1.5 KB' },
    { name: 'Quotation.pdf', type: '💰 Quote', size: '1.5 KB' },
    { name: 'Receipt.pdf', type: '🧾 Receipt', size: '1.5 KB' },
    { name: 'Agreement.pdf', type: '✍️ Agreement', size: '1.5 KB' },
    { name: 'Delivery_Note.pdf', type: '📦 Delivery', size: '1.4 KB' },
    { name: 'Tax_Certificate.pdf', type: '📊 Tax Doc', size: '1.5 KB' },
    { name: 'PO.pdf', type: '📑 Purchase Order', size: '1.5 KB' },
  ];

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .limit(20)
        .order('client_name', { ascending: true });

      if (!error && data) {
        setClients(data);
        // Auto-select first client
        if (data.length > 0) {
          selectClient(data[0]);
        }
      }
    } catch (err) {
      console.error('Error loading clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectClient = (client: any) => {
    setSelectedClient(client);
    // For demo: assign sample PDFs to all clients
    setDocuments(samplePDFs);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedClient) return;

    setUploading(true);
    setUploadMessage('Uploading...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('clientId', selectedClient.id);
      formData.append('filename', file.name);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        setUploadMessage(`✅ Uploaded: ${file.name}`);
        // Add to documents list
        setDocuments([...documents, { name: file.name, type: '📄', size: `${(file.size / 1024).toFixed(1)} KB` }]);
        // Reset input
        if (e.target) e.target.value = '';
      } else {
        setUploadMessage('❌ Upload failed');
      }
    } catch (err) {
      setUploadMessage('❌ Error uploading');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-slate-50 py-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Client Portal</h1>
          <p className="text-lg text-slate-600">Access your documents and records</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Client List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-slate-200 shadow p-6 sticky top-20">
              <h2 className="font-bold text-lg mb-4">Clients</h2>
              
              {loading ? (
                <p className="text-slate-600">Loading...</p>
              ) : (
                <div className="space-y-2">
                  {clients.map((client) => (
                    <button
                      key={client.id}
                      onClick={() => selectClient(client)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        selectedClient?.id === client.id
                          ? 'bg-slate-900 text-white font-semibold'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-sm font-semibold truncate">{client.client_name}</div>
                      <div className="text-xs opacity-75 truncate">{client.email}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Client Details & Documents */}
          <div className="lg:col-span-3">
            {selectedClient ? (
              <>
                {/* Client Info */}
                <div className="bg-white rounded-lg border border-slate-200 shadow p-8 mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">{selectedClient.client_name}</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-slate-500 font-semibold mb-1">Email</p>
                      <p className="text-slate-900">{selectedClient.email}</p>
                    </div>
                    
                    {selectedClient.phone && (
                      <div>
                        <p className="text-sm text-slate-500 font-semibold mb-1">Phone</p>
                        <p className="text-slate-900">{selectedClient.phone}</p>
                      </div>
                    )}
                    
                    {selectedClient.address && (
                      <div>
                        <p className="text-sm text-slate-500 font-semibold mb-1">Address</p>
                        <p className="text-slate-900">
                          {selectedClient.address}
                          {selectedClient.city && `, ${selectedClient.city}`}
                        </p>
                      </div>
                    )}
                    
                    {selectedClient.postal_code && (
                      <div>
                        <p className="text-sm text-slate-500 font-semibold mb-1">Postal Code</p>
                        <p className="text-slate-900">{selectedClient.postal_code}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Section */}
                <div className="bg-white rounded-lg border border-slate-200 shadow p-8 mb-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Upload New Document</h3>
                  
                  <div className="flex gap-4 items-center">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="flex-grow px-4 py-2 border border-slate-300 rounded-lg"
                    />
                    <button disabled={uploading} className="px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 disabled:opacity-50">
                      {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                  
                  {uploadMessage && (
                    <p className={`mt-3 text-sm ${uploadMessage.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                      {uploadMessage}
                    </p>
                  )}
                </div>

                {/* Documents */}
                <div className="bg-white rounded-lg border border-slate-200 shadow p-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">Documents ({documents.length})</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documents.map((doc) => (
                      <a
                        key={doc.name}
                        href={`/documents/${doc.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 hover:shadow-md transition-all border border-slate-200"
                      >
                        <div className="text-2xl">{doc.type.split(' ')[0]}</div>
                        <div className="flex-grow">
                          <div className="font-semibold text-slate-900">{doc.name}</div>
                          <div className="text-xs text-slate-500">{doc.size}</div>
                        </div>
                        <div className="text-2xl">↓</div>
                      </a>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-lg border border-slate-200 shadow p-8 text-center">
                <p className="text-slate-600">Select a client to view documents</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientPortalPage;
