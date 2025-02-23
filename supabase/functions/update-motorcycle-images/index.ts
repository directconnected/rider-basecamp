
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

    // Initialize Firecrawl
    const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
    if (!firecrawlApiKey) {
      throw new Error('Missing Firecrawl API key');
    }

    const firecrawl = new FirecrawlApp({
      apiKey: firecrawlApiKey
    });

    console.log('Fetching motorcycles without images...');

    // Fetch motorcycles without images
    const { data: motorcycles, error: fetchError } = await supabase
      .from('data_2025')
      .select('id, year, make, model')
      .or('image_url.is.null,image_url.eq.""')  // Check for both NULL and empty string
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
      const searchQuery = `${motorcycle.year} ${motorcycle.make} ${motorcycle.model} motorcycle`;
      console.log(`Searching for images of: ${searchQuery}`);

      try {
        // Add a longer delay before making the request
        await new Promise(resolve => setTimeout(resolve, 5000));

        // Use the simplest possible configuration
        const result = await firecrawl.crawlUrl(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&tbm=isch`);

        console.log('Firecrawl result:', result);

        if (result && result.data && result.data.length > 0) {
          // Try to find a valid image URL from the response
          let imageUrl = null;
          for (const item of result.data) {
            if (item.url && (item.url.startsWith('http://') || item.url.startsWith('https://'))) {
              imageUrl = item.url;
              break;
            }
            if (item.src && (item.src.startsWith('http://') || item.src.startsWith('https://'))) {
              imageUrl = item.src;
              break;
            }
          }

          if (imageUrl) {
            console.log(`Found image URL for motorcycle ${motorcycle.id}: ${imageUrl}`);
            
            const { error: updateError } = await supabase
              .from('data_2025')
              .update({ image_url: imageUrl })
              .eq('id', motorcycle.id);

            if (updateError) {
              console.error(`Error updating motorcycle ${motorcycle.id}: ${updateError.message}`);
              results.push({ id: motorcycle.id, success: false, error: updateError.message });
            } else {
              console.log(`Successfully updated image for motorcycle ${motorcycle.id}`);
              results.push({ id: motorcycle.id, success: true });
            }
          } else {
            console.log(`No valid image URL found for motorcycle ${motorcycle.id}`);
            results.push({ id: motorcycle.id, success: false, error: 'No valid image URL found' });
          }
        } else {
          console.log(`No results found for motorcycle ${motorcycle.id}`);
          results.push({ id: motorcycle.id, success: false, error: 'No results found' });
        }
      } catch (error) {
        // Check for rate limit errors
        if (error.message && error.message.toLowerCase().includes('rate limit')) {
          console.error(`Rate limit hit for motorcycle ${motorcycle.id}: ${error.message}`);
          return new Response(
            JSON.stringify({ 
              error: 'Rate limit exceeded, please try again in a few minutes',
              processed: results.length,
              results 
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 429 
            }
          );
        } else {
          console.error(`Error processing motorcycle ${motorcycle.id}: ${error.message}`);
          results.push({ id: motorcycle.id, success: false, error: error.message });
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Image update process completed',
        processed: motorcycles.length,
        results 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
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
