
import React from "react";
import { Database } from "@/integrations/supabase/types";
import CampsiteCard from "./CampsiteCard";
import CampsitePagination from "./CampsitePagination";
import { Loader2 } from "lucide-react";

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
  if (isLoading) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-theme-600" />
      </div>
    );
  }

  return (
    <section className="w-full bg-gray-50 py-16">
      {(!results || results.length === 0) ? (
        <div className="text-center mb-12">
          <p className="text-gray-600 text-lg">No campgrounds found. Try adjusting your search criteria.</p>
        </div>
      ) : (
        <>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 text-gray-900">Found Campgrounds</h2>
            <p className="text-gray-600">
              Showing page {currentPage} of {totalPages}
              {results.length > 0 && ` • ${results.length} campgrounds`}
            </p>
          </div>
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {results.map((campsite) => (
                <CampsiteCard key={campsite.id} campsite={campsite} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12">
                <CampsitePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                />
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default CampsiteSearchResults;
