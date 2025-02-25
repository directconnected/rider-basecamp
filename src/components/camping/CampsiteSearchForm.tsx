
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CampsiteSearchFormProps {
  searchParams: {
    state: string;
  };
  setSearchParams: (params: Partial<{
    state: string;
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
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          type="text"
          placeholder="State (e.g., CA)"
          value={searchParams.state}
          onChange={(e) => setSearchParams({ state: e.target.value.toUpperCase() })}
          className="flex-1 bg-white"
          maxLength={2}
        />
        <Button 
          className="button-gradient text-white px-8 py-6"
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
