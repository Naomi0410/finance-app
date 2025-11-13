import { NextResponse } from 'next/server';
import client from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(request: Request, { params }: { params: Promise<{ pot_id: string }> }) {
  try {
    const db = client.db();
    const {pot_id} = await params;

    if (!ObjectId.isValid(pot_id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const result = await db.collection('pots').deleteOne({ _id: new ObjectId(pot_id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Pot not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete Pot Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ pot_id: string }> }) {
  try {
    const db = client.db();
    const { pot_id } = await params;

    if (!ObjectId.isValid(pot_id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const { name, theme, amount, saved, mode } = body;

    const updateFields: any = {};

    // Optional full update
    if (name) updateFields.name = name;
    if (theme) updateFields.theme = theme;
    if (amount) updateFields.amount = amount;

    // Handle saved separately
    if (saved && mode) {
      const pot = await db.collection('pots').findOne({ _id: new ObjectId(pot_id) });
      if (!pot) {
        return NextResponse.json({ error: 'Pot not found' }, { status: 404 });
      }

      const newSaved = mode === 'add'
        ? pot.saved + saved
        : Math.max(pot.saved - saved, 0);

      updateFields.saved = newSaved;
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json({ error: 'No valid fields provided' }, { status: 400 });
    }

    const result = await db.collection('pots').updateOne(
      { _id: new ObjectId(pot_id) },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
    return NextResponse.json({ error: 'Pot not found' }, { status: 404 });
  }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update Pot Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}