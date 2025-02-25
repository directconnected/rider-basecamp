
import React from "react";
import { Star } from "lucide-react";

interface RatingDisplayProps {
  rating?: number;
}

const RatingDisplay = ({ rating }: RatingDisplayProps) => {
  if (!rating) return null;
  
  return (
    <div className="flex items-center gap-1 text-yellow-500">
      <Star className="h-4 w-4 fill-current" />
      <span className="text-sm font-medium">{rating}</span>
    </div>
  );
};

export default RatingDisplay;
