
import React from "react";
import { BrowserRouter as Router, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeConfig } from "@/config/routeConfig";

// Import standard pages not included in routeConfig
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import AdvertiseWithUs from "@/pages/AdvertiseWithUs";
import Subscribe from "@/pages/Subscribe";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import Admin from "@/pages/Admin";
import AdminLogin from "@/pages/AdminLogin";
import AdminSignup from "@/pages/AdminSignup";
import ProtectedAdminRoute from "@/components/admin/ProtectedAdminRoute";
import RidingGear from "@/pages/RidingGear";
import Dealers from "@/pages/Dealers";
import TopRoads from "@/pages/TopRoads";
import ScenicByways from "@/pages/ScenicByways";
import RoutePlanning from "@/pages/RoutePlanning";
import GpxDownloads from "@/pages/GpxDownloads";
import FeaturedDestinations from "@/pages/FeaturedDestinations";
import Blog from "@/pages/Blog";
import Documentation from "@/pages/Documentation";
import Support from "@/pages/Support";
import TermsOfService from "@/pages/TermsOfService";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import ServiceLanding from "@/pages/ServiceLanding";
import Parts from "@/pages/Parts";
import GroupRides from "@/pages/GroupRides";
import Rentals from "@/pages/Rentals";
import News from "@/pages/News";
import Tents from "@/pages/Tents";
import Campgrounds from "@/pages/Campgrounds";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <RouterRoutes>
            {/* Routes from routeConfig */}
            {routeConfig.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<route.element />}
              />
            ))}
            
            {/* Redirect from /service to /service-records */}
            <Route path="/service" element={<Navigate to="/service-records" replace />} />
            
            {/* Routes not included in routeConfig */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/advertise" element={<AdvertiseWithUs />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin/signup" 
              element={
                <ProtectedAdminRoute>
                  <AdminSignup />
                </ProtectedAdminRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedAdminRoute>
                  <Admin />
                </ProtectedAdminRoute>
              } 
            />
            <Route path="/service-landing" element={<ServiceLanding />} />
            <Route path="/riding-gear" element={<RidingGear />} />
            <Route path="/dealers" element={<Dealers />} />
            <Route path="/top-roads" element={<TopRoads />} />
            <Route path="/scenic-byways" element={<ScenicByways />} />
            <Route path="/route-planning" element={<RoutePlanning />} />
            <Route path="/gpx-downloads" element={<GpxDownloads />} />
            <Route path="/featured-destinations" element={<FeaturedDestinations />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="/support" element={<Support />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/parts" element={<Parts />} />
            <Route path="/group-rides" element={<GroupRides />} />
            <Route path="/rentals" element={<Rentals />} />
            <Route path="/news" element={<News />} />
            <Route path="/tents" element={<Tents />} />
            <Route path="/campgrounds" element={<Campgrounds />} />
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
          <Toaster />
          <Sonner position="top-center" />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
