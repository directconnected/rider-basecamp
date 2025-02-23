import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { calculateCurrentValue, formatCurrency, MotorcycleCondition } from "@/utils/motorcycleCalculations";
import { FileDown } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface MotorcycleValueInfoProps {
  currentValue: number | null;
  msrp: number | null;
  year?: string | null;
  make?: string | null;
  model?: string | null;
}

export const MotorcycleValueInfo = ({ currentValue, msrp, year, make, model }: MotorcycleValueInfoProps) => {
  const [mileage, setMileage] = useState<string>("");
  const [condition, setCondition] = useState<MotorcycleCondition>("good");
  const [calculatedValue, setCalculatedValue] = useState<number | null>(currentValue);

  const handleCalculate = () => {
    if (!msrp) {
      toast.error("MSRP is required for calculation");
      return;
    }

    const numericMileage = mileage ? parseInt(mileage, 10) : undefined;
    
    if (mileage && isNaN(numericMileage!)) {
      toast.error("Please enter a valid mileage number");
      return;
    }

    const newValue = calculateCurrentValue(msrp, year ? parseInt(year) : null, {
      mileage: numericMileage,
      condition,
      make: make || undefined
    });

    setCalculatedValue(newValue);
    toast.success("Value recalculated based on mileage and condition");
  };

  const handleManualDownload = async (type: 'owners' | 'service') => {
    console.log('Download attempt started with:', { make, model, type });

    if (!make || !model) {
      console.log('Missing make or model:', { make, model });
      toast.error("Unable to find manual", {
        description: "Motorcycle make and model information is missing"
      });
      return;
    }

    try {
      console.log('Original model name:', model);
      
      // Extract base model name by removing year and special edition text
      const baseModel = model
        .replace(/^\d{4}\s+/, '') // Remove year from start if present
        .split(/\s+(?:\d{2,}(?:th|st|nd|rd)\s+Anniversary|Special\s+Edition|Limited\s+Edition)/i)[0] // Remove special edition text
        .trim();
        
      console.log('Base model after cleanup:', baseModel);

      // Create filename components separately to ensure proper format
      const makeSlug = make.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      const modelSlug = baseModel.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      
      // Construct filename with explicit parts
      let filename = `${makeSlug}_${modelSlug}_${type}_manual.pdf`
        .replace(/-+/g, '-'); // Clean up any consecutive hyphens
        
      // For Gold Wing models, ensure correct formatting
      filename = filename.replace('gold-wing', 'goldwing');
      
      console.log('Attempting to download:', filename);
      console.log('Storage bucket:', type === 'owners' ? 'owners_manuals' : 'service_manuals');

      const { data, error } = await supabase.storage
        .from(type === 'owners' ? 'owners_manuals' : 'service_manuals')
        .createSignedUrl(filename, 60);

      if (error) {
        console.error('Error getting download URL:', error);
        console.error('Error details:', {
          error: error.message,
          filename,
          bucket: type === 'owners' ? 'owners_manuals' : 'service_manuals'
        });
        toast.error(`Unable to download ${type} manual`, {
          description: "The manual may not be available yet."
        });
        return;
      }

      console.log('Successfully got signed URL:', data.signedUrl);

      // Open PDF in new window instead of downloading
      window.open(data.signedUrl, '_blank');

      toast.success("Manual opened!", {
        description: `Opening ${type} manual for ${make} ${model}`
      });
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Failed to open manual", {
        description: "There was an error accessing the manual."
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Value Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Original MSRP</p>
            <p className="text-xl font-semibold">{formatCurrency(msrp)}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Estimated Value</p>
            <p className="text-2xl font-bold text-theme-600">
              {formatCurrency(calculatedValue)}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Adjust Value Estimate</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="mileage" className="text-sm text-gray-600">
              Current Mileage
            </label>
            <Input
              id="mileage"
              type="number"
              placeholder="Enter current mileage"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-600">
              Condition
            </label>
            <Select value={condition} onValueChange={(value: MotorcycleCondition) => setCondition(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleCalculate} className="w-full">
          Recalculate Value
        </Button>
      </div>

      <div className="pt-4 border-t">
        <h4 className="font-medium mb-4">Documentation</h4>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => handleManualDownload('owners')}
          >
            <FileDown className="mr-2 h-4 w-4" />
            View Owner's Manual
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => handleManualDownload('service')}
          >
            <FileDown className="mr-2 h-4 w-4" />
            View Service Manual
          </Button>
        </div>
      </div>
    </div>
  );
};
