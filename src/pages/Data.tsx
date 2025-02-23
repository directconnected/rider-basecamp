
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const Data = () => {
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
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Data Management</h1>
      <div className="space-y-4">
        <div className="p-4 border rounded-lg bg-white shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Update Motorcycle Images</h2>
          <p className="text-gray-600 mb-4">
            This will search and update images for motorcycles that don't have one.
          </p>
          <Button 
            onClick={updateMotorcycleImages}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Start Image Update
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Data;
