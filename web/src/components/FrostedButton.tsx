"use client";

import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export function FrostedButton({ children, className = '', ...props }: Props) {
  return (
    <button
      {...props}
      className={[
        'inline-flex items-center justify-center px-4 py-2 rounded-lg',
        'bg-orange-500/20 text-orange-200 hover:text-white',
        'backdrop-blur-md border border-orange-400/30 hover:border-orange-400/60',
        'shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] hover:shadow-[0_0_0_2px_rgba(251,146,60,0.25)]',
        'transition-colors transition-shadow duration-200',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  );
}
