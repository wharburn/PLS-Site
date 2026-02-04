import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import NoVoChat from '../components/NoVoChat.tsx';
import { Language } from '../translations.ts';

const supabaseUrl = 'https://ivrnnzubplghzizefmjw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2cm5uenVicGxnaHppemVmbWp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzMzgwMjYsImV4cCI6MjA4NDkxNDAyNn0.XSzX8a7d8qJTrvuiiD1KEhGG2v1lKKybkv3R24_yZz4';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AiChatPageProps {
  lang: Language;
}

const AiChatPage: React.FC<AiChatPageProps> = ({ lang }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [userEmail, setUserEmail] = useState<string>('client@pls.com');

    useEffect(() => {
        async function loadSession() {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user?.email) setUserEmail(session.user.email);
            setLoading(false);
        }
        loadSession();
    }, []);

    if (loading) return null;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: "Arial, sans-serif !important" }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '120px 24px 32px 24px', boxSizing: 'border-box' }}>
                
                {/* SHARED HEADER - PIXEL-PERFECT SYNC */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingLeft: '10px' }}>
                    <div style={{ flex: '1' }}>
                        <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#0f172a', margin: '0', display: 'flex', alignItems: 'baseline', whiteSpace: 'nowrap' }}>
                            <span>Client Portal</span>
                            <span style={{ color: '#c5a059', marginLeft: '16px' }}>Master Secure Workspace</span>
                        </h1>
                        <p style={{ color: '#64748b', margin: '8px 0 0 15px', fontSize: '14px', fontWeight: 'bold' }}>manage your profile , upload all your documents</p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '8px', paddingTop: '4px' }}>
                        <div style={{ width: '135px' }}></div> 
                        <button 
                            onClick={() => navigate('/client')} 
                            style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '10px 24px', borderRadius: '10px', border: 'none', fontWeight: '800', fontSize: '13.5px', cursor: 'pointer', height: '40px', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)', whiteSpace: 'nowrap' }}>
                            Back to portal
                        </button>
                        <button 
                            onClick={async () => { await supabase.auth.signOut(); window.location.href = '/#client-portal'; }}
                            style={{ backgroundColor: 'white', color: '#64748b', padding: '10px 24px', borderRadius: '10px', border: '1px solid #e2e8f0', fontWeight: '800', fontSize: '13.5px', cursor: 'pointer', height: '40px', whiteSpace: 'nowrap' }}>
                            Logout
                        </button>
                    </div>
                </div>

                {/* AI CONTENT AREA */}
                <div style={{ marginTop: '48px' }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '24px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
                        <div style={{ padding: '24px 32px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '28px' }}>💬</span> AI Chat Assistant
                            </h2>
                            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8' }}>Session active for {userEmail}</span>
                        </div>
                        <div style={{ height: '600px', position: 'relative' }}>
                            <NoVoChat
                                onClose={() => navigate('/client')}
                                lang={lang}
                                variant="panel"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AiChatPage;
