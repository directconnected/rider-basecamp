
import React from "react";
import { Compass, MapPin, Clock, Calendar, Fuel, LayoutGrid, UtensilsCrossed, Hotel } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LodgingType, RestaurantType } from "./types";

interface FormData {
  startPoint: string;
  destination: string;
  startDate: string;
  duration: string;
  fuelMileage: string;
  milesPerDay: string;
  preferredLodging: LodgingType;
  preferredRestaurant: RestaurantType;
}

interface RouteFormProps {
  formData: FormData;
  isLoading: boolean;
  onFormDataChange: (data: Partial<FormData>) => void;
  onPlanRoute: () => void;
}

const RouteForm = ({ formData, isLoading, onFormDataChange, onPlanRoute }: RouteFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-theme-600" />
          Plan Your Route
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Starting Point</label>
          <div className="flex gap-2">
            <Input 
              placeholder="Enter starting location"
              value={formData.startPoint}
              onChange={(e) => onFormDataChange({ startPoint: e.target.value })}
            />
            <Button variant="outline" size="icon">
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Destination</label>
          <div className="flex gap-2">
            <Input 
              placeholder="Enter destination"
              value={formData.destination}
              onChange={(e) => onFormDataChange({ destination: e.target.value })}
            />
            <Button variant="outline" size="icon">
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <div className="flex gap-2">
              <Input 
                type="date"
                value={formData.startDate}
                onChange={(e) => onFormDataChange({ startDate: e.target.value })}
              />
              <Button variant="outline" size="icon">
                <Calendar className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Duration (Days)</label>
            <div className="flex gap-2">
              <Input 
                type="number" 
                placeholder="Days" 
                min="1"
                value={formData.duration}
                onChange={(e) => onFormDataChange({ duration: e.target.value })}
              />
              <Button variant="outline" size="icon">
                <Clock className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Vehicle Fuel Mileage</label>
            <div className="flex gap-2">
              <Input 
                type="number" 
                placeholder="Miles per tank" 
                min="50"
                value={formData.fuelMileage}
                onChange={(e) => onFormDataChange({ fuelMileage: e.target.value })}
              />
              <Button variant="outline" size="icon">
                <Fuel className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Max Miles Per Day</label>
            <div className="flex gap-2">
              <Input 
                type="number" 
                placeholder="Daily miles" 
                min="50"
                value={formData.milesPerDay}
                onChange={(e) => onFormDataChange({ milesPerDay: e.target.value })}
              />
              <Button variant="outline" size="icon">
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Preferred Lodging Type</label>
            <div className="flex gap-2">
              <Select 
                value={formData.preferredLodging} 
                onValueChange={(value: LodgingType) => onFormDataChange({ preferredLodging: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select lodging type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Lodging</SelectItem>
                  <SelectItem value="hotel">Hotel</SelectItem>
                  <SelectItem value="motel">Motel</SelectItem>
                  <SelectItem value="resort">Resort</SelectItem>
                  <SelectItem value="inn">Inn</SelectItem>
                  <SelectItem value="bed_and_breakfast">Bed & Breakfast</SelectItem>
                  <SelectItem value="campground">Campground</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Hotel className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Preferred Restaurant Type</label>
            <div className="flex gap-2">
              <Select 
                value={formData.preferredRestaurant} 
                onValueChange={(value: RestaurantType) => onFormDataChange({ preferredRestaurant: value })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select restaurant type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Restaurant</SelectItem>
                  <SelectItem value="fine_dining">Fine Dining</SelectItem>
                  <SelectItem value="casual">Casual Dining</SelectItem>
                  <SelectItem value="fast_food">Fast Food</SelectItem>
                  <SelectItem value="cafe">Café</SelectItem>
                  <SelectItem value="steakhouse">Steakhouse</SelectItem>
                  <SelectItem value="seafood">Seafood</SelectItem>
                  <SelectItem value="italian">Italian</SelectItem>
                  <SelectItem value="mexican">Mexican</SelectItem>
                  <SelectItem value="asian">Asian</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <UtensilsCrossed className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Button 
          className="w-full"
          onClick={onPlanRoute}
          disabled={isLoading}
        >
          {isLoading ? "Planning Route..." : "Plan Route"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RouteForm;
