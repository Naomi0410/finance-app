import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import client from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { sender, category, date, amount, recurring, type } = body;

  if (!sender || !category || !date || !amount || !type) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const db = client.db();
  const users = db.collection('users');
  const user = await users.findOne({ email: session.user.email });

  if (!user?._id) {
    return NextResponse.json({ error: 'User (me) not found' }, { status: 404 });
  }

  const finalAmount = type === 'sent' ? -Math.abs(amount) : Math.abs(amount);

  const counterparty = await users.findOne({ name: sender });

  const newTransaction = {
    sender,
    category,
    date: new Date(date),
    amount: finalAmount,
    recurring: !!recurring,
    createdAt: new Date(),
    sender_id: type === 'sent' ? new ObjectId(user._id) : counterparty?._id ?? null,
    receiver_id: type === 'sent' ? counterparty?._id ?? null : new ObjectId(user._id),
  };

  const result = await db.collection('transactions').insertOne(newTransaction);

  return NextResponse.json({ success: true, id: result.insertedId });
}