"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import PotCards from "@/components/pots/PotCards";
import demoData from "@/db/data.json";
import { Pot } from "@/types/pot";
import AddPotButton from "@/components/pots/AddPotButton";

export default function DemoPotsPage() {
  const [pots, setPots] = useState<Pot[]>(
    demoData.pots.map((pot, index) => ({
      _id: crypto.randomUUID(), // ✅ safe unique ID
      userId: crypto.randomUUID(), // ✅ safe unique ID
      name: pot.name,
      amount: pot.target,
      saved: pot.total,
      theme: pot.theme,
      createdAt: new Date().toISOString(),
    }))
  );

  return (
    <div className="flex flex-col gap-400 py-300 lg:py-400">
      <Header>
        <h1 className="text-preset-1 text-grey-900">Pots</h1>
        <div className="absolute right-0 bottom-0 flex gap-200 items-center h-full">
        <AddPotButton setPots={setPots} isDemoPage />

        </div>
      </Header>

      <PotCards pots={pots} setPots={setPots} isDemoPage />
    </div>
  );
}
