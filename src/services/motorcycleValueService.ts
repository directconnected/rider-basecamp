
import { supabase } from "@/integrations/supabase/client";
import { Motorcycle } from "@/types/motorcycle";
import { calculateCurrentValue, formatCurrency } from "@/utils/motorcycleCalculations";
import { toast } from "sonner";

export const updateMotorcycleValue = async (motorcycle: Motorcycle) => {
  try {
    if (!motorcycle.msrp) {
      console.log('No MSRP available for motorcycle:', motorcycle.id);
      return null;
    }

    const msrpNumber = Number(motorcycle.msrp);
    if (isNaN(msrpNumber)) {
      console.error('Invalid MSRP value:', motorcycle.msrp);
      return null;
    }

    const currentValue = calculateCurrentValue(msrpNumber);
    if (currentValue === 0) {
      console.error('Could not calculate valid current value');
      return null;
    }

    const { data: existingData, error: checkError } = await supabase
      .from('data_2025')
      .select('current_value')
      .eq('id', motorcycle.id)
      .maybeSingle();

    if (checkError) {
      console.error('Check error:', checkError);
      return null;
    }

    if (existingData?.current_value === currentValue) {
      console.log('No update needed for:', motorcycle.id);
      return currentValue;
    }

    const { error: updateError } = await supabase
      .from('data_2025')
      .update({
        current_value: currentValue,
        updated_at: new Date().toISOString()
      })
      .eq('id', motorcycle.id);

    if (updateError) {
      console.error('Update error:', updateError);
      throw new Error(`Update failed: ${updateError.message}`);
    }

    toast.success(`Updated value: ${formatCurrency(currentValue)}`);
    return currentValue;

  } catch (error) {
    console.error('Error in updateMotorcycleValue:', error);
    toast.error('Failed to update motorcycle value. Check console for details.');
    return null;
  }
};
