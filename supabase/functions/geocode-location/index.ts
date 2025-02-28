
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location, state } = await req.json();
    
    if (!location) {
      return new Response(
        JSON.stringify({ error: 'Location parameter is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Geocoding location: "${location}" with state context: "${state || 'none'}"`);
    
    // Check if the input is just a ZIP code
    const zipCodeRegex = /^\d{5}(-\d{4})?$/;
    const isZipCode = zipCodeRegex.test(location);
    
    let searchQuery = location;
    // If it's a zip code and we have a state, add the state to improve accuracy
    if (isZipCode && state) {
      searchQuery = `${location}, ${state}, USA`;
    } else if (isZipCode) {
      searchQuery = `${location}, USA`;
    }
    
    console.log(`Using search query: "${searchQuery}"`);

    // Use nominatim for geocoding (OpenStreetMap)
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&addressdetails=1&limit=1`;
    
    const response = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'MotorcycleValueTracker/1.0'
      }
    });
    
    const data = await response.json();
    console.log('Geocoding API response:', data);
    
    if (data && data.length > 0) {
      const result = data[0];
      console.log('Using geocoding result:', result);
      
      return new Response(
        JSON.stringify({ 
          location: { 
            lat: parseFloat(result.lat), 
            lng: parseFloat(result.lon),
            display_name: result.display_name
          } 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      // Try an alternative source - if we have a zip code, we can use a backup source
      if (isZipCode) {
        try {
          // Use zippopotam.us as a fallback for US zip codes
          const zipUrl = `https://api.zippopotam.us/us/${location}`;
          const zipResponse = await fetch(zipUrl);
          const zipData = await zipResponse.json();
          
          console.log('Zip API response:', zipData);
          
          if (zipData && zipData.places && zipData.places.length > 0) {
            const place = zipData.places[0];
            console.log('Using zip result:', place);
            
            return new Response(
              JSON.stringify({ 
                location: { 
                  lat: parseFloat(place.latitude), 
                  lng: parseFloat(place.longitude),
                  display_name: `${zipData.post code}, ${place.state}, ${zipData.country}`
                } 
              }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        } catch (zipError) {
          console.error('Error in zip code fallback:', zipError);
        }
      }
      
      // If we got here, all geocoding attempts failed
      return new Response(
        JSON.stringify({ error: 'Location not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }
  } catch (error) {
    console.error('Error in geocode-location function:', error);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
})
