import Header from '@/components/layout/Header';
import AddTransactionModal from '@/components/transactions/AddTransactionModal';
import client from '@/lib/mongodb';
import { getSortOption } from '@/lib/utils';
import TransactionTable from '@/components/transactions/TransactionTable';
import { getCurrentUser } from '@/lib/data/getCurrentUser';
import { Transaction } from '@/types/transaction';

export default async function TransactionsPage({ searchParams }: { searchParams: any }) {
  const user = await getCurrentUser();

  const resolvedParams = await searchParams;

  const selectedCategory = resolvedParams.category || 'All Transactions';
  const page = parseInt(resolvedParams.page || '1') || 1;
  const sort = resolvedParams.sort;
  const perPage = 10;
  const skip = (page - 1) * perPage;
  const sortQuery = getSortOption(sort);

  const filter: any = {
    $or: [{ sender_id: user._id }, { receiver_id: user._id }],
  };
  const query = resolvedParams.query?.toLowerCase();

  if (selectedCategory !== 'All Transactions') filter.category = selectedCategory;
  if (query) {
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.sender = { $regex: escapedQuery, $options: 'i' };
  }
  
  const db = client.db();
  const rawTransactions = await db
    .collection<Transaction>('transactions')
    .find(filter)
    .sort(sortQuery)
    .skip(skip)
    .limit(perPage)
    .toArray();

  const transactions = rawTransactions.map(tx => ({
    ...tx,
    _id: tx._id.toString(),
    date: new Date(tx.date).toLocaleDateString(),
  }));

  const total = await db.collection('transactions').countDocuments(filter);
  const totalPages = Math.ceil(total / perPage);

  return (
    <div className='flex flex-col gap-400 py-300 lg:py-400'>
      <Header>
        <h1 className='text-preset-1 text-grey-900'>Transactions</h1>
        <div className="absolute right-0 bottom-0 flex gap-200 items-center h-full">
          <AddTransactionModal />
        </div>
      </Header>

        <TransactionTable
          transactions={transactions}
          currentPage={page}
          totalPages={totalPages}
        />

    </div>
  );
}