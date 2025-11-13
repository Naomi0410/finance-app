'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import DropdownButton from './DropdownButton';
import { FilterConfig } from '@/types/filters';


type Props = {
  search?: {
    placeholder: string;
    queryKey: string;
  };
  filters: FilterConfig[];
};

export default function FilterBar({ search, filters }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim() === '') {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    // when changing any filter set page back to 1
    if (key !== 'page') {
      params.set('page', '1');
    }
    // if we change page scroll to top
    else {
      const container = document.getElementById('dashboard-scroll-container');
      container?.scrollTo({ top: 0, behavior: 'smooth' });
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <section className="flex justify-between">
      {/* Search Input */}
      {search && (
        <div className="relative sm:max-w-[320px] w-full mb-50 lg:mb-0">
          <input
            className="border border-beige-500 rounded-[8px] w-full pl-250 pr-500 py-[11px] text-preset-4 truncate overflow-hidden whitespace-nowrap"
            placeholder={search.placeholder}
            defaultValue={searchParams.get(search.queryKey) || ''}
            onChange={(e) => updateParam(search.queryKey, e.target.value)}
          />
          <Image
            src="/assets/images/icon-search.svg"
            alt="Search"
            width={14}
            height={14}
            className="absolute right-250 top-1/2 transform -translate-y-1/2"
          />
        </div>
      )}

      {/* Dropdown Filters */}
      <div className="flex md:gap-300">
        {filters.map(({ label, queryKey, options, iconSrc, width, wrapperClassName, defaultValue }) => {
          const value = searchParams.get(queryKey) || defaultValue || options[0];
          return (
            <DropdownButton
              key={queryKey}
              label={label}
              options={options}
              value={value}
              iconSrc={iconSrc}
              buttonWidth={width}
              wrapperClassName={wrapperClassName}
              variant="default"
              onChange={(val) => updateParam(queryKey, val)}
            />
          );
        })}
      </div>
    </section>
  );
}