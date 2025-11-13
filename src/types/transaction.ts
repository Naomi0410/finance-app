import { ObjectId } from 'mongodb';

export type Transaction = {
  _id: string;
  sender: string;
  sender_id: ObjectId | string;
  receiver_id: ObjectId | string;
  category: string;
  date: string;
  amount: number;
  recurring: boolean;
}; 