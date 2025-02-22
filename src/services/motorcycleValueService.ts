
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
    console.log('Attempting to update value for motorcycle:', motorcycle.id);
    console.log('MSRP:', msrpNumber, 'Calculated value:', currentValue);

    // Perform the update without requiring a single row return
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

    // Verify the update was successful by fetching the updated record
    const { data: updatedData, error: fetchError } = await supabase
      .from('data_2025')
      .select('current_value')
      .eq('id', motorcycle.id)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching updated value:', fetchError);
      throw new Error('Failed to verify update');
    }

    // Return the calculated value immediately after successful update
    console.log('Successfully updated motorcycle with value:', currentValue);
    toast.success(`Updated value: ${formatCurrency(currentValue)}`);
    return currentValue;

  } catch (error) {
    console.error('Error in updateMotorcycleValue:', error);
    toast.error('Failed to update motorcycle value');
    return null;
  }
};
