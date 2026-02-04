/**
 * Client Service Layer
 * Handles all client-related database operations
 */

import supabase from './supabase';
import type { Client, ClientInsert, ClientUpdate, Document, DocumentInsert, AuditLog } from './database.types';

// ============================================
// CLIENT OPERATIONS
// ============================================

export const getClientByEmail = async (email: string): Promise<Client | null> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
  return data;
};

export const getClientById = async (id: string): Promise<Client | null> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const createClient = async (client: ClientInsert): Promise<Client> => {
  const { data, error } = await supabase
    .from('clients')
    .insert(client)
    .select()
    .single();
  
  if (error) throw error;
  
  // Log audit
  await logAudit(data.id, 'profile_created', `Client profile created for ${client.email}`);
  
  return data;
};

export const updateClient = async (id: string, updates: ClientUpdate): Promise<Client> => {
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  
  // Log audit
  const changedFields = Object.keys(updates).join(', ');
  await logAudit(id, 'profile_updated', `Profile updated: ${changedFields}`);
  
  return data;
};

export const getAllClients = async (): Promise<Client[]> => {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

// ============================================
// DOCUMENT OPERATIONS
// ============================================

export const getClientDocuments = async (clientId: string): Promise<Document[]> => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('client_id', clientId)
    .order('uploaded_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const uploadDocument = async (
  clientId: string,
  file: File,
  category: Document['category'],
  docKind: string,
  note?: string
): Promise<Document> => {
  // Upload file to Supabase Storage
  const filePath = `${clientId}/${Date.now()}-${file.name}`;
  
  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(filePath, file);
  
  if (uploadError) throw uploadError;
  
  // Create document record
  const docInsert: DocumentInsert = {
    client_id: clientId,
    name: file.name,
    category,
    doc_kind: docKind,
    file_path: filePath,
    file_size: file.size,
    mime_type: file.type,
    note,
  };
  
  const { data, error } = await supabase
    .from('documents')
    .insert(docInsert)
    .select()
    .single();
  
  if (error) throw error;
  
  // Log audit
  await logAudit(clientId, 'document_uploaded', `Uploaded ${file.name} to ${category} (${docKind})`);
  
  return data;
};

export const deleteDocument = async (docId: string, clientId: string): Promise<void> => {
  // Use a SECURITY DEFINER RPC so deletes don't silently no-op under RLS.
  // The function should delete both the DB row and the storage object.
  const { error } = await supabase.rpc('delete_document', { p_id: docId });
  if (error) throw error;

  // Log audit (best-effort; don't fail delete if audit insert fails)
  try {
    await logAudit(clientId, 'document_deleted', `Deleted document ${docId}`);
  } catch (e) {
    console.error('Audit log error:', e);
  }
};

export const getDocumentUrl = async (filePath: string): Promise<string> => {
  const { data } = supabase.storage
    .from('documents')
    .getPublicUrl(filePath);
  
  return data.publicUrl;
};

export const getSignedDocumentUrl = async (filePath: string, expiresIn = 3600): Promise<string> => {
  const { data, error } = await supabase.storage
    .from('documents')
    .createSignedUrl(filePath, expiresIn);
  
  if (error) throw error;
  return data.signedUrl;
};

// ============================================
// AUDIT LOG OPERATIONS
// ============================================

export const logAudit = async (
  clientId: string | null,
  actionType: string,
  summary: string,
  performedBy: string = 'client',
  metadata: Record<string, unknown> = {}
): Promise<void> => {
  const { error } = await supabase
    .from('audit_log')
    .insert({
      client_id: clientId,
      action_type: actionType,
      summary,
      performed_by: performedBy,
      metadata,
    });
  
  if (error) console.error('Audit log error:', error);
};

export const getClientAuditLog = async (clientId: string): Promise<AuditLog[]> => {
  const { data, error } = await supabase
    .from('audit_log')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

// ============================================
// DOCUMENT REQUEST OPERATIONS
// ============================================

export const getMissingDocuments = async (clientId: string): Promise<string[]> => {
  const docs = await getClientDocuments(clientId);
  
  const requiredIdentity = ['passport', 'driver_license'];
  const requiredAccounting = ['bank_statement', 'compliance', 'expenses'];
  
  const existingKinds = docs.map(d => d.doc_kind);
  
  const missing = [
    ...requiredIdentity.filter(k => !existingKinds.includes(k)),
    ...requiredAccounting.filter(k => !existingKinds.includes(k)),
  ];
  
  return missing;
};

export const createDocumentRequest = async (
  clientId: string,
  docKind: string,
  description?: string,
  dueDate?: string,
  priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal'
): Promise<void> => {
  const { error } = await supabase
    .from('document_requests')
    .insert({
      client_id: clientId,
      doc_kind: docKind,
      description,
      due_date: dueDate,
      priority,
    });
  
  if (error) throw error;
  
  await logAudit(clientId, 'admin_action', `Document request created: ${docKind}`, 'admin');
};

export const getPendingRequests = async (clientId: string) => {
  const { data, error } = await supabase
    .from('document_requests')
    .select('*')
    .eq('client_id', clientId)
    .eq('status', 'pending')
    .order('requested_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};
