
import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

export const adminClient = createClient<Database>(
  'https://hungfeisnqbmzurpxvel.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1bmdmZWlzbnFibXp1cnB4dmVsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwODYxNjMzMywiZXhwIjoyMDI0MTkyMzMzfQ.IrEC7Jf3qIWTun4kfKUOPxsW8s0n5R01Drqz0rGUst0',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
