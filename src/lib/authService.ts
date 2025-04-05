import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut
} from "firebase/auth";
import { auth } from "../../firebase/FirebaseConfig";
import { createUserProfile, getUserProfile } from "./userProfileService";

// Email/Password registration with verification email
export const register = async (email: string, password: string) => {
  try {
    // Create the user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create initial user profile in Firestore
    await createUserProfile(userCredential.user.uid, email);
    
    // Send verification email
    await sendEmailVerification(userCredential.user);
    
    return {
      user: userCredential.user,
      message: "Registration successful! Please check your email to verify your account."
    };
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};

// Email/Password login
export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Check if email is verified
    if (!userCredential.user.emailVerified) {
      // You can either prevent login or allow it with a warning
      return {
        user: userCredential.user,
        verified: false,
        message: "Please verify your email before logging in."
      };
    }
    
    return {
      user: userCredential.user,
      verified: true,
      message: "Login successful!"
    };
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

// Sign out the current user
export const logout = async () => {
  try {
    await signOut(auth);
    return {
      success: true,
      message: "Sign-out successful."
    };
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Resend verification email if needed
export const resendVerificationEmail = async (user) => {
  try {
    await sendEmailVerification(user);
    return {
      success: true,
      message: "Verification email sent successfully!"
    };
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};

// Get current authentication state
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Check if user has completed profile setup
export const checkProfileCompletion = async (uid) => {
  try {
    const profile = await getUserProfile(uid);
    return profile.profileCompleted;
  } catch (error) {
    return false;
  }
};