
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin, Phone, Mail, Globe } from "lucide-react";
import { CampgroundResult } from "@/hooks/camping/types";

interface CampsiteCardProps {
  campsite: CampgroundResult;
}

const CampsiteCard = ({ campsite }: CampsiteCardProps) => {
  const { 
    campground_name, 
    address_1, 
    address_2, 
    city, 
    state, 
    zip_code, 
    phone, 
    email, 
    website 
  } = campsite;

  const formatPhoneNumber = (phoneNumber: string | null) => {
    if (!phoneNumber) return '';
    // Strip non-digits
    const cleaned = phoneNumber.replace(/\D/g, '');
    // Format as (XXX) XXX-XXXX if it's 10 digits
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phoneNumber;
  };

  const formattedAddress = () => {
    const parts = [];
    if (address_1) parts.push(address_1);
    if (address_2) parts.push(address_2);
    
    const cityStateZip = [];
    if (city) cityStateZip.push(city);
    if (state) cityStateZip.push(state);
    if (zip_code) cityStateZip.push(zip_code);
    
    if (cityStateZip.length > 0) {
      parts.push(cityStateZip.join(', '));
    }
    
    return parts.join(', ');
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="line-clamp-2 text-xl">{campground_name || 'Unnamed Campground'}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        {(address_1 || city || state) && (
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
            <span className="text-gray-700">{formattedAddress()}</span>
          </div>
        )}
        
        {phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-gray-500 shrink-0" />
            <span className="text-gray-700">{formatPhoneNumber(phone)}</span>
          </div>
        )}
        
        {email && (
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-gray-500 shrink-0" />
            <a href={`mailto:${email}`} className="text-blue-600 hover:underline break-all">
              {email}
            </a>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        {website ? (
          <a 
            href={website.startsWith('http') ? website : `https://${website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>Visit Website</span>
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </a>
        ) : (
          <Button variant="outline" className="w-full" disabled>
            <Globe className="h-4 w-4 mr-2" />
            <span>No Website Available</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default CampsiteCard;
