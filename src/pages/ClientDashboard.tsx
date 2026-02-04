import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { isTestModeEnabled, getTestUser } from '../lib/test-mode';
import { isBypassEnabled, getBypassUser } from '../lib/bypass-auth';

export const ClientDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string; name?: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    workEmail: '',
    address2: '',
    city: '',
    postcode: '',
    telephone: ''
  });

  useEffect(() => {
    loadClientData();
  }, []);

  const loadClientData = async () => {
    setLoading(true);
    try {
      let currentUser: any = null;

      // 1. Check Test/Bypass modes
      if (isTestModeEnabled()) {
        currentUser = getTestUser();
      } else if (isBypassEnabled()) {
        currentUser = getBypassUser();
      }

      // 2. Check real Supabase Auth
      if (!currentUser) {
        const { data: { user } } = await supabase.auth.getUser();
        currentUser = user;
      }

      if (currentUser) {
        setUser({
          id: currentUser.id,
          email: currentUser.email || '',
          name: currentUser.user_metadata?.name || currentUser.name || ''
        });

        // 3. Try to fetch persistent database record from 'clients' table
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        if (data) {
          setFormData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            workEmail: '', // These fields can be added to the schema if needed
            address2: '',
            city: '',
            postcode: '',
            telephone: data.phone || ''
          });
        } else {
          // Initialize with auth info
          setFormData(prev => ({
            ...prev,
            name: currentUser.user_metadata?.name || currentUser.name || '',
            email: currentUser.email || ''
          }));
        }
      }
    } catch (err) {
      console.error('Error loading client data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!user) {
      alert('You must be logged in to save changes.');
      return;
    }
    
    setSaving(true);
    try {
      const updatePayload = {
        id: user.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        updated_at: new Date().toISOString(),
        status: 'active' as const
      };

      const { error } = await supabase
        .from('clients')
        .upsert(updatePayload, { onConflict: 'id' });

      if (error) throw error;
      
      alert('Success! Your profile updates have been saved and can be retrieved any time.');
    } catch (err: any) {
      console.error('Error saving changes:', err);
      alert('Error saving to database: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32" style={{ backgroundColor: '#fdfcfb' }}>
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20" style={{ backgroundColor: '#fdfcfb' }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#c5a059', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
              CLIENT PORTAL
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '42px', fontWeight: 'bold', color: '#0f172a', margin: '0 0 4px 0', fontStyle: 'italic', display: 'inline-block', marginRight: '20px' }}>
              Your secure workspace
            </h1>
            <p style={{ color: '#64748b', margin: '12px 0 0 0', fontSize: '14px' }}>
              Manage your profile and keep track of all your documents secure here.
            </p>
          </div>
          <a href="/" style={{ color: '#c5a059', fontSize: '13px', textDecoration: 'none', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
            🏠 Back to website
          </a>
        </div>

        {/* Two Column Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
          {/* Left: Profile Form */}
          <div style={{
            backgroundColor: '#ffffff',
            padding: '32px',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
                Profile details
              </h2>
              {user && (
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>ID: {user.id.slice(0, 8)}...</span>
              )}
            </div>

            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
              {/* Name */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: '#f8fafc'
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>
                  Personal Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: '#f8fafc'
                  }}
                />
              </div>

              {/* Address Line 1 */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>
                  Address Line 1
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: '#f8fafc'
                  }}
                />
              </div>

              {/* Work Email */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>
                  Work Email
                </label>
                <input
                  type="email"
                  value={formData.workEmail}
                  onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                  placeholder="work@company.com"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: '#f8fafc'
                  }}
                />
              </div>

              {/* Address Line 2 */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={formData.address2}
                  onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: '#f8fafc'
                  }}
                />
              </div>

              {/* Mobile */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>
                  Mobile
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: '#f8fafc'
                  }}
                />
              </div>

              {/* City */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: '#f8fafc'
                  }}
                />
              </div>

              {/* Postcode */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>
                  Postcode
                </label>
                <input
                  type="text"
                  value={formData.postcode}
                  onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: '#f8fafc'
                  }}
                />
              </div>

              {/* Telephone */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>
                  Telephone
                </label>
                <input
                  type="tel"
                  value={formData.telephone}
                  onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: '#f8fafc'
                  }}
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveChanges}
              disabled={saving}
              style={{
                backgroundColor: '#0f172a',
                color: '#c5a059',
                padding: '12px 24px',
                borderRadius: '6px',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: saving ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                alignSelf: 'flex-start',
                opacity: saving ? 0.7 : 1
              }}
              onMouseEnter={(e) => !saving && (e.currentTarget.style.backgroundColor = '#1e293b')}
              onMouseLeave={(e) => !saving && (e.currentTarget.style.backgroundColor = '#0f172a')}
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>

          {/* Right: Stats & Documents */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Manage Documents Button */}
            <button
              style={{
                backgroundColor: '#0f172a',
                color: '#c5a059',
                padding: '14px 24px',
                borderRadius: '6px',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                width: '100%'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}
            >
              Manage documents
            </button>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
              {/* Identity */}
              <div style={{
                backgroundColor: '#ffffff',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#c5a059', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>
                  Identity
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '2px' }}>
                  2
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Passport / Driver Licence
                </div>
              </div>

              {/* Accounting */}
              <div style={{
                backgroundColor: '#ffffff',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#c5a059', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>
                  Accounting
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '2px' }}>
                  5
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Bank, compliance, expenses, other
                </div>
              </div>

              {/* Latest Upload */}
              <div style={{
                backgroundColor: '#ffffff',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#c5a059', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>
                  Latest Upload
                </div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#0f172a', marginBottom: '2px' }}>
                  BankStatement.pdf
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                  1/30/2026, 4:30:31 PM
                </div>
              </div>

              {/* Audit Entries */}
              <div style={{
                backgroundColor: '#ffffff',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#c5a059', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>
                  Audit Entries
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '2px' }}>
                  25
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Recent actions
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Tools Section */}
        <div style={{ marginTop: '80px', paddingTop: '60px', borderTop: '1px solid #e2e8f0' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 'bold', color: '#0f172a', marginBottom: '32px' }}>
            AI Tools & Services
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            {/* AI Legal */}
            <a href="/ai/legal" style={{ textDecoration: 'none' }}>
              <div style={{
                backgroundColor: '#ffffff',
                padding: '28px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'all 0.3s',
                cursor: 'pointer',
                border: '1px solid #e2e8f0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(197, 160, 89, 0.15)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚖️</div>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>
                  AI Legal
                </h3>
                <p style={{ color: '#64748b', fontSize: '13px', margin: '0' }}>
                  Get instant legal advice
                </p>
              </div>
            </a>

            {/* AI Translation */}
            <a href="/ai/translation" style={{ textDecoration: 'none' }}>
              <div style={{
                backgroundColor: '#ffffff',
                padding: '28px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'all 0.3s',
                cursor: 'pointer',
                border: '1px solid #e2e8f0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(197, 160, 89, 0.15)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>🌐</div>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>
                  AI Translation
                </h3>
                <p style={{ color: '#64748b', fontSize: '13px', margin: '0' }}>
                  Translate documents
                </p>
              </div>
            </a>

            {/* AI Analysis */}
            <a href="/ai/analysis" style={{ textDecoration: 'none' }}>
              <div style={{
                backgroundColor: '#ffffff',
                padding: '28px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'all 0.3s',
                cursor: 'pointer',
                border: '1px solid #e2e8f0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(197, 160, 89, 0.15)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>📊</div>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>
                  AI Analysis
                </h3>
                <p style={{ color: '#64748b', fontSize: '13px', margin: '0' }}>
                  Analyze and report
                </p>
              </div>
            </a>

            {/* AI Chat */}
            <a href="/ai/chat" style={{ textDecoration: 'none' }}>
              <div style={{
                backgroundColor: '#ffffff',
                padding: '28px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                transition: 'all 0.3s',
                cursor: 'pointer',
                border: '1px solid #e2e8f0'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(197, 160, 89, 0.15)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>💬</div>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', marginBottom: '6px' }}>
                  AI Chat
                </h3>
                <p style={{ color: '#64748b', fontSize: '13px', margin: '0' }}>
                  Chat with AI
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
