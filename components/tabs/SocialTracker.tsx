'use client';
import { Card, SectionTitle } from '../ui';
import type { Store } from '@/lib/store';
import { useState } from 'react';

const PLATFORMS = [
  { name: 'TikTok', emoji: '🎵' },
  { name: 'Instagram', emoji: '📸' },
  { name: 'YouTube', emoji: '▶️' },
  { name: 'LinkedIn', emoji: '💼' },
  { name: 'Pinterest', emoji: '📌' },
];

export default function SocialTab({ chiara, joana, shared }: { chiara: Store; joana: Store; shared: Store }) {
  const chiaraFollowers = (chiara.data.followers as Record<string, number>) ?? {};
  const joanaFollowers = (joana.data.followers as Record<string, number>) ?? {};
  const chiaraPosts = (chiara.data.postCount as Record<string, number>) ?? {};
  const joanaPosts = (joana.data.postCount as Record<string, number>) ?? {};
  const growthMethods = (shared.data.growthMethods as string[]) ?? [];
  const storyIdeas = (shared.data.storyIdeas as string[]) ?? [];

  const [newMethod, setNewMethod] = useState('');
  const [newStory, setNewStory] = useState('');

  function setFollowers(store: Store, key: string, platform: string, val: number) {
    store.update(key, { ...(store.data[key] as Record<string, number> ?? {}), [platform]: val });
  }

  function setPosts(store: Store, key: string, platform: string, delta: number) {
    const curr = (store.data[key] as Record<string, number> ?? {})[platform] ?? 0;
    store.update(key, { ...(store.data[key] as Record<string, number> ?? {}), [platform]: Math.max(0, curr + delta) });
  }

  const totalFollowers = PLATFORMS.reduce((sum, p) => sum + (chiaraFollowers[p.name] ?? 0) + (joanaFollowers[p.name] ?? 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Total banner */}
      <div className="card text-center py-6">
        <p className="section-label">Combined Empire Reach</p>
        <p className="font-display text-5xl" style={{ color: '#C9A84C' }}>{totalFollowers.toLocaleString()}</p>
        <p className="text-xs opacity-40 mt-1">of 5,000,000 goal</p>
        <div className="progress-track mt-3 mx-auto" style={{ maxWidth: 300 }}>
          <div className="progress-fill" style={{ width: `${Math.min((totalFollowers / 5_000_000) * 100, 100)}%`, background: '#C9A84C' }} />
        </div>
      </div>

      {/* Follower inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FollowerCard
          name="Chiara"
          color="#C4726A"
          platforms={PLATFORMS}
          followers={chiaraFollowers}
          posts={chiaraPosts}
          onFollowerChange={(p, v) => setFollowers(chiara, 'followers', p, v)}
          onPostChange={(p, d) => setPosts(chiara, 'postCount', p, d)}
        />
        <FollowerCard
          name="Joana"
          color="#7B5EA7"
          platforms={PLATFORMS}
          followers={joanaFollowers}
          posts={joanaPosts}
          onFollowerChange={(p, v) => setFollowers(joana, 'followers', p, v)}
          onPostChange={(p, d) => setPosts(joana, 'postCount', p, d)}
        />
      </div>

      {/* Growth Methods & Story Ideas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <SectionTitle color="gold">Growth Methods 🚀</SectionTitle>
          <div className="space-y-2 mb-3">
            {growthMethods.map((m, i) => (
              <div key={i} className="flex items-center gap-2 group">
                <span className="text-xs opacity-30 w-4">{i + 1}.</span>
                <span className="text-sm flex-1">{m}</span>
                <button onClick={() => shared.update('growthMethods', growthMethods.filter((_, j) => j !== i))} className="opacity-0 group-hover:opacity-50 text-xs">✕</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input className="empire-input flex-1" placeholder="Growth method…" value={newMethod} onChange={(e) => setNewMethod(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && newMethod.trim()) { shared.update('growthMethods', [...growthMethods, newMethod.trim()]); setNewMethod(''); } }} />
            <button className="btn-gold" onClick={() => { if (newMethod.trim()) { shared.update('growthMethods', [...growthMethods, newMethod.trim()]); setNewMethod(''); } }}>+</button>
          </div>
        </Card>
        <Card>
          <SectionTitle color="gold">Story Ideas 📱</SectionTitle>
          <div className="space-y-2 mb-3">
            {storyIdeas.map((s, i) => (
              <div key={i} className="flex items-center gap-2 group rounded p-2" style={{ background: '#C9A84C11' }}>
                <span className="text-sm flex-1">{s}</span>
                <button onClick={() => shared.update('storyIdeas', storyIdeas.filter((_, j) => j !== i))} className="opacity-0 group-hover:opacity-50 text-xs">✕</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input className="empire-input flex-1" placeholder="Story idea…" value={newStory} onChange={(e) => setNewStory(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && newStory.trim()) { shared.update('storyIdeas', [...storyIdeas, newStory.trim()]); setNewStory(''); } }} />
            <button className="btn-gold" onClick={() => { if (newStory.trim()) { shared.update('storyIdeas', [...storyIdeas, newStory.trim()]); setNewStory(''); } }}>+</button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function FollowerCard({ name, color, platforms, followers, posts, onFollowerChange, onPostChange }: {
  name: string; color: string; platforms: typeof PLATFORMS;
  followers: Record<string, number>; posts: Record<string, number>;
  onFollowerChange: (p: string, v: number) => void;
  onPostChange: (p: string, d: number) => void;
}) {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full" style={{ background: color }} />
        <h3 className="font-display text-xl" style={{ color }}>{name}</h3>
      </div>
      <div className="space-y-3">
        {platforms.map((p) => (
          <div key={p.name} className="grid grid-cols-2 gap-2 items-center">
            <span className="text-sm">{p.emoji} {p.name}</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                className="empire-input text-right"
                style={{ color, fontSize: 13 }}
                value={followers[p.name] ?? 0}
                onChange={(e) => onFollowerChange(p.name, Number(e.target.value))}
              />
            </div>
            <span className="text-xs opacity-40 text-right col-start-2">Posts:</span>
            <div className="flex items-center gap-1 justify-end">
              <button className="btn-ghost px-2 py-0.5 text-xs" onClick={() => onPostChange(p.name, -1)}>−</button>
              <span className="text-sm w-8 text-center" style={{ color }}>{posts[p.name] ?? 0}</span>
              <button className="btn-gold px-2 py-0.5 text-xs" style={{ background: `linear-gradient(135deg, ${color}, ${color}aa)` }} onClick={() => onPostChange(p.name, 1)}>+</button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
