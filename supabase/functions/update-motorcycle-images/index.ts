
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import FirecrawlApp from 'npm:@mendable/firecrawl-js'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const firecrawl = new FirecrawlApp({
      apiKey: Deno.env.get('FIRECRAWL_API_KEY') ?? ''
    });

    // Fetch motorcycles without images
    const { data: motorcycles, error: fetchError } = await supabase
      .from('data_2025')
      .select('id, year, make, model')
      .is('image_url', null)
      .limit(10); // Process in batches to avoid overwhelming the API

    if (fetchError) {
      throw new Error(`Error fetching motorcycles: ${fetchError.message}`);
    }

    for (const motorcycle of motorcycles || []) {
      const searchQuery = `${motorcycle.year} ${motorcycle.make} ${motorcycle.model} motorcycle`;
      console.log(`Searching for images of: ${searchQuery}`);

      try {
        const result = await firecrawl.crawlUrl(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&tbm=isch`, {
          limit: 1,
          scrapeOptions: {
            formats: ['html'],
            selectors: {
              images: 'img'
            }
          }
        });

        if (result.success && result.data && result.data.length > 0) {
          const imageUrl = result.data[0].src;
          if (imageUrl) {
            const { error: updateError } = await supabase
              .from('data_2025')
              .update({ image_url: imageUrl })
              .eq('id', motorcycle.id);

            if (updateError) {
              console.error(`Error updating motorcycle ${motorcycle.id}: ${updateError.message}`);
            } else {
              console.log(`Successfully updated image for motorcycle ${motorcycle.id}`);
            }
          }
        }
      } catch (error) {
        console.error(`Error processing motorcycle ${motorcycle.id}: ${error.message}`);
      }

      // Add a small delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return new Response(
      JSON.stringify({ message: 'Image update process completed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
