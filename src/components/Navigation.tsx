
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-white hover:text-theme-400 transition-colors">
              <Home className="h-5 w-5" />
              <span className="font-bold text-lg">Moto Values</span>
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-4">
            <Link 
              to="/about" 
              className={`text-sm text-white hover:text-theme-400 transition-colors ${
                location.pathname === "/about" ? "text-theme-400" : ""
              }`}
            >
              About
            </Link>
            <Link 
              to="/features" 
              className={`text-sm text-white hover:text-theme-400 transition-colors ${
                location.pathname === "/features" ? "text-theme-400" : ""
              }`}
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className={`text-sm text-white hover:text-theme-400 transition-colors ${
                location.pathname === "/pricing" ? "text-theme-400" : ""
              }`}
            >
              Pricing
            </Link>
            <Link 
              to="/contact" 
              className={`text-sm text-white hover:text-theme-400 transition-colors ${
                location.pathname === "/contact" ? "text-theme-400" : ""
              }`}
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
