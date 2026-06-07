'use client';
import { Card, SectionTitle, ProgressBar } from '../ui';
import type { Store } from '@/lib/store';
import { useState } from 'react';
import { celebrate } from '@/lib/celebrate';

const CATEGORIES = ['Travel ✈️', 'Experience 🌟', 'Career 💼', 'Personal 🌿', 'Health 💪', 'Creative 🎨', 'Financial 💰', 'Together 👯'];
const CAT_COLORS: Record<string, string> = {
  'Travel ✈️': '#C9A84C',
  'Experience 🌟': '#C4726A',
  'Career 💼': '#7B5EA7',
  'Personal 🌿': '#6B9E6A',
  'Health 💪': '#7EA8B0',
  'Creative 🎨': '#B87C4C',
  'Financial 💰': '#C9A84C',
  'Together 👯': '#C4726A',
};

type BucketItem = { id: string; text: string; category: string; done: boolean };

export default function BucketListTab({ shared }: { shared: Store }) {
  const items = (shared.data.bucketList as BucketItem[]) ?? [];
  const [filter, setFilter] = useState('All');
  const [newItem, setNewItem] = useState('');
  const [newCat, setNewCat] = useState(CATEGORIES[0]);

  const filtered = filter === 'All' ? items : items.filter((i) => i.category === filter);
  const done = items.filter((i) => i.done).length;

  function toggle(id: string) {
    const item = items.find((i) => i.id === id);
    if (!item?.done) celebrate(CAT_COLORS[item?.category ?? ''] ?? '#C9A84C');
    shared.update('bucketList', items.map((i) => i.id === id ? { ...i, done: !i.done } : i));
  }

  function addItem() {
    if (!newItem.trim()) return;
    shared.update('bucketList', [...items, { id: Date.now().toString(), text: newItem.trim(), category: newCat, done: false }]);
    setNewItem('');
  }

  function removeItem(id: string) {
    shared.update('bucketList', items.filter((i) => i.id !== id));
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <SectionTitle color="gold">Bucket List</SectionTitle>
          <span className="font-display text-3xl" style={{ color: '#C9A84C' }}>{done}<span className="text-base opacity-40">/{items.length}</span></span>
        </div>
        <ProgressBar value={done} max={Math.max(items.length, 1)} color="#C9A84C" label="Overall completion" />
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {['All', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className="tab-item"
            style={filter === cat ? { background: '#2A2622', color: CAT_COLORS[cat] ?? '#C9A84C' } : {}}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Add */}
      <div className="flex gap-2">
        <select className="empire-input w-auto" value={newCat} onChange={(e) => setNewCat(e.target.value)}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <input
          className="empire-input flex-1"
          placeholder="Add a bucket list item…"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
        />
        <button className="btn-gold" onClick={addItem}>Add ✨</button>
      </div>

      {/* Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((item) => {
          const color = CAT_COLORS[item.category] ?? '#C9A84C';
          return (
            <div
              key={item.id}
              className="group flex items-center gap-3 rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.01]"
              style={{ background: item.done ? `${color}15` : '#211E1A', border: `1px solid ${item.done ? color + '44' : '#2E2A25'}` }}
              onClick={() => toggle(item.id)}
            >
              <div
                className="w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-sm transition-all"
                style={item.done ? { background: color, borderColor: color, color: '#1A1714' } : { borderColor: color + '66' }}
              >
                {item.done ? '✓' : ''}
              </div>
              <div className="flex-1">
                <p className={`text-sm ${item.done ? 'line-through opacity-40' : ''}`}>{item.text}</p>
                <p className="text-xs opacity-30 mt-0.5">{item.category}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                className="opacity-0 group-hover:opacity-30 text-xs hover:opacity-100"
              >✕</button>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-sm opacity-30 italic col-span-2 text-center py-8">No items in this category yet</p>
        )}
      </div>
    </div>
  );
}
