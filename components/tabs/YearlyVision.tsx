'use client';
import { Card, SectionTitle, ProgressBar } from '../ui';
import type { Store } from '@/lib/store';
import { useState } from 'react';
import { celebrate } from '@/lib/celebrate';

const VISION_BOARD = [
  { label: 'Dream Home 🏡', emoji: '🏡' },
  { label: '4 Cars 🚗', emoji: '🚗' },
  { label: 'World Travel ✈️', emoji: '✈️' },
  { label: 'Retire Parents 👨‍👩‍👧‍👧', emoji: '💝' },
];

const GOAL_CATS = ['Finance 💰', 'Health 💪', 'Business 🚀', 'Personal 🌿', 'Content 🎬', 'Family 👨‍👩‍👧‍👧'];

const REVENUE_TARGETS = [
  { label: 'Amazon', target: '€500K/mo' },
  { label: 'YouTube', target: '€10K/mo' },
  { label: 'Ecom Brand', target: '€100K/mo' },
  { label: 'Wix AI Sales', target: '10 sales/day' },
];

type Goal = { id: string; text: string; done: boolean };
type Bucket = { id: string; label: string; color: string };

const MANIFESTO_QUESTIONS = [
  { key: 'vision', label: 'Our Vision for This Year', placeholder: 'Paint the full picture of what this year looks like at its most abundant…' },
  { key: 'nonNeg', label: 'Our Non-Negotiables', placeholder: 'What we will never compromise on, no matter what…' },
  { key: 'focus', label: 'Our Main Focus', placeholder: 'The single most important thing we are building…' },
  { key: 'leaving', label: 'What We Are Leaving Behind', placeholder: 'The mindsets, habits, and energies we release this year…' },
];

export default function YearlyVisionTab({ shared }: { shared: Store }) {
  const manifesto = (shared.data.manifesto as Record<string, string>) ?? {};
  const goals = (shared.data.yearGoals as Record<string, Goal[]>) ?? {};
  const buckets = (shared.data.themeBuckets as Bucket[]) ?? [];
  const [newGoals, setNewGoals] = useState<Record<string, string>>({});
  const [newBucket, setNewBucket] = useState('');

  function setManifesto(key: string, val: string) {
    shared.update('manifesto', { ...manifesto, [key]: val });
  }

  function toggleGoal(cat: string, id: string) {
    const catGoals = goals[cat] ?? [];
    const wasDone = catGoals.find((g) => g.id === id)?.done === false;
    if (wasDone) celebrate('#C9A84C');
    shared.update('yearGoals', { ...goals, [cat]: catGoals.map((g) => g.id === id ? { ...g, done: !g.done } : g) });
  }

  function addGoal(cat: string) {
    const text = newGoals[cat]?.trim();
    if (!text) return;
    const catGoals = goals[cat] ?? [];
    shared.update('yearGoals', { ...goals, [cat]: [...catGoals, { id: Date.now().toString(), text, done: false }] });
    setNewGoals((p) => ({ ...p, [cat]: '' }));
  }

  function addBucket() {
    if (!newBucket.trim()) return;
    const colors = ['#C9A84C', '#C4726A', '#7B5EA7'];
    shared.update('themeBuckets', [...buckets, { id: Date.now().toString(), label: newBucket.trim(), color: colors[buckets.length % 3] }]);
    setNewBucket('');
  }

  function removeBucket(id: string) {
    shared.update('themeBuckets', buckets.filter((b) => b.id !== id));
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Manifesto */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#0F0D0B', border: '1px solid #3A3020' }}>
        <div className="p-5 border-b" style={{ borderColor: '#3A3020' }}>
          <h2 className="font-display text-3xl" style={{ color: '#C9A84C' }}>Our Empire Manifesto {new Date().getFullYear()}</h2>
          <p className="text-xs opacity-40 mt-1">The sacred contract with our highest selves</p>
        </div>
        <div className="p-5 space-y-5">
          {MANIFESTO_QUESTIONS.map((q) => (
            <div key={q.key}>
              <label className="section-label" style={{ color: '#C9A84C' }}>{q.label}</label>
              <textarea
                className="empire-textarea"
                style={{ minHeight: 80, borderColor: '#C9A84C33', background: '#1A1714' }}
                placeholder={q.placeholder}
                value={manifesto[q.key] ?? ''}
                onChange={(e) => setManifesto(q.key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Vision Board */}
      <Card>
        <SectionTitle color="gold">Vision Board 🌟</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {VISION_BOARD.map((v) => (
            <div key={v.label} className="rounded-xl p-4 text-center" style={{ background: '#C9A84C15', border: '1px solid #C9A84C33' }}>
              <div className="text-3xl mb-2">{v.emoji}</div>
              <p className="text-xs font-medium" style={{ color: '#C9A84C' }}>{v.label}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Revenue Targets */}
      <Card>
        <SectionTitle color="gold">Revenue Targets</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {REVENUE_TARGETS.map((r) => (
            <div key={r.label} className="rounded-lg p-3" style={{ background: '#2A2118', border: '1px solid #3A3020' }}>
              <p className="text-xs opacity-40 mb-1">{r.label}</p>
              <p className="font-display text-xl" style={{ color: '#C9A84C' }}>{r.target}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Year Theme Buckets */}
      <Card>
        <SectionTitle color="gold">Year Theme Buckets</SectionTitle>
        <div className="flex flex-wrap gap-2 mb-4">
          {buckets.map((b) => (
            <div key={b.id} className="group flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: `${b.color}22`, border: `1px solid ${b.color}44` }}>
              <span className="text-sm" style={{ color: b.color }}>{b.label}</span>
              <button onClick={() => removeBucket(b.id)} className="opacity-0 group-hover:opacity-50 text-xs">×</button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input className="empire-input flex-1" placeholder="Add a theme bucket…" value={newBucket} onChange={(e) => setNewBucket(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addBucket()} />
          <button className="btn-gold" onClick={addBucket}>+ Bucket</button>
        </div>
      </Card>

      {/* Yearly Goals */}
      <Card>
        <SectionTitle color="gold">Yearly Goals by Category</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {GOAL_CATS.map((cat) => {
            const catGoals = goals[cat] ?? [];
            const done = catGoals.filter((g) => g.done).length;
            return (
              <div key={cat}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium">{cat}</p>
                  <span className="text-xs opacity-40">{done}/{catGoals.length}</span>
                </div>
                {catGoals.length > 0 && (
                  <div className="mb-2">
                    <ProgressBar value={done} max={catGoals.length} color="#C9A84C" />
                  </div>
                )}
                <div className="space-y-1 mb-2">
                  {catGoals.map((g) => (
                    <div key={g.id} className="flex items-center gap-2 group">
                      <button
                        onClick={() => toggleGoal(cat, g.id)}
                        className="w-4 h-4 rounded border flex items-center justify-center text-xs flex-shrink-0 transition-all"
                        style={g.done ? { background: '#C9A84C', borderColor: '#C9A84C', color: '#1A1714' } : { borderColor: '#3A3530' }}
                      >
                        {g.done && '✓'}
                      </button>
                      <span className={`text-xs flex-1 ${g.done ? 'line-through opacity-30' : ''}`}>{g.text}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-1">
                  <input className="empire-input flex-1 text-xs py-1" placeholder="Add yearly goal…"
                    value={newGoals[cat] ?? ''}
                    onChange={(e) => setNewGoals((p) => ({ ...p, [cat]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && addGoal(cat)} />
                  <button className="btn-gold text-xs px-2" onClick={() => addGoal(cat)}>+</button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
