'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { TbLogout2 } from "react-icons/tb";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={loading}
      className={`
        flex items-center gap-100 absolute right-0 bottom-0 h-full
        px-300 rounded-[8px] 
        bg-grey-900 text-white text-preset-3 
        cursor-pointer hover:bg-grey-500 
        transition-bg duration-150
        ${loading ? 'opacity-70 cursor-not-allowed' : ''}
      `}
    >
      <TbLogout2  size={20}/>

      Logout
      
      {loading && (
        <svg
          className="animate-spin h-4 w-4 text-white"
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