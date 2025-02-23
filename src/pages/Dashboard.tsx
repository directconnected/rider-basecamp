
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { LogOut, User } from "lucide-react";

interface Profile {
  id: string;
  full_name: string | null;
  subscription_status: string;
  subscription_period_end: string | null;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;
      setProfile(profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error("Error loading profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Successfully logged out");
      navigate("/auth");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Breadcrumbs />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
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
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    {profile?.full_name || 'User'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Subscription: {profile?.subscription_status || 'Free'}
                  </p>
                </div>
              </div>

              {profile?.subscription_period_end && (
                <p className="text-sm text-gray-500">
                  Subscription ends: {new Date(profile.subscription_period_end).toLocaleDateString()}
                </p>
              )}
            </Card>

            {profile?.subscription_status === 'free' && (
              <Card className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <h3 className="text-xl font-semibold mb-2">Upgrade to Pro</h3>
                <p className="mb-4">Get access to premium features and support.</p>
                <Button 
                  onClick={() => navigate("/subscribe")}
                  variant="secondary"
                  className="bg-white text-purple-600 hover:bg-gray-100"
                >
                  Upgrade Now
                </Button>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
