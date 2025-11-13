import type { ReactNode } from 'react';
import Image from 'next/image';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col container mx-auto lg:flex-row h-full w-full">
      {/* Aside: Top on mobile, left on desktop */}
      <div className="w-full bg-grey-900 lg:bg-transparent lg:basis-9/30 lg:min-w-[450px] py-300 lg:p-250 rounded-b-[8px]">

        {/* Mobile: Logo only */}
        <div className="block lg:hidden mb-0 lg:mb-400">
          <Image
            src="/assets/images/logo-large.svg"
            alt="Logo"
            width={121.45}
            height={21.76}
            className="mx-auto"
          />
        </div>

        {/* Desktop: Full illustration + text */}
        <div className="relative text-center h-full w-full hidden lg:block">
          <Image
            src="/assets/images/logo-large.svg"
            alt="Logo"
            width={121.45}
            height={21.76}
            className="absolute top-500 left-500 z-1"
          />
          <Image
            src="/assets/images/illustration-authentication.svg"
            alt="Illustration"
            className="rounded-xl object-cover object-left"
            fill
          />
          <h2 className="absolute bottom-[110px] left-500 right-500 text-preset-1 text-left text-white">
            Keep track of your money and save for your future
          </h2>
          <p className="absolute bottom-500 left-500 right-500 text-preset-4 text-left text-white">
            Personal finance app puts you in control of your spending. Track transactions,
            set budgets, and add to savings pots easily.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <main className="flex w-full h-full lg:basis-21/30 items-center justify-center bg-beige-100 p-200">
        <div className="w-[560px] bg-white p-400 rounded-xl">
          {children}
        </div>
      </main>
    </div>
  );
}