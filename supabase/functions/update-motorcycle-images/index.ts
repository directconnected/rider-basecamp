
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    
    if (!supabaseUrl || !supabaseKey || !firecrawlKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch motorcycles without images
    const { data: motorcycles, error: fetchError } = await supabase
      .from('data_2025')
      .select('id, year, make, model')
      .or('image_url.is.null,image_url.eq.""')
      .limit(5); // Process in small batches

    if (fetchError) {
      throw new Error(`Error fetching motorcycles: ${fetchError.message}`);
    }

    if (!motorcycles?.length) {
      return new Response(
        JSON.stringify({ message: 'No motorcycles found requiring image updates' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${motorcycles.length} motorcycles needing images`);

    let processedCount = 0;
    const results = [];

    // Process each motorcycle with delay between requests
    for (const motorcycle of motorcycles) {
      try {
        const searchQuery = `${motorcycle.year} ${motorcycle.make} ${motorcycle.model} motorcycle`;
        console.log(`Processing motorcycle ID ${motorcycle.id}: ${searchQuery}`);

        // Add a delay between requests to respect rate limits
        if (processedCount > 0) {
          await delay(1000); // 1 second delay between requests
        }

        const searchResponse = await fetch('https://api.firecrawl.dev/v1/search-by-query', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${firecrawlKey}`
          },
          body: JSON.stringify({
            query: searchQuery,
            limit: 1
          })
        });

        if (!searchResponse.ok) {
          const errorData = await searchResponse.json();
          throw new Error(`Firecrawl API error: ${JSON.stringify(errorData)}`);
        }

        const searchData = await searchResponse.json();
        
        if (searchData.results?.[0]?.image) {
          const { error: updateError } = await supabase
            .from('data_2025')
            .update({ image_url: searchData.results[0].image })
            .eq('id', motorcycle.id);

          if (updateError) {
            throw new Error(`Error updating motorcycle ${motorcycle.id}: ${updateError.message}`);
          }

          results.push({
            id: motorcycle.id,
            status: 'success',
            image: searchData.results[0].image
          });
        } else {
          results.push({
            id: motorcycle.id,
            status: 'no_image_found'
          });
        }

        processedCount++;

      } catch (error) {
        console.error(`Error processing motorcycle ${motorcycle.id}:`, error);
        results.push({
          id: motorcycle.id,
          status: 'error',
          error: error.message
        });

        // If we hit a rate limit, stop processing
        if (error.message.includes('Rate limit exceeded')) {
          break;
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        message: `Processed ${processedCount} motorcycles`,
        results 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in update-motorcycle-images function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
})
