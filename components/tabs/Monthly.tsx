'use client';
import { Card, SectionTitle } from '../ui';
import type { Store } from '@/lib/store';
import { useState } from 'react';
import { celebrate } from '@/lib/celebrate';

type Goal = { id: string; text: string; done: boolean };
const GOAL_CATS = ['Business 🚀', 'Content 🎬', 'Finance 💰', 'Health 💪', 'Personal 🌿'];
function getMonthKey() { const d = new Date(); return `${d.getFullYear()}-${d.getMonth() + 1}`; }

export default function MonthlyTab({ shared, chiara, joana }: { shared: Store; chiara: Store; joana: Store }) {
  const monthKey = getMonthKey();
  const monthLabel = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const chiaraGoals = (chiara.data.monthlyGoals as Record<string, Goal[]>) ?? {};
  const joanaGoals = (joana.data.monthlyGoals as Record<string, Goal[]>) ?? {};
  const [newGoals, setNewGoals] = useState<Record<string, string>>({});

  function toggleGoal(store: Store, goals: Record<string, Goal[]>, cat: string, id: string, color: string) {
    const catGoals = goals[cat] ?? [];
    const wasDone = catGoals.find((g) => g.id === id)?.done === false;
    if (wasDone) celebrate(color);
    store.update('monthlyGoals', { ...goals, [cat]: catGoals.map((g) => g.id === id ? { ...g, done: !g.done } : g) });
  }

  function addGoal(store: Store, goals: Record<string, Goal[]>, cat: string, storeKey: string) {
    const text = newGoals[`${storeKey}-${cat}`]?.trim();
    if (!text) return;
    store.update('monthlyGoals', { ...goals, [cat]: [...(goals[cat] ?? []), { id: Date.now().toString(), text, done: false }] });
    setNewGoals((p) => ({ ...p, [`${storeKey}-${cat}`]: '' }));
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card text-center py-4">
        <p className="section-label">Monthly Overview</p>
        <h2 className="font-display text-3xl" style={{ color: '#C8960C' }}>{monthLabel}</h2>
      </div>
      {GOAL_CATS.map((cat) => (
        <Card key={cat}>
          <SectionTitle color="gold">{cat}</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Chiara', store: chiara, storeKey: 'chiara', color: '#C4726A', goals: chiaraGoals },
              { label: 'Joana', store: joana, storeKey: 'joana', color: '#7B5EA7', goals: joanaGoals },
            ].map(({ label, store, storeKey, color, goals }) => (
              <div key={label}>
                <p className="section-label mb-2" style={{ color }}>{label}</p>
                <div className="space-y-1 mb-2">
                  {(goals[cat] ?? []).map((g) => (
                    <div key={g.id} className="flex items-center gap-2 group">
                      <button onClick={() => toggleGoal(store, goals, cat, g.id, color)}
                        className="w-5 h-5 rounded border flex items-center justify-center text-xs flex-shrink-0"
                        style={g.done ? { background: color, borderColor: color, color: '#fff' } : { borderColor: '#E8D9B5' }}>
                        {g.done && '✓'}
                      </button>
                      <span className={`text-xs flex-1 ${g.done ? 'line-through opacity-30' : ''}`}>{g.text}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-1">
                  <input className="empire-input flex-1 text-xs py-1" placeholder="Ziel hinzufügen…"
                    value={newGoals[`${storeKey}-${cat}`] ?? ''}
                    onChange={(e) => setNewGoals((p) => ({ ...p, [`${storeKey}-${cat}`]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && addGoal(store, goals, cat, storeKey)} />
                  <button className="btn-gold text-xs px-2" style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }} onClick={() => addGoal(store, goals, cat, storeKey)}>+</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
