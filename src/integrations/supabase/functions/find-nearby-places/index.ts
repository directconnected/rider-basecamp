
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { cors } from '../_shared/cors.ts';

const GOOGLE_MAPS_API_KEY = Deno.env.get('GOOGLE_MAPS_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return cors(req);
  }

  try {
    const { location, type, radius = 5000, rankby = 'rating' } = await req.json();
    
    // Initial nearby search
    const nearbyUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location[0]},${location[1]}&radius=${radius}&type=${type}&key=${GOOGLE_MAPS_API_KEY}`;
    
    const nearbyResponse = await fetch(nearbyUrl);
    const nearbyData = await nearbyResponse.json();

    if (nearbyData.status !== 'OK' || !nearbyData.results.length) {
      return cors(req, {
        status: 200,
        body: JSON.stringify({ places: [] })
      });
    }

    // Get additional details for the first place
    const placeId = nearbyData.results[0].place_id;
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,formatted_phone_number,international_phone_number,website,vicinity,geometry,formatted_address&key=${GOOGLE_MAPS_API_KEY}`;
    
    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    let places = [];
    if (detailsData.status === 'OK') {
      places = [{
        ...nearbyData.results[0],
        ...detailsData.result
      }];
    } else {
      places = [nearbyData.results[0]];
    }

    return cors(req, {
      status: 200,
      body: JSON.stringify({ places })
    });
  } catch (error) {
    return cors(req, {
      status: 500,
      body: JSON.stringify({ error: error.message })
    });
  }
});
