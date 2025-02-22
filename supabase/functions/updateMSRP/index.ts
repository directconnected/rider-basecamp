
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = 'https://hungfeisnqbmzurpxvel.supabase.co'
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

async function searchMSRP(year: string, make: string, model: string): Promise<string | null> {
  try {
    const apiKey = Deno.env.get('GOOGLE_SEARCH_API_KEY')
    const searchEngineId = Deno.env.get('GOOGLE_SEARCH_ENGINE_ID')
    
    if (!apiKey || !searchEngineId) {
      throw new Error('Missing Google Search API configuration')
    }

    const query = encodeURIComponent(`${year} ${make} ${model} motorcycle MSRP price`)
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${query}`

    console.log(`Searching for MSRP of: ${year} ${make} ${model}`)
    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      console.error('Google Search API error:', data)
      throw new Error('Failed to fetch search results')
    }

    // Look for price patterns in snippets
    for (const item of data.items || []) {
      const text = item.snippet || ''
      // Look for price patterns like $X,XXX or $XX,XXX
      const priceMatch = text.match(/\$\d{1,3}(,\d{3})*(\.\d{2})?/)
      if (priceMatch) {
        console.log(`Found price in snippet: ${priceMatch[0]}`)
        return priceMatch[0]
      }
    }

    console.log('No MSRP found in search results')
    return null
  } catch (error) {
    console.error('Error searching for MSRP:', error)
    return null
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    })
  }

  try {
    console.log('Starting MSRP update process')
    
    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, serviceRoleKey!)
    
    // Fetch motorcycles without MSRP values
    const { data: motorcycles, error: fetchError } = await supabase
      .from('data_2025')
      .select('*')
      .is('msrp', null)
      .limit(5) // Reduced limit to avoid hitting API rate limits
    
    if (fetchError) {
      console.error('Error fetching motorcycles:', fetchError)
      throw fetchError
    }

    console.log(`Found ${motorcycles?.length || 0} motorcycles to process`)

    let updatedCount = 0
    // Process each motorcycle
    for (const motorcycle of motorcycles || []) {
      try {
        console.log(`Processing motorcycle ID ${motorcycle.id}: ${motorcycle.year} ${motorcycle.make} ${motorcycle.model}`)
        
        // Search for MSRP using Google Custom Search
        const msrp = await searchMSRP(
          motorcycle.year || '',
          motorcycle.make || '',
          motorcycle.model || ''
        )

        if (msrp) {
          // Update the database with found MSRP
          const { error: updateError } = await supabase
            .from('data_2025')
            .update({ msrp: msrp })
            .eq('id', motorcycle.id)

          if (updateError) {
            console.error(`Error updating MSRP for ID ${motorcycle.id}:`, updateError)
          } else {
            console.log(`Successfully updated MSRP for ID ${motorcycle.id} to ${msrp}`)
            updatedCount++
          }
        } else {
          console.log(`No MSRP found for motorcycle ID ${motorcycle.id}`)
        }

        // Add delay between requests to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 2000))
      } catch (error) {
        console.error(`Error processing motorcycle ID ${motorcycle.id}:`, error)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully updated ${updatedCount} out of ${motorcycles?.length || 0} motorcycles with MSRP data`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
