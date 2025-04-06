
export interface User {
  id: string;
  name: string;
  title: string;
  avatar: string;
}

export type PostType = 'parody' | 'vent';

export interface Post {
  id: string;
  user: User;
  content: string;
  type: PostType;
  createdAt: string;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  user: User;
  content: string;
  createdAt: string;
}

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
