
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
        {/* Hero Banner Section */}
        <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Motorcycle VIN Lookup
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Get detailed information about any motorcycle using our comprehensive database
              </p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Search Your Motorcycle
                </h2>
                <p className="text-gray-600 mb-8">
                  Enter your VIN or use our advanced search options
                </p>
              </div>
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
        </section>

        <SearchResults results={searchResults} formatCurrency={formatCurrency} />
        <Footer />
      </main>
    </div>
  );
};

export default VINLookup;
