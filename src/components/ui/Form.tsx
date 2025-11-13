"use client";

import { useState } from "react";
import Image from "next/image";


export function Form({
  action,
  children,
  showNameField = false,
}: {
  action: any;
  children: React.ReactNode;
  showNameField?: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="flex flex-col">
      {showNameField && (
        <>
          <label
            htmlFor="name"
            className="block text-preset-5-bold text-grey-500"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            className="mt-1 mb-4 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black"
          />
        </>
      )}

      <label htmlFor="email" className="block text-preset-5-bold text-grey-500">
        Email Address
      </label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        required
        className="mt-1 mb-4 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black"
      />

      <label
        htmlFor="password"
        className="block text-preset-5-bold text-grey-500"
      >
        Password
      </label>
      <div className="relative mt-1 mb-400">
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          required
          className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-black focus:outline-none focus:ring-black"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center px-3 cursor-pointer"
          tabIndex={-1}
        >
          <Image
            src={showPassword ? "/assets/images/icon-hide-password.svg" : "/assets/images/icon-show-password.svg"}
            alt={showPassword ? "Hide password" : "Show password"}
            width={15}
            height={10}
          />
        </button>
      </div>

      {children}
    </form>
  );
}
