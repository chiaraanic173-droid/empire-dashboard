'use client';
import { useState } from 'react';
import { celebrate } from '@/lib/celebrate';

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function SectionTitle({ children, color = 'gold', sub }: { children: React.ReactNode; color?: 'gold' | 'rose' | 'violet'; sub?: string }) {
  const c = { gold: '#C8960C', rose: '#C4726A', violet: '#7B5EA7' }[color];
  return (
    <div className="mb-4">
      <h2 className="font-display text-2xl font-light" style={{ color: c }}>{children}</h2>
      {sub && <p className="text-xs mt-1 opacity-50">{sub}</p>}
    </div>
  );
}

export function EditableTitle({ value, onChange, color = '#C8960C', size = 'lg' }: {
  value: string; onChange: (v: string) => void; color?: string; size?: 'sm' | 'lg';
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  if (editing) {
    return (
      <input
        autoFocus
        className="font-display bg-transparent border-b focus:outline-none mb-4"
        style={{ color, borderColor: color, fontSize: size === 'lg' ? 24 : 16, width: '100%' }}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => { onChange(draft); setEditing(false); }}
        onKeyDown={(e) => { if (e.key === 'Enter') { onChange(draft); setEditing(false); } }}
      />
    );
  }
  return (
    <h2
      className="font-display font-light mb-4 cursor-pointer hover:opacity-70 transition-opacity"
      style={{ color, fontSize: size === 'lg' ? 24 : 16 }}
      onClick={() => { setDraft(value); setEditing(true); }}
      title="Klicken zum Bearbeiten"
    >
      {value} <span style={{ fontSize: 11, opacity: 0.4 }}>✎</span>
    </h2>
  );
}

export function ProgressBar({ value, max, color = '#C8960C', label }: { value: number; max: number; color?: string; label?: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div>
      {label && <div className="flex justify-between text-xs mb-1 opacity-60"><span>{label}</span><span>{Math.round(pct)}%</span></div>}
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export function EditableHabitList({ habits, onChange, color = '#C8960C', checked, onToggle }: {
  habits: string[];
  onChange: (habits: string[]) => void;
  color?: string;
  checked: boolean[];
  onToggle: (i: number) => void;
}) {
  const [newHabit, setNewHabit] = useState('');
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState('');

  function addHabit() {
    if (!newHabit.trim()) return;
    onChange([...habits, newHabit.trim()]);
    setNewHabit('');
  }

  function removeHabit(i: number) {
    onChange(habits.filter((_, j) => j !== i));
  }

  function saveEdit(i: number) {
    const updated = [...habits];
    updated[i] = editDraft;
    onChange(updated);
    setEditingIdx(null);
  }

  return (
    <div>
      <div className="divide-y">
        {habits.map((h, i) => (
          <div key={i} className="flex items-center gap-3 py-2 group">
            <button
              onClick={() => onToggle(i)}
              className="habit-check flex-shrink-0"
              style={checked[i] ? { background: color, borderColor: color } : {}}
            >
              {checked[i] && <span style={{ color: '#fff', fontSize: 11 }}>✓</span>}
            </button>
            {editingIdx === i ? (
              <input
                autoFocus
                className="empire-input flex-1 py-1 text-sm"
                value={editDraft}
                onChange={(e) => setEditDraft(e.target.value)}
                onBlur={() => saveEdit(i)}
                onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(i); if (e.key === 'Escape') setEditingIdx(null); }}
              />
            ) : (
              <span
                className={`text-sm flex-1 cursor-pointer ${checked[i] ? 'line-through opacity-40' : ''}`}
                onClick={() => { setEditDraft(h); setEditingIdx(i); }}
                title="Klicken zum Umbenennen"
              >
                {h} <span className="opacity-0 group-hover:opacity-30 text-xs">✎</span>
              </span>
            )}
            <button
              onClick={() => removeHabit(i)}
              className="opacity-0 group-hover:opacity-30 hover:opacity-100 text-xs transition-opacity"
            >✕</button>
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <input
          className="empire-input flex-1"
          placeholder="Habit hinzufügen…"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addHabit()}
        />
        <button className="btn-gold" style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }} onClick={addHabit}>+</button>
      </div>
    </div>
  );
}

export function HabitRow({ habit, checked, onToggle, color = '#C8960C' }: { habit: string; checked: boolean; onToggle: () => void; color?: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <button onClick={onToggle} className="habit-check" style={checked ? { background: color, borderColor: color } : {}}>
        {checked && <span style={{ color: '#fff', fontSize: 11 }}>✓</span>}
      </button>
      <span className={`text-sm ${checked ? 'line-through opacity-40' : ''}`}>{habit}</span>
    </div>
  );
}

type Task = { id: string; text: string; done: boolean };

export function TaskList({ tasks, onChange, color = '#C8960C', placeholder = 'Add a task…' }: {
  tasks: Task[]; onChange: (tasks: Task[]) => void; color?: string; placeholder?: string;
}) {
  const [input, setInput] = useState('');

  function addTask() {
    const text = input.trim();
    if (!text) return;
    onChange([...tasks, { id: Date.now().toString(), text, done: false }]);
    setInput('');
  }

  function toggle(id: string) {
    const wasUndone = tasks.find((t) => t.id === id)?.done === false;
    if (wasUndone) celebrate(color);
    onChange(tasks.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  }

  function remove(id: string) { onChange(tasks.filter((t) => t.id !== id)); }

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <input className="empire-input flex-1" placeholder={placeholder} value={input}
          onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTask()} />
        <button className="btn-gold" onClick={addTask} style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>+</button>
      </div>
      <div className="space-y-1">
        {tasks.map((t) => (
          <div key={t.id} className="flex items-center gap-2 group">
            <button onClick={() => toggle(t.id)} className="habit-check flex-shrink-0"
              style={t.done ? { background: color, borderColor: color } : {}}>
              {t.done && <span style={{ color: '#fff', fontSize: 11 }}>✓</span>}
            </button>
            <span className={`text-sm flex-1 ${t.done ? 'line-through opacity-30' : ''}`}>{t.text}</span>
            <button onClick={() => remove(t.id)} className="opacity-0 group-hover:opacity-40 text-xs hover:opacity-100">✕</button>
          </div>
        ))}
        {tasks.length === 0 && <p className="text-xs opacity-30 italic">Noch keine Tasks</p>}
      </div>
    </div>
  );
}

export function WeekScore({ done, total, color }: { done: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: `${color}22`, color }}>
      <span>{pct}%</span><span className="opacity-60">this week</span>
    </div>
  );
}

export function MetricCard({ label, current, goal, format, color = '#C8960C' }: {
  label: string; current: number; goal: number; format?: (n: number) => string; color?: string;
}) {
  const fmt = format ?? ((n: number) => n.toLocaleString());
  const pct = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  return (
    <div className="card">
      <p className="section-label">{label}</p>
      <p className="font-display text-3xl mb-1" style={{ color }}>{fmt(current)}</p>
      <p className="text-xs opacity-40 mb-3">Goal: {fmt(goal)}</p>
      <ProgressBar value={current} max={goal} color={color} />
    </div>
  );
}
