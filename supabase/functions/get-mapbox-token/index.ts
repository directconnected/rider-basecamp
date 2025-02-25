
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const token = Deno.env.get('MAPBOX_PUBLIC_TOKEN');
    
    if (!token) {
      throw new Error('Mapbox token not configured in environment');
    }

    console.log('Successfully retrieved Mapbox token');
    
    return new Response(
      JSON.stringify({ token }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error getting Mapbox token:', error);
    
    return new Response(
      JSON.stringify({
        error: error.message,
        details: 'Failed to retrieve Mapbox token'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
