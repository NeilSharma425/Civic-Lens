#!/usr/bin/env node

/**
 * Interactive script to create .env file with Supabase credentials
 * Run with: node create-env.js
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🔧 CivicLens Database Setup\n');
console.log('This script will help you create a .env file with your Supabase credentials.\n');

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  try {
    console.log('📋 You can find these values in your Supabase Dashboard:');
    console.log('   → https://supabase.com/dashboard → Your Project → Settings → Database\n');

    const databaseUrl = await question('Enter your Supabase DATABASE_URL:\n(e.g., postgresql://postgres:password@db.xxx.supabase.co:5432/postgres)\n> ');

    if (!databaseUrl.trim()) {
      console.log('\n❌ Database URL is required!');
      process.exit(1);
    }

    // Validate URL format
    if (!databaseUrl.includes('postgresql://') && !databaseUrl.includes('postgres://')) {
      console.log('\n⚠️  Warning: This doesn\'t look like a PostgreSQL connection string.');
      const proceed = await question('Do you want to proceed anyway? (y/n): ');
      if (proceed.toLowerCase() !== 'y') {
        process.exit(0);
      }
    }

    const openaiKey = await question('\nEnter your OpenAI API Key (optional, press Enter to skip):\n> ');

    // Create .env content
    const envContent = `# Database Configuration
DATABASE_URL=${databaseUrl.trim()}
USE_DATABASE=true

# OpenAI Configuration (for AI features)
${openaiKey.trim() ? `OPENAI_API_KEY=${openaiKey.trim()}` : '# OPENAI_API_KEY=your_openai_api_key_here'}

# Server Configuration
PORT=5000
NODE_ENV=development
`;

    // Write .env file
    const envPath = path.join(process.cwd(), '.env');
    
    if (fs.existsSync(envPath)) {
      const overwrite = await question('\n⚠️  .env file already exists. Overwrite? (y/n): ');
      if (overwrite.toLowerCase() !== 'y') {
        console.log('\n❌ Setup cancelled.');
        process.exit(0);
      }
    }

    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ .env file created successfully!');
    
    console.log('\n📝 Next steps:');
    console.log('   1. Run migrations: npm run db:push');
    console.log('   2. Test connection: npx tsx test-supabase.ts');
    console.log('   3. Start server: npm run dev\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

setup();


