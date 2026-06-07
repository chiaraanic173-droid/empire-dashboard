import { NextRequest, NextResponse } from 'next/server';
import { loadUserData } from '@/lib/db';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId || !['chiara', 'joana', 'shared'].includes(userId)) {
    return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
  }
  try {
    const data = await loadUserData(userId);
    return NextResponse.json({ data });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
