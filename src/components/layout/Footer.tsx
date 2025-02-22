import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 border-t border-gray-800">
      <div className="px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-left">
            <h3 className="font-bold text-lg mb-4">About Us</h3>
            <p className="text-gray-400">
              Developed by riders for riders.
            </p>
          </div>
          <div className="text-left">
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-theme-400 transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-theme-400 transition-colors">About</Link></li>
              <li><Link to="/advertise" className="text-gray-400 hover:text-theme-400 transition-colors">Advertise</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-theme-400 transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div className="text-left">
            <h3 className="font-bold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/blog" className="text-gray-400 hover:text-theme-400 transition-colors">Blog</Link></li>
              <li><Link to="/docs" className="text-gray-400 hover:text-theme-400 transition-colors">Documentation</Link></li>
              <li><Link to="/support" className="text-gray-400 hover:text-theme-400 transition-colors">Support</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-theme-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div className="text-left">
            <h3 className="font-bold text-lg mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">Stay updated with our latest valuations.</p>
            <div className="flex gap-2">
              <Input 
                placeholder="Enter your email" 
                className="bg-gray-800 border-gray-700"
              />
              <Button className="button-gradient">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Direct Connected, LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
