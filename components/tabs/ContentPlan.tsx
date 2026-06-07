'use client';
import { Card, SectionTitle, ProgressBar } from '../ui';
import type { Store } from '@/lib/store';
import { useState } from 'react';

const PILLARS = [
  { label: 'Motivation & Mindset', emoji: '🔥', color: '#C9A84C' },
  { label: 'AI & Money', emoji: '🤖', color: '#C9A84C' },
  { label: 'Business & Ecommerce', emoji: '🛍️', color: '#C9A84C' },
];

const PLATFORMS = [
  { label: 'TikTok', target: 7 },
  { label: 'Instagram Reels', target: 5 },
  { label: 'YouTube Shorts', target: 3 },
  { label: 'Stories', target: 14 },
];

type Idea = { id: string; text: string; pillar: string; who: string };

export default function ContentTab({ shared, chiara, joana }: { shared: Store; chiara: Store; joana: Store }) {
  const postCounts = (shared.data.postCounts as Record<string, number>) ?? {};
  const chiaraIdeas = (chiara.data.contentIdeas as Idea[]) ?? [];
  const joanaIdeas = (joana.data.contentIdeas as Idea[]) ?? [];
  const collabIdeas = (shared.data.collabIdeas as Idea[]) ?? [];

  const [newIdea, setNewIdea] = useState('');
  const [ideaWho, setIdeaWho] = useState<'chiara' | 'joana' | 'collab'>('chiara');
  const [ideaPillar, setIdeaPillar] = useState(PILLARS[0].label);

  function addIdea() {
    if (!newIdea.trim()) return;
    const idea: Idea = { id: Date.now().toString(), text: newIdea.trim(), pillar: ideaPillar, who: ideaWho };
    if (ideaWho === 'chiara') chiara.update('contentIdeas', [...chiaraIdeas, idea]);
    else if (ideaWho === 'joana') joana.update('contentIdeas', [...joanaIdeas, idea]);
    else shared.update('collabIdeas', [...collabIdeas, idea]);
    setNewIdea('');
  }

  function setCount(platform: string, val: number) {
    shared.update('postCounts', { ...postCounts, [platform]: Math.max(0, val) });
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Content Pillars */}
      <Card>
        <SectionTitle color="gold">Content Pillars</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PILLARS.map((p) => (
            <div key={p.label} className="rounded-xl p-4" style={{ background: '#2A2118', border: '1px solid #3A3020' }}>
              <div className="text-2xl mb-2">{p.emoji}</div>
              <p className="font-display text-lg" style={{ color: p.color }}>{p.label}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Platform Targets */}
      <Card>
        <SectionTitle color="gold">Weekly Posting Targets</SectionTitle>
        <div className="space-y-4">
          {PLATFORMS.map((p) => {
            const count = postCounts[p.label] ?? 0;
            return (
              <div key={p.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">{p.label}</span>
                  <div className="flex items-center gap-2">
                    <button className="btn-ghost px-2 py-0.5 text-xs" onClick={() => setCount(p.label, count - 1)}>−</button>
                    <span className="font-display text-xl" style={{ color: '#C9A84C' }}>{count}</span>
                    <span className="text-xs opacity-40">/ {p.target}</span>
                    <button className="btn-gold px-2 py-0.5 text-xs" onClick={() => setCount(p.label, count + 1)}>+</button>
                  </div>
                </div>
                <ProgressBar value={count} max={p.target} color="#C9A84C" />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Role Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-rose-500" style={{ background: '#C4726A' }} />
            <h3 className="font-display text-xl" style={{ color: '#C4726A' }}>Chiara's Role</h3>
          </div>
          {['🎬 Filming', '✍️ Scripting', '📱 Stories', '🎯 Strategy'].map((r) => (
            <p key={r} className="text-sm py-1 border-b opacity-70" style={{ borderColor: '#2E2A25' }}>{r}</p>
          ))}
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full" style={{ background: '#7B5EA7' }} />
            <h3 className="font-display text-xl" style={{ color: '#7B5EA7' }}>Joana's Role</h3>
          </div>
          {['✂️ Editing', '📤 Posting', '💬 Captions', '📊 Analytics'].map((r) => (
            <p key={r} className="text-sm py-1 border-b opacity-70" style={{ borderColor: '#2E2A25' }}>{r}</p>
          ))}
        </Card>
      </div>

      {/* Add Content Idea */}
      <Card>
        <SectionTitle color="gold">Content Idea Pipeline</SectionTitle>
        <div className="flex flex-wrap gap-2 mb-4">
          <select
            className="empire-input w-auto"
            value={ideaWho}
            onChange={(e) => setIdeaWho(e.target.value as 'chiara' | 'joana' | 'collab')}
          >
            <option value="chiara">Chiara</option>
            <option value="joana">Joana</option>
            <option value="collab">Collab</option>
          </select>
          <select
            className="empire-input w-auto"
            value={ideaPillar}
            onChange={(e) => setIdeaPillar(e.target.value)}
          >
            {PILLARS.map((p) => <option key={p.label}>{p.label}</option>)}
          </select>
          <input
            className="empire-input flex-1"
            placeholder="Content idea…"
            value={newIdea}
            onChange={(e) => setNewIdea(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addIdea()}
          />
          <button className="btn-gold" onClick={addIdea}>Add</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <IdeaColumn title="Chiara" color="#C4726A" ideas={chiaraIdeas} onRemove={(id) => chiara.update('contentIdeas', chiaraIdeas.filter((i) => i.id !== id))} />
          <IdeaColumn title="Joana" color="#7B5EA7" ideas={joanaIdeas} onRemove={(id) => joana.update('contentIdeas', joanaIdeas.filter((i) => i.id !== id))} />
          <IdeaColumn title="Collab ✨" color="#C9A84C" ideas={collabIdeas} onRemove={(id) => shared.update('collabIdeas', collabIdeas.filter((i) => i.id !== id))} />
        </div>
      </Card>
    </div>
  );
}

function IdeaColumn({ title, color, ideas, onRemove }: { title: string; color: string; ideas: { id: string; text: string; pillar: string }[]; onRemove: (id: string) => void }) {
  return (
    <div>
      <p className="section-label mb-2" style={{ color }}>{title}</p>
      <div className="space-y-2">
        {ideas.map((idea) => (
          <div key={idea.id} className="group flex items-start gap-2 rounded-lg p-2" style={{ background: `${color}11`, border: `1px solid ${color}22` }}>
            <p className="text-xs flex-1">{idea.text}</p>
            <button onClick={() => onRemove(idea.id)} className="opacity-0 group-hover:opacity-50 text-xs">✕</button>
          </div>
        ))}
        {ideas.length === 0 && <p className="text-xs opacity-30 italic">No ideas yet</p>}
      </div>
    </div>
  );
}
