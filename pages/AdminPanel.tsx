import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('client');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) setUsers(data);
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Creating user...');

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newEmail,
        password: newPassword,
        email_confirm: true
      });

      if (authError) throw authError;

      // Add to users table
      const { error: dbError } = await supabase
        .from('users')
        .insert({
          id: authData.user?.id,
          email: newEmail,
          full_name: newName,
          role: newRole,
          is_active: true
        });

      if (dbError) throw dbError;

      setMessage(`✅ User ${newEmail} created successfully`);
      setNewEmail('');
      setNewPassword('');
      setNewName('');
      setNewRole('client');
      loadUsers();
    } catch (err) {
      setMessage(`❌ Error: ${String(err)}`);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Delete this user?')) return;

    try {
      await supabase.from('users').delete().eq('id', userId);
      setMessage('✅ User deleted');
      loadUsers();
    } catch (err) {
      setMessage(`❌ Error: ${String(err)}`);
    }
  };

  return (
    <div className="admin-panel">
      <h1>👤 Admin Panel - User Management</h1>

      <div className="admin-section">
        <h2>Add New User</h2>
        <form onSubmit={handleAddUser} className="form">
          <input
            type="email"
            placeholder="Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Full Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
            <option value="client">Client</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Add User</button>
        </form>
        {message && <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>{message}</div>}
      </div>

      <div className="admin-section">
        <h2>Users ({users.length})</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.full_name || '-'}</td>
                  <td><span className={`badge ${user.role}`}>{user.role}</span></td>
                  <td>{user.is_active ? '✅ Active' : '❌ Inactive'}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style>{`
        .admin-panel {
          padding: 20px;
        }

        .admin-section {
          margin: 30px 0;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 500px;
        }

        .form input, .form select {
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .form button {
          padding: 10px;
          background: #0057FF;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .form button:hover {
          background: #0045cc;
        }

        .message {
          margin-top: 10px;
          padding: 10px;
          border-radius: 4px;
        }

        .message.success {
          background: #f0f9ff;
          color: #0057FF;
        }

        .message.error {
          background: #fef2f2;
          color: #dc2626;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        .users-table th, .users-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        .users-table th {
          background: #f5f5f5;
          font-weight: 600;
        }

        .badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }

        .badge.admin {
          background: #fef3c7;
          color: #92400e;
        }

        .badge.client {
          background: #dbeafe;
          color: #1e40af;
        }

        .btn-delete {
          padding: 6px 12px;
          background: #dc2626;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        }

        .btn-delete:hover {
          background: #b91c1c;
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;
