// src/features/topflop/components/SectionHeader/SectionHeader.tsx
import React from "react";

interface SectionHeaderProps {
  title: string;
  icon: React.ReactNode;
  color: string;
}

// No memo - simple component
export const SectionHeader = ({ title, icon, color }: SectionHeaderProps) => (
  <div className="flex items-center mb-6 pb-3 border-b border-gray-200 dark:border-gray-700">
    <div className={`p-2 rounded-lg ${color} mr-3`}>{icon}</div>
    <h3 className="text-2xl font-bold text-gray-900 dark:text-white arabic-nav">
      {title}
    </h3>
  </div>
);
