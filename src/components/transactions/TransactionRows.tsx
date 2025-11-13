import TransactionRow from "./TransactionRow";
import { Transaction } from "@/types/transaction";

interface Props {
  transactions: Transaction[];
  onOverviewPage?: boolean;
}

export default function TransactionRows({
  transactions,
  onOverviewPage,
}: Props) {
  return (
    <ul>
      {transactions.length > 0 ? (
        transactions.map((tx, i) => (
          <TransactionRow
            key={`${tx._id}-${i}`}
            tx={tx}
            isFirst={i === 0}
            isLast={i === transactions.length - 1}
            onOverviewPage={onOverviewPage}
          />
        ))
      ) : (
        <p className="text-grey-500 text-sm mt-4">No transactions found.</p>
      )}
    </ul>
  );
}
