
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";

interface MotorcycleDetails {
  id: number;
  created_at: string;
  year: string | null;
  make: string | null;
  model: string | null;
  msrp: string | null;
  current_value: string | null;
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
          .from('data_2025')
          .select('*')
          .eq('id', numericId)
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
              {motorcycle.year} {motorcycle.make} {motorcycle.model}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-500">MSRP</p>
                      <p className="font-medium">{formatCurrency(motorcycle.msrp)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Current Value</p>
                      <p className="font-medium">{formatCurrency(motorcycle.current_value)}</p>
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
