'use client';
import { Card, SectionTitle, ProgressBar } from '../ui';
import type { Store } from '@/lib/store';
import { useState } from 'react';
import { celebrate } from '@/lib/celebrate';

const REVENUE_STREAMS = [
  { label: 'Anic Academy', key: 'academy', goal: 50_000 },
  { label: 'Amazon', key: 'amazon', goal: 500_000 },
  { label: 'Affiliate', key: 'affiliate', goal: 20_000 },
];

const GOAL_CATS = ['Finance 💰', 'Health 💪', 'Business 🚀', 'Personal 🌿', 'Content 🎬'];

function getLast13Weeks(): { key: string; label: string }[] {
  const weeks = [];
  for (let i = 12; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay() - i * 7);
    const key = d.toISOString().split('T')[0];
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    weeks.push({ key, label });
  }
  return weeks;
}

type Goal = { id: string; text: string; done: boolean };

export default function QuarterTab({ shared }: { shared: Store }) {
  const revenue = (shared.data.revenue as Record<string, number>) ?? {};
  const gymWeeks = (shared.data.gymWeeks as Record<string, number>) ?? {}; // sessions per week
  const goals = (shared.data.quarterGoals as Record<string, Goal[]>) ?? {};
  const wins = (shared.data.wins as string[]) ?? [];
  const parking = (shared.data.parking as string[]) ?? [];

  const [newWin, setNewWin] = useState('');
  const [newPark, setNewPark] = useState('');
  const [newGoals, setNewGoals] = useState<Record<string, string>>({});

  const weeks13 = getLast13Weeks();

  function setRevenue(key: string, val: number) {
    shared.update('revenue', { ...revenue, [key]: val });
  }

  function setGym(weekKey: string, sessions: number) {
    shared.update('gymWeeks', { ...gymWeeks, [weekKey]: Math.min(7, Math.max(0, sessions)) });
  }

  function toggleGoal(cat: string, id: string) {
    const catGoals = goals[cat] ?? [];
    const updated = catGoals.map((g) => g.id === id ? { ...g, done: !g.done } : g);
    const wasDone = catGoals.find((g) => g.id === id)?.done === false;
    if (wasDone) celebrate('#C9A84C');
    shared.update('quarterGoals', { ...goals, [cat]: updated });
  }

  function addGoal(cat: string) {
    const text = newGoals[cat]?.trim();
    if (!text) return;
    const catGoals = goals[cat] ?? [];
    shared.update('quarterGoals', { ...goals, [cat]: [...catGoals, { id: Date.now().toString(), text, done: false }] });
    setNewGoals((prev) => ({ ...prev, [cat]: '' }));
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Revenue */}
      <Card>
        <SectionTitle color="gold">Revenue Streams Q{Math.ceil((new Date().getMonth() + 1) / 3)}</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REVENUE_STREAMS.map((s) => (
            <div key={s.key}>
              <p className="section-label">{s.label}</p>
              <div className="flex items-center gap-1 mb-1">
                <span className="opacity-40 text-sm">€</span>
                <input
                  type="number"
                  className="bg-transparent font-display text-2xl focus:outline-none w-full"
                  style={{ color: '#C9A84C' }}
                  value={revenue[s.key] ?? 0}
                  onChange={(e) => setRevenue(s.key, Number(e.target.value))}
                />
              </div>
              <p className="text-xs opacity-30 mb-2">Goal: €{s.goal.toLocaleString()}</p>
              <ProgressBar value={revenue[s.key] ?? 0} max={s.goal} color="#C9A84C" />
            </div>
          ))}
        </div>
      </Card>

      {/* Gym Grid */}
      <Card>
        <SectionTitle color="gold">Gym Consistency — Last 13 Weeks</SectionTitle>
        <div className="grid grid-cols-13 gap-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(13, 1fr)' }}>
          {weeks13.map((w) => {
            const sessions = gymWeeks[w.key] ?? 0;
            const intensity = sessions / 7;
            return (
              <div key={w.key} className="flex flex-col items-center gap-1">
                <div
                  className="w-full aspect-square rounded-sm cursor-pointer transition-all hover:scale-110"
                  style={{ background: intensity > 0 ? `rgba(201,168,76,${0.2 + intensity * 0.8})` : '#2E2A25' }}
                  title={`${w.label}: ${sessions} sessions`}
                  onClick={() => setGym(w.key, (sessions + 1) % 8)}
                />
                <span className="text-xs opacity-20" style={{ fontSize: 8 }}>{sessions > 0 ? sessions : ''}</span>
              </div>
            );
          })}
        </div>
        <p className="text-xs opacity-30 mt-2 text-center">Click a week to increment sessions (0–7)</p>
      </Card>

      {/* Quarterly Goals */}
      <Card>
        <SectionTitle color="gold">Quarterly Goals</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GOAL_CATS.map((cat) => {
            const catGoals = goals[cat] ?? [];
            const done = catGoals.filter((g) => g.done).length;
            return (
              <div key={cat}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">{cat}</p>
                  <span className="text-xs opacity-40">{done}/{catGoals.length}</span>
                </div>
                <div className="space-y-1 mb-2">
                  {catGoals.map((g) => (
                    <div key={g.id} className="flex items-center gap-2 group">
                      <button
                        onClick={() => toggleGoal(cat, g.id)}
                        className="w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 text-xs transition-all"
                        style={g.done ? { background: '#C9A84C', borderColor: '#C9A84C', color: '#1A1714' } : { borderColor: '#3A3530' }}
                      >
                        {g.done && '✓'}
                      </button>
                      <span className={`text-xs flex-1 ${g.done ? 'line-through opacity-30' : ''}`}>{g.text}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-1">
                  <input
                    className="empire-input flex-1 text-xs py-1"
                    placeholder="Add goal…"
                    value={newGoals[cat] ?? ''}
                    onChange={(e) => setNewGoals((p) => ({ ...p, [cat]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && addGoal(cat)}
                  />
                  <button className="btn-gold text-xs px-2" onClick={() => addGoal(cat)}>+</button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Wins + Parking Lot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <SectionTitle color="gold">Achievements & Wins 🏆</SectionTitle>
          <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
            {wins.map((w, i) => (
              <div key={i} className="flex items-center gap-2 group rounded p-2" style={{ background: '#C9A84C11' }}>
                <span className="text-lg">✨</span>
                <span className="text-sm flex-1">{w}</span>
                <button onClick={() => shared.update('wins', wins.filter((_, j) => j !== i))} className="opacity-0 group-hover:opacity-40 text-xs">✕</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input className="empire-input flex-1" placeholder="Log a win…" value={newWin} onChange={(e) => setNewWin(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && newWin.trim()) { shared.update('wins', [...wins, newWin.trim()]); setNewWin(''); } }} />
            <button className="btn-gold" onClick={() => { if (newWin.trim()) { shared.update('wins', [...wins, newWin.trim()]); setNewWin(''); } }}>🏆</button>
          </div>
        </Card>
        <Card>
          <SectionTitle color="gold">Parking Lot 🅿️</SectionTitle>
          <p className="text-xs opacity-40 mb-3">Ideas for later — don't lose them</p>
          <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
            {parking.map((p, i) => (
              <div key={i} className="flex items-center gap-2 group">
                <span className="text-xs opacity-30 w-4">{i + 1}.</span>
                <span className="text-sm flex-1">{p}</span>
                <button onClick={() => shared.update('parking', parking.filter((_, j) => j !== i))} className="opacity-0 group-hover:opacity-40 text-xs">✕</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input className="empire-input flex-1" placeholder="Park an idea…" value={newPark} onChange={(e) => setNewPark(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && newPark.trim()) { shared.update('parking', [...parking, newPark.trim()]); setNewPark(''); } }} />
            <button className="btn-ghost" onClick={() => { if (newPark.trim()) { shared.update('parking', [...parking, newPark.trim()]); setNewPark(''); } }}>+</button>
          </div>
        </Card>
      </div>
    </div>
  );
}
