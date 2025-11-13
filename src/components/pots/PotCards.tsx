"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import { THEMES_META } from "@/lib/constants";
import DropdownButton from "../ui/DropdownButton";
import AddWithdrawModal from "./AddWithdrawModal";
import { Pot } from "@/types/pot";
import PotModal from "@/components/pots/PotModal";
import { useRouter } from "next/navigation";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";

type Props = {
  pots: Pot[];
  setPots?: React.Dispatch<React.SetStateAction<Pot[]>>; // only used in demo
  isDemoPage?: boolean;
};

export default function PotCards({ pots, setPots, isDemoPage = false }: Props) {
  const [modalMode, setModalMode] = useState<"add" | "withdraw" | null>(null);
  const [selectedPot, setSelectedPot] = useState<Pot | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  const handleModalClose = () => {
    setIsModalVisible(false);
    setTimeout(() => {
      setModalMode(null);
      setIsEditModalOpen(false);
      setSelectedPot(null);
    }, 300);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-300">
      {pots.map((pot) => {
        const percentage = Math.min((pot.saved / pot.amount) * 100, 100);
        const themeColorClass = THEMES_META[pot.theme]?.class || "bg-grey-300";
        const themeHex = THEMES_META[pot.theme]?.hex || "#000";

        return (
          <Card
            key={pot._id}
            className="relative flex flex-col gap-400 !p-300 !px-250 sm:!px-300"
          >
            {/* Title */}
            <div className="flex gap-200 align-center items-center">
              <span
                className={`h-[16px] w-[16px] rounded-full ${themeColorClass}`}
              />
              <h2 className="text-preset-2 text-grey-900">{pot.name}</h2>
              <DropdownButton
                options={["Edit Pot", "Delete Pot"]}
                iconSrc="/assets/images/icon-ellipsis.svg"
                buttonWidth="w-full"
                wrapperClassName="!absolute right-150"
                variant="ellipsis"
                pot={pot}
                onSelect={(option) => {
                  if (option === "Edit Pot") {
                    setSelectedPot(pot);
                    setIsEditModalOpen(true);
                  }
                  if (option === "Delete Pot") {
                    if (isDemoPage && setPots) {
                      setPots((prev) => prev.filter((p) => p._id !== pot._id));
                    } else {
                      setSelectedPot(pot);
                      setShowDeleteConfirm(true);
                    }
                  }
                }}
              />
            </div>

            {/* Progress Bar */}
            <div className="flex flex-col gap-50 py-150">
              <div className="flex justify-between items-center mb-150">
                <p className="text-preset-4 text-grey-500">Total Saved</p>
                <div className="text-preset-1 text-grey-900">${pot.saved}</div>
              </div>
              <div className="h-[8px] rounded-[4px] w-full overflow-hidden bg-beige-100 mb-100">
                <div
                  className="h-full rounded-[4px]"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: themeHex,
                  }}
                />
              </div>
              <div className="flex justify-between">
                <span
                  className="text-preset-5-bold text-grey-500"
                  style={{ color: themeHex }}
                >
                  {percentage.toFixed(2)}%
                </span>
                <span className="text-preset-5 text-grey-500">
                  Target of ${pot.amount}
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-200">
              <button
                className="flex-1 p-200 border border-beige-100 rounded-xl text-preset-4-bold text-grey-900 bg-beige-100 transition hover:bg-white hover:border hover:border-beige-500 duration-350 cursor-pointer"
                onClick={() => {
                  setSelectedPot(pot);
                  setModalMode("add");
                  setIsModalVisible(true);
                }}
              >
                + Add Money
              </button>

              <button
                className="flex-1 p-200 border border-beige-100 rounded-xl text-preset-4-bold text-grey-900 bg-beige-100 transition hover:bg-white hover:border hover:border-beige-500 duration-350 cursor-pointer"
                onClick={() => {
                  setSelectedPot(pot);
                  setModalMode("withdraw");
                  setIsModalVisible(true);
                }}
              >
                Withdraw
              </button>
            </div>
          </Card>
        );
      })}

      {selectedPot && (
        <AddWithdrawModal
          mode={modalMode}
          isOpen={isModalVisible}
          onClose={handleModalClose}
          pot={selectedPot}
          isDemoPage={isDemoPage}
          setPots={setPots}
        />
      )}
      {isEditModalOpen && selectedPot && (
        <PotModal
          mode="edit"
          isOpen={isEditModalOpen}
          onClose={handleModalClose}
          defaultValues={selectedPot}
          isDemoPage={isDemoPage}
          setPots={setPots}
        />
      )}
      {selectedPot && (
        <DeleteConfirmationModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={async () => {
            try {
              const res = await fetch(`/api/pots/${selectedPot._id}`, {
                method: "DELETE",
              });

              if (!res.ok) {
                const errorText = await res.text();
                console.error("Delete failed:", res.status, errorText);
                alert("Failed to delete pot.");
                return;
              }

              setShowDeleteConfirm(false);
              router.refresh(); 
            } catch (err) {
              console.error("Error deleting pot:", err);
              alert("Something went wrong.");
            }
          }}
          deleteType="pot"
          label={selectedPot.name}
        />
      )}
    </div>
  );
}
