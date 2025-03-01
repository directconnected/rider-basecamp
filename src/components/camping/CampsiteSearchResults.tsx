import React from "react";
import { CampgroundResult } from "@/hooks/camping/types";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Globe } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (results.length === 0) {
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
  }

  // Calculate the results for the current page
  const ITEMS_PER_PAGE = 12;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedResults = results.slice(startIndex, endIndex);

  // Function to generate an array of page numbers to display
  const getPageNumbers = () => {
    // For large number of pages, show a window of 5 pages around current page
    const MAX_VISIBLE_PAGES = 5;
    
    if (totalPages <= MAX_VISIBLE_PAGES) {
      // If there are fewer pages than the maximum visible, show all of them
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Otherwise, create a window around the current page
    let startPage = Math.max(1, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
    let endPage = startPage + MAX_VISIBLE_PAGES - 1;
    
    // Adjust if the end goes beyond the total
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - MAX_VISIBLE_PAGES + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  return (
    <section className="py-12 bg-gray-50" id="search-results">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Found {results.length} Campgrounds
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedResults.map((campsite, index) => {
            // Default campground type
            const campType = "Standard";
            
            // Format location information
            const location = [
              campsite.city,
              campsite.state,
              campsite.zip_code
            ].filter(Boolean).join(", ");
            
            return (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-xl font-bold text-gray-900 flex-1">{campsite.campground_name}</h3>
                    <Badge variant="outline" className="bg-gray-100 whitespace-nowrap">
                      {campType}
                    </Badge>
                  </div>
                  
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                    <span>{campsite.address_1}</span>
                  </div>
                  
                  {location && (
                    <div className="flex items-start gap-2 text-gray-600">
                      <MapPin className="h-4 w-4 mt-1 flex-shrink-0 opacity-0" />
                      <span>{location}</span>
                    </div>
                  )}
                  
                  {campsite.gps_coordinates && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">GPS:</span> {campsite.gps_coordinates}
                    </div>
                  )}

                  <Separator className="my-2" />
                  
                  <div className="space-y-2 pt-1">
                    {campsite.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4" />
                        <a href={`tel:${campsite.phone}`} className="hover:text-theme-600">
                          {campsite.phone}
                        </a>
                      </div>
                    )}
                    
                    {campsite.website && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Globe className="h-4 w-4" />
                        <a 
                          href={campsite.website.startsWith('http') ? campsite.website : `http://${campsite.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:text-theme-600"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                    
                    {campsite.email && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="text-sm">📧</span>
                        <a 
                          href={`mailto:${campsite.email}`} 
                          className="hover:text-theme-600"
                        >
                          {campsite.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <div className="overflow-x-auto py-2 max-w-full">
              <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {/* Show first page if not in view */}
                {totalPages > 5 && currentPage > 3 && (
                  <>
                    <button
                      onClick={() => onPageChange(1)}
                      className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      1
                    </button>
                    {currentPage > 4 && (
                      <span className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                      </span>
                    )}
                  </>
                )}
                
                {/* Page numbers */}
                {getPageNumbers().map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === pageNum
                        ? "z-10 bg-theme-600 border-theme-600 text-white"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
                
                {/* Show last page if not in view */}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && (
                      <span className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                      </span>
                    )}
                    <button
                      onClick={() => onPageChange(totalPages)}
                      className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
                
                <button
                  onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CampsiteSearchResults;
