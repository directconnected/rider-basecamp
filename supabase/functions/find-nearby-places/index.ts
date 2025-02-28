
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const GOOGLE_PLACES_API_KEY = Deno.env.get("GOOGLE_PLACES_API_KEY") || "";
if (!GOOGLE_PLACES_API_KEY) {
  console.error("GOOGLE_PLACES_API_KEY environment variable is not set");
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { location, type, radius, rankby, fields, keyword } = await req.json();

    if (!location || !Array.isArray(location) || location.length !== 2) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid location format. Expected [latitude, longitude]" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    if (!type) {
      return new Response(
        JSON.stringify({ 
          error: "Missing place type parameter" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Construct the request URL for Google Places API Nearby Search
    const [lat, lng] = location;
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&type=${type}&key=${GOOGLE_PLACES_API_KEY}`;

    // Add radius if not using rankby=distance
    if (radius) {
      url += `&radius=${radius}`;
    }

    // Add keyword if specified
    if (keyword) {
      url += `&keyword=${encodeURIComponent(keyword)}`;
    }

    console.log(`Making Places API request: ${url.replace(GOOGLE_PLACES_API_KEY, "API_KEY")}`);

    // Make the request to Google Places API
    const placesResponse = await fetch(url);
    const placesData = await placesResponse.json();

    if (placesResponse.status !== 200 || placesData.status !== "OK") {
      const errorMsg = placesData.error_message || placesData.status || "Unknown error";
      console.error(`Google Places API error: ${errorMsg}`);
      return new Response(
        JSON.stringify({ error: `Places API error: ${errorMsg}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // If we have results, get details for the top result
    if (placesData.results && placesData.results.length > 0) {
      // Sort by rating if rankby=rating
      if (rankby === "rating") {
        placesData.results.sort((a: any, b: any) => {
          // Place results with ratings at the top
          if (a.rating && !b.rating) return -1;
          if (!a.rating && b.rating) return 1;
          // Then sort by rating value
          return (b.rating || 0) - (a.rating || 0);
        });
      }

      // Get place details for all requested fields
      const topPlaces = placesData.results.slice(0, 3);
      const detailedPlaces = [];

      for (const place of topPlaces) {
        const placeId = place.place_id;
        
        // If fields were specified, get additional place details
        if (fields && fields.length > 0) {
          const fieldsParam = fields.join(",");
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${fieldsParam}&key=${GOOGLE_PLACES_API_KEY}`;
          
          try {
            const detailsResponse = await fetch(detailsUrl);
            const detailsData = await detailsResponse.json();
            
            if (detailsResponse.status === 200 && detailsData.status === "OK") {
              // Merge basic data with detailed data
              detailedPlaces.push({
                ...place,
                ...detailsData.result
              });
            } else {
              // Fall back to basic data if details request fails
              detailedPlaces.push(place);
              console.warn(`Failed to get details for place ${placeId}: ${detailsData.status}`);
            }
          } catch (detailsError) {
            detailedPlaces.push(place);
            console.error(`Error fetching place details: ${detailsError}`);
          }
        } else {
          detailedPlaces.push(place);
        }
      }

      return new Response(
        JSON.stringify({ places: detailedPlaces }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Return empty result if no places found
    return new Response(
      JSON.stringify({ places: [] }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(`Error processing request: ${error}`);
    return new Response(
      JSON.stringify({ error: `Internal server error: ${error.message}` }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
