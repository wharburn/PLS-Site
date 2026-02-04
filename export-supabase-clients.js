import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = 'https://vbyxkoirudagvgnxgndk.supabase.co';
const supabaseKey = 'sb_publishable_ZAZMZMzaE_6FGjSGkft3AA_AfphWP0i';

const supabase = createClient(supabaseUrl, supabaseKey);

async function exportClients() {
  try {
    console.log('🔄 Fetching clients from Supabase...');
    
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('client_name', { ascending: true });

    if (error) {
      console.error('❌ Supabase error:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.log('⚠️  No clients found in Supabase');
      return;
    }

    console.log(`✅ Found ${data.length} clients`);

    // Transform for local use
    const transformed = data.map((client, idx) => ({
      id: String(idx + 1),
      email: client.email || '',
      client_name: client.client_name || client.name || 'Unknown',
      phone: client.phone || null,
      address: client.address || null,
      city: client.city || null,
      postal_code: client.postal_code || null,
      country: client.country || 'United Kingdom',
      status: client.status || 'active'
    }));

    // Write to seed-data.json
    const seedPath = path.join(__dirname, 'seed-data.json');
    fs.writeFileSync(seedPath, JSON.stringify(transformed, null, 2));

    console.log(`✅ Exported ${transformed.length} clients to seed-data.json`);
  } catch (err) {
    console.error('❌ Fatal error:', err);
  }
}

exportClients();
