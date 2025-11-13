import client from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Bill } from '@/types/bill';

export async function getBills(userId: ObjectId, filter?, sortQuery? ) {
  const db = client.db(); 

  const raw = await db
    .collection<Bill>('recurring_bills')
    .find({userId: userId, ...filter })
    .sort(sortQuery)
    .toArray();

  return JSON.parse(JSON.stringify(raw));
}