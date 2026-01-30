/**
 * Authentication Context
 * Provides auth state and methods throughout the app
 */

import { Session, User } from '@supabase/supabase-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Client } from '../lib/database.types';
import supabase from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  client: Client | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    name: string,
    address: string,
    phone: string
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  bypassLogin: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Admin emails (in production, use a proper admin table)
const ADMIN_EMAILS = [
  'wayne@novocom.ai',
  'pedro@plsconsultants.com',
  'admin@plsconsultants.com',
  'admin@pls.com',
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch client profile when user changes
  const fetchClientProfile = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching client:', error);
      }
      setClient(data || null);
    } catch (err) {
      console.error('Error fetching client profile:', err);
      setClient(null);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user?.email) {
        fetchClientProfile(session.user.email);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user?.email) {
        await fetchClientProfile(session.user.email);
      } else {
        setClient(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    name: string,
    address: string,
    phone: string
  ) => {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (authError) throw authError;

    // Create client profile
    const { error: clientError } = await supabase.from('clients').insert({
      email,
      name,
      address,
      phone,
      onboarding_completed: true,
    });

    if (clientError) throw clientError;

    // Log audit
    await supabase.from('audit_log').insert({
      action_type: 'profile_created',
      summary: `New client signed up: ${email}`,
      performed_by: 'client',
      metadata: { name, email },
    });
  };

  const signIn = async (email: string, password: string) => {
    console.log('🔐 Starting login for:', email);

    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('🔐 Login response:', { error, data });

      if (error) {
        console.error('🔐 Login error:', error);
        throw error;
      }

      console.log('✅ Login successful!');

      // Update last login (optional - ignore errors if table doesn't exist)
      try {
        await supabase
          .from('clients')
          .update({ last_login_at: new Date().toISOString() })
          .eq('email', email);
      } catch (err) {
        console.log('Could not update last_login_at:', err);
      }

      // Log audit (optional - ignore errors if table doesn't exist)
      try {
        await supabase.from('audit_log').insert({
          action_type: 'login',
          summary: `Client logged in: ${email}`,
          performed_by: 'client',
        });
      } catch (err) {
        console.log('Could not log audit:', err);
      }
    } catch (err) {
      console.error('🔐 Sign in failed:', err);
      throw err;
    }
  };

  const signOut = async () => {
    const email = user?.email;

    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    if (email) {
      await supabase.from('audit_log').insert({
        action_type: 'logout',
        summary: `Client logged out: ${email}`,
        performed_by: 'client',
      });
    }
  };

  const bypassLogin = () => {
    console.log('🚀 Bypass login - creating mock user');
    const mockUser = {
      id: 'bypass-user-123',
      email: 'test@plsconsultants.com',
      aud: 'authenticated',
      role: 'authenticated',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: { name: 'Test User' },
    } as User;

    setUser(mockUser);
    setLoading(false);
  };

  const isAdmin = user?.email ? ADMIN_EMAILS.includes(user.email) : false;

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        client,
        loading,
        signUp,
        signIn,
        signOut,
        bypassLogin,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
