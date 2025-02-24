
import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

const Rentals = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Breadcrumbs />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Motorcycle Rentals</h1>
        <p className="text-lg text-gray-600 mb-8">
          Find motorcycle rentals and compare prices in your area.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Rentals content will go here */}
          <div className="p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
            <p className="text-gray-600">
              We're working on bringing you motorcycle rental listings and comparisons.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Rentals;
