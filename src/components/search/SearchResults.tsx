
import React from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface Motorcycle {
  motorcycle_id: number;
  Year: string | null;
  Make: string | null;
  Model: string | null;
  Category: string | null;
  Rating: string | null;
  MSRP: string | null;
  "Engine type": string | null;
  "Engine details": string | null;
  "Power (PS)": string | null;
  value?: number;
}

interface SearchResultsProps {
  results: Motorcycle[];
  formatCurrency: (value: string | null) => string;
}

const SearchResults = ({ results, formatCurrency }: SearchResultsProps) => {
  if (results.length === 0) return null;

  return (
    <section className="w-full bg-white py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">Search Results</h2>
        <p className="text-gray-600">Found {results.length} matches</p>
      </div>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-5 gap-8">
          {results.map((motorcycle) => (
            <Card key={motorcycle.motorcycle_id} className="col-span-5 lg:col-start-2 lg:col-span-3 bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-1">
                  {motorcycle.Year} {motorcycle.Make}
                </h3>
                <p className="text-gray-600 text-lg mb-6">{motorcycle.Model}</p>
                
                <div className="space-y-6 mb-6">
                  <div>
                    <p className="text-gray-500 text-sm">Estimated Current Value</p>
                    <p className="text-3xl font-bold text-theme-600">
                      ${motorcycle.value?.toLocaleString()}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 text-sm">Original MSRP</p>
                    <p className="text-xl font-semibold">
                      {formatCurrency(motorcycle.MSRP)}
                    </p>
                  </div>

                  {motorcycle["Engine type"] && (
                    <div>
                      <p className="text-gray-500 text-sm">Engine</p>
                      <p className="text-base">{motorcycle["Engine type"]}</p>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-gray-500">Category:</span>
                    <span className="font-medium ml-2">{motorcycle.Category || 'N/A'}</span>
                  </div>
                  <Link to={`/motorcycle/${motorcycle.motorcycle_id}`}>
                    <Button className="button-gradient">
                      View Details
                      <ArrowRight className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SearchResults;
