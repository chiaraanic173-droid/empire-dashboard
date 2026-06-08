'use client';
import { Card, TaskList, EditableHabitList, WeekScore, ProgressBar } from '../ui';
import { celebrate } from '@/lib/celebrate';
import type { Store } from '@/lib/store';
import { useState } from 'react';

const DAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const DAYS_SHORT = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

const DEFAULT_CHIARA_HABITS = [
  '🎬 2 Redevideos filmen',
  '🤖 1 AI Video',
  '📝 2 Textvideos',
  '🎞️ 1 Transitions Video',
  '📱 Stories posten',
  '💬 Discord Post',
  '🔴 1h Live',
  '💰 AI Accounts verkaufen (1h)',
  '📘 FB Ads lernen',
  '📦 Amazon',
  '🛍️ Ecom Brand',
  '🇪🇸 10 min Spanisch',
  '💪 Gym',
];

const DEFAULT_JOANA_HABITS = [
  '🎬 2 Redevideos',
  '🤖 1 AI Video',
  '📝 2 Textvideos',
  '🎞️ 1 Transitions Video',
  '📱 Stories posten',
  '💬 Discord Community',
  '🔴 1h Live',
  '🤝 Accountability mit Leuten',
  '📘 FB Ads lernen',
  '📦 Amazon',
  '🛍️ Ecom Brand',
  '🇪🇸 10 min Spanisch',
  '💪 Gym',
];

function getDayKey(offset = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().split('T')[0];
}

function formatDayLabel(key: string): string {
  const d = new Date(key + 'T00:00:00');
  return d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
}

type Task = { id: string; text: string; done: boolean };

function PersonDayView({ store, name, color, dayKey, defaultHabits }: {
  store: Store; name: string; color: string; dayKey: string; defaultHabits: string[];
}) {
  const habitsKey = `daily_habits_${dayKey}`;
  const tasksKey = `daily_tasks_${dayKey}`;
  const noteKey = `daily_note_${dayKey}`;
  const habitNamesKey = `daily_habit_names`;

  const habitNames = (store.data[habitNamesKey] as string[]) ?? defaultHabits;
  const checked = (store.data[habitsKey] as boolean[]) ?? Array(habitNames.length).fill(false);
  const tasks = (store.data[tasksKey] as Task[]) ?? [];
  const note = (store.data[noteKey] as string) ?? '';

  const done = checked.filter(Boolean).length;

  function toggleHabit(i: number) {
    const next = [...checked];
    next[i] = !next[i];
    if (!checked[i]) celebrate(color);
    store.update(habitsKey, next);
  }

  function updateHabitNames(names: string[]) {
    store.update(habitNamesKey, names);
  }

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-xl" style={{ color }}>{name}</h3>
          <WeekScore done={done} total={habitNames.length} color={color} />
        </div>
        <EditableHabitList
          habits={habitNames}
          checked={checked}
          onToggle={toggleHabit}
          onChange={updateHabitNames}
          color={color}
        />
        <div className="mt-3">
          <ProgressBar value={done} max={habitNames.length} color={color} />
        </div>
      </Card>

      <Card>
        <h3 className="font-display text-lg mb-3" style={{ color }}>Tasks heute</h3>
        <TaskList
          tasks={tasks}
          onChange={(t) => store.update(tasksKey, t)}
          color={color}
          placeholder="Task für heute..."
        />
      </Card>

      <Card>
        <h3 className="font-display text-lg mb-3" style={{ color }}>Notizen & Wins</h3>
        <textarea
          className="empire-textarea"
          style={{ minHeight: 80 }}
          placeholder="Was hast du heute gemacht? Wins, Notizen, Gedanken..."
          value={note}
          onChange={(e) => store.update(noteKey, e.target.value)}
        />
      </Card>
    </div>
  );
}

export default function DailyTab({ chiara, joana }: { chiara: Store; joana: Store }) {
  const [dayOffset, setDayOffset] = useState(0);
  const dayKey = getDayKey(dayOffset);
  const dayLabel = formatDayLabel(dayKey);
  const isToday = dayOffset === 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Day Navigator */}
      <div className="card">
        <div className="flex items-center justify-between">
          <button className="btn-ghost px-4 py-2" onClick={() => setDayOffset(o => o - 1)}>‹ Gestern</button>
          <div className="text-center">
            <p className="font-display text-xl" style={{ color: '#C8960C' }}>{dayLabel}</p>
            {isToday && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#C8960C22', color: '#C8960C' }}>Heute</span>}
          </div>
          <button
            className="btn-ghost px-4 py-2"
            onClick={() => setDayOffset(o => o + 1)}
            style={{ opacity: dayOffset >= 0 ? 0.3 : 1 }}
            disabled={dayOffset >= 0}
          >Morgen ›</button>
        </div>

        {/* Week strip */}
        <div className="flex gap-2 mt-4 justify-center">
          {[-3, -2, -1, 0, 1, 2, 3].map((offset) => {
            const d = new Date();
            d.setDate(d.getDate() + offset);
            const isActive = offset === dayOffset;
            return (
              <button
                key={offset}
                onClick={() => setDayOffset(offset)}
                className="flex flex-col items-center px-2 py-1 rounded-lg transition-all"
                style={isActive ? { background: '#C8960C', color: '#fff' } : { background: '#F0E8D0' }}
                disabled={offset > 0}
              >
                <span className="text-xs">{DAYS_SHORT[d.getDay()]}</span>
                <span className="text-sm font-medium">{d.getDate()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Both views */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PersonDayView store={chiara} name="Chiara" color="#C4726A" dayKey={dayKey} defaultHabits={DEFAULT_CHIARA_HABITS} />
        <PersonDayView store={joana} name="Joana" color="#7B5EA7" dayKey={dayKey} defaultHabits={DEFAULT_JOANA_HABITS} />
      </div>
    </div>
  );
}
