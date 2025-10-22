#!/usr/bin/env node

/**
 * Quick setup script for Supabase project: fhajbtyjhwgasdmhxnuw
 * Run with: node setup-my-database.js
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🔧 CivicLens Database Setup for Your Supabase Project\n');
console.log('📍 Project: fhajbtyjhwgasdmhxnuw');
console.log('🌐 Dashboard: https://supabase.com/dashboard/project/fhajbtyjhwgasdmhxnuw\n');

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  try {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📋 You need your DATABASE PASSWORD (not the API keys)\n');
    console.log('How to find it:');
    console.log('  1. Go to: https://supabase.com/dashboard/project/fhajbtyjhwgasdmhxnuw/settings/database');
    console.log('  2. Scroll to "Connection String" section');
    console.log('  3. Click the "URI" tab');
    console.log('  4. Copy your password from the connection string\n');
    console.log('Or reset it:');
    console.log('  1. Same page as above');
    console.log('  2. Find "Reset Database Password" button');
    console.log('  3. Create a new password and save it\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    const password = await question('Enter your Supabase DATABASE PASSWORD:\n> ');

    if (!password.trim()) {
      console.log('\n❌ Password is required!');
      console.log('\nℹ️  If you don\'t know your password:');
      console.log('   1. Visit: https://supabase.com/dashboard/project/fhajbtyjhwgasdmhxnuw/settings/database');
      console.log('   2. Click "Reset Database Password"');
      console.log('   3. Run this script again with the new password\n');
      process.exit(1);
    }

    const databaseUrl = `postgresql://postgres:${password.trim()}@db.fhajbtyjhwgasdmhxnuw.supabase.co:5432/postgres`;

    const openaiKey = await question('\nEnter your OpenAI API Key (optional, press Enter to skip):\n> ');

    // Create .env content
    const envContent = `# Database Configuration
DATABASE_URL=${databaseUrl}
USE_DATABASE=true

# OpenAI Configuration (for AI features)
${openaiKey.trim() ? `OPENAI_API_KEY=${openaiKey.trim()}` : '# OPENAI_API_KEY=your_openai_api_key_here'}

# Server Configuration
PORT=5000
NODE_ENV=development

# Supabase Project Info
# Project: fhajbtyjhwgasdmhxnuw
# Dashboard: https://supabase.com/dashboard/project/fhajbtyjhwgasdmhxnuw
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
    console.log(`✅ Database URL configured for project: fhajbtyjhwgasdmhxnuw`);
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📝 Next steps:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('   1. Push database schema:');
    console.log('      npm run db:push\n');
    console.log('   2. Test connection:');
    console.log('      npm run db:test\n');
    console.log('   3. Start development server:');
    console.log('      npm run dev\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

setup();






