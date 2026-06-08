'use client';
import { Card, EditableTitle, EditableHabitList, TaskList, WeekScore, ProgressBar } from '../ui';
import { celebrate } from '@/lib/celebrate';
import type { Store } from '@/lib/store';

const DEFAULT_HABITS = [
  '🎬 2 Redevideos filmen',
  '🤖 1 AI Video',
  '📝 2 Textvideos',
  '🎞️ 1 Transitions Video',
  '📱 Stories posten',
  '💬 Discord Nachricht + Value',
  '🔴 1h Live gehen',
  '🇪🇸 10 min Spanisch',
  '📘 FB Ads lernen',
  '📦 Amazon arbeiten',
  '🛍️ Ecom Brand arbeiten',
  '💪 Gym / Dehnen',
];

const AFFIRMATIONS = [
  'We are golden unicorns building an empire of light. Everything we touch turns to gold.',
  'Our empire is our legacy. Today we lay another brick in the most beautiful palace ever built.',
  'Millions follow us because we are real, powerful, and magnetic. We were born for this.',
  'We receive abundance in every form — followers, revenue, joy, sisterhood, freedom.',
  'Nothing can stop two sisters on a mission. Our combined energy moves mountains.',
  'The world is waiting for what only we can create. We show up fully today.',
  'We are the architects of our own reality. What we imagine, we build. What we build, endures.',
];

type Task = { id: string; text: string; done: boolean };

export default function TogetherTab({ shared, chiara, joana }: { shared: Store; chiara: Store; joana: Store }) {
  const today = new Date().getDay();
  const affirmation = AFFIRMATIONS[today];

  const habits = (shared.data.habitNames as string[]) ?? DEFAULT_HABITS;
  const checked = shared.getWeekly<boolean[]>('habits', Array(habits.length).fill(false));

  function toggleHabit(i: number) {
    const next = [...checked];
    next[i] = !next[i];
    if (!checked[i]) celebrate('#C8960C');
    shared.updateWeekly('habits', next);
  }

  function updateHabits(newHabits: string[]) {
    shared.update('habitNames', newHabits);
    shared.updateWeekly('habits', Array(newHabits.length).fill(false));
  }

  const habitsDone = checked.filter(Boolean).length;
  const chiaraTasks = chiara.getWeekly<Task[]>('tasks', [] as Task[]);
  const joanaTasks = joana.getWeekly<Task[]>('tasks', [] as Task[]);
  const metrics = (shared.data.metrics as Record<string, number>) ?? {};
  const sectionTitle = (shared.data.habitSectionTitle as string) ?? 'Daily Habits — Both';

  function setMetric(key: string, val: number) {
    shared.update('metrics', { ...metrics, [key]: val });
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative overflow-hidden rounded-xl p-6" style={{ background: 'linear-gradient(135deg, #FFFDF7, #FFF8EC)', border: '1px solid #E8D9B5' }}>
        <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, #C8960C, #F0C040, #C8960C)' }} />
        <p className="section-label">Daily Affirmation</p>
        <p className="font-display text-xl italic" style={{ color: '#2C1A0E', lineHeight: 1.4 }}>"{affirmation}"</p>
        <p className="text-xs opacity-30 mt-2">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      <div>
        <h2 className="font-display text-2xl font-light mb-4" style={{ color: '#C8960C' }}>Empire Metrics</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            { label: 'Total Followers', key: 'followers', goal: 5_000_000 },
            { label: 'Monthly Profit', key: 'profit', goal: 500_000, prefix: '€' },
            { label: 'Academy Students', key: 'students', goal: 10_000 },
            { label: '1:1 Students', key: 'oneOnOne', goal: 100 },
          ].map((m) => (
            <div key={m.key} className="card">
              <p className="section-label">{m.label}</p>
              <input type="number" className="bg-transparent w-full font-display text-2xl mb-1 focus:outline-none"
                style={{ color: '#C8960C', border: 'none' }}
                value={metrics[m.key] ?? 0}
                onChange={(e) => setMetric(m.key, Number(e.target.value))} />
              <p className="text-xs opacity-30 mb-2">/ {m.prefix ?? ''}{m.goal.toLocaleString()}</p>
              <ProgressBar value={metrics[m.key] ?? 0} max={m.goal} color="#C8960C" />
            </div>
          ))}
        </div>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-2">
          <EditableTitle
            value={sectionTitle}
            onChange={(v) => shared.update('habitSectionTitle', v)}
            color="#C8960C"
          />
          <WeekScore done={habitsDone} total={habits.length} color="#C8960C" />
        </div>
        <EditableHabitList
          habits={habits}
          checked={checked}
          onToggle={toggleHabit}
          onChange={updateHabits}
          color="#C8960C"
        />
        <div className="mt-4">
          <ProgressBar value={habitsDone} max={habits.length} color="#C8960C" />
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full" style={{ background: '#C4726A' }} />
            <h3 className="font-display text-xl" style={{ color: '#C4726A' }}>Chiara's Tasks</h3>
          </div>
          <TaskList tasks={chiaraTasks} onChange={(t) => chiara.updateWeekly('tasks', t)} color="#C4726A" placeholder="Chiara's task…" />
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full" style={{ background: '#7B5EA7' }} />
            <h3 className="font-display text-xl" style={{ color: '#7B5EA7' }}>Joana's Tasks</h3>
          </div>
          <TaskList tasks={joanaTasks} onChange={(t) => joana.updateWeekly('tasks', t)} color="#7B5EA7" placeholder="Joana's task…" />
        </Card>
      </div>
    </div>
  );
}
