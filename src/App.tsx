
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import VINLookup from "@/pages/VINLookup";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/advertise" element={<AdvertiseWithUs />} />
            <Route path="/subscribe" element={<Subscribe />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/motorcycle/:id" element={<MotorcycleDetails />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/vin-lookup" element={<VINLookup />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <Sonner />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
