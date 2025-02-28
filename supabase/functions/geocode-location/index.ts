
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { location, state } = await req.json()
    
    if (!location) {
      return new Response(
        JSON.stringify({ error: 'Location is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    // Get the API key
    const GOOGLE_PLACES_API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY')
    
    if (!GOOGLE_PLACES_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'API key is missing' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
    
    // Adjust the location string if a specific state is provided
    let locationQuery = location;
    if (state && !location.includes(state)) {
      locationQuery = `${location}, ${state}, USA`;
    }
    
    // Build the geocoding URL
    const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationQuery)}&key=${GOOGLE_PLACES_API_KEY}`
    
    // Make the request to the Geocoding API
    const geocodingResponse = await fetch(geocodingUrl)
    const geocodingData = await geocodingResponse.json()
    
    // If there are no results or an error occurred
    if (geocodingData.status !== 'OK' || !geocodingData.results || geocodingData.results.length === 0) {
      console.log('No location found or API error:', geocodingData.status)
      return new Response(
        JSON.stringify({ error: 'Location not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }
    
    // Get the first result
    const result = geocodingData.results[0]
    
    // If we specifically requested a state, ensure the result is for that state
    if (state) {
      // Check if the address components include the state
      const stateComponent = result.address_components.find(component => 
        component.types.includes('administrative_area_level_1') && 
        (component.short_name === state || component.long_name === state)
      );
      
      if (!stateComponent) {
        // If we're looking for a specific state but didn't find it,
        // try to find another result that includes the state
        const stateResult = geocodingData.results.find(res => 
          res.address_components.some(component => 
            component.types.includes('administrative_area_level_1') && 
            (component.short_name === state || component.long_name === state)
          )
        );
        
        if (stateResult) {
          // Use this result instead
          return new Response(
            JSON.stringify({
              location: stateResult.geometry.location,
              formatted_address: stateResult.formatted_address,
              place_id: stateResult.place_id
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
      }
    }
    
    // Return the geocoded location
    return new Response(
      JSON.stringify({
        location: result.geometry.location,
        formatted_address: result.formatted_address,
        place_id: result.place_id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in geocode-location:', error)
    
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
