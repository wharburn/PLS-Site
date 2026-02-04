-- PLS Consultants Database Schema (Simplified - No RAG)
-- Supabase (PostgreSQL)
-- Created by NovoNic for Novocom Ai Ltd

-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CLIENTS TABLE
-- ============================================
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    ai_access BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    onboarding_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

CREATE INDEX idx_clients_email ON clients(email);

-- ============================================
-- DOCUMENTS TABLE
-- ============================================
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('identity', 'accounting', 'other')),
    doc_kind TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    extracted_text TEXT,
    ai_summary TEXT,
    note TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

CREATE INDEX idx_documents_client ON documents(client_id);
CREATE INDEX idx_documents_category ON documents(category);

-- ============================================
-- AUDIT LOG TABLE
-- ============================================
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    action_type TEXT NOT NULL,
    summary TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    performed_by TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_client ON audit_log(client_id);
CREATE INDEX idx_audit_date ON audit_log(created_at DESC);

-- ============================================
-- AI CONSULTATIONS TABLE
-- ============================================
CREATE TABLE ai_consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    category TEXT NOT NULL,
    query TEXT NOT NULL,
    response TEXT NOT NULL,
    sources JSONB DEFAULT '[]',
    language TEXT DEFAULT 'en',
    feedback_rating INTEGER,
    feedback_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_consultations_client ON ai_consultations(client_id);

-- ============================================
-- DOCUMENT REQUESTS TABLE
-- ============================================
CREATE TABLE document_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    doc_kind TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reminded', 'received', 'cancelled')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    last_reminder_at TIMESTAMPTZ,
    reminder_count INTEGER DEFAULT 0,
    reminder_channel TEXT,
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    due_date DATE,
    received_at TIMESTAMPTZ
);

CREATE INDEX idx_requests_client ON document_requests(client_id);
CREATE INDEX idx_requests_status ON document_requests(status);

-- ============================================
-- COMMUNICATIONS TABLE
-- ============================================
CREATE TABLE communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    channel TEXT NOT NULL CHECK (channel IN ('email', 'whatsapp', 'sms')),
    subject TEXT,
    body TEXT NOT NULL,
    template_id TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'read')),
    external_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    error_message TEXT
);

CREATE INDEX idx_comms_client ON communications(client_id);
CREATE INDEX idx_comms_status ON communications(status);

-- ============================================
-- AUTO-UPDATE TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================
-- Clients can view their own profile
CREATE POLICY "Clients view own profile" ON clients
    FOR SELECT USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Clients update own profile" ON clients
    FOR UPDATE USING (auth.jwt() ->> 'email' = email);

-- Clients can view/upload their own documents
CREATE POLICY "Clients view own documents" ON documents
    FOR SELECT USING (
        client_id IN (SELECT id FROM clients WHERE email = auth.jwt() ->> 'email')
    );

CREATE POLICY "Clients upload documents" ON documents
    FOR INSERT WITH CHECK (
        client_id IN (SELECT id FROM clients WHERE email = auth.jwt() ->> 'email')
    );

-- Clients can delete their own documents
CREATE POLICY "Clients delete own documents" ON documents
    FOR DELETE USING (
        client_id IN (SELECT id FROM clients WHERE email = auth.jwt() ->> 'email')
    );

-- Clients can view their own audit log
CREATE POLICY "Clients view own audit" ON audit_log
    FOR SELECT USING (
        client_id IN (SELECT id FROM clients WHERE email = auth.jwt() ->> 'email')
    );

-- Clients can view/create their own consultations  
CREATE POLICY "Clients view own consultations" ON ai_consultations
    FOR SELECT USING (
        client_id IN (SELECT id FROM clients WHERE email = auth.jwt() ->> 'email')
    );

CREATE POLICY "Clients create consultations" ON ai_consultations
    FOR INSERT WITH CHECK (
        client_id IN (SELECT id FROM clients WHERE email = auth.jwt() ->> 'email')
    );
