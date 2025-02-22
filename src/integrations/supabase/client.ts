
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hungfeisnqbmzurpxvel.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1bmdmZWlzbnFibXp1cnB4dmVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNjc1NDMsImV4cCI6MjA1NTc0MzU0M30.2Ik86O4b5bo-lW-HV6suqVNTcs2mm-nOH55O0tmfm4E";

// Create a single client instance
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true, // Enable session persistence
    autoRefreshToken: true, // Enable token auto-refresh
  }
});
