
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
        <div className="flex-1">
          <label htmlFor="vin-input" className="sr-only">VIN Number</label>
          <Input
            type="text"
            id="vin-input"
            name="vin"
            placeholder="Enter VIN (17 characters)"
            value={searchParams.vin}
            onChange={(e) => setSearchParams(prev => ({ ...prev, vin: e.target.value.toUpperCase() }))}
            className="flex-1 bg-white"
            maxLength={17}
            aria-label="Vehicle Identification Number"
          />
        </div>
        <Button 
          className="button-gradient text-white px-8 py-6"
          onClick={() => onVinSearch(searchParams.vin)}
          disabled={isSearching || (searchParams.vin.length > 0 && searchParams.vin.length !== 17)}
          id="vin-search-button"
          name="vin-search"
          type="button"
          aria-label="Decode VIN"
        >
          <ScanBarcode className="mr-2" />
          Decode VIN
        </Button>
      </div>
      <div className="text-gray-600 text-center my-2">- OR -</div>
      <div className="flex flex-col md:flex-row gap-4">
        <div>
          <label htmlFor="year-select" className="sr-only">Year</label>
          <Select 
            value={searchParams.year}
            onValueChange={(value) => setSearchParams(prev => ({ ...prev, year: value, model: '' }))}
            name="year"
          >
            <SelectTrigger className="bg-white" id="year-select">
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
        </div>
        <div>
          <label htmlFor="make-select" className="sr-only">Make</label>
          <Select 
            value={searchParams.make}
            onValueChange={(value) => setSearchParams(prev => ({ ...prev, make: value, model: '' }))}
            name="make"
          >
            <SelectTrigger className="bg-white" id="make-select">
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
        </div>
        <div>
          <label htmlFor="model-select" className="sr-only">Model</label>
          <Select 
            value={searchParams.model}
            onValueChange={(value) => setSearchParams(prev => ({ ...prev, model: value }))}
            disabled={!searchParams.make}
            name="model"
          >
            <SelectTrigger className="bg-white" id="model-select">
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
        </div>
        <Button 
          className="button-gradient text-white px-8 py-6"
          onClick={onSearch}
          disabled={isSearching}
          id="search-button"
          name="search"
          type="button"
          aria-label="Search"
        >
          <Search className="mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
};

export default SearchForm;
