import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vbyxkoirudagvgnxgndk.supabase.co';
const supabaseKey = 'sb_publishable_ZAZMZMzaE_6FGjSGkft3AA_AfphWP0i';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedClients() {
  const testClients = [
    {
      email: 'john.smith@example.com',
      name: 'John Smith',
      phone: '+44 20 7946 0958',
      address: '123 Legal Street',
      status: 'active'
    },
    {
      email: 'sarah.johnson@example.com',
      name: 'Sarah Johnson',
      phone: '+44 121 236 3565',
      address: '456 Business Avenue',
      status: 'active'
    },
    {
      email: 'michael.brown@example.com',
      name: 'Michael Brown',
      phone: '+44 161 828 5000',
      address: '789 Enterprise Plaza',
      status: 'active'
    },
    {
      email: 'emily.davis@example.com',
      name: 'Emily Davis',
      phone: '+44 113 248 5000',
      address: '321 Commerce Court',
      status: 'active'
    },
    {
      email: 'james.wilson@example.com',
      name: 'James Wilson',
      phone: '+44 131 225 3456',
      address: '654 Professional Building',
      status: 'active'
    }
  ];

  try {
    // First, check if clients already exist
    const { data: existing, error: checkError } = await supabase
      .from('clients')
      .select('email');

    if (checkError) {
      console.error('Error checking existing clients:', checkError);
      return;
    }

    const existingEmails = new Set(existing?.map(c => c.email) || []);
    const newClients = testClients.filter(c => !existingEmails.has(c.email));

    if (newClients.length === 0) {
      console.log('✅ Test clients already exist');
      return;
    }

    const { data, error } = await supabase
      .from('clients')
      .insert(newClients);

    if (error) {
      console.error('❌ Error seeding clients:', error);
    } else {
      console.log(`✅ Seeded ${newClients.length} test clients`);
    }
  } catch (err) {
    console.error('Fatal error:', err);
  }
}

seedClients();
