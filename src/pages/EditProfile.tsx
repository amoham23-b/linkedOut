import React, { useState, useEffect, useContext } from "react";
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
import { BriefcaseBusiness, MapPin, Plus, Trash2 } from "lucide-react";
import { SupabaseContext } from "@/App";
import ProfilePhotoInput from "@/components/ProfilePhotoInput";

const EditProfile = () => {
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const supabase = useContext(SupabaseContext);

  // Store the authenticated user in state
  const [user, setUser] = useState<any>(null);

  // Profile data state – using camelCase in React.
  const [profileData, setProfileData] = useState({
    displayName: "",
    headline: "",
    location: "",
    about: "",
    photoURL: "",
    // We'll only allow editing basic info and skills here for simplicity.
    skills: [""],
  });

  // Check if user is logged in and load profile data.
  useEffect(() => {
    const fetchProfile = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        toast({
          title: "Authentication Required",
          description: "You must be logged in to edit your profile.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }
      const currentUser = sessionData.session.user;
      setUser(currentUser);
      const { data: profile, error: profileError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("uid", currentUser.id)
        .single();
      if (profileError) {
        toast({
          title: "Error fetching profile",
          description: profileError.message,
          variant: "destructive",
        });
        return;
      }
      // Map database fields to local state.
      setProfileData({
        displayName: profile.display_name || "",
        headline: profile.headline || "",
        location: profile.location || "",
        about: profile.about || "",
        photoURL: profile.photo_url || "",
        skills: profile.skills || [""],
      });
      setPreviewUrl(profile.photo_url || null);
    };
    fetchProfile();
  }, [supabase, navigate, toast]);

  // Handle selection of a photo (either from camera or file upload)
  const handlePhotoSelect = (file: File) => {
    setProfilePicture(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Clear the selected photo
  const handleClearPhoto = () => {
    setProfilePicture(null);
    setPreviewUrl(profileData.photoURL);
  };

  // Handle input changes.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...profileData.skills];
    updatedSkills[index] = value;
    setProfileData({ ...profileData, skills: updatedSkills });
  };

  const addSkill = () => {
    setProfileData({ ...profileData, skills: [...profileData.skills, ""] });
  };

  const removeSkill = (index: number) => {
    const updatedSkills = profileData.skills.filter((_, i) => i !== index);
    setProfileData({ ...profileData, skills: updatedSkills });
  };

  // Handle form submission: update the profile.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) {
        throw new Error("No authenticated user found");
      }

      // Upload new profile picture if one is selected.
      let photoURL = profileData.photoURL;
      if (profilePicture) {
        const filePath = `${user.id}/${profilePicture.name}`;
        console.log("Uploading file to path:", filePath);
        const { error: uploadError } = await supabase
          .storage
          .from("newprofilephoto")
          .upload(filePath, profilePicture, { upsert: true });
        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw uploadError;
        }
        const { data: publicData } = supabase
          .storage
          .from("newprofilephoto")
          .getPublicUrl(filePath);
        photoURL = publicData.publicUrl;
        console.log("New Photo URL:", photoURL);
      }

      // Construct update object with snake_case keys.
      const profileUpdate = {
        display_name: profileData.displayName,
        headline: profileData.headline,
        location: profileData.location,
        about: profileData.about,
        photo_url: photoURL,
        skills: profileData.skills.filter((skill) => skill.trim() !== ""),
      };

      console.log("Updating profile with:", profileUpdate);

      // Update the user_profiles row.
      const { error: updateError } = await supabase
        .from("user_profiles")
        .update(profileUpdate)
        .eq("uid", user.id);
      if (updateError) {
        console.error("Update error:", updateError);
        throw updateError;
      }

      toast({
        title: "Profile Updated!",
        description: "Your profile has been updated successfully.",
      });
      navigate("/profile");
    } catch (error: any) {
      toast({
        title: "Profile Update Failed",
        description: error.message,
        variant: "destructive",
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
          <p className="text-gray-600 mt-2">Update your professional profile</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Edit Your Profile</CardTitle>
            <CardDescription>Update your details and save changes</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture Upload with Camera */}
              <div className="flex flex-col items-center mb-6">
                <ProfilePhotoInput 
                  previewUrl={previewUrl}
                  onPhotoSelect={handlePhotoSelect}
                  onClear={handleClearPhoto}
                />
              </div>

              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <div className="space-y-2">
                  <label htmlFor="displayName" className="text-sm font-medium">Full Name</label>
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
                  <label htmlFor="headline" className="text-sm font-medium">Professional Headline</label>
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
                  <label htmlFor="location" className="text-sm font-medium">Location</label>
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
                  <label htmlFor="about" className="text-sm font-medium">About</label>
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
                {loading ? "Updating Profile..." : "Update Profile"}
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

export default EditProfile;