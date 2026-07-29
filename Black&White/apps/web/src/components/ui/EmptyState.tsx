// apps/web/src/components/ui/EmptyState.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionLink?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  actionLink,
  onAction,
  icon,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center border border-zinc-800/60 rounded-xl bg-zinc-950/40 backdrop-blur-sm ${className}`}>
      <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-400 mb-6 shadow-inner">
        {icon || (
          <svg className="w-8 h-8 text-amber-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
          </svg>
        )}
      </div>
      <h3 className="text-xl font-serif font-bold text-white uppercase tracking-wider mb-2">{title}</h3>
      <p className="text-sm font-sans font-light text-zinc-400 max-w-md mb-8 leading-relaxed">{description}</p>

      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="px-8 py-3 bg-white text-black font-sans font-semibold text-xs uppercase tracking-[0.2em] hover:bg-amber-400 transition-colors shadow-lg"
        >
          {actionText}
        </Link>
      )}

      {actionText && !actionLink && onAction && (
        <button
          onClick={onAction}
          className="px-8 py-3 bg-white text-black font-sans font-semibold text-xs uppercase tracking-[0.2em] hover:bg-amber-400 transition-colors shadow-lg"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
