
import { Post } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ThumbsUp, MessageSquare, Share } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  
  const handleLike = () => {
    // SUPABASE: Update likes in the database
    // const updateLikes = async () => {
    //   // If already liked, remove like
    //   if (liked) {
    //     const { error } = await supabase
    //       .from('post_likes')
    //       .delete()
    //       .match({ user_id: currentUser.id, post_id: post.id });
    //       
    //     if (error) {
    //       console.error('Error removing like:', error);
    //       return;
    //     }
    //     
    //     setLikeCount(likeCount - 1);
    //   } else {
    //     // If not liked, add like
    //     const { error } = await supabase
    //       .from('post_likes')
    //       .insert([{ user_id: currentUser.id, post_id: post.id }]);
    //       
    //     if (error) {
    //       console.error('Error adding like:', error);
    //       return;
    //     }
    //     
    //     setLikeCount(likeCount + 1);
    //   }
    //   
    //   setLiked(!liked);
    // };
    //
    // updateLikes();
    
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            <Avatar>
              <AvatarImage src={post.user.avatar} alt={post.user.name} />
              <AvatarFallback>{post.user.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{post.user.name}</div>
              <div className="text-sm text-gray-500">{post.user.title}</div>
              <div className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </div>
            </div>
          </div>
          <Badge variant={post.type === "parody" ? "default" : "destructive"}>
            {post.type === "parody" ? "LinkedIn Parody" : "Work Vent"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line">{post.content}</p>
      </CardContent>
      <CardFooter className="border-t pt-3 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLike}
          className={liked ? "text-linkedout-blue" : ""}
        >
          <ThumbsUp className="mr-1" size={18} />
          {likeCount}
        </Button>
        <Button variant="ghost" size="sm">
          <MessageSquare className="mr-1" size={18} />
          {post.comments.length}
        </Button>
        <Button variant="ghost" size="sm">
          <Share size={18} className="mr-1" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
