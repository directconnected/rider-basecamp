
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const location = useLocation();

  return (
    <header className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-white hover:text-theme-400 transition-colors">
              <Home className="h-5 w-5" />
              <span className="font-bold text-lg">Rider Basecamp</span>
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
              to="/advertise" 
              className={`text-sm text-white hover:text-theme-400 transition-colors ${
                location.pathname === "/advertise" ? "text-theme-400" : ""
              }`}
            >
              Advertise
            </Link>
            <Link 
              to="/contact" 
              className={`text-sm text-white hover:text-theme-400 transition-colors ${
                location.pathname === "/contact" ? "text-theme-400" : ""
              }`}
            >
              Contact
            </Link>
            <Link to="/subscribe">
              <Button 
                variant="default" 
                size="sm"
                className="ml-4 bg-theme-500 hover:bg-theme-600"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
