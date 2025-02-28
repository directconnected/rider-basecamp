
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

interface GeocodeRequest {
  location: string;
  state?: string;
}

interface GeocodeResponse {
  location?: {
    lat: number;
    lng: number;
  };
  address?: string;
  error?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    // Get the request body
    const { location, state } = await req.json() as GeocodeRequest;
    
    if (!location) {
      return new Response(
        JSON.stringify({ error: "Location required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log(`Using search query: "${location}"`);
    
    // Build the search query
    let searchQuery = location;
    
    // If there's a state and it's not already in the location string,
    // append it to improve geocoding accuracy
    if (state && !location.toLowerCase().includes(state.toLowerCase())) {
      searchQuery = `${location}, ${state}`;
    }
    
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
    const encodedQuery = encodeURIComponent(searchQuery);
    
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
    
    // Create the response object
    const geocodeResponse: GeocodeResponse = {
      location: {
        lng: coordinates[0],
        lat: coordinates[1]
      },
      address: bestMatch.place_name
    };
    
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
