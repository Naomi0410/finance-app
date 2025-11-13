import ImageFallback from '@/components/ui/ImageFallback';
import { Transaction } from '@/types/transaction';

type Props = {
  tx: Transaction;
  isFirst?: boolean;
  isLast?: boolean;
  onOverviewPage?: boolean;
};

export default function TransactionRow({ tx, isFirst, isLast, onOverviewPage }: Props) {
const imageName = (tx.sender ?? "default").toLowerCase().replace(/\s+/g, '-');

  const formattedDate = tx.date
    ? new Date(tx.date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : '';

  return (
    <li
      className={`
        grid sm:grid-cols-[3fr_1fr_1fr_80px] grid-cols-2 gap-y-2 items-center border-b border-grey-100 py-200 lg:px-200
        ${isFirst ? 'pt-0' : ''} 
        ${isLast ? 'pb-0 border-b-0' : ''}
        ${onOverviewPage && '!px-0 !grid-cols-2 py-250'}
      `}
    >
      {/* Sender + Category */}
      <div className="flex items-center gap-2 col-span-1">
        <ImageFallback 
          src={`/assets/images/avatars/${imageName}.jpg`} 
          fallbackSrc={'/assets/images/avatars/default.jpg'}
           alt={tx.sender ?? "Transaction sender"}
          width={40}
          height={40}
          className="rounded-full object-cover w-[32px] h-[32px] sm:w-[40px] sm:h-[40px]"
        />

        <div className={`flex flex-col gap-50`}>
          <span className="text-preset-4-bold text-grey-900 whitespace-nowrap">{tx.sender}</span>
          { !onOverviewPage && <span className="text-grey-500 text-preset-5 sm:hidden">{tx.category}</span>}
        </div>
      </div>

      { !onOverviewPage && <span className="text-grey-500 text-preset-5 hidden sm:block">{tx.category}</span> }
      { !onOverviewPage && <span className="text-grey-500 text-preset-5 hidden sm:block">{formattedDate}</span> }
  
      <div className={`flex flex-col items-end col-span-1 gap-50 ${onOverviewPage && '!gap-100'}`}>
        <span
          className={`text-preset-4-bold ${
            tx.amount >= 0 ? 'text-green' : 'text-grey-900'
          }`}
        >
          {tx.amount >= 0 ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
        </span>
        <span className={`text-grey-500 text-preset-5 sm:hidden ${onOverviewPage && '!block'}`}>{formattedDate}</span>
      </div>
    </li>
  );
}