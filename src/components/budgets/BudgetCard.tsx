"use client";

import { Budget, BudgetSummary } from "@/types/budget";
import { Transaction } from "@/types/transaction";
import Card from "@/components/ui/Card";
import { THEMES_META } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import ImageFallback from "@/components/ui/ImageFallback";
import DropdownButton from "@/components/ui/DropdownButton";
import { useState } from "react";
import BudgetModal from "./BudgetModal";
import { useRouter } from "next/navigation";
import DeleteConfirmationModal from "../ui/DeleteConfirmationModal";

interface Props {
  budget: BudgetSummary;
  recentTransactions?: Transaction[];
  isDemoPage?: boolean;
  setBudgets?: React.Dispatch<React.SetStateAction<Budget[]>>;
}

export default function BudgetCard({
  budget,
  recentTransactions = [],
  setBudgets,
  isDemoPage = false,
}: Props) {
  const { category, theme, amount, spent } = budget;
  const remaining = Math.max(amount - spent, 0);
  const percentage = Math.min((spent / amount) * 100, 100);

  const themeMeta = THEMES_META[theme];
  const themeColorClass = themeMeta?.class || "";
  const themeColorStyle = themeMeta ? {} : { backgroundColor: theme };

  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const router = useRouter();

  const handleModalClose = () => {
    setIsModalVisible(false);
    setTimeout(() => {
      setIsEditModalOpen(false);
      setSelectedBudget(null);
    }, 300);
  };

  return (
    <Card className="relative flex flex-col justify-between gap-250 !p-250 sm:!p-400">
      {/* Header */}
      <div className="flex items-center gap-200">
        <span
          className={`h-[16px] w-[16px] rounded-full ${themeColorClass}`}
          style={themeColorStyle}
        />
        <h2 className="text-preset-2 text-grey-900">{category}</h2>
        <DropdownButton
          options={["Edit Budget", "Delete Budget"]}
          iconSrc="/assets/images/icon-ellipsis.svg"
          buttonWidth="w-full"
          wrapperClassName="!absolute right-150 sm:right-250"
          variant="ellipsis"
          budget={budget}
          onSelect={(option) => {
            if (option === "Edit Budget") {
              setSelectedBudget(budget);
              setIsEditModalOpen(true);
            }

            if (option === "Delete Budget") {
              if (isDemoPage && setBudgets) {
                setBudgets((prev) => prev.filter((b) => b._id !== budget._id));
              } else {
                setShowDeleteConfirm(true);
                router.refresh();
              }
            }
          }}
        />
      </div>

      {/* Budget Info */}
      <div className="flex flex-col justify-between gap-200">
        <p className="text-preset-4 text-grey-500">
          Maximum of ${amount.toFixed(2)}
        </p>

        <div className="bg-beige-100 rounded-[4px] h-[32px] p-50 w-full overflow-hidden">
          <div
            className={`h-full rounded-[4px] ${themeColorClass}`}
            style={{ width: `${percentage}%`, ...themeColorStyle }}
          />
        </div>

        <div className="flex text-preset-4 text-grey-900">
          <div className="flex flex-col gap-50 relative pl-250">
            <span
              className={`absolute left-0 h-full w-[4px] rounded-full ${themeColorClass}`}
              style={themeColorStyle}
            />
            <div className="text-grey-500 text-preset-5">Spent</div>
            <div className="text-preset-4-bold">${spent.toFixed(2)}</div>
          </div>
          <div className="flex flex-col gap-50 m-auto relative pl-250">
            <span className="absolute left-0 h-full w-[4px] rounded-full bg-beige-100" />
            <div className="text-grey-500 text-preset-5">Remaining</div>
            <div className="text-preset-4-bold">${remaining.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Latest Spending */}
      <div className="bg-beige-100 rounded-xl p-250 pb-100">
        <div className="flex justify-between items-center mb-100">
          <h3 className="text-preset-3 text-grey-900">Latest Spending</h3>
          <Link
            href={{
              pathname: isDemoPage ? "/demo/transactions" : "/transactions",
              query: { category },
            }}
            className="flex gap-200 text-preset-4 text-grey-500 cursor-pointer items-center"
          >
            See All
            <Image
              src="/assets/images/icon-caret-right.svg"
              alt="icon"
              width={5}
              height={4}
            />
          </Link>
        </div>

        <ul className="flex flex-col divide-y divide-grey-500/15">
          {recentTransactions.map((tx, i) => {
            const imageName =
              tx.sender?.toLowerCase().replace(/\s+/g, "-") || "default";
            return (
              <li key={i} className="flex justify-between items-center py-150">
                <div className="flex items-center gap-200">
                  <ImageFallback
                    src={`/assets/images/avatars/${imageName}.jpg`}
                    fallbackSrc="/assets/images/avatars/default.jpg"
                    alt={tx.sender || "Transaction avatar"}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                  <div className="text-grey-900 text-preset-5-bold">
                    {tx.sender}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-50">
                  <div className="text-grey-900 text-preset-5-bold">
                    -${Math.abs(tx.amount).toFixed(2)}
                  </div>
                  <span className="text-grey-500 text-preset-5">
                    {new Date(tx.date).toLocaleDateString()}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
        {isEditModalOpen && selectedBudget && (
          <BudgetModal
            mode="edit"
            isOpen={isEditModalOpen}
            onClose={handleModalClose}
            defaultValues={selectedBudget}
            isDemoPage={isDemoPage}
            setBudgets={setBudgets}
          />
        )}
        <DeleteConfirmationModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={async () => {
            try {
              const res = await fetch(`/api/budgets/${budget._id}`, {
                method: "DELETE",
              });

              if (!res.ok) {
                const errorText = await res.text();
                console.error("Delete failed:", res.status, errorText);
                alert("Failed to delete budget.");
                return;
              }

              setShowDeleteConfirm(false);
              router.refresh();
            } catch (err) {
              console.error("Error deleting budget:", err);
              alert("Something went wrong.");
            }
          }}
          deleteType="budget"
          label={budget.category}
        />
      </div>
    </Card>
  );
}
