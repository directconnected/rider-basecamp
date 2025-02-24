
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [serviceDate, setServiceDate] = React.useState<Date>();
  const [nextServiceDate, setNextServiceDate] = React.useState<Date>();
  const [mileage, setMileage] = React.useState("");
  const [cost, setCost] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [serviceDateOpen, setServiceDateOpen] = React.useState(false);
  const [nextServiceDateOpen, setNextServiceDateOpen] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceType || !serviceDate) return;

    onSubmit({
      service_type: serviceType,
      service_date: format(serviceDate, 'yyyy-MM-dd'),
      mileage: mileage ? parseInt(mileage) : undefined,
      cost: cost ? parseFloat(cost) : undefined,
      notes: notes || undefined,
      next_service_date: nextServiceDate ? format(nextServiceDate, 'yyyy-MM-dd') : undefined,
    });

    setOpen(false);
    // Reset form
    setServiceType(undefined);
    setServiceDate(undefined);
    setNextServiceDate(undefined);
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
            <Select value={serviceType} onValueChange={(value: ServiceType) => setServiceType(value)} required>
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
            <Popover open={serviceDateOpen} onOpenChange={setServiceDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !serviceDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {serviceDate ? format(serviceDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={serviceDate}
                  onSelect={(date) => {
                    setServiceDate(date);
                    setServiceDateOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Next Service Date (Optional)</label>
            <Popover open={nextServiceDateOpen} onOpenChange={setNextServiceDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !nextServiceDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {nextServiceDate ? format(nextServiceDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={nextServiceDate}
                  onSelect={(date) => {
                    setNextServiceDate(date);
                    setNextServiceDateOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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
