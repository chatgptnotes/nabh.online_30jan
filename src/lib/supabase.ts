import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Helper function to get Claude API key
export const getClaudeApiKey = () => {
  return import.meta.env.VITE_CLAUDE_API_KEY || '';
};

// Helper function to get Gemini API key (from environment variable or fallback)
export const getGeminiApiKey = () => {
  // Fallback key for production deployment
  const fallbackKey = 'AIzaSyC-vvyaU4bV27IIw66f_tM7HLhIn4kTlCA';
  return import.meta.env.VITE_GEMINI_API_KEY || fallbackKey;
};
