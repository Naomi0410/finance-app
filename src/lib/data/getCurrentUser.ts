import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import client from '@/lib/mongodb';
import { redirect } from 'next/navigation';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect('/login');

  const db = client.db();
  const user = await db.collection('users').findOne({ email: session.user.email });

  if (!user || !user._id) redirect('/login');
  return user;
}

