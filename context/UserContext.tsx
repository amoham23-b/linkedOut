import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { currentUser as mockCurrentUser } from "../src/data/mockData";

// Define the User type if not already defined
export type User = {
  id: string;
  name: string;
  title: string;
  avatar: string;
  location?: string;
  bio?: string;
};

type UserContextType = {
  user: User | null;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Initialize user from localStorage on component mount
  useEffect(() => {
    const storedLoginStatus = localStorage.getItem("isLoggedIn");
    const storedUser = localStorage.getItem("user");
    
    if (storedLoginStatus === "true") {
      setIsLoggedIn(true);
      // Use stored user data if available, otherwise use mock data
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(mockCurrentUser);
        // Store mock user in localStorage
        localStorage.setItem("user", JSON.stringify(mockCurrentUser));
      }
    }
  }, []);

  const login = () => {
    // In a real app, this would be authenticated
    setIsLoggedIn(true);
    setUser(mockCurrentUser);
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("user", JSON.stringify(mockCurrentUser));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.setItem("isLoggedIn", "false");
    localStorage.removeItem("user");
  };

  const updateUserProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <UserContext.Provider value={{ user, isLoggedIn, login, logout, updateUserProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};