
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://hungfeisnqbmzurpxvel.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1bmdmZWlzbnFibXp1cnB4dmVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxNjc1NDMsImV4cCI6MjA1NTc0MzU0M30.2Ik86O4b5bo-lW-HV6suqVNTcs2mm-nOH55O0tmfm4E";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1bmdmZWlzbnFibXp1cnB4dmVsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwODYxNjMzMywiZXhwIjoyMDI0MTkyMzMzfQ.IrEC7Jf3qIWTun4kfKUOPxsW8s0n5R01Drqz0rGUst0";

// Create a single client instance for anonymous access
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

// Create a single admin client instance with service role
export const adminClient = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  }
);
