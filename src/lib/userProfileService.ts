import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../firebase/FirebaseConfig"; // You'll need to add Firestore to your config
import { getCurrentUser } from "./authService";

// User profile interface
export interface UserProfile {
  uid: string;
  displayName: string;
  headline: string;
  location: string;
  about: string;
  photoURL: string;
  email: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  connections: string[];
  profileCompleted: boolean;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description: string;
}

// Create initial profile after user registration
export const createUserProfile = async (uid: string, email: string) => {
  try {
    const initialProfile: UserProfile = {
      uid,
      displayName: "",
      headline: "",
      location: "",
      about: "",
      photoURL: "",
      email,
      experience: [],
      education: [],
      skills: [],
      connections: [],
      profileCompleted: false
    };

    await setDoc(doc(db, "userProfiles", uid), initialProfile);
    return initialProfile;
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};

// Update user profile 
export const updateUserProfile = async (profileData: Partial<UserProfile>) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error("No authenticated user found");
    
    const uid = currentUser.uid;
    await updateDoc(doc(db, "userProfiles", uid), profileData);
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

// Complete the initial profile setup
export const completeProfileSetup = async (profileData: Partial<UserProfile>) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error("No authenticated user found");
    
    const uid = currentUser.uid;
    await updateDoc(doc(db, "userProfiles", uid), {
      ...profileData,
      profileCompleted: true
    });
    return { success: true };
  } catch (error) {
    console.error("Error completing profile setup:", error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (uid: string) => {
  try {
    const docRef = doc(db, "userProfiles", uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    } else {
      throw new Error("Profile not found");
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

// Upload profile picture
export const uploadProfilePicture = async (file: File) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error("No authenticated user found");
    
    const storage = getStorage();
    const storageRef = ref(storage, `profilePictures/${currentUser.uid}`);
    
    // Upload the file
    await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);
    
    // Update user profile with new photo URL
    await updateUserProfile({ photoURL: downloadURL });
    
    return { success: true, photoURL: downloadURL };
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error;
  }
};

// Add experience to profile
export const addExperience = async (experience: Omit<Experience, 'id'>) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error("No authenticated user found");
    
    const uid = currentUser.uid;
    const profileDoc = await getDoc(doc(db, "userProfiles", uid));
    
    if (!profileDoc.exists()) throw new Error("Profile not found");
    
    const profile = profileDoc.data() as UserProfile;
    const newExperience = { ...experience, id: Date.now().toString() };
    
    await updateDoc(doc(db, "userProfiles", uid), {
      experience: [...profile.experience, newExperience]
    });
    
    return { success: true, experience: newExperience };
  } catch (error) {
    console.error("Error adding experience:", error);
    throw error;
  }
};

// Add education to profile
export const addEducation = async (education: Omit<Education, 'id'>) => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) throw new Error("No authenticated user found");
    
    const uid = currentUser.uid;
    const profileDoc = await getDoc(doc(db, "userProfiles", uid));
    
    if (!profileDoc.exists()) throw new Error("Profile not found");
    
    const profile = profileDoc.data() as UserProfile;
    const newEducation = { ...education, id: Date.now().toString() };
    
    await updateDoc(doc(db, "userProfiles", uid), {
      education: [...profile.education, newEducation]
    });
    
    return { success: true, education: newEducation };
  } catch (error) {
    console.error("Error adding education:", error);
    throw error;
  }
};