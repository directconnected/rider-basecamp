
import React from "react";
import { CampgroundResult } from "@/hooks/useCampsiteSearch";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Globe, Star } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

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

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Found {results.length} Campgrounds
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedResults.map((campsite, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-gray-900">{campsite.name}</h3>
                  <Badge variant="outline" className="bg-gray-100">
                    campground
                  </Badge>
                </div>
                
                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                  <span>{campsite.address}</span>
                </div>
                
                {campsite.distance !== undefined && (
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">{campsite.distance} miles</span> from search location
                  </div>
                )}
                
                {campsite.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{campsite.rating.toFixed(1)}</span>
                  </div>
                )}
                
                <div className="space-y-2 pt-2">
                  {campsite.phone_number && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <a href={`tel:${campsite.phone_number}`} className="hover:text-theme-600">
                        {campsite.phone_number}
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
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <nav className="inline-flex">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => onPageChange(i + 1)}
                  className={`px-3 py-1 mx-1 rounded ${
                    currentPage === i + 1
                      ? "bg-theme-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </section>
  );
};

export default CampsiteSearchResults;
