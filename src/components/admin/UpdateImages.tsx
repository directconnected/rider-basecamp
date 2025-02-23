
import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const UpdateImages = () => {
  const { toast } = useToast();

  const updateMotorcycleImages = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('update-motorcycle-images');
      
      if (error) {
        console.error('Error invoking function:', error);
        toast({
          title: "Error",
          description: "Failed to start image update process",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Image update process started successfully",
      });
      
      console.log('Function response:', data);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to start image update process",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg mb-2">Update Motorcycle Images</h3>
      <p className="text-sm text-gray-600 mb-4">
        Search and update images for motorcycles that don't have one.
      </p>
      <Button 
        onClick={updateMotorcycleImages}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        Start Image Update
      </Button>
    </div>
  );
};

export default UpdateImages;
