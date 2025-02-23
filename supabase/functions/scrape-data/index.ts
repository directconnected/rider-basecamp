
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

  try {
    const { type } = await req.json()
    console.log(`Starting search for type: ${type}`);

    const GOOGLE_SEARCH_API_KEY = Deno.env.get('GOOGLE_SEARCH_API_KEY');
    const GOOGLE_SEARCH_ENGINE_ID = Deno.env.get('GOOGLE_SEARCH_ENGINE_ID');

    if (!GOOGLE_SEARCH_API_KEY || !GOOGLE_SEARCH_ENGINE_ID) {
      console.error('Missing API configuration');
      return new Response(
        JSON.stringify({ error: 'Google Search API configuration is missing' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    let searchQuery, searchResults;
    
    if (type === 'routes') {
      searchQuery = '"best motorcycle route" OR "motorcycle road" OR "scenic motorcycle ride"';
    } else if (type === 'gear') {
      // Add 2025 to the search query for gear
      searchQuery = '2025 ("motorcycle gear review" OR "best motorcycle equipment" OR "motorcycle protective gear")';
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid type specified' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_SEARCH_API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(searchQuery)}&num=10&dateRestrict=y1`;
    console.log('Making Google Search API request...');
    
    try {
      const response = await fetch(searchUrl);
      console.log('Search API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Google API Error:', errorText);
        return new Response(
          JSON.stringify({ 
            error: `Google API Error: ${response.status} ${response.statusText}`,
            details: errorText 
          }),
          { 
            status: response.status, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const data = await response.json();
      if (!data.items || data.items.length === 0) {
        return new Response(
          JSON.stringify({ 
            success: true, 
            count: 0,
            message: 'No results found'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      if (type === 'routes') {
        searchResults = data.items.map(item => ({
          title: item.title || 'Untitled Route',
          location: extractLocation(item.snippet, item.title),
          link: item.link
        }));
      } else {
        // For gear, filter results that contain 2025 in title or snippet
        searchResults = data.items
          .filter(item => {
            const content = `${item.title} ${item.snippet}`.toLowerCase();
            return content.includes('2025');
          })
          .map(item => ({
            title: item.title || 'Untitled Product',
            price: extractPrice(item.snippet, item.title),
            link: item.link,
            type: 'riding'
          }));
        
        console.log(`Filtered ${data.items.length} results to ${searchResults.length} 2025-specific items`);
      }

      if (searchResults.length === 0) {
        return new Response(
          JSON.stringify({ 
            success: true, 
            count: 0,
            message: type === 'gear' ? 'No 2025 gear results found' : 'No results found'
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      const { error: dbError } = await supabase
        .from(type === 'routes' ? 'routes' : 'gear')
        .insert(searchResults);

      if (dbError) {
        console.error('Database error:', dbError);
        return new Response(
          JSON.stringify({ 
            error: 'Failed to save results to database',
            details: dbError 
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          count: searchResults.length,
          results: searchResults 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } catch (searchError) {
      console.error('Search API error:', searchError);
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch search results',
          details: searchError.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Helper functions
function extractLocation(snippet?: string, title?: string): string {
  if (!snippet && !title) return 'Unknown';
  
  const textToSearch = `${snippet || ''} ${title || ''}`;
  const locationMatch = textToSearch.match(/[A-Z][a-z]+(?: [A-Z][a-z]+)*/);
  return locationMatch ? locationMatch[0] : 'Unknown';
}

function extractPrice(snippet?: string, title?: string): string | null {
  if (!snippet && !title) return null;
  
  const textToSearch = `${snippet || ''} ${title || ''}`;
  const priceMatch = textToSearch.match(/\$\d+(?:\.\d{2})?/);
  return priceMatch ? priceMatch[0] : null;
}
