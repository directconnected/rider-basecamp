
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
      const body = await req.json();
      console.log('Received request body:', body);
      
      // Validate location data
      if (!body.location || !Array.isArray(body.location) || body.location.length !== 2) {
        throw new Error(`Invalid location format. Expected [lat, lng] array, got: ${JSON.stringify(body.location)}`);
      }
      
      requestData = {
        location: body.location.map(Number) as [number, number],
        type: body.type || 'lodging',
        radius: body.radius || 5000
      };
    }

    console.log('Processed request data:', requestData);

    const { location, type, radius } = requestData;
    const [lat, lng] = location;

    // Validate coordinates
    if (typeof lat !== 'number' || typeof lng !== 'number' || 
        isNaN(lat) || isNaN(lng) ||
        lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      throw new Error(`Invalid coordinates: lat=${lat}, lng=${lng}`);
    }

    const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
    if (!apiKey) {
      throw new Error('Google Places API key not configured');
    }

    // Format coordinates as string
    const locationString = `${lat},${lng}`;

    // Build Places API URL
    const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
    url.searchParams.append('location', locationString);
    url.searchParams.append('radius', radius.toString());
    url.searchParams.append('type', type);
    url.searchParams.append('key', apiKey);

    console.log(`Making request to Places API: ${type} near ${locationString} within ${radius}m`);
    
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
