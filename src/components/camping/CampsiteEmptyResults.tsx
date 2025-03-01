
import React from "react";
import { FolderX } from "lucide-react";

const CampsiteEmptyResults = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col items-center justify-center max-w-md mx-auto">
          <div className="bg-white p-8 rounded-full mb-6">
            <FolderX className="h-16 w-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            No Campgrounds Found
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't find any campgrounds matching your search criteria. Please try different search terms or broaden your search.
          </p>
          <div className="space-y-4 text-left bg-blue-50 p-4 rounded-lg w-full">
            <h3 className="font-medium text-blue-800">Search Tips:</h3>
            <ul className="list-disc list-inside text-blue-700 space-y-2">
              <li>Check the spelling of your search terms</li>
              <li>Try using a different city or state</li>
              <li>Use fewer search filters</li>
              <li>Try searching by state only</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampsiteEmptyResults;
