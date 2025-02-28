
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'

interface GeocodeRequest {
  location: string;
  state?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { location, state } = await req.json() as GeocodeRequest;
    
    if (!location) {
      return new Response(
        JSON.stringify({ error: 'No location provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Format the query to include state if provided
    let query = location;
    if (state && !location.includes(state)) {
      query = `${location}, ${state}`;
    }

    console.log(`Geocoding location: "${query}"`);

    // Call Google Geocoding API
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    console.log('Geocoding API response status:', data.status);

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      console.error('Geocoding error or no results:', data.status);
      return new Response(
        JSON.stringify({ error: 'Location not found', details: data.status }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract location data from first result
    const result = data.results[0];
    const location_data = {
      formatted_address: result.formatted_address,
      location: result.geometry.location,
      place_id: result.place_id,
      types: result.types
    };

    return new Response(
      JSON.stringify(location_data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in geocode-location function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
