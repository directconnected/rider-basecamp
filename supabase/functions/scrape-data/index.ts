
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
    
    if (type === 'routes') {
      const response = await fetch('https://www.motorcycleroads.com/', {
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
      })
      const html = await response.text()
      
      // Basic HTML parsing (in production, you'd want to use a proper HTML parser)
      const routes = []
      const matches = html.match(/<div class="route-card">(.*?)<\/div>/g)
      if (matches) {
        for (const match of matches) {
          const titleMatch = match.match(/<h3 class="route-title">(.*?)<\/h3>/)
          const locationMatch = match.match(/<div class="route-location">(.*?)<\/div>/)
          const linkMatch = match.match(/href="([^"]*)"/)
          
          if (titleMatch && locationMatch && linkMatch) {
            routes.push({
              title: titleMatch[1],
              location: locationMatch[1],
              link: linkMatch[1],
            })
          }
        }
      }
      
      // Store in Supabase
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )
      
      for (const route of routes) {
        await supabase.from('routes').insert(route)
      }
      
      return new Response(JSON.stringify({ success: true, count: routes.length }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    
    if (type === 'gear') {
      const response = await fetch('https://www.revzilla.com/motorcycle-gear', {
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
      })
      const html = await response.text()
      
      const gear = []
      const matches = html.match(/<div class="product-card">(.*?)<\/div>/g)
      if (matches) {
        for (const match of matches) {
          const titleMatch = match.match(/<div class="product-title">(.*?)<\/div>/)
          const priceMatch = match.match(/<div class="product-price">(.*?)<\/div>/)
          const linkMatch = match.match(/href="([^"]*)"/)
          
          if (titleMatch && priceMatch && linkMatch) {
            gear.push({
              title: titleMatch[1],
              price: priceMatch[1],
              link: linkMatch[1],
              type: 'riding', // Default to riding gear
            })
          }
        }
      }
      
      // Store in Supabase
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )
      
      for (const item of gear) {
        await supabase.from('gear').insert(item)
      }
      
      return new Response(JSON.stringify({ success: true, count: gear.length }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    
    return new Response(JSON.stringify({ error: 'Invalid type specified' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
    
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
