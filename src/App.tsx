
import { BrowserRouter as Router, Routes as RouterRoutes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import AdvertiseWithUs from "@/pages/AdvertiseWithUs";
import Subscribe from "@/pages/Subscribe";
import Auth from "@/pages/Auth";
import MotorcycleDetails from "@/pages/MotorcycleDetails";
import NotFound from "@/pages/NotFound";
import Admin from "@/pages/Admin";
import MotorcycleRoutes from "@/pages/Routes";
import CampingGear from "@/pages/CampingGear";
import RidingGear from "@/pages/RidingGear";
import Data from "@/pages/Data";
import Service from "@/pages/Service";
import Dealers from "@/pages/Dealers";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <RouterRoutes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/advertise" element={<AdvertiseWithUs />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/motorcycle/:id" element={<MotorcycleDetails />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/routes" element={<MotorcycleRoutes />} />
            <Route path="/camping-gear" element={<CampingGear />} />
            <Route path="/riding-gear" element={<RidingGear />} />
            <Route path="/data" element={<Data />} />
            <Route path="/service" element={<Service />} />
            <Route path="/dealers" element={<Dealers />} />
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
