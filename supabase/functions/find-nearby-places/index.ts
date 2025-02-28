
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'

interface PlacesRequest {
  coordinates: [number, number];
  radius: number;
  type: string;
  specificType?: string | null;
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

    const { coordinates, radius, type, specificType } = await req.json() as PlacesRequest;
    
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
      return new Response(
        JSON.stringify({ error: 'Invalid coordinates provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!radius || typeof radius !== 'number') {
      return new Response(
        JSON.stringify({ error: 'Invalid radius provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!type) {
      return new Response(
        JSON.stringify({ error: 'No place type provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const [longitude, latitude] = coordinates;
    
    // Build the URL for the Places API
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${apiKey}`;
    
    // Add keyword parameter for specific type if provided
    if (specificType) {
      url += `&keyword=${specificType}`;
    }
    
    console.log(`Searching for places of type ${type}${specificType ? ` with keyword ${specificType}` : ''} near [${latitude}, ${longitude}] with radius ${radius}m`);

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Places API error:', data.status, data.error_message);
      return new Response(
        JSON.stringify({ error: `Places API error: ${data.status}`, details: data.error_message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get more details for the first result if present
    let detailedResults = data.results;
    
    if (data.results && data.results.length > 0) {
      try {
        const placeId = data.results[0].place_id;
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,website,types,vicinity,geometry,rating&key=${apiKey}`;
        
        const detailsResponse = await fetch(detailsUrl);
        const detailsData = await detailsResponse.json();
        
        if (detailsData.status === 'OK' && detailsData.result) {
          // Replace the first result with more detailed information
          detailedResults[0] = {
            ...data.results[0],
            ...detailsData.result
          };
        }
      } catch (detailsError) {
        console.error('Error fetching place details:', detailsError);
        // Continue with the basic results if details fetch fails
      }
    }

    return new Response(
      JSON.stringify({ results: detailedResults }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in find-nearby-places function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
