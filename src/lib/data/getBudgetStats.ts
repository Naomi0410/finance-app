import { Budget } from '@/types/budget';
import { Transaction } from "@/types/transaction";
import { BudgetSummary } from "@/types/budget";

export function getTotalSpentAndLimit(budgetSummaries: BudgetSummary[]) {
  const totalSpent = budgetSummaries.reduce((sum, b) => sum + b.spent, 0);
  const totalLimit = budgetSummaries.reduce((sum, b) => sum + b.amount, 0);

  return {
    totalSpent: Math.round(totalSpent * 100) / 100,
    totalLimit: Math.round(totalLimit * 100) / 100,
  };
}

export function getBudgetSummaries(
  budgets: Budget[],
  transactions: Transaction[]
): BudgetSummary[] {
  return budgets.map(budget => {
    const categoryTxs = transactions.filter(tx => tx.category === budget.category);
    const spent = categoryTxs.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    return {
      ...budget,
      spent,
      remaining: budget.amount - spent,
      transactions: categoryTxs,
    };
  });
}