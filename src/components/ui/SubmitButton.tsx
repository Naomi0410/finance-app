'use client';

import { useFormStatus } from 'react-dom';
import type { ReactNode } from 'react';

export function SubmitButton({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type={pending ? 'button' : 'submit'}
      aria-disabled={pending}
      disabled={pending}
      className={`
        flex w-full items-center justify-center text-preset-4-bold
        bg-grey-900 text-white rounded-[8px] border py-200 ${className}
        cursor-pointer hover:bg-grey-850
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-grey-900
      `}
    >

      {children}
      {pending && (
        <svg
          className="animate-spin ml-2 h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>

      )}
      <span aria-live="polite" className="sr-only" role="status">
        {pending ? 'Loading' : 'Submit form'}
      </span>
    </button>
  );
}