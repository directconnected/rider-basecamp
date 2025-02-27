
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { format, addDays, isWithinInterval } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Printer, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const PrintableService = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [upcomingServices, setUpcomingServices] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Service History Report";
    checkAuthAndFetchRecords();
  }, []);

  useEffect(() => {
    findUpcomingServices();
  }, [records]);

  const checkAuthAndFetchRecords = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }
    fetchServiceRecords();
  };

  const fetchServiceRecords = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No authenticated session");
      }
      
      const { data, error } = await supabase
        .from('service_records')
        .select('*')
        .eq('user_id', session.user.id)
        .order('service_date', { ascending: false });

      if (error) {
        console.error('Fetch error:', error);
        throw error;
      }

      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching service records:', error);
      toast.error("Failed to load service records");
    } finally {
      setLoading(false);
    }
  };

  const findUpcomingServices = () => {
    const today = new Date();
    const thirtyDaysFromNow = addDays(today, 30);
    
    const upcoming = records.filter(record => {
      if (!record.next_service_date) return false;
      
      const nextDate = new Date(record.next_service_date);
      return isWithinInterval(nextDate, {
        start: today,
        end: thirtyDaysFromNow
      });
    });
    
    setUpcomingServices(upcoming);
  };

  const formatServiceType = (type: string) => {
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handlePrint = () => {
    window.print();
  };

  // Group records by service type
  const groupedByType: Record<ServiceType, ServiceRecord[]> = records.reduce((acc, record) => {
    const type = record.service_type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(record);
    return acc;
  }, {} as Record<ServiceType, ServiceRecord[]>);

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading service records...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="no-print flex justify-between items-center mb-8">
        <Button onClick={() => navigate(-1)} variant="outline">Back to Service History</Button>
        <Button onClick={handlePrint} className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          <span>Print Report</span>
        </Button>
      </div>
      
      <div className="print-content">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Motorcycle Service History Report</h1>
          <p className="text-gray-600">Generated on {format(new Date(), 'PPP')}</p>
        </div>

        {upcomingServices.length > 0 && (
          <div className="mb-8 p-4 border border-amber-200 bg-amber-50 rounded-md">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Upcoming Service Reminders</h3>
                <div className="space-y-2">
                  {upcomingServices.map((service) => (
                    <div key={`upcoming-${service.id}`} className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <p>
                        {formatServiceType(service.service_type)} due on {format(new Date(service.next_service_date!), 'PP')}
                        {service.mileage && ` (Last service at ${service.mileage.toLocaleString()} miles)`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {Object.keys(groupedByType).map((serviceType) => (
            <div key={serviceType} className="mb-8">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b">
                {formatServiceType(serviceType)}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-3 text-left">Date</th>
                      <th className="p-3 text-left">Mileage</th>
                      <th className="p-3 text-left">Cost</th>
                      <th className="p-3 text-left">Next Service</th>
                      <th className="p-3 text-left">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedByType[serviceType as ServiceType].map((record) => (
                      <tr key={record.id} className="border-b">
                        <td className="p-3">{format(new Date(record.service_date), 'PP')}</td>
                        <td className="p-3">{record.mileage ? `${record.mileage.toLocaleString()} miles` : '-'}</td>
                        <td className="p-3">{record.cost ? `$${record.cost.toFixed(2)}` : '-'}</td>
                        <td className="p-3">{record.next_service_date ? format(new Date(record.next_service_date), 'PP') : '-'}</td>
                        <td className="p-3">{record.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        {records.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">No service records found.</p>
          </div>
        )}
      </div>

      <style>{`
        @media print {
          .no-print {
            display: none;
          }
          body {
            font-size: 12pt;
          }
          table {
            page-break-inside: avoid;
          }
          @page {
            margin: 1.5cm;
          }
        }
      `}</style>
    </div>
  );
};

export default PrintableService;
