
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

    // First verify if we can update the record
    const { data: existingData, error: checkError } = await supabase
      .from('data_2025')
      .select('id')
      .eq('id', motorcycle.id)
      .single();

    if (checkError || !existingData) {
      console.error('Error checking motorcycle record:', checkError);
      throw new Error('Could not verify motorcycle record');
    }

    // Perform the update
    const { data: updateData, error: updateError } = await supabase
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

    console.log('Successfully updated motorcycle:', updateData);
    toast.success(`Updated value: ${formatCurrency(currentValue)}`);
    return currentValue;

  } catch (error) {
    console.error('Error in updateMotorcycleValue:', error);
    toast.error('Failed to update motorcycle value');
    return null;
  }
};
