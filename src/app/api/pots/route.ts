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
  const { name, amount, theme } = body;

  if (!name || !amount || !theme) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const db = client.db();
  const users = db.collection('users');
  const user = await users.findOne({ email: session.user.email });

  if (!user?._id) {
    return NextResponse.json({ error: 'User (me) not found' }, { status: 404 });
  }

  const userId = new ObjectId(user._id);

  // Check if pot with same theme already exists for this user
  const existingBudget = await db.collection('pots').findOne({
    userId,
    theme
  });

  if (existingBudget) {
    return NextResponse.json(
      { error: 'A pot with this theme already exists' },
      { status: 409 }
    );
  }

  const newPot = {
    userId,
    createdAt: new Date(),
    name,
    amount,
    theme,
    saved: 0
  };

  const result = await db.collection('pots').insertOne(newPot);

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

  const pots = await db
    .collection('pots')
    .find({ userId }, { projection: { _id: 0, theme: 1 } })
    .toArray();

  return NextResponse.json({ pots });
}