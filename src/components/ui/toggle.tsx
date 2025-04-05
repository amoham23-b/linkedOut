// src/components/ui/toggle.tsx
import React from 'react';

interface ToggleProps {
  pressed: boolean;
  onPressedChange: () => void;
  ariaLabel: string;
  children: React.ReactNode;
}

const Toggle = ({ pressed, onPressedChange, ariaLabel, children }: ToggleProps) => (
  <button
    aria-pressed={pressed}
    onClick={onPressedChange}
    aria-label={ariaLabel}
    className={`p-2 rounded-md flex items-center gap-2 ${pressed ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
  >
    {children}
  </button>
);

export { Toggle };
