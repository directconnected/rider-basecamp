
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";

interface MotorcycleDetails {
  motorcycle_id: number;
  Year: string | null;
  Make: string | null;
  Model: string | null;
  Category: string | null;
  Rating: string | null;
  MSRP: string | null;
  "Engine type": string | null;
  "Engine details": string | null;
  "Power (PS)": string | null;
  "Displacement (cm3)": string | null;
  "Transmission type, final drive": string | null;
  "Front suspension": string | null;
  "Rear suspension": string | null;
  "Front brakes": string | null;
  "Rear brakes": string | null;
  "Dry weight (kg)": string | null;
  "Fuel capacity (litres)": string | null;
  "Color options": string | null;
  service_manual_url: string | null;
}

const MotorcycleDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [motorcycle, setMotorcycle] = useState<MotorcycleDetails | null>(null);
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

        const { data, error } = await supabase
          .from('motorcycles_1')
          .select('*')
          .eq('motorcycle_id', numericId)
          .single();

        if (error) {
          console.error('Error fetching motorcycle details:', error);
          return;
        }

        setMotorcycle(data);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMotorcycleDetails();
  }, [id]);

  const formatCurrency = (value: string | null): string => {
    if (!value) return 'N/A';
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numericValue);
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Search
            </Button>
          </Link>
        </div>

        <Card className="bg-white shadow-lg">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2">
              {motorcycle.Year} {motorcycle.Make} {motorcycle.Model}
            </h1>
            
            {motorcycle.service_manual_url && (
              <div className="mb-6">
                <a 
                  href={motorcycle.service_manual_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <Button variant="secondary" className="gap-2">
                    <FileText className="h-4 w-4" />
                    View Owner's Manual
                  </Button>
                </a>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-500">Category</p>
                      <p className="font-medium">{motorcycle.Category || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">MSRP</p>
                      <p className="font-medium">{formatCurrency(motorcycle.MSRP)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Rating</p>
                      <p className="font-medium">{motorcycle.Rating || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">Engine</h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-500">Engine Type</p>
                      <p className="font-medium">{motorcycle["Engine type"] || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Engine Details</p>
                      <p className="font-medium">{motorcycle["Engine details"] || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Power</p>
                      <p className="font-medium">{motorcycle["Power (PS)"] || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Displacement</p>
                      <p className="font-medium">{motorcycle["Displacement (cm3)"] || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Chassis & Suspension</h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-500">Transmission</p>
                      <p className="font-medium">{motorcycle["Transmission type, final drive"] || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Front Suspension</p>
                      <p className="font-medium">{motorcycle["Front suspension"] || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Rear Suspension</p>
                      <p className="font-medium">{motorcycle["Rear suspension"] || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">Additional Specifications</h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-500">Front Brakes</p>
                      <p className="font-medium">{motorcycle["Front brakes"] || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Rear Brakes</p>
                      <p className="font-medium">{motorcycle["Rear brakes"] || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Dry Weight</p>
                      <p className="font-medium">{motorcycle["Dry weight (kg)"] || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Fuel Capacity</p>
                      <p className="font-medium">{motorcycle["Fuel capacity (litres)"] || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Available Colors</p>
                      <p className="font-medium">{motorcycle["Color options"] || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MotorcycleDetails;
