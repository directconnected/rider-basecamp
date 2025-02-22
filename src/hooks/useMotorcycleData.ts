
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Motorcycle } from "@/types/motorcycle";
import { toast } from "sonner";

export const useMotorcycleData = () => {
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);

  const fetchMakes = async () => {
    const { data, error } = await supabase
      .from('data_2025')
      .select('make');

    if (error) {
      console.error('Fetch makes error:', error);
      throw new Error('Failed to fetch makes');
    }

    const uniqueMakes = Array.from(new Set(data.map(item => item.make).filter(Boolean)));
    setMakes(uniqueMakes.sort());
  };

  const fetchModels = async (make: string) => {
    const { data, error } = await supabase
      .from('data_2025')
      .select('model')
      .eq('make', make);

    if (error) {
      console.error('Fetch models error:', error);
      throw new Error('Failed to fetch models');
    }

    const uniqueModels = Array.from(new Set(data.map(item => item.model).filter(Boolean)));
    setModels(uniqueModels.sort());
  };

  return {
    makes,
    models,
    fetchMakes,
    fetchModels
  };
};
