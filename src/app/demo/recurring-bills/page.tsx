"use client";


import demoData from "@/db/data.json";
import Header from "@/components/layout/Header";
import Card from "@/components/ui/Card";
import Image from "next/image";
import FilterBar from "@/components/ui/FilterBar";
import ImageFallback from "@/components/ui/ImageFallback";
import { formatCurrency, formatSuffix } from "@/lib/utils";
import { useSearchParams } from "next/navigation";

export default function DemoBillsPage() {
const searchParams = useSearchParams();
const searchQuery = searchParams.get("query") || "";
const sort = searchParams.get("sort") || "Latest";

  const today = new Date().getDate();

  const bills = demoData.transactions
    .filter((tx) => tx.category === "Bills" && tx.recurring)
    .map((tx) => ({
      _id: crypto.randomUUID(),
      title: tx.name,
      amount: Math.abs(tx.amount),
      dueDay: new Date(tx.date).getDate(),
      avatar:
        tx.avatar?.replace("./assets", "/assets") ||
        "/assets/images/avatars/default.png",
    }))
    .filter((b) => b.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) =>
      sort === "Latest"
        ? new Date(b.dueDay).getTime() - new Date(a.dueDay).getTime()
        : new Date(a.dueDay).getTime() - new Date(b.dueDay).getTime()
    );

  const paid = bills.filter((b) => b.dueDay < today);
  const dueSoon = bills.filter(
    (b) => b.dueDay >= today && b.dueDay - today <= 3
  );
  const upcoming = bills.filter((b) => b.dueDay - today > 3);

  const totalAmount = bills.reduce((sum, b) => sum + b.amount, 0);
  const totalUpcomingAmount = [...dueSoon, ...upcoming].reduce(
    (sum, b) => sum + b.amount,
    0
  );
  const dueSoonAmount = dueSoon.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="flex flex-col gap-400 py-300 lg:py-400">
      <Header>
        <h1 className="text-preset-1 text-grey-900">Recurring Bills</h1>
      </Header>

      <div className="grid grid-cols-1 1350:grid-cols-[337px_1fr] gap-300">
        {/* Sidebar Summary */}
        <div className="flex flex-col md:flex-row lg:!flex-col gap-300">
          <Card
            variant="dark"
            className="flex sm:flex-col gap-300 sm:gap-400 !p-250 sm:!p-[24px]"
          >
            <Image
              src="/assets/images/icon-recurring-bills.svg"
              alt="icon"
              width={32}
              height={26}
              className="m-50 mt-100"
            />
            <div>
              <div className="text-preset-4 mb-[11px]">Total Bills</div>
              <p className="text-preset-1">{formatCurrency(totalAmount)}</p>
            </div>
          </Card>

          <Card className="!p-250">
            <h2 className="text-preset-3 text-grey-900">Summary</h2>
            <div className="mt-250 text-preset-5 flex flex-col divide-y divide-grey-500/15">
              <div className="flex justify-between pb-200">
                <span className="text-grey-500">Paid Bills</span>
                <span className="text-preset-5-bold text-grey-900">
                  {paid.length} (
                  {formatCurrency(paid.reduce((s, b) => s + b.amount, 0))})
                </span>
              </div>
              <div className="flex justify-between py-200">
                <span className="text-grey-500">Total Upcoming</span>
                <span className="text-preset-5-bold text-grey-900">
                  {upcoming.length + dueSoon.length} (
                  {formatCurrency(totalUpcomingAmount)})
                </span>
              </div>
              <div className="flex justify-between text-red pt-200">
                <span>Due Soon</span>
                <span className="text-preset-5-bold">
                  {dueSoon.length} ({formatCurrency(dueSoonAmount)})
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Bill List */}
        <Card className="flex flex-col gap-300 h-max !py-300 !px-250 sm:!p-400">
          <FilterBar
            search={{
              placeholder: "Search bills",
              queryKey: "query",
            }}
            filters={[
              {
                label: "Sort by",
                queryKey: "sort",
                options: ["Latest", "Oldest"],
                defaultValue: "Latest",
                iconSrc: "/assets/images/icon-sort-mobile.svg",
                width: "w-full md:w-[122px]",
                wrapperClassName: "ml-150 md:ml-300",
              },
            ]}
          />

          <div className="overflow-hidden rounded-[8px]">
            {/* Header */}
            <div className="grid grid-cols-[5fr_1fr_100px] 1350:px-200 py-150 text-preset-5 text-grey-500 hidden sm:grid">
              <div>Bill Title</div>
              <div>Due Date</div>
              <div className="text-right">Amount</div>
            </div>

            {/* Rows */}
            {bills.map((bill, i) => {
              const isPaid = bill.dueDay < today;
              const isDueSoon =
                bill.dueDay >= today && bill.dueDay - today <= 3;
              const imageName = bill.title.toLowerCase().replace(/\s+/g, "-");
              const isLast = i === bills.length - 1;

              return (
                <div key={bill._id} className="border-t border-grey-100">
                  {/* Mobile view */}
                  <div
                    className={`flex flex-col gap-150 py-250 sm:hidden ${
                      isLast ? "pb-0" : ""
                    }`}
                  >
                    <div className="flex items-center gap-200">
                      <ImageFallback
                        src={bill.avatar}
                        fallbackSrc="/assets/images/avatars/default.png"
                        alt={bill.title}
                        width={40}
                        height={40}
                        className="rounded-full object-cover w-[32px] h-[32px]"
                      />
                      <span className="text-grey-900 text-preset-4-bold">
                        {bill.title}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-100 text-preset-5 text-green">
                        Monthly-{bill.dueDay}
                        {isDueSoon && (
                          <Image
                            src="/assets/images/icon-bill-due.svg"
                            alt="Due"
                            width={15}
                            height={15}
                          />
                        )}
                        {isPaid && (
                          <Image
                            src="/assets/images/icon-bill-paid.svg"
                            alt="Paid"
                            width={15}
                            height={15}
                          />
                        )}
                      </div>
                      <div
                        className={`text-right font-semibold ${
                          isDueSoon ? "text-red-600" : "text-grey-900"
                        }`}
                      >
                        {formatCurrency(bill.amount)}
                      </div>
                    </div>
                  </div>

                  {/* Desktop view */}
                  <div
                    className={`hidden sm:grid grid-cols-[5fr_1fr_100px] items-center 1350:px-200 py-250 text-preset-4 hover:bg-beige-50 transition ${
                      isLast ? "pb-0" : ""
                    }`}
                  >
                    <div className="flex items-center gap-200">
                      <ImageFallback
                        src={bill.avatar}
                        fallbackSrc="/assets/images/avatars/default.png"
                        alt={bill.title}
                        width={40}
                        height={40}
                        className="rounded-full object-cover w-[32px] h-[32px]"
                      />
                      <span className="text-grey-900 text-preset-4-bold">
                        {bill.title}
                      </span>
                    </div>
                    <div className="flex gap-100 text-preset-5 text-green items-center">
                      Monthly - {formatSuffix(bill.dueDay)}
                      {isDueSoon && (
                        <Image
                          src="/assets/images/icon-bill-due.svg"
                          alt="Due"
                          width={15}
                          height={15}
                        />
                      )}
                      {isPaid && (
                        <Image
                          src="/assets/images/icon-bill-paid.svg"
                          alt="Paid"
                          width={15}
                          height={15}
                        />
                      )}
                    </div>
                    <div
                      className={`text-right text-preset-4-bold ${
                        isDueSoon ? "text-red-600" : "text-grey-900"
                      }`}
                    >
                      {formatCurrency(bill.amount)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
