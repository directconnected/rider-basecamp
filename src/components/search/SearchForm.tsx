
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Search, ScanBarcode } from "lucide-react";

interface SearchFormProps {
  searchParams: {
    year: string;
    make: string;
    model: string;
    vin: string;
  };
  setSearchParams: React.Dispatch<React.SetStateAction<{
    year: string;
    make: string;
    model: string;
    vin: string;
  }>>;
  years: number[];
  makes: string[];
  models: string[];
  isSearching: boolean;
  onSearch: () => void;
  onVinSearch: (vin: string) => void;
}

const SearchForm = ({
  searchParams,
  setSearchParams,
  years,
  makes,
  models,
  isSearching,
  onSearch,
  onVinSearch
}: SearchFormProps) => {
  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          type="text"
          placeholder="Enter VIN (17 characters)"
          value={searchParams.vin}
          onChange={(e) => setSearchParams(prev => ({ ...prev, vin: e.target.value.toUpperCase() }))}
          className="flex-1 bg-white"
          maxLength={17}
        />
        <Button 
          className="button-gradient text-white px-8 py-6"
          onClick={() => onVinSearch(searchParams.vin)}
          disabled={isSearching || (searchParams.vin.length > 0 && searchParams.vin.length !== 17)}
        >
          <ScanBarcode className="mr-2" />
          Decode VIN
        </Button>
      </div>
      <div className="text-gray-600 text-center my-2">- OR -</div>
      <div className="flex flex-col md:flex-row gap-4">
        <Select 
          value={searchParams.year}
          onValueChange={(value) => setSearchParams(prev => ({ ...prev, year: value, model: '' }))}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            {years.map(year => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select 
          value={searchParams.make}
          onValueChange={(value) => setSearchParams(prev => ({ ...prev, make: value, model: '' }))}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select Make" />
          </SelectTrigger>
          <SelectContent>
            {makes.map(make => (
              <SelectItem key={make} value={make}>
                {make}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select 
          value={searchParams.model}
          onValueChange={(value) => setSearchParams(prev => ({ ...prev, model: value }))}
          disabled={!searchParams.make}
        >
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select Model" />
          </SelectTrigger>
          <SelectContent>
            {models.map(model => (
              <SelectItem key={model} value={model}>
                {model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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

export default SearchForm;
