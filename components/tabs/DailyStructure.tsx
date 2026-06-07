'use client';
import { Card, SectionTitle } from '../ui';

type ScheduleItem = { time: string; label: string; who: 'both' | 'chiara' | 'joana'; note?: string };

const SCHEDULE: ScheduleItem[] = [
  { time: '5:30', label: 'Wake up & no phone', who: 'both' },
  { time: '5:35', label: 'Morning meditation / prayer', who: 'both' },
  { time: '6:00', label: 'Workout / gym', who: 'both' },
  { time: '7:00', label: 'Shower & get ready', who: 'both' },
  { time: '7:30', label: 'Healthy breakfast', who: 'both' },
  { time: '8:00', label: 'Morning briefing — plan the day', who: 'both' },
  { time: '8:30', label: 'Content filming / scripting', who: 'chiara', note: 'Chiara films, scripts stories' },
  { time: '8:30', label: 'Video editing & posting', who: 'joana', note: 'Joana edits and schedules' },
  { time: '10:00', label: 'Academy / student check-ins', who: 'both' },
  { time: '10:30', label: 'Deep work — business tasks', who: 'both' },
  { time: '12:00', label: 'Lunch break', who: 'both' },
  { time: '13:00', label: 'Amazon / ecom tasks', who: 'chiara' },
  { time: '13:00', label: 'Analytics review & captions', who: 'joana' },
  { time: '14:30', label: 'Strategy & planning session', who: 'both' },
  { time: '15:00', label: 'Affiliate / outreach work', who: 'both' },
  { time: '16:00', label: 'Content round 2 / stories', who: 'chiara' },
  { time: '16:00', label: 'Reels/TikTok posting round', who: 'joana' },
  { time: '17:00', label: 'Email & admin', who: 'both' },
  { time: '18:00', label: 'Dinner & family time', who: 'both' },
  { time: '19:30', label: 'Evening review & tomorrow plan', who: 'both' },
  { time: '20:00', label: 'Reading / learning', who: 'both' },
  { time: '20:30', label: 'Wind-down routine', who: 'both' },
  { time: '21:00', label: 'Lights out / sleep', who: 'both' },
];

const WHO_STYLES = {
  both: { bg: '#C9A84C15', border: '#C9A84C33', dot: '#C9A84C', label: 'Both' },
  chiara: { bg: '#C4726A15', border: '#C4726A33', dot: '#C4726A', label: 'Chiara' },
  joana: { bg: '#7B5EA715', border: '#7B5EA733', dot: '#7B5EA7', label: 'Joana' },
};

export default function DailyStructureTab() {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card>
        <SectionTitle color="gold">Daily Structure — Our Empire Routine</SectionTitle>

        {/* Legend */}
        <div className="flex gap-4 mb-6">
          {(Object.entries(WHO_STYLES) as [string, typeof WHO_STYLES.both][]).map(([key, style]) => (
            <div key={key} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: style.dot }} />
              <span className="text-xs opacity-60">{style.label}</span>
            </div>
          ))}
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-16 top-0 bottom-0 w-px" style={{ background: 'linear-gradient(to bottom, #C9A84C44, transparent)' }} />

          <div className="space-y-1">
            {SCHEDULE.map((item, i) => {
              const style = WHO_STYLES[item.who];
              return (
                <div key={i} className="flex items-start gap-4 group">
                  {/* Time */}
                  <div className="w-14 text-right flex-shrink-0 pt-3">
                    <span className="text-xs font-mono opacity-40">{item.time}</span>
                  </div>

                  {/* Dot */}
                  <div className="relative flex-shrink-0 pt-3.5">
                    <div className="w-2.5 h-2.5 rounded-full border-2 transition-transform group-hover:scale-125" style={{ background: style.dot + '44', borderColor: style.dot }} />
                  </div>

                  {/* Content */}
                  <div
                    className="flex-1 rounded-lg px-3 py-2 mb-1 transition-all group-hover:translate-x-0.5"
                    style={{ background: style.bg, border: `1px solid ${style.border}` }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{item.label}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: style.dot + '33', color: style.dot, fontSize: 10 }}>
                        {style.label}
                      </span>
                    </div>
                    {item.note && <p className="text-xs opacity-40 mt-0.5">{item.note}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
