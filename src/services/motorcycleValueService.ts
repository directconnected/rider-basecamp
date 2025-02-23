
import { supabase } from "@/integrations/supabase/client";
import { Motorcycle } from "@/types/motorcycle";
import { calculateCurrentValue } from "@/utils/motorcycleCalculations";
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
    console.log('Attempting to update value for motorcycle:', motorcycle.id);
    console.log('Input values - MSRP:', msrpNumber, 'Calculated value:', currentValue);

    // Direct update approach
    const { data: updatedData, error: updateError } = await supabase
      .from('data_2025')
      .update({
        current_value: currentValue,
        updated_at: new Date().toISOString()
      })
      .eq('id', motorcycle.id)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      throw new Error(`Update failed: ${updateError.message}`);
    }

    if (!updatedData || updatedData.current_value === null) {
      console.error('Update returned no data or null value');
      throw new Error('Update failed to persist value');
    }

    console.log('Update successful. New record:', updatedData);
    return currentValue;

  } catch (error) {
    console.error('Error in updateMotorcycleValue:', error);
    toast.error('Failed to update motorcycle value');
    return null;
  }
};
