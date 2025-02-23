
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import UpdateMSRP from "@/components/admin/UpdateMSRP";
import UpdateDescriptions from "@/components/admin/UpdateDescriptions";
import DataScraper from "@/components/admin/DataScraper";
import UpdateImages from "@/components/admin/UpdateImages";
import UpdateManuals from "@/components/admin/UpdateManuals";
import Breadcrumbs from "@/components/Breadcrumbs";

const Admin = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Successfully logged out");
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Breadcrumbs />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
          
          <div className="space-y-6">
            <DataScraper />
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Database Management</h2>
              <div className="space-y-4">
                <UpdateMSRP />
                <UpdateDescriptions />
                <UpdateImages />
                <UpdateManuals />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
