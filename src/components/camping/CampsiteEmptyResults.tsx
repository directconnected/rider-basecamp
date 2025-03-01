
import React from "react";

const CampsiteEmptyResults = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">No Results Found</h2>
        <p className="text-gray-600">
          Please try another search or adjust your filters.
        </p>
      </div>
    </section>
  );
};

export default CampsiteEmptyResults;
