import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ivrnnzubplghzizefmjw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2cm5uenVicGxnaHppemVmbWp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzMzgwMjYsImV4cCI6MjA4NDkxNDAyNn0.XSzX8a7d8qJTrvuiiD1KEhGG2v1lKKybkv3R24_yZz4';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AdminClientDetailPage: React.FC = () => {
    const { email } = useParams<{ email: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [profile, setFormData] = useState<any>(null);
    const [documents, setDocuments] = useState<any[]>([]);

    useEffect(() => {
        let isMounted = true;
        async function loadClientData() {
            setLoading(true);
            try {
                // In this phase, we fetch the saved data from LocalStorage using our standardized master keys
                // We'll search by the email provided in the URL
                const masterProfileKey = `client_profile_full_v5_`;
                const masterVaultKey = `pls_master_vault_v6_`;
                
                // For this demo, we simulate the retrieval from the machine's session storage
                const keys = Object.keys(localStorage);
                let foundProfile = null;
                let foundDocs = [];

                for (const key of keys) {
                    if (key.startsWith(masterProfileKey)) {
                        const p = JSON.parse(localStorage.getItem(key) || '{}');
                        if (p.personalEmail === email || p.email === email) { foundProfile = p; break; }
                    }
                }

                if (foundProfile) {
                    setFormData(foundProfile);
                    // Match vault to the same session data
                    // (In final version, this will be a direct SQL query by ID)
                    const vaultData = localStorage.getItem(`pls_master_vault_v6_anonymous`) || localStorage.getItem(`pls_master_vault_v6_global-test-user`);
                    if (vaultData) setDocuments(JSON.parse(vaultData));
                }
            } catch (err) { console.error(err); } finally { if (isMounted) setLoading(false); }
        }
        loadClientData();
        return () => { isMounted = false; };
    }, [email]);

    const labelStyle = { display: 'block', fontSize: '9px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' as const, marginBottom: '6px', letterSpacing: '0.1em' };
    const dataBoxStyle = { width: '100%', padding: '14px 16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: '15px', color: '#0f172a', fontWeight: 'bold' };

    if (loading) return null;
    if (!profile) return <div style={{padding:'100px', textAlign:'center'}}>Case File Not Found.</div>;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: "Arial, sans-serif !important" }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '120px 24px 32px 24px', boxSizing: 'border-box' }}>
                
                {/* Unified Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingLeft: '10px' }}>
                    <div style={{ flex: '1' }}>
                        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#0f172a', margin: '0', display: 'flex', alignItems: 'baseline', whiteSpace: 'nowrap' }}>
                            <span>Case Review:</span>
                            <span style={{ color: '#c5a059', marginLeft: '16px' }}>{profile.name}</span>
                        </h1>
                        <p style={{ color: '#64748b', margin: '8px 0 0 15px', fontSize: '14px', fontWeight: 'bold' }}>Reviewing verified document submissions and profile background.</p>
                    </div>
                    <button onClick={() => navigate('/admin/clients')} style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '10px 24px', borderRadius: '10px', border: 'none', fontWeight: '800', fontSize: '13.5px', cursor: 'pointer', height: '40px' }}>Back to Directory</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '24px', marginTop: '48px' }}>
                    
                    {/* LEFT: Profile Data Review */}
                    <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', marginBottom: '32px' }}>Client Profile Data</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div><label style={labelStyle}>Verified Identity Name</label><div style={dataBoxStyle}>{profile.name}</div></div>
                            <div><label style={labelStyle}>Primary Contact</label><div style={dataBoxStyle}>{profile.personalEmail}</div></div>
                            <div><label style={labelStyle}>Business/Work Email</label><div style={dataBoxStyle}>{profile.workEmail || 'Not Provided'}</div></div>
                            <div><label style={labelStyle}>Direct Phone</label><div style={dataBoxStyle}>{profile.mobile}</div></div>
                            <div><label style={labelStyle}>Secondary Phone</label><div style={dataBoxStyle}>{profile.telephone || 'Not Provided'}</div></div>
                            <div><label style={labelStyle}>Registered Address</label><div style={{...dataBoxStyle, height:'auto'}}>{profile.addressLine1}, {profile.addressLine2}<br/>{profile.city}, {profile.postcode}</div></div>
                        </div>
                    </div>

                    {/* RIGHT: Document Vault Review */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div style={{ backgroundColor: '#ffffff', padding: '32px', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', marginBottom: '32px' }}>Document Evidence (Live Previews)</h2>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                                {documents.length === 0 ? <div style={{opacity:0.5}}>No evidence uploaded.</div> : 
                                    documents.map(doc => (
                                        <div key={doc.id} style={{ border:'1px solid #f1f5f9', borderRadius:'16px', overflow:'hidden', backgroundColor:'#fcfcfc' }}>
                                            <div style={{ height:'120px', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
                                                {doc.thumbnail.startsWith('data:') ? <img src={doc.thumbnail} style={{width:'100%', height:'100%', objectFit:'cover'}} /> : <span style={{fontSize:'32px'}}>📄</span>}
                                            </div>
                                            <div style={{ padding: '12px', borderTop:'1px solid #f1f5f9' }}>
                                                <div style={{ fontSize:'11px', fontWeight:'900', color:'#0f172a', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{doc.name}</div>
                                                <div style={{ fontSize:'9px', color:'#94a3b8', marginTop:'4px' }}>Category: {doc.category}</div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                        {/* Accountant Actions */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <button style={{ backgroundColor: '#22c55e', color: 'white', padding: '16px', borderRadius: '16px', border: 'none', fontWeight: '900', cursor: 'pointer' }}>APPROVE CASE</button>
                            <button style={{ backgroundColor: '#ef4444', color: 'white', padding: '16px', borderRadius: '16px', border: 'none', fontWeight: '900', cursor: 'pointer' }}>FLAG MISMATCH</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminClientDetailPage;
