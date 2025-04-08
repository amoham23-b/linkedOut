import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SupabaseContext } from '../App';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { BriefcaseBusiness } from 'lucide-react';
import ProfilePhotoInput from '@/components/ProfilePhotoInput';

const ProfileCreation = () => {
  const supabase = useContext(SupabaseContext);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form state
  const [formData, setFormData] = useState({
    display_name: '',
    headline: '',
    location: '',
    about: '',
    jobTitle: '',
    company: '',
    school: '',
    degree: '',
    fieldOfStudy: '',
    skills: ['']
  });
  
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');
  
  // Check if user is authenticated and get user ID
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        navigate('/login');
        return;
      }
      
      const uid = data.session.user.id;
      setUserId(uid);
      
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('uid', uid)
        .single();
        
      if (existingProfile) {
        // If profile exists, navigate to feed/index instead
        navigate('/');
        toast({
          title: "Profile already exists",
          description: "You already have a profile. Redirecting to feed.",
          variant: "default"
        });
      }
    };
    
    checkAuth();
  }, [navigate, supabase, toast]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSkillChange = (index, value) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index] = value;
    setFormData(prev => ({
      ...prev,
      skills: updatedSkills
    }));
  };
  
  const addSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };
  
  // Handle photo selection (either from camera or file upload)
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
    setPreviewUrl(null);
  };
  
  const generateRandomId = () => {
    // Simple random ID generator without uuid dependency
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // Filter out empty skills
      const filteredSkills = formData.skills.filter(skill => skill.trim() !== '');
      
      // Upload profile picture if one is selected
      let photoURL = null;
      if (profilePicture) {
        const filePath = `${userId}/${profilePicture.name}`;
        
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
      }
      
      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          uid: userId,
          display_name: formData.display_name,
          headline: formData.headline,
          location: formData.location,
          about: formData.about,
          email: (await supabase.auth.getUser()).data.user.email,
          photo_url: photoURL,
          skills: filteredSkills,
          profile_completed: true
        });
        
      if (profileError) throw profileError;
      
      // Add current experience if provided
      if (formData.jobTitle && formData.company) {
        const { error: expError } = await supabase
          .from('experiences')
          .insert({
            id: generateRandomId(),
            user_id: userId,
            title: formData.jobTitle,
            company: formData.company,
            current: true
          });
          
        if (expError) throw expError;
      }
      
      // Add education if provided
      if (formData.school && formData.degree) {
        const { error: eduError } = await supabase
          .from('educations')
          .insert({
            id: generateRandomId(),
            user_id: userId,
            school: formData.school,
            degree: formData.degree,
            field_of_study: formData.fieldOfStudy
          });
          
        if (eduError) throw eduError;
      }
      
      toast({
        title: "Profile created successfully",
        description: "Your profile has been set up successfully.",
        variant: "default"
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error creating profile:', error);
      setError(error.message || 'Failed to create profile');
      
      toast({
        title: "Profile Setup Failed",
        description: error.message || "An error occurred while creating your profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-linkedout-blue flex items-center justify-center gap-2">
          <BriefcaseBusiness size={32} />
          LinkedOut
        </h1>
        <p className="text-gray-600 mt-2">Create Your Professional Profile</p>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          {/* Profile Photo Input */}
          <div className="mb-6 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4 text-center">Profile Photo</h2>
            <ProfilePhotoInput 
              previewUrl={previewUrl}
              onPhotoSelect={handlePhotoSelect}
              onClear={handleClearPhoto}
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="display_name" className="block text-sm font-medium mb-1">
                    Full Name
                  </label>
                  <Input
                    id="display_name"
                    name="display_name"
                    value={formData.display_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="headline" className="block text-sm font-medium mb-1">
                    Headline
                  </label>
                  <Input
                    id="headline"
                    name="headline"
                    value={formData.headline}
                    onChange={handleChange}
                    placeholder="Software Developer, Product Manager, etc."
                  />
                </div>
                
                <div>
                  <label htmlFor="location" className="block text-sm font-medium mb-1">
                    Location
                  </label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="about" className="block text-sm font-medium mb-1">
                    About
                  </label>
                  <Textarea
                    id="about"
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    rows={4}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Current Position</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="jobTitle" className="block text-sm font-medium mb-1">
                    Job Title
                  </label>
                  <Input
                    id="jobTitle"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-1">
                    Company
                  </label>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Education</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="school" className="block text-sm font-medium mb-1">
                    School/University
                  </label>
                  <Input
                    id="school"
                    name="school"
                    value={formData.school}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="degree" className="block text-sm font-medium mb-1">
                      Degree
                    </label>
                    <Input
                      id="degree"
                      name="degree"
                      value={formData.degree}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="fieldOfStudy" className="block text-sm font-medium mb-1">
                      Field of Study
                    </label>
                    <Input
                      id="fieldOfStudy"
                      name="fieldOfStudy"
                      value={formData.fieldOfStudy}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Skills</h2>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addSkill}
                  className="text-sm"
                >
                  + Add Skill
                </Button>
              </div>
              
              <div className="space-y-2">
                {formData.skills.map((skill, index) => (
                  <Input
                    key={index}
                    value={skill}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                    placeholder={`Skill ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full bg-linkedout-blue"
                disabled={loading}
              >
                {loading ? 'Creating Profile...' : 'Complete Profile Setup'}
              </Button>
            </div>
            
            <p className="text-center text-sm text-gray-500">
              You can always edit your profile information later
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileCreation;