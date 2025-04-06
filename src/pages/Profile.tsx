import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import ResumeOptimizer from "@/components/ResumeOptimizer";
import { SupabaseContext } from "@/App";
import { useToast } from "@/hooks/use-toast";

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

interface Experience {
  id: string;
  user_id: string;
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string | null;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  user_id: string;
  school: string;
  degree: string;
  field_of_study: string;
  start_date: string | null;
  end_date: string | null;
  description: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const supabase = useContext(SupabaseContext);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Check if user is authenticated
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !sessionData.session) {
          toast({
            title: "Authentication Required",
            description: "Please log in to view your profile",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }
        
        const userId = sessionData.session.user.id;
        
        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('uid', userId)
          .single();
          
        if (profileError) {
          console.error('Error fetching profile:', profileError);
          if (profileError.code === 'PGRST116') {
            // Record not found
            navigate("/create-profile");
            return;
          }
          throw profileError;
        }
        
        setProfile(profileData);
        
        // Fetch experiences
        const { data: experienceData, error: experienceError } = await supabase
          .from('experiences')
          .select('*')
          .eq('user_id', userId)
          .order('current', { ascending: false })
          .order('end_date', { ascending: false, nullsFirst: true });
          
        if (experienceError) {
          console.error('Error fetching experiences:', experienceError);
        } else {
          setExperiences(experienceData || []);
        }
        
        // Fetch education
        const { data: educationData, error: educationError } = await supabase
          .from('educations')
          .select('*')
          .eq('user_id', userId)
          .order('end_date', { ascending: false, nullsFirst: true });
          
        if (educationError) {
          console.error('Error fetching education:', educationError);
        } else {
          setEducations(educationData || []);
        }
      } catch (error) {
        console.error('Error in profile data fetching:', error);
        toast({
          title: "Error Loading Profile",
          description: "There was a problem loading your profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  }, [supabase, navigate, toast]);

  // Format date to display in a readable format
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linkedout-gray/30">
        <Header />
        <div className="container mx-auto py-8 px-4 flex justify-center items-center">
          <div className="text-center">
            <p className="text-xl text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-linkedout-gray/30">
        <Header />
        <div className="container mx-auto py-8 px-4 flex justify-center items-center">
          <div className="text-center">
            <p className="text-xl text-gray-600 mb-4">No profile found</p>
            <Button onClick={() => navigate("/create-profile")} className="bg-linkedout-blue">
              Create Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linkedout-gray/30">
      <Header />
      
      <main className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader className="bg-linkedout-gray pb-0">
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-4">
                  <div className="h-24 w-24 rounded-full border-4 border-white overflow-hidden">
                    <img 
                      src={profile.photo_url || "/default-avatar.png"} 
                      alt={profile.display_name} 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/default-avatar.png"; // Fallback image
                      }}
                    />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold">{profile.display_name}</CardTitle>
                    <p className="text-gray-600">{profile.headline}</p>
                    <p className="text-gray-500 text-sm mt-1">{profile.location}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => navigate("/edit-profile")}
                >
                  <Pencil size={16} /> Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {profile.about && (
                  <div>
                    <h3 className="text-lg font-semibold">About</h3>
                    <p className="text-gray-700 mt-2">
                      {profile.about}
                    </p>
                  </div>
                )}
                
                {experiences.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold">Experience</h3>
                    <div className="mt-2 space-y-4">
                      {experiences.map((exp) => (
                        <div key={exp.id} className="border-l-2 border-linkedout-blue pl-4">
                          <h4 className="font-medium">{exp.title}</h4>
                          <p className="text-sm text-gray-600">{exp.company} • {formatDate(exp.start_date)} - {formatDate(exp.end_date)}</p>
                          {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                          {exp.description && <p className="text-sm mt-1">{exp.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {educations.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold">Education</h3>
                    <div className="mt-2 space-y-4">
                      {educations.map((edu) => (
                        <div key={edu.id}>
                          <h4 className="font-medium">{edu.school}</h4>
                          <p className="text-sm text-gray-600">
                            {edu.degree}{edu.field_of_study ? ` • ${edu.field_of_study}` : ''}
                            {edu.start_date || edu.end_date ? ` • ${formatDate(edu.start_date)} - ${formatDate(edu.end_date)}` : ''}
                          </p>
                          {edu.description && <p className="text-sm mt-1">{edu.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {profile.skills?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold">Skills</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-linkedout-gray rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <ResumeOptimizer />
        </div>
      </main>
    </div>
  );
};

export default Profile;