
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  location: [number, number]; // [latitude, longitude]
  type: 'lodging' | 'gas_station' | 'restaurant' | 'campground' | 'tourist_attraction';
  radius?: number;
  fields?: string[];
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

    // Build Places API URL for nearby search
    const nearbySearchUrl = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
    nearbySearchUrl.searchParams.append('location', locationString);
    nearbySearchUrl.searchParams.append('radius', (body.radius || 5000).toString());
    nearbySearchUrl.searchParams.append('type', body.type);
    nearbySearchUrl.searchParams.append('key', apiKey);

    console.log(`Making nearby search request to Places API: ${body.type} near ${locationString} within ${body.radius}m`);
    
    const nearbyResponse = await fetch(nearbySearchUrl.toString());
    if (!nearbyResponse.ok) {
      console.error('Places API HTTP Error:', nearbyResponse.status, nearbyResponse.statusText);
      throw new Error(`HTTP Error: ${nearbyResponse.status}`);
    }

    const nearbyData = await nearbyResponse.json();
    
    if (nearbyData.status === 'ZERO_RESULTS') {
      console.log('No places found');
      return new Response(
        JSON.stringify({ places: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (nearbyData.status !== 'OK') {
      console.error('Google Places API Error:', nearbyData.status, nearbyData.error_message);
      throw new Error(`Google Places API Error: ${nearbyData.status}`);
    }

    // Get additional details for the first place
    if (nearbyData.results.length > 0) {
      const placeId = nearbyData.results[0].place_id;
      const detailsUrl = new URL('https://maps.googleapis.com/maps/api/place/details/json');
      detailsUrl.searchParams.append('place_id', placeId);
      detailsUrl.searchParams.append('fields', 'name,formatted_address,formatted_phone_number,website,geometry,rating,price_level');
      detailsUrl.searchParams.append('key', apiKey);

      const detailsResponse = await fetch(detailsUrl.toString());
      if (detailsResponse.ok) {
        const detailsData = await detailsResponse.json();
        if (detailsData.status === 'OK') {
          // Merge the details with the original place data
          nearbyData.results[0] = {
            ...nearbyData.results[0],
            ...detailsData.result
          };
        }
      }
    }

    console.log(`Found ${nearbyData.results.length} places`);
    
    return new Response(
      JSON.stringify({ places: nearbyData.results }),
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
