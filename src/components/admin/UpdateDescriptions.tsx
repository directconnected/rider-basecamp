
import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const UpdateDescriptions = () => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleUpdateDescriptions = async () => {
    setIsUpdating(true);
    try {
      const { data, error } = await supabase.functions.invoke('update-byway-descriptions');
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to update byway descriptions",
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Success",
        description: "Successfully updated byway descriptions",
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
        onClick={handleUpdateDescriptions}
        disabled={isUpdating}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isUpdating ? "Updating Descriptions..." : "Update Byway Descriptions"}
      </Button>
    </div>
  );
};

export default UpdateDescriptions;
