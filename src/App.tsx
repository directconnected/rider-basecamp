
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import AdvertiseWithUs from "@/pages/AdvertiseWithUs";
import Auth from "@/pages/Auth";
import MotorcycleDetails from "@/pages/MotorcycleDetails";
import NotFound from "@/pages/NotFound";
import Admin from "@/pages/Admin";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/advertise" element={<AdvertiseWithUs />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/motorcycle/:id" element={<MotorcycleDetails />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
