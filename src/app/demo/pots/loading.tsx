'use client';

import Skeleton from 'react-loading-skeleton';
import Header from '@/components/layout/Header';
import AddPotButton from '@/components/pots/AddPotButton';
import Card from '@/components/ui/Card';

export default function PotsLoading() {
  return (
    <div className="flex flex-col gap-400 py-300 lg:py-400">
      <Header>
        <h1 className="text-preset-1 text-grey-900">Pots</h1>
        <div className="absolute right-0 bottom-0 flex gap-200 items-center h-full">
          <AddPotButton />
        </div>
      </Header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-300">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="relative flex flex-col gap-400 p-300 px-250 sm:px-300 min-h-[260px]">
            <div className="flex justify-between items-center">
              <div className="flex gap-200 items-center">
                <Skeleton width={16} height={16} circle />
                <Skeleton width={100} height={20} />
              </div>
              <Skeleton width={20} height={20} />
            </div>

            <div className="flex flex-col gap-100 py-150">
              <div className="flex justify-between items-center mb-100">
                <Skeleton width={80} height={16} />
                <Skeleton width={40} height={20} />
              </div>
              <Skeleton height={8} width="100%" />
              <div className="flex justify-between">
                <Skeleton width={50} height={14} />
                <Skeleton width={80} height={14} />
              </div>
            </div>

            <div className="flex gap-200">
              <Skeleton height={40} className="flex-1" />
              <Skeleton height={40} className="flex-1" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}