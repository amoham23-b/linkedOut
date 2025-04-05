import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "../components/ui/separator";
import { useToast } from "@/hooks/use-toast"
import {
  MapPin,
  Briefcase,
  BookOpen,
  Calendar,
  Edit,
  Plus,
  MessageSquare,
  UserPlus,
  Share2,
  ThumbsUp
} from "lucide-react";
import { getCurrentUser } from '@/lib/authService';
import { getUserProfile, UserProfile } from '@/lib/userProfileService';

const UserProfilePage = () => {
  const { uid } = useParams<{ uid: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const currentUser = getCurrentUser();
        
        if (!currentUser) {
          navigate('/login');
          return;
        }

        // If no UID provided in URL, show current user's profile
        const profileUid = uid || currentUser.uid;
        
        // Check if viewing own profile
        setIsOwnProfile(currentUser.uid === profileUid);
        
        const userProfile = await getUserProfile(profileUid);
        setProfile(userProfile);
      } catch (error) {
        toast({
          title: "Error",
          description: "Could not load profile. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [uid, navigate, toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-linkedout-blue"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
        <p className="text-gray-600 mb-4">The profile you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/')} className="bg-linkedout-blue">
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linkedout-gray/30 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header Card */}
        <Card>
          {/* Cover Photo */}
          <div className="h-32 bg-gradient-to-r from-linkedout-blue to-blue-400 relative">
            {isOwnProfile && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                onClick={() => navigate('/profile/edit')}
              >
                <Edit size={16} className="mr-1" /> Edit Profile
              </Button>
            )}
          </div>
          
          <CardHeader className="flex flex-col md:flex-row md:items-end pt-0 pb-4">
            {/* Profile Picture */}
            <div className="rounded-full bg-white p-1 shadow-md w-32 h-32 -mt-16 overflow-hidden">
              {profile.photoURL ? (
                <img 
                  src={profile.photoURL} 
                  alt={profile.displayName} 
                  className="w-full h-full rounded-full object-cover" 
                />
              ) : (
                <div className="w-full h-full rounded-full bg-linkedout-gray/30 flex items-center justify-center">
                  <span className="text-4xl font-bold text-gray-400">
                    {profile.displayName.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex-1 mt-4 md:mt-0 md:ml-4">
              <h1 className="text-2xl font-bold">{profile.displayName}</h1>
              <p className="text-lg font-semibold">{profile.headline}</p>
              <p className="text-sm text-gray-500">{profile.location}</p>
            </div>
          </CardHeader>
          
          <CardContent className="pt-4 pb-6">
            <div className="space-y-4">
              <div>
                <h2 className="font-bold text-xl">About</h2>
                <p>{profile.about}</p>
              </div>

              <div>
                <h2 className="font-bold text-xl">Experience</h2>
                {profile.experience.length === 0 ? (
                  <p>No experience listed</p>
                ) : (
                  <ul className="space-y-4">
                    {profile.experience.map((exp) => (
                      <li key={exp.id}>
                        <h3 className="font-semibold">{exp.title}</h3>
                        <p className="text-gray-600">{exp.company}</p>
                        <p className="text-sm text-gray-400">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</p>
                        <p>{exp.description}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h2 className="font-bold text-xl">Education</h2>
                {profile.education.length === 0 ? (
                  <p>No education listed</p>
                ) : (
                  <ul className="space-y-4">
                    {profile.education.map((edu) => (
                      <li key={edu.id}>
                        <h3 className="font-semibold">{edu.degree} in {edu.fieldOfStudy}</h3>
                        <p className="text-gray-600">{edu.school}</p>
                        <p className="text-sm text-gray-400">{edu.startDate} - {edu.endDate}</p>
                        <p>{edu.description}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <h2 className="font-bold text-xl">Skills</h2>
                {profile.skills.length === 0 ? (
                  <p>No skills listed</p>
                ) : (
                  <ul className="space-y-2">
                    {profile.skills.map((skill, index) => (
                      <li key={index} className="text-sm text-gray-600">{skill}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </CardContent>

          <div className="flex justify-center text-gray-500 text-xs">
            <p>You can always edit your profile information later</p>
          </div>

        </Card>

        {/* Profile Actions */}
        {isOwnProfile && (
          <div className="flex justify-center space-x-4 mt-6">
            <Button variant="outline" onClick={() => navigate('/profile/edit')}>
              Edit Profile
            </Button>
            <Button variant="outline" onClick={() => navigate('/profile/connections')}>
              View Connections
            </Button>
            <Button variant="outline" onClick={() => navigate('/profile/posts')}>
              View Posts
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;

              