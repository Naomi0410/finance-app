import { ObjectId } from 'mongodb';

export type Bill = {
  _id: string;
  title: string;
  amount: number;
  dueDay: number;
  theme: string;
  paid: boolean;
  userId: ObjectId;
  createdAt: string;
  recurring: boolean;
}; 