// src/components/Header.tsx
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { BriefcaseBusiness, Bell, MessageCircle, Search, User } from "lucide-react";
import { currentUser } from "@/data/mockData";

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto py-2 px-4">
        <div className="flex items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-2">
            <button onClick={() => navigate("/")} className="flex items-center space-x-1 font-bold text-linkedout-blue text-xl">
              <BriefcaseBusiness size={28} />
              <span>LinkedOut</span>
            </button>
          </div>
          {/* Search Input */}
          <div className="hidden md:flex relative flex-1 max-w-sm mx-4">
            <Input type="text" placeholder="Search for cringeworthy posts..." className="w-full pl-9" />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          {/* Navigation Buttons */}
          <div className="flex items-center space-x-4">
            <Button onClick={() => navigate("/")} variant="ghost" size="sm" className="flex flex-col items-center text-xs">
              <MessageCircle size={20} />
              <span>Messages</span>
            </Button>
            <Button onClick={() => navigate("/")} variant="ghost" size="sm" className="flex flex-col items-center text-xs">
              <Bell size={20} />
              <span>Notifications</span>
            </Button>
            <Button onClick={() => navigate("/profile")} variant="ghost" size="sm" className="flex flex-col items-center text-xs">
              <Avatar className="h-7 w-7">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <span>Profile</span>
            </Button>
            <Button onClick={() => navigate("/login")} variant="outline" size="sm" className="hidden md:flex">
              <User size={16} className="mr-1" />
              Login
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
