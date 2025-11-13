export const dynamic = "force-dynamic";

import Header from "@/components/layout/Header";
import TransactionTable from "@/components/transactions/TransactionTable";
import demoData from "@/db/data.json";


export default async function DemoTransactionsPage({
  searchParams,
}: {
  searchParams: any;
}) {
  const resolvedParams = await searchParams;

  // Pagination
  const page = parseInt(resolvedParams.page || "1", 10);
  const perPage = 10;
  const skip = (page - 1) * perPage;

  // Filters
  const selectedCategory = resolvedParams.category || "All Transactions";
  const query = resolvedParams.query?.toLowerCase() || "";
  const sort = resolvedParams.sort || "Latest";

  // Apply category filter
  let filtered = demoData.transactions;
  if (selectedCategory !== "All Transactions") {
    filtered = filtered.filter((tx) => tx.category === selectedCategory);
  }

  // Apply search filter
  if (query) {
    filtered = filtered.filter((tx) => tx.name?.toLowerCase().includes(query));
  }

  // Apply sorting
  const sortMap: Record<string, (a: any, b: any) => number> = {
    Latest: (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    Oldest: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    "A to Z": (a, b) => a.name.localeCompare(b.name),
    "Z to A": (a, b) => b.name.localeCompare(a.name),
    Highest: (a, b) => Math.abs(b.amount) - Math.abs(a.amount),
    Lowest: (a, b) => Math.abs(a.amount) - Math.abs(b.amount),
  };

  filtered.sort(sortMap[sort]);

  // Paginate
  const paginated = filtered.slice(skip, skip + perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  // Format transactions
  const transactions = paginated.map((tx, index) => {
    const isOutgoing = tx.amount < 0;

    return {
      _id: index.toString(),
      sender: tx.name || "Unknown",
      sender_id: crypto.randomUUID(),
      receiver_id: crypto.randomUUID(),
      category: tx.category || "Uncategorized",
      date: tx.date ? new Date(tx.date).toLocaleDateString() : "Unknown",
      amount: tx.amount || 0,
      recurring: tx.recurring ?? false,
      avatar: tx.avatar || "",
      name: tx.name || "Unknown",
    };
  });

  return (
    <div className="flex flex-col gap-400 py-300 lg:py-400">
      <Header>
        <h1 className="text-preset-1 text-grey-900">Transactions</h1>
      </Header>

      <TransactionTable
        transactions={transactions}
        currentPage={page}
        totalPages={totalPages}
      />
    </div>
  );
}
