import Pagination from '@/components/transactions/Pagination';
import Card from '@/components/ui/Card';
import FilterBar from '@/components/ui/FilterBar';
import TransactionRows from './TransactionRows';
import { Transaction } from '@/types/transaction';

type Props = {
  transactions: Transaction[];
  currentPage: number;
  totalPages: number;
};

const filters = [
  {
    label: 'Sort by',
    queryKey: 'sort',
    options: ['Latest', 'Oldest', 'A to Z', 'Z to A', 'Highest', 'Lowest'],
    iconSrc: '/assets/images/icon-sort-mobile.svg',
    width: 'w-full md:w-[122px]',
    wrapperClassName: 'ml-150 md:ml-300'
  },
  {
    label: 'Category',
    queryKey: 'category',
    options: [
      'All Transactions', 'General', 'Dining Out', 'Groceries', 'Entertainment',
      'Transportation', 'Lifestyle', 'Personal Care', 'Education', 'Bills', 'Shopping'
    ],
    iconSrc: '/assets/images/icon-filter-mobile.svg',
    width: 'w-full md:w-[177px]'
  }
];

const search = {
  placeholder: 'Search transaction',
  queryKey: 'query'
};

export default function TransactionTable({ transactions, currentPage, totalPages }: Props) {

  return (
    <Card className='flex flex-col px-250 py-300 md:p-400 gap-300'>
      <FilterBar search={search} filters={filters} />

      <div className="grid-cols-[3fr_1fr_1fr_80px] text-grey-500 text-preset-5 border-b border-grey-100 py-150 lg:px-200 whitespace-nowrap hidden lg:grid">
        <span>Recipient / Sender</span>
        <span>Category</span>
        <span>Transaction Date</span>
        <span className="text-right">Amount</span>
      </div>

      <TransactionRows transactions={transactions} />
      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </Card>
  );
}