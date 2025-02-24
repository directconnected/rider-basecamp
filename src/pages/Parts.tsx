
import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";

const Parts = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Breadcrumbs />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Motorcycle Parts</h1>
        <p className="text-lg text-gray-600 mb-8">
          Find and compare motorcycle parts and accessories for your bike.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Parts content will go here */}
          <div className="p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
            <p className="text-gray-600">
              We're working on bringing you a comprehensive parts comparison and search feature.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Parts;
