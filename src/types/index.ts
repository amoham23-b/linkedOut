
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
