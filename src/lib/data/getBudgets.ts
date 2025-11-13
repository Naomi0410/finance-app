import client from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Budget } from '@/types/budget';

export async function getBudgets(userId: ObjectId) {
  const db = client.db();
  const raw = await db
    .collection<Budget>('budgets')
    .find({ userId })
    .toArray();

  return JSON.parse(JSON.stringify(raw));
}