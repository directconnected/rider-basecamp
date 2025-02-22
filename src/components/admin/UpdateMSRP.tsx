
import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const UpdateMSRP = () => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleUpdateMSRP = async () => {
    setIsUpdating(true);
    try {
      const { data, error } = await supabase.functions.invoke('updateMSRP');
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to update MSRP values",
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Success",
        description: `Successfully processed motorcycles. ${data?.message}`,
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-4">
      <Button 
        onClick={handleUpdateMSRP}
        disabled={isUpdating}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isUpdating ? "Updating MSRP Values..." : "Update MSRP Values"}
      </Button>
    </div>
  );
};

export default UpdateMSRP;
