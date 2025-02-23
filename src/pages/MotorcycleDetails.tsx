
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Motorcycle } from "@/types/motorcycle";
import { updateMotorcycleValue } from "@/services/motorcycleValueService";
import { MotorcycleValueInfo } from "@/components/motorcycle-details/MotorcycleValueInfo";
import { MotorcycleSpecifications } from "@/components/motorcycle-details/MotorcycleSpecifications";

const MotorcycleDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMotorcycleDetails = async () => {
      try {
        if (!id) return;
        
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) {
          console.error('Invalid ID format');
          return;
        }

        console.log('Fetching motorcycle with ID:', numericId); // Debug log

        const { data, error } = await supabase
          .from('data_2025')
          .select('*')
          .eq('id', numericId)
          .single();

        if (error) {
          console.error('Error fetching motorcycle details:', error);
          return;
        }

        console.log('Fetched motorcycle data:', data); // Debug log

        if (data && data.msrp) {
          const updatedValue = await updateMotorcycleValue(data);
          const motorcycleData = {
            ...data,
            current_value: updatedValue
          };
          console.log('Setting motorcycle data:', motorcycleData); // Debug log
          setMotorcycle(motorcycleData);
        } else {
          setMotorcycle(data);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMotorcycleDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-6 py-8">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!motorcycle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto px-6 py-8">
          <p>Motorcycle not found</p>
        </div>
      </div>
    );
  }

  // Debug log before rendering
  console.log('Rendering motorcycle details:', {
    make: motorcycle.make,
    model: motorcycle.model,
    year: motorcycle.year
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <section className="w-full bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="mb-6">
            <Link to="/data">
              <Button variant="outline" className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Search
              </Button>
            </Link>
          </div>

          <Card className="col-span-5 lg:col-start-2 lg:col-span-3 bg-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-1">
                {motorcycle.year} {motorcycle.make}
              </h3>
              <p className="text-gray-600 text-lg mb-6">{motorcycle.model}</p>
              
              <div className="space-y-6 mb-6">
                <MotorcycleValueInfo 
                  currentValue={motorcycle.current_value} 
                  msrp={motorcycle.msrp} 
                  year={motorcycle.year}
                  make={motorcycle.make}
                  model={motorcycle.model}
                />
                <MotorcycleSpecifications motorcycle={motorcycle} />
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default MotorcycleDetails;
