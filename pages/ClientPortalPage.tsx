import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ClientPortalPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful login and route to dashboard
    navigate('/client');
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '15px',
    color: '#0f172a',
    backgroundColor: '#ffffff',
    fontFamily: "Arial, Helvetica, sans-serif !important",
    outline: 'none',
    boxSizing: 'border-box',
    marginTop: '8px'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontFamily: "Arial, Helvetica, sans-serif !important",
    marginTop: '20px'
  };

  const featureBoxStyle: React.CSSProperties = {
     backgroundColor: 'rgba(255, 255, 255, 0.05)',
     border: '1px solid rgba(255, 255, 255, 0.1)',
     borderRadius: '12px',
     padding: '24px',
     display: 'flex',
     flexDirection: 'column',
     gap: '8px'
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f172a', fontFamily: "Arial, Helvetica, sans-serif !important" }}>
      <div className="max-w-7xl mx-auto px-6 py-32 flex items-center gap-20">
        
        {/* Left Side: Marketing/Features */}
        <div style={{ flex: '1.2' }}>
          <div style={{ display: 'inline-block', backgroundColor: '#c5a059', color: '#0f172a', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.1em', marginBottom: '32px' }}>
             CLIENT PORTAL
          </div>
          <h1 style={{ fontSize: '64px', fontWeight: 'bold', color: '#ffffff', lineHeight: '1.1', margin: '0 0 24px 0', letterSpacing: '-0.02em', fontStyle: 'italic' }}>
            Secure workspace for your engagements
          </h1>
          <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: '1.6', marginBottom: '48px', maxWidth: '540px', fontWeight: 'bold' }}>
            Access statements, upload identity documents, and collaborate on filings through a dedicated portal. Sign in with your email and password, or create an account to get started.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={featureBoxStyle}>
              <div style={{ color: '#c5a059', fontWeight: 'bold', fontSize: '14px' }}>Identity vault</div>
              <div style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.5', fontWeight: 'bold' }}>Store passports and driver licences in an encrypted vault.</div>
            </div>
            <div style={featureBoxStyle}>
              <div style={{ color: '#c5a059', fontWeight: 'bold', fontSize: '14px' }}>Audit history</div>
              <div style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.5', fontWeight: 'bold' }}>Every profile change and upload is versioned for compliance.</div>
            </div>
            <div style={featureBoxStyle}>
              <div style={{ color: '#c5a059', fontWeight: 'bold', fontSize: '14px' }}>Folder discipline</div>
              <div style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.5', fontWeight: 'bold' }}>Organise working papers, tax packs, and evidence cleanly.</div>
            </div>
            <div style={featureBoxStyle}>
              <div style={{ color: '#c5a059', fontWeight: 'bold', fontSize: '14px' }}>Direct AI access</div>
              <div style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.5', fontWeight: 'bold' }}>Jump to translation, analysis, or legal guidance tools.</div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div style={{ flex: '0.8' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '48px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
               <img src="/pls-logo.png" style={{ width: '48px', height: '48px' }} alt="PLS Logo" />
               <div>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#c5a059', letterSpacing: '0.1em' }}>PORTAL ACCESS</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a' }}>Sign in to continue</div>
               </div>
            </div>

            <form onSubmit={handleLogin}>
              <label style={labelStyle}>EMAIL</label>
              <input 
                type="email" 
                placeholder="you@company.com" 
                style={inputStyle}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label style={labelStyle}>PASSWORD</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                style={inputStyle}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button type="submit" style={{ 
                width: '100%', 
                backgroundColor: '#0f172a', 
                color: '#c5a059', 
                padding: '16px', 
                borderRadius: '12px', 
                fontSize: '16px', 
                fontWeight: 'bold', 
                marginTop: '40px',
                cursor: 'pointer',
                border: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span></span>
                <span>Access client portal</span>
                <span></span>
              </button>
            </form>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
               <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 'bold' }}>New here?</span>
               <a href="/signup" style={{ fontSize: '13px', color: '#c5a059', fontWeight: 'bold', textDecoration: 'none' }}>Create an account</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ClientPortalPage;
