"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import SpendingSummaryList from "@/components/budgets/SpendingSummaryList";
import Card from "@/components/ui/Card";
import DonutChart from "@/components/budgets/DonutChart";
import BudgetCard from "@/components/budgets/BudgetCard";
import demoData from "@/db/data.json";
import { BudgetSummary } from "@/types/budget";
import { Transaction } from "@/types/transaction";
import AddBudgetButton from "@/components/budgets/AddBudgetButton";
import { Budget } from "@/types/budget";

export default function DemoBudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>(
    demoData.budgets.map((budget) => ({
      _id: crypto.randomUUID(),
      userId: crypto.randomUUID(),
      category: budget.category,
      theme: budget.theme,
      amount: budget.maximum,
      createdAt: new Date().toISOString(),
    }))
  );

  const transactions = demoData.transactions;

  // Group spending by category
  const spendingByCategory: Record<string, number> = {};
  for (const tx of transactions) {
    if (tx.amount < 0) {
      const category = tx.category || "Uncategorized";
      spendingByCategory[category] =
        (spendingByCategory[category] || 0) + Math.abs(tx.amount);
    }
  }

  // Build budget summaries
  const budgetSummaries: BudgetSummary[] = budgets.map((budget, index) => {
    const spent = Number(spendingByCategory[budget.category] ?? 0);

    const transactionsForBudget: Transaction[] = transactions
      .filter((tx) => tx.category === budget.category && tx.amount < 0)
      .map((tx, i) => ({
        _id: `${index}-${i}`,
        sender: tx.name || "Unknown",
        sender_id: crypto.randomUUID(),
        receiver_id: crypto.randomUUID(),
        category: tx.category,
        date: tx.date,
        amount: tx.amount,
        recurring: tx.recurring,
      }));

    return {
      _id: budget._id,
      userId: budget.userId,
      category: budget.category,
      theme: budget.theme,
      amount: budget.amount,
      createdAt: budget.createdAt,
      spent,
      remaining: budget.amount - spent,
      transactions: transactionsForBudget,
    };
  });

  const totalSpent = budgetSummaries.reduce((sum, b) => sum + b.spent, 0);
  const totalLimit = budgetSummaries.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="flex flex-col gap-400 py-300 lg:py-400">
      <Header>
        <h1 className="text-preset-1 text-grey-900">Budgets</h1>
        <div className="absolute right-0 bottom-0 flex gap-200 items-center h-full">
          <AddBudgetButton setBudgets={setBudgets} isDemoPage />
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
                key={budget._id}
                budget={budget}
                recentTransactions={recentTransactions}
                isDemoPage={true}
                setBudgets={setBudgets}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
