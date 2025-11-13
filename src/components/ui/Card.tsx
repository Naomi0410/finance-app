import React from 'react';
import clsx from 'clsx';

type Props = {
  children?: React.ReactNode;
  className?: string;
  variant?: 'light' | 'dark'; 
};

export default function Card({ children, className = '', variant = 'light' }: Props) {
  return (
    <div
      className={clsx(
        'w-full',
        'text-grey-900',
        'p-400',
        'rounded-xl',
        variant === 'light' ? 'bg-white' : 'bg-grey-900 text-white',
        className
      )}
    >
      {children}
    </div>
  );
}