'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

type DataMap = Record<string, unknown>;

function getWeekKey(offset = 0): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay() + offset * 7);
  return d.toISOString().split('T')[0];
}

function formatWeekLabel(key: string): string {
  const d = new Date(key + 'T00:00:00');
  const end = new Date(d);
  end.setDate(d.getDate() + 6);
  const fmt = (dt: Date) => dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${fmt(d)} – ${fmt(end)}`;
}

export function useStore(userId: 'chiara' | 'joana' | 'shared') {
  const [data, setData] = useState<DataMap>({});
  const [loaded, setLoaded] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const weekKey = getWeekKey(weekOffset);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSave = useRef<DataMap | null>(null);

  useEffect(() => {
    fetch(`/api/data?userId=${userId}`)
      .then((r) => r.json())
      .then(({ data }) => { setData(data ?? {}); setLoaded(true); })
      .catch(() => setLoaded(true));
  }, [userId]);

  const scheduleSave = useCallback((newData: DataMap) => {
    pendingSave.current = newData;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      if (!pendingSave.current) return;
      try {
        await fetch('/api/data/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, data: pendingSave.current }),
        });
      } catch {}
      pendingSave.current = null;
    }, 2000);
  }, [userId]);

  const update = useCallback(<T>(key: string, value: T) => {
    setData((prev) => {
      const next = { ...prev, [key]: value };
      scheduleSave(next);
      return next;
    });
  }, [scheduleSave]);

  const updateWeekly = useCallback(<T>(key: string, value: T) => {
    setData((prev) => {
      const existing = (prev[key] as Record<string, T>) ?? {};
      const next = { ...prev, [key]: { ...existing, [weekKey]: value } };
      scheduleSave(next);
      return next;
    });
  }, [scheduleSave, weekKey]);

  function getWeekly<T>(key: string, defaultVal: T): T {
    const map = (data[key] as Record<string, T>) ?? {};
    return map[weekKey] ?? defaultVal;
  }

  return {
    data,
    loaded,
    weekKey,
    weekOffset,
    weekLabel: formatWeekLabel(weekKey),
    prevWeek: () => setWeekOffset((o) => o - 1),
    nextWeek: () => setWeekOffset((o) => Math.min(o + 1, 0)),
    isCurrentWeek: weekOffset === 0,
    update,
    updateWeekly,
    getWeekly,
  };
}

export type Store = ReturnType<typeof useStore>;
