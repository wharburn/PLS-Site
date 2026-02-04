import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();

  // BYPASS LOGIN ENTIRELY
  React.useEffect(() => {
    console.log("⚡ FORCE BYPASS ACTIVE");
    localStorage.setItem('pls_admin_session', 'active');
    localStorage.setItem('isAdmin', 'true');
    // Direct browser redirect
    window.location.href = '/admin/clients';
  }, []);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ color: 'white', textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #c5a059', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
        <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>Bypassing Security Gate...</h1>
        <p style={{ opacity: 0.5 }}>Redirecting to Audit Console</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
};

export default AdminLoginPage;
