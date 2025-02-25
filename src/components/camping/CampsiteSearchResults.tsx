
import React from "react";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, Droplets, DollarSign, Globe, PawPrint } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Campsite = Database['public']['Tables']['campsites']['Row'];

interface CampsiteSearchResultsProps {
  results: Campsite[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const CampsiteSearchResults: React.FC<CampsiteSearchResultsProps> = ({ 
  results, 
  currentPage, 
  totalPages, 
  onPageChange,
  isLoading 
}) => {
  // Calculate visible page range
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <section className="w-full bg-white py-16">
      {(!results || results.length === 0) ? (
        <div className="text-center mb-12">
          <p className="text-gray-600">No results found</p>
        </div>
      ) : (
        <>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Search Results</h2>
            <p className="text-gray-600">Showing page {currentPage} of {totalPages}</p>
          </div>
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((campsite) => (
                <Card key={campsite.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">{campsite.camp || 'Unnamed Campsite'}</h3>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-semibold">City:</p>
                        <p>{campsite.town || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="font-semibold">State:</p>
                        <p>{campsite.state || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Zip Code:</p>
                        <p>{campsite.nforg || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Phone:</p>
                        <p>{campsite.phone || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-semibold">Latitude:</p>
                        <p>{campsite.lat || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Longitude:</p>
                        <p>{campsite.lon || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-semibold">Showers:</p>
                        <p>{campsite.showers || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Pets:</p>
                        <p>{campsite.pets || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Season:</p>
                        <p>{campsite.season || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Fee:</p>
                        <p>{campsite.fee || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-semibold">Elevation:</p>
                        <p>{campsite.elev ? `${campsite.elev} ft` : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Hookups:</p>
                        <p>{campsite.hookups || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Toilets:</p>
                        <p>{campsite.toilets || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Water:</p>
                        <p>{campsite.water || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {campsite.url && (
                        <div>
                          <p className="font-semibold">URL:</p>
                          <a 
                            href={campsite.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Visit Website
                          </a>
                        </div>
                      )}
                      
                      <div>
                        <p className="font-semibold">Reservations:</p>
                        <p>{campsite.reservations || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center overflow-x-auto">
                <Pagination>
                  <PaginationContent className="flex flex-wrap justify-center gap-2">
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            onPageChange(currentPage - 1);
                          }} 
                        />
                      </PaginationItem>
                    )}
                    
                    {getVisiblePages().map((page, index) => (
                      <PaginationItem key={index}>
                        {page === '...' ? (
                          <span className="px-4 py-2">...</span>
                        ) : (
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              onPageChange(page as number);
                            }}
                            isActive={page === currentPage}
                          >
                            {page}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}
                    
                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext 
                          href="#" 
                          onClick={(e) => {
                            e.preventDefault();
                            onPageChange(currentPage + 1);
                          }} 
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default CampsiteSearchResults;
