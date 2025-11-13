'use client';

import Skeleton from 'react-loading-skeleton';
import Header from '@/components/layout/Header';
import LogoutButton from '@/components/ui/LogoutButton';
import Card from '@/components/ui/Card';

export default function OverviewLoading() {
  return (
    <div className="flex flex-col gap-400 py-300 lg:py-400">
      <Header>
        <h1 className="text-preset-1 text-grey-900">Overview</h1>
        <LogoutButton />
      </Header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-300">
        {/* Stat Cards */}
        <Card className="p-400" variant="dark">
          <Skeleton width={100} height={20} />
          <Skeleton width={140} height={30} />
        </Card>
        <Card className="p-400">
          <Skeleton width={60} height={20} />
          <Skeleton width={100} height={30} />
        </Card>
        <Card className="p-400">
          <Skeleton width={60} height={20} />
          <Skeleton width={100} height={30} />
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(350px,3fr)_4fr] gap-300 items-start">
        <div className="flex flex-col gap-300">
          <Card className="p-400 flex flex-col gap-300">
            <Skeleton width={100} height={20} />
            <Skeleton width={150} height={40} />
            <div className="grid grid-cols-2 gap-200">
              <Skeleton height={20} />
              <Skeleton height={20} />
              <Skeleton height={20} />
              <Skeleton height={20} />
            </div>
          </Card>
          <Card className="p-400 flex flex-col gap-300">
            <Skeleton width={120} height={20} />
            <div className="flex flex-col gap-200">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton width={150} height={20} />
                  <Skeleton width={60} height={20} />
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="flex flex-col gap-300">
          <Card className="p-400 flex flex-col gap-400">
            <Skeleton width={100} height={20} />
            <div className="flex flex-col 1350:flex-row gap-300">
              <Skeleton width={180} height={180} /> {/* Donut chart placeholder */}
              <div className="flex flex-col gap-200">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} width={120} height={20} />
                ))}
              </div>
            </div>
          </Card>
          <Card className="p-400 flex flex-col gap-300">
            <Skeleton width={120} height={20} />
            <Skeleton height={30} />
            <Skeleton height={30} />
          </Card>
        </div>
      </div>
    </div>
  );
}