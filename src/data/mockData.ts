
import { Post, User } from "@/types";

export const currentUser: User = {
  id: "current-user",
  name: "Jane Doe",
  title: "Senior Disruption Officer",
  avatar: "/placeholder.svg"
};

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "John Smith",
    title: "Chief Synergy Officer",
    avatar: "/placeholder.svg"
  },
  {
    id: "user-2",
    name: "Alice Johnson",
    title: "Growth Hacking Ninja",
    avatar: "/placeholder.svg"
  },
  {
    id: "user-3",
    name: "Bob Williams",
    title: "Thought Leader | Influencer | Coffee Enthusiast",
    avatar: "/placeholder.svg"
  },
  {
    id: "user-4",
    name: "Emily Davis",
    title: "Unemployment Specialist",
    avatar: "/placeholder.svg"
  }
];

export const mockPosts: Post[] = [
  {
    id: "post-1",
    user: mockUsers[0],
    content: "I'm humbled and excited to announce that I've been selected to lead our company's new 'digital transformation journey.' In other words, I'll be teaching people how to use the updated PDF software for the next 6 months. #blessed #grateful #leadership #innovation",
    type: "parody",
    createdAt: "2023-04-03T10:30:00Z",
    likes: 48,
    comments: [
      {
        id: "comment-1",
        user: mockUsers[1],
        content: "Congrats on this amazing opportunity! Your journey inspires us all! 🙌",
        createdAt: "2023-04-03T11:15:00Z",
      }
    ]
  },
  {
    id: "post-2",
    user: mockUsers[1],
    content: "Just had my 15th interview for an entry-level position that requires 10+ years of experience in a technology that's only existed for 5 years. Feeling so blessed for the opportunity to be ghosted again! #jobsearch #whyevenbother",
    type: "vent",
    createdAt: "2023-04-02T14:20:00Z",
    likes: 126,
    comments: [
      {
        id: "comment-2",
        user: mockUsers[2],
        content: "Have you tried networking more? I know a guy who knows a guy...",
        createdAt: "2023-04-02T14:35:00Z",
      },
      {
        id: "comment-3",
        user: mockUsers[3],
        content: "Same boat. Got rejected for not having enough 'passion' for data entry. 🙄",
        createdAt: "2023-04-02T15:10:00Z",
      }
    ]
  },
  {
    id: "post-3",
    user: mockUsers[2],
    content: "Today marks my 1-year anniversary of surviving the company's 'strategic realignment of resources.' Actually, I just hid in the bathroom during layoffs and nobody's noticed I'm still coming to work. #hustle #entrepreneur #nevergiveup",
    type: "parody",
    createdAt: "2023-04-01T09:45:00Z",
    likes: 89,
    comments: []
  },
  {
    id: "post-4",
    user: mockUsers[3],
    content: "Exhausted after writing 50 unique cover letters this week, each one explaining how I've been passionate about [INSERT COMPANY NAME] since childhood. My dream has always been to work at [SPECIFIC INDUSTRY]! #jobhunting #screaminginternally",
    type: "vent",
    createdAt: "2023-03-31T16:20:00Z",
    likes: 215,
    comments: [
      {
        id: "comment-4",
        user: mockUsers[0],
        content: "Have you tried starting your own business? It's so easy! My dad just gave me a small loan of $500,000.",
        createdAt: "2023-03-31T16:45:00Z",
      }
    ]
  }
];
