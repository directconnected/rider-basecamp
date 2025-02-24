
import React, { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import RouteForm from "@/components/route-planning/RouteForm";
import RouteDetails from "@/components/route-planning/RouteDetails";
import SuggestedStops from "@/components/route-planning/SuggestedStops";
import RouteMap from "@/components/route-planning/RouteMap";
import RouteItinerary from "@/components/route-planning/RouteItinerary";
import { useRoutePlanning } from "@/hooks/useRoutePlanning";
import { initializeMapbox, geocodeLocation, findPointsOfInterest } from "@/services/mapService";
import { calculateFuelStops, planRoute } from "@/services/routeService";
import mapboxgl from 'mapbox-gl';

const RoutePlanning = () => {
  const {
    isLoading,
    formData,
    routeDetails,
    suggestions,
    currentRoute,
    startCoords,
    endCoords,
    fuelStops,
    handleFormDataChange,
    setIsLoading,
    setRouteDetails,
    setSuggestions,
    setCurrentRoute,
    setStartCoords,
    setEndCoords,
    setFuelStops,
    toast
  } = useRoutePlanning();

  // Debug log to check suggestions
  useEffect(() => {
    console.log('Current suggestions:', suggestions);
  }, [suggestions]);

  const handlePlanRoute = async () => {
    setIsLoading(true);
    try {
      if (!mapboxgl.accessToken) {
        const initialized = await initializeMapbox();
        if (!initialized) {
          toast({
            title: "Map Error",
            description: "Could not initialize the map service. Please try again later.",
            variant: "destructive"
          });
          return;
        }
      }

      const start = await geocodeLocation(formData.startPoint);
      const end = await geocodeLocation(formData.destination);

      if (!start || !end) {
        toast({
          title: "Location Error",
          description: "Could not find one or both locations. Please check your input and try again.",
          variant: "destructive"
        });
        return;
      }

      setStartCoords(start);
      setEndCoords(end);

      const route = await planRoute(start, end);
      
      if (!route?.geometry?.coordinates || route.geometry.coordinates.length === 0) {
        toast({
          title: "Route Error",
          description: "Could not calculate a valid route between these locations.",
          variant: "destructive"
        });
        return;
      }

      setCurrentRoute(route);
      
      // Calculate fuel stops based on motorcycle's fuel mileage
      const fuelMileage = parseInt(formData.fuelMileage);
      const calculatedFuelStops = await calculateFuelStops(route);
      setFuelStops(calculatedFuelStops);

      setRouteDetails({
        distance: Math.round(route.distance / 1609.34),
        duration: Math.round(route.duration / 3600),
        startPoint: formData.startPoint,
        destination: formData.destination
      });

      // Calculate daily stops based on miles per day
      const totalMiles = Math.round(route.distance / 1609.34);
      const milesPerDay = parseInt(formData.milesPerDay);
      const numDays = Math.ceil(totalMiles / milesPerDay);
      const coordinates = route.geometry.coordinates;
      
      // Generate suggestions for each day of travel
      const sampleSuggestions = [];
      
      // Safety check to ensure we have enough coordinates
      if (coordinates.length >= numDays) {
        for (let day = 1; day <= numDays; day++) {
          const progress = day / numDays;
          const stopIndex = Math.floor(coordinates.length * progress);
          
          if (stopIndex < coordinates.length && coordinates[stopIndex]?.length >= 2) {
            // Add a hotel option for each day's end
            sampleSuggestions.push({
              name: `Day ${day} Hotel Option`,
              type: "hotel" as const,
              location: [
                coordinates[stopIndex][0],
                coordinates[stopIndex][1]
              ] as [number, number],
              description: `Lodging option after day ${day} (${Math.round(progress * totalMiles)} miles)`
            });

            // Add a camping option for each day's end
            sampleSuggestions.push({
              name: `Day ${day} Camping Option`,
              type: "camping" as const,
              location: [
                coordinates[stopIndex][0],
                coordinates[stopIndex][1]
              ] as [number, number],
              description: `Camping option after day ${day} (${Math.round(progress * totalMiles)} miles)`
            });

            // Add a restaurant suggestion for lunch
            if (day < numDays) {
              const lunchProgress = (day - 0.5) / numDays;
              const lunchIndex = Math.floor(coordinates.length * lunchProgress);
              
              if (lunchIndex < coordinates.length && coordinates[lunchIndex]?.length >= 2) {
                sampleSuggestions.push({
                  name: `Day ${day} Lunch Stop`,
                  type: "restaurant" as const,
                  location: [
                    coordinates[lunchIndex][0],
                    coordinates[lunchIndex][1]
                  ] as [number, number],
                  description: `Lunch stop on day ${day} (${Math.round(lunchProgress * totalMiles)} miles)`
                });
              }
            }
          }
        }
      }

      console.log('Setting sample suggestions:', sampleSuggestions);
      setSuggestions(sampleSuggestions);

      toast({
        title: "Route Planned",
        description: "Your route has been planned with suggested stops and fuel stops.",
      });
    } catch (error) {
      console.error("Route planning error:", error);
      toast({
        title: "Error",
        description: `There was an error planning your route: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Breadcrumbs />
      
      <main className="flex-1">
        <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Route Planning
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Plan your next motorcycle adventure
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <RouteForm 
                formData={formData}
                isLoading={isLoading}
                onFormDataChange={handleFormDataChange}
                onPlanRoute={handlePlanRoute}
              />
              
              {routeDetails && startCoords && endCoords && currentRoute && (
                <>
                  <RouteDetails 
                    startPoint={routeDetails.startPoint}
                    destination={routeDetails.destination}
                    distance={routeDetails.distance}
                    duration={routeDetails.duration}
                  />
                  <RouteMap
                    startCoords={startCoords}
                    endCoords={endCoords}
                    route={currentRoute}
                    fuelStops={fuelStops}
                  />
                  <RouteItinerary
                    startPoint={routeDetails.startPoint}
                    destination={routeDetails.destination}
                    distance={routeDetails.distance}
                    duration={routeDetails.duration}
                    fuelStops={fuelStops}
                  />
                  {/* Force render suggestions with debug info */}
                  <div>
                    <SuggestedStops suggestions={suggestions} />
                    {suggestions && suggestions.length > 0 ? (
                      <p className="text-xs text-gray-500 mt-2">Suggestions loaded: {suggestions.length}</p>
                    ) : (
                      <p className="text-xs text-gray-500 mt-2">No suggestions available</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default RoutePlanning;
