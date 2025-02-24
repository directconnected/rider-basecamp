
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  location: [number, number];
  type: 'lodging' | 'gas_station';
  radius?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // For testing, if no body is provided, use test coordinates
    let requestData: RequestBody;
    if (req.method === 'GET') {
      // Test coordinates for Pittsburgh, PA
      requestData = {
        location: [40.4406, -79.9959],
        type: 'lodging',
        radius: 5000
      };
      console.log('Using test coordinates:', requestData);
    } else {
      requestData = await req.json() as RequestBody;
    }

    const { location, type, radius = 5000 } = requestData;

    if (!location || !Array.isArray(location) || location.length !== 2) {
      throw new Error('Invalid location coordinates');
    }

    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    if (!apiKey) {
      throw new Error('Google Places API key not configured');
    }

    // Using the Google Places Nearby Search endpoint
    const [lat, lng] = location;
    const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
    url.searchParams.append('location', `${lat},${lng}`);
    url.searchParams.append('radius', radius.toString());
    url.searchParams.append('type', type);
    url.searchParams.append('key', apiKey);
    url.searchParams.append('rankby', 'rating'); // Get the highest rated places first

    console.log(`Searching for ${type} near ${lat},${lng} within ${radius}m`);
    
    const response = await fetch(url.toString());
    if (!response.ok) {
      console.error('HTTP Error:', response.status, response.statusText);
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response status:', data.status);

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
    
    // Log the first result for debugging
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
