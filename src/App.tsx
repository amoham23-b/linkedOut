
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ProfileCreation from "./pages/ProfileCreation";
import EditProfile from "./pages/EditProfile";
import NotFound from "./pages/NotFound";

// Uncomment and configure Supabase client
import { createClient } from '@supabase/supabase-js';
import { createContext } from 'react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const SupabaseContext = createContext(null);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* Wrap app with Supabase context provider */}
    <SupabaseContext.Provider value={supabase}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/create-profile" element={<ProfileCreation />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            {/* ADD ALL CUSTOM ROUTES BELOW THE CATCH-ALL "*" ROUTE */}
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SupabaseContext.Provider>
  </QueryClientProvider>
);

export default App;
