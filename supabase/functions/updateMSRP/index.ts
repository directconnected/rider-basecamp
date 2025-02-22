
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = 'https://hungfeisnqbmzurpxvel.supabase.co'
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

function cleanMSRPValue(msrpString: string): number | null {
  try {
    // Remove any currency symbols, commas, and extra whitespace
    const cleaned = msrpString.replace(/[$,\s]/g, '');
    // Convert to number
    const numericValue = parseFloat(cleaned);
    
    // Validate the result
    if (isNaN(numericValue) || numericValue <= 0) {
      console.log(`Invalid MSRP value after cleaning: ${msrpString} -> ${numericValue}`);
      return null;
    }
    
    // Round to 2 decimal places
    const roundedValue = Math.round(numericValue * 100) / 100;
    console.log(`Successfully cleaned MSRP: ${msrpString} -> ${roundedValue}`);
    return roundedValue;
  } catch (error) {
    console.error('Error cleaning MSRP value:', error);
    return null;
  }
}

async function searchSpecifications(year: string, make: string, model: string): Promise<{[key: string]: string | null}> {
  try {
    const apiKey = Deno.env.get('GOOGLE_SEARCH_API_KEY')
    const searchEngineId = Deno.env.get('GOOGLE_SEARCH_ENGINE_ID')
    
    if (!apiKey || !searchEngineId) {
      console.error('Missing API configuration')
      throw new Error('Missing Google Search API configuration')
    }

    const query = encodeURIComponent(`${year} ${make} ${model} motorcycle specifications engine transmission suspension`)
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${query}`

    console.log(`Searching for specifications of: ${year} ${make} ${model}`)
    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      console.error('Google Search API error:', data)
      throw new Error(`Failed to fetch search results: ${data.error?.message || 'Unknown error'}`)
    }

    if (!data.items || data.items.length === 0) {
      console.log('No search results found')
      return {}
    }

    console.log(`Found ${data.items.length} search results`)

    const specs: {[key: string]: string | null} = {}
    const searchText = data.items.map(item => `${item.title || ''} ${item.snippet || ''}`).join(' ')

    // Define regex patterns for each specification
    const patterns = {
      engine_type: /engine:?\s*([^\.|\n]+)/i,
      transmission: /transmission:?\s*([^\.|\n]+)/i,
      front_suspension: /front suspension:?\s*([^\.|\n]+)/i,
      rear_suspension: /rear suspension:?\s*([^\.|\n]+)/i,
      front_brakes: /front brake[s]?:?\s*([^\.|\n]+)/i,
      rear_brakes: /rear brake[s]?:?\s*([^\.|\n]+)/i,
      wheelbase: /wheelbase:?\s*([\d\.]+\s*(?:mm|in))/i,
      seat_height: /seat height:?\s*([\d\.]+\s*(?:mm|in))/i,
      fuel_capacity: /fuel capacity:?\s*([\d\.]+\s*(?:l|gal))/i,
      curb_weight: /(?:curb )?weight:?\s*([\d\.]+\s*(?:kg|lbs?))/i,
    }

    // Extract specifications using regex patterns
    for (const [key, pattern] of Object.entries(patterns)) {
      const match = searchText.match(pattern)
      if (match && match[1]) {
        specs[key] = match[1].trim()
        console.log(`Found ${key}: ${specs[key]}`)
      }
    }

    return specs
  } catch (error) {
    console.error('Error searching for specifications:', error)
    return {}
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting motorcycle data update process')
    const supabase = createClient(supabaseUrl, serviceRoleKey!)
    
    const { data: motorcycles, error: fetchError } = await supabase
      .from('data_2025')
      .select('*')
      .is('msrp', null)
      .limit(50)

    if (fetchError) {
      console.error('Error fetching motorcycles:', fetchError)
      throw fetchError
    }

    if (!motorcycles || motorcycles.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No motorcycles found that need updates'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Found ${motorcycles.length} motorcycles to process`)

    let updatedCount = 0
    for (const motorcycle of motorcycles) {
      try {
        if (!motorcycle.year || !motorcycle.make || !motorcycle.model) {
          console.log(`Skipping motorcycle ID ${motorcycle.id} - Missing required data`)
          continue
        }

        // Search for specifications
        const specs = await searchSpecifications(
          motorcycle.year,
          motorcycle.make,
          motorcycle.model
        )

        // Update the database with found specifications
        if (Object.keys(specs).length > 0) {
          const { error: updateError } = await supabase
            .from('data_2025')
            .update({ 
              ...specs,
              updated_at: new Date().toISOString()
            })
            .eq('id', motorcycle.id)

          if (updateError) {
            console.error(`Error updating specifications for ID ${motorcycle.id}:`, updateError)
          } else {
            console.log(`Successfully updated specifications for ID ${motorcycle.id}`)
            updatedCount++
          }
        }

        // Add delay between requests to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        console.error(`Error processing motorcycle ID ${motorcycle.id}:`, error)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully updated ${updatedCount} out of ${motorcycles.length} motorcycles with specifications data`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
