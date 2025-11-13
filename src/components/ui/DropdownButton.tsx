"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import clsx from "clsx";
import { THEMES_META } from "@/lib/constants";
import { useRouter } from "next/navigation";
import PotModal from "@/components/pots/PotModal";
import BudgetModal from "@/components/budgets/BudgetModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { Pot } from "@/types/pot";
import { Budget } from "@/types/budget";

type Props = {
  label?: string;
  options: readonly string[];
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (option: string) => void;
  iconSrc?: string;
  buttonWidth?: string;
  dropdownWidth?: string;
  wrapperClassName?: string;
  variant: "default" | "modal" | "ellipsis";
  isBudgetCategory?: boolean;
  isBudgetTheme?: boolean;
  existingValues?: string[];
  budget?: Budget;
  pot?: Pot;
  isDemoPage?: boolean;
  setPots?: React.Dispatch<React.SetStateAction<Pot[]>>;
  setBudgets?: React.Dispatch<React.SetStateAction<Budget[]>>;
};

export default function DropdownButton({
  label,
  options,
  value = "",
  onChange,
  onSelect,
  iconSrc = "/assets/images/icon-caret-down.svg",
  buttonWidth,
  wrapperClassName = "",
  variant,
  isBudgetTheme,
  existingValues,
  budget,
  pot,
  isDemoPage,
  setPots,
  setBudgets,
}: Props) {
  const [open, setOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [showEditBudgetModal, setShowEditBudgetModal] = useState(false);
  const [showEditPotModal, setShowEditPotModal] = useState(false);
  const [deleteType, setDeleteType] = useState<"budget" | "pot" | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const budgetId = budget?._id;
  const category = budget?.category;
  const potId = pot?._id;
  const potName = pot?.name;

  const isDefault = variant === "default";
  const isModal = variant === "modal";
  const isEllipsis = variant === "ellipsis";
  const themeColorClass = THEMES_META[value]?.class;

  const handleDelete = async () => {
    if (deleteType === "budget" && budgetId) {
      if (isDemoPage && setBudgets) {
        setBudgets((prev) => prev.filter((b) => b._id !== budgetId));
      } else {
        await fetch(`/api/budgets/${budgetId}`, { method: "DELETE" });
        router.refresh();
      }
    } else if (deleteType === "pot" && potId) {
      if (isDemoPage && setPots) {
        setPots((prev) => prev.filter((p) => p._id !== potId));
      } else {
        await fetch(`/api/pots/${potId}`, { method: "DELETE" });
        router.refresh();
      }
    }
    setDeleteModalOpen(false);
  };

  return (
    <div
      className={clsx("flex items-center gap-100 relative", wrapperClassName)}
      ref={dropdownRef}
    >
      {label && (
        <label className="text-preset-4 text-grey-500 whitespace-nowrap hidden md:block">
          {label}
        </label>
      )}

      <div className={`relative ${isModal ? "w-full" : "w-max"}`}>
        <button
          onClick={() => setOpen((prev) => !prev)}
          className={clsx(
            "flex justify-between gap-200 px-150 rounded-[8px] text-preset-4 cursor-pointer hover:bg-grey-100 active:bg-grey-300 transition-bg duration-200 border-beige-500",
            isModal
              ? "py-[11px] border px-250"
              : "md:px-250 py-[14px] md:py-[11px] md:border",
            isEllipsis && "border-none !px-150 !py-150",
            buttonWidth
          )}
        >
          <span
            className={clsx(
              "flex items-center",
              isDefault && "hidden md:flex",
              existingValues?.includes(value) && "opacity-25",
              isEllipsis && "hidden"
            )}
          >
            {isBudgetTheme && (
              <div
                className={clsx(
                  `${themeColorClass} h-[16px] w-[16px] rounded-xl mr-150`
                )}
              />
            )}
            {value}
          </span>

          <>
            {(isDefault || isEllipsis) && (
              <Image
                src={iconSrc}
                alt="icon"
                width={16}
                height={16}
                className={isDefault ? "md:hidden" : ""}
              />
            )}
            {!isEllipsis && (
              <Image
                src={iconSrc}
                alt="toggle"
                width={12}
                height={6}
                className={clsx(
                  "transition-transform duration-200 md:block group-hover:brightness-300",
                  open ? "rotate-180" : "",
                  !isModal && "hidden"
                )}
              />
            )}
          </>
        </button>

        <div
          className={clsx(
            "absolute top-full right-0 mt-100 bg-white rounded-[8px] shadow-[0px_4px_24px_rgba(0,0,0,0.25)] max-h-[250px] sm:max-h-[300px] overflow-scroll transition-all duration-200 origin-top transform",
            open
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-95 pointer-events-none",
            buttonWidth,
            "min-w-max"
          )}
        >
          <ul className="text-preset-4">
            {options.map((option, idx) => {
              const themeColorClass = THEMES_META[option]?.class;
              const isUsed = existingValues?.includes(option);
              const isActive = value === option;
              const isBudgetEditButton = option === "Edit Budget";
              const isBudgetDeleteButton = option === "Delete Budget";
              const isPotEditButton = option === "Edit Pot";
              const isPotDeleteButton = option === "Delete Pot";

              return (
                <li
                  key={option}
                  onClick={() => {
                    if (onSelect) {
                      onSelect(option);
                      setOpen(false);
                      return;
                    }
                    if (isBudgetDeleteButton && budgetId) {
                      setOpen(false);
                      setDeleteType("budget");
                      setDeleteModalOpen(true);
                      return;
                    }
                    if (isPotDeleteButton && potId) {
                      setOpen(false);
                      setDeleteType("pot");
                      setDeleteModalOpen(true);
                      return;
                    }
                    if (isBudgetEditButton) {
                      setOpen(false);
                      setShowEditBudgetModal(true);
                      return;
                    }
                    if (isPotEditButton) {
                      setOpen(false);
                      setShowEditPotModal(true);
                      return;
                    }
                    if (!isUsed && onChange) {
                      onChange(option);
                    }
                    setOpen(false);
                  }}
                  className={clsx(
                    "cursor-pointer hover:bg-grey-100",
                    isUsed && "pointer-events-none",
                    (isBudgetDeleteButton || isPotDeleteButton) && "text-red"
                  )}
                >
                  <div
                    className={clsx(
                      "relative flex items-center px-250 py-150 whitespace-nowrap",
                      isActive && "font-bold text-grey-900",
                      isUsed && "font-normal !text-grey-500"
                    )}
                  >
                    {isBudgetTheme && (
                      <div
                        className={clsx(
                          `${themeColorClass} h-[16px] w-[16px] rounded-xl mr-150`,
                          isUsed && "opacity-25"
                        )}
                      />
                    )}
                    {option}
                    {isUsed && (
                      <span className="absolute right-250 text-preset-5">
                        Already used
                      </span>
                    )}
                  </div>
                  {idx < options.length - 1 && (
                    <div className="px-250">
                      <div className="h-px bg-grey-500/15" />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        deleteType={deleteType}
        label={deleteType === "budget" ? category : potName}
      />

      {budget && (
        <BudgetModal
          mode="edit"
          isOpen={showEditBudgetModal}
          onClose={() => setShowEditBudgetModal(false)}
          defaultValues={budget}
          isDemoPage={isDemoPage}
          setBudgets={setBudgets}
        />
      )}

      {pot && (
        <PotModal
          mode="edit"
          isOpen={showEditPotModal}
          onClose={() => setShowEditPotModal(false)}
          defaultValues={pot}
          isDemoPage={isDemoPage}
          setPots={setPots}
        />
      )}
    </div>
  );
}
