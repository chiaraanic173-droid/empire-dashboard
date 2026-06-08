'use client';
import { Card, EditableTitle, EditableHabitList, TaskList, WeekScore, ProgressBar } from '../ui';
import { celebrate } from '@/lib/celebrate';
import type { Store } from '@/lib/store';
import { useState } from 'react';

const DEFAULT_HABITS = [
  'Morning routine',
  'Read 10 pages',
  'No phone 30 min',
  'Journaling',
  'Healthy eating',
  'Content created',
  'Evening wind-down',
];

type Task = { id: string; text: string; done: boolean };

export default function PersonalTab({ store, name, color }: { store: Store; name: string; color: string }) {
  const habits = (store.data.habitNames as string[]) ?? DEFAULT_HABITS;
  const checked = store.getWeekly<boolean[]>('habits', Array(habits.length).fill(false));
  const tasks = store.getWeekly<Task[]>('tasks', [] as Task[]);
  const weekFocus = store.getWeekly<string>('weeklyFocus', '');
  const monthlyGoals = (store.data.monthlyGoals as string[]) ?? [];
  const ideas = (store.data.ideas as string[]) ?? [];
  const reflection = store.getWeekly<{ grateful: string; win: string; tomorrow: string }>('reflection', { grateful: '', win: '', tomorrow: '' });
  const habitTitle = (store.data.habitSectionTitle as string) ?? 'Daily Habits';
  const [newGoal, setNewGoal] = useState('');
  const [newIdea, setNewIdea] = useState('');

  function toggleHabit(i: number) {
    const next = [...checked];
    next[i] = !next[i];
    if (!checked[i]) celebrate(color);
    store.updateWeekly('habits', next);
  }

  function updateHabits(newHabits: string[]) {
    store.update('habitNames', newHabits);
    store.updateWeekly('habits', Array(newHabits.length).fill(false));
  }

  const habitsDone = checked.filter(Boolean).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <p className="section-label">Weekly Focus</p>
        <textarea
          className="empire-textarea"
          style={{ minHeight: 60 }}
          placeholder="Was ist dein Hauptfokus diese Woche?"
          value={weekFocus}
          onChange={(e) => store.updateWeekly('weeklyFocus', e.target.value)}
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-display text-xl mb-4" style={{ color }}>Meine Tasks</h3>
          <TaskList tasks={tasks} onChange={(t) => store.updateWeekly('tasks', t)} color={color} placeholder="Task hinzufügen..." />
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-2">
            <EditableTitle value={habitTitle} onChange={(v) => store.update('habitSectionTitle', v)} color={color} />
            <WeekScore done={habitsDone} total={habits.length} color={color} />
          </div>
          <EditableHabitList habits={habits} checked={checked} onToggle={toggleHabit} onChange={updateHabits} color={color} />
          <div className="mt-3">
            <ProgressBar value={habitsDone} max={habits.length} color={color} />
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="font-display text-xl mb-4" style={{ color }}>Monthly Goals</h3>
        <div className="space-y-2 mb-3">
          {monthlyGoals.map((g, i) => (
            <div key={i} className="flex items-center gap-2 group">
              <span className="text-xs opacity-30 w-4">{i + 1}</span>
              <span className="text-sm flex-1">{g}</span>
              <button onClick={() => store.update('monthlyGoals', monthlyGoals.filter((_, j) => j !== i))} className="opacity-0 group-hover:opacity-40 text-xs">x</button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input className="empire-input flex-1" placeholder="Monthly Goal..." value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && newGoal.trim()) { store.update('monthlyGoals', [...monthlyGoals, newGoal.trim()]); setNewGoal(''); } }} />
          <button className="btn-gold" style={{ background: color }} onClick={() => { if (newGoal.trim()) { store.update('monthlyGoals', [...monthlyGoals, newGoal.trim()]); setNewGoal(''); } }}>+</button>
        </div>
      </Card>

      <Card>
        <h3 className="font-display text-xl mb-4" style={{ color }}>Daily Reflection</h3>
        {([['grateful', 'Dankbar fuer...'], ['win', 'Win des Tages...'], ['tomorrow', 'Morgen intendiere ich...']] as [keyof typeof reflection, string][]).map(([k, label]) => (
          <div key={k} className="mb-3">
            <p className="section-label">{label}</p>
            <textarea className="empire-textarea" style={{ minHeight: 50 }}
              value={reflection[k]} onChange={(e) => store.updateWeekly('reflection', { ...reflection, [k]: e.target.value })}
              placeholder={label} />
          </div>
        ))}
      </Card>

      <Card>
        <h3 className="font-display text-xl mb-4" style={{ color }}>Ideas</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {ideas.map((idea, i) => (
            <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs"
              style={{ background: color + '22', color, border: '1px solid ' + color + '44' }}>
              {idea}
              <button onClick={() => store.update('ideas', ideas.filter((_, j) => j !== i))} className="opacity-50 hover:opacity-100 ml-1">x</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input className="empire-input flex-1" placeholder="Idee festhalten..." value={newIdea}
            onChange={(e) => setNewIdea(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && newIdea.trim()) { store.update('ideas', [...ideas, newIdea.trim()]); setNewIdea(''); } }} />
          <button className="btn-gold" style={{ background: color }} onClick={() => { if (newIdea.trim()) { store.update('ideas', [...ideas, newIdea.trim()]); setNewIdea(''); } }}>+</button>
        </div>
      </Card>
    </div>
  );
}
