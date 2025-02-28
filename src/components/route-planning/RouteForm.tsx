
import React from "react";
import { Compass, MapPin, Clock, Calendar, Fuel, LayoutGrid, UtensilsCrossed, Hotel, Landmark } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LodgingType, RestaurantType, AttractionType } from "./types";

interface FormData {
  startPoint: string;
  destination: string;
  startDate: string;
  duration: string;
  fuelMileage: string;
  milesPerDay: string;
  preferredLodging: LodgingType;
  preferredRestaurant: RestaurantType;
  preferredAttraction: AttractionType;
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
          <label htmlFor="startPoint" className="block text-sm font-medium mb-2">Starting Point</label>
          <div className="flex gap-2">
            <Input 
              id="startPoint"
              name="startPoint"
              placeholder="Enter starting location"
              value={formData.startPoint}
              onChange={(e) => onFormDataChange({ startPoint: e.target.value })}
              aria-label="Starting Point"
            />
            <Button variant="outline" size="icon" type="button" aria-label="Get current location">
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div>
          <label htmlFor="destination" className="block text-sm font-medium mb-2">Destination</label>
          <div className="flex gap-2">
            <Input 
              id="destination"
              name="destination"
              placeholder="Enter destination"
              value={formData.destination}
              onChange={(e) => onFormDataChange({ destination: e.target.value })}
              aria-label="Destination"
            />
            <Button variant="outline" size="icon" type="button" aria-label="Select destination on map">
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium mb-2">Start Date</label>
            <div className="flex gap-2">
              <Input 
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => onFormDataChange({ startDate: e.target.value })}
                aria-label="Start Date"
              />
              <Button variant="outline" size="icon" type="button" aria-label="Select date">
                <Calendar className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <label htmlFor="duration" className="block text-sm font-medium mb-2">Duration (Days)</label>
            <div className="flex gap-2">
              <Input 
                id="duration"
                name="duration"
                type="number" 
                placeholder="Days" 
                min="1"
                value={formData.duration}
                onChange={(e) => onFormDataChange({ duration: e.target.value })}
                aria-label="Duration in days"
              />
              <Button variant="outline" size="icon" type="button" aria-label="Set duration">
                <Clock className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="fuelMileage" className="block text-sm font-medium mb-2">Vehicle Fuel Mileage</label>
            <div className="flex gap-2">
              <Input 
                id="fuelMileage"
                name="fuelMileage"
                type="number" 
                placeholder="Miles per tank" 
                min="50"
                value={formData.fuelMileage}
                onChange={(e) => onFormDataChange({ fuelMileage: e.target.value })}
                aria-label="Fuel mileage in miles per tank"
              />
              <Button variant="outline" size="icon" type="button" aria-label="Set fuel mileage">
                <Fuel className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <label htmlFor="milesPerDay" className="block text-sm font-medium mb-2">Max Miles Per Day</label>
            <div className="flex gap-2">
              <Input 
                id="milesPerDay"
                name="milesPerDay"
                type="number" 
                placeholder="Daily miles" 
                min="50"
                value={formData.milesPerDay}
                onChange={(e) => onFormDataChange({ milesPerDay: e.target.value })}
                aria-label="Maximum miles per day"
              />
              <Button variant="outline" size="icon" type="button" aria-label="Set daily miles">
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="preferredLodging" className="block text-sm font-medium mb-2">Preferred Lodging Type</label>
            <div className="flex gap-2">
              <Select 
                value={formData.preferredLodging} 
                onValueChange={(value: LodgingType) => onFormDataChange({ preferredLodging: value })}
              >
                <SelectTrigger id="preferredLodging" name="preferredLodging" className="w-full">
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
              <Button variant="outline" size="icon" type="button" aria-label="Lodging options">
                <Hotel className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <label htmlFor="preferredRestaurant" className="block text-sm font-medium mb-2">Preferred Restaurant Type</label>
            <div className="flex gap-2">
              <Select 
                value={formData.preferredRestaurant} 
                onValueChange={(value: RestaurantType) => onFormDataChange({ preferredRestaurant: value })}
              >
                <SelectTrigger id="preferredRestaurant" name="preferredRestaurant" className="w-full">
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
              <Button variant="outline" size="icon" type="button" aria-label="Restaurant options">
                <UtensilsCrossed className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="preferredAttraction" className="block text-sm font-medium mb-2">Preferred Attraction Type</label>
          <div className="flex gap-2">
            <Select 
              value={formData.preferredAttraction} 
              onValueChange={(value: AttractionType) => onFormDataChange({ preferredAttraction: value })}
            >
              <SelectTrigger id="preferredAttraction" name="preferredAttraction" className="w-full">
                <SelectValue placeholder="Select attraction type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Attraction</SelectItem>
                <SelectItem value="museum">Museums</SelectItem>
                <SelectItem value="park">Parks</SelectItem>
                <SelectItem value="tourist_attraction">Tourist Attractions</SelectItem>
                <SelectItem value="amusement_park">Amusement Parks</SelectItem>
                <SelectItem value="art_gallery">Art Galleries</SelectItem>
                <SelectItem value="historic_site">Historic Sites</SelectItem>
                <SelectItem value="natural_feature">Natural Features</SelectItem>
                <SelectItem value="point_of_interest">Points of Interest</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" type="button" aria-label="Attraction options">
              <Landmark className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button 
          className="w-full"
          onClick={onPlanRoute}
          disabled={isLoading}
          type="button"
          aria-label="Plan Route"
        >
          {isLoading ? "Planning Route..." : "Plan Route"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RouteForm;
