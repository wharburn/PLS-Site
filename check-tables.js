import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vbyxkoirudagvgnxgndk.supabase.co';
const supabaseKey = 'sb_publishable_ZAZMZMzaE_6FGjSGkft3AA_AfphWP0i';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  try {
    // Try querying auth users (public table)
    const { data, error } = await supabase.auth.admin.listUsers();
    console.log('Auth connection:', error ? `❌ ${error.message}` : '✅ Working');

    // Try a basic table query (this will fail if table doesn't exist, but shows connection)
    const { data: clients, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .limit(1);

    if (clientError) {
      console.log('❌ clients table error:', clientError.message);
    } else {
      console.log('✅ clients table exists, records:', clients?.length || 0);
    }
  } catch (err) {
    console.error('Fatal error:', err);
  }
}

checkTables();
