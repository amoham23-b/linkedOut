
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Coffee, BriefcaseBusiness } from "lucide-react";
import { SupabaseContext } from "@/App";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const supabase = useContext(SupabaseContext);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      
      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      // Check if the user has a complete profile
      // In Login.tsx, modify the profile check to use the correct table and column name
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')  // Changed from 'profiles' to 'user_profiles'
        .select('profile_completed')  // Changed from 'profileCompleted' to 'profile_completed'
        .eq('uid', data.user.id)
        .single();
        
      toast({
        title: "Welcome back!",
        description: "Time to build your personal brand and irritate your connections!",
      });
      
      if (profileError || !profileData || !profileData.profileCompleted) {
        // If no profile exists or it's incomplete, redirect to profile creation
        navigate("/create-profile");
      } else {
        // Profile exists, redirect to dashboard
        navigate("/");
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linkedout-gray/30 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-linkedout-blue flex items-center justify-center gap-2">
            <BriefcaseBusiness size={32} />
            LinkedOut
          </h1>
          <p className="text-gray-600 mt-2">Where professionals come to pretend they're happy</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your network of "connections"</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full bg-linkedout-blue" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              <a href="#" className="text-linkedout-blue hover:underline">Forgot Password?</a>
            </div>
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-linkedout-blue hover:underline">Join LinkedOut</Link>
            </div>
            <div className="flex items-center justify-center text-gray-500 text-xs">
              <Coffee size={14} className="mr-1" /> 
              <span>Experience the corporate dread, one post at a time</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
