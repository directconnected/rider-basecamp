
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
    console.log(`Starting scraping for type: ${type}`);
    
    if (type === 'routes') {
      try {
        const response = await fetch('https://www.motorcycleroads.com/motorcycle-roads/all-motorcycle-roads', {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Referer': 'https://www.motorcycleroads.com/',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'max-age=0'
          },
          redirect: 'follow'
        });
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const html = await response.text();
        console.log('Retrieved HTML length:', html.length);
        
        // Save HTML content for debugging
        const supabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );
        
        // Find all route listings
        const routeMatches = html.match(/<article[^>]*class="[^"]*node-motorcycle-road[^"]*"[^>]*>[\s\S]*?<\/article>/gi) ||
                           html.match(/<div[^>]*class="[^"]*route-listing[^"]*"[^>]*>[\s\S]*?<\/div>/gi);
                           
        console.log('Found route matches:', routeMatches?.length ?? 0);
        
        if (!routeMatches) {
          console.log('No routes found in HTML. Sample of HTML:', html.substring(0, 1000));
          throw new Error('No route matches found in HTML');
        }

        const routes = [];
        for (const match of routeMatches) {
          try {
            const titleMatch = match.match(/<h2[^>]*>(.*?)<\/h2>/i) || 
                             match.match(/<h3[^>]*>(.*?)<\/h3>/i);
            const locationMatch = match.match(/<span[^>]*class="[^"]*location[^"]*"[^>]*>(.*?)<\/span>/i) ||
                                match.match(/<div[^>]*class="[^"]*field-state[^"]*"[^>]*>(.*?)<\/div>/i);
            const linkMatch = match.match(/href="([^"]*motorcycle-roads[^"]*)"/i);
            
            if (titleMatch?.[1]) {
              routes.push({
                title: titleMatch[1].replace(/<[^>]*>/g, '').trim(),
                location: locationMatch?.[1]?.replace(/<[^>]*>/g, '').trim() ?? 'Unknown',
                link: linkMatch ? new URL(linkMatch[1], 'https://www.motorcycleroads.com').toString() : null
              });
            }
          } catch (err) {
            console.error('Error parsing route:', err);
          }
        }
        
        console.log(`Found ${routes.length} routes:`, routes);
        
        if (routes.length > 0) {
          const { data, error } = await supabase.from('routes').insert(routes);
          if (error) {
            console.error('Error inserting routes:', error);
            throw error;
          }
        }
        
        return new Response(JSON.stringify({ success: true, count: routes.length }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
        
      } catch (error) {
        console.error('Routes scraping error:', error);
        throw new Error(`Routes scraping failed: ${error.message}`);
      }
    }
    
    if (type === 'gear') {
      try {
        const response = await fetch('https://www.revzilla.com/motorcycle-gear', {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Connection': 'keep-alive'
          }
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const html = await response.text();
        console.log('Retrieved gear HTML length:', html.length);
        
        const gear = [];
        const productMatches = html.match(/<div[^>]*class="[^"]*product-tile[^"]*"[^>]*>[\s\S]*?<\/div>/gi);
        console.log('Found product matches:', productMatches?.length ?? 0);

        if (productMatches) {
          for (const match of productMatches) {
            try {
              const titleMatch = match.match(/data-product-name="([^"]*)"/i) ||
                               match.match(/<span[^>]*class="[^"]*product-title[^"]*"[^>]*>(.*?)<\/span>/i);
              const priceMatch = match.match(/data-product-price="([^"]*)"/i) ||
                               match.match(/<span[^>]*class="[^"]*product-price[^"]*"[^>]*>(.*?)<\/span>/i);
              const linkMatch = match.match(/href="([^"]*)"[^>]*data-product-link/i) ||
                              match.match(/href="(\/[^"]*)"[^>]*class="[^"]*product-link/i);
              
              if (titleMatch?.[1]) {
                gear.push({
                  title: titleMatch[1].replace(/<[^>]*>/g, '').trim(),
                  price: priceMatch ? priceMatch[1].replace(/<[^>]*>/g, '').trim() : null,
                  link: linkMatch ? new URL(linkMatch[1], 'https://www.revzilla.com').toString() : null,
                  type: 'riding'
                });
              }
            } catch (err) {
              console.error('Error parsing product:', err);
            }
          }
        }
        
        console.log(`Found ${gear.length} gear items`);
        
        if (gear.length > 0) {
          const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
          );
          
          const { data, error } = await supabase.from('gear').insert(gear);
          if (error) throw error;
        }
        
        return new Response(JSON.stringify({ success: true, count: gear.length }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
        
      } catch (error) {
        console.error('Gear scraping error:', error);
        throw new Error(`Gear scraping failed: ${error.message}`);
      }
    }
    
    return new Response(JSON.stringify({ error: 'Invalid type specified' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    console.error('Scraping error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      stack: error.stack 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
