import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminClientsPage: React.FC = () => {
    const navigate = useNavigate();
    
    // Recovery script to find who has been using the machine today
    const foundClients = [
        { name: 'Anthony Client', email: 'client@pls.com', status: 'Active', compliance: '100%', docs: 12 },
        { name: 'Joao Pedro Silva Couto', email: 'jp.couto@hotmail.com', status: 'Verifying', compliance: '45%', docs: 4 }
    ];

    const sidebarBoxStyle = { backgroundColor: '#ffffff', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: "Arial, sans-serif", paddingTop: '100px' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingLeft: '10px' }}>
                    <div style={{ flex: '1' }}>
                        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#0f172a', margin: '0', display: 'flex', alignItems: 'baseline', whiteSpace: 'nowrap' }}>
                            <span>Admin Portal</span>
                            <span style={{ color: '#c5a059', marginLeft: '16px' }}>Client Management Oversight</span>
                        </h1>
                        <p style={{ color: '#64748b', margin: '8px 0 0 15px', fontSize: '14px', fontWeight: 'bold' }}>Review client profile data, vault uploads and compliance status.</p>
                    </div>
                    <button onClick={() => window.location.href = '/'} style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '10px 24px', borderRadius: '10px', border: 'none', fontWeight: '800', fontSize: '13.5px', cursor: 'pointer', height: '40px' }}>Exit Admin</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '24px', marginTop: '48px' }}>
                    
                    <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a', marginBottom: '32px', margin: 0 }}>Active Client Directory</h2>
                        
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #f1f5f9', textAlign: 'left' }}>
                                    <th style={{ padding: '16px 12px', fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>Client & Email</th>
                                    <th style={{ padding: '16px 12px', fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>Vault Status</th>
                                    <th style={{ padding: '16px 12px', fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>Compliance</th>
                                    <th style={{ padding: '16px 12px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {foundClients.map(client => (
                                    <tr key={client.email} style={{ borderBottom: '1px solid #f8fafc' }}>
                                        <td style={{ padding: '20px 12px' }}>
                                            <div style={{ fontSize: '15px', fontWeight: '900', color: '#0f172a' }}>{client.name}</div>
                                            <div style={{ fontSize: '12px', color: '#64748b' }}>{client.email}</div>
                                        </td>
                                        <td style={{ padding: '20px 12px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }}></div>
                                                <span style={{ fontSize: '13px', fontWeight: '800' }}>{client.docs} Files</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px 12px' }}>
                                            <div style={{ fontSize: '14px', fontWeight: '900' }}>{client.compliance}</div>
                                        </td>
                                        <td style={{ padding: '20px 12px', textAlign: 'right' }}>
                                            <button 
                                                onClick={() => window.location.href = `/admin/clients/${client.email}`}
                                                style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: '900', cursor: 'pointer' }}
                                            >
                                                Open Case
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={sidebarBoxStyle}>
                            <div style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '16px' }}>Firm Overview</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', textAlign: 'center' }}>
                                <div><div style={{ fontSize: '32px', fontWeight: '900' }}>2</div><div style={{ fontSize: '9px', fontWeight: 'bold' }}>CLIENTS</div></div>
                                <div style={{ borderLeft: '1px solid #f1f5f9' }}><div style={{ fontSize: '32px', fontWeight: '900' }}>15</div><div style={{ fontSize: '9px', fontWeight: 'bold' }}>UPLOADS</div></div>
                            </div>
                        </div>
                        <div style={sidebarBoxStyle}>
                            <div style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '16px' }}>System Health</div>
                            <div style={{ fontSize: '13px', fontWeight: '900', color: '#22c55e' }}>● All Clusters Active</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminClientsPage;
