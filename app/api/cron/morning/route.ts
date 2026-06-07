import { NextRequest, NextResponse } from 'next/server';
import { loadUserData } from '@/lib/db';

const AFFIRMATIONS = [
  'We are golden unicorns building an empire of light. Today we overflow with abundance.',
  'Every action we take compounds into millions. Our empire grows while we sleep.',
  'We are magnetic to money, miracles, and momentum. Nothing can stop what God put in motion.',
  'Our content reaches millions and our bank accounts reflect our divine worth.',
  'We are sisters, sovereigns, and CEOs. Today we claim everything that is ours.',
  'Abundance is our birthright. We receive freely, give generously, and grow endlessly.',
  'We attract every resource, person, and opportunity our empire needs. It is done.',
];

async function sendSMS(to: string, body: string) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const apiKey = process.env.TWILIO_API_KEY;
  const apiSecret = process.env.TWILIO_API_SECRET;
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !apiKey || !apiSecret || !from) return;

  const creds = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
  await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${creds}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ To: to, From: from, Body: body }).toString(),
  });
}

function buildMessage(name: string, data: Record<string, unknown>, weekKey: string): string {
  const today = new Date();
  const dayName = today.toLocaleDateString('en-US', { weekday: 'long' });
  const affirmation = AFFIRMATIONS[today.getDay()];

  const tasks = ((data.tasks as Record<string, unknown[]>)?.[weekKey] ?? []) as { text: string; done: boolean }[];
  const pendingTasks = tasks.filter((t) => !t.done).map((t, i) => `  ${i + 1}. ${t.text}`).join('\n') || '  All done! ✨';

  const focus = (data.weeklyFocus as Record<string, string>)?.[weekKey] ?? 'Set your focus for this week.';
  const monthGoals = (data.monthlyGoals as string[]) ?? [];

  return `
🌅 Good morning, ${name}! — ${dayName}

✨ ${affirmation}

🎯 WEEKLY FOCUS:
${focus}

📋 YOUR TASKS TODAY:
${pendingTasks}

🏆 MONTHLY GOALS:
${monthGoals.slice(0, 3).map((g, i) => `  ${i + 1}. ${g}`).join('\n') || '  No goals set yet.'}

Reply "done 1 2" to check off tasks by number.
— Your Empire Dashboard 👑
`.trim();
}

function getWeekKey(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().split('T')[0];
}

export async function GET(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret') ?? req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const weekKey = getWeekKey(new Date());
  const [chiaraData, joanaData] = await Promise.all([
    loadUserData('chiara'),
    loadUserData('joana'),
  ]);

  const phones = (process.env.MY_PHONE_NUMBER ?? '').split(',');
  const [chiaraPhone, joanaPhone] = phones;

  if (chiaraPhone) await sendSMS(chiaraPhone, buildMessage('Chiara', chiaraData, weekKey));
  if (joanaPhone) await sendSMS(joanaPhone, buildMessage('Joana', joanaData, weekKey));

  return NextResponse.json({ ok: true, sent: new Date().toISOString() });
}

// Handle Twilio reply webhook to check off tasks
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const body = (formData.get('Body') as string ?? '').toLowerCase().trim();
  const from = formData.get('From') as string;

  const phones = (process.env.MY_PHONE_NUMBER ?? '').split(',');
  const userId = from === phones[0] ? 'chiara' : from === phones[1] ? 'joana' : null;

  if (!userId || !body.startsWith('done')) {
    return new NextResponse('<?xml version="1.0"?><Response></Response>', {
      headers: { 'Content-Type': 'text/xml' },
    });
  }

  const nums = body.replace('done', '').trim().split(/\s+/).map(Number).filter(Boolean);
  const weekKey = getWeekKey(new Date());
  const data = await loadUserData(userId);
  const tasks = ((data.tasks as Record<string, { text: string; done: boolean }[]>)?.[weekKey] ?? []);
  const pending = tasks.filter((t) => !t.done);

  nums.forEach((n) => {
    const task = pending[n - 1];
    if (task) task.done = true;
  });

  const { saveUserData } = await import('@/lib/db');
  await saveUserData(userId, data);

  return new NextResponse('<?xml version="1.0"?><Response><Message>✅ Tasks marked done! Keep building the empire 👑</Message></Response>', {
    headers: { 'Content-Type': 'text/xml' },
  });
}
