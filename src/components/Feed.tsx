import { useState } from "react";
import { Post, PostType } from "@/types";
import { mockPosts, currentUser } from "@/data/mockData";
import PostCard from "./PostCard";
import CreatePostCard from "./CreatePostCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BriefcaseBusiness, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>(mockPosts);

  // SUPABASE: Replace with real data fetching from Supabase
  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     const { data, error } = await supabase
  //       .from('posts')
  //       .select('*')
  //       .order('createdAt', { ascending: false });
  //     
  //     if (error) {
  //       console.error('Error fetching posts:', error);
  //       return;
  //     }
  //     
  //     setPosts(data);
  //   };
  //   
  //   fetchPosts();
  // }, []);

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

    // SUPABASE: Insert new post to Supabase DB
    // const insertPost = async () => {
    //   const { data, error } = await supabase
    //     .from('posts')
    //     .insert([
    //       { 
    //         content, 
    //         type, 
    //         user_id: currentUser.id,
    //         created_at: new Date().toISOString()
    //       }
    //     ])
    //     .select();
    //   
    //   if (error) {
    //     console.error('Error creating post:', error);
    //     return;
    //   }
    //   
    //   // Update local state with the returned post that includes the DB-generated ID
    //   setPosts([data[0], ...posts]);
    // };
    // 
    // insertPost();

    setPosts([newPost, ...posts]);
  };

  const parodyPosts = posts.filter(post => post.type === "parody");
  const ventPosts = posts.filter(post => post.type === "vent");

  return (
    <div className="min-h-screen bg-linkedout-gray/30 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header with logo and navigation */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-linkedout-blue flex items-center gap-2">
            <BriefcaseBusiness size={32} />
            LinkedOut
          </h1>
          
          {/* Create Post button only (Messages button moved to top nav) */}
          <Button className="bg-linkedout-blue">
            <Plus size={18} className="mr-1" /> Create Post
          </Button>
        </div>
        
        {/* Create Post Card */}
        <CreatePostCard onPostCreated={handleCreatePost} />
        
        {/* Tabs for filtering posts */}
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
    </div>
  );
};

export default Feed;