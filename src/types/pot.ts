import { ObjectId } from 'mongodb';

export type Pot = {
  _id: string;
  userId: ObjectId | string;
  name: string;
  theme: string;
  amount: number;
  saved: number;
  createdAt: string;
};