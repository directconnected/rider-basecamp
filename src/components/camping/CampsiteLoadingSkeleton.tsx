
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const CampsiteLoadingSkeleton = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-64 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CampsiteLoadingSkeleton;
