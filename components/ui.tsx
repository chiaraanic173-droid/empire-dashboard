'use client';
import { useState } from 'react';
import { celebrate } from '@/lib/celebrate';

// ── Card ──────────────────────────────────────────────────────────
export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`card ${className}`}>{children}</div>;
}

// ── Section Title ─────────────────────────────────────────────────
export function SectionTitle({ children, color = 'gold', sub }: { children: React.ReactNode; color?: 'gold' | 'rose' | 'violet'; sub?: string }) {
  const c = { gold: '#C9A84C', rose: '#C4726A', violet: '#7B5EA7' }[color];
  return (
    <div className="mb-4">
      <h2 className="font-display text-2xl font-light" style={{ color: c }}>{children}</h2>
      {sub && <p className="text-xs mt-1 opacity-50">{sub}</p>}
    </div>
  );
}

// ── Progress Bar ──────────────────────────────────────────────────
export function ProgressBar({ value, max, color = '#C9A84C', label }: { value: number; max: number; color?: string; label?: string }) {
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

// ── Habit Row ─────────────────────────────────────────────────────
export function HabitRow({
  habit, checked, onToggle, color = '#C9A84C',
}: { habit: string; checked: boolean; onToggle: () => void; color?: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <button
        onClick={onToggle}
        className="habit-check"
        style={checked ? { background: color, borderColor: color } : {}}
      >
        {checked && <span style={{ color: '#1A1714' }}>✓</span>}
      </button>
      <span className={`text-sm ${checked ? 'line-through opacity-40' : ''}`}>{habit}</span>
    </div>
  );
}

// ── Task List ─────────────────────────────────────────────────────
type Task = { id: string; text: string; done: boolean };

export function TaskList({
  tasks, onChange, color = '#C9A84C', placeholder = 'Add a task…',
}: {
  tasks: Task[];
  onChange: (tasks: Task[]) => void;
  color?: string;
  placeholder?: string;
}) {
  const [input, setInput] = useState('');

  function addTask() {
    const text = input.trim();
    if (!text) return;
    onChange([...tasks, { id: Date.now().toString(), text, done: false }]);
    setInput('');
  }

  function toggle(id: string) {
    const updated = tasks.map((t) => t.id === id ? { ...t, done: !t.done } : t);
    const wasUndone = tasks.find((t) => t.id === id)?.done === false;
    if (wasUndone) celebrate(color);
    onChange(updated);
  }

  function remove(id: string) {
    onChange(tasks.filter((t) => t.id !== id));
  }

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <input
          className="empire-input flex-1"
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
        />
        <button className="btn-gold" onClick={addTask} style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>+</button>
      </div>
      <div className="space-y-1">
        {tasks.map((t) => (
          <div key={t.id} className="flex items-center gap-2 group">
            <button
              onClick={() => toggle(t.id)}
              className="habit-check flex-shrink-0"
              style={t.done ? { background: color, borderColor: color } : {}}
            >
              {t.done && <span style={{ color: '#1A1714', fontSize: 11 }}>✓</span>}
            </button>
            <span className={`text-sm flex-1 ${t.done ? 'line-through opacity-30' : ''}`}>{t.text}</span>
            <button onClick={() => remove(t.id)} className="opacity-0 group-hover:opacity-40 text-xs hover:opacity-100 transition-opacity">✕</button>
          </div>
        ))}
        {tasks.length === 0 && <p className="text-xs opacity-30 italic">No tasks yet — add one above</p>}
      </div>
    </div>
  );
}

// ── Empire Metric Card ─────────────────────────────────────────────
export function MetricCard({ label, current, goal, format, color = '#C9A84C' }: {
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

// ── Numbered Input Metric ─────────────────────────────────────────
export function NumberInput({ value, onChange, color = '#C9A84C' }: {
  value: number; onChange: (n: number) => void; color?: string;
}) {
  return (
    <input
      type="number"
      className="empire-input text-right"
      style={{ color, fontFamily: 'Cormorant Garamond, serif', fontSize: 20 }}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
}

// ── Week Score Badge ──────────────────────────────────────────────
export function WeekScore({ done, total, color }: { done: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: `${color}22`, color }}>
      <span>{pct}%</span>
      <span className="opacity-60">this week</span>
    </div>
  );
}
