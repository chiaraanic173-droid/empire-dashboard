'use client';
import { Card, SectionTitle, HabitRow, TaskList, WeekScore, ProgressBar } from '../ui';
import { celebrate } from '@/lib/celebrate';
import type { Store } from '@/lib/store';
import { useState } from 'react';

const HABITS = [
  { label: 'Morning workout / movement' },
  { label: 'Read 10 pages' },
  { label: 'No phone first 30 mins' },
  { label: 'Journaling / reflection' },
  { label: 'Healthy eating' },
  { label: 'Content created' },
  { label: 'Evening wind-down' },
];

type Task = { id: string; text: string; done: boolean };

export default function PersonalTab({
  store, name, color,
}: {
  store: Store;
  name: string;
  color: string;
}) {
  const habits = store.getWeekly<boolean[]>('habits', Array(HABITS.length).fill(false));
  const tasks = store.getWeekly<Task[]>('tasks', []);
  const weekFocus = store.getWeekly<string>('weeklyFocus', '');
  const monthGoals = (store.data.monthlyGoals as string[]) ?? [];
  const ideas = (store.data.ideas as string[]) ?? [];
  const reflection = store.getWeekly<{ grateful: string; win: string; tomorrow: string }>('reflection', { grateful: '', win: '', tomorrow: '' });

  function toggleHabit(i: number) {
    const next = [...habits];
    next[i] = !next[i];
    if (!habits[i]) celebrate(color);
    store.updateWeekly('habits', next);
  }

  const habitsDone = habits.filter(Boolean).length;

  const [newGoal, setNewGoal] = useState('');
  const [newIdea, setNewIdea] = useState('');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Weekly Focus */}
      <Card>
        <SectionTitle color={color === '#C4726A' ? 'rose' : 'violet'}>Weekly Focus</SectionTitle>
        <textarea
          className="empire-textarea"
          style={{ minHeight: 60, borderColor: `${color}44` }}
          placeholder="What's your main focus this week?"
          value={weekFocus}
          onChange={(e) => store.updateWeekly('weeklyFocus', e.target.value)}
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Task List */}
        <Card>
          <SectionTitle color={color === '#C4726A' ? 'rose' : 'violet'}>My Tasks</SectionTitle>
          <TaskList tasks={tasks} onChange={(t) => store.updateWeekly('tasks', t)} color={color} />
        </Card>

        {/* Habits */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <SectionTitle color={color === '#C4726A' ? 'rose' : 'violet'}>Daily Habits</SectionTitle>
            <WeekScore done={habitsDone} total={HABITS.length} color={color} />
          </div>
          <div className="divide-y" style={{ borderColor: '#2E2A25' }}>
            {HABITS.map((h, i) => (
              <HabitRow key={h.label} habit={h.label} checked={habits[i] ?? false} onToggle={() => toggleHabit(i)} color={color} />
            ))}
          </div>
          <div className="mt-3">
            <ProgressBar value={habitsDone} max={HABITS.length} color={color} />
          </div>
        </Card>
      </div>

      {/* Monthly Goals */}
      <Card>
        <SectionTitle color={color === '#C4726A' ? 'rose' : 'violet'}>Monthly Goals</SectionTitle>
        <div className="space-y-2 mb-3">
          {monthGoals.map((g, i) => (
            <div key={i} className="flex items-center gap-2 group">
              <span className="text-xs font-mono opacity-30 w-4">{i + 1}</span>
              <span className="text-sm flex-1">{g}</span>
              <button
                onClick={() => store.update('monthlyGoals', monthGoals.filter((_, j) => j !== i))}
                className="opacity-0 group-hover:opacity-40 text-xs"
              >✕</button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="empire-input flex-1"
            placeholder="Add a monthly goal…"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newGoal.trim()) {
                store.update('monthlyGoals', [...monthGoals, newGoal.trim()]);
                setNewGoal('');
              }
            }}
          />
          <button
            className="btn-gold"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}
            onClick={() => {
              if (newGoal.trim()) {
                store.update('monthlyGoals', [...monthGoals, newGoal.trim()]);
                setNewGoal('');
              }
            }}
          >+</button>
        </div>
      </Card>

      {/* Idea Board */}
      <Card>
        <SectionTitle color={color === '#C4726A' ? 'rose' : 'violet'}>Idea Board ✨</SectionTitle>
        <div className="flex flex-wrap gap-2 mb-3">
          {ideas.map((idea, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs"
              style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}
            >
              {idea}
              <button onClick={() => store.update('ideas', ideas.filter((_, j) => j !== i))} className="opacity-50 hover:opacity-100 ml-1">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="empire-input flex-1"
            placeholder="Capture an idea…"
            value={newIdea}
            onChange={(e) => setNewIdea(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newIdea.trim()) {
                store.update('ideas', [...ideas, newIdea.trim()]);
                setNewIdea('');
              }
            }}
          />
          <button
            className="btn-gold"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}
            onClick={() => {
              if (newIdea.trim()) {
                store.update('ideas', [...ideas, newIdea.trim()]);
                setNewIdea('');
              }
            }}
          >💡</button>
        </div>
      </Card>

      {/* Daily Reflection */}
      <Card>
        <SectionTitle color={color === '#C4726A' ? 'rose' : 'violet'}>Daily Reflection</SectionTitle>
        <div className="space-y-3">
          {([
            ['grateful', '🙏 I am grateful for…'],
            ['win', '🏆 My win of the day…'],
            ['tomorrow', '🌅 Tomorrow I intend to…'],
          ] as [keyof typeof reflection, string][]).map(([k, label]) => (
            <div key={k}>
              <label className="section-label">{label}</label>
              <textarea
                className="empire-textarea"
                style={{ minHeight: 56, borderColor: `${color}33` }}
                value={reflection[k]}
                onChange={(e) => store.updateWeekly('reflection', { ...reflection, [k]: e.target.value })}
                placeholder={label}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
