import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const ManageClients: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    postal_code: '',
    country: 'United Kingdom',
    status: 'active'
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) setClients(data);
    } catch (err) {
      console.error('Error loading clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Creating client...');

    try {
      const { error } = await supabase
        .from('clients')
        .insert([formData]);

      if (error) throw error;

      setMessage(`✅ Client ${formData.name} created successfully`);
      setFormData({
        email: '',
        name: '',
        phone: '',
        address: '',
        city: '',
        postal_code: '',
        country: 'United Kingdom',
        status: 'active'
      });
      loadClients();
    } catch (err) {
      setMessage(`❌ Error: ${String(err)}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="manage-clients">
      <h1>🏢 Manage Clients</h1>

      <div className="form-section">
        <h2>Add New Client</h2>
        <form onSubmit={handleAddClient} className="client-form">
          <div className="form-row">
            <input
              type="email"
              name="email"
              placeholder="Email *"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="name"
              placeholder="Client Name *"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-row">
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="postal_code"
              placeholder="Postal Code"
              value={formData.postal_code}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleInputChange}
            />
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <button type="submit" className="btn-submit">Add Client</button>
        </form>

        {message && (
          <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>

      <div className="clients-section">
        <h2>Clients ({clients.length})</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="clients-table">
            <thead>
              <tr>
                <th>Client Name</th>
                <th>Email</th>
                <th>City</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id}>
                  <td>{client.name}</td>
                  <td>{client.email}</td>
                  <td>{client.city || '-'}</td>
                  <td>
                    <span className={`badge ${client.status}`}>
                      {client.status}
                    </span>
                  </td>
                  <td>{new Date(client.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style>{`
        .manage-clients {
          padding: 20px;
          max-width: 1200px;
        }

        .form-section {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }

        .client-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .client-form input,
        .client-form select {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }

        .client-form input:focus,
        .client-form select:focus {
          outline: none;
          border-color: #0057FF;
          box-shadow: 0 0 0 3px rgba(0, 87, 255, 0.1);
        }

        .btn-submit {
          padding: 12px 20px;
          background: #0057FF;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.3s;
        }

        .btn-submit:hover {
          background: #0045cc;
        }

        .message {
          padding: 12px;
          border-radius: 4px;
          margin-top: 15px;
        }

        .message.success {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #6ee7b7;
        }

        .message.error {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }

        .clients-section {
          margin-top: 40px;
        }

        .clients-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }

        .clients-table th,
        .clients-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        .clients-table th {
          background: #f5f5f5;
          font-weight: 600;
          color: #333;
        }

        .clients-table tbody tr:hover {
          background: #f9f9f9;
        }

        .badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }

        .badge.active {
          background: #d1fae5;
          color: #065f46;
        }

        .badge.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .badge.inactive {
          background: #f3f4f6;
          color: #374151;
        }
      `}</style>
    </div>
  );
};

export default ManageClients;
