import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '@/lib/authService';
import { getUserProfile } from '@/lib/userProfileService';

type ProfileCompletionGuardProps = {
  children: React.ReactNode;
};

const ProfileCompletionGuard: React.FC<ProfileCompletionGuardProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfileStatus = async () => {
      try {
        const currentUser = getCurrentUser();

        if (!currentUser) {
          // If no user is logged in, redirect to login
          navigate('/login');
          return;
        }

        const userProfile = await getUserProfile(currentUser.uid);

        if (!userProfile.profileCompleted) {
          // If profile is not completed, redirect to profile setup page
          setNeedsProfileSetup(true);
        }
      } catch (error) {
        console.error("Error checking profile status:", error);
        setNeedsProfileSetup(true);
      } finally {
        setLoading(false);
      }
    };

    checkProfileStatus();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-linkedout-blue"></div>
      </div>
    );
  }

  if (needsProfileSetup) {
    return <Navigate to="/profile-setup" replace />;
  }

  return <>{children}</>;
};

export default ProfileCompletionGuard;
