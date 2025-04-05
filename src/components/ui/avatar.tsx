// src/components/ui/avatar.tsx
import React from 'react';

interface AvatarProps {
  children: React.ReactNode;
  className?: string;
}

const AvatarImage = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} alt={alt} className="w-full h-full object-cover rounded-full" />
);

const AvatarFallback = ({ children }: { children: string }) => (
  <div className="w-full h-full flex items-center justify-center text-white bg-gray-400 rounded-full">
    {children}
  </div>
);

const Avatar = ({ children, className }: AvatarProps) => (
  <div className={`relative inline-block ${className}`}>{children}</div>
);

export { Avatar, AvatarImage, AvatarFallback };
