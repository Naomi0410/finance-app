import { NextResponse } from 'next/server';
import client from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(request: Request, { params }: { params: Promise<{ budget_id: string }> }) {
  try {
    const db = client.db();
    const {budget_id} = await params;

    if (!ObjectId.isValid(budget_id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const result = await db.collection('budgets').deleteOne({ _id: new ObjectId(budget_id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete Budget Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ budget_id: string }> }) {
  try {
    const db = client.db();
    const {budget_id} = await params;

    if (!ObjectId.isValid(budget_id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const { category, theme, amount } = body;

    if (!category || !theme || typeof amount !== 'number') {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
    }

    const result = await db.collection('budgets').updateOne(
      { _id: new ObjectId(budget_id) },
      { $set: { category, theme, amount } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Budget not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update Budget Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}