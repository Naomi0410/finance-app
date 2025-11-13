import Header from "@/components/layout/Header";
import SpendingSummaryList from "@/components/budgets/SpendingSummaryList";
import Card from "@/components/ui/Card";
import DonutChart from "@/components/budgets/DonutChart";
import BudgetCard from "@/components/budgets/BudgetCard";
import { getCurrentUser } from "@/lib/data/getCurrentUser";
import { getTransactions } from "@/lib/data/getTransactions";
import { getBudgets } from "@/lib/data/getBudgets";
import {
  getBudgetSummaries,
  getTotalSpentAndLimit,
} from "@/lib/data/getBudgetStats";
import AddBudgetButton from "@/components/budgets/AddBudgetButton";

export default async function BudgetsPage() {
  const user = await getCurrentUser();
  const [budgets, transactions] = await Promise.all([
    getBudgets(user._id),
    getTransactions(user._id),
  ]);

  const budgetSummaries = getBudgetSummaries(budgets, transactions);
  const { totalSpent, totalLimit } = getTotalSpentAndLimit(budgetSummaries);

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
          <DonutChart
            budgets={budgetSummaries}
            totalLimit={totalLimit}
            totalSpent={totalSpent}
          />
          <SpendingSummaryList budgets={budgetSummaries} />
        </Card>
        <div className="flex flex-col gap-300">
          {budgetSummaries.map((budget) => {
            const recentTransactions = budget.transactions.slice(0, 3);
            return (
              <BudgetCard
                key={budget._id.toString()}
                budget={budget}
                recentTransactions={recentTransactions}
                isDemoPage={false}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
