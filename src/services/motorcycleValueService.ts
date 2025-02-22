
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

    // First, verify the record exists
    const { data: existingRecord, error: checkError } = await supabase
      .from('data_2025')
      .select('id')
      .eq('id', motorcycle.id)
      .single();

    if (checkError || !existingRecord) {
      console.error('Record not found:', motorcycle.id);
      throw new Error('Record not found');
    }

    // Perform the update with explicit type casting
    const { error: updateError } = await supabase
      .from('data_2025')
      .update({
        current_value: currentValue,
        updated_at: new Date().toISOString()
      })
      .match({ id: motorcycle.id });

    if (updateError) {
      console.error('Update error:', updateError);
      throw new Error(`Update failed: ${updateError.message}`);
    }

    // Double-check the update with a fresh query
    const { data: verifyData, error: verifyError } = await supabase
      .from('data_2025')
      .select('*')
      .eq('id', motorcycle.id)
      .single();

    if (verifyError) {
      console.error('Verification error:', verifyError);
      throw new Error('Failed to verify update');
    }

    console.log('Full record after update:', verifyData);
    
    if (!verifyData.current_value) {
      console.error('Update did not persist:', verifyData);
      throw new Error('Update did not persist');
    }

    toast.success(`Updated value: ${formatCurrency(currentValue)}`);
    return currentValue;

  } catch (error) {
    console.error('Error in updateMotorcycleValue:', error);
    toast.error('Failed to update motorcycle value');
    return null;
  }
};
