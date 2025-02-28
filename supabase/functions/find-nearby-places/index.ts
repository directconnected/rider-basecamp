
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'

const GOOGLE_PLACES_API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY') || '';

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
    // Parse request body
    const { location, type, radius, rankby, fields, keyword, limit = 60 } = await req.json();

    if (!location || !Array.isArray(location) || location.length !== 2) {
      return new Response(
        JSON.stringify({ error: 'Invalid location. Must be an array of [latitude, longitude]' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (!type) {
      return new Response(
        JSON.stringify({ error: 'Type parameter is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Construct Places API URL
    const baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
    const locationParam = `${location[0]},${location[1]}`;
    
    let url = `${baseUrl}?location=${locationParam}&type=${type}&key=${GOOGLE_PLACES_API_KEY}`;
    
    // Add either radius or rankby parameter (they are mutually exclusive)
    if (rankby && rankby === 'distance') {
      url += `&rankby=distance`;
    } else {
      url += `&radius=${radius || 5000}`;
    }
    
    if (keyword) {
      url += `&keyword=${encodeURIComponent(keyword)}`;
    }

    console.log('Sending request to Google Places API:', url.replace(GOOGLE_PLACES_API_KEY, '[API_KEY]'));

    // Fetch places data
    const response = await fetch(url);
    const data = await response.json();

    // Check for API errors
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Google Places API error:', data.status, data.error_message);
      return new Response(
        JSON.stringify({ error: `Google Places API error: ${data.status}`, details: data.error_message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    let places = data.results || [];
    let nextPageToken = data.next_page_token;
    
    // If we have a limit and there's more pages, fetch additional pages up to the limit
    if (limit > 20 && nextPageToken && places.length < limit) {
      // Get second page and possibly third page to reach the limit
      let attempts = 0;
      const maxPages = Math.ceil(limit / 20);
      
      while (nextPageToken && places.length < limit && attempts < maxPages - 1) {
        // Need to wait a bit before using the pagetoken
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const nextPageUrl = `${baseUrl}?pagetoken=${nextPageToken}&key=${GOOGLE_PLACES_API_KEY}`;
        console.log('Fetching next page of results');
        
        const nextPageResponse = await fetch(nextPageUrl);
        const nextPageData = await nextPageResponse.json();
        
        if (nextPageData.status === 'OK') {
          places = [...places, ...nextPageData.results];
          nextPageToken = nextPageData.next_page_token;
        } else {
          console.error('Error fetching next page:', nextPageData.status);
          break;
        }
        
        attempts++;
      }
    }
    
    console.log(`Found ${places.length} places of type ${type}`);

    // If we have specific fields to return, get the details for each place
    if (fields && fields.length > 0 && fields.some(f => !['name', 'vicinity', 'geometry'].includes(f))) {
      console.log(`Fetching details for ${Math.min(places.length, limit)} places with fields:`, fields);
      
      const detailedPlaces = [];
      const detailFields = fields.join(',');
      
      // Only fetch details for places up to the limit
      for (let i = 0; i < Math.min(places.length, limit); i++) {
        const place = places[i];
        try {
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=${detailFields}&key=${GOOGLE_PLACES_API_KEY}`;
          const detailsResponse = await fetch(detailsUrl);
          const detailsData = await detailsResponse.json();
          
          if (detailsData.status === 'OK' && detailsData.result) {
            // Merge the basic place data with the detailed data
            detailedPlaces.push({
              ...place,
              ...detailsData.result
            });
          } else {
            detailedPlaces.push(place);
          }
        } catch (error) {
          console.error('Error fetching place details:', error);
          detailedPlaces.push(place);
        }
      }
      
      places = detailedPlaces;
    } else {
      // If no detailed fields requested, just enforce the limit
      places = places.slice(0, limit);
    }

    return new Response(
      JSON.stringify({ places }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
})
