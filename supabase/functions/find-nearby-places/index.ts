
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders, cors } from "../_shared/cors.ts"

const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY')

interface PlaceResult {
  name: string;
  vicinity?: string;
  formatted_address?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    }
  };
  rating?: number;
  website?: string;
  formatted_phone_number?: string;
  international_phone_number?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { location, type, radius = 5000, rankby = 'rating' } = await req.json()
    
    // Initial nearby search with expanded radius
    const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location[0]},${location[1]}&radius=${radius}&type=${type}&key=${GOOGLE_MAPS_API_KEY}`
    
    console.log(`Searching for ${type} at location:`, location, `with radius: ${radius}m`)
    const nearbyResponse = await fetch(nearbyUrl)
    const nearbyData = await nearbyResponse.json()

    if (nearbyData.status === 'ZERO_RESULTS' || !nearbyData.results?.length) {
      console.log(`No ${type} found in initial search, trying with larger radius`)
      // Try with a larger radius
      const largerRadius = radius * 2
      const retryUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location[0]},${location[1]}&radius=${largerRadius}&type=${type}&key=${GOOGLE_MAPS_API_KEY}`
      const retryResponse = await fetch(retryUrl)
      const retryData = await retryResponse.json()
      
      if (retryData.status === 'ZERO_RESULTS' || !retryData.results?.length) {
        console.log(`No ${type} found even with larger radius`)
        return cors(req, {
          status: 200,
          body: JSON.stringify({ places: [] })
        })
      }
      nearbyData.results = retryData.results
    }

    // Get details for the first place found
    const place = nearbyData.results[0]
    const placeId = place.place_id
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,formatted_phone_number,international_phone_number,website,vicinity,geometry,formatted_address&key=${GOOGLE_MAPS_API_KEY}`
    
    console.log('Fetching details for place:', place.name)
    const detailsResponse = await fetch(detailsUrl)
    const detailsData = await detailsResponse.json()

    let result: PlaceResult
    if (detailsData.status === 'OK' && detailsData.result) {
      result = {
        ...place,
        ...detailsData.result
      }
      console.log('Successfully got place details:', {
        name: result.name,
        hasPhone: !!result.formatted_phone_number,
        hasWebsite: !!result.website
      })
    } else {
      result = place
      console.log('Using basic place info without details')
    }

    return cors(req, {
      status: 200,
      body: JSON.stringify({
        places: [{
          name: result.name,
          vicinity: result.vicinity || result.formatted_address,
          geometry: result.geometry,
          rating: result.rating,
          website: result.website,
          formatted_phone_number: result.formatted_phone_number || result.international_phone_number
        }]
      })
    })
  } catch (error) {
    console.error('Error in find-nearby-places:', error)
    return cors(req, {
      status: 500,
      body: JSON.stringify({ error: error.message })
    })
  }
})
