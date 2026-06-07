import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Empire Dashboard — Chiara & Joana',
  description: 'Our shared empire command center',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
