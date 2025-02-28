
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { MapPin, Search, MapPinned } from "lucide-react";

interface CampsiteSearchFormProps {
  searchParams: {
    state: string;
    city: string;
    zipCode: string;
    radius?: number;
  };
  setSearchParams: (params: any) => void;
  onSearch: () => void;
  onLocationSearch: () => void;
  isSearching: boolean;
}

const radiusOptions = [
  { value: 5000, label: "5 km" },
  { value: 10000, label: "10 km" },
  { value: 25000, label: "25 km" },
  { value: 50000, label: "50 km" },
];

const CampsiteSearchForm = ({
  searchParams,
  setSearchParams,
  onSearch,
  onLocationSearch,
  isSearching,
}: CampsiteSearchFormProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const handleRadiusChange = (value: string) => {
    setSearchParams({ ...searchParams, radius: parseInt(value) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter city"
                  name="city"
                  value={searchParams.city}
                  onChange={handleChange}
                />
              </FormControl>
            </FormItem>
            
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter state"
                  name="state"
                  value={searchParams.state}
                  onChange={handleChange}
                />
              </FormControl>
            </FormItem>
            
            <FormItem>
              <FormLabel>Zip Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter zip code"
                  name="zipCode"
                  value={searchParams.zipCode}
                  onChange={handleChange}
                />
              </FormControl>
            </FormItem>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormItem>
              <FormLabel>Search Radius</FormLabel>
              <Select
                value={searchParams.radius?.toString() || "25000"}
                onValueChange={handleRadiusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select radius" />
                </SelectTrigger>
                <SelectContent>
                  {radiusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              type="submit" 
              disabled={isSearching}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <Search className="h-4 w-4" />
              <span>{isSearching ? "Searching..." : "Search Campgrounds"}</span>
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={onLocationSearch}
              disabled={isSearching}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <MapPinned className="h-4 w-4" />
              <span>{isSearching ? "Searching..." : "Search Near Me"}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CampsiteSearchForm;
