'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { CATEGORIES } from '@/lib/constants';
import Modal from '@/components/ui/Modal';
import DropdownButton from '../ui/DropdownButton';

export default function AddTransactionModal() {
  const [showModal, setShowModal] = useState(false);
  const [sender, setSender] = useState('');
  const [category, setCategory] = useState('General');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [amount, setAmount] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [type, setType] = useState<'sent' | 'received'>('sent');

  const router = useRouter();

  const handleSubmit = async () => {
    if (!sender || !amount || !date || !category || !type) return;

    await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender,
        category,
        date,
        amount: parseFloat(amount),
        recurring,
        type
      }),
    });

    setShowModal(false);
    setSender('');
    setCategory('General');
    setDate(format(new Date(), 'yyyy-MM-dd'));
    setAmount('');
    setRecurring(false);
    router.refresh();
  };

  return (
  <>
    <button
      onClick={() => setShowModal(true)}
      className="bg-grey-900 text-white px-200 h-full sm:px-300 rounded-[8px] sm:h-full text-preset-4-bold hover:bg-grey-500 cursor-pointer"
    >
      <span className="sm:hidden">+ &nbsp;Add</span>
      <span className="hidden sm:inline">+ &nbsp;Add Transaction</span>
    </button>

    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <h2 className="text-preset-2 sm:!text-[32px] text-grey-900">Add New Transaction</h2>
      <p className="text-preset-4 text-grey-500">Use this form to record a new transaction.</p>

      <div className="flex flex-col gap-200">
        <div>
          <label className="text-preset-5-bold text-grey-500 block mb-50">
            Recipient/Sender Name
          </label>
          <input
            type="text"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            className="w-full border rounded-[8px] px-250 py-[11px] text-sm focus:outline-none border-beige-500 focus:border-black"
          />
        </div>

        <div>
          <label className="text-preset-5-bold text-grey-500 block mb-50">Category</label>
          <DropdownButton
            options={CATEGORIES}
            value={category}
            iconSrc='/assets/images/icon-sort-mobile.svg'
            buttonWidth="w-full"
            wrapperClassName="!gap-0"
            variant="modal"
            onChange={(value) => setCategory(value)}
          />
        </div>

        <div>
          <label className="text-preset-5-bold text-grey-500 block mb-50">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border rounded-[8px] px-200 py-[11px] text-sm focus:outline-none border-beige-500 focus:border-black"
          />
        </div>

        <div>
          <label className="text-preset-5-bold text-grey-500 block mb-50">Amount (USD)</label>
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


        <div>
          <label className="text-preset-5-bold text-grey-500 block mb-50">Transaction Type</label>
          <div className="flex gap-150">
            <button
              type="button"
              className={`px-250 py-100 rounded-[8px] border border-beige-500 text-sm cursor-pointer ${
                type === 'sent' ? 'bg-grey-900 text-white border-grey-900' : 'bg-white text-grey-700'
              }`}
              onClick={() => setType('sent')}
            >
              Sent
            </button>
            <button
              type="button"
              className={`px-250 py-100 rounded-[8px] border border-beige-500 text-sm cursor-pointer ${
                type === 'received' ? 'bg-grey-900 text-white border-grey-900' : 'bg-white text-grey-700'
              }`}
              onClick={() => setType('received')}
            >
              Received
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="recurring"
            type="checkbox"
            checked={recurring}
            onChange={() => setRecurring(!recurring)}
            className="w-4 h-4 cursor-pointer"
          />
          <label htmlFor="recurring" className="text-preset-5 text-grey-900 cursor-pointer pl-150">
            Recurring
          </label>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-grey-900 text-white text-preset-4-bold py-200 rounded-[8px] hover:bg-grey-500 cursor-pointer mt-auto sm:mt-0"
      >
        Add Transaction
      </button>
    </Modal>
  </>
);

}