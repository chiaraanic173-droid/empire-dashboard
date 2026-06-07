'use client';
import { useState } from 'react';
import { useStore } from '@/lib/store';
import TogetherTab from './tabs/Together';
import PersonalTab from './tabs/Personal';
import ContentTab from './tabs/ContentPlan';
import SocialTab from './tabs/SocialTracker';
import QuarterTab from './tabs/QuarterView';
import BooksTab from './tabs/Books';
import BucketListTab from './tabs/BucketList';
import YearlyVisionTab from './tabs/YearlyVision';
import DailyStructureTab from './tabs/DailyStructure';

const TABS = [
  { id: 'together', label: 'Together', emoji: '👑' },
  { id: 'chiara', label: 'Chiara', emoji: '🌹' },
  { id: 'joana', label: 'Joana', emoji: '🔮' },
  { id: 'content', label: 'Content Plan', emoji: '🎬' },
  { id: 'social', label: 'Social', emoji: '📈' },
  { id: 'quarter', label: 'Quarter', emoji: '📊' },
  { id: 'books', label: 'Books', emoji: '📚' },
  { id: 'bucket', label: 'Bucket List', emoji: '✨' },
  { id: 'vision', label: 'Yearly Vision', emoji: '🌟' },
  { id: 'daily', label: 'Daily Structure', emoji: '⏰' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('together');
  const shared = useStore('shared');
  const chiara = useStore('chiara');
  const joana = useStore('joana');

  // Use whichever store has week nav (all are synced so just use shared for display)
  const { weekLabel, prevWeek, nextWeek, isCurrentWeek, weekOffset } = shared;

  const loading = !shared.loaded || !chiara.loaded || !joana.loaded;

  return (
    <div className="min-h-screen" style={{ background: '#1A1714' }}>
      {/* Header */}
      <header className="sticky top-0 z-50" style={{ background: '#1A1714ee', backdropFilter: 'blur(12px)', borderBottom: '1px solid #2E2A25' }}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Top bar */}
          <div className="flex items-center justify-between py-3">
            <div>
              <h1 className="font-display text-2xl font-light" style={{ color: '#C9A84C' }}>
                Empire Dashboard
              </h1>
              <p className="text-xs opacity-30">Chiara & Joana · Building in silence</p>
            </div>

            {/* Week navigator */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => { shared.prevWeek(); chiara.prevWeek(); joana.prevWeek(); }}
                className="btn-ghost px-3"
              >‹</button>
              <div className="text-center min-w-32">
                <p className="text-xs" style={{ color: isCurrentWeek ? '#C9A84C' : '#FAF7F2' }}>{weekLabel}</p>
                {isCurrentWeek && <p className="text-xs opacity-30">this week</p>}
                {!isCurrentWeek && <p className="text-xs opacity-30">{Math.abs(weekOffset)} week{Math.abs(weekOffset) !== 1 ? 's' : ''} ago</p>}
              </div>
              <button
                onClick={() => { shared.nextWeek(); chiara.nextWeek(); joana.nextWeek(); }}
                className="btn-ghost px-3"
                disabled={isCurrentWeek}
                style={{ opacity: isCurrentWeek ? 0.3 : 1 }}
              >›</button>
            </div>

            {/* Auto-save indicator */}
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#4CAF50' }} />
              <span className="text-xs opacity-30">auto-saving</span>
            </div>
          </div>

          {/* Tab nav */}
          <div className="flex gap-1 overflow-x-auto pb-2 -mx-2 px-2" style={{ scrollbarWidth: 'none' }}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="tab-item flex items-center gap-1.5 flex-shrink-0"
                style={activeTab === tab.id ? {
                  background: '#2A2622',
                  color: tab.id === 'chiara' ? '#C4726A' : tab.id === 'joana' ? '#7B5EA7' : '#C9A84C',
                } : {}}
              >
                <span>{tab.emoji}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="font-display text-4xl mb-3" style={{ color: '#C9A84C' }}>👑</div>
              <p className="text-sm opacity-40">Loading your empire…</p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'together' && <TogetherTab shared={shared} chiara={chiara} joana={joana} />}
            {activeTab === 'chiara' && <PersonalTab store={chiara} name="Chiara" color="#C4726A" />}
            {activeTab === 'joana' && <PersonalTab store={joana} name="Joana" color="#7B5EA7" />}
            {activeTab === 'content' && <ContentTab shared={shared} chiara={chiara} joana={joana} />}
            {activeTab === 'social' && <SocialTab chiara={chiara} joana={joana} shared={shared} />}
            {activeTab === 'quarter' && <QuarterTab shared={shared} />}
            {activeTab === 'books' && <BooksTab shared={shared} />}
            {activeTab === 'bucket' && <BucketListTab shared={shared} />}
            {activeTab === 'vision' && <YearlyVisionTab shared={shared} />}
            {activeTab === 'daily' && <DailyStructureTab />}
          </>
        )}
      </main>

      {/* Gold gradient footer */}
      <div className="fixed bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #C9A84C44, transparent)' }} />
    </div>
  );
}
