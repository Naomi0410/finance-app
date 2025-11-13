"use client";

import { useState } from "react";
import PotModal from "./PotModal";
import { Pot } from "@/types/pot";

type Props = {
  setPots?: React.Dispatch<React.SetStateAction<Pot[]>>;
  isDemoPage?: boolean;
};

export default function AddPotButton({ setPots, isDemoPage }: Props) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-grey-900 text-white px-200 h-full sm:px-300 rounded-[8px] sm:h-full text-preset-4-bold hover:bg-grey-500 cursor-pointer"
      >
        <span className="sm:hidden">+ &nbsp;Add</span>
        <span className="hidden sm:inline">+ &nbsp;Add New Pot</span>
      </button>

      <PotModal
        mode="add"
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        setPots={setPots}
        isDemoPage={isDemoPage}
      />
    </>
  );
}
