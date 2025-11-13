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
  const { category, amount, theme } = body;

  if (!category || !amount || !theme) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const db = client.db();
  const users = db.collection('users');
  const user = await users.findOne({ email: session.user.email });

  if (!user?._id) {
    return NextResponse.json({ error: 'User (me) not found' }, { status: 404 });
  }

  const userId = new ObjectId(user._id);

  // Check if budget with same category or theme already exists for this user
  const existingBudget = await db.collection('budgets').findOne({
    userId,
    $or: [
      { category },
      { theme }
    ]
  });

  if (existingBudget) {
    return NextResponse.json(
      { error: 'A budget with this category or theme already exists' },
      { status: 409 }
    );
  }

  const newBudget = {
    userId,
    createdAt: new Date(),
    category,
    amount,
    theme,
  };

  const result = await db.collection('budgets').insertOne(newBudget);

  return NextResponse.json({ success: true, id: result.insertedId });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = client.db();
  const users = db.collection('users');
  const user = await users.findOne({ email: session.user.email });

  if (!user?._id) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const userId = new ObjectId(user._id);

  const budgets = await db
    .collection('budgets')
    .find({ userId }, { projection: { _id: 0, category: 1, theme: 1 } })
    .toArray();

  return NextResponse.json({ budgets });
}