
import { useState } from "react";
import { Post, PostType } from "@/types";
import { mockPosts, currentUser } from "@/data/mockData";
import PostCard from "./PostCard";
import CreatePostCard from "./CreatePostCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>(mockPosts);

  const handleCreatePost = (content: string, type: PostType) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      user: currentUser,
      content,
      type,
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: []
    };

    setPosts([newPost, ...posts]);
  };

  const parodyPosts = posts.filter(post => post.type === "parody");
  const ventPosts = posts.filter(post => post.type === "vent");

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <CreatePostCard onPostCreated={handleCreatePost} />
      
      <Tabs defaultValue="all">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="all">All Posts</TabsTrigger>
          <TabsTrigger value="parody">Parodies</TabsTrigger>
          <TabsTrigger value="vent">Vents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </TabsContent>
        
        <TabsContent value="parody">
          {parodyPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </TabsContent>
        
        <TabsContent value="vent">
          {ventPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Feed;
