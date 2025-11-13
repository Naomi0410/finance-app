'use client';

import Skeleton from 'react-loading-skeleton';
import Header from '@/components/layout/Header';
import AddTransactionModal from '@/components/transactions/AddTransactionModal';
import Card from '@/components/ui/Card';

export default function TransactionsLoading() {
  return (
    <div className="flex flex-col gap-400 py-300 lg:py-400">
      <Header>
        <h1 className="text-preset-1 text-grey-900">Transactions</h1>
        <div className="absolute right-0 bottom-0 flex gap-200 items-center h-full">
          <AddTransactionModal />
        </div>
      </Header>

      <Card className="flex flex-col px-250 py-300 md:p-400 gap-300">
        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-200 md:items-center justify-between">
          <Skeleton width={250} height={40} />
          <div className="flex gap-200">
            <Skeleton width={100} height={40} />
            <Skeleton width={160} height={40} />
          </div>
        </div>

        {/* Table Header (Desktop Only) */}
        <div className="grid-cols-[3fr_1fr_1fr_80px] text-grey-500 text-preset-5 border-b border-grey-100 py-150 lg:px-200 whitespace-nowrap hidden lg:grid">
          <span>Recipient / Sender</span>
          <span>Category</span>
          <span>Transaction Date</span>
          <span className="text-right">Amount</span>
        </div>

        {/* Skeleton Rows */}
        <div className="flex flex-col">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="border-b border-grey-100 py-250 px-100 lg:px-200"
            >
              {/* Desktop layout */}
              <div className="hidden lg:grid grid-cols-[3fr_1fr_1fr_80px] items-center gap-200">
                <Skeleton width={160} height={20} />
                <Skeleton width={100} height={20} />
                <Skeleton width={90} height={20} />
                <div className="text-right">
                  <Skeleton width={60} height={20} />
                </div>
              </div>

              {/* Mobile layout */}
              <div className="flex flex-col gap-150 lg:hidden">
                <Skeleton width={'100%'} height={20} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}