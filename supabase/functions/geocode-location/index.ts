
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

interface GeocodeResult {
  location: {
    lat: number;
    lng: number;
  };
  formatted_address: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { location } = await req.json()

    if (!location) {
      return new Response(
        JSON.stringify({ error: 'Location is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
    
    // Get Google Places API key from environment
    const GOOGLE_PLACES_API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY')
    
    if (!GOOGLE_PLACES_API_KEY) {
      console.log('API key missing, using fallback method');
      
      // Fallback method - basic geocoding for US states
      const stateMappings: Record<string, {lat: number, lng: number}> = {
        'AL': { lat: 32.806671, lng: -86.791130 },
        'AK': { lat: 61.370716, lng: -152.404419 },
        'AZ': { lat: 33.729759, lng: -111.431221 },
        'AR': { lat: 34.969704, lng: -92.373123 },
        'CA': { lat: 36.116203, lng: -119.681564 },
        'CO': { lat: 39.059811, lng: -105.311104 },
        'CT': { lat: 41.597782, lng: -72.755371 },
        'DE': { lat: 39.318523, lng: -75.507141 },
        'FL': { lat: 27.766279, lng: -81.686783 },
        'GA': { lat: 33.040619, lng: -83.643074 },
        'HI': { lat: 21.094318, lng: -157.498337 },
        'ID': { lat: 44.240459, lng: -114.478828 },
        'IL': { lat: 40.349457, lng: -88.986137 },
        'IN': { lat: 39.849426, lng: -86.258278 },
        'IA': { lat: 42.011539, lng: -93.210526 },
        'KS': { lat: 38.526600, lng: -96.726486 },
        'KY': { lat: 37.668140, lng: -84.670067 },
        'LA': { lat: 31.169546, lng: -91.867805 },
        'ME': { lat: 44.693947, lng: -69.381927 },
        'MD': { lat: 39.063946, lng: -76.802101 },
        'MA': { lat: 42.230171, lng: -71.530106 },
        'MI': { lat: 43.326618, lng: -84.536095 },
        'MN': { lat: 45.694454, lng: -93.900192 },
        'MS': { lat: 32.741646, lng: -89.678696 },
        'MO': { lat: 38.456085, lng: -92.288368 },
        'MT': { lat: 46.921925, lng: -110.454353 },
        'NE': { lat: 41.125370, lng: -98.268082 },
        'NV': { lat: 38.313515, lng: -117.055374 },
        'NH': { lat: 43.452492, lng: -71.563896 },
        'NJ': { lat: 40.298904, lng: -74.521011 },
        'NM': { lat: 34.840515, lng: -106.248482 },
        'NY': { lat: 42.165726, lng: -74.948051 },
        'NC': { lat: 35.630066, lng: -79.806419 },
        'ND': { lat: 47.528912, lng: -99.784012 },
        'OH': { lat: 40.388783, lng: -82.764915 },
        'OK': { lat: 35.565342, lng: -96.928917 },
        'OR': { lat: 44.572021, lng: -122.070938 },
        'PA': { lat: 40.590752, lng: -77.209755 },
        'RI': { lat: 41.680893, lng: -71.511780 },
        'SC': { lat: 33.856892, lng: -80.945007 },
        'SD': { lat: 44.299782, lng: -99.438828 },
        'TN': { lat: 35.747845, lng: -86.692345 },
        'TX': { lat: 31.054487, lng: -97.563461 },
        'UT': { lat: 40.150032, lng: -111.862434 },
        'VT': { lat: 44.045876, lng: -72.710686 },
        'VA': { lat: 37.769337, lng: -78.169968 },
        'WA': { lat: 47.400902, lng: -121.490494 },
        'WV': { lat: 38.491226, lng: -80.954453 },
        'WI': { lat: 44.268543, lng: -89.616508 },
        'WY': { lat: 42.755966, lng: -107.302490 }
      };
      
      // Try to match state abbreviation or name
      const upperLocation = location.toUpperCase();
      let stateMatch = null;
      
      // Try exact match on abbreviation
      if (stateMappings[upperLocation]) {
        stateMatch = stateMappings[upperLocation];
      } else {
        // Try to find state mentioned in the string
        for (const [abbr, coords] of Object.entries(stateMappings)) {
          if (upperLocation.includes(' ' + abbr + ' ') || 
              upperLocation.endsWith(' ' + abbr) || 
              upperLocation.startsWith(abbr + ' ')) {
            stateMatch = coords;
            break;
          }
        }
        
        // Check for state full names
        const stateNames: Record<string, string> = {
          'ALABAMA': 'AL', 'ALASKA': 'AK', 'ARIZONA': 'AZ', 'ARKANSAS': 'AR',
          'CALIFORNIA': 'CA', 'COLORADO': 'CO', 'CONNECTICUT': 'CT',
          'DELAWARE': 'DE', 'FLORIDA': 'FL', 'GEORGIA': 'GA', 'HAWAII': 'HI',
          'IDAHO': 'ID', 'ILLINOIS': 'IL', 'INDIANA': 'IN', 'IOWA': 'IA',
          'KANSAS': 'KS', 'KENTUCKY': 'KY', 'LOUISIANA': 'LA', 'MAINE': 'ME',
          'MARYLAND': 'MD', 'MASSACHUSETTS': 'MA', 'MICHIGAN': 'MI',
          'MINNESOTA': 'MN', 'MISSISSIPPI': 'MS', 'MISSOURI': 'MO',
          'MONTANA': 'MT', 'NEBRASKA': 'NE', 'NEVADA': 'NV',
          'NEW HAMPSHIRE': 'NH', 'NEW JERSEY': 'NJ', 'NEW MEXICO': 'NM',
          'NEW YORK': 'NY', 'NORTH CAROLINA': 'NC', 'NORTH DAKOTA': 'ND',
          'OHIO': 'OH', 'OKLAHOMA': 'OK', 'OREGON': 'OR', 'PENNSYLVANIA': 'PA',
          'RHODE ISLAND': 'RI', 'SOUTH CAROLINA': 'SC', 'SOUTH DAKOTA': 'SD',
          'TENNESSEE': 'TN', 'TEXAS': 'TX', 'UTAH': 'UT', 'VERMONT': 'VT',
          'VIRGINIA': 'VA', 'WASHINGTON': 'WA', 'WEST VIRGINIA': 'WV',
          'WISCONSIN': 'WI', 'WYOMING': 'WY'
        };
        
        for (const [name, abbr] of Object.entries(stateNames)) {
          if (upperLocation.includes(name)) {
            stateMatch = stateMappings[abbr];
            break;
          }
        }
      }
      
      if (stateMatch) {
        return new Response(
          JSON.stringify({
            location: stateMatch,
            formatted_address: location
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Default fallback to Pennsylvania
      return new Response(
        JSON.stringify({
          location: { lat: 40.590752, lng: -77.209755 },
          formatted_address: 'Pennsylvania, USA'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Geocode the location
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${GOOGLE_PLACES_API_KEY}`
    console.log(`Making geocode request to: ${geocodeUrl.replace(GOOGLE_PLACES_API_KEY, 'API_KEY')}`)
    
    const geocodeResponse = await fetch(geocodeUrl)
    const geocodeData = await geocodeResponse.json()
    
    console.log('Geocode response status:', geocodeData.status)
    
    if (geocodeData.status !== 'OK' || !geocodeData.results || geocodeData.results.length === 0) {
      console.log('Geocode error, falling back to default coords')
      return new Response(
        JSON.stringify({ 
          location: { lat: 40.590752, lng: -77.209755 },
          formatted_address: 'Pennsylvania, USA'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Extract the coordinates and formatted address
    const result: GeocodeResult = {
      location: geocodeData.results[0].geometry.location,
      formatted_address: geocodeData.results[0].formatted_address
    }
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in geocode-location:', error)
    
    // Return fallback coordinates for Pennsylvania as a last resort
    return new Response(
      JSON.stringify({ 
        location: { lat: 40.590752, lng: -77.209755 },
        formatted_address: 'Pennsylvania, USA',
        fallback: true
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
