'use client';

import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Skeleton from "react-loading-skeleton";


export default function BillsLoading() {
  return (
    <div className="flex flex-col gap-400 py-300 lg:py-400">
      <Header>
        <h1 className="text-preset-1 text-grey-900">Recurring Bills</h1>
      </Header>

      <div className="grid grid-cols-1 1350:grid-cols-[337px_1fr] gap-300">
        {/* Sidebar */}
        <div className="flex flex-col md:flex-row lg:!flex-col gap-300">
          <Card variant="dark" className="flex sm:flex-col gap-300 sm:gap-400 !p-250 sm:!p-[24px]">
            <Skeleton width={32} height={26} className="m-50 mt-100" />
            <div>
              <Skeleton width={80} height={16} className="mb-[11px]" />
              <Skeleton width={100} height={28} />
            </div>
          </Card>

          <Card className="!p-250">
            <Skeleton width={80} height={20} className="mb-250" />
            <div className="text-preset-5 flex flex-col divide-y divide-grey-500/15">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between py-200">
                  <Skeleton width={80} height={16} />
                  <Skeleton width={100} height={16} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Bill List */}
        <Card className="flex flex-col gap-300 h-max !py-300 !px-250 sm:!p-400">
          <div className="flex flex-col sm:flex-row justify-between gap-300">
            <Skeleton width={200} height={40} />
            <Skeleton width={120} height={40} />
          </div>

          <div className="overflow-hidden rounded-[8px] mt-100">
            <div className="hidden sm:grid grid-cols-[5fr_1fr_100px] 1350:px-200 py-150 text-preset-5 text-grey-500">
              <Skeleton width={100} height={14} />
              <Skeleton width={80} height={14} />
              <Skeleton width={60} height={14} />
            </div>

            {/* Rows */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border-t border-grey-100 py-250">
                {/* Desktop */}
                <div className="hidden sm:grid grid-cols-[5fr_1fr_100px] items-center 1350:px-200 gap-200">
                  <div className="flex items-center gap-200">
                    <Skeleton circle width={32} height={32} />
                    <Skeleton width={140} height={16} />
                  </div>
                  <Skeleton width={100} height={14} />
                  <Skeleton width={60} height={16} className="justify-self-end" />
                </div>

                {/* Mobile */}
                <div className="flex flex-col gap-150 sm:hidden">
                  <div className="flex items-center gap-200">
                    <Skeleton circle width={32} height={32} />
                    <Skeleton width={140} height={16} />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton width={100} height={14} />
                    <Skeleton width={60} height={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}