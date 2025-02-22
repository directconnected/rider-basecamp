
import React from "react";
import Navigation from "@/components/Navigation";
import SearchForm from "@/components/search/SearchForm";
import SearchResults from "@/components/search/SearchResults";
import Footer from "@/components/layout/Footer";
import { useMotorcycleSearch } from "@/hooks/useMotorcycleSearch";
import { formatCurrency } from "@/utils/motorcycleCalculations";

const VINLookup = () => {
  const {
    searchParams,
    setSearchParams,
    searchResults,
    isSearching,
    years,
    makes,
    models,
    handleSearch,
    handleSearchByVIN
  } = useMotorcycleSearch();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <section className="relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 pt-20 pb-5">
          <div className="absolute inset-0 bg-black/50 z-0" />
          <div className="w-full px-4 z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
                VIN Lookup
              </h2>
              <p className="text-xl md:text-2xl text-gray-200 mb-8 animate-fade-in">
                Search by VIN or Use Our Advanced Search Options
              </p>
              <div className="max-w-4xl mx-auto mt-8">
                <SearchForm
                  searchParams={searchParams}
                  setSearchParams={setSearchParams}
                  years={years}
                  makes={makes}
                  models={models}
                  isSearching={isSearching}
                  onSearch={handleSearch}
                  onVinSearch={handleSearchByVIN}
                />
              </div>
            </div>
          </div>
        </section>

        <SearchResults results={searchResults} formatCurrency={formatCurrency} />
        <Footer />
      </main>
    </div>
  );
};

export default VINLookup;
