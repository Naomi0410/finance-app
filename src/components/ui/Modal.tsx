'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';


interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({ isOpen, onClose, children, className = '' }: Props) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    let frame: number;
    let timeout: NodeJS.Timeout;

    if (isOpen) {
      frame = requestAnimationFrame(() => setShouldRender(true));
    } else {
      timeout = setTimeout(() => setShouldRender(false), 150);
    }

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
    };
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-2 bg-black/40 flex items-center justify-center transition-opacity ${
        isOpen ? 'animate-fadeIn' : 'animate-fadeOut'
      }`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`flex flex-col gap-250 relative bg-white sm:rounded-xl px-250 py-300 md:p-400 h-full sm:h-fit w-full sm:w-[560px] transition-transform ${
          isOpen ? 'animate-scaleIn' : 'animate-scaleOut'
        } ${className}`}
      >
        {children}
        <button
          onClick={onClose}
          className="absolute top-250 right-250 sm:right-400 sm:top-500 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <Image
            src="/assets/images/icon-close-modal.svg"
            alt="Close"
            width={25.5}
            height={25.5}
          />
        </button>
      </div>
    </div>
  );
}
