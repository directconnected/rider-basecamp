
import React, { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Wrench, Calendar, Clock } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceRecordDialog from "@/components/service/ServiceRecordDialog";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";

type ServiceType = 'oil_change' | 'tire_replacement' | 'brake_service' | 
                  'chain_maintenance' | 'general_maintenance' | 'repair' | 'inspection';

interface ServiceRecord {
  id: string;
  service_type: ServiceType;
  service_date: string;
  mileage: number | null;
  cost: number | null;
  notes: string | null;
  next_service_date: string | null;
}

const Service = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchServiceRecords();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchServiceRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('service_records')
        .select('*')
        .order('service_date', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching service records:', error);
      toast.error("Failed to load service records");
    } finally {
      setLoading(false);
    }
  };

  const handleAddServiceRecord = async (data: {
    service_type: string;
    service_date: string;
    mileage?: number;
    cost?: number;
    notes?: string;
    next_service_date?: string;
  }) => {
    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from('service_records')
        .insert({
          ...data,
          service_type: data.service_type as ServiceType,
          user_id: session.user.id
        });

      if (error) throw error;
      
      toast.success("Service record added successfully");
      fetchServiceRecords();
    } catch (error) {
      console.error('Error adding service record:', error);
      toast.error("Failed to add service record");
    }
  };

  const formatServiceType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Breadcrumbs />
      
      <main className="flex-1">
        <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Service History
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Track and manage your motorcycle maintenance records
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="mb-8 flex justify-end">
              <ServiceRecordDialog onSubmit={handleAddServiceRecord} />
            </div>

            {loading ? (
              <div className="text-center py-8">Loading service records...</div>
            ) : records.length === 0 ? (
              <Card className="p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">No Service Records Yet</h3>
                <p className="text-gray-600 mb-4">Start tracking your motorcycle maintenance by adding your first service record.</p>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {records.map((record) => (
                  <Card key={record.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <Wrench className="h-5 w-5 text-primary mr-2" />
                        <h3 className="font-semibold">
                          {formatServiceType(record.service_type)}
                        </h3>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Service Date: {format(new Date(record.service_date), 'PP')}</span>
                      </div>
                      
                      {record.next_service_date && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>Next Service: {format(new Date(record.next_service_date), 'PP')}</span>
                        </div>
                      )}
                      
                      {record.mileage && (
                        <div className="flex items-center">
                          <span>Mileage: {record.mileage.toLocaleString()} miles</span>
                        </div>
                      )}
                      
                      {record.cost && (
                        <div className="flex items-center">
                          <span>Cost: ${record.cost.toFixed(2)}</span>
                        </div>
                      )}
                      
                      {record.notes && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">{record.notes}</p>
                        </div>
                      )}
                    </div>
                  </Card>
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

export default Service;
