
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface CampsiteSearchFormProps {
  searchParams: {
    state: string;
    city: string;
    zipCode: string;
    radius?: number;
  };
  setSearchParams: (params: Partial<{
    state: string;
    city: string;
    zipCode: string;
    radius?: number;
  }>) => void;
  isSearching: boolean;
  onSearch: () => void;
  onLocationSearch: () => void;
}

const CampsiteSearchForm = ({
  searchParams,
  setSearchParams,
  isSearching,
  onSearch,
  onLocationSearch
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
          className="w-full bg-white text-center"
        />
        <Input
          type="text"
          placeholder="Zip Code"
          value={searchParams.zipCode}
          onChange={(e) => setSearchParams({ zipCode: e.target.value })}
          className="w-full bg-white text-center"
          maxLength={5}
        />
        <Select
          value={searchParams.radius?.toString()}
          onValueChange={(value) => setSearchParams({ radius: parseInt(value) })}
        >
          <SelectTrigger className="w-full bg-white text-center">
            <SelectValue placeholder="Search Radius (miles)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 miles</SelectItem>
            <SelectItem value="25">25 miles</SelectItem>
            <SelectItem value="50">50 miles</SelectItem>
            <SelectItem value="100">100 miles</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          className="button-gradient text-white px-8 py-6 flex-1"
          onClick={onSearch}
          disabled={isSearching}
        >
          <Search className="mr-2" />
          Search
        </Button>
        <Button 
          variant="outline"
          className="px-8 py-6 flex-1"
          onClick={onLocationSearch}
          disabled={isSearching}
        >
          <MapPin className="mr-2" />
          Use My Location
        </Button>
      </div>
    </div>
  );
};

export default CampsiteSearchForm;
