
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

interface DocumentationSectionProps {
  onManualDownload: (type: 'owners' | 'service' | 'quickstart') => void;
}

export const DocumentationSection = ({ onManualDownload }: DocumentationSectionProps) => {
  return (
    <div className="pt-4 border-t">
      <h4 className="font-medium mb-4">Documentation</h4>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => onManualDownload('owners')}
          id="owners-manual-button"
          name="owners-manual"
        >
          <FileDown className="mr-2 h-4 w-4" />
          Owner's Manual
        </Button>
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => onManualDownload('service')}
          id="service-manual-button"
          name="service-manual"
        >
          <FileDown className="mr-2 h-4 w-4" />
          Service Manual
        </Button>
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={() => onManualDownload('quickstart')}
          id="quickstart-guide-button"
          name="quickstart-guide"
        >
          <FileDown className="mr-2 h-4 w-4" />
          Quickstart Guide
        </Button>
      </div>
    </div>
  );
};
