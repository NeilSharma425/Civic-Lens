/**
 * Load environment variables FIRST, before any other modules
 * This ensures .env is loaded before storage or any other module initializes
 */

import { config } from 'dotenv';

// Load .env file immediately
config();

// Log that environment is loaded (optional, for debugging)
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Environment variables loaded');
}

// Export a verification function
export function verifyEnv() {
  const hasSupabase = !!(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL);
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  
  return {
    supabase: hasSupabase,
    openai: hasOpenAI,
  };
}






