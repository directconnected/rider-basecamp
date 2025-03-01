
import React from "react";
import { CampgroundResult } from "@/hooks/camping/types";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Globe, Star, Droplet, ShowerHead, Calendar, Tent, Truck, Dog, Info, Trees, DollarSign, Wifi, Mountain, Map, MessageSquare, Sparkles, Image } from "lucide-react";
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

  const formatFeature = (value: string | null | undefined) => {
    if (!value || value === "" || value.toLowerCase() === "none") return "N/A";
    return value;
  };

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
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">
          Found {results.length} Campgrounds
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedResults.map((campsite, index) => {
            // Extract additional data if available (these fields come from the database)
            const waterAvailable = campsite.water || 'N/A';
            const showers = campsite.showers || 'N/A';
            const season = campsite.season || 'N/A';
            const sites = campsite.sites || 'N/A';
            const rvFriendly = campsite.rv_length ? `Yes (up to ${campsite.rv_length}ft)` : 'N/A';
            const petFriendly = campsite.pets || 'N/A';
            const fees = campsite.fee || 'N/A';
            const campType = campsite.type || 'Standard';
            
            // New fields
            const pricePerNight = campsite.price_per_night || 'N/A';
            const monthlyRate = campsite.monthly_rate || 'N/A';
            const elevation = campsite.elev ? `${campsite.elev} ft` : 'N/A';
            const coordinates = campsite.location ? 
              `${campsite.location[1].toFixed(6)}, ${campsite.location[0].toFixed(6)}` : 'N/A';
            const cellService = campsite.cell_service || 'N/A';
            const reviews = campsite.reviews || 'N/A';
            const amenities = campsite.amenities || 'N/A';
            const photos = campsite.photos || [];
            
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
                  
                  {campsite.distance !== undefined && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{campsite.distance} miles</span> from search location
                    </div>
                  )}
                  
                  {campsite.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium">{campsite.rating.toFixed(1)}</span>
                    </div>
                  )}

                  <Separator className="my-2" />
                  
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Droplet className="h-4 w-4 text-blue-500" />
                      <span>Water: {formatFeature(waterAvailable)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <ShowerHead className="h-4 w-4 text-blue-500" />
                      <span>Showers: {formatFeature(showers)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-500" />
                      <span>Season: {formatFeature(season)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Tent className="h-4 w-4 text-green-500" />
                      <span>Sites: {formatFeature(sites)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-orange-500" />
                      <span>RV: {formatFeature(rvFriendly)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Dog className="h-4 w-4 text-orange-500" />
                      <span>Pets: {formatFeature(petFriendly)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-purple-500" />
                      <span>Fees: {formatFeature(fees)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span>Price/Night: {formatFeature(pricePerNight)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span>Monthly: {formatFeature(monthlyRate)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Mountain className="h-4 w-4 text-brown-500" />
                      <span>Elevation: {formatFeature(elevation)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Map className="h-4 w-4 text-blue-700" />
                      <span title={coordinates} className="truncate">GPS: {formatFeature(coordinates)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4 text-blue-600" />
                      <span>Cell Service: {formatFeature(cellService)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-gray-600" />
                      <span>Reviews: {formatFeature(reviews)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      <span>Amenities: {formatFeature(amenities)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Image className="h-4 w-4 text-indigo-500" />
                      <span>Photos: {photos.length > 0 ? `${photos.length} available` : 'N/A'}</span>
                    </div>
                  </div>
                  
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
