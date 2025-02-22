
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { serve } from 'https://deno.fresh.run/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = 'https://hungfeisnqbmzurpxvel.supabase.co'
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

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
      .limit(10)

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
        
        // Generate a random MSRP between $8,000 and $30,000
        const msrp = Math.floor(Math.random() * (30000 - 8000) + 8000)
        console.log(`Generated MSRP: $${msrp} for motorcycle ID ${motorcycle.id}`)

        // Update the database
        const { error: updateError } = await supabase
          .from('data_2025')
          .update({ msrp: `$${msrp}` })
          .eq('id', motorcycle.id)

        if (updateError) {
          console.error(`Error updating MSRP for ID ${motorcycle.id}:`, updateError)
        } else {
          console.log(`Successfully updated MSRP for ID ${motorcycle.id} to $${msrp}`)
          updatedCount++
        }

        // Add small delay between updates
        await new Promise(resolve => setTimeout(resolve, 100))
      } catch (error) {
        console.error(`Error processing motorcycle ID ${motorcycle.id}:`, error)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully updated ${updatedCount} out of ${motorcycles?.length || 0} motorcycles`
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
