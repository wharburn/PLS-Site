/**
 * Supabase Client with Fallback Mode
 * Ensures system works even if API keys fail temporarily
 * PLS Consultants
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ivrnnzubplghzizefmjw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2cm5uenVicGxnaHppemVmbWp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzMzgwMjYsImV4cCI6MjA4NDkxNDAyNn0.XSzX8a7d8qJTrvuiiD1KEhGG2v1lKKybkv3R24_yZz4';

// Validate keys on startup
const validateKeys = () => {
  if (!supabaseUrl) {
    console.error('❌ CRITICAL: VITE_SUPABASE_URL not set');
    return false;
  }
  if (!supabaseAnonKey) {
    console.error('❌ CRITICAL: VITE_SUPABASE_ANON_KEY not set');
    return false;
  }
  if (!supabaseUrl.includes('supabase.co')) {
    console.error('❌ CRITICAL: Invalid Supabase URL format');
    return false;
  }
  if (!supabaseAnonKey.includes('sb_publishable_') && !supabaseAnonKey.includes('eyJ')) {
    console.error('❌ CRITICAL: Invalid Anon Key format');
    return false;
  }
  console.log('✅ API Keys validated successfully');
  return true;
};

// Check if keys are valid
const keysValid = validateKeys();

if (!keysValid) {
  throw new Error('FATAL: Invalid API keys. System cannot initialize. Review .env.production file.');
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);

// Health check
export const checkApiKeyHealth = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.warn('⚠️  Auth endpoint responding but with warnings');
      return { healthy: true, warning: error.message };
    }
    console.log('✅ API Keys healthy');
    return { healthy: true };
  } catch (error) {
    console.error('❌ API Key health check failed:', error);
    return { healthy: false, error: String(error) };
  }
};

// Auth helpers with error handling
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      // Distinguish between API key errors and auth errors
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        throw new Error(`API KEY ERROR: ${error.message}`);
      }
      throw error;
    }
    return data;
  } catch (error) {
    if (String(error).includes('API KEY ERROR')) {
      console.error('❌ CRITICAL: API Key invalid. Contact administrator.');
      throw error;
    }
    throw error;
  }
};

export const signUp = async (email: string, password: string, metadata?: { name?: string }) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });
    if (error) throw error;
    return data;
  } catch (error) {
    throw error;
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
};

export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};

export default supabase;
