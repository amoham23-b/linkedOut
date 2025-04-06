// src/context/UserContext.tsx
import { createContext, useState, useContext, ReactNode } from 'react';
import { User } from '@/types';
import { currentUser as defaultUser } from '@/data/mockData';

interface UserContextType {
  currentUser: User;
  updateUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User>(defaultUser);

  const updateUser = (user: User) => {
    setCurrentUser(user);
  };

  return (
    <UserContext.Provider value={{ currentUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};