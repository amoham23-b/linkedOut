import { createClient } from "@/utils/supabase/client";

// Type definition for user profile
export interface UserProfile {
  uid: string;
  display_name: string;
  headline: string;
  location: string;
  about: string;
  photo_url: string;
  email: string;
  skills: string[];
  connections: string[];
  profile_completed: boolean;
}

// Function to check if user is authenticated
export const checkUserAuth = async () => {
  const supabase = createClient();
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !sessionData.session) {
    return { isAuthenticated: false, userId: null, user: null };
  }
  
  return { 
    isAuthenticated: true, 
    userId: sessionData.session.user.id,
    user: sessionData.session.user
  };
};

// Function to fetch user profile from Supabase
export const fetchUserProfile = async () => {
  const supabase = createClient();
  
  try {
    // Check auth status first
    const { isAuthenticated, userId, user: authUser } = await checkUserAuth();
    
    if (!isAuthenticated || !userId) {
      return { profile: null, isAuthenticated: false };
    }
    
    // Fetch profile data
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('uid', userId)
      .single();
      
    if (error) {
      console.error('Error fetching profile:', error);
      return { 
        profile: null, 
        isAuthenticated: true,
        authUser
      };
    }
    
    return { 
      profile: data, 
      isAuthenticated: true,
      authUser
    };
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return { profile: null, isAuthenticated: false };
  }
};

// Function to logout
export const logoutUser = async () => {
  const supabase = createClient();
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Error signing out:", error);
    return { success: false };
  }
};