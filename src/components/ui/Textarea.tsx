// src/components/ui/textarea.tsx
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea
    className={`w-full p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-linkedout-blue ${className}`}
    ref={ref}
    {...props}
  />
));

Textarea.displayName = 'Textarea';
export { Textarea };
