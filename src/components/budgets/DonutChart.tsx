"use client";

import { PieChart, Pie, Cell } from "recharts";
import { THEMES_META } from "@/lib/constants";
import { BudgetSummary } from "@/types/budget";

interface Props {
  budgets: BudgetSummary[];
  totalSpent: number;
  totalLimit: number;
  onOverviewPage?: boolean;
}

export default function DonutChart({
  budgets,
  totalSpent,
  totalLimit,
  onOverviewPage,
}: Props) {
  const data = budgets
    .map((budget) => {
      return {
        name: budget.category,
        value: budget.spent,
        color: THEMES_META[budget.theme]?.hex || budget.theme
      };
    })
    .filter((d) => d.value > 0);

  return (
    <div className="relative flex flex-col items-center justify-center pt-250 pb-250 sm:pb-[30px] w-full">
      <PieChart width={240} height={240}>
        {/* Inner ring */}
        <Pie
          data={data}
          innerRadius={80}
          outerRadius={110}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`bg-${index}`} fill={`${entry.color}CC`} />
          ))}
        </Pie>

        {/* Outer ring */}
        <Pie
          data={data}
          innerRadius={94}
          outerRadius={120}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`fg-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
      <div className="absolute text-center ">
        <div
          className={`text-preset-1 text-grey-900 ${
            !onOverviewPage && "underline"
          } underline-offset-7 mb-100`}
        >
          ${totalSpent}
        </div>
        <div
          className={`text-preset-5 text-grey-500 ${
            !onOverviewPage && "underline"
          } underline-offset-3 decoration-grey-300`}
        >
          of ${totalLimit} limit
        </div>
      </div>
    </div>
  );
}
