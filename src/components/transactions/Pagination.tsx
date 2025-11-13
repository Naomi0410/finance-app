'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import useWindowDimensions from '@/hooks/useWindowDimentions';

export default function Pagination({
  totalPages,
  currentPage,
}: {
  totalPages: number;
  currentPage: number;
}) {
  const router = useRouter();
  const { s_width } = useWindowDimensions();

  const isMobile = s_width < 640;
  const maxVisiblePages = isMobile ? 4 : s_width < 1024 ? 5 : 10;

  const goToPage = (page: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', page.toString());
    router.push(`?${params.toString()}`, {scroll: false});
    // Disable automatic scroll and scroll manually, because of DashboardLayout padding issue
    const container = document.getElementById('dashboard-scroll-container');
    container?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageItems = (): (number | string)[] => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];

    if (isMobile) {
      pages.push(1);

      if (currentPage > 2) {
        pages.push('...');
      }

      if (currentPage !== 1 && currentPage !== totalPages) {
        pages.push(currentPage);
      }

      if (currentPage < totalPages - 1) {
        pages.push('...');
      }

      if (totalPages !== 1) {
        pages.push(totalPages);
      }

      return pages;
    }

    const left = Math.max(2, currentPage - 1);
    const right = Math.min(totalPages - 1, currentPage + 1);

    pages.push(1);

    if (left > 2) {
      pages.push('...');
    }

    for (let i = left; i <= right; i++) {
      pages.push(i);
    }

    if (right < totalPages - 1) {
      pages.push('...');
    }

    pages.push(totalPages);
    return pages;
  };

  const pages = getPageItems();

  return (
    <div className="flex items-center justify-between mt-400 text-preset-4">
      {/* Prev Button */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex group items-center gap-200 px-200 rounded-[8px] h-500 border border-beige-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-grey-500 hover:text-white transition duration-150"
      >
        <Image
          src="/assets/images/icon-caret-left.svg"
          alt="prev"
          width={6}
          height={6}
          className="transition duration-150 group-hover:brightness-300"
        />
        <span className="hidden sm:inline">Prev</span>
      </button>

      {/* Page Numbers */}
      <div className="flex gap-100">
        {pages.map((item, index) =>
          item === '...' ? (
            <span
              key={`dots-${index}`}
              className="h-500 px-50 flex items-center justify-center text-grey-500"
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              onClick={() => goToPage(item as number)}
              className={`h-500 w-500 rounded-[8px] cursor-pointer transition duration-150 ${
                item === currentPage
                  ? 'bg-grey-900 text-white'
                  : 'border border-beige-500 hover:bg-grey-500 hover:text-white'
              }`}
            >
              {item}
            </button>
          )
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="group flex items-center gap-200 px-200 rounded-[8px] h-500 border border-beige-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-grey-500 hover:text-white transition duration-150"
      >
        <span className="hidden sm:inline">Next</span>
        <Image
          src="/assets/images/icon-caret-right.svg"
          alt="next"
          width={6}
          height={6}
          className="transition duration-150 group-hover:brightness-300"
        />
      </button>
    </div>
  );
}