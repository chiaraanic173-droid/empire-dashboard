import { NextRequest, NextResponse } from 'next/server';
import { saveUserData } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, data } = body;
    if (!userId || !['chiara', 'joana', 'shared'].includes(userId)) {
      return NextResponse.json({ error: 'Invalid userId' }, { status: 400 });
    }
    await saveUserData(userId, data);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
}
