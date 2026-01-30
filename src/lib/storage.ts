/**
 * Supabase Storage Handler - File uploads
 */

import { supabase } from './supabase';

const BUCKET_NAME = 'statements';
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'image/*'];

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  filename?: string;
}

// Initialize bucket (create if doesn't exist)
export const initializeBucket = async () => {
  try {
    await supabase.storage.createBucket(BUCKET_NAME, {
      public: false,
      allowedMimeTypes: ALLOWED_TYPES
    });
  } catch (error) {
    // Bucket might already exist
    console.log('Bucket initialization note:', error);
  }
};

// Upload file to storage
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

  // Generate filename
  const timestamp = Date.now();
  const sanitized = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filename = customFilename || `${clientId}_${timestamp}_${sanitized}`;
  const filepath = `${clientId}/${filename}`;

  try {
    // Upload to storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filepath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      return { success: false, error: `Upload failed: ${error.message}` };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filepath);

    return {
      success: true,
      url: urlData?.publicUrl,
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

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'File type not allowed. Use: PDF, JPG, PNG, DOC, DOCX' };
  }

  return { valid: true };
}

// Delete file
export const deleteFile = async (filepath: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filepath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Delete exception:', err);
    return false;
  }
};

// List files for client
export const listClientFiles = async (clientId: string) => {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(clientId);

    if (error) return [];
    return data || [];
  } catch {
    return [];
  }
};

export default {
  uploadFile,
  deleteFile,
  listClientFiles,
  initializeBucket
};
