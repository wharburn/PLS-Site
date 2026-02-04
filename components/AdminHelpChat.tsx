import React, { useEffect, useRef, useState } from 'react';
import { chatWithAdminOps } from '../services/gemini';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const AdminHelpChat: React.FC<{ lang?: 'en' | 'pt' }> = ({ lang = 'en' }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content:
        lang === 'pt'
          ? 'Olá — sou o assistente interno da PLS. Posso explicar como o Admin Console funciona, quais tabelas existem (clients/documents/invoices/services/users), e sugerir melhorias (novas páginas, novas colunas, automações). O que precisa?' 
          : 'Hi — I’m the internal PLS Admin assistant. I can explain how the Admin Console works, what tables exist (clients/documents/invoices/services/users), and propose improvements (new pages, columns, automations). What do you need?'
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const onSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    // Fire-and-forget log to server so we can see what was typed
    try {
      fetch('/api/admin/helpchat-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg }),
      }).catch(() => {});
    } catch {
      // ignore
    }

    try {
      // For today: always respond with a clear explanation of the website and how it works.
      const explanation =
        "Here’s how the PLS site works (high level):\n\n" +
        "1) It’s a React single-page app with public pages plus an Admin Console and a Client Portal.\n\n" +
        "2) Data lives in Supabase (Postgres). Main tables used today:\n" +
        "- clients: client profile (id, email, name, phone, status, onboarding flags)\n" +
        "- documents: metadata for uploaded files (id, client_id, name, category, doc_kind, file_path, mime_type, size, timestamps)\n\n" +
        "3) Files themselves are saved on the server disk (not Supabase Storage) under /root/clawd/PLS-Site/uploads/<clientId>/... and served at /uploads/...\n\n" +
        "4) Upload flow (client side):\n" +
        "- user is logged in (Supabase session)\n" +
        "- browser POSTs the file to /api/upload-to-disk\n" +
        "- server saves the file to disk and returns a relative path\n" +
        "- browser inserts a row into Supabase documents pointing to that file_path\n\n" +
        "5) Delete flow (client side):\n" +
        "- delete removes the row from Supabase documents (RLS allows client delete)\n" +
        "- refresh won’t bring it back because the DB row is gone\n\n" +
        "6) Admin console (no real login right now):\n" +
        "- /admin/clients shows clients list + multi-select checkboxes\n" +
        "- checkbox selection persists across browsers/devices via server file admin-selected-clients.json\n\n" +
        "Tell me what you want to build next and I’ll propose the next page + schema changes.";

      setMessages((prev) => [...prev, { role: 'model', content: explanation }]);

      // Log assistant reply too
      try {
        fetch('/api/admin/helpchat-log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: `[assistant] ${explanation}` }),
        }).catch(() => {});
      } catch {
        // ignore
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'model', content: 'Something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, overflow: 'hidden' }}>
      <div style={{ background: '#0f172a', color: '#fff', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontWeight: 900, color: '#c5a059' }}>Admin AI Assistant</div>
          <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 800 }}>Ask about the system, workflows, tables, and what we can build next.</div>
        </div>
        <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 900 }}>{loading ? 'Thinking…' : 'Online'}</div>
      </div>

      <div ref={scrollRef} style={{ maxHeight: 260, overflowY: 'auto', padding: 14, background: '#f8fafc' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
            <div
              style={{
                maxWidth: '85%',
                padding: '10px 12px',
                borderRadius: 14,
                fontSize: 13,
                fontWeight: 700,
                background: m.role === 'user' ? '#0f172a' : '#fff',
                color: m.role === 'user' ? '#fff' : '#0f172a',
                border: m.role === 'user' ? '1px solid #0f172a' : '1px solid #e2e8f0',
              }}
            >
              {m.content}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={onSend} style={{ padding: 12, background: '#fff', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={lang === 'pt' ? 'Pergunte algo…' : 'Ask something…'}
          style={{ flex: 1, background: '#f1f5f9', border: '1px solid #e2e8f0', padding: '10px 12px', borderRadius: 12, fontWeight: 800 }}
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          style={{ background: '#0f172a', color: '#c5a059', border: 0, borderRadius: 12, padding: '10px 14px', fontWeight: 900, cursor: 'pointer', opacity: !input.trim() || loading ? 0.6 : 1 }}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default AdminHelpChat;
