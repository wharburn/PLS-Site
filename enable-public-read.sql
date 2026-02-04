-- Enable public read access to clients table
-- This allows the directory page to show all active clients without authentication

-- First, drop existing policies if they block anonymous reads
DROP POLICY IF EXISTS "Clients view own profile" ON clients;

-- Create a policy that allows anonymous users to view active clients
CREATE POLICY "Public view active clients" ON clients
    FOR SELECT USING (status = 'active');

-- Make sure this policy is used for both authenticated and anonymous access
CREATE POLICY "Users view own profile" ON clients
    FOR SELECT USING (
        status = 'active' OR 
        auth.jwt() ->> 'email' = email
    );

-- Allow authenticated users to update their own profile
CREATE POLICY "Users update own profile" ON clients
    FOR UPDATE USING (auth.jwt() ->> 'email' = email);
