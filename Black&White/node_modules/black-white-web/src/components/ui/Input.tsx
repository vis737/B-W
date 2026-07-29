// apps/web/src/components/ui/Input.tsx
import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5 align-start text-left">
        {label && (
          <label className="text-xs uppercase tracking-wider text-bw-gray-600 font-semibold">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={twMerge(
            "w-full px-4 py-3 bg-bw-gray-50 border border-bw-gray-200 outline-none transition-all duration-300 font-sans focus:bg-bw-white focus:border-bw-black",
            error ? "border-red-500 focus:border-red-500" : "",
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-xs text-red-500 mt-1 font-medium">{error}</span>
        )}
        {!error && helperText && (
          <span className="text-xs text-bw-gray-400 mt-1">{helperText}</span>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
