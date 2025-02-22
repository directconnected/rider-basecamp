
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { serve } from 'https://deno.fresh.run/mod.ts'

const supabaseUrl = 'https://hungfeisnqbmzurpxvel.supabase.co'
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  try {
    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, serviceRoleKey!)

    // Fetch motorcycles without MSRP values
    const { data: motorcycles, error: fetchError } = await supabase
      .from('data_2025')
      .select('*')
      .is('msrp', null)
      .limit(10) // Process in batches to avoid timeouts

    if (fetchError) {
      throw fetchError
    }

    // Process each motorcycle
    for (const motorcycle of motorcycles || []) {
      try {
        // Construct search query
        const searchQuery = `${motorcycle.year} ${motorcycle.make} ${motorcycle.model} motorcycle msrp`
        
        // Fetch from a motorcyle pricing website
        // Note: You would need to replace this with actual implementation
        // using specific website's API or structured data
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`
        const response = await fetch(searchUrl)
        const html = await response.text()

        // Extract MSRP using regex (this is a simplified example)
        const msrpMatch = html.match(/MSRP[:|\s]+\$?([\d,]+)/)
        if (msrpMatch && msrpMatch[1]) {
          const msrp = msrpMatch[1].replace(/,/g, '')

          // Update the database
          const { error: updateError } = await supabase
            .from('data_2025')
            .update({ msrp: `$${msrp}` })
            .eq('id', motorcycle.id)

          if (updateError) {
            console.error(`Error updating MSRP for ID ${motorcycle.id}:`, updateError)
          } else {
            console.log(`Updated MSRP for ID ${motorcycle.id} to $${msrp}`)
          }
        }

        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        console.error(`Error processing motorcycle ID ${motorcycle.id}:`, error)
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Processed ${motorcycles?.length || 0} motorcycles`
    }), {
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
