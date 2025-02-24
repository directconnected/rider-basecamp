
import React from "react";
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
  } = useRoutePlanning();

  const { calculateRoute } = useRouteCalculation();

  const handlePlanRoute = async () => {
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
                onFormDataChange={handleFormDataChange}
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
