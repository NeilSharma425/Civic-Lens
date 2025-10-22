/**
 * Supabase Connection Test Script
 * Run with: npx tsx test-supabase.ts
 */

// Load environment variables from .env file
import { config } from 'dotenv';
config();

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { users, feedbackSubmissions, analysisResults } from "./shared/schema";
import { sql } from "drizzle-orm";

// Color output helpers
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testSupabaseConnection() {
  log('\n🧪 Starting Supabase Connection Tests\n', 'cyan');

  // Step 1: Check environment variables
  log('Step 1: Checking environment variables...', 'blue');
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    log('❌ ERROR: DATABASE_URL environment variable is not set!', 'red');
    log('\nPlease create a .env file with your Supabase connection string:', 'yellow');
    log('DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres', 'yellow');
    log('\nYou can find this in your Supabase dashboard under Project Settings > Database', 'yellow');
    process.exit(1);
  }
  
  log('✅ DATABASE_URL is set', 'green');
  
  // Mask password in URL for display
  const maskedUrl = databaseUrl.replace(/:([^@]+)@/, ':****@');
  log(`   Connection string: ${maskedUrl}`, 'cyan');

  // Step 2: Determine connection mode
  log('\nStep 2: Determining connection mode...', 'blue');
  const isSupabaseUrl = databaseUrl.includes('.supabase.co');
  
  if (isSupabaseUrl) {
    log('✅ Detected Supabase URL', 'green');
    
    // Test both direct connection and transaction pooler
    await testConnection('Direct Connection (port 5432)', databaseUrl, true);
    
    const poolerUrl = databaseUrl.replace(':5432/', ':6543/');
    await testConnection('Transaction Pooler (port 6543)', poolerUrl, false);
  } else {
    log('ℹ️  Non-Supabase database detected', 'yellow');
    await testConnection('Database Connection', databaseUrl, true);
  }

  log('\n✨ All tests completed!\n', 'cyan');
}

async function testConnection(name: string, url: string, useSSL: boolean) {
  log(`\n📡 Testing: ${name}`, 'blue');
  
  let client: postgres.Sql | null = null;
  
  try {
    // Create connection
    client = postgres(url, {
      prepare: false,
      ssl: useSSL ? 'require' : false,
      max: 1,
      connect_timeout: 10,
      idle_timeout: 30,
      onnotice: () => {}, // Suppress notices
    });

    // Test 1: Basic connectivity
    log('  Testing basic connectivity...', 'cyan');
    const result = await client`SELECT version()`;
    log('  ✅ Connection successful', 'green');
    log(`     PostgreSQL version: ${result[0].version.split(',')[0]}`, 'cyan');

    // Test 2: Check if tables exist
    log('  Checking database schema...', 'cyan');
    const db = drizzle(client);
    
    const tables = await client`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `;
    
    log(`  ✅ Found ${tables.length} tables in database`, 'green');
    
    if (tables.length > 0) {
      log('     Tables:', 'cyan');
      tables.forEach(table => log(`       - ${table.table_name}`, 'cyan'));
    } else {
      log('  ⚠️  No tables found. Run migrations with: npm run db:push', 'yellow');
    }

    // Test 3: Try a simple query on each table if they exist
    const tableNames = tables.map(t => t.table_name);
    
    if (tableNames.includes('users')) {
      log('  Testing users table...', 'cyan');
      const userCount = await client`SELECT COUNT(*) as count FROM users`;
      log(`  ✅ Users table accessible (${userCount[0].count} records)`, 'green');
    }
    
    if (tableNames.includes('feedback_submissions')) {
      log('  Testing feedback_submissions table...', 'cyan');
      const feedbackCount = await client`SELECT COUNT(*) as count FROM feedback_submissions`;
      log(`  ✅ Feedback submissions table accessible (${feedbackCount[0].count} records)`, 'green');
    }
    
    if (tableNames.includes('analysis_results')) {
      log('  Testing analysis_results table...', 'cyan');
      const analysisCount = await client`SELECT COUNT(*) as count FROM analysis_results`;
      log(`  ✅ Analysis results table accessible (${analysisCount[0].count} records)`, 'green');
    }

    // Test 4: Test write permissions
    log('  Testing write permissions...', 'cyan');
    try {
      await client`
        CREATE TABLE IF NOT EXISTS _test_table (
          id SERIAL PRIMARY KEY,
          test_column TEXT
        )
      `;
      await client`DROP TABLE IF EXISTS _test_table`;
      log('  ✅ Write permissions verified', 'green');
    } catch (err: any) {
      log(`  ⚠️  Write test failed: ${err.message}`, 'yellow');
    }

    log(`\n✅ ${name} - All tests passed!`, 'green');

  } catch (error: any) {
    log(`\n❌ ${name} - Connection failed!`, 'red');
    log(`   Error: ${error.message}`, 'red');
    
    if (error.message.includes('password')) {
      log('\n   Troubleshooting tips:', 'yellow');
      log('   1. Check that your password is correct in the DATABASE_URL', 'yellow');
      log('   2. Reset your database password in Supabase dashboard if needed', 'yellow');
    } else if (error.message.includes('SSL')) {
      log('\n   Troubleshooting tips:', 'yellow');
      log('   1. SSL connection may be required for Supabase', 'yellow');
      log('   2. Try enabling SSL in pgStorage.ts', 'yellow');
    } else if (error.message.includes('timeout')) {
      log('\n   Troubleshooting tips:', 'yellow');
      log('   1. Check your network connection', 'yellow');
      log('   2. Verify the Supabase project is running', 'yellow');
      log('   3. Check firewall settings', 'yellow');
    }
  } finally {
    if (client) {
      await client.end();
    }
  }
}

// Run the tests
testSupabaseConnection().catch((error) => {
  log('\n💥 Unexpected error:', 'red');
  console.error(error);
  process.exit(1);
});

