'use client';

export function popSound() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
    setTimeout(() => ctx.close(), 300);
  } catch {}
}

export async function confettiBurst(color?: string) {
  try {
    const confetti = (await import('canvas-confetti')).default;
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: color ? [color, '#C9A84C', '#FAF7F2'] : ['#C9A84C', '#C4726A', '#7B5EA7', '#FAF7F2'],
      scalar: 0.9,
      gravity: 1.2,
    });
  } catch {}
}

export function celebrate(color?: string) {
  popSound();
  confettiBurst(color);
}
