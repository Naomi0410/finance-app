import { formatCurrency } from "@/lib/utils";
import { Transaction } from "@/types/transaction";

interface Props {
  bills: Transaction[];
}

export default function BillsCardContent({ bills }: Props) {
  const today = new Date().getDate();

  // Derive dueDay from transaction date
  const enrichedBills = bills.map((b) => {
    const dueDay = b.date ? new Date(b.date).getDate() : null;
    return {
      ...b,
      dueDay,
      amount: Math.abs(b.amount ?? 0),
    };
  });

  const paid = enrichedBills
    .filter((b) => typeof b.dueDay === "number" && b.dueDay < today)
    .reduce((sum, b) => sum + b.amount, 0);

  const dueSoon = enrichedBills
    .filter((b) => typeof b.dueDay === "number" && b.dueDay >= today && b.dueDay - today <= 3)
    .reduce((sum, b) => sum + b.amount, 0);

  const upcoming = enrichedBills
    .filter((b) => typeof b.dueDay === "number" && b.dueDay - today > 3)
    .reduce((sum, b) => sum + b.amount, 0);

  return (
    <section className="flex flex-col gap-150">
      <div className="flex w-full justify-between bg-beige-100 border-l-[4px] border-green px-200 py-250 rounded-[8px]">
        <p className="text-preset-4 text-grey-500">Paid Bills</p>
        <p className="text-preset-4-bold">{formatCurrency(paid)}</p>
      </div>

      <div className="flex w-full justify-between bg-beige-100 border-l-[4px] border-yellow px-200 py-250 rounded-[8px]">
        <p className="text-preset-4 text-grey-500">Total Upcoming</p>
        <p className="text-preset-4-bold">{formatCurrency(upcoming)}</p>
      </div>

      <div className="flex w-full justify-between bg-beige-100 border-l-[4px] border-cyan px-200 py-250 rounded-[8px]">
        <p className="text-preset-4 text-grey-500">Due Soon</p>
        <p className="text-preset-4-bold">{formatCurrency(dueSoon)}</p>
      </div>
    </section>
  );
}
