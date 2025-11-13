import type { SortDirection } from 'mongodb';

export function formatCurrency(amount: number) {
  return `$${amount.toFixed(2)}`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatSuffix(day: number): string {
  const suffix = 
    day % 10 === 1 && day % 100 !== 11 ? 'st' :
    day % 10 === 2 && day % 100 !== 12 ? 'nd' :
    day % 10 === 3 && day % 100 !== 13 ? 'rd' : 'th';
  return `${day}${suffix}`;
}

export const getSortOption = (sort: string | undefined): Record<string, SortDirection> => {
  switch (sort) {
    case 'Oldest':
      return { date: 1 };
    case 'A to Z':
      return { sender: 1 };
    case 'Z to A':
      return { sender: -1 };
    case 'Highest':
      return { amount: -1 };
    case 'Lowest':
      return { amount: 1 };
    default:
      return { date: -1 };
  }
};

export const getBillsSortQuery = (sort: string | undefined): Record<string, SortDirection> => {
  switch (sort) {
    case 'Oldest':
      return { dueDay: -1 };
    case 'Latest':
      return { dueDay: 1 };
    default:
      return { dueDay: 1 };
  }
};