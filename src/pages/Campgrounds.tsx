
import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import CampsiteSearchForm from "@/components/camping/CampsiteSearchForm";
import CampsiteSearchResults from "@/components/camping/CampsiteSearchResults";
import { useCampsiteSearch } from "@/hooks/useCampsiteSearch";
import Breadcrumbs from "@/components/Breadcrumbs";

const Campgrounds = () => {
  const {
    searchParams,
    setSearchParams,
    searchResults,
    isSearching,
    handleSearch,
    handleLocationSearch,
    currentPage,
    totalPages,
    handlePageChange,
  } = useCampsiteSearch();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Breadcrumbs />
      
      <main className="flex-1">
        <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Find Campgrounds
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Search for campgrounds by state
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <CampsiteSearchForm
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                isSearching={isSearching}
                onSearch={handleSearch}
                onLocationSearch={handleLocationSearch}
              />
            </div>
          </div>
        </section>

        <CampsiteSearchResults 
          results={searchResults}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          isLoading={isSearching}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Campgrounds;
