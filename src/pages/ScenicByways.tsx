
import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import BywayCard from "@/components/scenic-byways/BywayCard";
import { ScenicByway, stateAbbreviations } from "@/components/scenic-byways/types";
import { capitalizeWords, getFallbackImage, verifyImageUrl } from "@/components/scenic-byways/utils";

const getFullStateName = (stateAbbr: string) => {
  return stateAbbreviations[stateAbbr.toUpperCase()] || stateAbbr;
};

const ScenicByways = () => {
  const [selectedState, setSelectedState] = useState<string>("all");
  const [verifiedUrls, setVerifiedUrls] = useState<{ [key: string]: boolean }>({});
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const { data: scenicByways, isLoading } = useQuery({
    queryKey: ["scenic-byways"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scenic_byways")
        .select("*")
        .order("byway_name");
      
      if (error) throw error;
      return data as ScenicByway[];
    },
  });

  useEffect(() => {
    const verifyImages = async () => {
      if (!scenicByways) return;
      setIsVerifying(true);

      const verificationResults: { [key: string]: boolean } = {};
      let invalidCount = 0;

      for (const byway of scenicByways) {
        if (byway.image_url) {
          const isValid = await verifyImageUrl(byway.image_url);
          verificationResults[byway.image_url] = isValid;
          if (!isValid) {
            invalidCount++;
            console.log(`Invalid image URL for ${byway.byway_name}: ${byway.image_url}`);
          }
        }
      }

      setVerifiedUrls(verificationResults);
      setIsVerifying(false);
      
      if (invalidCount > 0) {
        toast({
          title: "Image Verification Results",
          description: `Using fallback images for ${invalidCount} byways with invalid URLs.`,
          variant: "default",
        });
      }
    };

    verifyImages();
  }, [scenicByways, toast]);

  const filteredByways = selectedState === "all"
    ? scenicByways
    : scenicByways?.filter(byway => getFullStateName(byway.state) === selectedState);

  const uniqueStates = Array.from(new Set(scenicByways?.map(byway => getFullStateName(byway.state)) || [])).sort();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Breadcrumbs />
      <main className="flex-1">
        <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Scenic Byways
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Experience America's most beautiful motorcycle roads
              </p>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="mb-8 max-w-xs mx-auto">
              <Select
                value={selectedState}
                onValueChange={setSelectedState}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {uniqueStates.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isLoading || isVerifying ? (
              <div className="text-center text-gray-600">
                {isLoading ? "Loading scenic byways..." : "Verifying images..."}
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredByways?.map((byway, index) => (
                  <BywayCard
                    key={index}
                    byway={byway}
                    verifiedUrls={verifiedUrls}
                    getFullStateName={getFullStateName}
                    capitalizeWords={capitalizeWords}
                    getFallbackImage={getFallbackImage}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ScenicByways;
