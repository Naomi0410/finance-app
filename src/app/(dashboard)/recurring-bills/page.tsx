import Header from "@/components/layout/Header";
import { getCurrentUser } from "@/lib/data/getCurrentUser";
import Card from "@/components/ui/Card";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import FilterBar from "@/components/ui/FilterBar";
import ImageFallback from "@/components/ui/ImageFallback";
import { formatSuffix } from "@/lib/utils";
import { getBillsSortQuery } from "@/lib/utils";
import { getBills } from "@/lib/data/getRecurringBills";

export default async function RecurringBillsPage({ searchParams }: any) {
  const user = await getCurrentUser();
  const resolvedParams = await searchParams;
  const sort = resolvedParams.sort;
  const sortQuery = getBillsSortQuery(sort);
  const filter: any = { userId: user._id };
  const query = resolvedParams.query?.toLowerCase();
  if (query) {
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // escape regex special chars
    filter.title = { $regex: escapedQuery, $options: "i" }; // case insensitive
  }
  const bills = await getBills(user._id, filter, sortQuery);

  const today = new Date().getDate();

  const paid = bills.filter((bill: any) => bill.dueDay < today);
  const dueSoon = bills.filter(
    (bill: any) => bill.dueDay >= today && bill.dueDay - today <= 3
  );
  const upcoming = bills.filter((bill: any) => bill.dueDay - today > 3);

  const totalAmount = bills.reduce(
    (sum: number, bill: any) => sum + bill.amount,
    0
  );
  const totalUpcomingAmount = [...dueSoon, ...upcoming].reduce(
    (sum: number, bill: any) => sum + bill.amount,
    0
  );
  const dueSoonAmount = dueSoon.reduce(
    (sum: number, bill: any) => sum + bill.amount,
    0
  );

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
            search={{ placeholder: "Search bills", queryKey: "query" }}
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
                <div
                  key={bill._id.toString()}
                  className="border-t border-grey-100"
                >
                  {/* Mobile view (2 rows) */}
                  <div
                    className={`flex flex-col gap-150 py-250 sm:hidden ${
                      isLast ? "pb-0" : ""
                    }`}
                  >
                    {/* Row 1: Icon + Title */}
                    <div className="flex items-center gap-200">
                      <ImageFallback
                        src={`/assets/images/avatars/${imageName}.jpg`}
                        fallbackSrc={"/assets/images/avatars/default.png"}
                        alt={bill.title}
                        width={40}
                        height={40}
                        className="rounded-full object-cover w-[32px] h-[32px]"
                      />
                      <span className="text-grey-900 text-preset-4-bold">
                        {bill.title}
                      </span>
                    </div>

                    {/* Row 2: Due date + Amount */}
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

                  {/* Desktop view (1 row with 3 columns) */}
                  <div
                    className={`hidden sm:grid grid-cols-[5fr_1fr_100px] items-center 1350:px-200 py-250 text-preset-4 hover:bg-beige-50 transition ${
                      isLast ? "pb-0" : ""
                    }`}
                  >
                    <div className="flex items-center gap-200">
                      <ImageFallback
                        src={`/assets/images/avatars/${imageName}.jpg`}
                        fallbackSrc={"/assets/images/avatars/default.png"}
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
