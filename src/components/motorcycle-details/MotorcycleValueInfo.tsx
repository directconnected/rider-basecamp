
import { useState, useEffect } from "react";
import { calculateCurrentValue, MotorcycleCondition } from "@/utils/motorcycleCalculations";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ValueDisplay } from "./value-info/ValueDisplay";
import { ValueAdjustment } from "./value-info/ValueAdjustment";
import { DocumentationSection } from "./value-info/DocumentationSection";

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
  const [calculatedValue, setCalculatedValue] = useState<number | null>(null);

  // Initialize calculated value when component mounts or when currentValue changes
  useEffect(() => {
    setCalculatedValue(currentValue);
  }, [currentValue]);

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

    try {
      const newValue = calculateCurrentValue(msrp, year ? parseInt(year) : null, {
        mileage: numericMileage,
        condition,
        make: make || undefined
      });

      console.log('Calculated new value:', {
        msrp,
        year,
        mileage: numericMileage,
        condition,
        make,
        newValue
      });

      setCalculatedValue(newValue);
      toast.success("Value recalculated based on mileage and condition");
    } catch (error) {
      console.error('Error calculating value:', error);
      toast.error("Failed to calculate value");
    }
  };

  const handleManualDownload = async (type: 'owners' | 'service' | 'quickstart') => {
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
      
      let bucket = '';
      switch(type) {
        case 'owners':
          bucket = 'owners_manuals';
          break;
        case 'service':
          bucket = 'service_manuals';
          break;
        case 'quickstart':
          bucket = 'quickstart_guides';
          break;
      }
      
      console.log('Storage bucket:', bucket);

      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filename, 60);

      if (error) {
        console.error('Error getting download URL:', error);
        console.error('Error details:', {
          error: error.message,
          filename,
          bucket
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
      <ValueDisplay msrp={msrp} calculatedValue={calculatedValue} />
      
      <ValueAdjustment
        mileage={mileage}
        condition={condition}
        onMileageChange={setMileage}
        onConditionChange={setCondition}
        onCalculate={handleCalculate}
      />
      
      <DocumentationSection onManualDownload={handleManualDownload} />
    </div>
  );
};
