// src/components/ui/badge.tsx
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'destructive' | 'outline' | 'success';
  className?: string;
}

const Badge = ({ children, variant = 'default', className }: BadgeProps) => {
  const variantStyles = {
    default: 'bg-blue-500 text-white',
    destructive: 'bg-red-500 text-white',
    outline: 'border border-gray-500 text-gray-700',
    success: 'bg-green-500 text-white',
  };

  return (
    <span
      className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export { Badge };
