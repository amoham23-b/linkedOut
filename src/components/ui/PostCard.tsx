// src/components/PostCard.tsx
import React, { useState } from 'react';
import { Post } from '@/types';  // Adjust path if needed
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Badge } from './badge';
import { Button } from './button';
import { ThumbsUp, MessageSquare, Share } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div className="mb-4 p-4 border rounded-md shadow-md">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
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
        <Badge variant={post.type === 'parody' ? 'default' : 'destructive'}>
          {post.type === 'parody' ? 'Parody' : 'Vent'}
        </Badge>
      </div>

      <div className="mb-3">{post.content}</div>

      <div className="flex justify-between items-center">
        <Button variant="ghost" size="sm" onClick={handleLike}>
          <ThumbsUp size={18} /> {likeCount}
        </Button>
        <Button variant="ghost" size="sm">
          <MessageSquare size={18} /> {post.comments.length}
        </Button>
        <Button variant="ghost" size="sm">
          <Share size={18} />
        </Button>
      </div>
    </div>
  );
};

export default PostCard;
