// src/components/ProfileSidebar.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { currentUser } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

const ProfileSidebar = () => {
  return (
    <div className="w-full">
      <Card className="mb-4">
        <CardHeader className="pb-2 text-center bg-linkedout-gray">
          <div className="flex justify-center">
            <Link to="/profile">
              <Avatar className="h-24 w-24 border-4 border-white">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="text-center pt-3">
          <Link to="/profile" className="hover:underline">
            <h3 className="font-bold text-lg">{currentUser.name}</h3>
          </Link>
          <p className="text-sm text-gray-500">{currentUser.title}</p>
          {/* Profile Badges */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <Badge variant="outline" className="bg-linkedout-gray">Professional Complainer</Badge>
            <Badge variant="outline" className="bg-linkedout-gray">Resume Enthusiast</Badge>
          </div>
          {/* Profile Stats */}
          <div className="mt-4 pt-4 border-t">
            <div className="text-xs text-gray-500">YOUR STATS</div>
            <div className="flex justify-around mt-2">
              <div>
                <div className="font-bold">14</div>
                <div className="text-xs text-gray-500">Vents</div>
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
    </div>
  );
};

export default ProfileSidebar;
