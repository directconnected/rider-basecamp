
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Motorcycle } from "@/types/motorcycle";
import { updateMotorcycleValue } from "@/services/motorcycleValueService";
import { formatCurrency } from "@/utils/motorcycleCalculations";

type MotorcycleDetails = Motorcycle;

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

        if (data && data.msrp) {
          const updatedValue = await updateMotorcycleValue(data);
          setMotorcycle({
            ...data,
            current_value: updatedValue
          });
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <section className="w-full bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="mb-6">
            <Link to="/">
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
                <div>
                  <p className="text-gray-500 text-sm">Estimated Current Value</p>
                  <p className="text-3xl font-bold text-theme-600">
                    {formatCurrency(motorcycle.current_value)}
                  </p>
                </div>
                
                <div>
                  <p className="text-gray-500 text-sm">Original MSRP</p>
                  <p className="text-xl font-semibold mb-6">
                    {formatCurrency(motorcycle.msrp)}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg">
                  {motorcycle.engine_type && (
                    <div>
                      <p className="text-gray-500 text-sm">Engine Type</p>
                      <p className="text-base">{motorcycle.engine_type}</p>
                    </div>
                  )}

                  {motorcycle.transmission && (
                    <div>
                      <p className="text-gray-500 text-sm">Transmission</p>
                      <p className="text-base">{motorcycle.transmission}</p>
                    </div>
                  )}

                  {motorcycle.clutch && (
                    <div>
                      <p className="text-gray-500 text-sm">Clutch</p>
                      <p className="text-base">{motorcycle.clutch}</p>
                    </div>
                  )}

                  {motorcycle.front_suspension && (
                    <div>
                      <p className="text-gray-500 text-sm">Front Suspension</p>
                      <p className="text-base">{motorcycle.front_suspension}</p>
                    </div>
                  )}

                  {motorcycle.rear_suspension && (
                    <div>
                      <p className="text-gray-500 text-sm">Rear Suspension</p>
                      <p className="text-base">{motorcycle.rear_suspension}</p>
                    </div>
                  )}

                  {motorcycle.front_brakes && (
                    <div>
                      <p className="text-gray-500 text-sm">Front Brakes</p>
                      <p className="text-base">{motorcycle.front_brakes}</p>
                    </div>
                  )}

                  {motorcycle.rear_brakes && (
                    <div>
                      <p className="text-gray-500 text-sm">Rear Brakes</p>
                      <p className="text-base">{motorcycle.rear_brakes}</p>
                    </div>
                  )}

                  {motorcycle.front_tire && (
                    <div>
                      <p className="text-gray-500 text-sm">Front Tire</p>
                      <p className="text-base">{motorcycle.front_tire}</p>
                    </div>
                  )}

                  {motorcycle.rear_tire && (
                    <div>
                      <p className="text-gray-500 text-sm">Rear Tire</p>
                      <p className="text-base">{motorcycle.rear_tire}</p>
                    </div>
                  )}

                  {motorcycle.rake && (
                    <div>
                      <p className="text-gray-500 text-sm">Rake</p>
                      <p className="text-base">{motorcycle.rake}</p>
                    </div>
                  )}

                  {motorcycle.trail && (
                    <div>
                      <p className="text-gray-500 text-sm">Trail</p>
                      <p className="text-base">{motorcycle.trail}</p>
                    </div>
                  )}

                  {motorcycle.wheelbase && (
                    <div>
                      <p className="text-gray-500 text-sm">Wheelbase</p>
                      <p className="text-base">{motorcycle.wheelbase}</p>
                    </div>
                  )}

                  {motorcycle.seat_height && (
                    <div>
                      <p className="text-gray-500 text-sm">Seat Height</p>
                      <p className="text-base">{motorcycle.seat_height}</p>
                    </div>
                  )}

                  {motorcycle.ground_clearance && (
                    <div>
                      <p className="text-gray-500 text-sm">Ground Clearance</p>
                      <p className="text-base">{motorcycle.ground_clearance}</p>
                    </div>
                  )}

                  {motorcycle.fuel_capacity && (
                    <div>
                      <p className="text-gray-500 text-sm">Fuel Capacity</p>
                      <p className="text-base">{motorcycle.fuel_capacity}</p>
                    </div>
                  )}

                  {motorcycle.curb_weight && (
                    <div>
                      <p className="text-gray-500 text-sm">Curb Weight</p>
                      <p className="text-base">{motorcycle.curb_weight}</p>
                    </div>
                  )}

                  {motorcycle.colors && (
                    <div>
                      <p className="text-gray-500 text-sm">Colors</p>
                      <p className="text-base">{motorcycle.colors}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default MotorcycleDetails;
