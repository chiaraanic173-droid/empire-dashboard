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
import PapaTab from './tabs/Papa';
import MonthlyTab from './tabs/Monthly';

const TABS = [
  { id: 'together', label: 'Together', emoji: '👑' },
  { id: 'chiara', label: 'Chiara', emoji: '🌹' },
  { id: 'joana', label: 'Joana', emoji: '🔮' },
  { id: 'papa', label: 'Papa', emoji: '👨‍💼' },
  { id: 'content', label: 'Content', emoji: '🎬' },
  { id: 'monthly', label: 'Monthly', emoji: '📅' },
  { id: 'social', label: 'Social', emoji: '📈' },
  { id: 'quarter', label: 'Quarter', emoji: '📊' },
  { id: 'books', label: 'Books', emoji: '📚' },
  { id: 'bucket', label: 'Bucket List', emoji: '✨' },
  { id: 'vision', label: 'Vision', emoji: '🌟' },
  { id: 'daily', label: 'Daily', emoji: '⏰' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabId>('together');
  const shared = useStore('shared');
  const chiara = useStore('chiara');
  const joana = useStore('joana');
  const papa = useStore('papa');

  function navWeek(dir: 'prev' | 'next') {
    if (dir === 'prev') { shared.prevWeek(); chiara.prevWeek(); joana.prevWeek(); papa.prevWeek(); }
    else { shared.nextWeek(); chiara.nextWeek(); joana.nextWeek(); papa.nextWeek(); }
  }

  const { weekLabel, isCurrentWeek, weekOffset } = shared;
  const loading = !shared.loaded || !chiara.loaded || !joana.loaded || !papa.loaded;

  return (
    <div className="min-h-screen" style={{ background: '#FAF6EE' }}>
      <header className="sticky top-0 z-50" style={{ background: '#FAF6EEee', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E8D9B5' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <h1 className="font-display text-2xl font-light" style={{ color: '#C8960C' }}>Empire Dashboard</h1>
              <p className="text-xs" style={{ color: '#A89070' }}>Chiara & Joana · Building in silence</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => navWeek('prev')} className="btn-ghost px-3">‹</button>
              <div className="text-center min-w-36">
                <p className="text-xs" style={{ color: isCurrentWeek ? '#C8960C' : '#2C1A0E' }}>{weekLabel}</p>
                <p className="text-xs" style={{ color: '#A89070' }}>
                  {isCurrentWeek ? 'diese Woche' : weekOffset > 0 ? `in ${weekOffset} Woche${weekOffset !== 1 ? 'n' : ''}` : `vor ${Math.abs(weekOffset)} Woche${Math.abs(weekOffset) !== 1 ? 'n' : ''}`}
                </p>
              </div>
              <button onClick={() => navWeek('next')} className="btn-ghost px-3">›</button>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#4CAF50' }} />
              <span className="text-xs" style={{ color: '#A89070' }}>auto-saving</span>
            </div>
          </div>
          <div className="flex gap-1 overflow-x-auto pb-2 -mx-2 px-2" style={{ scrollbarWidth: 'none' }}>
            {TABS.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="tab-item flex items-center gap-1.5 flex-shrink-0"
                style={activeTab === tab.id ? { background: '#FFF8EC', color: tab.id === 'chiara' ? '#C4726A' : tab.id === 'joana' ? '#7B5EA7' : '#C8960C' } : {}}>
                <span>{tab.emoji}</span><span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="font-display text-4xl mb-3" style={{ color: '#C8960C' }}>👑</div>
              <p className="text-sm" style={{ color: '#A89070' }}>Loading your empire…</p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'together' && <TogetherTab shared={shared} chiara={chiara} joana={joana} />}
            {activeTab === 'chiara' && <PersonalTab store={chiara} name="Chiara" color="#C4726A" />}
            {activeTab === 'joana' && <PersonalTab store={joana} name="Joana" color="#7B5EA7" />}
            {activeTab === 'papa' && <PapaTab papa={papa} />}
            {activeTab === 'content' && <ContentTab shared={shared} chiara={chiara} joana={joana} />}
            {activeTab === 'monthly' && <MonthlyTab shared={shared} chiara={chiara} joana={joana} />}
            {activeTab === 'social' && <SocialTab chiara={chiara} joana={joana} shared={shared} />}
            {activeTab === 'quarter' && <QuarterTab shared={shared} />}
            {activeTab === 'books' && <BooksTab shared={shared} />}
            {activeTab === 'bucket' && <BucketListTab shared={shared} />}
            {activeTab === 'vision' && <YearlyVisionTab shared={shared} />}
            {activeTab === 'daily' && <DailyStructureTab />}
          </>
        )}
      </main>
    </div>
  );
}
