
import React from "react";
import { CampgroundResult } from "@/hooks/camping/types";
import CampsiteCard from "./CampsiteCard";
import CampsiteLoadingSkeleton from "./CampsiteLoadingSkeleton";
import CampsiteEmptyResults from "./CampsiteEmptyResults";
import CampsitePagination from "./CampsitePagination";

interface CampsiteSearchResultsProps {
  results: CampgroundResult[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

const CampsiteSearchResults = ({
  results,
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
}: CampsiteSearchResultsProps) => {
  if (isLoading) {
    return <CampsiteLoadingSkeleton />;
  }

  if (results.length === 0) {
    return <CampsiteEmptyResults />;
  }

  // Calculate the results for the current page
  const ITEMS_PER_PAGE = 12;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedResults = results.slice(startIndex, endIndex);

  return (
    <section className="py-12 bg-gray-50" id="search-results">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Found {results.length} Campgrounds
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedResults.map((campsite, index) => (
            <CampsiteCard key={index} campsite={campsite} />
          ))}
        </div>

        <CampsitePagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </section>
  );
};

export default CampsiteSearchResults;
