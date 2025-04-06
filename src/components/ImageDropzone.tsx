
import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, ImageIcon } from "lucide-react";

interface ImageDropzoneProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

const ImageDropzone = ({ value, onChange, className }: ImageDropzoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // This would normally upload to Supabase storage, but for demo we'll use a data URL
  const handleFileUpload = async (file: File) => {
    if (!file || !file.type.startsWith("image/")) return;

    setIsUploading(true);
    try {
      // Create a data URL for immediate preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        onChange(result);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);

      // In a real implementation, you'd upload to Supabase storage:
      // const { data, error } = await supabase.storage
      //   .from('avatars')
      //   .upload(`profile-${Date.now()}`, file);
      // if (data) onChange(data.Key);
    } catch (error) {
      console.error("Error uploading file:", error);
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div 
      className={cn(
        "relative flex flex-col items-center justify-center w-40 h-40 mx-auto mb-4 rounded-full cursor-pointer transition-all",
        isDragging ? "bg-primary/10 border-primary" : "bg-background hover:bg-muted/50",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      {value ? (
        <Avatar className="w-40 h-40 border-2 border-border">
          <AvatarImage src={value} alt="Profile" className="object-cover" />
          <AvatarFallback className="text-2xl">
            {isUploading ? "..." : "?"}
          </AvatarFallback>
        </Avatar>
      ) : (
        <>
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-muted/30">
            <Upload className="w-10 h-10 text-muted-foreground" />
          </div>
          <ImageIcon className="w-20 h-20 text-muted-foreground/40" />
        </>
      )}
      
      <div className="absolute bottom-0 left-0 w-full text-xs text-center text-muted-foreground p-1 bg-background/80 rounded-b-full">
        {isUploading ? "Uploading..." : "Drag or click to upload"}
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleFileInputChange}
      />
    </div>
  );
};

export default ImageDropzone;
