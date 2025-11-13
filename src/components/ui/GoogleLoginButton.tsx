'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export function GoogleLoginButton() {
  const [loading, setLoading] = useState(false);

  async function handleGoogleLogin() {
    setLoading(true);
    await signIn('google', { callbackUrl: '/?loginSuccess=1' });
  }

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={loading}
      className="mb-100 bg-white text-grey-900 border border-grey-300 hover:bg-gray-100 rounded-[8px] py-200 w-full text-preset-4-bold flex items-center justify-center cursor-pointer"
    >
      Login with Google
      {loading && (
        <svg
          className="animate-spin ml-2 h-4 w-4 text-grey-900"
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