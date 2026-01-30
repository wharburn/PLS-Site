/**
 * Render Persistent Disk Storage Handler - File uploads
 * Saves files to /mnt/data/uploads/ on Render persistent disk
 */

import { supabase } from './supabase';

const STORAGE_PATH = '/mnt/data/uploads';
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  filename?: string;
}

// Upload file to persistent disk
export const uploadFile = async (
  file: File,
  clientId: string,
  customFilename?: string
): Promise<UploadResult> => {
  // Validate file
  const validation = validateFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  try {
    // Generate filename
    const timestamp = Date.now();
    const sanitized = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = customFilename || `${timestamp}_${sanitized}`;
    const filepath = `${clientId}/${filename}`;

    // Create a blob from the file
    const arrayBuffer = await file.arrayBuffer();
    
    // Send to backend for file saving
    const formData = new FormData();
    formData.append('file', file);
    formData.append('clientId', clientId);
    formData.append('filename', filename);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      return { success: false, error: 'Upload failed on server' };
    }

    const result = await response.json();
    
    return {
      success: true,
      url: result.url,
      filename: filename
    };
  } catch (err) {
    return { success: false, error: `Error: ${String(err)}` };
  }
};

// Validate file
function validateFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File too large. Max ${MAX_FILE_SIZE / 1024 / 1024}MB` };
  }

  // Allow any common document/image type by extension
  const allowed = /\.(pdf|jpg|jpeg|png|doc|docx|txt|gif|webp|xls|xlsx)$/i.test(file.name);
  if (!allowed) {
    return { valid: false, error: 'File type not allowed. Use: PDF, JPG, PNG, DOC, DOCX, TXT, XLS' };
  }

  return { valid: true };
}

// Delete file
export const deleteFile = async (filepath: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filepath })
    });
    return response.ok;
  } catch (err) {
    console.error('Delete error:', err);
    return false;
  }
};

// List files for client
export const listClientFiles = async (clientId: string) => {
  try {
    const response = await fetch(`/api/files?clientId=${clientId}`);
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
};

export default {
  uploadFile,
  deleteFile,
  listClientFiles
};
