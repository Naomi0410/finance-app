import Card from "@/components/ui/Card";

type Props = {
  balance?: {
    current: number;
    income: number;
    expenses: number;
  };
  bills?: { amount?: number }[];
};

export default function StatCards({ balance, bills }: Props) {
  const totalExpenses = balance
    ? balance.expenses
    : bills?.reduce((sum, bill) => sum + Number(bill.amount || 0), 0) || 0;

  const currentBalance = balance?.current ?? "4,500.00";
  const income = balance?.income ?? "1,200.00";

  return (
    <section className="flex flex-col md:flex-row gap-150 md:gap-300">
      <Card variant="dark" className="!p-250 md:!p-300">
        <p className="text-preset-4 mb-150">Current Balance</p>
        <p className="text-preset-1 text-white">
          ${typeof currentBalance === "number" ? currentBalance.toFixed(2) : currentBalance}
        </p>
      </Card>
      <Card className="!p-250 md:!p-300">
        <p className="text-preset-4 mb-150">Income</p>
        <p className="text-preset-1">
          ${typeof income === "number" ? income.toFixed(2) : income}
        </p>
      </Card>
      <Card className="!p-250 md:!p-300">
        <p className="text-preset-4 mb-150">Expenses</p>
        <p className="text-preset-1">${totalExpenses.toFixed(2)}</p>
      </Card>
    </section>
  );
}
