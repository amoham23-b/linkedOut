import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useUser } from "../../context/UserContext";

const ProfileSidebar = () => {
  const { user, isLoggedIn } = useUser();
  
  // If not logged in or no user data, show login prompt
  if (!isLoggedIn || !user) {
    return (
      <div className="w-full">
        <Card className="mb-4">
          <CardContent className="text-center pt-6 pb-6">
            <h3 className="font-bold text-lg mb-4">Join LinkedOut Today</h3>
            <p className="text-sm text-gray-500 mb-4">Connect with colleagues and share your professional journey</p>
            <Link to="/login">
              <Button variant="default" size="default" className="w-full">
                <User className="mr-2 h-4 w-4" />
                Login or Sign Up
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <Card className="mb-4">
        <CardHeader className="pb-2 text-center bg-linkedout-gray">
          <div className="flex justify-center">
            <Link to="/profile">
              <Avatar className="h-24 w-24 border-4 border-white">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="text-center pt-3">
          <Link to="/profile" className="hover:underline">
            <h3 className="font-bold text-lg">{user.name}</h3>
          </Link>
          <p className="text-sm text-gray-500">{user.title}</p>
          
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <Badge variant="outline" className="bg-linkedout-gray">Professional Complainer</Badge>
            <Badge variant="outline" className="bg-linkedout-gray">Resume Enthusiast</Badge>
            <Badge variant="outline" className="bg-linkedout-gray">Coffee Cup Collector</Badge>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="text-xs text-gray-500">YOUR STATS</div>
            <div className="flex justify-around mt-2">
              <div>
                <div className="font-bold">14</div>
                <div className="text-xs text-gray-500">Vents</div>
              </div>
              <div>
                <div className="font-bold">253</div>
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
                <User className="mr-2 h-4 w-4" />
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