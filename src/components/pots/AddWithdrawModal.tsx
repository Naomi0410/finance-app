'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { THEMES_META } from '@/lib/constants';
import Modal from '@/components/ui/Modal';
import { Pot } from '@/types/pot';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'withdraw' | null;
  pot: Pot;
  isDemoPage?: boolean;
  setPots?: React.Dispatch<React.SetStateAction<Pot[]>>;
};

export default function AddWithdrawModal({
  isOpen,
  onClose,
  mode,
  pot,
  isDemoPage = false,
  setPots,
}: Props) {
  const [saved, setSaved] = useState('');
  const router = useRouter();

  const parsedSaved = parseFloat(saved);
  const percentage = Math.min((pot.saved / pot.amount) * 100, 100);
  const newPercentage = !isNaN(parsedSaved)
    ? Math.min(
        ((mode === 'add' ? pot.saved + parsedSaved : pot.saved - parsedSaved) / pot.amount) * 100,
        100
      ) - percentage
    : 0;

  const handleSubmit = async () => {
    if (!saved || isNaN(parsedSaved)) return;

    if (isDemoPage && setPots) {
      setPots(prev =>
        prev.map(p =>
          p._id === pot._id
            ? {
                ...p,
                saved:
                  mode === 'add'
                    ? p.saved + parsedSaved
                    : Math.max(p.saved - parsedSaved, 0),
              }
            : p
        )
      );
      onClose();
      return;
    }

    const payload = { saved: parsedSaved, mode };

    await fetch(`/api/pots/${pot._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    onClose();
    router.refresh();
  };

  const displaySeparator = () => {
    if (!saved) return false;
    if (mode === 'add') return percentage > 0;
    if (mode === 'withdraw') return percentage - newPercentage > 0;
    return false;
  };

  const themeColor = THEMES_META[pot.theme]?.hex || '#000';
  const withdrawColor = THEMES_META['Red']?.hex || '#C94736';

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-preset-2 sm:!text-[32px] text-grey-900">
        {mode === 'add' ? `Add to '${pot.name}'` : `Withdraw from '${pot.name}'`}
      </h2>
      <p className="text-preset-4 text-grey-500">
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Phasellus hendrerit. Pellentesque
        aliquet nibh nec urna. In nisi neque, aliquet.
      </p>

      <div className="flex flex-col gap-50 py-150">
        <div className="flex justify-between items-center mb-150">
          <p className="text-preset-4 text-grey-500">New Amount</p>
          <div className="text-preset-1 text-grey-900">${pot.saved}</div>
        </div>

        <div className="relative flex h-[8px] rounded-[4px] w-full overflow-hidden bg-beige-100 mb-100">
          <div
            className={`h-full rounded-[4px] bg-grey-900 ${
              saved && mode === 'add' ? 'rounded-r-none' : ''
            }`}
            style={{ width: `${percentage}%` }}
          >
            {saved && displaySeparator() && (
              <span
                className="absolute w-[2px] h-full bg-beige-100 z-1"
                style={{
                  left:
                    mode === 'add'
                      ? `${percentage}%`
                      : `${Math.max(percentage - newPercentage, 0)}%`,
                }}
              />
            )}
            <div
              className="absolute h-full rounded-[4px] rounded-l-none"
              style={{
                width: saved ? `${newPercentage}%` : '0%',
                left:
                  mode === 'add'
                    ? `${percentage}%`
                    : `${Math.min(percentage - newPercentage, 100)}%`,
                background: mode === 'withdraw' ? withdrawColor : themeColor,
              }}
            />
          </div>
        </div>

        <div className="flex justify-between">
          <span
            className="text-preset-5-bold text-grey-500"
            style={{
              color: !saved ? '#201F24' : mode === 'withdraw' ? withdrawColor : themeColor,
            }}
          >
            {mode === 'add'
              ? (percentage + newPercentage).toFixed(2)
              : Math.max(percentage - newPercentage, 0).toFixed(2)}
            %
          </span>
          <span className="text-preset-5 text-grey-500">Target of ${pot.amount}</span>
        </div>
      </div>

      <div className="z-2">
        <label className="text-preset-5-bold text-grey-500 block mb-50">
          Amount to {mode === 'add' ? 'Add' : 'Withdraw'}
        </label>
        <div className="flex items-center border rounded-[8px] px-250 py-[11px] border-beige-500 focus-within:border-black">
          <span className="text-sm text-grey-500 mr-2">$</span>
          <input
            type="number"
            value={saved}
            onChange={(e) => setSaved(e.target.value)}
            className="w-full text-sm focus:outline-none"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-grey-900 text-white text-preset-4-bold py-200 rounded-[8px] hover:bg-grey-500 transition duration-200 mt-auto sm:mt-0 cursor-pointer"
      >
        {mode === 'add' ? 'Confirm Addition' : 'Confirm Withdrawal'}
      </button>
    </Modal>
  );
}
