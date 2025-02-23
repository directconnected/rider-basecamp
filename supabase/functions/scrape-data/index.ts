
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const GOOGLE_SEARCH_API_KEY = Deno.env.get('GOOGLE_SEARCH_API_KEY');
  const GOOGLE_SEARCH_ENGINE_ID = Deno.env.get('GOOGLE_SEARCH_ENGINE_ID');

  if (!GOOGLE_SEARCH_API_KEY || !GOOGLE_SEARCH_ENGINE_ID) {
    console.error('Missing API configuration:', {
      hasApiKey: !!GOOGLE_SEARCH_API_KEY,
      hasEngineId: !!GOOGLE_SEARCH_ENGINE_ID
    });
    return new Response(
      JSON.stringify({ error: 'Google Search API configuration is missing' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { type } = await req.json()
    console.log(`Starting search for type: ${type}`);
    
    if (type === 'routes') {
      // More generic search query
      const searchQuery = 'site:motorcycleroads.com motorcycle route';
      const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_SEARCH_API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(searchQuery)}&num=10`;

      console.log('Making Google Search API request with URL:', searchUrl);
      const response = await fetch(searchUrl);
      console.log('Search API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Google Search API error:', {
          status: response.status,
          statusText: response.statusText,
          response: errorText
        });
        throw new Error(`Google Search API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Full Google API response:', JSON.stringify(data, null, 2));
      
      if (data.error) {
        console.error('Google API returned error:', data.error);
        throw new Error(`Google API error: ${data.error.message}`);
      }

      if (!data.items || data.items.length === 0) {
        console.log('No search results found. Search info:', data.searchInformation);
        return new Response(JSON.stringify({ 
          success: true, 
          count: 0,
          searchInfo: data.searchInformation 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const routes = data.items.map(item => {
        console.log('Processing route item:', JSON.stringify(item, null, 2));
        return {
          title: item.title,
          location: item.snippet?.split(' - ')?.[0] ?? 'Unknown',
          link: item.link
        };
      });

      console.log(`Processed ${routes.length} routes:`, routes);

      if (routes.length > 0) {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );
        
        console.log('Inserting routes into database...');
        const { error } = await supabase.from('routes').insert(routes);
        if (error) {
          console.error('Database insertion error:', error);
          throw error;
        }
        console.log('Successfully inserted routes');
      }

      return new Response(JSON.stringify({ 
        success: true, 
        count: routes.length,
        routes: routes 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (type === 'gear') {
      // More generic search query
      const searchQuery = 'site:revzilla.com "motorcycle helmets" OR "motorcycle jacket"';
      const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_SEARCH_API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(searchQuery)}&num=10`;

      console.log('Making Google Search API request with URL:', searchUrl);
      const response = await fetch(searchUrl);
      console.log('Search API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Google Search API error:', {
          status: response.status,
          statusText: response.statusText,
          response: errorText
        });
        throw new Error(`Google Search API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Full Google API response:', JSON.stringify(data, null, 2));

      if (data.error) {
        console.error('Google API returned error:', data.error);
        throw new Error(`Google API error: ${data.error.message}`);
      }

      if (!data.items || data.items.length === 0) {
        console.log('No gear search results found. Search info:', data.searchInformation);
        return new Response(JSON.stringify({ 
          success: true, 
          count: 0,
          searchInfo: data.searchInformation 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const gear = data.items.map(item => {
        console.log('Processing gear item:', JSON.stringify(item, null, 2));
        return {
          title: item.title,
          price: item.pagemap?.offer?.[0]?.price ?? null,
          link: item.link,
          type: 'riding'
        };
      });

      console.log(`Processed ${gear.length} gear items:`, gear);

      if (gear.length > 0) {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );
        
        console.log('Inserting gear into database...');
        const { error } = await supabase.from('gear').insert(gear);
        if (error) {
          console.error('Database insertion error:', error);
          throw error;
        }
        console.log('Successfully inserted gear');
      }

      return new Response(JSON.stringify({ 
        success: true, 
        count: gear.length,
        gear: gear 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ error: 'Invalid type specified' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Search error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.stack 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
