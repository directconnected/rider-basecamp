
import React from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Database, BarChart2, TrendingUp, FileText } from "lucide-react";
import SearchForm from "@/components/search/SearchForm";
import SearchResults from "@/components/search/SearchResults";
import { useMotorcycleSearch } from "@/hooks/useMotorcycleSearch";
import { formatCurrency } from "@/utils/motorcycleCalculations";

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
      
      <main className="flex-1">
        <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Motorcycle Data
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
                Search our comprehensive motorcycle database
              </p>
              <div className="max-w-4xl mx-auto">
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

        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Data-Driven Insights
                </h2>
                <p className="text-gray-600 mb-6">
                  Access comprehensive motorcycle data, including market trends, pricing analysis, and performance metrics. Make informed decisions with our detailed analytics and expert insights.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  {
                    icon: Database,
                    title: "Market Data",
                    description: "Real-time pricing"
                  },
                  {
                    icon: BarChart2,
                    title: "Analytics",
                    description: "Performance metrics"
                  },
                  {
                    icon: TrendingUp,
                    title: "Trends",
                    description: "Market movements"
                  },
                  {
                    icon: FileText,
                    title: "Reports",
                    description: "Detailed analysis"
                  }
                ].map((item) => (
                  <Card key={item.title} className="p-6 text-center hover-card">
                    <item.icon className="w-8 h-8 mx-auto mb-4 text-theme-600" />
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Data;
