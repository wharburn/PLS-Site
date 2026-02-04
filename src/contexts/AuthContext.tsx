import React, { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ivrnnzubplghzizefmjw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2cm5uenVicGxnaHppemVmbWp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzMzgwMjYsImV4cCI6MjA4NDkxNDAyNn0.XSzX8a7d8qJTrvuiiD1KEhGG2v1lKKybkv3R24_yZz4';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface AuthContextType {
  user: any;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function checkUser() {
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted) {
            if (session?.user) {
                setUser(session.user);
                setIsAdmin(session.user.email === 'admin@pls.com');
            }
            setLoading(false);
        }
    }
    checkUser();
    return () => { isMounted = false; };
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setUser(data.user);
      setIsAdmin(email === 'admin@pls.com');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
