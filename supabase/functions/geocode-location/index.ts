
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface GeocodeRequest {
  address: string;
  state?: string;
}

interface GeocodeResponse {
  lat?: string;
  lon?: string;
  display_name?: string;
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    // Get the request body
    const requestData = await req.json();
    const { address } = requestData as GeocodeRequest;
    
    if (!address) {
      console.error("Missing address parameter");
      return new Response(
        JSON.stringify({ error: "Address parameter is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log(`Using search query: "${address}"`);
    
    // Get the MapBox token from environment variables
    const MAPBOX_TOKEN = Deno.env.get("MAPBOX_PUBLIC_TOKEN");
    
    if (!MAPBOX_TOKEN) {
      console.error("MAPBOX_PUBLIC_TOKEN environment variable not set");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    // Encode the query for URL
    const encodedQuery = encodeURIComponent(address);
    
    // Build the MapBox Geocoding API URL
    const geocodeUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedQuery}.json?access_token=${MAPBOX_TOKEN}&limit=1`;
    
    // Make the request to MapBox
    const response = await fetch(geocodeUrl);
    
    if (!response.ok) {
      console.error(`Geocoding API error: ${response.status} ${response.statusText}`);
      
      if (response.status === 404) {
        return new Response(
          JSON.stringify({ error: "Location not found", details: "REQUEST_DENIED" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Geocoding service error" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    const geocodingData = await response.json();
    
    // Check if we have features in the response
    if (!geocodingData.features || geocodingData.features.length === 0) {
      console.log("No results found for the location");
      return new Response(
        JSON.stringify({ error: "Location not found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }
    
    // Get the first feature (best match)
    const bestMatch = geocodingData.features[0];
    
    // Extract the coordinates (longitude, latitude)
    const coordinates = bestMatch.center;
    
    // Create the response in the format expected by useAddressSearch.ts
    const geocodeResponse: GeocodeResponse[] = [{
      lon: coordinates[0].toString(),
      lat: coordinates[1].toString(),
      display_name: bestMatch.place_name
    }];
    
    // Return the results
    return new Response(
      JSON.stringify(geocodeResponse),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
    
  } catch (error) {
    console.error(`Error processing request: ${error.message}`);
    
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
