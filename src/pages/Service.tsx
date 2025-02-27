
import React, { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Wrench, Calendar, Clock, Printer, AlertTriangle } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import ServiceRecordDialog from "@/components/service/ServiceRecordDialog";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { format, addDays, compareAsc, isWithinInterval } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [filteredRecords, setFilteredRecords] = useState<ServiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchDate, setSearchDate] = useState("");
  const [searchType, setSearchType] = useState("");
  const [upcomingServices, setUpcomingServices] = useState<ServiceRecord[]>([]);

  useEffect(() => {
    checkAuthAndFetchRecords();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [records, searchDate, searchType]);

  useEffect(() => {
    findUpcomingServices();
  }, [records]);

  const checkAuthAndFetchRecords = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      fetchServiceRecords();
    } catch (error) {
      console.error("Error checking auth:", error);
      toast.error("Authentication error occurred");
      navigate("/auth");
    }
  };

  const fetchServiceRecords = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No authenticated session");
      }

      console.log("Fetching records for user:", session.user.id);
      
      const { data, error } = await supabase
        .from('service_records')
        .select('*')
        .eq('user_id', session.user.id)
        .order('service_date', { ascending: false });

      if (error) {
        console.error('Fetch error:', error);
        throw error;
      }

      console.log("Fetched records:", data);
      setRecords(data || []);
      setFilteredRecords(data || []);
    } catch (error) {
      console.error('Error fetching service records:', error);
      toast.error("Failed to load service records");
    } finally {
      setLoading(false);
    }
  };

  const filterRecords = () => {
    let filtered = [...records];
    
    if (searchDate) {
      filtered = filtered.filter(record => 
        record.service_date.includes(searchDate)
      );
    }
    
    if (searchType) {
      filtered = filtered.filter(record => 
        record.service_type === searchType
      );
    }
    
    setFilteredRecords(filtered);
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

  const resetFilters = () => {
    setSearchDate("");
    setSearchType("");
  };

  console.log("Service component rendering", { records, filteredRecords, loading });

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
            <div className="mb-8 flex justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <Input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  placeholder="Filter by date"
                  className="w-44"
                />
                
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All types</SelectItem>
                    <SelectItem value="oil_change">Oil Change</SelectItem>
                    <SelectItem value="tire_replacement">Tire Replacement</SelectItem>
                    <SelectItem value="brake_service">Brake Service</SelectItem>
                    <SelectItem value="chain_maintenance">Chain Maintenance</SelectItem>
                    <SelectItem value="general_maintenance">General Maintenance</SelectItem>
                    <SelectItem value="repair">Repair</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" onClick={resetFilters}>
                  Reset Filters
                </Button>

                <Button variant="outline" asChild className="flex items-center gap-2">
                  <Link to="/printable-service" target="_blank">
                    <Printer className="h-4 w-4" />
                    <span>Print Report</span>
                  </Link>
                </Button>
              </div>
              
              <ServiceRecordDialog onSubmit={handleAddServiceRecord} />
            </div>

            {upcomingServices.length > 0 && (
              <Card className="p-6 mb-8 border-l-4 border-amber-500">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Upcoming Service Reminders</h3>
                    <div className="space-y-2">
                      {upcomingServices.map((service) => (
                        <div key={`upcoming-${service.id}`} className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <p>
                            {formatServiceType(service.service_type)} due on {format(new Date(service.next_service_date!), 'PP')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {loading ? (
              <div className="text-center py-8">Loading service records...</div>
            ) : filteredRecords.length === 0 ? (
              <Card className="p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">No Service Records Found</h3>
                <p className="text-gray-600 mb-4">
                  {records.length === 0 
                    ? "Start tracking your motorcycle maintenance by adding your first service record." 
                    : "No records match your current filters. Try adjusting your search criteria."}
                </p>
                {records.length > 0 && (
                  <Button variant="outline" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                )}
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredRecords.map((record) => (
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
