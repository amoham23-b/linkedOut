
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { currentUser } from "@/data/mockData";
import { Toggle } from "@/components/ui/toggle";
import { BriefcaseBusiness, Flag } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { PostType } from "@/types";

interface CreatePostCardProps {
  onPostCreated: (content: string, type: PostType) => void;
}

const CreatePostCard = ({ onPostCreated }: CreatePostCardProps) => {
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState<PostType>("parody");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    if (content.trim().length === 0) {
      toast({
        title: "Post cannot be empty",
        description: "Please add some content to your post.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate network request
    setTimeout(() => {
      onPostCreated(content, postType);
      setContent("");
      setIsSubmitting(false);
      
      toast({
        title: "Post created",
        description: "Your post has been shared with the LinkedOut community."
      });
    }, 500);
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-4">
        <div className="flex gap-3 mb-4">
          <Avatar>
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="font-semibold">{currentUser.name}</div>
            <div className="text-sm text-gray-500">{currentUser.title}</div>
          </div>
        </div>
        
        <Textarea
          placeholder="What's happening in your professional nightmare?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="resize-none"
        />
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-3">
        <div className="flex gap-2">
          <Toggle
            aria-label="LinkedIn Parody"
            pressed={postType === "parody"}
            onPressedChange={() => setPostType("parody")}
          >
            <BriefcaseBusiness size={16} className="mr-1" />
            Parody
          </Toggle>
          <Toggle
            aria-label="Work Vent"
            pressed={postType === "vent"}
            onPressedChange={() => setPostType("vent")}
          >
            <Flag size={16} className="mr-1" />
            Vent
          </Toggle>
        </div>
        
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || content.trim().length === 0}
        >
          {isSubmitting ? "Posting..." : "Post"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreatePostCard;
