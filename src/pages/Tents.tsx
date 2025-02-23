
import React, { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { TentTree, ImageOff } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Tent {
  id: number;
  tent_name: string;
  description: string;
  amazon_url: string;
  image_url: string;
}

const Tents = () => {
  const { data: tents, isLoading, error } = useQuery({
    queryKey: ['tents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tents')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
    const fallbackDiv = e.currentTarget.parentElement?.querySelector('.image-fallback');
    if (fallbackDiv) {
      fallbackDiv.classList.remove('hidden');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <Breadcrumbs />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-xl">Loading tents...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <Breadcrumbs />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-xl text-red-500">Error loading tents</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Breadcrumbs />
      <main className="flex-1">
        <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Motorcycle Camping Tents
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Lightweight and compact tents perfect for motorcycle adventures
              </p>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tents?.map((tent: Tent) => (
                <Card key={tent.id} className="hover-card overflow-hidden flex flex-col">
                  {tent.image_url && (
                    <div className="relative h-48 bg-gray-100">
                      <img
                        src={tent.image_url}
                        alt={tent.tent_name}
                        className="w-full h-full object-contain"
                        onError={handleImageError}
                      />
                      <div className="image-fallback hidden absolute inset-0 flex items-center justify-center bg-gray-100">
                        <div className="text-center">
                          <ImageOff className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Image unavailable</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{tent.tent_name}</h3>
                      </div>
                      <TentTree className="h-6 w-6 text-theme-600" />
                    </div>
                    <p className="text-gray-600 mb-4 flex-1">{tent.description}</p>
                    <a 
                      href={tent.amazon_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-theme-600 text-white px-4 py-2 rounded hover:bg-theme-700 transition-colors"
                    >
                      View on Amazon
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Tents;
