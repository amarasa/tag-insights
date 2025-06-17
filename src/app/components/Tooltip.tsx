'use client';

import { useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface TooltipProps {
  content: React.ReactNode;
  children?: React.ReactNode;
  icon?: boolean;
}

export default function Tooltip({ content, children, icon = false }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="inline-flex items-center"
      >
        {icon ? (
          <InformationCircleIcon className="h-5 w-5 text-blue-500 cursor-help" />
        ) : (
          children
        )}
      </div>
      
      {isVisible && (
        <div className="absolute z-50 w-64 p-3 mt-2 text-sm text-gray-700 bg-white rounded-lg shadow-lg border border-gray-200 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-gray-200 rotate-45" />
            <div className="relative z-10">{content}</div>
          </div>
        </div>
      )}
    </div>
  );
} 