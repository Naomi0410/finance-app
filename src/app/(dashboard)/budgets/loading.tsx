'use client';

import Skeleton from 'react-loading-skeleton';
import Header from '@/components/layout/Header';
import AddBudgetButton from '@/components/budgets/AddBudgetButton';
import Card from '@/components/ui/Card';

export default function BudgetsLoading() {
  return (
    <div className="flex flex-col gap-400 py-300 lg:py-400">
      <Header>
        <h1 className="text-preset-1 text-grey-900">Budgets</h1>
        <div className="absolute right-0 bottom-0 flex gap-200 items-center h-full">
          <AddBudgetButton />
        </div>
      </Header>

      <div className="grid grid-cols-1 1350:grid-cols-[428px_1fr] gap-300">
        <Card className="flex flex-col sm:flex-row lg:!flex-col gap-500 sm:gap-200 lg:!gap-500 h-fit !p-250 sm:!p-400 sm:!pb-300">
          <div className="relative flex items-center justify-center">
            <Skeleton circle width={240} height={240} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[45%] text-center w-full">
              <Skeleton width={100} height={24} className="mx-auto mb-50" />
              <Skeleton width={80} height={16} className="mx-auto" />
            </div>
          </div>

          <div className="flex flex-col gap-250 w-full">
            <Skeleton width={150} height={24} />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex gap-200 items-center">
                  <Skeleton width={4} height={20} />
                  <Skeleton width={100} height={16} />
                </div>
                <Skeleton width={80} height={16} />
              </div>
            ))}
          </div>
        </Card>
        <div className="flex flex-col gap-300">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="flex flex-col justify-between gap-250 !p-250 sm:!p-400 min-h-[340px]">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-200">
                  <Skeleton width={16} height={16} circle />
                  <Skeleton width={100} height={20} />
                </div>
                <Skeleton width={20} height={20} />
              </div>

              <div className="flex flex-col gap-200">
                <Skeleton width={180} height={16} />
                <Skeleton height={32} width="100%" />
                <div className="flex justify-between">
                  <div className="flex flex-col gap-50">
                    <Skeleton width={40} height={14} />
                    <Skeleton width={60} height={18} />
                  </div>
                  <div className="flex flex-col gap-50 items-end">
                    <Skeleton width={60} height={14} />
                    <Skeleton width={60} height={18} />
                  </div>
                </div>
              </div>

              <div className="bg-beige-100 rounded-xl p-250 pb-100">
                <div className="flex justify-between items-center mb-100">
                  <Skeleton width={120} height={18} />
                  <Skeleton width={50} height={18} />
                </div>
                <div className="flex flex-col gap-150">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="flex justify-between items-center">
                      <div className="flex gap-200 items-center">
                        <Skeleton width={32} height={32} circle />
                        <Skeleton width={100} height={16} />
                      </div>
                      <div className="flex flex-col items-end gap-50">
                        <Skeleton width={60} height={16} />
                        <Skeleton width={80} height={14} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}