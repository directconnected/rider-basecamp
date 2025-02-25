
import React from "react";
import { Database } from "@/integrations/supabase/types";
import CampsiteCard from "./CampsiteCard";
import CampsitePagination from "./CampsitePagination";

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
                <CampsiteCard key={campsite.id} campsite={campsite} />
              ))}
            </div>

            {totalPages > 1 && (
              <CampsitePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default CampsiteSearchResults;
