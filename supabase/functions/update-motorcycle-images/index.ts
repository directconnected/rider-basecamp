
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import FirecrawlApp from 'npm:@mendable/firecrawl-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting motorcycle image update process');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Initialize Firecrawl with retry mechanism
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlApiKey) {
      throw new Error('Missing Firecrawl API key');
    }

    console.log('Initializing Firecrawl client...');
    const firecrawl = new FirecrawlApp({
      apiKey: firecrawlApiKey
    });

    console.log('Fetching motorcycles without images...');

    // Fetch motorcycles without images
    const { data: motorcycles, error: fetchError } = await supabase
      .from('data_2025')
      .select('id, year, make, model')
      .or('image_url.is.null,image_url.eq.""')
      .limit(1);

    if (fetchError) {
      throw new Error(`Error fetching motorcycles: ${fetchError.message}`);
    }

    console.log(`Found ${motorcycles?.length || 0} motorcycles without images`);

    if (!motorcycles || motorcycles.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No motorcycles found without images' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = [];
    for (const motorcycle of motorcycles) {
      try {
        const searchQuery = `${motorcycle.year} ${motorcycle.make} ${motorcycle.model} motorcycle`;
        console.log(`Searching for images of: ${searchQuery}`);

        // Construct the URL with encoded parameters
        const searchUrl = new URL('https://www.google.com/search');
        searchUrl.searchParams.append('q', searchQuery);
        searchUrl.searchParams.append('tbm', 'isch');

        console.log(`Making request to: ${searchUrl.toString()}`);

        // Basic fetch attempt with timeout
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        );

        const result = await Promise.race([
          firecrawl.crawlUrl(searchUrl.toString()),
          timeoutPromise
        ]);

        console.log('Firecrawl response received');

        if (result && result.data && Array.isArray(result.data)) {
          console.log(`Found ${result.data.length} potential images`);
          
          // Try to find a valid image URL
          let imageUrl = null;
          for (const item of result.data) {
            if (typeof item === 'object' && item !== null) {
              const potentialUrl = item.url || item.src;
              if (potentialUrl && 
                  typeof potentialUrl === 'string' && 
                  (potentialUrl.startsWith('http://') || potentialUrl.startsWith('https://'))) {
                imageUrl = potentialUrl;
                break;
              }
            }
          }

          if (imageUrl) {
            console.log(`Found valid image URL: ${imageUrl}`);
            
            const { error: updateError } = await supabase
              .from('data_2025')
              .update({ image_url: imageUrl })
              .eq('id', motorcycle.id);

            if (updateError) {
              throw new Error(`Failed to update database: ${updateError.message}`);
            }

            results.push({ id: motorcycle.id, success: true });
            console.log(`Successfully updated motorcycle ${motorcycle.id}`);
          } else {
            throw new Error('No valid image URL found in response');
          }
        } else {
          throw new Error('Invalid response format from Firecrawl');
        }
      } catch (error) {
        console.error(`Error processing motorcycle ${motorcycle.id}:`, error);
        
        if (error.message?.toLowerCase().includes('rate limit')) {
          return new Response(
            JSON.stringify({ 
              error: 'Rate limit exceeded, please try again in a few minutes',
              processed: results.length,
              results 
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
          );
        }

        results.push({ 
          id: motorcycle.id, 
          success: false, 
          error: error.message || 'Unknown error occurred'
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Image update process completed',
        processed: results.length,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Fatal error in update-motorcycle-images function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message,
        stack: error.stack
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
})
