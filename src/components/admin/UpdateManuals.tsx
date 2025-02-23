
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function UpdateManuals() {
  const [uploading, setUploading] = useState(false);
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [manualType, setManualType] = useState<'owners' | 'service'>('owners');
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        toast.error("Invalid file type", {
          description: "Please upload a PDF file"
        });
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !make || !model) {
      toast.error("Missing required fields", {
        description: "Please fill in all fields and select a PDF file"
      });
      return;
    }

    setUploading(true);
    try {
      // Create standardized filename
      const filename = `${make.toLowerCase()}_${model.toLowerCase()}_${manualType}_manual.pdf`
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      const { error: uploadError } = await supabase.storage
        .from(manualType === 'owners' ? 'owners_manuals' : 'service_manuals')
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: true // Override if exists
        });

      if (uploadError) {
        throw uploadError;
      }

      toast.success("Manual uploaded successfully", {
        description: `${make} ${model} ${manualType} manual has been uploaded`
      });

      // Reset form
      setFile(null);
      setMake("");
      setModel("");
      setManualType('owners');
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Upload failed", {
        description: "There was an error uploading the manual"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Upload Motorcycle Manuals</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">
            Manufacturer
          </label>
          <Input
            id="make"
            placeholder="Enter manufacturer (e.g., Honda)"
            value={make}
            onChange={(e) => setMake(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
            Model
          </label>
          <Input
            id="model"
            placeholder="Enter model (e.g., CBR600RR)"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Manual Type
          </label>
          <Select value={manualType} onValueChange={(value: 'owners' | 'service') => setManualType(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select manual type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="owners">Owner's Manual</SelectItem>
              <SelectItem value="service">Service Manual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="manual" className="block text-sm font-medium text-gray-700 mb-1">
            PDF File
          </label>
          <Input
            id="manual"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-theme-50 file:text-theme-700 hover:file:bg-theme-100"
          />
        </div>

        <Button 
          onClick={handleUpload} 
          disabled={uploading || !file || !make || !model}
          className="w-full"
        >
          {uploading ? "Uploading..." : "Upload Manual"}
        </Button>
      </div>
    </div>
  );
}
