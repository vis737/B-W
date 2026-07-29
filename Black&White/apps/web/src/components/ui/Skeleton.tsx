// apps/web/src/components/ui/Skeleton.tsx
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rect' | 'circle' | 'text';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, variant = 'rect', ...props }) => {
  return (
    <div
      className={twMerge(
        'bg-bw-gray-100 animate-pulse',
        variant === 'circle' ? 'rounded-full' : 'rounded-md',
        variant === 'text' ? 'h-4 w-3/4' : '',
        className
      )}
      {...props}
    />
  );
};
