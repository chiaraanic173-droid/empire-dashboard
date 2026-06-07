'use client';
import { Card, SectionTitle, HabitRow, TaskList, WeekScore, ProgressBar } from '../ui';
import { celebrate } from '@/lib/celebrate';
import type { Store } from '@/lib/store';

const AFFIRMATIONS = [
  'We are golden unicorns building an empire of light. Everything we touch turns to gold.',
  'Our empire is our legacy. Today we lay another brick in the most beautiful palace ever built.',
  'Millions follow us because we are real, powerful, and magnetic. We were born for this.',
  'We receive abundance in every form — followers, revenue, joy, sisterhood, freedom.',
  'Nothing can stop two sisters on a mission. Our combined energy moves mountains.',
  'The world is waiting for what only we can create. We show up fully today.',
  'We are the architects of our own reality. What we imagine, we build. What we build, endures.',
];

const HABITS = [
  'Morning workout',
  'Content created',
  'Academy check-in',
  'Gratitude practice',
  'No scroll before 9am',
  'End-of-day review',
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type Task = { id: string; text: string; done: boolean };

export default function TogetherTab({ shared, chiara, joana }: { shared: Store; chiara: Store; joana: Store }) {
  const today = new Date().getDay();
  const affirmation = AFFIRMATIONS[today];

  // Shared habits per week
  const habits = shared.getWeekly<boolean[]>('habits', Array(HABITS.length).fill(false));

  function toggleHabit(i: number) {
    const next = [...habits];
    next[i] = !next[i];
    if (!habits[i]) celebrate('#C9A84C');
    shared.updateWeekly('habits', next);
  }

  const habitsDone = habits.filter(Boolean).length;

  // Tasks
  const chiaraTasks = chiara.getWeekly<Task[]>('tasks', [] as Task[]);
  const joanaTasks = joana.getWeekly<Task[]>('tasks', [] as Task[]);

  // Empire metrics
  const metrics = (shared.data.metrics as Record<string, number>) ?? {};
  function setMetric(key: string, val: number) {
    shared.update('metrics', { ...metrics, [key]: val });
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Affirmation Banner */}
      <div className="relative overflow-hidden rounded-xl p-6" style={{ background: 'linear-gradient(135deg, #211E1A 0%, #2A2118 100%)', border: '1px solid #3A3020' }}>
        <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, #C9A84C, #E8C97A, #C9A84C)' }} />
        <p className="section-label" style={{ color: '#C9A84C' }}>Daily Affirmation</p>
        <p className="font-display text-xl italic" style={{ color: '#FAF7F2', lineHeight: 1.4 }}>"{affirmation}"</p>
        <p className="text-xs opacity-30 mt-2">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Empire Metrics */}
      <div>
        <SectionTitle color="gold">Empire Metrics</SectionTitle>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <EditableMetricCard
            label="Total Followers"
            metricKey="followers"
            goal={5_000_000}
            value={metrics.followers ?? 0}
            onChange={(v) => setMetric('followers', v)}
            color="#C9A84C"
          />
          <EditableMetricCard
            label="Monthly Profit"
            metricKey="profit"
            goal={500_000}
            value={metrics.profit ?? 0}
            onChange={(v) => setMetric('profit', v)}
            color="#C9A84C"
            prefix="€"
          />
          <EditableMetricCard
            label="Academy Students"
            metricKey="students"
            goal={10_000}
            value={metrics.students ?? 0}
            onChange={(v) => setMetric('students', v)}
            color="#C9A84C"
          />
          <EditableMetricCard
            label="1:1 Students"
            metricKey="oneOnOne"
            goal={100}
            value={metrics.oneOnOne ?? 0}
            onChange={(v) => setMetric('oneOnOne', v)}
            color="#C9A84C"
          />
        </div>
      </div>

      {/* Shared Habits */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <SectionTitle color="gold">Weekly Habits</SectionTitle>
          <WeekScore done={habitsDone} total={HABITS.length} color="#C9A84C" />
        </div>
        <div className="week-grid mb-4">
          {DAYS.map((d, i) => (
            <div key={d} className="text-center text-xs opacity-40" style={i === today ? { color: '#C9A84C', opacity: 1 } : {}}>
              {d}
            </div>
          ))}
        </div>
        <div className="divide-y" style={{ borderColor: '#2E2A25' }}>
          {HABITS.map((h, i) => (
            <HabitRow key={h} habit={h} checked={habits[i] ?? false} onToggle={() => toggleHabit(i)} color="#C9A84C" />
          ))}
        </div>
        <div className="mt-4">
          <ProgressBar value={habitsDone} max={HABITS.length} color="#C9A84C" />
        </div>
      </Card>

      {/* Split Task Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full" style={{ background: '#C4726A' }} />
            <h3 className="font-display text-xl" style={{ color: '#C4726A' }}>Chiara's Tasks</h3>
          </div>
          <TaskList
            tasks={chiaraTasks}
            onChange={(t) => chiara.updateWeekly('tasks', t)}
            color="#C4726A"
            placeholder="Chiara's task…"
          />
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full" style={{ background: '#7B5EA7' }} />
            <h3 className="font-display text-xl" style={{ color: '#7B5EA7' }}>Joana's Tasks</h3>
          </div>
          <TaskList
            tasks={joanaTasks}
            onChange={(t) => joana.updateWeekly('tasks', t)}
            color="#7B5EA7"
            placeholder="Joana's task…"
          />
        </Card>
      </div>
    </div>
  );
}

// Inline editable metric
function EditableMetricCard({ label, goal, value, onChange, color, prefix }: {
  label: string; metricKey: string; goal: number; value: number; onChange: (n: number) => void; color: string; prefix?: string;
}) {
  const pct = goal > 0 ? Math.min((value / goal) * 100, 100) : 0;
  const fmt = (n: number) => (prefix ?? '') + n.toLocaleString();
  return (
    <div className="card">
      <p className="section-label">{label}</p>
      <input
        type="number"
        className="bg-transparent w-full font-display text-2xl mb-1 focus:outline-none"
        style={{ color }}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <p className="text-xs opacity-30 mb-2">/ {fmt(goal)}</p>
      <ProgressBar value={value} max={goal} color={color} />
    </div>
  );
}
