'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { TbLogin2 } from 'react-icons/tb';

export default function LoginInButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    router.push('/login');
  };

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      aria-label="Login"
      className={`
        flex items-center gap-100 absolute right-0 bottom-0 h-full
        px-300 rounded-[8px]
        bg-grey-900 text-white text-preset-3
        cursor-pointer hover:bg-grey-500
        transition-colors duration-150
        ${loading ? 'opacity-70 cursor-not-allowed' : ''}
      `}
    >
      <TbLogin2 size={20} />
      <span>Login</span>

      {loading && (
        <svg
          className="animate-spin h-4 w-4 text-white ml-100"
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
    </button>
  );
}
