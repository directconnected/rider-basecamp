
import React from "react";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, Droplets, DollarSign } from "lucide-react";
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

const CampsiteSearchResults = ({ 
  results, 
  currentPage, 
  totalPages, 
  onPageChange,
  isLoading 
}: CampsiteSearchResultsProps) => {
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
                  <h3 className="text-xl font-bold mb-2">{campsite.camp || 'Unnamed Campsite'}</h3>
                  
                  <div className="space-y-2 text-gray-600">
                    {(campsite.town || campsite.state) && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {[
                            campsite.town,
                            campsite.state
                          ].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}
                    
                    {campsite.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{campsite.phone}</span>
                      </div>
                    )}
                    
                    {campsite.fee && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>Fee: {campsite.fee}</span>
                      </div>
                    )}
                    
                    {campsite.showers && (
                      <div className="flex items-center gap-2">
                        <Droplets className="w-4 h-4" />
                        <span>Showers: {campsite.showers}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      {campsite.sites && (
                        <span>Sites: {campsite.sites}</span>
                      )}
                      {campsite.season && (
                        <span>Season: {campsite.season}</span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
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
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            onPageChange(page);
                          }}
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
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
