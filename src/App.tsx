import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./Index/Index";
import Profile from "./Profile/Profile";
import Login from "./Login/Login";
import SignUp from "./SignUp/SignUp";
import ProfileSetup from "./Profile/ProfileSetup";  // Import ProfileSetup
import NotFound from "./NotFound/NotFound";
import { getCurrentUser } from "./lib/authService";
import { getUserProfile } from "./lib/userProfileService";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }) => { // Protect routes that require authentication
  const user = getCurrentUser();
  // if (!user) {
  //   return <Navigate to="/login" replace />;
  // }

  // Check if user has completed their profile setup
  const checkProfileStatus = async () => {
    const userProfile = await getUserProfile(user.uid);
    if (!userProfile.profileCompleted) {
      return <Navigate to="/profile-setup" replace />;
    }
  };

  checkProfileStatus();

  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          <Route path="/" 
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } 
          />
          <Route path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route path="/profile-setup" element={<ProfileSetup />} /> {/* Add Profile Setup Route */}

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
