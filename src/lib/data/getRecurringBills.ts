import client from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Bill } from '@/types/bill';

type BillFilter = Record<string, unknown>;
type SortQuery = Record<string, 1 | -1>;

export async function getBills(
  userId: ObjectId,
  filter: BillFilter = {},
  sortQuery: SortQuery = {}
) {
  const db = client.db();

  const raw = await db
    .collection<Bill>('recurring_bills')
    .find({ userId, ...filter })
    .sort(sortQuery)
    .toArray();

  return JSON.parse(JSON.stringify(raw));
}
