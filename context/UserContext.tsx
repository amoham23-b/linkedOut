""
import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { createClient } from "../src/utils/supabase/client";

// Update User type to match both your current code and database schema
export type User = {
  id: string;
  name: string;
  display_name?: string; // From Supabase
  title: string;
  headline?: string; // From Supabase
  avatar: string;
  photo_url?: string; // From Supabase
  location?: string;
  bio?: string;
  about?: string; // From Supabase
  email?: string;
  skills?: string[];
  connections?: string[];
  profile_completed?: boolean;
};

type UserContextType = {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
  refreshUserData: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Function to fetch user data from Supabase
  const fetchUserFromSupabase = async () => {
    try {
      // Get the currently authenticated user
      // Check if user is authenticated
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
      if (sessionError || !sessionData.session) {
        console.log({
          title: "Authentication Required",
          description: "Please log in to view your profile",
          variant: "destructive",
        });
        return;
      }
      
      await supabase.auth.getUser().then(({ data: { user }, error }) => {
        if (error) {
          console.error("Error fetching user:", error);
          setIsLoggedIn(false);
          setUser(null);
          return;
        }
        
        setUser(user);
        console.log(user);
        setIsLoggedIn(true);
      });
      
      setIsLoggedIn(true);
      
      // Get the user profile data from your profiles table
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('uid', user.id)
        .single();
      
      if (error) {
        console.error("Error fetching user profile:", error);
        
        // Create a basic user object from auth data if profile not found
        const basicUser: User = {
          id: user.id,
          name: user.email?.split('@')[0] || "User",
          title: "LinkedOut User",
          avatar: "/default-avatar.png",
          email: user.email,
          skills: [],
          connections: []
        };
        
        setUser(basicUser);
        return;
      }
      
      if (data) {
        // Map database fields to your User type
        const userData: User = {
          id: data.uid || user.id,
          name: data.display_name || user.email?.split('@')[0] || "User",
          display_name: data.display_name,
          title: data.headline || "Professional Title",
          headline: data.headline,
          avatar: data.photo_url || "/default-avatar.png",
          photo_url: data.photo_url,
          location: data.location,
          bio: data.about,
          about: data.about,
          email: user.email,
          skills: data.skills || [],
          connections: data.connections || [],
          profile_completed: data.profile_completed
        };
        
        setUser(userData);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  // Initialize user on component mount
  useEffect(() => {
    const initializeUser = async () => {
      try {
        await fetchUserFromSupabase();
      } catch (error) {
        console.error("Error initializing user:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeUser();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setIsLoggedIn(true);
          fetchUserFromSupabase();
        } else if (event === 'SIGNED_OUT') {
          setIsLoggedIn(false);
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = () => {
    // This function is now just a placeholder as login is handled by Supabase UI components
    // But we keep it for compatibility with your existing code
    fetchUserFromSupabase();
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setIsLoggedIn(false);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // Update in Supabase
      try {
        const { error } = await supabase
          .from('user_profiles')
          .upsert({
            uid: user.id,
            display_name: updatedUser.display_name || updatedUser.name,
            headline: updatedUser.headline || updatedUser.title,
            location: updatedUser.location,
            about: updatedUser.about || updatedUser.bio,
            photo_url: updatedUser.photo_url || updatedUser.avatar,
            skills: updatedUser.skills,
            connections: updatedUser.connections,
            profile_completed: updatedUser.profile_completed,
            email: updatedUser.email
          });
          
        if (error) throw error;
      } catch (error) {
        console.error("Error updating user profile:", error);
      }
    }
  };

  // Function to manually refresh user data
  const refreshUserData = async () => {
    await fetchUserFromSupabase();
  };

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        isLoggedIn, 
        loading, 
        login, 
        logout, 
        updateUserProfile,
        refreshUserData 
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};