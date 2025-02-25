
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CampsiteSearchFormProps {
  searchParams: {
    state: string;
    city: string;
    zipCode: string;
  };
  setSearchParams: (params: Partial<{
    state: string;
    city: string;
    zipCode: string;
  }>) => void;
  isSearching: boolean;
  onSearch: () => void;
}

const CampsiteSearchForm = ({
  searchParams,
  setSearchParams,
  isSearching,
  onSearch
}: CampsiteSearchFormProps) => {
  return (
    <div className="flex flex-col gap-6 animate-fade-in max-w-md mx-auto w-full">
      <div className="space-y-4">
        <Input
          type="text"
          placeholder="State (e.g., CA)"
          value={searchParams.state}
          onChange={(e) => setSearchParams({ state: e.target.value.toUpperCase() })}
          className="w-full bg-white text-center"
          maxLength={2}
        />
        <Input
          type="text"
          placeholder="City"
          value={searchParams.city}
          onChange={(e) => setSearchParams({ city: e.target.value })}
          className="w-full bg-white"
        />
        <Input
          type="text"
          placeholder="Zip Code"
          value={searchParams.zipCode}
          onChange={(e) => setSearchParams({ zipCode: e.target.value })}
          className="w-full bg-white text-center"
          maxLength={5}
        />
      </div>
      <div className="flex justify-center">
        <Button 
          className="button-gradient text-white px-8 py-6 w-full sm:w-auto"
          onClick={onSearch}
          disabled={isSearching}
        >
          <Search className="mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
};

export default CampsiteSearchForm;
