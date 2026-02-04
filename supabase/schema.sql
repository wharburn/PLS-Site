-- PLS Consultants Database Schema
-- Supabase (PostgreSQL)
-- Created by NovoNic for Novocom Ai Ltd

-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CLIENTS TABLE
-- ============================================
-- Core client profile information
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    
    -- Service flags
    ai_access BOOLEAN DEFAULT true,
    
    -- Status tracking
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    onboarding_completed BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

-- Index for fast email lookups (auth)
CREATE INDEX idx_clients_email ON clients(email);

-- ============================================
-- DOCUMENTS TABLE
-- ============================================
-- Client uploaded documents (identity, accounting, etc.)
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    
    -- Document metadata
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('identity', 'accounting', 'other')),
    doc_kind TEXT NOT NULL CHECK (doc_kind IN (
        'passport', 'driver_license', 'national_id',
        'bank_statement', 'compliance', 'expenses', 'invoice', 'receipt',
        'tax_return', 'payslip', 'contract',
        'other'
    )),
    
    -- File info
    file_path TEXT NOT NULL,  -- Supabase Storage path
    file_size INTEGER,
    mime_type TEXT,
    
    -- AI processing
    extracted_text TEXT,  -- OCR/AI extracted content
    ai_summary TEXT,      -- AI-generated summary
    
    -- Notes
    note TEXT,
    
    -- Timestamps
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- Indexes for document queries
CREATE INDEX idx_documents_client ON documents(client_id);
CREATE INDEX idx_documents_category ON documents(category);
CREATE INDEX idx_documents_kind ON documents(doc_kind);

-- ============================================
-- AUDIT LOG TABLE
-- ============================================
-- Full audit trail of all client-related actions
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    
    -- Action details
    action_type TEXT NOT NULL CHECK (action_type IN (
        'profile_created', 'profile_updated', 'profile_deleted',
        'document_uploaded', 'document_deleted', 'document_replaced',
        'login', 'logout',
        'ai_consultation', 'email_sent', 'whatsapp_sent',
        'admin_action', 'system'
    )),
    summary TEXT NOT NULL,
    
    -- Additional context
    metadata JSONB DEFAULT '{}',
    
    -- Who performed the action
    performed_by TEXT,  -- 'client', 'admin', 'system', 'ai'
    ip_address INET,
    
    -- Timestamp
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for audit queries
CREATE INDEX idx_audit_client ON audit_log(client_id);
CREATE INDEX idx_audit_type ON audit_log(action_type);
CREATE INDEX idx_audit_date ON audit_log(created_at DESC);

-- ============================================
-- AI CONSULTATIONS TABLE
-- ============================================
-- Store AI legal/accounting consultation history
CREATE TABLE ai_consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    
    -- Consultation details
    category TEXT NOT NULL CHECK (category IN (
        'legal_property', 'legal_immigration', 'legal_family',
        'accountancy', 'translation', 'general'
    )),
    query TEXT NOT NULL,
    response TEXT NOT NULL,
    
    -- Grounding/sources
    sources JSONB DEFAULT '[]',
    
    -- Language
    language TEXT DEFAULT 'en' CHECK (language IN ('en', 'pt')),
    
    -- Feedback
    feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
    feedback_text TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for consultation history
CREATE INDEX idx_consultations_client ON ai_consultations(client_id);
CREATE INDEX idx_consultations_category ON ai_consultations(category);

-- ============================================
-- DOCUMENT REQUESTS TABLE
-- ============================================
-- Track outstanding document requests (for chaser system)
CREATE TABLE document_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    
    -- What's being requested
    doc_kind TEXT NOT NULL,
    description TEXT,
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reminded', 'received', 'cancelled')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    
    -- Communication tracking
    last_reminder_at TIMESTAMPTZ,
    reminder_count INTEGER DEFAULT 0,
    reminder_channel TEXT CHECK (reminder_channel IN ('email', 'whatsapp', 'both')),
    
    -- Timestamps
    requested_at TIMESTAMPTZ DEFAULT NOW(),
    due_date DATE,
    received_at TIMESTAMPTZ
);

-- Index for pending requests
CREATE INDEX idx_requests_client ON document_requests(client_id);
CREATE INDEX idx_requests_status ON document_requests(status);
CREATE INDEX idx_requests_due ON document_requests(due_date);

-- ============================================
-- COMMUNICATION LOG TABLE
-- ============================================
-- Track all outbound communications (email, WhatsApp)
CREATE TABLE communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    
    -- Channel
    channel TEXT NOT NULL CHECK (channel IN ('email', 'whatsapp', 'sms')),
    
    -- Message details
    subject TEXT,
    body TEXT NOT NULL,
    template_id TEXT,  -- For tracking which template was used
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'read')),
    external_id TEXT,  -- ID from email/WhatsApp provider
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,
    
    -- Error handling
    error_message TEXT
);

-- Index for communication history
CREATE INDEX idx_comms_client ON communications(client_id);
CREATE INDEX idx_comms_channel ON communications(channel);
CREATE INDEX idx_comms_status ON communications(status);

-- ============================================
-- ADMIN USERS TABLE
-- ============================================
-- PLS staff with admin access
CREATE TABLE admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'staff' CHECK (role IN ('staff', 'manager', 'admin', 'owner')),
    
    -- Permissions (can be expanded)
    can_view_clients BOOLEAN DEFAULT true,
    can_edit_clients BOOLEAN DEFAULT false,
    can_delete_clients BOOLEAN DEFAULT false,
    can_send_communications BOOLEAN DEFAULT false,
    can_access_ai BOOLEAN DEFAULT true,
    
    -- Status
    active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
);

-- ============================================
-- RAG KNOWLEDGE BASE TABLE
-- ============================================
-- For building the learning accountancy AI
CREATE TABLE knowledge_base (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Content
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    
    -- Categorization
    category TEXT NOT NULL CHECK (category IN (
        'uk_tax', 'pt_tax', 'hmrc', 'compliance',
        'property', 'immigration', 'family_law',
        'accounting_practice', 'internal_procedure'
    )),
    
    -- Source tracking
    source_type TEXT CHECK (source_type IN ('manual', 'document', 'consultation', 'web')),
    source_url TEXT,
    
    -- Vector embedding (for semantic search)
    embedding vector(1536),  -- OpenAI ada-002 dimensions
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for vector similarity search
CREATE INDEX idx_knowledge_embedding ON knowledge_base 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;

-- Client policies: clients can only see their own data
CREATE POLICY "Clients can view own profile" ON clients
    FOR SELECT USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Clients can update own profile" ON clients
    FOR UPDATE USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Clients can view own documents" ON documents
    FOR SELECT USING (
        client_id IN (SELECT id FROM clients WHERE email = auth.jwt() ->> 'email')
    );

CREATE POLICY "Clients can upload documents" ON documents
    FOR INSERT WITH CHECK (
        client_id IN (SELECT id FROM clients WHERE email = auth.jwt() ->> 'email')
    );

-- Clients can delete their own documents
CREATE POLICY "Clients can delete own documents" ON documents
    FOR DELETE USING (
        client_id IN (SELECT id FROM clients WHERE email = auth.jwt() ->> 'email')
    );

CREATE POLICY "Clients can view own audit log" ON audit_log
    FOR SELECT USING (
        client_id IN (SELECT id FROM clients WHERE email = auth.jwt() ->> 'email')
    );

CREATE POLICY "Clients can view own consultations" ON ai_consultations
    FOR SELECT USING (
        client_id IN (SELECT id FROM clients WHERE email = auth.jwt() ->> 'email')
    );

CREATE POLICY "Clients can create consultations" ON ai_consultations
    FOR INSERT WITH CHECK (
        client_id IN (SELECT id FROM clients WHERE email = auth.jwt() ->> 'email')
    );

-- Admin policies will be handled via service role key

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to clients table
CREATE TRIGGER clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Function to log audit entries
CREATE OR REPLACE FUNCTION log_audit(
    p_client_id UUID,
    p_action_type TEXT,
    p_summary TEXT,
    p_performed_by TEXT DEFAULT 'system',
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    v_audit_id UUID;
BEGIN
    INSERT INTO audit_log (client_id, action_type, summary, performed_by, metadata)
    VALUES (p_client_id, p_action_type, p_summary, p_performed_by, p_metadata)
    RETURNING id INTO v_audit_id;
    
    RETURN v_audit_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STORAGE BUCKETS (run in Supabase dashboard)
-- ============================================
-- Note: Create these buckets in Supabase Storage UI:
-- 1. 'documents' - for client uploaded files (private)
-- 2. 'avatars' - for profile pictures (public)

-- Storage policies will be:
-- documents: authenticated users can upload to their own folder
-- documents: users can only read their own files
