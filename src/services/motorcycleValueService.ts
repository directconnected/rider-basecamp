
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

    // Update with numeric values and ensure ID is used correctly
    const { error: updateError } = await supabase
      .from('data_2025')
      .update({ 
        current_value: Number(currentValue), // Ensure value is numeric
        updated_at: new Date().toISOString()
      })
      .eq('id', Number(motorcycle.id)); // Ensure ID is numeric

    if (updateError) {
      console.error('Update error:', updateError);
      throw new Error(`Update failed: ${updateError.message}`);
    }

    // Verify the update
    const { data: verifyData, error: verifyError } = await supabase
      .from('data_2025')
      .select('current_value')
      .eq('id', Number(motorcycle.id))
      .single();

    if (verifyError || !verifyData) {
      console.error('Verification error:', verifyError);
      throw new Error('Failed to verify update');
    }

    console.log('Successfully updated motorcycle with value:', currentValue);
    console.log('Verified database value:', verifyData.current_value);
    
    toast.success(`Updated value: ${formatCurrency(currentValue)}`);
    return currentValue;

  } catch (error) {
    console.error('Error in updateMotorcycleValue:', error);
    toast.error('Failed to update motorcycle value');
    return null;
  }
};
