import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { BriefcaseBusiness, MapPin, Camera, Plus, Trash2 } from "lucide-react";
import { getCurrentUser } from "@/lib/authService";
import { completeProfileSetup, uploadProfilePicture } from "@/lib/userProfileService";

const ProfileSetup = () => {
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Profile data
  const [profileData, setProfileData] = useState({
    displayName: "",
    headline: "",
    location: "",
    about: "",
    currentPosition: {
      title: "",
      company: "",
    },
    education: {
      school: "",
      degree: "",
      fieldOfStudy: "",
    },
    skills: ["", "", ""],
  });

  useEffect(() => {
    // Check if user is logged in
    const user = getCurrentUser();
    // if (!user) {
    //   navigate("/login");
    // }
  }, [navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...profileData.skills];
    updatedSkills[index] = value;
    setProfileData({ ...profileData, skills: updatedSkills });
  };

  const addSkill = () => {
    setProfileData({
      ...profileData,
      skills: [...profileData.skills, ""]
    });
  };

  const removeSkill = (index: number) => {
    const updatedSkills = profileData.skills.filter((_, i) => i !== index);
    setProfileData({ ...profileData, skills: updatedSkills });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested objects
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      const parentData = profileData[parent as keyof typeof profileData];
  
      if (typeof parentData === "object" && parentData !== null) {
        setProfileData({
          ...profileData,
          [parent]: {
            ...parentData,
            [child]: value,
          },
        });
      } else {
        console.error(`Expected ${parent} to be an object, but got:`, parentData);
      }
    } else {
      setProfileData({ ...profileData, [name]: value });
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = getCurrentUser();
      if (!user) throw new Error("No authenticated user found");

      // Format the data for Firestore
      const formattedData = {
        displayName: profileData.displayName,
        headline: profileData.headline,
        location: profileData.location,
        about: profileData.about,
        skills: profileData.skills.filter(skill => skill.trim() !== ""),
        experience: [{
          id: Date.now().toString(),
          title: profileData.currentPosition.title,
          company: profileData.currentPosition.company,
          location: profileData.location,
          startDate: new Date().toISOString().split('T')[0],
          endDate: "",
          current: true,
          description: ""
        }],
        education: [{
          id: Date.now().toString(),
          school: profileData.education.school,
          degree: profileData.education.degree,
          fieldOfStudy: profileData.education.fieldOfStudy,
          startDate: "",
          endDate: "",
          description: ""
        }]
      };

      // Upload profile picture if selected
      if (profilePicture) {
        await uploadProfilePicture(profilePicture);
      }

      // Complete profile setup
      await completeProfileSetup(formattedData);

      toast({
        title: "Profile Created!",
        description: "Your LinkedOut profile is ready to impress absolutely no one.",
      });

      navigate("/profile");
    } catch (error) {
      toast({
        title: "Profile Setup Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linkedout-gray/30 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-linkedout-blue flex items-center justify-center gap-2">
            <BriefcaseBusiness size={32} />
            LinkedOut
          </h1>
          <p className="text-gray-600 mt-2">
            Set up your professional profile
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Your Profile</CardTitle>
            <CardDescription>
              Fill in your details to create your professional presence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture Upload */}
              <div className="flex flex-col items-center mb-6">
                <div 
                  className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden relative mb-2"
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Profile preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera size={32} className="text-gray-400" />
                  )}
                </div>
                <label htmlFor="profile-picture" className="cursor-pointer text-linkedout-blue hover:underline flex items-center">
                  <Camera size={16} className="mr-1" />
                  {previewUrl ? "Change Photo" : "Upload Photo"}
                </label>
                <input
                  id="profile-picture"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                
                <div className="space-y-2">
                  <label htmlFor="displayName" className="text-sm font-medium">
                    Full Name
                  </label>
                  <Input
                    id="displayName"
                    name="displayName"
                    value={profileData.displayName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="headline" className="text-sm font-medium">
                    Professional Headline
                  </label>
                  <Input
                    id="headline"
                    name="headline"
                    value={profileData.headline}
                    onChange={handleChange}
                    placeholder="Software Engineer | React Developer | Coffee Enthusiast"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="location" className="text-sm font-medium">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <Input
                      id="location"
                      name="location"
                      value={profileData.location}
                      onChange={handleChange}
                      className="pl-9"
                      placeholder="San Francisco, CA"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="about" className="text-sm font-medium">
                    About
                  </label>
                  <Textarea
                    id="about"
                    name="about"
                    value={profileData.about}
                    onChange={handleChange}
                    placeholder="Tell us about yourself and your professional journey..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Current Position */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Current Position</h3>
                
                <div className="space-y-2">
                  <label htmlFor="currentPosition.title" className="text-sm font-medium">
                    Job Title
                  </label>
                  <Input
                    id="currentPosition.title"
                    name="currentPosition.title"
                    value={profileData.currentPosition.title}
                    onChange={handleChange}
                    placeholder="Software Engineer"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="currentPosition.company" className="text-sm font-medium">
                    Company
                  </label>
                  <Input
                    id="currentPosition.company"
                    name="currentPosition.company"
                    value={profileData.currentPosition.company}
                    onChange={handleChange}
                    placeholder="Tech Company Inc."
                  />
                </div>
              </div>

              {/* Education */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Education</h3>
                
                <div className="space-y-2">
                  <label htmlFor="education.school" className="text-sm font-medium">
                    School/University
                  </label>
                  <Input
                    id="education.school"
                    name="education.school"
                    value={profileData.education.school}
                    onChange={handleChange}
                    placeholder="University of Technology"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="education.degree" className="text-sm font-medium">
                      Degree
                    </label>
                    <Input
                      id="education.degree"
                      name="education.degree"
                      value={profileData.education.degree}
                      onChange={handleChange}
                      placeholder="Bachelor's"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="education.fieldOfStudy" className="text-sm font-medium">
                      Field of Study
                    </label>
                    <Input
                      id="education.fieldOfStudy"
                      name="education.fieldOfStudy"
                      value={profileData.education.fieldOfStudy}
                      onChange={handleChange}
                      placeholder="Computer Science"
                    />
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Skills</h3>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addSkill}
                    className="flex items-center gap-1"
                  >
                    <Plus size={16} /> Add Skill
                  </Button>
                </div>
                
                {profileData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={skill}
                      onChange={(e) => handleSkillChange(index, e.target.value)}
                      placeholder={`Skill ${index + 1}`}
                      className="flex-1"
                    />
                    {index > 2 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeSkill(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={18} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-linkedout-blue" 
                disabled={loading}
              >
                {loading ? "Creating Profile..." : "Complete Profile Setup"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center text-gray-500 text-xs">
            <p>You can always edit your profile information later</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup;