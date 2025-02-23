
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const AdminSignup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, verify the current user is an admin
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("You must be logged in as an admin to create new admin accounts");
        navigate("/admin/login");
        return;
      }

      const { data: isAdmin, error: adminCheckError } = await supabase.rpc('is_admin', {
        user_id: session.user.id
      });

      if (adminCheckError || !isAdmin) {
        toast.error("You don't have permission to create admin accounts");
        navigate("/admin/login");
        return;
      }

      // Validate passwords match
      if (password !== confirmPassword) {
        toast.error("Passwords don't match");
        return;
      }

      // Create the new admin account
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // Add admin role for the new user
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert([
            { user_id: data.user.id, role: 'admin' }
          ]);

        if (roleError) throw roleError;

        toast.success("Admin account created successfully");
        navigate("/admin");
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.message || "Failed to create admin account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-8">Create Admin Account</h1>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Admin Account"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminSignup;
