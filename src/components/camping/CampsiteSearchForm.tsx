
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { MapPin, Search, MapPinned } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface CampsiteSearchFormProps {
  searchParams: {
    state: string;
    city: string;
    zipCode: string;
    radius: number;
  };
  setSearchParams: (params: any) => void;
  onSearch: () => void;
  onLocationSearch: () => void;
  isSearching: boolean;
}

const formSchema = z.object({
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  radius: z.coerce.number().default(25)
});

const radiusOptions = [
  { value: "5", label: "5 miles" },
  { value: "10", label: "10 miles" },
  { value: "25", label: "25 miles" },
  { value: "50", label: "50 miles" },
];

const CampsiteSearchForm = ({
  searchParams,
  setSearchParams,
  onSearch,
  onLocationSearch,
  isSearching,
}: CampsiteSearchFormProps) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: searchParams.city || "",
      state: searchParams.state || "",
      zipCode: searchParams.zipCode || "",
      radius: searchParams.radius || 25
    }
  });

  const handleChange = (name: string, value: string | number) => {
    setSearchParams({ ...searchParams, [name]: value });
  };

  const handleSubmit = form.handleSubmit((data) => {
    setSearchParams({
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      radius: data.radius
    });
    onSearch();
  });

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="p-6 space-y-6">
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter city"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleChange("city", e.target.value);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter state"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleChange("state", e.target.value);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zip Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter zip code"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleChange("zipCode", e.target.value);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="radius"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Search Radius</FormLabel>
                    <Select
                      value={field.value.toString()}
                      onValueChange={(value) => {
                        const numValue = parseInt(value, 10);
                        field.onChange(numValue);
                        handleChange("radius", numValue);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select radius" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {radiusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
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
        </Form>
      </div>
    </div>
  );
};

export default CampsiteSearchForm;
