import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { BriefcaseBusiness, Bell, MessageCircle, Search, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { logoutUser } from "@/utils/SupabaseUserUtil";
import { supabase } from "@/App";

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        console.log({
          title: "Authentication Required",
          description: "Please log in to view your profile",
          variant: "destructive",
        });
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('uid', sessionData.session.user.id)
        .single();
      
      setData(data);
      setIsLoggedIn(true);
      setLoading(false);
    };
    
    loadUserData();
  }, []);
  
  const handleRefresh = async () => {
    setLoading(true);
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('uid', sessionData.session.user.id)
      .single();
    
    setData(data);
    setIsLoggedIn(true);
    setLoading(false);
  };
  
  const handleAuthAction = async () => {
    if (isLoggedIn) {
      const { success } = await logoutUser();
      if (success) {
        setData({});
        setIsLoggedIn(false);
        navigate("/");
      }
    } else {
      navigate("/login");
    }
  };
  
  // Get avatar url and display name, with fallbacks
  const avatarUrl = data?.photo_url || "/default-avatar.png";
  const displayName = data?.display_name || "User";
  const initials = displayName.substring(0, 2).toUpperCase();
  
  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto py-2 px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigate("/")}
              className="flex items-center space-x-1 font-bold text-linkedout-blue text-xl"
            >
              <BriefcaseBusiness size={28} />
              <span>LinkedOut</span>
            </button>
          </div>
          
          {/* Search */}
          <div className="hidden md:flex relative flex-1 max-w-sm mx-4">
            <Input 
              type="text"
              placeholder="Search for cringeworthy posts..."
              className="w-full pl-9"
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          
          {/* Nav Icons */}
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => navigate("/messages")} 
              variant="ghost" 
              size="sm" 
              className="flex flex-col items-center text-xs"
            >
              <MessageCircle size={20} />
              <span>Messages</span>
            </Button>
            
            <Button 
              onClick={() => navigate("/")} 
              variant="ghost" 
              size="sm" 
              className="flex flex-col items-center text-xs"
            >
              <Bell size={20} />
              <span>Notifications</span>
            </Button>
            
            <Button 
              onClick={() => navigate("/profile")} 
              variant="ghost" 
              size="sm" 
              className="flex flex-col items-center text-xs"
            >
              <Avatar className="h-7 w-7">
                <AvatarImage 
                  src={avatarUrl} 
                  alt={displayName}
                />
                <AvatarFallback>
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span>Profile</span>
            </Button>
            
            <Button 
              onClick={handleAuthAction} 
              variant="outline" 
              size="sm"
              className="hidden md:flex"
            >
              {isLoggedIn ? (
                <>
                  <LogOut size={16} className="mr-1" />
                  Logout
                </>
              ) : (
                <>
                  <User size={16} className="mr-1" />
                  Login
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;