import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RefreshCw, User as UserIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchUserProfile } from "@/utils/SupabaseUserUtil";
import { supabase } from "@/App";

const ProfileSidebar = () => {
  const [profile, setProfile] = useState<any>({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<any>({});
  
 
  
  useEffect(() => {
    const loadUserData = async () => {
      // setLoading(true);
      // const { profile, isAuthenticated } = await fetchUserProfile();
      // setProfile(profile);
      // setIsLoggedIn(isAuthenticated);
      // setLoading(false);
     
      // console.log(profile)
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        console.log({
          title: "Authentication Required",
          description: "Please log in to view your profile",
          variant: "destructive",
        });
        setIsLoggedIn(false);
        return;
      }
      const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('uid', sessionData.session.user.id)
      .single();
      setData(data);
    };
    loadUserData();
  }, []);


  console.log(data)
  
  // Handle refresh click
  // const handleRefresh = async () => {
  //   setRefreshing(true);
  //   await loadUserData();
  //   setTimeout(() => setRefreshing(false), 500);
  // };
  
  // Show loading state while data is being fetched
  if (loading) {
    return (
      <div className="w-full">
        <Card className="mb-4">
          <CardContent className="text-center py-6">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-gray-200 h-24 w-24 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // If not logged in or no user data, show login prompt
  // if (!isLoggedIn || !profile) {
  //   return (
  //     <div className="w-full">
  //       <Card className="mb-4">
  //         <CardContent className="text-center pt-6 pb-6">
  //           <h3 className="font-bold text-lg mb-4">Join LinkedOut Today</h3>
  //           <p className="text-sm text-gray-500 mb-4">Connect with colleagues and share your professional journey</p>
  //           <Link to="/login">
  //             <Button variant="default" size="default" className="w-full">
  //               <UserIcon className="mr-2 h-4 w-4" />
  //               Login or Sign Up
  //             </Button>
  //           </Link>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   );
  // }
  
  // Get values from profile data
  const displayName = data.display_name || "User";
  const headline = data.headline || "Professional";
  const avatarSrc = data.photo_url || "/default-avatar.png";
  const location = data.location || "Location not specified";
  const skills = data.skills || [];
  const connections = data.connections?.length || 253;

  
  return (
    <div className="w-full">
      <Card className="mb-4">
        <CardHeader className="pb-2 text-center bg-linkedout-gray relative">
          <button 
            // onClick={handleRefresh}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            title="Refresh profile data"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <div className="flex justify-center">
            <Link to="/profile">
              <Avatar className="h-24 w-24 border-4 border-white">
                <AvatarImage src={avatarSrc} alt={displayName} />
                <AvatarFallback>{displayName.substring(0, 2)}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="text-center pt-3">
          <Link to="/profile" className="hover:underline">
            <h3 className="font-bold text-lg">{displayName}</h3>
          </Link>
          <p className="text-sm text-gray-500">{headline}</p>
          <p className="text-xs text-gray-500 mt-1">{location}</p>
          
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {skills && skills.length > 0 ? (
              skills.slice(0, 3).map((skill: string, index: number) => (
                <Badge key={index} variant="outline" className="bg-linkedout-gray">
                  {skill}
                </Badge>
              ))
            ) : (
              <>
                <Badge variant="outline" className="bg-linkedout-gray">Professional Complainer</Badge>
                <Badge variant="outline" className="bg-linkedout-gray">Resume Enthusiast</Badge>
                <Badge variant="outline" className="bg-linkedout-gray">Coffee Cup Collector</Badge>
              </>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="text-xs text-gray-500">YOUR STATS</div>
            <div className="flex justify-around mt-2">
              <div>
                <div className="font-bold">14</div>
                <div className="text-xs text-gray-500">Vents</div>
              </div>
              <div>
                <div className="font-bold">{connections}</div>
                <div className="text-xs text-gray-500">Connections</div>
              </div>
              <div>
                <div className="font-bold">42</div>
                <div className="text-xs text-gray-500">Rejections</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-2">
            <Link to="/profile">
              <Button variant="outline" size="sm" className="w-full">
                <UserIcon className="mr-2 h-4 w-4" />
                View Full Profile
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-4">
          <h4 className="font-semibold text-sm mb-2">TRENDING CORPORATE BUZZWORDS</h4>
          <ul className="text-sm space-y-2">
            <li className="text-linkedout-blue">#SynergizeYourPassion</li>
            <li className="text-linkedout-blue">#DisruptionMindset</li>
            <li className="text-linkedout-blue">#ThoughtLeadership</li>
            <li className="text-linkedout-blue">#HumbleBrag</li>
            <li className="text-linkedout-blue">#GratefulAndBlessed</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSidebar;