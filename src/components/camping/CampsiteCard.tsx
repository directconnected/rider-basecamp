
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ExternalLink, MapPin, Phone } from 'lucide-react';
import { CampgroundResult } from '@/hooks/camping/types';
import { Button } from '@/components/ui/button';

interface CampsiteCardProps {
  campground: CampgroundResult;
}

const CampsiteCard = ({ campground }: CampsiteCardProps) => {
  const {
    campground_name,
    address_1,
    address_2,
    city,
    state,
    zip_code,
    phone,
    website
  } = campground;

  const formatAddress = () => {
    const addressParts = [];
    if (address_1) addressParts.push(address_1);
    if (address_2) addressParts.push(address_2);
    
    let cityStateZip = '';
    if (city) cityStateZip += city;
    if (state) cityStateZip += city ? `, ${state}` : state;
    if (zip_code) cityStateZip += cityStateZip ? ` ${zip_code}` : zip_code;
    
    if (cityStateZip) addressParts.push(cityStateZip);
    
    return addressParts.join(', ');
  };

  const getMapLink = () => {
    const query = encodeURIComponent(`${campground_name} ${formatAddress()}`);
    return `https://maps.google.com/maps?q=${query}`;
  };

  const formatWebsiteUrl = (url: string) => {
    if (!url) return '';
    return url.startsWith('http') ? url : `https://${url}`;
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <h3 className="text-xl font-bold line-clamp-2">{campground_name || 'Unnamed Campground'}</h3>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {formatAddress() && (
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-500">{formatAddress()}</p>
            </div>
          )}
          
          {phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-gray-500" />
              <p className="text-sm text-gray-500">{phone}</p>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-2 justify-end">
          {website && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              asChild
            >
              <a href={formatWebsiteUrl(website)} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                <span>Website</span>
              </a>
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            asChild
          >
            <a href={getMapLink()} target="_blank" rel="noopener noreferrer">
              <MapPin className="h-4 w-4" />
              <span>View Map</span>
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampsiteCard;
