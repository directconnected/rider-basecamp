
import { corsHeaders } from '../_shared/cors.ts'

interface PlacesRequest {
  coordinates: [number, number];
  radius: number;
  type: string;
  specificType?: string | null;
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

    const { coordinates, radius, type, specificType, state } = await req.json() as PlacesRequest;
    
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

    let results = data.results || [];
    
    // Filter by state if specified
    if (state && results.length > 0) {
      // For each result, we'll need to get more details to check the state
      // We'll limit to checking the first 5 to avoid too many API calls
      const resultsToCheck = results.slice(0, 5);
      const filteredResults = [];
      
      for (const place of resultsToCheck) {
        try {
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=address_components&key=${apiKey}`;
          const detailsResponse = await fetch(detailsUrl);
          const detailsData = await detailsResponse.json();
          
          if (detailsData.status === 'OK' && detailsData.result && detailsData.result.address_components) {
            const stateComponent = detailsData.result.address_components.find(
              (comp: any) => comp.types.includes('administrative_area_level_1')
            );
            
            if (stateComponent && 
                (stateComponent.short_name === state || 
                 stateComponent.long_name.toLowerCase() === state.toLowerCase())) {
              filteredResults.push(place);
            }
          }
        } catch (detailsError) {
          console.error('Error fetching place details for state filtering:', detailsError);
        }
      }
      
      // Use filtered results if we found any in the specified state
      if (filteredResults.length > 0) {
        results = filteredResults;
      }
    }

    // Get more details for all results
    const detailedResults = [];
    const fieldsToFetch = [
      "name",
      "vicinity",
      "formatted_address",
      "geometry",
      "rating",
      "price_level",
      "website",
      "formatted_phone_number",
      "types"
    ];
    
    console.log(`Fetching details for ${Math.min(results.length, 5)} places with fields: ${JSON.stringify(fieldsToFetch, null, 2)}`);
    
    // Only fetch details for the first 5 results to avoid making too many API calls
    for (let i = 0; i < Math.min(results.length, 5); i++) {
      try {
        const placeId = results[i].place_id;
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fieldsToFetch.join(',')}&key=${apiKey}`;
        
        const detailsResponse = await fetch(detailsUrl);
        const detailsData = await detailsResponse.json();
        
        if (detailsData.status === 'OK' && detailsData.result) {
          // Merge the details with the original result
          detailedResults.push({
            ...results[i],
            ...detailsData.result
          });
        } else {
          // If we can't get details, use the original result
          detailedResults.push(results[i]);
        }
      } catch (detailsError) {
        console.error('Error fetching place details:', detailsError);
        // Continue with the basic result if details fetch fails
        detailedResults.push(results[i]);
      }
    }

    return new Response(
      JSON.stringify({ results: detailedResults.length > 0 ? detailedResults : results }),
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
