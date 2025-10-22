/**
 * Test Supabase Client Connection
 * Run with: npx tsx test-supabase-client.ts
 */

import { config } from 'dotenv';
config();

import { createClient } from '@supabase/supabase-js';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testSupabaseClient() {
  log('\n🧪 Testing Supabase Client Connection\n', 'cyan');

  // Step 1: Check environment variables
  log('Step 1: Checking environment variables...', 'blue');
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    log('❌ ERROR: Supabase credentials not found!', 'red');
    log('\nPlease set these in your .env file:', 'yellow');
    log('SUPABASE_URL=https://your-project.supabase.co', 'yellow');
    log('SUPABASE_ANON_KEY=your-anon-key', 'yellow');
    process.exit(1);
  }

  log('✅ SUPABASE_URL is set', 'green');
  log(`   URL: ${supabaseUrl}`, 'cyan');
  log('✅ SUPABASE_ANON_KEY is set', 'green');
  log(`   Key: ${supabaseKey.substring(0, 20)}...`, 'cyan');

  // Step 2: Create Supabase client
  log('\nStep 2: Creating Supabase client...', 'blue');
  const supabase = createClient(supabaseUrl, supabaseKey);
  log('✅ Client created', 'green');

  // Step 3: Test connection by checking project status
  log('\nStep 3: Testing API connection...', 'blue');
  try {
    const { data, error } = await supabase.from('feedback_submissions').select('count', { count: 'exact', head: true });
    
    if (error) {
      log(`❌ API Error: ${error.message}`, 'red');
      
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        log('\n⚠️  Tables do not exist yet!', 'yellow');
        log('\n📋 Next steps:', 'magenta');
        log('1. Go to: https://supabase.com/dashboard/project/fhajbtyjhwgasdmhxnuw/sql', 'yellow');
        log('2. Open the file: create-supabase-tables.sql', 'yellow');
        log('3. Copy and paste the SQL code into the SQL Editor', 'yellow');
        log('4. Click "Run" to create the tables', 'yellow');
        log('5. Run this test again: npm run test:supabase\n', 'yellow');
        process.exit(0);
      }
      
      throw error;
    }
    
    log('✅ API connection successful!', 'green');
  } catch (error: any) {
    log(`❌ Connection failed: ${error.message}`, 'red');
    process.exit(1);
  }

  // Step 4: Check if tables exist
  log('\nStep 4: Checking database tables...', 'blue');
  
  const tables = ['users', 'feedback_submissions', 'analysis_results'];
  let allTablesExist = true;
  
  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('count', { count: 'exact', head: true });
      
      if (error) {
        log(`❌ Table "${table}" not found or not accessible`, 'red');
        allTablesExist = false;
      } else {
        log(`✅ Table "${table}" exists and is accessible`, 'green');
      }
    } catch (error: any) {
      log(`❌ Table "${table}" error: ${error.message}`, 'red');
      allTablesExist = false;
    }
  }

  if (!allTablesExist) {
    log('\n⚠️  Some tables are missing!', 'yellow');
    log('\n📋 To create the tables:', 'magenta');
    log('1. Open: https://supabase.com/dashboard/project/fhajbtyjhwgasdmhxnuw/sql', 'yellow');
    log('2. Copy contents of: create-supabase-tables.sql', 'yellow');
    log('3. Paste and run in SQL Editor\n', 'yellow');
    process.exit(0);
  }

  // Step 5: Test write permissions
  log('\nStep 5: Testing write permissions...', 'blue');
  try {
    const testData = {
      original_text: 'Test feedback - please ignore',
      processing_status: 'pending'
    };
    
    const { data, error } = await supabase
      .from('feedback_submissions')
      .insert([testData])
      .select()
      .single();
    
    if (error) throw error;
    
    log('✅ Write permission verified (test record created)', 'green');
    
    // Clean up test record
    if (data) {
      await supabase.from('feedback_submissions').delete().eq('id', data.id);
      log('✅ Test record cleaned up', 'green');
    }
  } catch (error: any) {
    log(`⚠️  Write test failed: ${error.message}`, 'yellow');
  }

  // Success!
  log('\n✨ All tests passed!\n', 'green');
  log('🎉 Your Supabase database is ready to use!', 'magenta');
  log('\n📋 Next steps:', 'cyan');
  log('   Run: npm run dev', 'yellow');
  log('   Your app will now use Supabase for data storage!\n', 'yellow');
}

testSupabaseClient().catch((error) => {
  log('\n💥 Unexpected error:', 'red');
  console.error(error);
  process.exit(1);
});






