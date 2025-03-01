
import React from "react";
import { MapPin } from "lucide-react";

const CampsiteEmptyResults = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col items-center mb-4">
          <MapPin className="h-12 w-12 text-gray-400 mb-2" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Campgrounds Found</h2>
          <p className="text-gray-600 max-w-lg mx-auto">
            We couldn't find any campgrounds matching your search criteria. Please try adjusting your search parameters or try a different location.
          </p>
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg max-w-2xl mx-auto">
          <h3 className="text-md font-medium text-blue-700 mb-2">Search Tips:</h3>
          <ul className="text-sm text-gray-700 text-left list-disc pl-5 space-y-1">
            <li>For states, use the two-letter abbreviation (e.g., "PA" for Pennsylvania)</li>
            <li>Double-check your spelling</li>
            <li>Try broadening your search by using fewer filters</li>
            <li>Search for a nearby city or zip code instead</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default CampsiteEmptyResults;
