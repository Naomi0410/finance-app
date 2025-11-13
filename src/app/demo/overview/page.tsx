import demoData from "@/db/data.json";
import StatCards from "@/components/dashboard/StatCards";
import Card from "@/components/ui/Card";
import DonutChart from "@/components/budgets/DonutChart";
import TransactionRows from "@/components/transactions/TransactionRows";
import Link from "next/link";
import Image from "next/image";
import SpendingSummaryList from "@/components/budgets/SpendingSummaryList";
import PotsCardContent from "@/components/pots/PotsCardContent";
import BillsCardContent from "@/components/recurring-bills/BillsCardContent";
import Header from "@/components/layout/Header";
import LoginButton from "@/components/ui/LoginButton";
import { getBudgetSummaries, getTotalSpentAndLimit } from "@/lib/data/getBudgetStats";
import { Budget } from "@/types/budget";
import { Pot } from "@/types/pot";
import { Transaction } from "@/types/transaction";

export default function DemoOverviewPage() {
  const { balance } = demoData;

  // Transform raw demo data to match expected types
  const budgets: Budget[] = demoData.budgets.map((b, i) => ({
    _id: `demo-budget-${i}`,
    userId: "demo-user",
    amount: b.maximum,
    category: b.category,
    theme: b.theme,
    createdAt: new Date().toISOString(),
  }));

  const pots: Pot[] = demoData.pots.map((p, i) => ({
    _id: `demo-pot-${i}`,
    userId: "demo-user",
    name: p.name,
    amount: p.target,
    saved: p.total,
    theme: p.theme,
    createdAt: new Date().toISOString(),
  }));

  const transactions: Transaction[] = demoData.transactions.map((tx, i) => ({
    _id: `demo-tx-${i}`,
    sender: tx.name,
    sender_id: "demo-sender",
    receiver_id: "demo-receiver",
    avatar: tx.avatar,
    name: tx.name,
    category: tx.category,
    date: tx.date,
    amount: tx.amount,
    recurring: tx.recurring,
  }));

  const bills = transactions.filter((tx) => tx.category === "Bills" && tx.recurring);
  const budgetSummaries = getBudgetSummaries(budgets, transactions);
  const { totalSpent, totalLimit } = getTotalSpentAndLimit(budgetSummaries);

  return (
    <div className="flex flex-col gap-400 py-300 lg:py-400">
      <Header>
        <h1 className="text-preset-1 text-grey-900">Overview</h1>
        <LoginButton />
      </Header>

      <StatCards balance={balance} />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(650px,3fr)_4fr] gap-300 items-start">
        <div className="flex flex-col gap-300">
          {/* Pots */}
          <Card className="flex flex-col gap-250 px-250 py-300 sm:p-400">
            <div className="flex justify-between items-center">
              <h3 className="text-preset-2 text-grey-900">Pots</h3>
              <Link
                href="/demo/pots"
                className="flex gap-200 text-preset-4 text-grey-500 items-center"
              >
                See Details
                <Image src="/assets/images/icon-caret-right.svg" alt="icon" width={5} height={4} />
              </Link>
            </div>
            <PotsCardContent pots={pots.slice(0, 4)} />
          </Card>

          {/* Transactions */}
          <Card className="flex flex-col gap-400 px-250 py-300 sm:p-400">
            <div className="flex justify-between items-center">
              <h3 className="text-preset-2 text-grey-900">Transactions</h3>
              <Link
                href="/demo/transactions"
                className="flex gap-200 text-preset-4 text-grey-500 items-center"
              >
                View All
                <Image src="/assets/images/icon-caret-right.svg" alt="icon" width={5} height={4} />
              </Link>
            </div>
            <TransactionRows transactions={transactions.slice(0, 5)} onOverviewPage />
          </Card>
        </div>

        <div className="flex flex-col gap-300">
          {/* Budgets */}
          <Card className="flex flex-col gap-100 sm:gap-400 px-250 py-300 sm:p-400">
            <div className="flex justify-between items-center">
              <h3 className="text-preset-2 text-grey-900">Budgets</h3>
              <Link
                href="/demo/budgets"
                className="flex gap-200 text-preset-4 text-grey-500 items-center"
              >
                See Details
                <Image src="/assets/images/icon-caret-right.svg" alt="icon" width={5} height={4} />
              </Link>
            </div>
            <div className="flex flex-col 1350:flex-row">
              <DonutChart
                budgets={budgetSummaries}
                totalLimit={totalLimit}
                totalSpent={totalSpent}
                onOverviewPage
              />
              <SpendingSummaryList budgets={budgetSummaries.slice(0, 4)} onOverviewPage />
            </div>
          </Card>

          {/* Recurring Bills */}
          <Card className="flex flex-col gap-400 px-250 py-300 sm:p-400">
            <div className="flex justify-between items-center">
              <h3 className="text-preset-2 text-grey-900">Recurring Bills</h3>
              <Link
                href="/demo/recurring-bills"
                className="flex gap-200 text-preset-4 text-grey-500 items-center"
              >
                See Details
                <Image src="/assets/images/icon-caret-right.svg" alt="icon" width={5} height={4} />
              </Link>
            </div>
            <BillsCardContent bills={bills} />
          </Card>
        </div>
      </div>
    </div>
  );
}
