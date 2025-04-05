// src/components/ui/tabs.tsx
import React from 'react';

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
}

const Tabs = ({ defaultValue, children }: TabsProps) => (
  <div className="tabs" data-default-value={defaultValue}>
    {children}
  </div>
);

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

const TabsList = ({ children, className }: TabsListProps) => (
  <div className={`flex ${className}`}>{children}</div>
);

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

const TabsTrigger = ({ value, children }: TabsTriggerProps) => (
  <button className="px-4 py-2 border-b-2 hover:bg-gray-100">{children}</button>
);

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

const TabsContent = ({ value, children }: TabsContentProps) => (
  <div className="tabs-content">{children}</div>
);

export { Tabs, TabsList, TabsTrigger, TabsContent };
