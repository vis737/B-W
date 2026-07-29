// apps/web/src/components/ui/Card.tsx
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, children, hoverEffect = true, ...props }) => {
  return (
    <div
      className={twMerge(
        'bg-bw-white rounded-lg border border-bw-gray-100 overflow-hidden transition-all duration-300',
        hoverEffect ? 'hover:shadow-md hover:-translate-y-0.5' : '',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={twMerge('flex flex-col space-y-1.5 p-6', className)} {...props} />
);

export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={twMerge('font-semibold leading-none tracking-tight', className)} {...props} />
);

export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={twMerge('p-6 pt-0', className)} {...props} />
);

export default Card;
