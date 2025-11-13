"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, THEMES } from "@/lib/constants";
import Modal from "@/components/ui/Modal";
import DropdownButton from "../ui/DropdownButton";
import { Budget } from "@/types/budget";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit";
  defaultValues?: Budget;
  isDemoPage?: boolean;
  setBudgets?: React.Dispatch<React.SetStateAction<Budget[]>>;
};

export default function BudgetModal({
  isOpen,
  onClose,
  mode,
  defaultValues,
  isDemoPage,
  setBudgets,
}: Props) {
  // Initialize from defaultValues so remounting sets correct initial form values
  const [theme, setTheme] = useState<string>(
    () => defaultValues?.theme ?? "Green"
  );
  const [category, setCategory] = useState<string>(
    () => defaultValues?.category ?? "General"
  );
  const [amount, setAmount] = useState<string>(
    () => defaultValues?.amount?.toString() ?? ""
  );
  const [existingThemes, setExistingThemes] = useState<string[]>([]);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);

  const router = useRouter();

  const resetForm = () => {
    setTheme("Green");
    setCategory("General");
    setAmount("");
  };

  const generateMockObjectId = () =>
    Math.floor(Math.random() * 1e16)
      .toString(16)
      .padStart(24, "0");

const handleSubmit = async () => {
  if (!amount || !category || !theme) return;

  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount) || parsedAmount <= 0) return;

  // ✅ DEMO MODE: update local state and exit early
  if (isDemoPage && setBudgets) {
    const isEdit = mode === "edit" && defaultValues?._id;

    setBudgets((prev) =>
      isEdit
        ? prev.map((b) =>
            b._id === defaultValues._id
              ? { ...b, category, theme, amount: parsedAmount }
              : b
          )
        : [
            ...prev,
            {
              _id: generateMockObjectId(), // UUID is fine for demo
              userId: "demo-user",
              category,
              theme,
              amount: parsedAmount,
              createdAt: new Date().toISOString(),
            },
          ]
    );

    onClose();
    resetForm();
    return; // ✅ Prevent API call
  }

  // AUTH MODE: send to API
  const payload = {
    theme,
    category,
    amount: parsedAmount,
    userId: defaultValues?.userId,
    createdAt: defaultValues?.createdAt ?? new Date().toISOString(),
  };

  try {
    const url =
      mode === "edit" && defaultValues?._id
        ? `/api/budgets/${defaultValues._id}`
        : "/api/budgets";

    const res = await fetch(url, {
      method: mode === "edit" ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API error:", res.status, errorText);
      alert(`Server error: ${res.status}`);
      return;
    }

    onClose();
    resetForm();
    router.refresh();
  } catch (err) {
    console.error("Failed to submit budget:", err);
    alert("Something went wrong. Check console for details.");
  }
};


  // Fetch existing themes/categories only when not demo and modal opens
  useEffect(() => {
    if (!isOpen || isDemoPage) return;

    let mounted = true;

    (async () => {
      try {
        const res = await fetch("/api/budgets", {
          // include cookies for session-based auth; remove or change if you use token auth
          credentials: "include",
        });

        if (!res.ok) {
          if (res.status === 401) {
            // Not authenticated — don't treat this as a fatal error in the UI
            console.warn("Not authenticated. Skipping remote budgets fetch.");
            if (mounted) {
              setExistingThemes([]);
              setExistingCategories([]);
            }
            return;
          }
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        const budgets = Array.isArray(data.budgets) ? data.budgets : data;

        if (mounted && Array.isArray(budgets)) {
          setExistingThemes(budgets.map((b: any) => b.theme));
          setExistingCategories(budgets.map((b: any) => b.category));
        } else if (mounted) {
          setExistingThemes([]);
          setExistingCategories([]);
        }
      } catch (err) {
        console.error("Failed to fetch budgets:", err);
        if (mounted) {
          setExistingThemes([]);
          setExistingCategories([]);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isOpen, isDemoPage]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-preset-2 sm:!text-[32px] text-grey-900">
        {mode === "edit" ? "Edit Budget" : "Add New Budget"}
      </h2>
      <p className="text-preset-4 text-grey-500">
        Choose a category to set a spending budget. These categories can help
        you monitor spending.
      </p>

      <div className="flex flex-col gap-200">
        <div className="z-3">
          <label className="text-preset-5-bold text-grey-500 block mb-50">
            Budget Category
          </label>
          <DropdownButton
            options={CATEGORIES}
            value={category}
            buttonWidth="w-full"
            wrapperClassName="!gap-0"
            variant="modal"
            onChange={(value) => setCategory(value)}
            existingValues={existingCategories}
            isBudgetCategory
          />
        </div>

        <div className="z-2">
          <label className="text-preset-5-bold text-grey-500 block mb-50">
            Maximum Spend
          </label>
          <div className="flex items-center border rounded-[8px] px-250 py-[11px] border-beige-500 focus-within:border-black">
            <span className="text-sm text-grey-500 mr-2">$</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full text-sm focus:outline-none"
            />
          </div>
        </div>

        <div className="z-1">
          <label className="text-preset-5-bold text-grey-500 block mb-50">
            Theme
          </label>
          <DropdownButton
            options={THEMES}
            value={theme}
            buttonWidth="w-full"
            wrapperClassName="!gap-0"
            variant="modal"
            onChange={(value) => setTheme(value)}
            isBudgetTheme
            existingValues={existingThemes}
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-grey-900 text-white text-preset-4-bold py-200 rounded-[8px] hover:bg-grey-500 transition duration-200 mt-auto sm:mt-0 cursor-pointer"
      >
        {mode === "edit" ? "Save Changes" : "Add Budget"}
      </button>
    </Modal>
  );
}
