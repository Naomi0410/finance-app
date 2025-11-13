'use client';

import Modal from '@/components/ui/Modal';
import { useState } from 'react';
import { sleep } from '@/lib/utils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  deleteType: 'budget' | 'pot' | null;
  label: string | undefined;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  deleteType,
  label,
}: Props) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (loading) return;
    setLoading(true);
    await onConfirm();
    await sleep(200);
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-250 h-full">
        <h2 className="text-preset-2 sm:!text-[32px] text-grey-900">
          {`Delete '${label}'`}
        </h2>
        <p className="text-preset-4 text-grey-500">
          Are you sure you want to delete this {deleteType}? This action cannot be reversed.
        </p>
        <div className="flex flex-col gap-250 !mt-auto sm:mt-0">
          <button
            onClick={handleDelete}
            className="text-preset-4-bold text-red-600 w-full p-200 bg-red text-white rounded-xl hover:brightness-115 transition duration-250 cursor-pointer disabled:opacity-70"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                Deleting
                <svg
                  className="animate-spin ml-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              </span>
            ) : (
              'Yes, delete'
            )}
          </button>
          <button
            onClick={onClose}
            className="text-preset-4 text-grey-500 hover:text-grey-900 transition duration-200 cursor-pointer"
            disabled={loading}
          >
            No, Go Back
          </button>
        </div>
      </div>
    </Modal>
  );
}