// src/components/ui/button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'ghost' | 'outline' | 'default';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = ({ variant = 'default', size = 'md', ...props }: ButtonProps) => {
  const baseStyles = 'px-4 py-2 rounded-md font-medium focus:outline-none';
  const variantStyles = {
    ghost: 'text-gray-500 hover:bg-gray-100',
    outline: 'border border-gray-500 text-gray-700 hover:bg-gray-100',
    default: 'bg-linkedout-blue text-white hover:bg-blue-700',
  };
  const sizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    icon: 'p-2',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} transition duration-300`}
      {...props}
    />
  );
};

export { Button };
