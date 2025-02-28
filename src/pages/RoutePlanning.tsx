
import React, { useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import RouteForm from "@/components/route-planning/RouteForm";
import RouteHeader from "@/components/route-planning/RouteHeader";
import RouteResults from "@/components/route-planning/RouteResults";
import { useRoutePlanning } from "@/hooks/useRoutePlanning";
import { useRouteCalculation } from "@/hooks/useRouteCalculation";

const RoutePlanning = () => {
  const {
    isLoading,
    formData,
    routeDetails,
    currentRoute,
    startCoords,
    endCoords,
    fuelStops,
    hotelStops,
    handleFormDataChange,
    setIsLoading,
    setRouteDetails,
    setCurrentRoute,
    setStartCoords,
    setEndCoords,
    setFuelStops,
    setHotelStops,
    resetResults,
  } = useRoutePlanning();

  const { calculateRoute } = useRouteCalculation();

  // Store preferences in localStorage when they change
  useEffect(() => {
    if (formData.preferredLodging) {
      localStorage.setItem('preferredLodging', formData.preferredLodging);
      console.log('Saved preferredLodging to localStorage:', formData.preferredLodging);
    }
    if (formData.preferredRestaurant) {
      localStorage.setItem('preferredRestaurant', formData.preferredRestaurant);
      console.log('Saved preferredRestaurant to localStorage:', formData.preferredRestaurant);
    }
    if (formData.preferredAttraction) {
      localStorage.setItem('preferredAttraction', formData.preferredAttraction);
      console.log('Saved preferredAttraction to localStorage:', formData.preferredAttraction);
    }
  }, [formData.preferredLodging, formData.preferredRestaurant, formData.preferredAttraction]);

  // Handle recalculating route when preferences change and a route is displayed
  useEffect(() => {
    const shouldRefreshRoute = 
      currentRoute && 
      (localStorage.getItem('forceRefresh') === 'true' || 
       localStorage.getItem('preferencesChanged') === 'true');
    
    if (shouldRefreshRoute) {
      console.log('Preferences changed, refreshing results');
      localStorage.setItem('forceRefresh', 'false');
      localStorage.setItem('preferencesChanged', 'false');
      
      // Only trigger recalculation if we're not already loading
      if (!isLoading) {
        resetResults();
        handlePlanRoute();
      }
    }
  }, [currentRoute, isLoading]);

  const handlePlanRoute = async () => {
    // Set flag for preference changes
    localStorage.setItem('preferencesChanged', 'true');
    
    await calculateRoute(formData, {
      setIsLoading,
      setStartCoords,
      setEndCoords,
      setCurrentRoute,
      setFuelStops,
      setHotelStops,
      setRouteDetails,
    });
  };

  // Update handlers to trigger recalculation
  const handlePreferenceChange = (updatedFormData: any) => {
    localStorage.setItem('preferencesChanged', 'true');
    handleFormDataChange(updatedFormData);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Breadcrumbs />
      
      <main className="flex-1">
        <RouteHeader />

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <RouteForm 
                formData={formData}
                isLoading={isLoading}
                onFormDataChange={handlePreferenceChange}
                onPlanRoute={handlePlanRoute}
              />
              
              {routeDetails && startCoords && endCoords && currentRoute && (
                <RouteResults 
                  routeDetails={routeDetails}
                  startCoords={startCoords}
                  endCoords={endCoords}
                  currentRoute={currentRoute}
                  fuelStops={fuelStops}
                  hotelStops={hotelStops}
                  key={`route-results-${formData.preferredLodging}-${formData.preferredRestaurant}-${formData.preferredAttraction}`} 
                />
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
