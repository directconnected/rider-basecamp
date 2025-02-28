
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { location, type, radius, rankby, fields, keyword, limit = 5, state } = await req.json()

    if (!location || !Array.isArray(location) || location.length !== 2) {
      return new Response(
        JSON.stringify({ error: 'Valid location is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const [lat, lng] = location
    
    // Get the API key
    const GOOGLE_PLACES_API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY')
    
    if (!GOOGLE_PLACES_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'Places API key is missing' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }
    
    // Build the URL for the Places API
    let placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}`
    
    if (type) {
      placesUrl += `&type=${type}`
    }
    
    let adjustedKeyword = keyword;
    // If a state was provided and it's a campground search, include the state in the keyword
    if (state && type === 'campground') {
      adjustedKeyword = keyword ? `${keyword} ${state}` : `campground ${state}`;
    }
    
    if (adjustedKeyword) {
      placesUrl += `&keyword=${encodeURIComponent(adjustedKeyword)}`
    }
    
    // Add ranking if provided
    if (rankby === 'prominence' || rankby === 'distance') {
      placesUrl += `&rankby=${rankby}`
      
      // If rankby=distance, radius cannot be specified
      if (rankby === 'distance') {
        placesUrl = placesUrl.replace(/&radius=\d+/, '')
      }
    }
    
    placesUrl += `&key=${GOOGLE_PLACES_API_KEY}`
    
    console.log(`Making request to: ${placesUrl.replace(GOOGLE_PLACES_API_KEY, 'API_KEY')}`)
    
    // Make the request to the Places API
    const placesResponse = await fetch(placesUrl)
    const placesData = await placesResponse.json()
    
    // If there are no results or an error occurred
    if (placesData.status !== 'OK' || !placesData.results || placesData.results.length === 0) {
      console.log('No places found or API error:', placesData.status)
      return new Response(
        JSON.stringify({ places: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Limit results
    let filteredResults = placesData.results;
    
    // If we're looking for campgrounds in a specific state, try to filter by address
    if (state && type === 'campground') {
      filteredResults = filteredResults.filter(place => {
        const stateAbbr = state.toUpperCase();
        if (place.vicinity) {
          return place.vicinity.includes(`, ${stateAbbr} `) || 
                 place.vicinity.includes(`, ${stateAbbr},`) ||
                 place.vicinity.endsWith(`, ${stateAbbr}`);
        }
        return true; // Keep results without vicinity info
      });
    }
    
    // Limit to requested number
    const limitedResults = filteredResults.slice(0, limit);

    // If fields were specified, get additional details for each place
    if (fields && fields.length > 0) {
      const detailedPlaces = []
      
      // Process each place to get additional details if needed
      for (const place of limitedResults) {
        const basicPlace = {
          name: place.name,
          vicinity: place.vicinity,
          geometry: place.geometry,
          types: place.types,
          rating: place.rating,
          place_id: place.place_id
        }
        
        // Check if we need details like website, phone number, etc.
        const needsDetails = fields.some(field => 
          !basicPlace[field] && ['website', 'formatted_phone_number', 'formatted_address'].includes(field)
        )
        
        if (needsDetails) {
          try {
            // Make additional request to get place details
            const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=${fields.join(',')}&key=${GOOGLE_PLACES_API_KEY}`
            console.log(`Getting details for ${place.name}`)
            
            const detailsResponse = await fetch(detailsUrl)
            const detailsData = await detailsResponse.json()
            
            if (detailsData.status === 'OK' && detailsData.result) {
              // Merge the details with the basic place info
              detailedPlaces.push({
                ...basicPlace,
                ...detailsData.result
              })
            } else {
              detailedPlaces.push(basicPlace)
            }
          } catch (error) {
            console.error(`Error getting details for ${place.name}:`, error)
            detailedPlaces.push(basicPlace)
          }
        } else {
          detailedPlaces.push(basicPlace)
        }
      }
      
      return new Response(
        JSON.stringify({ places: detailedPlaces }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Return the results
    return new Response(
      JSON.stringify({ places: limitedResults }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in find-nearby-places:', error)
    
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
