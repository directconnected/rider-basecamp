import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Database, BarChart2, TrendingUp, FileText } from "lucide-react";
import SearchForm from "@/components/search/SearchForm";
import SearchResults from "@/components/search/SearchResults";
import { useMotorcycleSearch } from "@/hooks/useMotorcycleSearch";
import { formatCurrency } from "@/utils/motorcycleCalculations";
import Breadcrumbs from "@/components/Breadcrumbs";

const Data = () => {
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
      <Breadcrumbs />
      
      <main className="flex-1">
        <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Motorcycle Data
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Search our comprehensive motorcycle database
              </p>
            </div>
          </div>
        </section>

        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Search Database</h2>
                <p className="text-gray-600">Find detailed information about any motorcycle model</p>
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
            <SearchResults results={searchResults} formatCurrency={formatCurrency} />
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default Data;
