
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";

type ServiceType = 'oil_change' | 'tire_replacement' | 'brake_service' | 
                  'chain_maintenance' | 'general_maintenance' | 'repair' | 'inspection';

interface ServiceRecordDialogProps {
  onSubmit: (data: {
    service_type: ServiceType;
    service_date: string;
    mileage?: number;
    cost?: number;
    notes?: string;
    next_service_date?: string;
  }) => void;
}

const ServiceRecordDialog = ({ onSubmit }: ServiceRecordDialogProps) => {
  const [open, setOpen] = React.useState(false);
  const [serviceType, setServiceType] = React.useState<ServiceType>();
  const [mileage, setMileage] = React.useState("");
  const [cost, setCost] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [serviceDate, setServiceDate] = React.useState("");
  const [nextServiceDate, setNextServiceDate] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceType || !serviceDate) return;

    onSubmit({
      service_type: serviceType,
      service_date: serviceDate,
      mileage: mileage ? parseInt(mileage) : undefined,
      cost: cost ? parseFloat(cost) : undefined,
      notes: notes || undefined,
      next_service_date: nextServiceDate || undefined,
    });

    setOpen(false);
    // Reset form
    setServiceType(undefined);
    setServiceDate("");
    setNextServiceDate("");
    setMileage("");
    setCost("");
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Service Record
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Service Record</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Service Type</label>
            <Select 
              value={serviceType} 
              onValueChange={(value: ServiceType) => setServiceType(value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oil_change">Oil Change</SelectItem>
                <SelectItem value="tire_replacement">Tire Replacement</SelectItem>
                <SelectItem value="brake_service">Brake Service</SelectItem>
                <SelectItem value="chain_maintenance">Chain Maintenance</SelectItem>
                <SelectItem value="general_maintenance">General Maintenance</SelectItem>
                <SelectItem value="repair">Repair</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Service Date</label>
            <Input
              type="date"
              value={serviceDate}
              onChange={(e) => setServiceDate(e.target.value)}
              required
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Next Service Date (Optional)</label>
            <Input
              type="date"
              value={nextServiceDate}
              onChange={(e) => setNextServiceDate(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Mileage (Optional)</label>
            <Input
              type="number"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              placeholder="Enter mileage"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Cost (Optional)</label>
            <Input
              type="number"
              step="0.01"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="Enter cost"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes (Optional)</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any additional notes"
            />
          </div>

          <Button type="submit" className="w-full">Add Record</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceRecordDialog;
