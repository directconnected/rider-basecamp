
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Motorcycle, SearchParams } from "@/types/motorcycle";
import { calculateCurrentValue, formatCurrency } from "@/utils/motorcycleCalculations";
import { decodeVINMake, decodeVINYear } from "@/utils/vinDecoder";
import { toast } from "sonner";

// Move admin client to a separate file to avoid multiple instances
<lov-write file_path="src/integrations/supabase/adminClient.ts">
import { createClient } from '@supabase/supabase-js';

export const adminClient = createClient(
  process.env.SUPABASE_URL || 'https://hungfeisnqbmzurpxvel.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1bmdmZWlzbnFibXp1cnB4dmVsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwODYxNjMzMywiZXhwIjoyMDI0MTkyMzMzfQ.IrEC7Jf3qIWTun4kfKUOPxsW8s0n5R01Drqz0rGUst0',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
