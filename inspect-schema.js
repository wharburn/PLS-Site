import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vbyxkoirudagvgnxgndk.supabase.co';
const supabaseKey = 'sb_publishable_ZAZMZMzaE_6FGjSGkft3AA_AfphWP0i';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectSchema() {
  try {
    // Get all columns via RLS-bypassing method - just select everything
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .limit(5);

    if (error) {
      console.log('❌ Query failed:', error.message);
      console.log('This likely means RLS is blocking the read');
    } else {
      console.log('✅ Query succeeded');
      if (data && data.length > 0) {
        console.log('\nClient record structure:');
        console.log(JSON.stringify(data[0], null, 2));
      }
    }
  } catch (err) {
    console.error('Fatal error:', err);
  }
}

inspectSchema();
