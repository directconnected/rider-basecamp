
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
    return new Response(
      JSON.stringify({ error: 'Google Search API configuration is missing' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { type } = await req.json()
    console.log(`Starting search for type: ${type}`);
    
    if (type === 'routes') {
      const searchQuery = 'site:motorcycleroads.com "motorcycle route" "great ride"';
      const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_SEARCH_API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(searchQuery)}`;

      const response = await fetch(searchUrl);
      const data = await response.json();
      console.log('Found search results:', data.items?.length ?? 0);

      if (!data.items) {
        throw new Error('No search results found');
      }

      const routes = data.items.map(item => ({
        title: item.title,
        location: item.snippet?.split(' - ')?.[0] ?? 'Unknown',
        link: item.link
      }));

      if (routes.length > 0) {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );
        
        const { error } = await supabase.from('routes').insert(routes);
        if (error) throw error;
      }

      return new Response(JSON.stringify({ success: true, count: routes.length }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (type === 'gear') {
      const searchQuery = 'site:revzilla.com "motorcycle gear" "product details"';
      const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_SEARCH_API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(searchQuery)}`;

      const response = await fetch(searchUrl);
      const data = await response.json();
      console.log('Found search results:', data.items?.length ?? 0);

      if (!data.items) {
        throw new Error('No search results found');
      }

      const gear = data.items.map(item => ({
        title: item.title,
        price: item.pagemap?.offer?.[0]?.price ?? null,
        link: item.link,
        type: 'riding'
      }));

      if (gear.length > 0) {
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );
        
        const { error } = await supabase.from('gear').insert(gear);
        if (error) throw error;
      }

      return new Response(JSON.stringify({ success: true, count: gear.length }), {
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
      stack: error.stack 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
