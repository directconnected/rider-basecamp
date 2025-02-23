
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const DataScraper = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleScrape = async (type: 'routes' | 'gear') => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('scrape-data', {
        body: { type }
      });

      if (error) throw error;

      if (data.success) {
        toast.success(`Successfully scraped ${data.count} ${type}`);
      } else {
        toast.error(`Failed to scrape ${type}`);
      }
    } catch (error) {
      console.error('Scraping error:', error);
      toast.error(`Error while scraping ${type}: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Data Scraping</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg mb-2">Motorcycle Routes</h3>
          <p className="text-sm text-gray-600 mb-2">
            Scrape motorcycle routes from motorcycleroads.com
          </p>
          <Button 
            onClick={() => handleScrape('routes')}
            disabled={isLoading}
          >
            Scrape Routes
          </Button>
        </div>

        <div>
          <h3 className="text-lg mb-2">Motorcycle Gear</h3>
          <p className="text-sm text-gray-600 mb-2">
            Scrape motorcycle gear from revzilla.com
          </p>
          <Button 
            onClick={() => handleScrape('gear')}
            disabled={isLoading}
          >
            Scrape Gear
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default DataScraper;
