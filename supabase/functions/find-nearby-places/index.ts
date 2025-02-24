
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  location: [number, number]; // [latitude, longitude]
  type: 'lodging' | 'gas_station';
  radius?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log('Received request body:', body);
    
    // Validate location data
    if (!body.location || !Array.isArray(body.location) || body.location.length !== 2) {
      throw new Error(`Invalid location format. Expected [lat, lng] array, got: ${JSON.stringify(body.location)}`);
    }
    
    const [lat, lng] = body.location.map(Number);
    
    // Validate coordinates
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw new Error(`Invalid coordinates: lat=${lat}, lng=${lng}`);
    }

    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    if (!apiKey) {
      throw new Error('Google Places API key not configured');
    }

    // Format coordinates as string
    const locationString = `${lat},${lng}`;
    console.log('Making request with location:', locationString);

    // Build Places API URL
    const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
    url.searchParams.append('location', locationString);
    url.searchParams.append('radius', (body.radius || 5000).toString());
    url.searchParams.append('type', body.type);
    url.searchParams.append('key', apiKey);

    console.log(`Making request to Places API: ${body.type} near ${locationString} within ${body.radius}m`);
    
    const response = await fetch(url.toString());
    if (!response.ok) {
      console.error('Places API HTTP Error:', response.status, response.statusText);
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Places API Response status:', data.status);
    
    if (data.status === 'ZERO_RESULTS') {
      console.log('No places found');
      return new Response(
        JSON.stringify({ places: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (data.status !== 'OK') {
      console.error('Google Places API Error:', data.status, data.error_message);
      throw new Error(`Google Places API Error: ${data.status}`);
    }

    console.log(`Found ${data.results.length} places`);
    
    if (data.results.length > 0) {
      const firstPlace = data.results[0];
      console.log('Sample result:', {
        name: firstPlace.name,
        vicinity: firstPlace.vicinity,
        rating: firstPlace.rating,
        location: firstPlace.geometry.location
      });
    }

    return new Response(
      JSON.stringify({ places: data.results }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error in find-nearby-places:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Error occurred while searching for nearby places'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
})
