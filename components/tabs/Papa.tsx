'use client';
import { Card, SectionTitle, TaskList } from '../ui';
import type { Store } from '@/lib/store';

type Task = { id: string; text: string; done: boolean };

export default function PapaTab({ papa }: { papa: Store }) {
  const tasks = papa.getWeekly<Task[]>('tasks', [] as Task[]);
  const chiaraTasks = papa.getWeekly<Task[]>('chiaraTasks', [] as Task[]);
  const joanaTasks = papa.getWeekly<Task[]>('joanaTasks', [] as Task[]);
  const notes = papa.getWeekly<string>('notes', '');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative overflow-hidden rounded-xl p-6" style={{ background: 'linear-gradient(135deg, #FFFDF7, #FFF8EC)', border: '1px solid #E8D9B5' }}>
        <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, #C8960C, #F0C040, #C8960C)' }} />
        <p className="section-label" style={{ color: '#C8960C' }}>Manager</p>
        <h2 className="font-display text-3xl" style={{ color: '#C8960C' }}>Papa's Dashboard 👑</h2>
        <p className="text-xs mt-1" style={{ color: '#A89070' }}>Tasks, updates und alles was du von uns brauchst</p>
      </div>
      <Card>
        <SectionTitle color="gold">Meine Tasks diese Woche</SectionTitle>
        <TaskList tasks={tasks} onChange={(t) => papa.updateWeekly('tasks', t)} color="#C8960C" placeholder="Task hinzufügen…" />
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full" style={{ background: '#C4726A' }} />
            <h3 className="font-display text-xl" style={{ color: '#C4726A' }}>Von Chiara</h3>
          </div>
          <TaskList tasks={chiaraTasks} onChange={(t) => papa.updateWeekly('chiaraTasks', t)} color="#C4726A" placeholder="Task für Papa von Chiara…" />
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full" style={{ background: '#7B5EA7' }} />
            <h3 className="font-display text-xl" style={{ color: '#7B5EA7' }}>Von Joana</h3>
          </div>
          <TaskList tasks={joanaTasks} onChange={(t) => papa.updateWeekly('joanaTasks', t)} color="#7B5EA7" placeholder="Task für Papa von Joana…" />
        </Card>
      </div>
      <Card>
        <SectionTitle color="gold">Notizen / Updates</SectionTitle>
        <textarea className="empire-textarea" style={{ minHeight: 100, borderColor: '#E8D9B5' }} placeholder="Notizen, Updates, Fragen…" value={notes} onChange={(e) => papa.updateWeekly('notes', e.target.value)} />
      </Card>
    </div>
  );
}
